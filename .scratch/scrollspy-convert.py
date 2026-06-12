#!/usr/bin/env python3
"""Convert .cm-subnav horizontal sub-nav -> fixed .scrollspy sidebar.

Deterministic, self-verifying. Reuses the existing section ids verbatim.
Mirrors the canonical pattern in industries/aerospace-defense/index.html.

Usage:  python scrollspy-convert.py            (dry-run, validates only)
        python scrollspy-convert.py --apply     (writes files)
"""
import re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPLY = "--apply" in sys.argv

TARGETS = [
    "contract-manufacturing/cnc-milling",
    "contract-manufacturing/cnc-turning",
    "contract-manufacturing/wire-edm",
    "contract-manufacturing/sheet-metal",
    "contract-manufacturing/surface-finishing",
    "contract-manufacturing/engineering-support",
    "contract-manufacturing/why-mexico",
    "contract-manufacturing/metals",
    "contract-manufacturing/plastics",
    "quality",
]

# Canonical scrollspy IIFE — copied verbatim from industries/aerospace-defense,
# with '.service-hero, .cm-hero' appended to darkSelectors (per task spec).
IIFE = """  <!-- Scrollspy -->
  <script>
  (function() {
    var spy = document.getElementById('scrollspy');
    if (!spy) return;
    var links = spy.querySelectorAll('.scrollspy__link');
    var sections = [];
    links.forEach(function(link) {
      var id = link.getAttribute('data-section');
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el, link: link });
    });

    var footer = document.querySelector('.footer');
    var heroEl = document.getElementById('hero');
    var activeId = 'hero';

    var darkSelectors = '.svc-hero, .hero, .ind-hero, .hub-hero, .mid-cta, .final-cta, .faq-split, .footer, .service-hero, .cm-hero';
    var darkSections = document.querySelectorAll(darkSelectors);

    function checkDarkBg() {
      var spyCenter = spy.getBoundingClientRect().top + spy.getBoundingClientRect().height / 2;
      var onDark = false;
      darkSections.forEach(function(ds) {
        var r = ds.getBoundingClientRect();
        if (spyCenter >= r.top && spyCenter <= r.bottom) onDark = true;
      });
      spy.classList.toggle('on-dark', onDark);
    }

    function onScroll() {
      var scrollY = window.scrollY;
      var winH = window.innerHeight;

      var pastHero = heroEl ? heroEl.getBoundingClientRect().bottom < 0 : true;
      var atFooter = footer ? footer.getBoundingClientRect().top <= winH : false;
      spy.classList.toggle('is-visible', pastHero && !atFooter);

      checkDarkBg();

      var trigger = scrollY + winH * 0.35;
      var current = sections[0] ? sections[0].id : '';
      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.offsetTop <= trigger) {
          current = sections[i].id;
          break;
        }
      }
      if (current && current !== activeId) {
        activeId = current;
        links.forEach(function(l) { l.classList.remove('is-active'); });
        sections.forEach(function(s) {
          if (s.id === current) s.link.classList.add('is-active');
        });
      }
    }

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var id = link.getAttribute('data-section');
        var target = document.getElementById(id);
        if (target) {
          var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();
  </script>"""

# --- regexes ---
RE_SUBNAV_LINK = re.compile(r'<a\s+href="#([^"]+)"\s+class="cm-subnav__link">(.*?)</a>', re.DOTALL)
# whole cm-subnav nav block + an optional single-line HTML comment immediately above it
RE_SUBNAV_BLOCK = re.compile(
    r'[ \t]*(?:<!--[^\n]*?-->[ \t]*\r?\n)?[ \t]*<nav class="cm-subnav".*?</nav>[ \t]*\r?\n?',
    re.DOTALL)
# the inline <script> that contains the old cm-subnav scrollspy (+ optional comment above)
RE_OLD_IIFE = re.compile(
    r'[ \t]*(?:<!--[^\n]*?-->[ \t]*\r?\n)?[ \t]*<script>(?:(?!</script>).)*?subnavLinks(?:(?!</script>).)*?</script>[ \t]*\r?\n?',
    re.DOTALL)
RE_FIRST_HERO = re.compile(r'<section class="([^"]*hero[^"]*)">')


def build_aside(pairs):
    lines = ['  <!-- Scrollspy sidebar -->',
             '  <aside class="scrollspy" id="scrollspy">',
             '    <nav class="scrollspy__nav">']
    for i, (sid, label) in enumerate(pairs):
        active = " is-active" if i == 0 else ""
        lines.append(f'      <a href="#{sid}" class="scrollspy__link{active}" data-section="{sid}">{label}</a>')
    lines += ['    </nav>', '  </aside>']
    return "\n".join(lines)


def convert(path):
    with open(path, "r", encoding="utf-8") as fh:
        src = fh.read()

    # 1. extract (id,label) pairs from the cm-subnav block, in order
    block_m = re.search(r'<nav class="cm-subnav".*?</nav>', src, re.DOTALL)
    assert block_m, "no cm-subnav block found"
    pairs = [(sid, label.strip()) for sid, label in RE_SUBNAV_LINK.findall(block_m.group(0))]
    assert len(pairs) >= 6, f"only {len(pairs)} sections (<6) — would not qualify"

    out = src
    # 2. insert aside as first child of <main id="main">
    aside = build_aside(pairs)
    assert out.count('<main id="main">') == 1
    out = out.replace('<main id="main">', '<main id="main">\n\n' + aside, 1)

    # 3. add id="hero" to the first hero <section> after <main>
    main_pos = out.index('<main id="main">')
    head, tail = out[:main_pos], out[main_pos:]
    new_tail, n_hero = RE_FIRST_HERO.subn(
        lambda m: f'<section class="{m.group(1)}" id="hero">', tail, count=1)
    assert n_hero == 1, "could not find a hero <section> after <main>"
    out = head + new_tail

    # 4. remove the cm-subnav block (+ its comment)
    out, n_block = RE_SUBNAV_BLOCK.subn("", out)
    assert n_block == 1, f"removed {n_block} cm-subnav blocks (expected 1)"

    # 5. replace the old inline IIFE with the canonical scrollspy IIFE
    out, n_iife = RE_OLD_IIFE.subn(lambda m: IIFE + "\n", out)
    assert n_iife == 1, f"replaced {n_iife} old IIFEs (expected 1)"

    # --- post-conditions ---
    assert "cm-subnav" not in out, "cm-subnav residue remains"
    assert "cmSubnav" not in out, "cmSubnav residue remains"
    assert "subnavLinks" not in out, "subnavLinks residue remains"
    assert out.count('id="scrollspy"') == 1, "scrollspy aside count != 1"
    assert out.count('<main') == 1, "main count != 1"
    assert out.count('id="hero"') == 1, "hero id count != 1"
    assert out.count("getElementById('scrollspy')") == 1, "canonical IIFE missing"
    assert ".service-hero, .cm-hero'" in out, "darkSelectors not extended"
    # every aside link must point at an id that exists in the doc
    for sid, _ in pairs:
        assert f'id="{sid}"' in out, f'section id #{sid} not present in {path}'
    return out, pairs


def main():
    print(f"{'APPLY' if APPLY else 'DRY-RUN'} — {len(TARGETS)} targets\n")
    for t in TARGETS:
        path = os.path.join(ROOT, t, "index.html")
        out, pairs = convert(path)
        labels = ", ".join(l for _, l in pairs)
        print(f"OK  {t:42s} {len(pairs)} secs: {labels}")
        if APPLY:
            with open(path, "w", encoding="utf-8", newline="") as fh:
                fh.write(out)
    print("\nAll assertions passed." + ("  WROTE files." if APPLY else "  (no files written)"))


if __name__ == "__main__":
    main()
