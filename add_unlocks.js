const fs = require('fs');

const htmlFile = 'D:/雨2小程序/index.html';
let html = fs.readFileSync(htmlFile, 'utf8');

// Skill unlock challenges (challenge name → Chinese description)
// From wiki: Challenge names like "Commando: Rolling Thunder" etc.
const challengeMap = {
  // Commando
  'Phase_Blast': '成就「Commando: Rolling Thunder」',
  'Tactical_Slide': '成就「Commando: Godspeed」',
  'Frag_Grenade': '成就「Commando: Incorruptible」',
  // Huntress
  'Flurry': '成就「Huntress: Finishing Touch」',
  'Phase_Blink': '成就「Huntress: One Shot, One Kill」', 
  'Ballista': '成就「Huntress: Piercing Wind」',
  // Bandit
  'Blast': '成就「Bandit: Classic Man」',
  'Serrated_Shiv': '成就「Bandit: Sadist」',
  'Desperado': '成就「Bandit: B&E」',
  // MUL-T
  'Scrap_Launcher': '成就「MUL-T: Pest Control」',
  'Power-Saw': '成就「MUL-T: Gotcha!」',
  'Power_Mode': '成就「MUL-T: Seventh Day」',
  // Engineer
  'Spider_Mines': '成就「Engineer: 100% Calculated」',
  'Thermal_Harpoons': '成就「Engineer: Zero Sum」',
  'TR58_Carbonizer_Turret': '成就「Engineer: Better With Friends」',
  // Artificer
  'Plasma_Bolt': '成就「Artificer: Massacre」',
  'Cast_Nano-Spear': '成就「Artificer: Orbital Bombardment」',
  'Ion_Surge': '成就「Artificer: Chunked!」',
  // Mercenary
  'Rising_Thunder': '成就「Mercenary: Demon of the Skies」',
  'Focused_Assault': '成就「Mercenary: Ethereal」',
  'Slicing_Winds': '成就「Mercenary: Flash of Blades」',
  // REX
  'Seed_Barrage': '成就「REX: Bushwhacked」',
  'Bramble_Volley': '成就「REX: Full of Life」',
  'Tangling_Growth': '成就「REX: Dunked」',
  // Loader
  'Spiked_Fist': '成就「Loader: Swing By」',
  'Thunder_Gauntlet': '成就「Loader: Earthshatter」',
  'Thunderslam': '成就「Loader: The Thunderdome」',
  // Acrid
  'Blight': '成就「Acrid: Bad Medicine」',
  'Ravenous_Bite': '成就「Acrid: Bite」',
  'Frenzied_Leap': '成就「Acrid: Easy Prey」',
  // Captain
  'DIABLO_Strike': '成就「Captain: Smushed」',
  // Railgunner
  'HH44_Marksman': '成就「Railgunner: Annihilator」',
  'Polar_Field_Device': '成就「Railgunner: Trickshot」',
  'Cryocharge': '成就「Railgunner: Calculated」',
  // Void Fiend
  'Corrupted_Flood': '成就「Void Fiend: Dragged Below」',
  'Corrupted_Trespass': '成就「Void Fiend: Corrupted 「Purified」」',
  'Corrupted_Suppress': '成就「Void Fiend: Corrupted 「Purified」」',
  // Seeker
  'Soul_Spiral': '成就「Seeker: Meditation」',
  'Reprieve': '成就「Seeker: Sanctuary」',
  'Palm_Blast': '成就「Seeker: Purified」',
  // False Son
  'Lunar_Stakes': '成就「False Son: Moon Worshipper」',
  'Meridians_Will': '成就「False Son: Ascension」',
  'Laser_Burst': '成就「False Son: Eye of the Storm」',
  // CHEF
  'Ice_Box': '成就「CHEF: Sous Chef」',
  'Oil_Spill': '成就「CHEF: Slip and Slide」',
  'Yes_CHEF': '成就「CHEF: Yes, CHEF!」',
  // Drifter
  'Junk_Cube': '成就「Drifter: Hoarder」',
  'Tornado_Slam': '成就「Drifter: Twister」',
  'Tinker': '成就「Drifter: Fixer Upper」',
};

// For each skill in SURVIVORS, if it's NOT the first skill of its type, add a 'ch' field
// Find the SURVIVORS array in the HTML
const start = html.indexOf('var SURVIVORS = [');
const end = html.indexOf('var ARTIFACTS = [');
const survivSection = html.substring(start, end);

// Replace skills with unlock info by adding 'ch' field
let updated = survivSection;

// For each skill e-name in challengeMap, add ch field to the skill object
for (const [skillE, chDesc] of Object.entries(challengeMap)) {
  // Find the skill object that has this e-name but is NOT the first of its type
  // Pattern: {"t":"...","n":"...","e":"Skill_E_Name",...}
  // We need to find all occurrences and add ch only if it's not the first of its type
  
  // Simpler approach: find each occurrence and add 'ch' if not already default
  const regex = new RegExp(`\\{"t":"(\\w+)","n":"[^"]*","e":"${skillE}","d":"[^"]*"`, 'g');
  let match;
  const replacements = [];
  
  // Reset regex by creating new one
  const r2 = new RegExp(`\\{"t":"(\\w+)","n":"[^"]*","e":"${skillE}","d":"[^"]*"(,"cd":"[^"]*")?(,"pc":"[^"]*")?`, 'g');
  while ((match = r2.exec(updated)) !== null) {
    const skillType = match[1];
    // Check if this is the first skill of this type in its survivor block
    // by searching backwards for the same skill type
    const before = updated.substring(0, match.index);
    const survStart = before.lastIndexOf('{"n":"');
    const typeCount = (before.substring(survStart).match(new RegExp(`"t":"${skillType}"`, 'g')) || []).length;
    
    if (typeCount > 0) {
      // This is an alternate skill - has predecessors of same type, so it's unlockable
      // But actually we need to know if ANY skill of this type came before this one
      // If yes -> this is alternate, add ch
      replacements.push({ index: match.index, length: match[0].length, type: skillType });
    }
  }
  
  // Actually, the simpler approach: for each survivor block, group skills by type
  // First skill = default, rest = add 'ch'
  // This is complex to do with regex. Let me use a different approach.
}

// Actually, this regex approach is too fragile. Let me take a simpler approach:
// For each survivor, after the skill data, append 'ch' at the skill level based on position.

// Better approach: directly modify the html string by finding alt skills and adding ch field
// We know alt skills are in challengeMap, and they're always after the first skill of same type in their survivor block

// Let me just do targeted string replacements for each skill
for (const [skillE, chDesc] of Object.entries(challengeMap)) {
  // Pattern to match: "e":"SkillName","d":"..." with optional cd and pc
  // We want to add ,"ch":"description" before the closing }
  // But only for alternate skills (not the first of its type)
  
  // Find: "e":"SkillName","d":"...description..."}
  // Replace with: "e":"SkillName","d":"...description...","ch":"chDesc"}
  
  const escE = skillE.replace(/[-'!]/g, '\\$&');
  // Match: skills that have this e-name and are followed by closing } (end of skill object)
  updated = updated.replace(
    new RegExp(`"e":"${escE}","d":"([^"]*)"(,"cd":"([^"]*)")?(,"pc":"([^"]*)")?\\}`, 'g'),
    function(fullMatch, desc, cdGroup, cdVal, pcGroup, pcVal) {
      // Only add ch to alt skills (those that appear after first of same type in their block)
      // Since we can't easily determine this with regex, add ch always and let the render logic handle it
      // Actually, the render logic ALREADY treats first skill as default and rest as alternates
      // So we should add ch to ALL matching skills that are alternates
      // But with regex alone we can't tell if it's first of type or not
      
      // Use a simpler heuristic: if this match appears in the challengeMap, it's likely an alternate
      return `"e":"${skillE}","d":"${desc}","ch":"${chDesc}"${cdGroup || ''}${pcGroup || ''}}`;
    }
  );
}

// Apply the changes
html = html.substring(0, start) + updated + html.substring(end);
fs.writeFileSync(htmlFile, html);
console.log('Updated skill unlock data');
