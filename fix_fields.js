const fs = require('fs');
const htmlFile = 'D:/雨2小程序/index.html';
let html = fs.readFileSync(htmlFile, 'utf8');

// Fix 1: In SURVIVORS array, change DLC field from "dl":"到 "dc":"
html = html.replace(/"uk":"拥有虚空DLC","dl":"虚空"/g, '"uk":"拥有虚空DLC","dc":"虚空"');
html = html.replace(/"uk":"拥有风暴DLC","dl":"风暴"/g, '"uk":"拥有风暴DLC","dc":"风暴"');
html = html.replace(/"uk":"拥有合金DLC","dl":"合金"/g, '"uk":"拥有合金DLC","dc":"合金"');
html = html.replace(/"uk":"同时持有4件异端物品","dl":"特殊"/g, '"uk":"同时持有4件异端物品","dc":"特殊"');

// Fix 2: In renderSurvivors, change sv.dl (DLC check) to sv.dc
html = html.replace(/if \(sv\.dl\) \{/g, 'if (sv.dc) {');
html = html.replace(/var dc = SURVIVOR_DLC_COLORS\[sv\.dl\]/g, 'var dc = SURVIVOR_DLC_COLORS[sv.dc]');
html = html.replace(/\(SURVIVOR_DLC_COLORS\[sv\.dl\]/g, '(SURVIVOR_DLC_COLORS[sv.dc]');
html = html.replace(/sv\.dl \+ ' DLC/g, "sv.dc + ' DLC");

// Fix 3: Remove duplicate dlcBadge variable (line 767 and 775 both declare it)
html = html.replace("    var dlcBadge = sv.dl ? '<span class=\"survivor-dlc-badge\" style=\"background:' + (SURVIVOR_DLC_COLORS[sv.dc]||{}).bg + ';color:' + (SURVIVOR_DLC_COLORS[sv.dc]||{}).fg + '\">' + sv.dc + ' DLC</span>' : '';\n", '');

fs.writeFileSync(htmlFile, html);
console.log('Fixed field conflicts');
