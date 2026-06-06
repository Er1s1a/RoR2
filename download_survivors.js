const https = require('https');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, 'icons');
if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

const survivors = [
  'Commando','Huntress','Bandit','MUL-T','Engineer','Artificer','Mercenary','REX','Loader','Acrid','Captain',
  'Railgunner','Void Fiend','Seeker','False Son','CHEF','Operator','Drifter','Heretic'
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

function apiGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve(null); } });
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': UA } }, res2 => {
          const chunks = [];
          res2.on('data', c => chunks.push(c));
          res2.on('end', () => { fs.writeFileSync(dest, Buffer.concat(chunks)); resolve(Buffer.concat(chunks).length); });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => { fs.writeFileSync(dest, Buffer.concat(chunks)); resolve(Buffer.concat(chunks).length); });
      } else { reject(new Error(`HTTP ${res.statusCode}`)); }
    }).on('error', reject);
  });
}

async function main() {
  let ok = 0, fail = 0;
  for (const name of survivors) {
    const wikiFile = name.replace(/ /g, '_') + '.png';
    const saveFile = 'survivor_' + name.replace(/'/g,'').replace(/ /g,'_').replace(/\./g,'') + '.webp';
    const dest = path.join(ICONS_DIR, saveFile);
    if (fs.existsSync(dest)) { console.log(`SKIP ${saveFile}`); continue; }
    try {
      const apiUrl = `https://riskofrain2.wiki.gg/api.php?action=query&titles=File:${encodeURIComponent(name.replace(/ /g,'_'))}.png&prop=imageinfo&iiprop=url&format=json`;
      const result = await apiGet(apiUrl);
      if (!result || !result.query || !result.query.pages) { fail++; continue; }
      const page = Object.values(result.query.pages)[0];
      if (!page.imageinfo) { fail++; console.log(`NO IMG: ${saveFile}`); continue; }
      const imgUrl = page.imageinfo[0].url;
      const size = await downloadImage(imgUrl, dest);
      ok++;
      console.log(`OK ${saveFile} (${size}b)`);
      await new Promise(r => setTimeout(r, 200));
    } catch (e) { fail++; console.log(`ERR ${saveFile}: ${e.message}`); }
  }
  console.log(`\nDone! ${ok} OK, ${fail} failed`);
}

main();
