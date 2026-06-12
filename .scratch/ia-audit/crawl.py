#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GPW IA Audit crawler — deterministic ground-truth builder.
Read-only. Produces .scratch/ia-audit/data.json with the full inventory,
inbound/outbound link graph, redirect map, breadcrumb extraction, nav/footer
reachability, sitemap/robots cross-reference, broken & redirected-link detection.
"""
import os, re, json, posixpath
from html import unescape

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # 05-website
# (this file is at 05-website/.scratch/ia-audit/crawl.py)

def rel(p):
    return os.path.relpath(p, ROOT).replace("\\", "/")

# ---------------------------------------------------------------- enumerate files
all_pages = []          # site pages (.html/.php) excluding .scratch
for dirpath, dirnames, filenames in os.walk(ROOT):
    if (os.sep + ".scratch") in dirpath or dirpath.endswith(".scratch"):
        continue
    if (os.sep + ".git") in dirpath:
        continue
    for fn in filenames:
        if fn.endswith(".html") or fn.endswith(".php"):
            all_pages.append(rel(os.path.join(dirpath, fn)))
all_pages = sorted(set(all_pages))

# existence set of every file (for broken-link detection, incl. non-html assets)
all_files = set()
for dirpath, dirnames, filenames in os.walk(ROOT):
    if (os.sep + ".scratch") in dirpath or (os.sep + ".git") in dirpath:
        continue
    for fn in filenames:
        all_files.add(rel(os.path.join(dirpath, fn)))

DEV_ARTIFACTS = {
    "nav-preview.html", "refresh-preview.html", "refresh-preview-cm.html",
    "screenshot-review.html",
}
TEST_FILES = {"tests/run-tests.php"}
PHP_BACKEND = {"ems/process-rfq.php", "request-a-quote/process-rfq.php",
               "request-a-quote/rfq-lib.php"}

def classify_file(p):
    if p in DEV_ARTIFACTS: return "dev-artifact"
    if p in TEST_FILES: return "test"
    if p in PHP_BACKEND: return "php-backend"
    if p == "404.html": return "error-page"
    # files whose URL is 404'd by a RedirectMatch (e.g. /quality/ held offline) are
    # not live site-pages — exclude from orphan/sitemap checks. (REDIRECT_404_RES below)
    if any(rx.search(file_to_url(p)) for rx in REDIRECT_404_RES): return "offline"
    return "site-page"

# ---------------------------------------------------------------- url <-> file
def file_to_url(p):
    """canonical public URL path (leading slash) for a file path."""
    if p == "index.html": return "/"
    if p.endswith("/index.html"): return "/" + p[:-len("index.html")]
    return "/" + p

def url_to_file(urlpath):
    """resolve a site URL path (leading slash, no query/anchor) to a file path or None.
    returns (file_or_None, normalized_urlpath)."""
    u = urlpath
    if not u.startswith("/"): u = "/" + u
    # strip leading slash for fs
    body = u[1:]
    if body == "" :
        return ("index.html", "/")
    if body.endswith("/"):
        cand = body + "index.html"
        return (cand if cand in all_files else None, u)
    # has something after last slash
    if body.endswith(".html") or body.endswith(".php"):
        return (body if body in all_files else None, u)
    # extension-less, no trailing slash: try as file, as dir
    if body in all_files:
        return (body, u)
    if (body + "/index.html") in all_files:
        return (body + "/index.html", u + "/")
    # other asset (img, css, js, pdf...) extension?
    if "." in posixpath.basename(body):
        return (body if body in all_files else None, u)
    return (None, u)

# ---------------------------------------------------------------- .htaccess parse
htaccess = open(os.path.join(ROOT, ".htaccess"), encoding="utf-8").read()
redirect_rules = []   # list of dict(pattern, raw_pattern, dest, code, line)
for m in re.finditer(r'^RewriteRule\s+(\S+)\s+(\S+)\s+\[([^\]]*)\]', htaccess, re.M):
    pat, dest, flags = m.group(1), m.group(2), m.group(3)
    code = None
    cm = re.search(r'R=(\d+)', flags)
    if cm: code = int(cm.group(1))
    elif "R" in flags.split(","): code = 302
    # skip the global HTTPS-force and www rules (pattern ^(.*)$) for internal-link analysis
    is_global = pat == r'^(.*)$'
    redirect_rules.append({
        "pattern": pat, "dest": dest, "flags": flags, "code": code,
        "is_global": is_global,
        "line": htaccess[:m.start()].count("\n") + 1,
    })

content_rules = [r for r in redirect_rules if not r["is_global"]]

# RedirectMatch 404 patterns (e.g. ^/tests/, ^/quality/ held offline pre-launch).
# Matched against the URL path (leading slash). Files whose URL matches are 404'd.
REDIRECT_404_RES = [re.compile(pat) for pat in
                    re.findall(r'^\s*RedirectMatch\s+404\s+(\S+)', htaccess, re.M)]

def apply_redirects(urlpath, max_hops=6):
    """emulate .htaccess content RewriteRules on a URL path; return chain list.
    Each hop: dict(from, to, code, rule_line). Stops when no rule matches."""
    chain = []
    cur = urlpath
    seen = set()
    for _ in range(max_hops):
        body = cur[1:] if cur.startswith("/") else cur
        matched = None
        for r in content_rules:
            if re.search(r["pattern"], body):
                matched = r
                break
        if not matched:
            break
        # build destination by substituting backrefs
        body_after = re.sub(matched["pattern"], matched["dest"], body, count=1) \
            if not matched["dest"].startswith("/") else _subst_dest(matched, body)
        dest = body_after
        if not dest.startswith("/"):
            dest = "/" + dest
        chain.append({"from": cur, "to": dest, "code": matched["code"],
                      "rule_line": matched["line"], "pattern": matched["pattern"]})
        if dest in seen:
            chain[-1]["loop"] = True
            break
        seen.add(dest)
        cur = dest
    return chain

def _subst_dest(rule, body):
    # destination is absolute path like /industries/foo/ possibly with $1
    dest = rule["dest"]
    mm = re.search(rule["pattern"], body)
    def repl(g):
        idx = int(g.group(0)[1:])
        try: return mm.group(idx) or ""
        except Exception: return ""
    dest = re.sub(r'\$(\d+)', repl, dest)
    return dest

# precompute: which source URL paths do the content rules redirect (their canonical "source URL")
# We'll detect, for any internal link target, whether applying rules changes it.

# ---------------------------------------------------------------- href extraction
A_RE = re.compile(r'<a\b[^>]*?\shref\s*=\s*"([^"]*)"', re.I)
HEADER_RE = re.compile(r'<header\b.*?</header>', re.I | re.S)
FOOTER_RE = re.compile(r'<footer\b.*?</footer>', re.I | re.S)
BREADCRUMB_RE = re.compile(r'<nav\b[^>]*class="[^"]*breadcrumb[^"]*"[^>]*>(.*?)</nav>', re.I | re.S)
BC_ITEM_RE = re.compile(r'<a\b[^>]*\shref\s*=\s*"([^"]*)"[^>]*>(.*?)</a>'
                        r'|<span\b[^>]*class="[^"]*breadcrumb__current[^"]*"[^>]*>(.*?)</span>', re.I | re.S)
TITLE_RE = re.compile(r'<title>(.*?)</title>', re.I | re.S)
H1_RE = re.compile(r'<h1\b[^>]*>(.*?)</h1>', re.I | re.S)

def strip_tags(s):
    return unescape(re.sub(r'<[^>]+>', '', s)).strip()

def resolve_href(href, page_file):
    """resolve an href (as written on page_file) to a normalized site URL path.
    returns dict(kind, urlpath?, ext_url?, raw)."""
    raw = href.strip()
    h = unescape(raw)
    if h == "" or h.startswith("#"):
        return {"kind": "anchor", "raw": raw}
    low = h.lower()
    if low.startswith("mailto:"): return {"kind": "mailto", "raw": raw}
    if low.startswith("tel:"): return {"kind": "tel", "raw": raw}
    if low.startswith("javascript:"): return {"kind": "js", "raw": raw}
    # external or absolute-with-host
    m = re.match(r'^https?://([^/]+)(/.*)?$', h, re.I)
    if m:
        host = m.group(1).lower()
        path = m.group(2) or "/"
        if "gpw-solutions.com" in host:
            # internal absolute
            path = path.split("#")[0].split("?")[0]
            return {"kind": "internal", "urlpath": _norm(path), "raw": raw, "abs_host": host}
        return {"kind": "external", "ext_url": h, "raw": raw}
    if low.startswith("//"):
        return {"kind": "external", "ext_url": h, "raw": raw}
    # strip anchor/query
    core = h.split("#")[0].split("?")[0]
    if core == "":
        return {"kind": "anchor", "raw": raw}
    if core.startswith("/"):
        return {"kind": "internal", "urlpath": _norm(core), "raw": raw}
    # relative to page dir
    page_dir = posixpath.dirname("/" + page_file)  # leading slash
    joined = posixpath.normpath(posixpath.join(page_dir, core))
    # preserve trailing slash
    if core.endswith("/") and not joined.endswith("/"):
        joined += "/"
    if not joined.startswith("/"):
        joined = "/" + joined
    return {"kind": "internal", "urlpath": joined, "raw": raw}

def _norm(p):
    if not p.startswith("/"): p = "/" + p
    # normalize but keep trailing slash
    trail = p.endswith("/") and p != "/"
    n = posixpath.normpath(p)
    if trail and not n.endswith("/"):
        n += "/"
    return n

# ---------------------------------------------------------------- read pages
pages = {}
for p in all_pages:
    txt = open(os.path.join(ROOT, p), encoding="utf-8", errors="replace").read()
    pages[p] = txt

# nav + footer target sets (union across pages, resolved to canonical file URLs when possible)
def extract_region_links(txt, region_re, page_file):
    m = region_re.search(txt)
    targets = []
    if not m: return targets
    for href in A_RE.findall(m.group(0)):
        r = resolve_href(href, page_file)
        if r["kind"] == "internal":
            targets.append(r["urlpath"])
    return targets

# Build per-page data
page_data = {}
inbound = {p: [] for p in all_pages}   # file -> list of (source_file, raw_href, resolved_urlpath)
# also track inbound by canonical url to handle dir/index equivalence
nav_url_set = set()
footer_url_set = set()

for p in all_pages:
    txt = pages[p]
    cls = classify_file(p)
    # all anchors
    hrefs = A_RE.findall(txt)
    out_internal = []
    out_external = []
    for href in hrefs:
        r = resolve_href(href, p)
        if r["kind"] == "internal":
            out_internal.append(r)
        elif r["kind"] == "external":
            out_external.append(r["ext_url"])
    # header/footer/breadcrumb
    header_links = extract_region_links(txt, HEADER_RE, p)
    footer_links = extract_region_links(txt, FOOTER_RE, p)
    # breadcrumb
    bc = []
    bm = BREADCRUMB_RE.search(txt)
    if bm:
        inner = bm.group(1)
        for im in BC_ITEM_RE.finditer(inner):
            if im.group(1) is not None:
                href = im.group(1); label = strip_tags(im.group(2))
                rr = resolve_href(href, p)
                bc.append({"label": label, "href": href,
                           "urlpath": rr.get("urlpath"), "kind": "link"})
            elif im.group(3) is not None:
                bc.append({"label": strip_tags(im.group(3)), "kind": "current"})
    title = strip_tags(TITLE_RE.search(txt).group(1)) if TITLE_RE.search(txt) else ""
    h1m = H1_RE.search(txt)
    h1 = strip_tags(h1m.group(1)) if h1m else ""

    page_data[p] = {
        "file": p, "url": file_to_url(p), "class": cls,
        "title": title, "h1": h1,
        "out_internal": out_internal, "out_external": sorted(set(out_external)),
        "header_links": header_links, "footer_links": footer_links,
        "breadcrumb": bc,
    }
    if cls == "site-page":
        nav_url_set.update(header_links)
        footer_url_set.update(footer_links)

# canonicalize a urlpath to the file it points to (for inbound graph + reachability)
def canon_url(urlpath):
    f, norm = url_to_file(urlpath)
    if f is not None:
        return file_to_url(f)   # canonical url of the file
    return norm  # unresolved (maybe redirect source or 404)

# Build inbound graph from site-pages + error page (exclude dev artifacts as sources? keep but tag)
LIVE_SOURCE_CLASSES = {"site-page"}
for p in all_pages:
    pd = page_data[p]
    src_is_live = pd["class"] in LIVE_SOURCE_CLASSES
    for r in pd["out_internal"]:
        f, norm = url_to_file(r["urlpath"])
        if f is not None and f in inbound:
            inbound[f].append({
                "source": p, "source_class": pd["class"],
                "raw": r["raw"], "urlpath": r["urlpath"], "live": src_is_live
            })

# nav/footer reachability per file (does any nav/footer link resolve to this file)
nav_files = set()
for u in nav_url_set:
    f, _ = url_to_file(u)
    if f: nav_files.add(f)
footer_files = set()
for u in footer_url_set:
    f, _ = url_to_file(u)
    if f: footer_files.add(f)

# sitemap parse
sitemap_txt = open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read()
sitemap_urls = re.findall(r'<loc>\s*(.*?)\s*</loc>', sitemap_txt)
sitemap_paths = set()
for u in sitemap_urls:
    pm = re.match(r'^https?://[^/]+(/.*)?$', u)
    sitemap_paths.add(pm.group(1) if pm and pm.group(1) else "/")
sitemap_files = {}
for sp in sitemap_paths:
    f, _ = url_to_file(sp)
    sitemap_files[sp] = f

# robots disallow
robots_txt = open(os.path.join(ROOT, "robots.txt"), encoding="utf-8").read()
robots_disallow = re.findall(r'^\s*Disallow:\s*(\S+)', robots_txt, re.M)
robots_disallow = [d for d in robots_disallow if d != "/"]  # the global-block ones are per-UA training crawlers

# ---------------------------------------------------------------- compute findings
# redirect sources whose file still exists
redirect_source_files = []
for r in content_rules:
    # try to recover a representative source path from the pattern
    src_guess = r["pattern"].lstrip("^").rstrip("$")
    src_guess = src_guess.replace(r"\.", ".")
    src_guess = re.sub(r'\(index\\?\.html\)\?', '', src_guess)
    src_guess = re.sub(r'\(\.\+\)|\(\.\*\)|\?', '', src_guess)
    src_path = "/" + src_guess
    f, _ = url_to_file(src_path)
    redirect_source_files.append({
        "rule_line": r["line"], "pattern": r["pattern"], "dest": r["dest"],
        "code": r["code"], "src_guess_url": src_path,
        "src_file_exists": f, })

# broken internal links + links-to-redirected
broken_links = []
redirected_links = []   # internal links whose target 301s (should point to final)
for p in all_pages:
    pd = page_data[p]
    if pd["class"] not in ("site-page", "error-page"):
        continue
    for r in pd["out_internal"]:
        up = r["urlpath"]
        f, norm = url_to_file(up)
        chain = apply_redirects(norm)
        if chain:
            final = chain[-1]["to"]
            redirected_links.append({
                "source": p, "raw": r["raw"], "target": up,
                "redirect_to": final, "hops": len(chain),
                "chain": chain,
            })
        elif f is None:
            # not a redirect and file doesn't exist -> broken (ignore pure assets that exist check already)
            broken_links.append({"source": p, "raw": r["raw"], "target": up})

# orphans: site-pages with 0 inbound from LIVE sources, excluding the page linking to itself
orphans = []
for p in all_pages:
    if page_data[p]["class"] != "site-page":
        continue
    live_in = [x for x in inbound[p] if x["live"] and x["source"] != p]
    if len(live_in) == 0:
        orphans.append(p)

# breadcrumb reachability: for each page, for each intermediate breadcrumb link, is its target file in nav or footer?
breadcrumb_issues = []
for p in all_pages:
    bc = page_data[p]["breadcrumb"]
    if not bc: continue
    for lvl in bc:
        if lvl.get("kind") != "link": continue
        up = lvl.get("urlpath")
        if not up: continue
        f, _ = url_to_file(up)
        in_nav = f in nav_files if f else False
        in_footer = f in footer_files if f else False
        # home (/) is always reachable via logo
        is_home = (f == "index.html")
        reachable = in_nav or in_footer or is_home
        if not reachable:
            breadcrumb_issues.append({
                "page": p, "level_label": lvl["label"], "level_url": up,
                "level_file": f, "in_nav": in_nav, "in_footer": in_footer
            })

# sitemap cross-ref: sitemap urls that redirect or 404; live pages missing from sitemap
sitemap_problems = []
for sp in sorted(sitemap_paths):
    chain = apply_redirects(sp)
    f, _ = url_to_file(sp)
    status = "ok"
    if chain: status = "redirects"
    elif f is None: status = "404"
    if status != "ok":
        sitemap_problems.append({"url": sp, "status": status,
                                 "redirect_to": chain[-1]["to"] if chain else None})
site_page_urls = {page_data[p]["url"] for p in all_pages if page_data[p]["class"] == "site-page"}
missing_from_sitemap = sorted(site_page_urls - sitemap_paths)
# also note sitemap-listed that map to a file
extra_in_sitemap = sorted(sitemap_paths - site_page_urls)

# ---------------------------------------------------------------- assemble per-page master rows
rows = []
for p in all_pages:
    pd = page_data[p]
    f = p
    url = pd["url"]
    live_in = [x for x in inbound[p] if x["live"] and x["source"] != p]
    any_in = [x for x in inbound[p] if x["source"] != p]
    in_nav = f in nav_files
    in_footer = f in footer_files
    # redirect entrante (este archivo es destino de un redirect)
    is_redirect_target = False
    is_redirect_source = False
    rt_lines = []
    for r in content_rules:
        if r["dest"].rstrip("/") .endswith(url.rstrip("/")) and url != "/":
            is_redirect_target = True; rt_lines.append(r["line"])
    # is this file's url a redirect source?
    chain_self = apply_redirects(url)
    if chain_self:
        is_redirect_source = True
    rows.append({
        "file": f, "url": url, "class": pd["class"],
        "title": pd["title"], "h1": pd["h1"],
        "inbound_live": len(live_in),
        "inbound_live_sources": sorted({x["source"] for x in live_in}),
        "inbound_any": len(any_in),
        "in_nav": in_nav, "in_footer": in_footer,
        "in_sitemap": url in sitemap_paths,
        "robots_blocked": any(url == d or url.rstrip('/')==d.rstrip('/') for d in robots_disallow),
        "self_redirects": chain_self,
        "is_redirect_target_guess": is_redirect_target,
        "breadcrumb": pd["breadcrumb"],
        "out_internal_count": len(pd["out_internal"]),
    })

out = {
    "root": ROOT,
    "counts": {
        "all_pages": len(all_pages),
        "site_pages": sum(1 for p in all_pages if page_data[p]["class"]=="site-page"),
        "dev_artifacts": sum(1 for p in all_pages if page_data[p]["class"]=="dev-artifact"),
        "php_backend": sum(1 for p in all_pages if page_data[p]["class"]=="php-backend"),
        "test": sum(1 for p in all_pages if page_data[p]["class"]=="test"),
        "error_page": sum(1 for p in all_pages if page_data[p]["class"]=="error-page"),
        "offline": sum(1 for p in all_pages if page_data[p]["class"]=="offline"),
    },
    "files_by_class": {
        c: sorted(p for p in all_pages if page_data[p]["class"]==c)
        for c in ["site-page","dev-artifact","php-backend","test","error-page","offline"]
    },
    "rows": rows,
    "redirect_rules_content": content_rules,
    "redirect_rules_global": [r for r in redirect_rules if r["is_global"]],
    "redirect_source_files": redirect_source_files,
    "orphans": orphans,
    "broken_links": broken_links,
    "redirected_links": redirected_links,
    "breadcrumb_issues": breadcrumb_issues,
    "nav_files": sorted(nav_files),
    "footer_files": sorted(footer_files),
    "nav_url_set": sorted(nav_url_set),
    "footer_url_set": sorted(footer_url_set),
    "sitemap_paths": sorted(sitemap_paths),
    "sitemap_problems": sitemap_problems,
    "missing_from_sitemap": missing_from_sitemap,
    "extra_in_sitemap": extra_in_sitemap,
    "robots_disallow": robots_disallow,
    "inbound_detail": {p: inbound[p] for p in all_pages},
}

with open(os.path.join(ROOT, ".scratch/ia-audit/data.json"), "w", encoding="utf-8") as fh:
    json.dump(out, fh, indent=2, ensure_ascii=False)

# ---------------------------------------------------------------- console summary
print("FILES:", out["counts"])
print()
print("=== SITE PAGES (%d) ===" % out["counts"]["site_pages"])
for p in out["files_by_class"]["site-page"]:
    r = next(x for x in rows if x["file"]==p)
    flags = []
    if r["in_nav"]: flags.append("NAV")
    if r["in_footer"]: flags.append("FOOT")
    if r["in_sitemap"]: flags.append("SMAP")
    if r["self_redirects"]: flags.append("REDIR-SRC!")
    print(f"  {p:55s} in={r['inbound_live']:2d}  {','.join(flags)}")
print()
print("=== DEV ARTIFACTS ===");  [print("  ", x) for x in out["files_by_class"]["dev-artifact"]]
print("=== PHP BACKEND ===");    [print("  ", x) for x in out["files_by_class"]["php-backend"]]
print("=== TEST ===");          [print("  ", x) for x in out["files_by_class"]["test"]]
print("=== OFFLINE (RedirectMatch 404; kept in repo, not live) ===")
[print("  ", x) for x in out["files_by_class"]["offline"]]
print()
print("=== ORPHANS (0 live inbound) ===")
for p in orphans: print("  ", p)
print()
print("=== BROKEN INTERNAL LINKS ===")
for b in broken_links: print(f"  {b['source']:50s} -> {b['raw']}  (={b['target']})")
print()
print("=== LINKS TO REDIRECTED URLS (should point to final) ===")
for b in redirected_links:
    print(f"  {b['source']:50s} -> {b['raw']}  301->{b['redirect_to']} ({b['hops']} hop)")
print()
print("=== BREADCRUMB UNREACHABLE LEVELS ===")
for b in breadcrumb_issues:
    print(f"  {b['page']:50s} level '{b['level_label']}' -> {b['level_url']}  nav={b['in_nav']} foot={b['in_footer']}")
print()
print("=== SITEMAP PROBLEMS ===")
for s in sitemap_problems: print("  ", s)
print("=== MISSING FROM SITEMAP (live site-pages) ===")
for s in missing_from_sitemap: print("  ", s)
print("=== EXTRA IN SITEMAP (not a live site-page url) ===")
for s in extra_in_sitemap: print("  ", s)
print()
print("=== REDIRECT SOURCES WHOSE FILE STILL EXISTS ===")
for r in redirect_source_files:
    if r["src_file_exists"]:
        print(f"  line {r['rule_line']}: {r['src_guess_url']}  FILE EXISTS: {r['src_file_exists']}  -> {r['dest']}")
print()
print("Wrote .scratch/ia-audit/data.json")
