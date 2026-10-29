// Robot de noticias · Veeduría SENA (corre en GitHub Actions cada 30 min)
import fs from 'node:fs';
const FILE = 'data/noticias.json';
const QUERIES = ['SENA contratos irregularidades', 'SENA Córdoba corrupción', 'SENA auditoría regionales', 'SENA Fiscalía contratos', 'SENA Sucre contratos'];
const UA = {'User-Agent': 'Mozilla/5.0 (VeeduriaSENA robot)'};
const strip = s => (s || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const tag = (x, t) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? strip(m[1]) : ''; };

async function rss(url){
  const r = await fetch(url, {headers: UA}); if (!r.ok) return [];
  const xml = await r.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
}
async function google(q){
  const items = await rss(`https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:14d')}&hl=es-419&gl=CO&ceid=CO:es-419`);
  return items.map(x => { let titulo = tag(x, 'title'); const fuente = tag(x, 'source') || 'Prensa';
    if (titulo.endsWith(' - ' + fuente)) titulo = titulo.slice(0, -(fuente.length + 3));
    return {titulo, fuente, url: tag(x, 'link'), fecha: new Date(tag(x, 'pubDate')).toISOString(), imagen: ''}; });
}
async function bing(q){
  const items = await rss(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&setlang=es&cc=CO`);
  return items.map(x => { const img = (x.match(/<News:Image>([^<]+)<\/News:Image>/i) || [])[1] || '';
    let url = tag(x, 'link'); const u = url.match(/[?&]url=([^&]+)/); if (u) url = decodeURIComponent(u[1]);
    return {titulo: tag(x, 'title'), fuente: tag(x, 'News:Source') || new URL(url).hostname.replace('www.', ''), url, fecha: new Date(tag(x, 'pubDate')).toISOString(), imagen: img ? img.replace(/&amp;/g, '&') : ''}; });
}
async function ogImage(url){
  try {
    const ctl = new AbortController(); setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(url, {headers: UA, signal: ctl.signal, redirect: 'follow'}); if (!r.ok) return '';
    const html = (await r.text()).slice(0, 200000);
    const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image/i);
    return m && /^https:/.test(m[1]) ? m[1] : '';
  } catch { return ''; }
}
const key = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '').slice(0, 60);

const old = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')).noticias || [] : [];
let fresh = [];
for (const q of QUERIES) {
  for (const src of [bing, google]) { try { fresh.push(...await src(q)); } catch (e) { console.log('fallo', q, e.message); } }
}
fresh = fresh.filter(n => n.titulo && n.url && /sena/i.test(n.titulo) && !isNaN(new Date(n.fecha)));
const map = new Map();
for (const n of [...fresh, ...old]) {
  const k = key(n.titulo); const prev = map.get(k);
  if (!prev) map.set(k, n); else if (!prev.imagen && n.imagen) prev.imagen = n.imagen;
}
const list = [...map.values()].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 60);
for (const n of list.slice(0, 25)) {
  if (!n.imagen && !/news\.google\.com/.test(n.url)) n.imagen = await ogImage(n.url);
}
fs.writeFileSync(FILE, JSON.stringify({actualizado: new Date().toISOString(), noticias: list}, null, 2));
console.log(`Noticias guardadas: ${list.length}`);
