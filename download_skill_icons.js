const https = require('https');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, 'icons');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// All skills extracted from the SURVIVORS data
const skills = [
  // Commando
  'Double_Tap','Phase_Round','Phase_Blast','Tactical_Dive','Tactical_Slide','Suppressive_Fire','Frag_Grenade',
  // Huntress
  'Strafe','Flurry','Laser_Glaive','Blink','Phase_Blink','Arrow_Rain','Ballista',
  // Bandit
  'Backstab','Burst','Blast','Serrated_Dagger','Serrated_Shiv','Smoke_Bomb','Lights_Out','Desperado',
  // MUL-T
  'Auto-Nailgun','Rebar_Puncher','Scrap_Launcher','Power-Saw','Blast_Canister','Transport_Mode','Retool','Power_Mode',
  // Engineer
  'Bouncing_Grenades','Pressure_Mines','Spider_Mines','Bubble_Shield','Thermal_Harpoons','TR12_Gauss_Auto-Turret','TR58_Carbonizer_Turret',
  // Artificer
  'ENV_Suit','Flame_Bolt','Plasma_Bolt','Charged_Nano-Bomb','Cast_Nano-Spear','Snapfreeze','Flamethrower','Ion_Surge',
  // Mercenary
  'Cybernetic_Enhancements','Laser_Sword','Whirlwind','Rising_Thunder','Blinding_Assault','Focused_Assault','Eviscerate','Slicing_Winds',
  // REX
  'Natural_Toxins','DIRECTIVE:_Inject','DIRECTIVE:_Drill','Seed_Barrage','DIRECTIVE:_Disperse','Bramble_Volley','DIRECTIVE:_Harvest','Tangling_Growth',
  // Loader
  'Scrap_Barrier','Knuckleboom','Grapple_Fist','Spiked_Fist','Charged_Gauntlet','Thunder_Gauntlet','M551_Pylon','Thunderslam',
  // Acrid
  'Poison','Blight','Vicious_Wounds','Neurotoxin','Ravenous_Bite','Caustic_Leap','Frenzied_Leap','Epidemic',
  // Captain
  'Defensive_Microbots_Captain','Vulcan_Shotgun','Power_Tazer','Orbital_Probe','OGM-72_DIABLO_Strike','Orbital_Supply_Beacon',
  'Beacon:_Healing','Beacon:_Shocking','Beacon:_Resupply','Beacon:_Hacking',
  // Railgunner
  'Magnetic_Accelerator','XQR_Smart_Round_System','M99_Sniper','HH44_Marksman','Concussion_Device','Polar_Field_Device','Supercharge_(Railgunner)','Cryocharge',
  // Void Fiend
  'Void_Corruption','Drown','Corrupted_Drown','Flood_(Void_Fiend)','Corrupted_Flood','Trespass','Corrupted_Trespass','Suppress','Corrupted_Suppress',
  // Seeker
  'Inner_Strength','Spirit_Punch','Unseen_Hand','Soul_Spiral','Sojourn','Reprieve','Meditate','Palm_Blast',
  // False Son
  'Lunar_Tampering','Club_of_the_Forsaken','Lunar_Spikes','Lunar_Stakes','Step_of_the_Brothers','Meridians_Will','Laser_of_the_Father','Laser_Burst',
  // CHEF
  'CHEFs_Kiss','Dice','Sear','Ice_Box','Roll','Oil_Spill','Glaze','Yes_CHEF!',
  // Operator
  'Drone_Tech','H3-11_OCR_Custom','ADMIN-OVERRIDE','CMD-SWARM','Ascent_Protocol','FIREWALL','Ejection_Core','Amp_Core',
  // Drifter
  'Trash_to_Treasure','Blunt_Force','Cleanup','Junk_Cube','Repossess','Tornado_Slam','Salvage','Tinker',
  // Heretic
  'Hungering_Gaze','Slicing_Maelstrom','Shadowfade','Ruin'
];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve(null); } });
    }).on('error', reject);
  });
}

async function download(url, dest) {
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
      } else { reject(new Error('HTTP ' + res.statusCode)); }
    }).on('error', reject);
  });
}

async function main() {
  let ok = 0, fail = 0;
  for (const skillName of skills) {
    const saveFile = 'skill_' + skillName.replace(/'/g,'').replace(/:/g,'').replace(/!/g,'').replace(/\(/g,'').replace(/\)/g,'') + '.webp';
    const dest = path.join(ICONS_DIR, saveFile);
    if (fs.existsSync(dest)) { console.log('SKIP ' + saveFile); continue; }

    try {
      const apiUrl = `https://riskofrain2.wiki.gg/api.php?action=query&titles=File:${encodeURIComponent(skillName)}.png&prop=imageinfo&iiprop=url&format=json`;
      const result = await fetchUrl(apiUrl);
      if (!result || !result.query) { fail++; console.log('API FAIL: ' + saveFile); continue; }
      const page = Object.values(result.query.pages)[0];
      if (!page.imageinfo) { fail++; console.log('NO IMG: ' + saveFile + ' (' + skillName + ')'); continue; }
      const imgUrl = page.imageinfo[0].url;
      const size = await download(imgUrl, dest);
      ok++;
      console.log('OK ' + saveFile + ' (' + size + 'b)');
      await new Promise(r => setTimeout(r, 300));
    } catch (e) { fail++; console.log('ERR ' + saveFile + ': ' + e.message); }
  }
  console.log('\nDone! ' + ok + ' OK, ' + fail + ' failed');
}

main();
