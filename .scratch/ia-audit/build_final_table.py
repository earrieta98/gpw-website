# -*- coding: utf-8 -*-
# Merge deterministic columns (data.json) with workflow purpose/action -> final master table markdown.
import os, json
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
d = json.load(open(os.path.join(ROOT, ".scratch/ia-audit/data.json"), encoding="utf-8"))
rec = json.load(open(os.path.join(ROOT, ".scratch/ia-audit/reconcile.json"), encoding="utf-8"))
rows = {r["file"]: r for r in d["rows"]}
inb = d["inbound_detail"]
no_footer = set(rec["no_footer"])

# purpose/action/status from the workflow (file -> dict)
PA = {
 "index.html": ("Corporate homepage / umbrella hub for both divisions", "KEEP"),
 "about.html": ("Unified company About page", "KEEP + fix inbound EMS links"),
 "contact.html": ("Unified contact page + form", "KEEP"),
 "privacy-policy.html": ("Legal — privacy policy", "KEEP"),
 "terms.html": ("Legal — terms of service", "KEEP"),
 "quality/index.html": ("Cross-division Quality / inspection page", "KEEP"),
 "request-a-quote/index.html": ("Unified RFQ — primary conversion", "KEEP"),
 "blog/index.html": ("Blog / Insights hub", "KEEP (consider nav/footer promotion)"),
 "blog/cnc-cost-mexico-vs-us-2026/index.html": ("Cost-study article (MX vs US CNC 2026)", "KEEP"),
 "404.html": ("Error page (recovery menu)", "KEEP (update links after deletions)"),
 "contract-manufacturing/index.html": ("CNC division hub", "KEEP"),
 "contract-manufacturing/cnc-milling/index.html": ("CNC milling service page", "FIX-LINKS (6 industry pills → redirected spokes)"),
 "contract-manufacturing/cnc-turning/index.html": ("CNC turning service page", "FIX-LINKS (6 industry pills)"),
 "contract-manufacturing/wire-edm/index.html": ("Wire EDM service page", "FIX-LINKS (6 industry pills)"),
 "contract-manufacturing/sheet-metal/index.html": ("Sheet-metal fabrication service page", "FIX-LINKS (6 industry pills)"),
 "contract-manufacturing/surface-finishing/index.html": ("Surface-finishing service page", "FIX-LINKS (6 industry pills)"),
 "contract-manufacturing/engineering-support/index.html": ("Engineering Support / free DFM (most-linked CM page)", "FIX-LINKS (6 industry pills)"),
 "contract-manufacturing/metals/index.html": ("Materials reference — metals", "KEEP + add to footer (absent from all footers)"),
 "contract-manufacturing/plastics/index.html": ("Materials reference — plastics", "KEEP + add to footer (absent from all footers)"),
 "contract-manufacturing/why-mexico/index.html": ("Nearshore cost/proximity proof page", "KEEP (decide canonical URL — see Decisions)"),
 "contract-manufacturing/aerospace-defense/index.html": ("Standalone aerospace CNC deep-dive (built, then 301'd)", "DECISION: delete-or-restore (see D-1)"),
 "contract-manufacturing/automotive/index.html": ("Standalone automotive CNC deep-dive", "DECISION: delete-or-restore (D-1)"),
 "contract-manufacturing/medical-devices/index.html": ("Standalone medical CNC deep-dive", "DECISION: delete-or-restore (D-1)"),
 "contract-manufacturing/industrial-equipment/index.html": ("Standalone industrial CNC deep-dive", "DECISION: delete-or-restore (D-1)"),
 "contract-manufacturing/electronics-telecom/index.html": ("Combined electronics+telecom CNC deep-dive", "DECISION: delete-or-restore (D-1/D-2)"),
 "contract-manufacturing/oil-gas-energy/index.html": ("Combined oil-gas+energy CNC deep-dive", "DECISION: delete-or-restore (D-1/D-2)"),
 "ems/index.html": ("EMS Assembly division home", "KEEP + fix footer About link"),
 "ems/about.html": ("Legacy EMS-only About (dup of /about.html)", "REMOVE-REDIRECT: delete file, repoint 8 links to /about.html"),
 "ems/request-quote.html": ("Legacy EMS-only RFQ form (orphan)", "DELETE (0 inbound; superseded by /request-a-quote/)"),
 "ems/services/index.html": ("EMS Services hub (breadcrumb 'Services' target)", "DECISION: promote to menu or keep body-only (D-3)"),
 "ems/services/box-build-assembly.html": ("Service — Box Build", "FIX-LINKS (footer About → /ems/about.html)"),
 "ems/services/cable-harness-assembly.html": ("Service — Cable & Harness", "FIX-LINKS (footer About)"),
 "ems/services/system-integration.html": ("Service — System Integration", "FIX-LINKS (footer About)"),
 "ems/services/testing-inspection.html": ("Service — Testing & Inspection", "FIX-LINKS (footer About)"),
 "ems/services/enclosure-cabinet-assembly.html": ("Service — Enclosure & Cabinet", "FIX-LINKS (footer About)"),
 "industries/aerospace-defense/index.html": ("Unified Aerospace industry page", "FIX-LINKS (CNC deep-dive self-loop)"),
 "industries/ai-server-rack/index.html": ("AI & Server Rack industry (EMS-native)", "KEEP (cleanest)"),
 "industries/appliances/index.html": ("Appliances industry (EMS-native)", "KEEP"),
 "industries/automotive/index.html": ("Automotive industry page", "FIX-LINKS (self-loop)"),
 "industries/electronics/index.html": ("Electronics industry page", "KEEP + add to footer + FIX-LINKS (self-loop)"),
 "industries/energy/index.html": ("Energy industry page", "FIX-LINKS — WRONG-DEST: link lands on /industries/oil-gas/"),
 "industries/industrial-equipment/index.html": ("Industrial Equipment industry page", "FIX-LINKS (self-loop)"),
 "industries/medical-devices/index.html": ("Medical Devices industry page", "FIX-LINKS (self-loop)"),
 "industries/oil-gas/index.html": ("Oil & Gas industry page", "KEEP + add to footer + FIX-LINKS (self-loop)"),
 "industries/telecom/index.html": ("Telecom industry page", "FIX-LINKS — WRONG-DEST: link lands on /industries/electronics/"),
 "nav-preview.html": ("Issue #02 nav design reference (dev)", "DELETE (spent scaffolding)"),
 "refresh-preview.html": ("Design-refresh homepage mock (dev)", "DELETE"),
 "refresh-preview-cm.html": ("CNC hub preview wrapper (dev, es)", "DELETE"),
 "screenshot-review.html": ("Internal screenshot-review tool (dev)", "DELETE"),
 "ems/process-rfq.php": ("Legacy EMS RFQ processor (dead; header-injection risk)", "DELETE (only caller is the orphan)"),
 "request-a-quote/process-rfq.php": ("LIVE unified RFQ processor", "KEEP (backend)"),
 "request-a-quote/rfq-lib.php": ("RFQ logic library (used by live handler+tests)", "KEEP (backend)"),
 "tests/run-tests.php": ("CLI test runner for rfq-lib", "KEEP but deny-list /tests/ from deploy"),
}

order = (d["files_by_class"]["site-page"] + d["files_by_class"]["error-page"]
         + d["files_by_class"]["php-backend"] + d["files_by_class"]["dev-artifact"]
         + d["files_by_class"]["test"])
red_by_srcfile = {r["src_file_exists"]:(r["dest"],r["rule_line"]) for r in d["redirect_source_files"] if r["src_file_exists"]}

def status_label(r):
    if r["class"]=="dev-artifact": return "Dev-Preview"
    if r["class"]=="php-backend": return "Backend"
    if r["class"]=="test": return "Test"
    if r["class"]=="error-page": return "Error 404"
    if r["self_redirects"]: return "Redirected (file exists)"
    if r["inbound_live"]==0: return "Live + ORPHAN"
    return "Live + Linked"

# count actionable redirected OUT links per source
out_red = {}
for rl in rec["actionable_redirected"]:
    out_red[rl["source"]] = out_red.get(rl["source"],0)+1

lines=[]
hdr = "| # | Archivo / URL | Estado | Nav | Foot | In(viv) | Redirect .htaccess (sal) | Links→redirect (sal) | Smap | Robots | Breadcrumb→reach | Propósito | Acción |"
sep = "|--|--|--|:-:|:-:|:-:|--|:-:|:-:|:-:|--|--|--|"
lines.append(hdr); lines.append(sep)
for i,f in enumerate(order,1):
    r=rows[f]; url=r["url"]
    st=status_label(r); nav="Y" if r["in_nav"] else "—"
    foot = "—" if f in no_footer else ("Y" if r["in_footer"] else "·")
    incnt=r["inbound_live"]
    if f in red_by_srcfile:
        dest,ln=red_by_srcfile[f]; rd=f"301→{dest} (L{ln})"
    else: rd="—"
    lr = str(out_red.get(f,0)) if out_red.get(f,0) else "—"
    smap="Y" if r["in_sitemap"] else "—"; rob="Y" if r["robots_blocked"] else "—"
    bc="—"
    for bi in d["breadcrumb_issues"]:
        if bi["page"]==f: bc=f"❌ '{bi['level_label']}'→{bi['level_url']} no en menú"; break
    else:
        if r["breadcrumb"]: bc="ok"
    purpose, action = PA.get(f, ("—","—"))
    cell_url = f"`{f}`<br>`{url}`"
    lines.append(f"| {i} | {cell_url} | {st} | {nav} | {foot} | {incnt} | {rd} | {lr} | {smap} | {rob} | {bc} | {purpose} | {action} |")

open(os.path.join(ROOT,".scratch/ia-audit/master_table_final.md"),"w",encoding="utf-8").write("\n".join(lines))
print("rows:",len(order),"-> master_table_final.md")
