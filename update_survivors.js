const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlFile, 'utf8');

// Find the section boundaries
const survStart = html.indexOf('var SURVIVORS = [');
const artStart = html.indexOf('var ARTIFACTS = [');

if (survStart === -1 || artStart === -1) {
  console.log('ERROR: Could not find markers');
  process.exit(1);
}

// Find the "];" that ends SURVIVORS, just before the ARTIFACTS comment
const section = html.substring(survStart, artStart);
const lastBracket = section.lastIndexOf('];\n\n');
const actualEnd = survStart + lastBracket + 2; // after ']'

console.log('SURVIVORS starts at', survStart, 'ends at', actualEnd);

// Build new SURVIVORS data (compact)
const newData = `var SURVIVORS = [
  {"n":"指挥官","en":"Commando","hp":110,"hl":33,"dg":12,"dl":2.4,"ar":0,"uk":"默认解锁",
    "sk":[{"t":"pri","n":"双发","e":"Double_Tap","d":"快速射击，每发造成100%伤害","pc":"1.0"},{"t":"sec","n":"相位弹","e":"Phase_Round","d":"发射穿透弹造成300%伤害","cd":"3s","pc":"1.0"},{"t":"sec","n":"相位冲击","e":"Phase_Blast","d":"近距离两发8x200%伤害","cd":"3s","pc":"0.5x8"},{"t":"uti","n":"战术翻滚","e":"Tactical_Dive","d":"向前翻滚躲避攻击","cd":"4s"},{"t":"uti","n":"战术滑铲","e":"Tactical_Slide","d":"滑铲移动可射击","cd":"4s"},{"t":"spe","n":"压制火力","e":"Suppressive_Fire","d":"连续射击眩晕","cd":"9s","pc":"1.0x6+"},{"t":"spe","n":"破片手雷","e":"Frag_Grenade","d":"手雷700%伤害,2发充能","cd":"5s","pc":"1.0"}]},
  {"n":"女猎手","en":"Huntress","hp":90,"hl":27,"dg":12,"dl":2.4,"ar":0,"uk":"默认解锁",
    "sk":[{"t":"pri","n":"速射","e":"Strafe","d":"追踪箭150%伤害可移动射击","pc":"1.0"},{"t":"pri","n":"箭雨","e":"Flurry","d":"3发追踪箭各100%伤害","pc":"0.7x3"},{"t":"sec","n":"激光战刃","e":"Laser_Glaive","d":"弹射6次250%伤害+10%/次","cd":"7s","pc":"0.8"},{"t":"uti","n":"闪现","e":"Blink","d":"向前传送","cd":"7s"},{"t":"uti","n":"相位闪现","e":"Phase_Blink","d":"短距传送3发充能","cd":"2s"},{"t":"spe","n":"箭雨","e":"Arrow_Rain","d":"传送空中区域330%/s伤害","cd":"12s","pc":"0.2"},{"t":"spe","n":"弩箭","e":"Ballista","d":"后退发射3发各900%伤害","cd":"12s","pc":"1.0x3"}]},
  {"n":"亡命之徒","en":"Bandit","hp":110,"hl":33,"dg":12,"dl":2.4,"ar":0,"uk":"完成第一关",
    "sk":[{"t":"pas","n":"背刺","e":"Backstab","d":"从背后攻击必定暴击"},{"t":"pri","n":"爆裂","e":"Burst","d":"霰弹5x100%,4发装填","pc":"0.5x5"},{"t":"pri","n":"步枪","e":"Blast","d":"步枪330%伤害,4发装填","pc":"1.0"},{"t":"sec","n":"锯齿匕首","e":"Serrated_Dagger","d":"冲刺360%伤害,暴击出血","cd":"4s","pc":"1.0"},{"t":"sec","n":"锯齿飞刀","e":"Serrated_Shiv","d":"飞刀240%伤害,暴击出血","cd":"4s","pc":"1.0"},{"t":"uti","n":"烟雾弹","e":"Smoke_Bomb","d":"200%+隐身+200%伤害","cd":"6s","pc":"1.0"},{"t":"spe","n":"致命一击","e":"Lights_Out","d":"左轮600%,击杀重置冷却","cd":"4s","pc":"1.0"},{"t":"spe","n":"亡命之徒","e":"Desperado","d":"左轮600%,击杀+10%伤害","cd":"4s","pc":"1.0"}]},
  {"n":"MUL-T","en":"MUL-T","hp":200,"hl":60,"dg":11,"dl":2.2,"ar":12,"uk":"通关一次",
    "sk":[{"t":"pri","n":"自动钉枪","e":"Auto-Nailgun","d":"每发70%伤害,12发齐射","pc":"0.6"},{"t":"pri","n":"钢筋枪","e":"Rebar_Puncher","d":"穿透600%伤害","cd":"1.8s","pc":"1.0"},{"t":"pri","n":"废料发射器","e":"Scrap_Launcher","d":"火箭爆炸360%伤害","cd":"1.5s","pc":"1.0"},{"t":"pri","n":"动力锯","e":"Power-Saw","d":"锯割1000%/s","pc":"1.0"},{"t":"sec","n":"爆裂罐","e":"Blast_Canister","d":"220%+眩晕炸弹","cd":"6s","pc":"1.0"},{"t":"uti","n":"运输模式","e":"Transport_Mode","d":"冲刺+200护甲","cd":"6s","pc":"1.0"},{"t":"spe","n":"切换武器","e":"Retool","d":"携带两件装备切换","cd":"0.5s"},{"t":"spe","n":"动力模式","e":"Power_Mode","d":"双持+100护甲-60%移速","cd":"5s"}]},
  {"n":"工程师","en":"Engineer","hp":130,"hl":39,"dg":14,"dl":2.8,"ar":0,"uk":"累计完成30关",
    "sk":[{"t":"pri","n":"弹跳手雷","e":"Bouncing_Grenades","d":"充能最多8颗各100%","pc":"1.0x8"},{"t":"sec","n":"热能地雷","e":"Pressure_Mines","d":"两段地雷充能900%","cd":"8s","pc":"1.0"},{"t":"sec","n":"蜘蛛地雷","e":"Spider_Mines","d":"自动追击600%伤害","cd":"8s","pc":"1.0"},{"t":"uti","n":"泡沫护盾","e":"Bubble_Shield","d":"阻挡投射物15s","cd":"25s"},{"t":"uti","n":"热导鱼叉","e":"Thermal_Harpoons","d":"追踪鱼叉各500%","cd":"2.5s","pc":"1.0"},{"t":"spe","n":"高斯加农炮台","e":"TR12_Gauss_Auto-Turret","d":"炮塔继承物品100%伤害","cd":"30s","pc":"1.0"},{"t":"spe","n":"碳化移动炮塔","e":"TR58_Carbonizer_Turret","d":"移动炮塔激光200%/s","cd":"30s","pc":"0.6"}]},
  {"n":"工匠","en":"Artificer","hp":110,"hl":33,"dg":12,"dl":2.4,"ar":0,"uk":"月球币10个购买",
    "sk":[{"t":"pas","n":"ENV战衣","e":"ENV_Suit","d":"按住跳跃空中悬浮"},{"t":"pri","n":"火焰箭","e":"Flame_Bolt","d":"280%点燃储存4发","cd":"1.3s","pc":"1.0"},{"t":"pri","n":"等离子箭","e":"Plasma_Bolt","d":"280%爆炸储存4发","cd":"1.3s","pc":"1.0"},{"t":"sec","n":"充能纳米炸弹","e":"Charged_Nano-Bomb","d":"充能400%-2000%","cd":"5s","pc":"1.0"},{"t":"sec","n":"纳米矛","e":"Cast_Nano-Spear","d":"充能穿透400%-1200%冰冻","cd":"5s","pc":"1.0"},{"t":"uti","n":"冰封","e":"Snapfreeze","d":"冰柱屏障100%冰冻","cd":"12s","pc":"1.0"},{"t":"spe","n":"火焰喷射器","e":"Flamethrower","d":"持续喷火2000%点燃","cd":"5s","pc":"1.0"},{"t":"spe","n":"离子浪涌","e":"Ion_Surge","d":"向上冲刺爆炸800%","cd":"8s","pc":"1.0"}]},
  {"n":"雇佣兵","en":"Mercenary","hp":110,"hl":33,"dg":12,"dl":2.4,"ar":20,"uk":"通过第7关",
    "sk":[{"t":"pas","n":"二段跳","e":"Cybernetic_Enhancements","d":"可以二段跳"},{"t":"pri","n":"激光剑","e":"Laser_Sword","d":"3连斩130%,第3击暴露","pc":"1.0"},{"t":"sec","n":"旋风斩","e":"Whirlwind","d":"水平双斩2x200%","cd":"2.5s","pc":"1.0"},{"t":"sec","n":"升龙斩","e":"Rising_Thunder","d":"上挑550%跃空","cd":"2.5s","pc":"1.0"},{"t":"uti","n":"致盲冲刺","e":"Blinding_Assault","d":"冲刺300%,命中再冲","cd":"8s","pc":"1.0"},{"t":"uti","n":"集中攻击","e":"Focused_Assault","d":"冲刺700%+暴露","cd":"8s","pc":"1.0"},{"t":"spe","n":"剔骨","e":"Eviscerate","d":"多次攻击无敌","cd":"6s","pc":"1.0x7+"},{"t":"spe","n":"切割风暴","e":"Slicing_Winds","d":"剑气3敌人8x100%","cd":"6s","pc":"1.0"}]},
  {"n":"REX","en":"REX","hp":130,"hl":39,"dg":12,"dl":2.4,"ar":20,"uk":"将燃料阵列带到深渊",
    "sk":[{"t":"pas","n":"自然毒素","e":"Natural_Toxins","d":"攻击削弱-40%移速伤害-30护甲"},{"t":"pri","n":"注射指令","e":"DIRECTIVE_Inject","d":"三连射3x80%削弱+回复","pc":"0.5x3"},{"t":"sec","n":"钻探指令","e":"DIRECTIVE_Drill","d":"种子弹幕450%/s","cd":"6s","pc":"0.5"},{"t":"sec","n":"种子弹幕","e":"Seed_Barrage","d":"消耗15%HP迫击炮450%","cd":"0.5s","pc":"1.0"},{"t":"uti","n":"驱散指令","e":"DIRECTIVE_Disperse","d":"音爆推开+削弱","cd":"5.5s"},{"t":"uti","n":"荆棘弹幕","e":"Bramble_Volley","d":"消耗20%HP音爆550%+回复","cd":"5.5s","pc":"0.5"},{"t":"spe","n":"收割指令","e":"DIRECTIVE_Harvest","d":"弩箭330%掉落治疗","cd":"6s","pc":"1.0"},{"t":"spe","n":"缠绕生长","e":"Tangling_Growth","d":"HP25%植物缠绕200%+回复","cd":"12s","pc":"1.0"}]},
  {"n":"装载机","en":"Loader","hp":160,"hl":48,"dg":12,"dl":2.4,"ar":20,"uk":"在Siren's Call打爆蛋",
    "sk":[{"t":"pas","n":"废料护盾","e":"Scrap_Barrier","d":"免疫坠落拳击得护盾"},{"t":"pri","n":"铁拳","e":"Knuckleboom","d":"重拳320%","pc":"1.0"},{"t":"sec","n":"抓钩","e":"Grapple_Fist","d":"抓钩拉向目标80m","cd":"5s"},{"t":"sec","n":"尖刺抓钩","e":"Spiked_Fist","d":"抓钩320%拉回目标","cd":"5s","pc":"1.0"},{"t":"uti","n":"充能拳","e":"Charged_Gauntlet","d":"穿透600%-2700%","cd":"5s","pc":"1.0"},{"t":"uti","n":"雷电拳","e":"Thunder_Gauntlet","d":"单体2100%+锥形1000%","cd":"5s","pc":"1.0"},{"t":"spe","n":"M551电塔","e":"M551_Pylon","d":"浮空电塔100%/s","cd":"20s","pc":"0.5"},{"t":"spe","n":"雷霆震击","e":"Thunderslam","d":"砸地2000%范围","cd":"8s","pc":"1.0"}]},
  {"n":"吐酸狗","en":"Acrid","hp":160,"hl":48,"dg":15,"dl":3,"ar":20,"uk":"通关9个不同地图",
    "sk":[{"t":"pas","n":"毒素","e":"Poison","d":"中毒1%最大HP/s或100%基础/s10秒"},{"t":"pas","n":"枯萎","e":"Blight","d":"可叠加枯萎60%/s5秒"},{"t":"pri","n":"撕裂","e":"Vicious_Wounds","d":"撕咬200%第3击400%+回复","pc":"1.0"},{"t":"sec","n":"神经毒剂","e":"Neurotoxin","d":"毒液240%中毒","cd":"2s","pc":"1.0"},{"t":"sec","n":"贪噬咬","e":"Ravenous_Bite","d":"撕咬320%损血越高越痛+回复","cd":"2s","pc":"1.0"},{"t":"uti","n":"腐蚀跳跃","e":"Caustic_Leap","d":"落地320%+酸液池","cd":"6s","pc":"1.0"},{"t":"uti","n":"狂暴跳跃","e":"Frenzied_Leap","d":"落地550%每中-2s冷却","cd":"10s","pc":"1.0"},{"t":"spe","n":"瘟疫","e":"Epidemic","d":"疾病100%弹射20目标","cd":"10s","pc":"1.0"}]},
  {"n":"队长","en":"Captain","hp":110,"hl":33,"dg":12,"dl":2.4,"ar":0,"uk":"通关最终Boss",
    "sk":[{"t":"pas","n":"防御微型机器人","e":"Defensive_Microbots","d":"被动击落投射物"},{"t":"pri","n":"火神散弹枪","e":"Vulcan_Shotgun","d":"蓄力8x120%散射","pc":"0.75x8"},{"t":"sec","n":"电击器","e":"Power_Tazer","d":"100%+震击5s","cd":"6s","pc":"1.0"},{"t":"uti","n":"轨道探测器","e":"Orbital_Probe","d":"1-3次轨道1000%打击","cd":"11s","pc":"1.0"},{"t":"uti","n":"DIABLO打击","e":"DIABLO_Strike","d":"20s后40000%动能打击","cd":"40s","pc":"1.0"},{"t":"spe","n":"补给信标","e":"Orbital_Supply_Beacon","d":"每阶段2次:治疗/震击/补给/骇入"}]},
  {"n":"狙击手","en":"Railgunner","hp":110,"hl":33,"dg":12,"dl":2.4,"ar":0,"uk":"拥有虚空DLC","dl":"虚空",
    "sk":[{"t":"pas","n":"磁力加速","e":"Magnetic_Accelerator","d":"暴击率转暴击伤害加成"},{"t":"pri","n":"智能弹","e":"XQR_Smart_Round_System","d":"追踪弹100%,4发/秒","pc":"1.0"},{"t":"sec","n":"M99狙击镜","e":"M99_Sniper","d":"远程镜磁轨炮1000%穿透"},{"t":"sec","n":"HH44精确镜","e":"HH44_Marksman","d":"短程镜快速磁轨炮400%"},{"t":"uti","n":"震荡装置","e":"Concussion_Device","d":"推开自身+敌人2发","cd":"6s"},{"t":"uti","n":"极地力场","e":"Polar_Field_Device","d":"减速敌人和投射物","cd":"12s"},{"t":"spe","n":"超充能","e":"Supercharge","d":"穿透4000%+150%弱点","cd":"15s","pc":"3.0"},{"t":"spe","n":"冰充能","e":"Cryocharge","d":"穿透2000%+冰冻","cd":"15s","pc":"1.5"}]},
  {"n":"虚空魔","en":"Void Fiend","hp":110,"hl":33,"dg":12,"dl":2.4,"ar":0,"uk":"通关The Planetarium","dl":"虚空",
    "sk":[{"t":"pas","n":"虚空腐败","e":"Void_Corruption","d":"腐败满技能变激进形态"},{"t":"pri","n":"淹没","e":"Drown","d":"减速光束300%","pc":"1.0"},{"t":"pri","n":"腐败淹没","e":"Corrupted_Drown","d":"短程光束2000%/s","pc":"0.625"},{"t":"sec","n":"洪水","e":"Flood","d":"等离子导弹600%可充1100%","cd":"4s","pc":"1.0"},{"t":"sec","n":"腐败洪水","e":"Corrupted_Flood","d":"弧形炸弹1100%","cd":"4s","pc":"1.0"},{"t":"uti","n":"穿越","e":"Trespass","d":"消失清除减益弧形移动","cd":"5s"},{"t":"uti","n":"腐败穿越","e":"Corrupted_Trespass","d":"消失清除减益快移","cd":"5s"},{"t":"spe","n":"压制","e":"Suppress","d":"25%腐败换25%HP"},{"t":"spe","n":"腐败压制","e":"Corrupted_Suppress","d":"25%HP换25%腐败"}]},
  {"n":"追寻者","en":"Seeker","hp":115,"hl":34,"dg":12,"dl":2.4,"ar":20,"uk":"拥有风暴DLC","dl":"风暴",
    "sk":[{"t":"pas","n":"内在力量","e":"Inner_Strength","d":"宁静层数增强技能最多7层"},{"t":"pri","n":"灵气冲击","e":"Spirit_Punch","d":"穿透250%第3击350%+减速","pc":"1.0"},{"t":"sec","n":"无形之手","e":"Unseen_Hand","d":"穿透灵手600%+治疗","cd":"6s","pc":"1.0"},{"t":"sec","n":"灵魂螺旋","e":"Soul_Spiral","d":"螺旋150%+屏障","cd":"7s","pc":"1.0"},{"t":"uti","n":"飞升","e":"Sojourn","d":"飞行+爆炸500%","cd":"8s","pc":"1.0"},{"t":"uti","n":"缓刑","e":"Reprieve","d":"屏障+飞行旋风","cd":"9s","pc":"1.0"},{"t":"spe","n":"冥想","e":"Meditate","d":"专注爆射300%+治疗+宁静","cd":"14s","pc":"0.8"},{"t":"spe","n":"掌爆","e":"Palm_Blast","d":"充能400%-700%+治疗","cd":"12s","pc":"1.0"}]},
  {"n":"伪子","en":"False Son","hp":180,"hl":54,"dg":12,"dl":2.4,"ar":0,"uk":"击败False Son","dl":"风暴",
    "sk":[{"t":"pas","n":"月蚀篡改","e":"Lunar_Tampering","d":"未用月刺+5%攻速护甲,已用+5%移速回复"},{"t":"pri","n":"遗弃者之棒","e":"Club_of_the_Forsaken","d":"挥击450%充能重击1000%","pc":"1.0"},{"t":"sec","n":"月刺","e":"Lunar_Spikes","d":"200%伤害月蚀印记增伤","cd":"4s","pc":"1.0"},{"t":"sec","n":"月之桩","e":"Lunar_Stakes","d":"穿透300%延迟闪电","cd":"11s","pc":"1.0"},{"t":"uti","n":"兄弟之步","e":"Step_of_the_Brothers","d":"冲刺爆炸200%2次充能","cd":"8s","pc":"1.0"},{"t":"uti","n":"子午线意志","e":"Meridians_Will","d":"传送爆炸150%牵引3倍被动","cd":"10s"},{"t":"spe","n":"圣父激光","e":"Laser_of_the_Father","d":"充能240%-1400%4秒","cd":"15s","pc":"0.45"},{"t":"spe","n":"激光爆裂","e":"Laser_Burst","d":"穿透1250%+回复月刺","cd":"8s","pc":"1.0"}]},
  {"n":"厨师","en":"CHEF","hp":110,"hl":33,"dg":12,"dl":2.4,"ar":0,"uk":"拥有风暴DLC","dl":"风暴",
    "sk":[{"t":"pas","n":"厨师之吻","e":"CHEFs_Kiss","d":"2种技能击杀烹饪掉落食物"},{"t":"pri","n":"切丁","e":"Dice","d":"菜刀200%悬空持续伤害","pc":"1.0"},{"t":"sec","n":"炙烤","e":"Sear","d":"喷射火焰600%点燃","cd":"6s","pc":"1.0"},{"t":"sec","n":"冷冻盒","e":"Ice_Box","d":"冰块3x150%6层冰冻","cd":"5s","pc":"1.0"},{"t":"uti","n":"翻滚","e":"Roll","d":"擀面杖冲刺300%-600%","cd":"8s","pc":"1.0"},{"t":"uti","n":"油溅","e":"Oil_Spill","d":"旋转上跃砸下200%连4次","cd":"10s","pc":"1.0"},{"t":"spe","n":"上油","e":"Glaze","d":"油团7x250%油渍虚弱","cd":"12s","pc":"1.0"},{"t":"spe","n":"是的,厨师!","e":"Yes_CHEF","d":"400%点燃/霜冻强化技能","cd":"10s","pc":"1.0"}]},
  {"n":"操作员","en":"Operator","hp":90,"hl":27,"dg":12,"dl":2.4,"ar":0,"uk":"拥有合金DLC","dl":"合金",
    "sk":[{"t":"pas","n":"无人机技术","e":"Drone_Tech","d":"每阶段2架无人机跟随"},{"t":"pri","n":"H3-11手枪","e":"H3-11_OCR_Custom","d":"手枪150%-600%弹跳充能","pc":"1.0"},{"t":"sec","n":"管理覆盖","e":"ADMIN-OVERRIDE","d":"指挥无人机特殊技能","cd":"4s","pc":"1.0"},{"t":"sec","n":"集群指令","e":"CMD-SWARM","d":"无人机撞击450%","cd":"3s","pc":"1.0"},{"t":"uti","n":"升空协议","e":"Ascent_Protocol","d":"无人机升空滑翔","cd":"7s"},{"t":"uti","n":"火墙","e":"FIREWALL","d":"护盾释放200%-600%","cd":"8s","pc":"1.0"},{"t":"spe","n":"弹射核心","e":"Ejection_Core","d":"无人机击飞300%+纳米虫","cd":"8s","pc":"1.0"},{"t":"spe","n":"增幅核心","e":"Amp_Core","d":"吸收充能爆炸300-2000%","cd":"8s","pc":"1.0"}]},
  {"n":"漂流者","en":"Drifter","hp":170,"hl":52,"dg":12,"dl":2.4,"ar":20,"uk":"拥有合金DLC","dl":"合金",
    "sk":[{"t":"pas","n":"变废为宝","e":"Trash_to_Treasure","d":"废料增益:白+移速绿+回复红+攻速黄-冷却"},{"t":"pri","n":"钝击","e":"Blunt_Force","d":"猛击170%第3击350%眩晕掉落废品","pc":"1.0"},{"t":"sec","n":"清理","e":"Cleanup","d":"碎片4x100%+随机物品","cd":"6s","pc":"1.0"},{"t":"sec","n":"废品方块","e":"Junk_Cube","d":"方块400%击打发射爆炸800%","cd":"8s","pc":"1.0"},{"t":"uti","n":"回收","e":"Repossess","d":"装袋怪物/物品投出","cd":"7s","pc":"1.0"},{"t":"uti","n":"龙卷重击","e":"Tornado_Slam","d":"旋转每击220%重击600%","cd":"8s","pc":"1.0"},{"t":"spe","n":"废料利用","e":"Salvage","d":"8废品生成4临时物品","cd":"30s"},{"t":"spe","n":"修补","e":"Tinker","d":"8废品冲击波100%+修补物品","cd":"30s","pc":"1.0"}]},
  {"n":"异端","en":"Heretic","hp":440,"hl":132,"dg":18,"dl":3.6,"ar":0,"uk":"同时持有4件异端物品","dl":"特殊",
    "sk":[{"t":"pri","n":"渴望凝视","e":"Hungering_Gaze","d":"追踪碎片爆炸120%,12发","cd":"2s装填","pc":"0.1"},{"t":"sec","n":"切割风暴","e":"Slicing_Maelstrom","d":"风暴875%/s,3s后爆炸700%+束缚","cd":"5s","pc":"0.2"},{"t":"uti","n":"暗影步","e":"Shadowfade","d":"无形+30%移速回复18.2%HP3秒","cd":"6s"},{"t":"spe","n":"毁灭","e":"Ruin","d":"叠加标记引爆300%+120%/层","cd":"8s","pc":"1.0"}]}
];`;

// Replace the SURVIVORS array content
html = html.substring(0, survStart) + newData + html.substring(actualEnd + 1);

// Update renderSurvivors to use the new field names and add skill icons
const oldRender = `    var skillsHtml = sv.skills.map(function(sk){
      var tm = SKILL_TYPE_MAP[sk.t] || {cls:"",tagCls:"",label:sk.t};
      return '<div class="skill-item ' + tm.cls + '">' +
        '<span class="skill-tag ' + tm.tagCls + '">' + tm.label + '</span>' +
        '<div class="skill-info">' +
          '<span class="skill-name">' + sk.n + '<span class="skill-name-en">' + sk.en + '</span></span>' +
          '<div class="skill-desc">' + sk.d + (sk.cd ? ' <span class="skill-cd">' + sk.cd + '</span>' : '') + '</div>' +
        '</div></div>';
    }).join("");`;

const newRender = `    var statsHtml = '<span>HP ' + sv.hp + '(+' + sv.hl + ')</span><span>DMG ' + sv.dg + '(+' + sv.dl + ')</span><span>ARM ' + sv.ar + '</span>';
    var iconFile = 'icons/survivor_' + sv.en.replace(/'/g,'').replace(/ /g,'_').replace(/-/g,'-') + '.webp';
    var dlcBadge = sv.dl ? '<span class="survivor-dlc-badge" style="background:' + (SURVIVOR_DLC_COLORS[sv.dl]||{}).bg + ';color:' + (SURVIVOR_DLC_COLORS[sv.dl]||{}).fg + '">' + sv.dl + ' DLC</span>' : '';
    var skillsHtml = sv.sk.map(function(sk){
      var tm = SKILL_TYPE_MAP[sk.t] || {cls:"",tagCls:"",label:sk.t};
      var icn = 'icons/skill_' + sk.e.replace(/'/g,'').replace(/:/g,'').replace(/!/g,'').replace(/\\(/g,'').replace(/\\)/g,'') + '.webp';
      return '<div class="skill-item ' + tm.cls + '">' +
        '<div class="skill-icon-wrap"><img src="' + icn + '" class="skill-icon" alt="" onerror="this.style.display=\\'none\\'"><span class="skill-tag ' + tm.tagCls + '">' + tm.label + '</span></div>' +
        '<div class="skill-info">' +
          '<span class="skill-name">' + sk.n + '<span class="skill-name-en">' + sk.e.replace(/_/g,' ') + '</span></span>' +
          '<div class="skill-desc">' + sk.d + (sk.cd ? ' <span class="skill-cd">CD ' + sk.cd + '</span>' : '') + (sk.pc ? ' <span class="skill-cd">PC ' + sk.pc + '</span>' : '') + '</div>' +
        '</div></div>';
    }).join("");`;

html = html.replace(oldRender, newRender);

// Also update the survivor stats rendering (field names changed from hpLvl/dmgLvl to hl/dl)
const oldStats = `<span>HP ' + sv.hp + '(+' + sv.hpLvl + ')</span>' +
      '<span>DMG ' + sv.dmg + '(+' + sv.dmgLvl + ')</span>' +
      '<span>ARM ' + sv.armor + '</span>'`;

// Remove the duplicate stats line since I included it in newRender
// Let me find and remove the old stats var
const oldStatsVar = `var statsHtml = '<span>HP ' + sv.hp + '(+' + sv.hpLvl + ')</span>' +
      '<span>DMG ' + sv.dmg + '(+' + sv.dmgLvl + ')</span>' +
      '<span>ARM ' + sv.armor + '</span>';`;
      
html = html.replace(oldStatsVar, '');

// Also fix the name field in survivor header (used to be sv.name, now sv.n)
const oldSurvName = "var bgCol = SURVIVOR_BG_COLORS[idx % SURVIVOR_BG_COLORS.length];";
const newSurvName = "var bgCol = SURVIVOR_BG_COLORS[idx % SURVIVOR_BG_COLORS.length];";
// Update sv.name -> sv.n, sv.nameEn -> sv.en, sv.unlock -> sv.uk, sv.dlc -> sv.dl
html = html.replace(/sv\.name/g, 'sv.n');
html = html.replace(/sv\.nameEn/g, 'sv.en');
html = html.replace(/sv\.unlock/g, 'sv.uk');
html = html.replace(/sv\.dlc/g, 'sv.dl');

// Add CSS for skill icons
html = html.replace('.skill-item{display:flex', '.skill-icon-wrap{width:36px;height:36px;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:rgba(255,255,255,0.05)}.skill-icon{width:100%;height:100%;object-fit:contain}.skill-item{display:flex');

fs.writeFileSync(htmlFile, html);
console.log('Updated index.html successfully!');
