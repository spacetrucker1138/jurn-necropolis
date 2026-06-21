'use strict';
// ═══════════════════════════════════════════════════
//  JURN: NECROPOLIS RISING  v1.0
// ═══════════════════════════════════════════════════

const BUILDINGS = [
  { id:'grave',        name:'Unmarked Grave',              icon:'⚰️',  desc:'A lonely grave in forgotten soil. Someone keeps digging.',                flavor:'"EVERY EMPIRE BEGINS WITH A SINGLE HOLE IN THE GROUND."',   baseCost:{bones:15},                                                    production:{bones:0.1},                                             costScale:1.15, unlockAt:{bones_earned:0} },
  { id:'bone_pit',     name:'Bone Pit',                    icon:'🕳️', desc:'A deep excavation teeming with restless remains.',                        flavor:'"THE PIT DOES NOT SLEEP. NEITHER DO THE BONES."',            baseCost:{bones:100},                                                   production:{bones:0.5},                                             costScale:1.15, unlockAt:{bones_earned:50} },
  { id:'skel_worker',  name:'Skeleton Worker',             icon:'💀',  desc:'An undead laborer with an unbreakable work ethic.',                       flavor:'"NEVER LATE. NEVER TIRED. NEVER ALIVE."',                    baseCost:{bones:500},                                                   production:{bones:2},                                               costScale:1.15, unlockAt:{bones_earned:200} },
  { id:'crypt',        name:'Crypt',                       icon:'🏚️', desc:'Ancient stone halls that whisper of departed souls.',                     flavor:'"THE CRYPT REMEMBERS EVERYONE WHO EVER ENTERED."',           baseCost:{bones:3000},                                                  production:{bones:5,souls:0.1},                                     costScale:1.15, unlockAt:{bones_earned:1000},  unlockResource:'souls' },
  { id:'mausoleum',    name:'Mausoleum',                   icon:'🏛️', desc:'Grand tombs leaking spectral ectoplasm into the soil.',                   flavor:'"THE ARCHITECTURE OF DEATH. BEAUTIFUL. WRONG."',             baseCost:{bones:15000,souls:50},                                        production:{bones:15,souls:0.5,ectoplasm:0.05},                      costScale:1.15, unlockAt:{buildings_total:10}, unlockResource:'ectoplasm' },
  { id:'haunted_stage',name:'Haunted Stage',               icon:'🎸',  desc:'Where THE JURN plays. Fans materialize from the void.',                   flavor:'"THE CROWD DOESN\'T BREATHE. THEY DON\'T NEED TO."',         baseCost:{bones:80000,souls:200,ectoplasm:20},                          production:{bones:40,souls:2,ectoplasm:0.2,fan_rep:1},               costScale:1.15, unlockAt:{buildings_total:25}, unlockResource:'fan_rep' },
  { id:'cz_tower',     name:'Channel Zero Tower',          icon:'📡',  desc:'Broadcasts on frequencies that should not exist.',                        flavor:'"WE ARE TRANSMITTING FROM A PLACE OUTSIDE OF TIME."',        baseCost:{bones:400000,souls:1000,ectoplasm:100},                       production:{bones:100,souls:5,ectoplasm:1,fan_rep:2,dark_signal:0.5},costScale:1.15, unlockAt:{buildings_total:50}, unlockResource:'dark_signal' },
  { id:'portal',       name:'Graveyard Dimension Portal',  icon:'🌀',  desc:'A rift into the Graveyard Dimension. Prestige awaits.',                   flavor:'"IT DOESN\'T OPEN. IT REMEMBERS BEING OPEN."',               baseCost:{bones:2000000,souls:10000,ectoplasm:500,dark_signal:100},     production:{bones:500,souls:25,ectoplasm:5,fan_rep:10,dark_signal:2,dark_energy:0.1}, costScale:1.15, unlockAt:{buildings_total:75}, unlockResource:'dark_energy' },
  { id:'necropolis',   name:'Grand Necropolis',            icon:'🏰',  desc:'The crowning achievement. An interdimensional empire of bone.',           flavor:'"THE NECROPOLIS IS NOT A PLACE. IT IS A FREQUENCY."',        baseCost:{bones:20000000,souls:100000,ectoplasm:5000,dark_signal:1000,dark_energy:100}, production:{bones:3000,souls:150,ectoplasm:30,fan_rep:60,dark_signal:12,dark_energy:1}, costScale:1.15, unlockAt:{prestige_count:1} },
];

const UPGRADES = [
  // Click upgrades
  { id:'u_c1', icon:'⛏️', name:'Sharpened Shovel',      cost:{bones:100},     desc:'2× click power.',   effect:{click_mult:2},   req:{bones_earned:100} },
  { id:'u_c2', icon:'🦴', name:'Bone Sense',             cost:{bones:500},     desc:'5× click power.',   effect:{click_mult:5},   req:{bones_earned:500} },
  { id:'u_c3', icon:'🪦', name:'The Grave Beckons',      cost:{bones:5000},    desc:'10× click power.',  effect:{click_mult:10},  req:{bones_earned:5000} },
  { id:'u_c4', icon:'☠️', name:'Death Touch',            cost:{bones:50000},   desc:'25× click power.',  effect:{click_mult:25},  req:{bones_earned:50000} },
  { id:'u_c5', icon:'📻', name:'Graveyard Frequency',    cost:{bones:500000},  desc:'100× click power.', effect:{click_mult:100}, req:{bones_earned:500000} },
  { id:'u_c6', icon:'🌀', name:'Dimensional Pull',       cost:{bones:5000000,dark_signal:10}, desc:'500× click power.', effect:{click_mult:500}, req:{bones_earned:5000000} },
  // Grave
  { id:'u_g1', icon:'⚰️', name:'Deeper Graves',         cost:{bones:300},    desc:'Graves ×2.',  effect:{bld_mult:{grave:2}},  req:{bld_count:{grave:10}} },
  { id:'u_g2', icon:'⚰️', name:'Mass Burial',           cost:{bones:3000},   desc:'Graves ×4.',  effect:{bld_mult:{grave:4}},  req:{bld_count:{grave:25}} },
  { id:'u_g3', icon:'⚰️', name:'Bone Cathedral',        cost:{bones:30000},  desc:'Graves ×8.',  effect:{bld_mult:{grave:8}},  req:{bld_count:{grave:50}} },
  { id:'u_g4', icon:'⚰️', name:'Necro-Architecture',    cost:{bones:300000}, desc:'Graves ×16.', effect:{bld_mult:{grave:16}}, req:{bld_count:{grave:100}} },
  // Bone Pit
  { id:'u_p1', icon:'🕳️', name:'Deeper Pits',          cost:{bones:2000},   desc:'Bone Pits ×2.', effect:{bld_mult:{bone_pit:2}}, req:{bld_count:{bone_pit:10}} },
  { id:'u_p2', icon:'🕳️', name:'Ancient Veins',        cost:{bones:20000},  desc:'Bone Pits ×4.', effect:{bld_mult:{bone_pit:4}}, req:{bld_count:{bone_pit:25}} },
  { id:'u_p3', icon:'🕳️', name:'Primordial Pit',       cost:{bones:200000}, desc:'Bone Pits ×8.', effect:{bld_mult:{bone_pit:8}}, req:{bld_count:{bone_pit:50}} },
  // Skeleton Worker
  { id:'u_s1', icon:'💀', name:'Improved Spines',       cost:{bones:10000},   desc:'Workers ×2.', effect:{bld_mult:{skel_worker:2}}, req:{bld_count:{skel_worker:10}} },
  { id:'u_s2', icon:'💀', name:'Reinforced Ribcages',   cost:{bones:100000},  desc:'Workers ×4.', effect:{bld_mult:{skel_worker:4}}, req:{bld_count:{skel_worker:25}} },
  { id:'u_s3', icon:'💀', name:'Undead Efficiency',     cost:{bones:1000000}, desc:'Workers ×8.', effect:{bld_mult:{skel_worker:8}}, req:{bld_count:{skel_worker:50}} },
  // Crypt
  { id:'u_cr1', icon:'🏚️', name:'Sealed Chambers',    cost:{bones:50000,souls:100},   desc:'Crypts ×2.', effect:{bld_mult:{crypt:2}}, req:{bld_count:{crypt:10}} },
  { id:'u_cr2', icon:'🏚️', name:'Soul Conduits',      cost:{bones:500000,souls:1000}, desc:'Crypts ×4.', effect:{bld_mult:{crypt:4}}, req:{bld_count:{crypt:25}} },
  // Mausoleum
  { id:'u_m1', icon:'🏛️', name:'Grand Architecture',  cost:{bones:200000,souls:500},       desc:'Mausoleums ×2.', effect:{bld_mult:{mausoleum:2}}, req:{bld_count:{mausoleum:10}} },
  { id:'u_m2', icon:'🏛️', name:'Ecto-Carved Pillars', cost:{bones:2000000,ectoplasm:100},  desc:'Mausoleums ×4.', effect:{bld_mult:{mausoleum:4}}, req:{bld_count:{mausoleum:25}} },
  // Haunted Stage
  { id:'u_hs1', icon:'🎸', name:'Better Amp Stack',       cost:{bones:500000,fan_rep:50},   desc:'Stages ×2.', effect:{bld_mult:{haunted_stage:2}}, req:{bld_count:{haunted_stage:10}} },
  { id:'u_hs2', icon:'🎸', name:'Dimensional PA System',  cost:{bones:5000000,fan_rep:500}, desc:'Stages ×4.', effect:{bld_mult:{haunted_stage:4}}, req:{bld_count:{haunted_stage:25}} },
  // CZ Tower
  { id:'u_cz1', icon:'📡', name:'Signal Amplifier',   cost:{dark_signal:50},  desc:'CZ Towers ×2.', effect:{bld_mult:{cz_tower:2}}, req:{bld_count:{cz_tower:10}} },
  { id:'u_cz2', icon:'📡', name:'Forbidden Frequency', cost:{dark_signal:500}, desc:'CZ Towers ×4.', effect:{bld_mult:{cz_tower:4}}, req:{bld_count:{cz_tower:25}} },
  // Portal
  { id:'u_po1', icon:'🌀', name:'Dimensional Anchor', cost:{dark_energy:10},  desc:'Portals ×2.', effect:{bld_mult:{portal:2}}, req:{bld_count:{portal:5}} },
  { id:'u_po2', icon:'🌀', name:'Void Stabiliser',   cost:{dark_energy:100}, desc:'Portals ×4.', effect:{bld_mult:{portal:4}}, req:{bld_count:{portal:15}} },
  // Cross-resource
  { id:'u_xb',  icon:'💜', name:'Soul Attunement',        cost:{souls:100},      desc:'+10% global production.',            effect:{global_mult:0.10}, req:{res_amt:{souls:50}} },
  { id:'u_xe',  icon:'🫧', name:'Ectoplasmic Resonance',  cost:{ectoplasm:50},   desc:'+20% global production.',            effect:{global_mult:0.20}, req:{res_amt:{ectoplasm:25}} },
  { id:'u_xf',  icon:'🎸', name:'Underground Legend',     cost:{fan_rep:200},    desc:'+15% global production.',            effect:{global_mult:0.15}, req:{res_amt:{fan_rep:100}} },
  { id:'u_xa',  icon:'📻', name:'CZ Amplifier',           cost:{dark_signal:50}, desc:'Channel Zero event bonuses ×2.',     effect:{cz_mult:2},        req:{res_amt:{dark_signal:25}} },
  { id:'u_xde', icon:'⚡', name:'Dark Infusion',          cost:{dark_energy:5},  desc:'+100% global production.',           effect:{global_mult:1.00}, req:{res_amt:{dark_energy:1}} },
];

const CHARACTERS = [
  { id:'vox',       name:'VOX',           title:'THE SKULL',        icon:'💀', color:'#c8a84b', lore:'"The original. Architect of decay. VOX carved the Necropolis from nothing but bone and will."', bonus:'+15% ALL Bone production',       unlockReq:{bones_earned:500},      unlockMsg:'VOX HAS JOINED THE NECROPOLIS.' },
  { id:'bonecrush', name:'SIR BONECRUSH', title:'THE CRUSHER',      icon:'⚔️', color:'#aaaaaa', lore:'"The Viking of the Void. His horned helmet has been to dimensions man was not meant to see."',  bonus:'+50% click power',               unlockReq:{total_clicks:1000},     unlockMsg:'SIR BONECRUSH THUNDERS IN.' },
  { id:'riffrot',   name:'RIFF-ROT',      title:'THE ROTTING RIFF', icon:'🎸', color:'#00e87a', lore:'"His guitar strings are made of sinew and dark matter. The ectoplasm follows the music."',       bonus:'+25% Ectoplasm production',      unlockReq:{bld_owned:{mausoleum:1}},unlockMsg:'RIFF-ROT MATERIALIZES.' },
  { id:'taz',       name:'TAZ',           title:'THE WILD ONE',     icon:'🩸', color:'#ff3344', lore:'"Pink mohawk. Red eyes. When TAZ plays, crowds tear reality apart."',                             bonus:'+30% Fan Rep production',        unlockReq:{bld_owned:{haunted_stage:1}}, unlockMsg:'TAZ HAS ARRIVED.' },
  { id:'r3x',       name:'R3X',           title:'THE MACHINE',      icon:'🤖', color:'#00ccff', lore:'"Dieselpunk circuits running on Dark Energy. R3X does not sleep. R3X does not stop."',           bonus:'+100% Dark Energy + auto-click', unlockReq:{bld_owned:{portal:1}},  unlockMsg:'R3X ONLINE. SYSTEMS: ACTIVE.' },
];

const CZ_EVENTS = [
  { id:'cz_bones',  title:'SIGNAL DETECTED',         msg:'"THE BONES REMEMBER EVERYTHING."',                                     sub:'Bone production ×2 for 60s.',          effect:'bones_x2',   dur:60,  rarity:'common',    color:'#c8a84b' },
  { id:'cz_souls',  title:'GRAVEYARD FREQUENCY',      msg:'"SOULS DRIFT BETWEEN THE DIMENSIONS."',                                sub:'Instant +500 Souls.',                   effect:'soul_drop',  rarity:'common',    color:'#8855ff' },
  { id:'cz_click',  title:'VOX SENDS A MESSAGE',      msg:'"DIG FASTER. THE DIMENSION WAITS FOR NO ONE."',                        sub:'Click power ×5 for 30s.',               effect:'click_x5',   dur:30,  rarity:'uncommon',  color:'#c8a84b' },
  { id:'cz_ecto',   title:'THE BONES ARE SINGING',    msg:'"ECTOPLASMIC RESONANCE DETECTED ON ALL CHANNELS."',                    sub:'Ectoplasm ×3 for 45s.',                 effect:'ecto_x3',    dur:45,  rarity:'uncommon',  color:'#00e87a' },
  { id:'cz_sig',    title:'R3X BROADCASTING',         msg:'"FREQUENCY: UNKNOWN. SIGNAL: PERFECT. ORIGIN: NOWHERE."',             sub:'Instant +50 Dark Signal.',              effect:'signal_drop',rarity:'common',    color:'#ff3344' },
  { id:'cz_all',    title:'DIMENSIONAL INTERFERENCE', msg:'"SOMETHING APPROACHES FROM THE GRAVEYARD DIMENSION."',                 sub:'ALL production ×2 for 30s!',            effect:'all_x2',     dur:30,  rarity:'rare',      color:'#ff8c00' },
  { id:'cz_fans',   title:'LIVE BROADCAST',           msg:'"THE JURN IS PLAYING. REALITY IS LISTENING."',                         sub:'Fan Rep ×4 for 60s.',                   effect:'fan_x4',     dur:60,  rarity:'uncommon',  color:'#ff8c00' },
  { id:'cz_l1',     title:'TRANSMISSION #001',        msg:'"THE GRAVEYARD DIMENSION IS NOT A PLACE. IT IS A MEMORY."',           sub:'A fragment of the mystery.',            effect:'lore',       rarity:'rare',      color:'#8855ff' },
  { id:'cz_l2',     title:'TRANSMISSION #002',        msg:'"VOX BUILT THE FIRST GRAVE IN 1987. IN A DIMENSION THAT DID NOT EXIST YET."', sub:'A fragment of the mystery.',  effect:'lore',       rarity:'rare',      color:'#8855ff' },
  { id:'cz_l3',     title:'TRANSMISSION #003',        msg:'"CHANNEL ZERO HAS BEEN BROADCASTING SINCE BEFORE TELEVISION WAS INVENTED."', sub:'A fragment of the mystery.',    effect:'lore',       rarity:'rare',      color:'#00ccff' },
  { id:'cz_l4',     title:'TRANSMISSION #004',        msg:'"SIR BONECRUSH\'S HELMET WAS FOUND IN THREE DIFFERENT CENTURIES AT ONCE."', sub:'A fragment of the mystery.',    effect:'lore',       rarity:'rare',      color:'#aaaaaa' },
  { id:'cz_l5',     title:'TRANSMISSION #005',        msg:'"TAZ\'S MOHAWK IS A COLOR THAT HAS NO NAME IN THIS DIMENSION."',      sub:'A fragment of the mystery.',            effect:'lore',       rarity:'rare',      color:'#ff3344' },
  { id:'cz_l6',     title:'TRANSMISSION #006',        msg:'"RIFF-ROT\'S GUITAR CONTAINS THE SOUND OF EVERY CONCERT THAT WILL EVER HAPPEN."', sub:'A fragment of the mystery.', effect:'lore',    rarity:'rare',      color:'#00e87a' },
  { id:'cz_grand',  title:'⚠ ANOMALY DETECTED',       msg:'"THE NECROPOLIS IS AWAKENING. ALL SYSTEMS: CRITICAL. THIS IS NOT A TEST."', sub:'×10 ALL production for 60s!', effect:'grand_x10',  dur:60,  rarity:'legendary', color:'#ffffff' },
  { id:'cz_r3x',    title:'R3X DIAGNOSTIC',           msg:'"PROCESSING. PROCESSING. ALL BONES ACCOUNTED FOR. RESUME OPERATIONS."',sub:'Instant +5000 Bones!',                  effect:'bone_drop',  rarity:'uncommon',  color:'#00ccff' },
  { id:'cz_portal', title:'PORTAL PULSE',             msg:'"THE GRAVEYARD DIMENSION WANTS YOU BACK. IT HAS BEEN WAITING."',      sub:'Instant +10 Dark Energy.',              effect:'de_drop',    rarity:'rare',      color:'#cc88ff' },
];

const SKINS = [
  { id:'normal',  name:'THE GRAVEYARD',    cls:'',            unlockAt:0 },
  { id:'crimson', name:'CRIMSON DIMENSION',cls:'skin-crimson',unlockAt:1 },
  { id:'void',    name:'THE VOID',         cls:'skin-void',   unlockAt:3 },
  { id:'cosmic',  name:'COSMIC NECROPOLIS',cls:'skin-cosmic', unlockAt:7 },
];

const CZ_TICKER = [
  'SIGNAL DETECTED ON ALL FREQUENCIES...',
  '"THE BONES REMEMBER EVERYTHING." — VOX',
  'GRAVEYARD DIMENSION STABILITY: DECLINING...',
  'R3X SYSTEMS NOMINAL. ALL SYSTEMS NOMINAL. ALL SYSTEMS.',
  '"CHANNEL ZERO IS NOT RESPONSIBLE FOR ANY DIMENSIONAL RIFTS." — OFFICIAL STATEMENT',
  '"I SAW THE PORTAL OPEN. I SAW WHAT CAME OUT. I JOINED THE BAND." — ANONYMOUS',
  'WARNING: ECTOPLASMIC SATURATION AT CRITICAL LEVELS',
  '"THE JURN CONCERT LASTED THREE HOURS. THE AUDIENCE DID NOT AGE." — VENUE REPORT',
  'TRANSMISSION ORIGIN: UNKNOWN. SIGNAL STRENGTH: PERFECT.',
  '"SIR BONECRUSH WAS SEEN AT THE BATTLE OF HASTINGS. HE WAS NOT ON EITHER SIDE." — NOTE',
  'DIGGING CONTINUES BELOW THE SIXTH STRATUM. THIS IS EXPECTED.',
  '"TAZ\'S DRUMSTICKS ARE MADE OF BONE. WHOSE BONE? NOBODY ASKS." — TOUR RIDER',
  'THE GRAVEYARD HAS EXPANDED AGAIN. THIS IS NORMAL.',
  '"RIFF-ROT PLAYED A CHORD THAT MADE THE MOON BRIEFLY VISIBLE DURING THE DAY." — EYEWITNESS',
  'CHANNEL ZERO: BROADCASTING SINCE BEFORE TIME.',
  '"WELCOME TO THE NECROPOLIS. YOU ARE ALREADY HOME." — ENTRY PLAQUE',
  'DIMENSIONAL INTERFERENCE INCREASING. BONE PRODUCTIVITY UNAFFECTED.',
  '"THE GRAND NECROPOLIS WILL SPAN THREE DIMENSIONS BY NEXT FISCAL QUARTER." — FORECAST',
  'BONES PER SECOND: IMMEASURABLE. MEASUREMENT DISCONTINUED.',
];

// ─── PIXEL ART GRAVE ───────────────────────────────────────
const GRAVE_ART = {
  P:[
    '..SSSSSSSSS..',
    '.SSSSSSSSSSS.',
    'SSSSSSSSSSSSS',
    'SSSSSSSSSSSSS',
    'SSSDDDDDDDSS.',
    'SSSDSS.SSDSS.',
    'SSSDSS.SSDSS.',
    'SSSDDDDDDDSS.',
    'SSSSGGGGGGSS.',
    'SSSSSSSSSSSSS',
    'SSSSGE.EGSSSS',
    'SSSSSEEESSSSS',
    'SSSSSGGGSSSS.',
    'SSSSSSSSSSSSS',
    'OSSSSSSSSSSO.',
    '.OOOOOOOOOO..',
    '..SSSSSSSSSS.',
    '..SSSSSSSSSS.',
    '..OOOOOOOOOO.',
  ],
  draw(cv, phase) {
    const ctx = cv.getContext('2d');
    const pw = 10;
    ctx.clearRect(0,0,cv.width,cv.height);
    // Glow bg
    const ga = 0.12 + 0.07*Math.sin(phase);
    const gr = ctx.createRadialGradient(cv.width/2,cv.height/2,5,cv.width/2,cv.height/2,85);
    gr.addColorStop(0,`rgba(200,168,75,${ga})`);
    gr.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gr; ctx.fillRect(0,0,cv.width,cv.height);
    const gv = 0.5+0.4*Math.sin(phase);
    const cm = {
      S:'#8a8a9a', D:'#333344', O:'#1a1a2a',
      G:`rgba(200,168,75,${gv})`,
      E:`rgba(200,220,75,${gv})`,
    };
    const offX = (cv.width - 13*pw)/2;
    const offY = (cv.height - this.P.length*pw)/2;
    this.P.forEach((row,r)=>{
      for(let c=0;c<row.length;c++){
        const ch=row[c];
        if(ch==='.'||ch===' ') continue;
        ctx.fillStyle=cm[ch]||'#888';
        ctx.fillRect(offX+c*pw,offY+r*pw,pw,pw);
        ctx.fillStyle='rgba(0,0,0,0.2)';
        ctx.fillRect(offX+c*pw,offY+r*pw,pw,1);
        ctx.fillRect(offX+c*pw,offY+r*pw,1,pw);
      }
    });
    // Eye glow
    ctx.shadowColor='#c8a84b'; ctx.shadowBlur=10*gv;
    ctx.fillStyle=`rgba(200,220,75,${gv})`;
    [4,8].forEach(ec=>{ ctx.fillRect(offX+ec*pw,offY+10*pw,pw,pw); });
    ctx.shadowBlur=0;
  }
};

// ─── GAME ──────────────────────────────────────────────────
const game = {
  state:null, activeEffects:[], shopTab:'buildings',
  tickerIdx:0, czNextAt:0, r3xAutoAt:0, glowPhase:0,
  loopId:null, autosaveCtr:0, _czTimer:null,

  // ─── INIT
  init(){
    this.state = this.defState();
    this.load();
    this.checkOffline();
    this.initUI();
    this.startLoop();
    this.startAnim();
    this.scheduleCZ();
    this.rotateTicker();
  },

  defState(){
    return {
      ver:1, lastSave:Date.now(),
      res:{bones:0,souls:0,ectoplasm:0,dark_signal:0,fan_rep:0,dark_energy:0},
      bones_earned:0, total_clicks:0, buildings_total:0,
      prestige_count:0, cz_seen:0,
      upgrades:[],
      chars:[],
      bld:   Object.fromEntries(BUILDINGS.map(b=>[b.id,0])),
      bmult: Object.fromEntries(BUILDINGS.map(b=>[b.id,1])),
      gmult:1, cmult:1, czmult:1, skin:'normal', lore:[],
    };
  },

  // ─── LOOP
  startLoop(){
    if(this.loopId) clearInterval(this.loopId);
    this.loopId = setInterval(()=>this.tick(), 100);
  },

  tick(){
    const dt=0.1, s=this.state;
    const rates=this.rates();
    for(const [k,v] of Object.entries(rates)){
      s.res[k]=(s.res[k]||0)+v*dt;
    }
    s.bones_earned += rates.bones*dt;
    // R3X autoclick
    if(this.hasChar('r3x') && Date.now()>=this.r3xAutoAt){
      const cv=this.clickVal();
      s.res.bones+=cv; s.bones_earned+=cv;
      this.r3xAutoAt=Date.now()+5000;
    }
    // Expire effects
    this.activeEffects=this.activeEffects.filter(e=>Date.now()<e.exp);
    // Autosave
    if(++this.autosaveCtr>=300){ this.autosaveCtr=0; this.save(true); }
    this.checkUnlocks();
    this.checkMilestones();
    // CZ countdown
    const czIn=Math.max(0,Math.ceil((this.czNextAt-Date.now())/1000));
    const czEl=document.getElementById('cz-countdown');
    if(czEl) czEl.textContent=czIn>0?`NEXT: ${czIn}s`:'';
    this.updateUI();
  },

  // ─── ANIM
  startAnim(){
    const cv=document.getElementById('grave-canvas');
    if(!cv) return;
    const loop=()=>{
      this.glowPhase+=0.04;
      GRAVE_ART.draw(cv,this.glowPhase);
      requestAnimationFrame(loop);
    };
    loop();
  },

  // ─── PRODUCTION
  rates(){
    const s=this.state;
    const r={bones:0,souls:0,ectoplasm:0,dark_signal:0,fan_rep:0,dark_energy:0};
    const em=(t)=>this.efxMult(t);
    BUILDINGS.forEach(b=>{
      const cnt=s.bld[b.id]||0; if(!cnt) return;
      const bm=s.bmult[b.id]||1;
      for(const [res,base] of Object.entries(b.production)){
        let v=base*cnt*bm*s.gmult;
        if(res==='bones')      v*=em('bones')*em('all');
        else if(res==='ectoplasm') v*=em('ecto')*em('all');
        else if(res==='fan_rep')   v*=em('fan')*em('all');
        else v*=em('all');
        if(res==='bones'&&this.hasChar('vox'))     v*=1.15;
        if(res==='ectoplasm'&&this.hasChar('riffrot')) v*=1.25;
        if(res==='fan_rep'&&this.hasChar('taz'))   v*=1.30;
        if(res==='dark_energy'&&this.hasChar('r3x')) v*=2.0;
        r[res]=(r[res]||0)+v;
      }
    });
    return r;
  },

  efxMult(type){
    let m=1;
    this.activeEffects.forEach(e=>{ if(e.type===type||e.type==='all') m*=e.mult; });
    return m;
  },

  clickVal(){
    let v=this.state.cmult;
    if(this.hasChar('bonecrush')) v*=1.5;
    v*=this.efxMult('click')*this.efxMult('all');
    return Math.ceil(v);
  },

  bldCost(id){
    const b=BUILDINGS.find(x=>x.id===id); if(!b) return {};
    const owned=this.state.bld[id]||0;
    const sc=Math.pow(b.costScale,owned);
    const c={};
    for(const [k,v] of Object.entries(b.baseCost)) c[k]=Math.ceil(v*sc);
    return c;
  },

  canAfford(cost){
    return Object.entries(cost).every(([k,v])=>(this.state.res[k]||0)>=v);
  },

  deduct(cost){
    for(const [k,v] of Object.entries(cost))
      this.state.res[k]=Math.max(0,(this.state.res[k]||0)-v);
  },

  // ─── BUY BUILDING
  buyBuilding(id,qty=1){
    const b=BUILDINGS.find(x=>x.id===id); if(!b||!this.bldUnlocked(b)) return;
    let n=0;
    for(let i=0;i<qty;i++){
      const c=this.bldCost(id);
      if(!this.canAfford(c)) break;
      this.deduct(c);
      this.state.bld[id]=(this.state.bld[id]||0)+1;
      this.state.buildings_total++;
      n++;
    }
    if(n) this.updateUI();
  },

  buyMax(id){
    let n=0;
    while(true){
      const c=this.bldCost(id);
      if(!this.canAfford(c)) break;
      this.deduct(c);
      this.state.bld[id]=(this.state.bld[id]||0)+1;
      this.state.buildings_total++;
      if(++n>5000) break;
    }
    if(n) this.updateUI();
  },

  bldUnlocked(b){
    const s=this.state;
    if(b.unlockAt.bones_earned!==undefined && s.bones_earned<b.unlockAt.bones_earned) return false;
    if(b.unlockAt.buildings_total!==undefined && s.buildings_total<b.unlockAt.buildings_total) return false;
    if(b.unlockAt.prestige_count!==undefined && s.prestige_count<b.unlockAt.prestige_count) return false;
    return true;
  },

  // ─── BUY UPGRADE
  buyUpgrade(id){
    if(this.state.upgrades.includes(id)) return;
    const u=UPGRADES.find(x=>x.id===id); if(!u) return;
    if(!this.upgUnlocked(u)||!this.canAfford(u.cost)) return;
    this.deduct(u.cost);
    this.state.upgrades.push(id);
    this.applyUpg(u);
    this.floatMsg(`✓ ${u.name}`,'#00e87a');
    this.updateUI();
  },

  upgUnlocked(u){
    const s=this.state, r=u.req; if(!r) return true;
    if(r.bones_earned!==undefined && s.bones_earned<r.bones_earned) return false;
    if(r.bld_count){ for(const[k,v] of Object.entries(r.bld_count)) if((s.bld[k]||0)<v) return false; }
    if(r.res_amt){   for(const[k,v] of Object.entries(r.res_amt))   if((s.res[k]||0)<v) return false; }
    return true;
  },

  applyUpg(u){
    const e=u.effect,s=this.state;
    if(e.click_mult) s.cmult*=e.click_mult;
    if(e.bld_mult){ for(const[k,m] of Object.entries(e.bld_mult)) s.bmult[k]=(s.bmult[k]||1)*m; }
    if(e.global_mult) s.gmult*=(1+e.global_mult);
    if(e.cz_mult) s.czmult=(s.czmult||1)*e.cz_mult;
  },

  // ─── CLICK
  handleClick(ev){
    const v=this.clickVal();
    this.state.res.bones+=v; this.state.bones_earned+=v; this.state.total_clicks++;
    const r=ev.target.getBoundingClientRect();
    this.floatText(ev.clientX-r.left-15, ev.clientY-r.top-15, `+${this.fmt(v)}`,'#c8a84b');
  },

  // ─── UNLOCKS
  checkUnlocks(){
    const s=this.state;
    BUILDINGS.forEach(b=>{
      if(b.unlockResource&&(s.bld[b.id]||0)>0){
        const el=document.getElementById(`res-${b.unlockResource.replace('_','-')}`);
        if(el) el.classList.remove('hidden');
      }
    });
    const hasPrt=(s.bld['portal']||0)>0;
    const pb=document.getElementById('prestige-btn');
    if(pb) pb.classList.toggle('hidden',!hasPrt);
  },

  checkMilestones(){
    const s=this.state;
    CHARACTERS.forEach(c=>{
      if(s.chars.includes(c.id)) return;
      let ok=true; const r=c.unlockReq;
      if(r.bones_earned && s.bones_earned<r.bones_earned) ok=false;
      if(r.total_clicks && s.total_clicks<r.total_clicks) ok=false;
      if(r.bld_owned){ for(const[k,v] of Object.entries(r.bld_owned)) if((s.bld[k]||0)<v){ok=false;break;} }
      if(ok) this.unlockChar(c);
    });
  },

  unlockChar(c){
    this.state.chars.push(c.id);
    this.showMilestone(c.icon,c.unlockMsg,c.bonus);
    this.renderChars();
  },

  hasChar(id){ return this.state.chars.includes(id); },

  // ─── CHANNEL ZERO
  scheduleCZ(){
    const d=(45+Math.random()*105)*1000;
    this.czNextAt=Date.now()+d;
    setTimeout(()=>{ this.triggerCZ(); this.scheduleCZ(); },d);
  },

  triggerCZ(){
    const wt={common:50,uncommon:25,rare:10,legendary:3};
    const pool=CZ_EVENTS.filter(e=>!(e.id==='cz_portal'&&(this.state.bld['portal']||0)===0));
    const tw=pool.reduce((a,e)=>a+(wt[e.rarity]||10),0);
    let rng=Math.random()*tw, chosen=pool[pool.length-1];
    for(const ev of pool){ rng-=(wt[ev.rarity]||10); if(rng<=0){chosen=ev;break;} }
    this.showCZ(chosen);
    this.state.cz_seen++;
  },

  showCZ(ev){
    const s=this.state, cz=s.czmult||1;
    switch(ev.effect){
      case 'bones_x2':   this.addEfx('bones',ev.dur||60,2*cz); break;
      case 'click_x5':   this.addEfx('click',ev.dur||30,5*cz); break;
      case 'ecto_x3':    this.addEfx('ecto', ev.dur||45,3*cz); break;
      case 'all_x2':     this.addEfx('all',  ev.dur||30,2*cz); break;
      case 'fan_x4':     this.addEfx('fan',  ev.dur||60,4*cz); break;
      case 'grand_x10':  this.addEfx('all',  ev.dur||60,10*cz); break;
      case 'soul_drop':  s.res.souls=(s.res.souls||0)+500*cz; break;
      case 'signal_drop':s.res.dark_signal=(s.res.dark_signal||0)+50*cz; break;
      case 'bone_drop':  const bd=5000*cz; s.res.bones+=bd; s.bones_earned+=bd; break;
      case 'de_drop':    s.res.dark_energy=(s.res.dark_energy||0)+10*cz; break;
      case 'lore':       if(!s.lore.includes(ev.id)) s.lore.push(ev.id); break;
    }
    document.getElementById('cz-event-title').textContent=ev.title;
    document.getElementById('cz-event-title').style.color=ev.color||'#c8a84b';
    document.getElementById('cz-event-msg').textContent=ev.msg;
    document.getElementById('cz-event-sub').textContent=ev.sub;
    document.getElementById('cz-overlay').classList.remove('hidden');
    clearTimeout(this._czTimer);
    this._czTimer=setTimeout(()=>this.dismissCZ(),8000);
  },

  addEfx(type,dur,mult){
    this.activeEffects.push({type,mult,exp:Date.now()+dur*1000});
  },

  dismissCZ(){
    document.getElementById('cz-overlay').classList.add('hidden');
  },

  rotateTicker(){
    const el=document.getElementById('cz-ticker');
    if(el) el.textContent=CZ_TICKER[this.tickerIdx%CZ_TICKER.length];
    this.tickerIdx++;
    setTimeout(()=>this.rotateTicker(),8000);
  },

  // ─── PRESTIGE
  showPrestige(){
    const s=this.state;
    document.getElementById('prestige-desc').innerHTML=
      `Built <span style="color:#c8a84b">${s.buildings_total.toLocaleString()}</span> structures.<br>Harvested <span style="color:#c8a84b">${this.fmt(s.bones_earned)}</span> bones.<br><br>The Graveyard Dimension calls you back.`;
    document.getElementById('pmodal-count').textContent=s.prestige_count;
    const ns=SKINS.find(sk=>sk.unlockAt===s.prestige_count+1);
    document.getElementById('prestige-skin-unlock').textContent=
      ns?`NEW DIMENSION: ${ns.name}`:'';
    document.getElementById('prestige-overlay').classList.remove('hidden');
  },

  closePrestige(){
    document.getElementById('prestige-overlay').classList.add('hidden');
  },

  confirmPrestige(){
    const s=this.state;
    s.prestige_count++;
    s.gmult=(s.gmult||1)*1.10;
    const sk=[...SKINS].reverse().find(x=>s.prestige_count>=x.unlockAt);
    if(sk){ document.body.className=sk.cls; s.skin=sk.id; }
    const lbl=document.getElementById('skin-label');
    if(lbl&&s.prestige_count>0){
      const skn=SKINS.find(x=>x.id===s.skin);
      lbl.textContent=skn?`◈ ${skn.name} ◈`:'';
    }
    s.res={bones:0,souls:0,ectoplasm:0,dark_signal:0,fan_rep:0,dark_energy:0};
    s.bld=Object.fromEntries(BUILDINGS.map(b=>[b.id,0]));
    s.buildings_total=0;
    s.bmult=Object.fromEntries(BUILDINGS.map(b=>[b.id,1]));
    s.cmult=1;
    s.upgrades.forEach(id=>{ const u=UPGRADES.find(x=>x.id===id); if(u) this.applyUpg(u); });
    this.activeEffects=[];
    this.closePrestige();
    this.showMilestone('🌀',`DIMENSION CROSSING #${s.prestige_count}`,'+10% ALL PRODUCTION FOREVER');
    this.save();
    this.renderBuildings();
    this.renderUpgrades();
    this.updateUI();
  },

  // ─── SAVE/LOAD
  save(silent=false){
    this.state.lastSave=Date.now();
    localStorage.setItem('jurn_necropolis_v1',JSON.stringify(this.state));
    if(!silent) this.floatMsg('💾 SAVED','#00e87a');
  },

  load(){
    try{
      const raw=localStorage.getItem('jurn_necropolis_v1');
      if(!raw) return;
      const sv=JSON.parse(raw);
      if(sv.ver===1){
        this.state=Object.assign(this.defState(),sv);
        BUILDINGS.forEach(b=>{ if(this.state.bld[b.id]===undefined) this.state.bld[b.id]=0; });
        BUILDINGS.forEach(b=>{ if(this.state.bmult[b.id]===undefined) this.state.bmult[b.id]=1; });
        const sk=SKINS.find(x=>x.id===this.state.skin);
        if(sk) document.body.className=sk.cls;
      }
    }catch(e){ console.warn('Load failed',e); }
  },

  checkOffline(){
    const el=Math.min((Date.now()-this.state.lastSave)/1000,28800);
    if(el<60) return;
    const rt=this.rates(), gained={};
    for(const[k,v] of Object.entries(rt)){
      const g=v*el; if(g>0){
        this.state.res[k]=(this.state.res[k]||0)+g;
        if(k==='bones') this.state.bones_earned+=g;
        gained[k]=g;
      }
    }
    const hrs=Math.floor(el/3600), mins=Math.floor((el%3600)/60);
    const ts=hrs>0?`${hrs}h ${mins}m`:`${mins}m`;
    const gs=Object.entries(gained).filter(([,v])=>v>=1).map(([k,v])=>`+${this.fmt(v)} ${k.replace('_',' ').toUpperCase()}`).join(' | ');
    if(gs){
      document.getElementById('offline-desc').innerHTML=`Away for <b>${ts}</b>.<br><br>${gs}`;
      document.getElementById('offline-overlay').classList.remove('hidden');
    }
  },

  exportSave(){
    this.save(true);
    prompt('Copy save code:',btoa(JSON.stringify(this.state)));
  },

  importSavePrompt(){
    const d=prompt('Paste save code:'); if(!d) return;
    try{
      const p=JSON.parse(atob(d));
      this.state=Object.assign(this.defState(),p);
      this.save(true); this.floatMsg('📥 IMPORTED','#00ccff');
      this.renderBuildings(); this.renderUpgrades(); this.renderChars(); this.updateUI();
    }catch(e){ alert('Invalid save.'); }
  },

  // ─── UI
  initUI(){
    this.renderBuildings();
    this.renderUpgrades();
    this.renderChars();
    const s=this.state;
    if(s.prestige_count>0){
      const sk=SKINS.find(x=>x.id===s.skin);
      const lbl=document.getElementById('skin-label');
      if(lbl&&sk) lbl.textContent=`◈ ${sk.name} ◈`;
    }
  },

  updateUI(){
    this.updateRes();
    this.updateStats();
    this.updateBldAfford();
    this.updateUpgVis();
    this.updateEfxBar();
  },

  updateRes(){
    const r=this.state.res, rt=this.rates();
    const map=[['bones','bones'],['souls','souls'],['ecto','ectoplasm'],
               ['signal','dark_signal'],['fanrep','fan_rep'],['darkenergy','dark_energy']];
    map.forEach(([k,res])=>{
      const v=document.getElementById(`val-${k}`);
      const rr=document.getElementById(`rate-${k}`);
      if(v) v.textContent=this.fmt(r[res]||0);
      if(rr) rr.textContent=`+${this.fmt(rt[res]||0,2)}/s`;
    });
    const bpc=document.getElementById('bpc-val');
    if(bpc) bpc.textContent=this.fmt(this.clickVal());
  },

  updateStats(){
    const s=this.state;
    const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
    set('stat-total',this.fmt(s.bones_earned));
    set('stat-clicks',s.total_clicks.toLocaleString());
    set('stat-cpower',this.fmt(this.clickVal()));
    set('stat-bcount',s.buildings_total.toLocaleString());
    set('stat-prestige',s.prestige_count);
    set('stat-czevents',s.cz_seen);
  },

  updateEfxBar(){
    const bar=document.getElementById('effects-bar'); if(!bar) return;
    bar.innerHTML='';
    const cols={bones:'#c8a84b',ecto:'#00e87a',click:'#c8a84b',fan:'#ff8c00',all:'#ffffff',signal:'#ff3344'};
    const labs={bones:'🦴 BONES',ecto:'🫧 ECTO',click:'⛏ CLICK',fan:'🎸 FAN',all:'✨ ALL',signal:'📻 SIGNAL'};
    this.activeEffects.forEach(e=>{
      const rem=Math.max(0,Math.ceil((e.exp-Date.now())/1000)); if(!rem) return;
      const p=document.createElement('div');
      p.className='effect-pill';
      p.textContent=`${labs[e.type]||e.type} ×${e.mult} — ${rem}s`;
      p.style.color=cols[e.type]||'#fff';
      p.style.borderColor=cols[e.type]||'#fff';
      bar.appendChild(p);
    });
  },

  setShopTab(t){
    this.shopTab=t;
    document.getElementById('buildings-list').classList.toggle('hidden',t!=='buildings');
    document.getElementById('upgrades-list').classList.toggle('hidden',t!=='upgrades');
    document.getElementById('stab-buildings').classList.toggle('active',t==='buildings');
    document.getElementById('stab-upgrades').classList.toggle('active',t==='upgrades');
  },

  // ─── RENDER BUILDINGS
  renderBuildings(){
    const list=document.getElementById('buildings-list'); if(!list) return;
    list.innerHTML='';
    BUILDINGS.forEach(b=>{
      const prod=Object.entries(b.production)
        .map(([r,v])=>`${v>0.1?v:v.toFixed(2)}/s ${r.replace(/_/g,' ')}`).join(' · ');
      const div=document.createElement('div');
      div.className='bld-card'; div.id=`bc-${b.id}`;
      div.innerHTML=`
        <div class="bld-header">
          <div class="bld-icon-name"><span class="bld-icon">${b.icon}</span><span class="bld-name">${b.name}</span></div>
          <span class="bld-owned" id="bo-${b.id}">0</span>
        </div>
        <div class="bld-desc">${b.desc}</div>
        <div style="font-size:5px;color:#2a2a3a;line-height:1.5;margin-bottom:4px">${b.flavor}</div>
        <div class="bld-cost" id="bco-${b.id}">...</div>
        <div class="bld-production">📦 ${prod}</div>
        <div class="bld-buy-btns">
          <button class="btn" onclick="game.buyBuilding('${b.id}',1)">×1</button>
          <button class="btn" onclick="game.buyBuilding('${b.id}',10)">×10</button>
          <button class="btn" onclick="game.buyMax('${b.id}')">MAX</button>
        </div>`;
      list.appendChild(div);
    });
  },

  updateBldAfford(){
    BUILDINGS.forEach(b=>{
      const card=document.getElementById(`bc-${b.id}`);
      const ownEl=document.getElementById(`bo-${b.id}`);
      const costEl=document.getElementById(`bco-${b.id}`);
      const s=this.state;
      const unlocked=this.bldUnlocked(b);
      if(!card) return;
      if(!unlocked){ card.style.display='none'; return; }
      card.style.display='';
      const owned=s.bld[b.id]||0;
      if(ownEl) ownEl.textContent=owned;
      const cost=this.bldCost(b.id);
      if(costEl) costEl.innerHTML=this.costStr(cost);
      const afford=this.canAfford(cost);
      card.classList.toggle('unaffordable',!afford);
    });
  },

  // ─── RENDER UPGRADES
  renderUpgrades(){
    const list=document.getElementById('upgrades-list'); if(!list) return;
    list.innerHTML='';
    UPGRADES.forEach(u=>{
      const div=document.createElement('div');
      div.className='upg-card'; div.id=`uc-${u.id}`;
      div.innerHTML=`
        <div class="upg-header"><span class="upg-icon">${u.icon}</span><span class="upg-name">${u.name}</span></div>
        <div class="upg-desc">${u.desc}</div>
        <div class="upg-cost" id="ucost-${u.id}">${this.costStr(u.cost)}</div>
        <div class="upg-req" id="ureq-${u.id}"></div>`;
      div.onclick=()=>this.buyUpgrade(u.id);
      list.appendChild(div);
    });
  },

  updateUpgVis(){
    const s=this.state;
    UPGRADES.forEach(u=>{
      const card=document.getElementById(`uc-${u.id}`); if(!card) return;
      const bought=s.upgrades.includes(u.id);
      const unlocked=this.upgUnlocked(u);
      const afford=this.canAfford(u.cost);
      card.classList.toggle('bought',bought);
      card.classList.toggle('locked',!unlocked&&!bought);
      card.classList.toggle('unaffordable',unlocked&&!afford&&!bought);
      const req=document.getElementById(`ureq-${u.id}`);
      if(req){
        if(bought) req.textContent='✓ PURCHASED';
        else if(!unlocked) req.textContent=this.upgReqStr(u.req);
        else req.textContent='';
      }
    });
  },

  upgReqStr(r){
    if(!r) return '';
    if(r.bones_earned) return `Req: ${this.fmt(r.bones_earned)} bones earned`;
    if(r.bld_count){ const[k,v]=Object.entries(r.bld_count)[0]; return `Req: ${v}× ${k.replace(/_/g,' ')}`; }
    if(r.res_amt){ const[k,v]=Object.entries(r.res_amt)[0]; return `Req: ${this.fmt(v)} ${k.replace(/_/g,' ')}`; }
    return '';
  },

  // ─── RENDER CHARACTERS
  renderChars(){
    const list=document.getElementById('band-roster'); if(!list) return;
    list.innerHTML='';
    CHARACTERS.forEach(c=>{
      const unlocked=this.state.chars.includes(c.id);
      const div=document.createElement('div');
      div.className=`char-card ${unlocked?'unlocked':'locked'}`;
      div.title=unlocked?c.lore:this.charReqStr(c.unlockReq);
      div.innerHTML=`
        <div class="char-icon">${c.icon}</div>
        <div class="char-name" style="color:${unlocked?c.color:'#444'}">${c.name}</div>
        <div class="char-name" style="font-size:4px;color:#444;margin-top:1px">${c.title}</div>
        ${unlocked
          ? `<div class="char-bonus">${c.bonus}</div>`
          : `<div class="char-locked-msg">${this.charReqStr(c.unlockReq)}</div>`}`;
      list.appendChild(div);
    });
  },

  charReqStr(r){
    if(r.bones_earned) return `${this.fmt(r.bones_earned)} bones`;
    if(r.total_clicks) return `${r.total_clicks.toLocaleString()} clicks`;
    if(r.bld_owned){ const[k,v]=Object.entries(r.bld_owned)[0]; return `${v}× ${k.replace(/_/g,' ')}`; }
    return '???';
  },

  // ─── MILESTONE
  showMilestone(icon,title,sub){
    const ov=document.getElementById('milestone-overlay');
    document.getElementById('ms-icon').textContent=icon;
    document.getElementById('ms-title').textContent=title;
    document.getElementById('ms-sub').textContent=sub;
    ov.classList.remove('hidden');
    clearTimeout(this._msTimer);
    this._msTimer=setTimeout(()=>ov.classList.add('hidden'),3000);
  },

  // ─── FLOAT TEXT
  floatText(x,y,text,color){
    const layer=document.getElementById('float-layer'); if(!layer) return;
    const el=document.createElement('div');
    el.className='float-text';
    el.style.left=(x||80)+'px';
    el.style.top=(y||80)+'px';
    el.style.color=color||'#c8a84b';
    el.textContent=text;
    layer.appendChild(el);
    setTimeout(()=>el.remove(),900);
  },

  floatMsg(text,color){
    const bpc=document.getElementById('bpc-display'); if(!bpc) return;
    this.floatText(80,20,text,color);
  },

  costStr(cost){
    return Object.entries(cost)
      .map(([k,v])=>`<span style="color:${this.resColor(k)}">${this.fmt(v)} ${k.replace(/_/g,' ')}</span>`)
      .join(' + ');
  },

  resColor(k){
    const m={bones:'#c8a84b',souls:'#8855ff',ectoplasm:'#00e87a',dark_signal:'#ff3344',fan_rep:'#ff8c00',dark_energy:'#00ccff'};
    return m[k]||'#888';
  },

  // ─── NUMBER FORMAT
  fmt(n,dec=0){
    if(n<1000) return dec?n.toFixed(dec):Math.floor(n).toString();
    const tiers=[
      [1e15,'Qa'],[1e12,'T'],[1e9,'B'],[1e6,'M'],[1e3,'K']
    ];
    for(const[v,s] of tiers){
      if(n>=v) return (n/v).toFixed(1)+s;
    }
    return Math.floor(n).toString();
  },
};

// ─── BOOT
window.addEventListener('DOMContentLoaded', ()=>game.init());
