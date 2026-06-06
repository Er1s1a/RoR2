const fs=require('fs');
let c=fs.readFileSync('D:/雨2小程序/index.html','utf8');
const oldStart=c.indexOf('// ===== RENDER SURVIVORS =====');
const nextFuncIdx=c.indexOf('function renderArtifacts()', oldStart);

const newCode=`// ===== RENDER SURVIVORS =====
var SURVIVOR_DLC_COLORS = {
  "虚空":{bg:"rgba(163,113,247,0.15)",fg:"#a371f7"},
  "风暴":{bg:"rgba(34,211,238,0.15)",fg:"#22d3ee"},
  "合金":{bg:"rgba(210,153,34,0.15)",fg:"#d29922"},
  "特殊":{bg:"rgba(232,121,249,0.15)",fg:"#e879f9"}
};

function renderSurvivors() {
  var container = document.getElementById("survivors");
  var filtered = SURVIVORS.slice();
  if (searchTerm) {
    var s = searchTerm.toLowerCase();
    filtered = filtered.filter(function(sv){
      return sv.n.toLowerCase().indexOf(s) !== -1 ||
        sv.en.toLowerCase().indexOf(s) !== -1 ||
        sv.uk.toLowerCase().indexOf(s) !== -1 ||
        (sv.dc||"").toLowerCase().indexOf(s) !== -1 ||
        sv.sk.some(function(sk){ return sk.n.indexOf(s) !== -1 || sk.e.toLowerCase().indexOf(s) !== -1; });
    });
  }
  document.getElementById("count").textContent = "共 " + filtered.length + " 位角色";
  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results">没有找到匹配的角色</div>';
    return;
  }
  container.innerHTML = filtered.map(function(sv,idx){
    var iconFile = 'icons/survivor_' + sv.en.replace(/'/g,'').replace(/ /g,'_').replace(/-/g,'-') + '.webp';
    return '<div class="survivor-card" onclick="openSurvivorModal(' + idx + ')">' +
      '<div class="sv-portrait"><img src="' + iconFile + '" alt="" onerror="this.parentElement.innerHTML=\\'<span style=font-size:1.2rem;font-weight:700;color:#e6edf3>' + sv.n.slice(0,2) + '<\\/span>\\'"></div>' +
      '<div class="sv-name">' + sv.n + '</div>' +
      '<div class="sv-en">' + sv.en + '</div>' +
      '<div class="sv-stats"><span class="sv-hp">HP ' + sv.hp + '</span><span class="sv-dmg">DMG ' + sv.dg + '</span><span class="sv-arm">ARM ' + sv.ar + '</span></div>' +
      (sv.dc ? '<div class="sv-dlc" style="background:' + (SURVIVOR_DLC_COLORS[sv.dc]||{bg:"#333"}).bg + ';color:' + (SURVIVOR_DLC_COLORS[sv.dc]||{fg:"#aaa"}).fg + '">' + sv.dc + ' DLC</div>' : '') +
      '<div class="sv-unlock">' + sv.uk + '</div>' +
    '</div>';
  }).join("");
}

function openSurvivorModal(idx) {
  var sv = SURVIVORS[idx];
  if (!sv) return;
  var iconFile = 'icons/survivor_' + sv.en.replace(/'/g,'').replace(/ /g,'_').replace(/-/g,'-') + '.webp';
  
  var groups = {pri:[],sec:[],uti:[],spe:[],pas:[]};
  sv.sk.forEach(function(sk){ if(groups[sk.t]) groups[sk.t].push(sk); });
  
  function msCard(sk, isAlt) {
    var icn = 'icons/skill_' + sk.e.replace(/'/g,'').replace(/:/g,'').replace(/!/g,'').replace(/\\(/g,'').replace(/\\)/g,'') + '.webp';
    var altBadge = isAlt ? '<div class="ms-alt-badge">解锁替换</div>' : '';
    var unlockInfo = (isAlt && SKILL_UNLOCKS[sk.e]) ? '<div class="ms-unlock">' + SKILL_UNLOCKS[sk.e] + '</div>' : '';
    return '<div class="ms-card ' + (isAlt?'alt':'def') + '">' +
      altBadge +
      '<div class="ms-icon"><img src="' + icn + '" alt="" onerror="this.parentElement.textContent=\\''+sk.n.slice(0,2)+'\\'"></div>' +
      '<div class="ms-name">' + sk.n + '</div>' +
      '<div class="ms-desc">' + sk.d + '</div>' +
      (sk.cd ? '<span class="ms-tag">CD ' + sk.cd + '</span>' : '') +
      (sk.pc ? '<span class="ms-tag">PC ' + sk.pc + '</span>' : '') +
      unlockInfo +
    '</div>';
  }
  
  function msSlot(skills, label, cls) {
    if (!skills.length) return '<div class="ms-slot"><div class="ms-hd ' + cls + '">' + label + '</div><div class="ms-card alt"><div class="ms-desc" style="color:#30363d">-</div></div></div>';
    var h = '<div class="ms-slot"><div class="ms-hd ' + cls + '">' + label + '</div>';
    h += msCard(skills[0], false);
    for (var j = 1; j < skills.length; j++) h += msCard(skills[j], true);
    return h + '</div>';
  }
  
  var passiveHtml = groups.pas.length ? '<div class="modal-passive">' + groups.pas.map(function(p){
    return '<span class="mp-tag">被动</span><span class="mp-name">' + p.n + '</span><span class="mp-text">' + p.d + '</span>';
  }).join('') + '</div>' : '';
  
  var dialog = document.getElementById("sv-modal-dialog");
  dialog.innerHTML = 
    '<div class="modal-header">' +
      '<div class="mh-portrait"><img src="' + iconFile + '" alt="" onerror="this.parentElement.innerHTML=\\'<span style=font-size:1.3rem;font-weight:700;color:#e6edf3>' + sv.n.slice(0,2) + '<\\/span>\\'"></div>' +
      '<div class="mh-info">' +
        '<div class="mh-name">' + sv.n + '</div>' +
        '<div class="mh-en">' + sv.en + '</div>' +
        '<div class="mh-stats">' +
          '<span style="background:rgba(248,81,73,0.12);color:#fca5a5">HP ' + sv.hp + '(+' + sv.hl + ')</span>' +
          '<span style="background:rgba(210,153,34,0.12);color:#fdba74">DMG ' + sv.dg + '(+' + sv.dl + ')</span>' +
          '<span style="background:rgba(68,147,248,0.12);color:#93c5fd">ARM ' + sv.ar + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="modal-close" onclick="closeSurvivorModal()">&#10005;</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div class="mb-unlock">解锁条件：' + sv.uk + '</div>' +
      (sv.dc ? '<div class="mb-dlc" style="background:' + (SURVIVOR_DLC_COLORS[sv.dc]||{bg:"#333"}).bg + ';color:' + (SURVIVOR_DLC_COLORS[sv.dc]||{fg:"#aaa"}).fg + '">' + sv.dc + ' DLC</div>' : '') +
      passiveHtml +
      '<div class="modal-skills">' +
        msSlot(groups.pri, 'M1<span class="ms-key">左键·主要技能</span>', 'm1') +
        msSlot(groups.sec, 'M2<span class="ms-key">右键·次要技能</span>', 'm2') +
        msSlot(groups.uti, 'Shift<span class="ms-key">辅助技能</span>', 'sf') +
        msSlot(groups.spe, 'R<span class="ms-key">特殊技能</span>', 'rr') +
      '</div>' +
    '</div>';
  document.getElementById("sv-modal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeSurvivorModal() {
  document.getElementById("sv-modal").style.display = "none";
  document.body.style.overflow = "";
}

`;

c = c.substring(0, oldStart) + newCode + c.substring(nextFuncIdx);
fs.writeFileSync('D:/雨2小程序/index.html', c);
console.log('Updated. Size:', c.length);
