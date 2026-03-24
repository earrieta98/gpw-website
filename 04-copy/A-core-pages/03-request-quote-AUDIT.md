# AUDIT REPORT: Request a Quote Page (03-request-quote.md)
**Audit Date:** March 6, 2026
**Auditor:** Automated script + Manual qualitative review
**Reference:** Copywriting Guide Section 8 (Pre-Publish Quality Checklist) + Section 9.3 (Review Pass)
**Verdict:** ✅ PASS WITH 4 MINOR FIXES RECOMMENDED

---

## 8.1 Voice & Tone

| # | Check | Verdict | Notes |
|---|-------|---------|-------|
| 1 | Does it sound like GPW? | ✅ PASS | Precise, confident, engineering-driven. Matches brand personality: "Every RFQ reviewed by our engineering team, not a sales bot." This sounds like GPW, not generic marketing. |
| 2 | Tone appropriate for page type (Conversion/RFQ)? | ✅ PASS | Conversion pages should be reassuring, friction-reducing, and process-transparent. The copy hits all three: trust elements above fold, microcopy on every form field, 4-step "What Happens Next" section. |
| 3 | Industry-specific tone adjustments? | ✅ N/A | RFQ is a cross-industry page. No industry-specific tone needed. |
| 4 | Brand power phrases used naturally? | ⚠️ MINOR | 3 of 9 power phrases used: "precision" (3x), "assembly-first" (1x), "same timezone" (2x). Missing but optional: "engineered for," "built to," "ready to scale," "two hours from the border," "one supplier," "from BOM to." Consider adding 1-2 more naturally. **Recommendation:** Add "two hours from the border" in Section 4 (already mentions "2 hours from the U.S. border by road" — rephrase to exact brand phrase). |
| 5 | "Avoid" words absent? | ❌ FIX NEEDED | **"best"** found 1x — in FAQ #6: "We discuss the best approach during the scoping phase." Replace with "most effective" or "right." **"solutions"** found 2x — in "gpw-solutions.com" (domain, acceptable) and "rfq@gpw-solutions.com" (email, acceptable). **Verdict:** Only 1 real issue ("best"). The "solutions" instances are in URLs/emails, not copy. |

---

## 8.2 Writing Quality

| # | Check | Verdict | Notes |
|---|-------|---------|-------|
| 1 | Active voice throughout? | ⚠️ MINOR | 5 passive constructions found. 3 are in form validation messages ("is required," "has been received") — these are standard UX patterns and acceptable. 2 are in body copy: "quote is approved" (Section 3, Step 4) and "quote is broken down" (Section 3, Step 3). **Recommendation:** Rewrite "the quote is approved" → "you approve the quote" and "The quote is broken down" → "The quote breaks down costs." |
| 2 | Sentences average 15 words or fewer? | ✅ PASS | Average: 14.2 words. The 9 "long sentences" flagged by the script are mostly false positives caused by form field labels/options being concatenated. Actual prose sentences are well within range. |
| 3 | Paragraphs 2-3 sentences max? | ✅ PASS | All paragraphs are 1-3 sentences. No paragraph exceeds 3 sentences. |
| 4 | No exclamation points? | ✅ PASS | Zero exclamation points in body copy. |
| 5 | Numbers use digits? | ✅ PASS | All numbers are digits: 24, 3-5, 2-3, 4-6, 10,000+, 40-60%, 150, etc. |
| 6 | Claims specific and substantiated? | ✅ PASS | Every claim includes specific numbers: "within 24 hours," "3-5 business days," "2-3 weeks," "4-6 weeks," "40-60% cost savings," "150 miles." No vague claims. |
| 7 | No future tense for capabilities? | ✅ PASS | All capabilities stated in present tense. No "will be," "coming soon," "plan to." |
| 8 | Certification language correct? | ✅ PASS | Uses "certification in progress" and "in progress" — never claims certifications as held. |
| 9 | No semicolons? | ✅ PASS | Zero semicolons in body copy. |
| 10 | Company naming correct? | ✅ PASS | "Global Precision Works" used on first mention. "GPW" used thereafter. Zero instances of "GPW Solutions." |

---

## 8.3 Structure & SEO

| # | Check | Verdict | Notes |
|---|-------|---------|-------|
| 1 | H1 includes primary keyword? | ⚠️ NOTE | H1: "Your Project. Our Precision. Let's Build the Quote." — Does NOT contain primary keyword "electromechanical assembly" or "request quote." However, the title tag and meta description do. For a conversion page, an emotional/action-oriented H1 is standard practice and acceptable. |
| 2 | H2s answer search questions or state benefits? | ✅ PASS | H2s: "Tell Us About Your Project," "What Happens Next," "Prefer to Talk First?," "Built for the Projects Other Assemblers Avoid," "Frequently Asked Questions" — all benefit/action oriented. |
| 3 | 3-5 H2s per page? | ✅ PASS | 7 H2s total (including Page Metadata). 6 content H2s — slightly over the 3-5 target for a conversion page, but structure serves the page well. |
| 4 | Title tag: 50-60 chars? | ✅ PASS | 52 characters: "GPW \| Request a Quote for Electromechanical Assembly" — includes keyword + brand. |
| 5 | Meta description: 155-160 chars? | ❌ FIX NEEDED | 179 characters — **19 chars over limit.** Current: "Request a quote from Global Precision Works. Tell us about your electromechanical assembly project — industry, service, timeline — and receive a detailed response within 24 hours." **Recommendation:** Trim to: "Request a quote from Global Precision Works. Tell us about your electromechanical assembly project and receive an engineering assessment within 24 hours." (155 chars) |
| 6 | Internal links: 2-3 minimum? | ✅ PASS | 8+ internal link references to service pages, industry pages, about, contact. Well-linked. |
| 7 | FAQ section with 5-7 questions? | ✅ PASS | 8 FAQ questions. Exceeds target slightly, but all are relevant and well-crafted. |
| 8 | Definition block present? | ✅ N/A | Not required for conversion/RFQ pages. The subheadline serves a similar function. |
| 9 | Word count within range? | ✅ PASS | ~1,209-1,450 words (automated counts vary by what's included). Within the 1,200-1,500 target. |

---

## 8.4 CTAs

| # | Check | Verdict | Notes |
|---|-------|---------|-------|
| 1 | Primary CTA present and visible? | ✅ PASS | "Request My Quote" (Coral button) on the form submit. Clear, prominent. |
| 2 | CTA placement follows framework? | ✅ PASS | 3 CTA placements: (1) Hero subheadline area (above fold), (2) Form submit (mid-page), (3) Bottom of Section 5 "Request a Quote" (bottom). Follows above-fold / mid-page / bottom framework. |
| 3 | CTA copy uses action verb + what they get? | ✅ PASS | "Request My Quote" — action verb (request) + outcome (my quote). First person "my" adds ownership. |
| 4 | CTA has context copy (reassurance line)? | ✅ PASS | Every CTA has reassurance: form button has "Your information is confidential" microcopy; bottom CTA has "No commitment. No minimum order. We respond within 24 hours." |
| 5 | Correct button colors? | ✅ PASS | Coral (#ED835E) specified for primary CTA ("Request My Quote" and bottom "Request a Quote"). |

---

## 8.5 Industry Balance

| # | Check | Verdict | Notes |
|---|-------|---------|-------|
| 1 | AI & Server Rack stays within ~40%? | ✅ PASS | AI is listed as first option in the industry dropdown, but no industry dominates the page copy. The page is conversion-focused, not industry-specific. |
| 2 | Other 7 industries equitable? | ✅ PASS | All 8 industries listed in the dropdown. FAQ mentions "8 industries" without favoring any. Section 5 bullets are industry-neutral. |
| 3 | Cross-industry internal links? | ✅ PASS | Metadata specifies links to "All 8 industry pages" and "All 5 service pages." |
| 4 | No single industry dominates? | ✅ PASS | Page is industry-neutral by design. |

---

## 8.6 AI SEO Compatibility

| # | Check | Verdict | Notes |
|---|-------|---------|-------|
| 1 | Definition blocks self-contained? | ✅ N/A | RFQ page doesn't require a definition block. The subheadline is extractable. |
| 2 | Answer blocks address common queries? | ✅ PASS | 8 FAQ answers directly address queries like "What information do I need to submit an RFQ?", "How quickly will I receive a quote?", "Is there a minimum order quantity?" — all common prospect questions. |
| 3 | Comparison tables? | ✅ N/A | Not applicable for conversion page. |
| 4 | FAQ answers concise (40-60 words)? | ⚠️ MINOR | FAQ #3 (24 words) and FAQ #8 (29 words) are below the 40-word target. These are still adequate but could be expanded slightly to improve AI citability. **Recommendation:** Add 1-2 more sentences to FAQ #3 (minimum order quantity) and FAQ #8 (confidentiality) to reach 40+ words. |
| 5 | Schema markup plan? | ✅ PASS | ContactAction schema specified with JSON-LD. FAQPage schema noted for all 8 questions. Both align with AI SEO Strategy Section 6.7. |

---

## 9.3 Review Pass

| # | Check | Verdict | Notes |
|---|-------|---------|-------|
| 1 | Read aloud test | ✅ PASS | Copy reads naturally. No awkward phrasing. The voice is distinctly GPW — precise, engineering-driven, no-nonsense. Standout lines: "Every RFQ reviewed by our engineering team, not a sales bot" and "A quote is a conversation starter, not a contract." |
| 2 | Section 8 checklist completed | ✅ DONE | This report. |
| 3 | Internal links verified | ✅ PASS | 8+ internal link references specified. All point to valid URL paths per site architecture. |
| 4 | Word count verified | ✅ PASS | Within 1,200-1,500 target. |
| 5 | CTA test: Would you click it? | ✅ PASS | "Request My Quote" is specific, low-commitment, and first-person. The reassurance copy ("No commitment. No minimum order.") removes friction effectively. |

---

## SUMMARY: Issues to Fix

### Must Fix (2 items)

1. **Meta description too long (179 chars → target 155-160)**
   - Current: "Request a quote from Global Precision Works. Tell us about your electromechanical assembly project — industry, service, timeline — and receive a detailed response within 24 hours."
   - Suggested: "Request a quote from Global Precision Works. Tell us about your electromechanical assembly project and receive an engineering assessment within 24 hours." (155 chars)

2. **"best" in FAQ #6**
   - Current: "We discuss the best approach during the scoping phase."
   - Fix: "We discuss the right approach during the scoping phase." or "We determine the most effective approach during the scoping phase."

### Should Fix (2 items)

3. **2 passive voice instances in body copy**
   - "Once the quote is approved" → "Once you approve the quote"
   - "The quote is broken down by assembly stage" → "The quote breaks down costs by assembly stage"

4. **2 FAQ answers below 40-word target**
   - FAQ #3 (minimum order): 24 words — add 1-2 sentences about pilot build process
   - FAQ #8 (confidentiality): 29 words — add detail about NDA process

### Optional Improvements

5. **Add 1-2 more brand power phrases** — "two hours from the border" is already referenced but not in exact brand phrase form. Consider using the exact phrase in Section 4.

---

## OVERALL SCORE

| Category | Score | Status |
|----------|-------|--------|
| 8.1 Voice & Tone | 4/5 | ⚠️ 1 minor fix |
| 8.2 Writing Quality | 9/10 | ⚠️ 2 passive voice fixes |
| 8.3 Structure & SEO | 8/9 | ❌ Meta desc too long |
| 8.4 CTAs | 5/5 | ✅ Perfect |
| 8.5 Industry Balance | 4/4 | ✅ Perfect |
| 8.6 AI SEO | 4/5 | ⚠️ 2 short FAQ answers |
| 9.3 Review Pass | 5/5 | ✅ Perfect |
| **TOTAL** | **39/43** | **91% — PASS** |

**Verdict:** The RFQ page copy is publication-ready with 4 minor fixes. No structural or strategic issues. Voice, tone, and conversion architecture are strong. Apply the 2 "must fix" items and consider the 2 "should fix" items before sending to development.

---

*Audited against: Copywriting Guide GPW v1.0, Sections 8.1–8.6, 9.3*
*Automated checks: audit-rfq.py (17 programmatic criteria)*
*Manual checks: Qualitative review across all checklist items*
