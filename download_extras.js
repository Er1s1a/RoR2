const https = require('https');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, 'icons');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const files = [
  // Bosses
  'Stone_Titan','Beetle_Queen','Wandering_Vagrant','Magma_Worm','Imp_Overlord',
  'Clay_Dunestrider','Grovetender','Grandparent_(Monster)','Overloading_Worm','Scavenger',
  'Solus_Control_Unit','Xi_Construct',
  // Mechanics
  'Shrine_of_Blood','Shrine_of_Combat','Shrine_of_the_Mountain','Shrine_of_Chance',
  'Shrine_of_the_Woods','Shrine_of_Order','Cleansing_Pool','3D_Printer','Scrapper',
  'Newt_Altar','Barrel','Golden_Coast','Bazaar_Between_Time','Abandoned_Aqueduct'
];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve(null); } });
    }).on('error', reject);
  });
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400) {
        https.get(res.headers.location, { headers: { 'User-Agent': UA } }, res2 => {
          const chunks = [];
          res2.on('data', c => chunks.push(c));
          res2.on('end', () => { fs.writeFileSync(dest, Buffer.concat(chunks)); resolve(Buffer.concat(chunks).length); });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => { fs.writeFileSync(dest, Buffer.concat(chunks)); resolve(Buffer.concat(chunks).length); });
      } else { reject(new Error('HTTP ' + res.statusCode)); }
    }).on('error', reject);
  });
}

async function main() {
  let ok = 0, fail = 0;
  for (const name of files) {
    const saveFile = 'ext_' + name.replace(/'/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/ /g,'_') + '.webp';
    const dest = path.join(ICONS_DIR, saveFile);
    if (fs.existsSync(dest)) { console.log('SKIP ' + saveFile); continue; }
    try {
      const apiUrl = `https://riskofrain2.wiki.gg/api.php?action=query&titles=File:${encodeURIComponent(name)}.png&prop=imageinfo&iiprop=url&format=json`;
      const result = await fetchUrl(apiUrl);
      if (!result || !result.query) { fail++; console.log('API FAIL: ' + saveFile); continue; }
      const page = Object.values(result.query.pages)[0];
      if (!page.imageinfo) { fail++; console.log('NO IMG: ' + saveFile); continue; }
      const size = await download(page.imageinfo[0].url, dest);
      ok++;
      console.log('OK ' + saveFile + ' (' + size + 'b)');
      await new Promise(r => setTimeout(r, 200));
    } catch (e) { fail++; console.log('ERR ' + saveFile + ': ' + e.message); }
  }
  console.log('\nDone! ' + ok + ' OK, ' + fail + ' failed');
}
main();
