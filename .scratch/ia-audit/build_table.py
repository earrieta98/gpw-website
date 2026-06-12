# Build the deterministic columns of the master inventory table from data.json
import os, json
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
d = json.load(open(os.path.join(ROOT, ".scratch/ia-audit/data.json"), encoding="utf-8"))
rows = {r["file"]: r for r in d["rows"]}
inb = d["inbound_detail"]

# redirect map: source url -> (dest, line)
red_by_srcfile = {}
for r in d["redirect_source_files"]:
    if r["src_file_exists"]:
        red_by_srcfile[r["src_file_exists"]] = (r["dest"], r["rule_line"])

# which redirected_links target each file's url (incoming-from-live pointing at redirect of this)
# compute outgoing-redirect per source already in redirected_links
def live_sources(f):
    return sorted({x["source"] for x in inb.get(f, []) if x["live"] and x["source"] != f})

order = (d["files_by_class"]["site-page"] + d["files_by_class"]["error-page"]
         + d["files_by_class"]["php-backend"] + d["files_by_class"]["dev-artifact"]
         + d["files_by_class"]["test"])

def status_label(r):
    f = r["file"]
    if r["class"] == "dev-artifact": return "Dev-Preview"
    if r["class"] == "php-backend": return "Backend (PHP)"
    if r["class"] == "test": return "Test harness"
    if r["class"] == "error-page": return "Error page (404)"
    if r["self_redirects"]:
        return "Redirected (file still exists)"
    if r["inbound_live"] == 0:
        return "Live + ORPHAN"
    return "Live + Linked"

lines = []
lines.append("| # | File | Public URL | Status | Hdr nav | Footer | In-links (live) | From (sample) | .htaccess redirect | Sitemap | Robots block | Breadcrumb→reach |")
lines.append("|---|------|-----------|--------|:---:|:---:|:---:|------|------|:---:|:---:|------|")
for i, f in enumerate(order, 1):
    r = rows[f]
    url = r["url"]
    st = status_label(r)
    nav = "Y" if r["in_nav"] else "—"
    foot = "Y" if r["in_footer"] else "—"
    incnt = r["inbound_live"]
    srcs = live_sources(f)
    src_sample = ", ".join(s.replace("/index.html","/").replace(".html","") for s in srcs[:3])
    if len(srcs) > 3: src_sample += f" +{len(srcs)-3}"
    if not src_sample: src_sample = "—"
    # redirect
    if f in red_by_srcfile:
        dest, ln = red_by_srcfile[f]
        rd = f"OUT 301→{dest} (L{ln})"
    elif r["self_redirects"]:
        ch = r["self_redirects"][-1]
        rd = f"OUT 301→{ch['to']}"
    else:
        rd = "—"
    smap = "Y" if r["in_sitemap"] else "—"
    rob = "Y" if r["robots_blocked"] else "—"
    # breadcrumb reach: any unreachable level?
    bc_issue = "—"
    for bi in d["breadcrumb_issues"]:
        if bi["page"] == f:
            bc_issue = f"❌ '{bi['level_label']}'→{bi['level_url']} not in menu"
            break
    else:
        if r["breadcrumb"]:
            bc_issue = "ok"
    lines.append(f"| {i} | {f} | {url} | {st} | {nav} | {foot} | {incnt} | {src_sample} | {rd} | {smap} | {rob} | {bc_issue} |")

out = os.path.join(ROOT, ".scratch/ia-audit/master_table.md")
open(out, "w", encoding="utf-8").write("\n".join(lines))
print("\n".join(lines))
print("\nWrote", out)
