const fs=require('fs'),path=require('path');
const ROOT=process.cwd();
function rel(p){return path.relative(ROOT,p).split(path.sep).join('/');}
function walk(dir,acc){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.scratch','node_modules','.git'].includes(e.name))continue;const f=path.join(dir,e.name);if(e.isDirectory())walk(f,acc);else if(e.name.endsWith('.html'))acc.push(f);}return acc;}
const pages=walk(ROOT,[]).sort();
// id map per page
const idMap={};
const content={};
for(const f of pages){const c=fs.readFileSync(f,'utf8');content[rel(f)]=c;const ids=new Set();let m;const r=/\b(?:id|name)\s*=\s*["']([^"']+)["']/g;while((m=r.exec(c)))ids.add(m[1]);idMap[rel(f)]=ids;}
function lineOf(c,i){return c.slice(0,i).split('\n').length;}

// Cross-page fragment links: href to a different page WITH a #frag
const crossFrag=[];
const existing=new Set();
(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['.scratch','node_modules','.git'].includes(e.name))continue;const f=path.join(d,e.name);if(e.isDirectory())w(f);else existing.add(rel(f).toLowerCase());}})(ROOT);

for(const f of pages){
  const pr=rel(f),c=content[pr],dir=path.dirname(f);
  let m;const a=/<a\b[^>]*?\bhref\s*=\s*["']([^"']*)["']/gi;
  while((m=a.exec(c))){
    const href=m[1];const line=lineOf(c,m.index);
    if(!href||/^(https?:)?\/\//i.test(href)||/^(mailto:|tel:|javascript:|data:|#)/i.test(href))continue;
    if(!href.includes('#'))continue;
    let [p,frag]=href.split('#');if(!frag)continue;p=p.split('?')[0];if(p==='')continue;
    // resolve target page
    let tgt;
    if(p.startsWith('/'))tgt=p.slice(1);else tgt=rel(path.resolve(dir,p));
    if(tgt===''||tgt.endsWith('/'))tgt+='index.html';
    else if(!path.extname(tgt)&&existing.has((tgt+'/index.html').toLowerCase()))tgt+='/index.html';
    tgt=tgt.replace(/\/+/g,'/');
    // find matching page key (case-insensitive)
    const key=Object.keys(idMap).find(k=>k.toLowerCase()===tgt.toLowerCase());
    if(key){if(!idMap[key].has(frag))crossFrag.push({pr,line,href,tgt:key,frag});}
  }
}
console.log('### CROSS-PAGE DANGLING FRAGMENTS ('+crossFrag.length+') ###');
crossFrag.forEach(b=>console.log(`${b.pr}:${b.line}  href="${b.href}" -> ${b.tgt} has no id/name="${b.frag}"`));

// Any link to /quality anywhere across all live pages (raw grep style)
console.log('\n### RAW href to quality across live pages ###');
for(const f of pages){const pr=rel(f),c=content[pr];let m;const a=/<a\b[^>]*?\bhref\s*=\s*["']([^"']*quality[^"']*)["']/gi;while((m=a.exec(c)))console.log(`${pr}:${lineOf(c,m.index)}  ${m[1]}`);}
