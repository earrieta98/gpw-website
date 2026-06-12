import re, glob

files = []
for f in glob.glob("**/*.html", recursive=True):
    fn = f.replace("\\","/")
    if any(fn.startswith(p) for p in (".git/", "tests/", "assets/", "docs/", ".scratch/")):
        continue
    files.append(fn)
files = sorted(files)

for f in files:
    t = open(f, encoding="utf-8").read()
    # strip comments
    t = re.sub(r'<!--.*?-->', '', t, flags=re.S)
    heads = re.findall(r'<h([1-6])[^>]*>', t, re.I)
    levels = [int(h) for h in heads]
    # detect skipped levels
    issues=[]
    prev=0
    seq=[]
    for lv in levels:
        seq.append(lv)
    # check for jump > 1 increasing
    skips=[]
    for i in range(1,len(levels)):
        if levels[i] > levels[i-1] + 1:
            skips.append((levels[i-1], levels[i]))
    h1n = levels.count(1)
    if skips or h1n != 1:
        print(f"{f}: h1count={h1n} sequence={seq}")
        if skips: print(f"    SKIPS: {skips}")
