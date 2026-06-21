'use strict';
// JURN: NECROPOLIS RISING  v2.0

const SPRITE_DEFS = {
  vox:       { f:'assets/vox.webp',       dh:100, frames:[{state:'idle',fw:56},{state:'walk',fw:54},{state:'action',fw:74}] },
  riff:      { f:'assets/riff.webp',      dh:100, frames:[{state:'idle',fw:56},{state:'walk',fw:52},{state:'action',fw:56}] },
  taz:       { f:'assets/taz.webp',       dh:108, frames:[{state:'idle',fw:60},{state:'walk',fw:56},{state:'action',fw:63}] },
  bonecrush: { f:'assets/bonecrush.webp', dh:115, frames:[{state:'idle',fw:64},{state:'walk',fw:63},{state:'action',fw:64}] },
  r3x:       { f:'assets/r3x.webp',       dh:98,  frames:[{state:'idle',fw:55},{state:'walk',fw:64},{state:'action',fw:70}] },
  skeleton:  { f:'assets/skeleton.webp',  dh:80,  frames:[{state:'idle',fw:45},{state:'walk',fw:51},{state:'action',fw:46}] },
};
const RES_EL = { bones:'bones', souls:'souls', ectoplasm:'ecto', dark_signal:'signal', fan_rep:'rep', dark_energy:'de' };

const BUILDINGS = [
  { id:'grave',        name:'Unmarked Grave',             icon:'⚰️',     desc:'A lonely grave. Someone keeps digging.',               flavor:'"EVERY EMPIRE BEGINS WITH A SINGLE HOLE."',     baseCost:{bones:15},                                                  production:{bones:0.1},                                           costScale:1.15, unlockAt:{bones_earned:0} },
  { id:'bone_pit',     name:'Bone Pit',                   icon:'🕳',        desc:'A deep excavation of restless remains.',                flavor:'"THE PIT DOES NOT SLEEP."',                      baseCost:{bones:100},                                                 production:{bones:0.5},                                           costScale:1.15, unlockAt:{bones_earned:50} },
  { id:'skel_worker',  name:'Skeleton Worker',            icon:'💀',      desc:'Undead labor with an unbreakable work ethic.',          flavor:'"NEVER LATE. NEVER TIRED. NEVER ALIVE."',        baseCost:{bones:500},                                                 production:{bones:2},                                             costScale:1.15, unlockAt:{bones_earned:200} },
  { id:'🏚',        name:'Crypt',                      icon:'🏚',      desc:'Stone halls that whisper of departed souls.',           flavor:'"THE CRYPT REMEMBERS EVERYONE WHO ENTERED."',    baseCost:{bones:3000},                                                production:{bones:5,souls:0.1},                                   costScale:1.15, unlockAt:{bones_earned:1000},  unlockResource:'souls' },
  { id:'mausoleum',    name:'Mausoleum',                  icon:'🏛',      desc:'Grand tombs leaking spectral ectoplasm.',               flavor:'"BEAUTIFUL. WRONG."',                             baseCost:{bones:15000,souls:50},                                      production:{bones:15,souls:0.5,ectoplasm:0.05},                   costScale:1.15, unlockAt:{buildings_total:10}, unlockResource:'ectoplasm' },
  { id:'haunted_stage',name:'Haunted Stage',              icon:'🎸',      desc:'Where THE JURN plays. Fans materialize from the void.', flavor:'"THE CROWD DOES NOT BREATHE."',                  baseCost:{bones:80000,souls:200,ectoplasm:20},                        production:{bones:40,souls:2,ectoplasm:0.2,fan_rep:1},            costScale:1.15, unlockAt:{buildings_total:25}, unlockResource:'fan_rep' },
  { id:'cz_tower',     name:'Channel Zero Tower',         icon:'📡',      desc:'Broadcasts on frequencies that should not exist.',      flavor:'"TRANSMITTING FROM OUTSIDE OF TIME."',           baseCost:{bones:400000,souls:1000,ectoplasm:100},                    production:{bones:100,souls:5,ectoplasm:1,fan_rep:2,dark_signal:0.5}, costScale:1.15, unlockAt:{buildings_total:50}, unlockResource:'dark_signal' },
  { id:'🌀',       name:'Graveyard Dimension Portal', icon:'🌀',     desc:'A rift into the Graveyard Dimension.',                  flavor:'"IT DOES NOT OPEN. IT REMEMBERS BEING OPEN."',   baseCost:{bones:2000000,souls:10000,ectoplasm:500,dark_signal:100}, production:{bones:500,souls:25,ectoplasm:5,fan_rep:10,dark_signal:2,dark_energy:0.1}, costScale:1.15, unlockAt:{buildings_total:75}, unlockResource:'dark_energy' },
  { id:'🏰',   name:'Grand Necropolis',           icon:'🏰', desc:'An interdimensional empire of bone.',                   flavor:'"THE NECROPOLIS IS A FREQUENCY."',               baseCost:{bones:20000000,souls:100000,ectoplasm:5000,dark_signal:1000,dark_energy:100}, production:{bones:3000,souls:150,ectoplasm:30,fan_rep:60,dark_signal:12,dark_energy:1}, costScale:1.15, unlockAt:{prestige_count:1} },
];

const UPGRADES = [
  { id:'u_c1', icon:'⛏️',    name:'Sharpened Shovel',     cost:{bones:100},     desc:'2x click power.',   effect:{click_mult:2},   req:{bones_earned:100} },
  { id:'u_c2', icon:'🦴',      name:'Bone Sense',           cost:{bones:500},     desc:'5x click power.',   effect:{click_mult:5},   req:{bones_earned:500} },
  { id:'u_c3', icon:'🪦',      name:'The Grave Beckons',    cost:{bones:5000},    desc:'10x click power.',  effect:{click_mult:10},  req:{bones_earned:5000} },
  { id:'u_c4', icon:'☠️',    name:'Death Touch',          cost:{bones:50000},   desc:'25x click power.',  effect:{click_mult:25},  req:{bones_earned:50000} },
  { id:'u_c5', icon:'📻',      name:'Graveyard Frequency',  cost:{bones:500000},  desc:'100x click power.', effect:{click_mult:100}, req:{bones_earned:500000} },
  { id:'u_c6', icon:'🌀',      name:'Dimensional Pull',     cost:{bones:5000000,dark_signal:10}, desc:'500x click power.', effect:{click_mult:500}, req:{bones_earned:5000000} },
  { id:'u_g1', icon:'⚰️',   name:'Deeper Graves',        cost:{bones:300},    desc:'Graves x2.',  effect:{bld_mult:{grave:2}},    req:{bld_count:{grave:10}} },
  { id:'u_g2', icon:'⚰️',   name:'Mass Burial',          cost:{bones:3000},   desc:'Graves x4.',  effect:{bld_mult:{grave:4}},    req:{bld_count:{grave:25}} },
  { id:'u_g3', icon:'⚰️',   name:'Bone Cathedral',       cost:{bones:30000},  desc:'Graves x8.',  effect:{bld_mult:{grave:8}},    req:{bld_count:{grave:50}} },
  { id:'u_g4', icon:'⚰️',   name:'Necro-Architecture',   cost:{bones:300000}, desc:'Graves x16.', effect:{bld_mult:{grave:16}},   req:{bld_count:{grave:100}} },
  { id:'u_p1', icon:'🕳',      name:'Deeper Pits',          cost:{bones:2000},   desc:'Pits x2.',    effect:{bld_mult:{bone_pit:2}},    req:{bld_count:{bone_pit:10}} },
  { id:'u_p2', icon:'🕳',      name:'Ancient Veins',        cost:{bones:20000},  desc:'Pits x4.',    effect:{bld_mult:{bone_pit:4}},    req:{bld_count:{bone_pit:25}} },
  { id:'u_p3', icon:'🕳',      name:'Primordial Pit',       cost:{bones:200000}, desc:'Pits x8.',    effect:{bld_mult:{bone_pit:8}},    req:{bld_count:{bone_pit:50}} },
  { id:'u_s1', icon:'💀',      name:'Improved Spines',      cost:{bones:10000},   desc:'Workers x2.', effect:{bld_mult:{skel_worker:2}}, req:{bld_count:{skel_worker:10}} },
  { id:'u_s2', icon:'💀',      name:'Reinforced Ribcages',  cost:{bones:100000},  desc:'Workers x4.', effect:{bld_mult:{skel_worker:4}}, req:{bld_count:{skel_worker:25}} },
  { id:'u_s3', icon:'💀',      name:'Undead Efficiency',    cost:{bones:1000000}, desc:'Workers x8.', effect:{bld_mult:{skel_worker:8}}, req:{bld_count:{skel_worker:50}} },
  { id:'u_cr1',icon:'🏚',      name:'Sealed Chambers',      cost:{bones:50000,souls:100},   desc:'Crypts x2.', effect:{bld_mult:{crypt:2}}, req:{bld_count:{crypt:10}} },
  { id:'u_cr2',icon:'🏚',      name:'Soul Conduits',        cost:{bones:500000,souls:1000}, desc:'Crypts x4.', effect:{bld_mult:{crypt:4}}, req:{bld_count:{crypt:25}} },
  { id:'u_m1', icon:'🏛',      name:'Grand Architecture',   cost:{bones:200000,souls:500},      desc:'Mausoleums x2.', effect:{bld_mult:{mausoleum:2}}, req:{bld_count:{mausoleum:10}} },
  { id:'u_m2', icon:'🏛',      name:'Ecto-Carved Pillars',  cost:{bones:2000000,ectoplasm:100}, desc:'Mausoleums x4.', effect:{bld_mult:{mausoleum:4}}, req:{bld_count:{mausoleum:25}} },
  { id:'u_hs1',icon:'🎸',      name:'Better Amp Stack',     cost:{bones:500000,fan_rep:50},   desc:'Stages x2.', effect:{bld_mult:{haunted_stage:2}}, req:{bld_count:{haunted_stage:10}} },
  { id:'u_hs2',icon:'🎸',      name:'Dimensional PA System',cost:{bones:5000000,fan_rep:500}, desc:'Stages x4.', effect:{bld_mult:{haunted_stage:4}}, req:{bld_count:{haunted_stage:25}} },
  { id:'u_cz1',icon:'📡',      name:'Signal Amplifier',     cost:{dark_signal:50},  desc:'CZ Towers x2.', effect:{bld_mult:{cz_tower:2}}, req:{bld_count:{cz_tower:10}} },
  { id:'u_cz2',icon:'📡',      name:'Forbidden Frequency',  cost:{dark_signal:500}, desc:'CZ Towers x4.', effect:{bld_mult:{cz_tower:4}}, req:{bld_count:{cz_tower:25}} },
  { id:'u_po1',icon:'🌀',      name:'Dimensional Anchor',   cost:{dark_energy:10},  desc:'Portals x2.', effect:{bld_mult:{portal:2}}, req:{bld_count:{portal:5}} },
  { id:'u_po2',icon:'🌀',      name:'Void Stabiliser',      cost:{dark_energy:100}, desc:'Portals x4.', effect:{bld_mult:{portal:4}}, req:{bld_count:{portal:15}} },
  { id:'u_xb', icon:'💜',      name:'Soul Attunement',      cost:{souls:100},      desc:'+10% global.',  effect:{global_mult:0.10}, req:{res_amt:{souls:50}} },
  { id:'u_xe', icon:'🧪',      name:'Ectoplasmic Resonance',cost:{ectoplasm:50},   desc:'+20% global.',  effect:{global_mult:0.20}, req:{res_amt:{ectoplasm:25}} },
  { id:'u_xf', icon:'🎸',      name:'Underground Legend',   cost:{fan_rep:200},    desc:'+15% global.',  effect:{global_mult:0.15}, req:{res_amt:{fan_rep:100}} },
  { id:'u_xa', icon:'📻',      name:'CZ Amplifier',         cost:{dark_signal:50}, desc:'CZ bonuses x2.',effect:{cz_mult:2},        req:{res_amt:{dark_signal:25}} },
  { id:'u_xde',icon:'⚡',          name:'Dark Infusion',        cost:{dark_energy:5},  desc:'+100% global.', effect:{global_mult:1.00}, req:{res_amt:{dark_energy:1}} },
];

const CHARACTERS = [
  { id:'vox',       spKey:'vox',       name:'VOX',           title:'THE SKULL',        icon:'💀', color:'#c8a84b', lore:'"The original. Architect of decay."',         bonus:'+15% ALL Bone production', unlockReq:{bones_earned:500},           unlockMsg:'VOX HAS JOINED THE NECROPOLIS.' },
  { id:'bonecrush', spKey:'bonecrush', name:'SIR BONECRUSH', title:'THE CRUSHER',      icon:'⚔️',color:'#aaaaaa', lore:'"The Viking of the Void."',                  bonus:'+50% click power',         unlockReq:{total_clicks:1000},          unlockMsg:'SIR BONECRUSH THUNDERS IN.' },
  { id:'riffrot',   spKey:'riff',      name:'RIFF-ROT',      title:'THE ROTTING RIFF', icon:'🎸', color:'#00e87a', lore:'"Guitar strings of sinew and dark matter."',  bonus:'+25% Ectoplasm production',unlockReq:{bld_owned:{mausoleum:1}},    unlockMsg:'RIFF-ROT MATERIALIZES.' },
  { id:'taz',       spKey:'taz',       name:'TAZ',            title:'THE WILD ONE',     icon:'🧨', color:'#ff3344', lore:'"When TAZ plays, crowds tear reality apart."',bonus:'+30% Fan Rep production',   unlockReq:{bld_owned:{haunted_stage:1}},unlockMsg:'TAZ HAS ARRIVED.' },
  { id:'r3x',       spKey:'r3x',       name:'R3X',            title:'THE MACHINE',      icon:'🤖', color:'#00ccff', lore:'"R3X does not sleep. R3X does not stop."',   bonus:'+100% Dark Energy + auto-click', unlockReq:{bld_owned:{portal:1}}, unlockMsg:'R3X ONLINE. SYSTEMS: ACTIVE.' },
];

const CZ_EVENTS = [
  { id:'cz_bones',  title:'SIGNAL DETECTED',         msg:'"THE BONES REMEMBER EVERYTHING."',                           sub:'Bone production x2 for 60s.',          effect:'bones_x2',   dur:60,  rarity:'common',    color:'#c8a84b' },
  { id:'cz_souls',  title:'GRAVEYARD FREQUENCY',      msg:'"SOULS DRIFT BETWEEN THE DIMENSIONS."',                      sub:'Instant +500 Souls.',                  effect:'soul_drop',  rarity:'common',    color:'#8855ff' },
  { id:'cz_click',  title:'VOX SENDS A MESSAGE',      msg:'"DIG FASTER. THE DIMENSION WAITS FOR NO ONE."',              sub:'Click power x5 for 30s.',              effect:'click_x5',   dur:30,  rarity:'uncommon',  color:'#c8a84b' },
  { id:'cz_ecto',   title:'THE BONES ARE SINGING',    msg:'"ECTOPLASMIC RESONANCE ON ALL CHANNELS."',                   sub:'Ectoplasm x3 for 45s.',                effect:'ecto_x3',    dur:45,  rarity:'uncommon',  color:'#00e87a' },
  { id:'cz_sig',    title:'R3X BROADCASTING',         msg:'"FREQUENCY: UNKNOWN. SIGNAL: PERFECT."',                     sub:'Instant +50 Dark Signal.',             effect:'signal_drop',rarity:'common',    color:'#ff3344' },
  { id:'cz_all',    title:'DIMENSIONAL INTERFERENCE', msg:'"SOMETHING APPROACHES FROM THE GRAVEYARD DIMENSION."',       sub:'ALL production x2 for 30s!',           effect:'all_x2',     dur:30,  rarity:'rare',      color:'#ff8c00' },
  { id:'cz_fans',   title:'LIVE BROADCAST',           msg:'"THE JURN IS PLAYING. REALITY IS LISTENING."',               sub:'Fan Rep x4 for 60s.',                  effect:'fan_x4',     dur:60,  rarity:'uncommon',  color:'#ff8c00' },
  { id:'cz_l1',     title:'TRANSMISSION #001',        msg:'"THE GRAVEYARD DIMENSION IS NOT A PLACE. IT IS A MEMORY."', sub:'A fragment.',                          effect:'lore',       rarity:'rare',      color:'#8855ff' },
  { id:'cz_l2',     title:'TRANSMISSION #002',        msg:'"VOX BUILT THE FIRST GRAVE IN A DIMENSION THAT DID NOT EXIST YET."', sub:'A fragment.',              effect:'lore',       rarity:'rare',      color:'#8855ff' },
  { id:'cz_l3',     title:'TRANSMISSION #003',        msg:'"CHANNEL ZERO BROADCASTS SINCE BEFORE TELEVISION WAS INVENTED."', sub:'A fragment.',                  effect:'lore',       rarity:'rare',      color:'#00ccff' },
  { id:'cz_l4',     title:'TRANSMISSION #004',        msg:'"THE NECROPOLIS EXISTED BEFORE THE FIRST LIVING THING DIED."',    sub:'A fragment.',                  effect:'lore',       rarity:'rare',      color:'#00ccff' },
  { id:'cz_l5',     title:'TRANSMISSION #005',        msg:'"R3X WAS NOT BUILT. R3X WAS REMEMBERED INTO EXISTENCE."',         sub:'A fragment.',                  effect:'lore',       rarity:'rare',      color:'#00ccff' },
  { id:'cz_bones2', title:'THE GROUND SHAKES',        msg:'"SOMETHING ENORMOUS IS BURIED HERE."',                       sub:'Instant +5000 Bones.',                 effect:'bone_drop',  rarity:'uncommon',  color:'#c8a84b' },
  { id:'cz_de',     title:'DARK ENERGY SURGE',        msg:'"THE PORTAL BETWEEN DIMENSIONS IS WEAKENING."',              sub:'Instant +10 Dark Energy.',             effect:'de_drop',    rarity:'rare',      color:'#00ccff' },
  { id:'cz_grand',  title:'ANOMALY DETECTED',         msg:'"ALL FREQUENCIES ALIGNED. THE NECROPOLIS AWAKENS."',         sub:'ALL production x10 for 60s!!!',        effect:'grand_x10',  dur:60,  rarity:'legendary', color:'#ff8c00' },
  { id:'cz_r3x',    title:'R3X OVERRIDE',             msg:'"INITIATING AUTO-DIG PROTOCOL. STAND BACK."',                sub:'Auto-click x10 speed for 45s.',        effect:'click_x5',   dur:45,  rarity:'uncommon',  color:'#00ccff' },
];

const CZ_TICKER=[
  'CHANNEL ZERO IS WATCHING','THE NECROPOLIS GROWS',
  'TUNE IN. TUNE OUT. TUNE IN AGAIN.','JURN PLAYS TONIGHT. SOMEWHERE.',
  'THE DIMENSION REMEMBERS YOU','SIGNAL STRENGTH: BEYOND MORTAL SCALE',
  'BONES DO NOT LIE','R3X IS WATCHING THE WATCHER',
];

const SKINS=[
  {id:'graveyard',name:'GRAVEYARD',      cls:'skin-graveyard',unlockAt:0},
  {id:'crimson',  name:'CRIMSON VOID',   cls:'skin-crimson',  unlockAt:1},
  {id:'void',     name:'VOID DIMENSION', cls:'skin-void',     unlockAt:3},
  {id:'cosmic',   name:'COSMIC NECROPOLIS',cls:'skin-cosmic', unlockAt:7},
];

// ── WALKER ───────────────────────────────────────────────────────────────────
class Walker{
  constructor(img,cfg,cw,ch){
    this.img=img;this.cfg=cfg;this.cw=cw;this.ch=ch;
    this.dh=cfg.dh;
    // Pre-compute per-state frame offsets from the horizontal strip
    if(cfg.frames){
      this._offsets={};  // state -> [{x, fw}]
      let x=0;
      for(const f of cfg.frames){
        if(!this._offsets[f.state])this._offsets[f.state]=[];
        this._offsets[f.state].push({x,fw:f.fw});
        x+=f.fw;
      }
      this._fw0=cfg.frames[0].fw;
    }else{
      this._offsets=null;
      this._fw0=img.naturalWidth?Math.round(img.naturalWidth/img.naturalHeight*cfg.dh):Math.round(cfg.dh*0.7);
    }
    this.dw=this._fw0;
    this.y=ch*0.52+Math.random()*ch*0.26;
    this.x=Math.random()*(cw-this.dw);
    this.vx=(Math.random()<0.5?1:-1)*(22+Math.random()*22);
    this.state='walk';this.st=1500+Math.random()*3500;
    this._phase=Math.random()*Math.PI*2;
    this._animF=0;this._animT=0;this._animFD=220;
  }
  _frameInfo(){
    if(!this._offsets)return{x:0,fw:this._fw0};
    const arr=this._offsets[this.state]||this._offsets['idle'];
    return arr[this._animF%arr.length];
  }
  _curFrames(){
    if(!this._offsets)return null;
    return this._offsets[this.state]||this._offsets['idle'];
  }
  update(dt){
    this.st-=dt;
    if(this.st<=0){
      if(this.state==='walk'){
        // Randomly pick idle or action
        this.state=Math.random()<0.65?'idle':'action';
        this.st=900+Math.random()*2000;
      }else{
        this.state='walk';
        this.vx=(Math.random()<0.5?1:-1)*(22+Math.random()*28);
        this.st=2000+Math.random()*5000;
      }
      this._animF=0;this._animT=0;
    }
    if(this.state==='walk'){
      this.x+=this.vx*dt/1000;
      if(this.x<-this.dw*2)this.x=this.cw+this.dw;
      if(this.x>this.cw+this.dw)this.x=-this.dw*2;
    }
    // Advance animation frame
    this._animT+=dt;
    const fd=this.state==='action'?180:this._animFD;
    if(this._animT>=fd){
      this._animT=0;
      const arr=this._curFrames();
      const len=arr?arr.length:1;
      this._animF=(this._animF+1)%len;
    }
  }
  draw(ctx){
    const now=Date.now();
    const bounce=this.state==='idle'
      ?Math.sin(now/700+this._phase)*2.5
      :this.state==='walk'?Math.sin(now/280+this._phase)*1.8:0;
    const fi=this._frameInfo();
    const flip=this.vx>0;
    ctx.save();ctx.globalAlpha=0.95;
    if(flip){
      ctx.translate(this.x+fi.fw,this.y+bounce);
      ctx.scale(-1,1);
      ctx.drawImage(this.img,fi.x,0,fi.fw,this.dh,0,0,fi.fw,this.dh);
    }else{
      ctx.translate(this.x,this.y+bounce);
      ctx.drawImage(this.img,fi.x,0,fi.fw,this.dh,0,0,fi.fw,this.dh);
    }
    ctx.restore();
  }
}

// ── SCENE ────────────────────────────────────────────────────────────────────
const SCENE={
  canvas:null,ctx:null,shovelCanvas:null,shCtx:null,
  images:{},mapImgs:[],walkers:[],currentMap:0,
  shovelFrame:0,shovelTimer:0,lastT:0,digEffect:null,particles:[],
  loaded:0,totalToLoad:0,shovelImg:null,
  atmo:'none',

  init(){
    this.canvas=document.getElementById('world-canvas');
    this.ctx=this.canvas.getContext('2d');
    this.shovelCanvas=document.getElementById('shovel-canvas');
    this.shCtx=this.shovelCanvas.getContext('2d');
    this.totalToLoad=Object.keys(SPRITE_DEFS).length+6+1;
    this.loaded=0;
    this.mapImgs=[];
    for(let i=1;i<=6;i++){const img=new Image();img.onload=img.onerror=()=>this._onLoad();img.src='assets/maps/map'+i+'.jpg';this.mapImgs.push(img);}
    for(const[id,def]of Object.entries(SPRITE_DEFS)){const img=new Image();img.onload=()=>{this.images[id]=img;this._onLoad();};img.onerror=()=>this._onLoad();img.src=def.f;}
    this.shovelImg=new Image();this.shovelImg.onload=this.shovelImg.onerror=()=>this._onLoad();this.shovelImg.src='assets/shovel.webp';
    const dz=document.getElementById('dig-zone');
    if(dz)dz.addEventListener('click',(e)=>{game.handleClick(e);this.triggerDig();});
    this.lastT=performance.now();
    requestAnimationFrame((t)=>this.loop(t));
  },

  _onLoad(){this.loaded++;if(this.loaded>=this.totalToLoad)this._initWalkers();},

  _initWalkers(){
    this.walkers=[];
    for(let i=0;i<3;i++)this._addSkeleton();
    if(window.game&&game.state){
      for(const cid of game.state.chars){const ch=CHARACTERS.find(x=>x.id===cid);if(ch&&ch.spKey)this.addBandMember(ch.spKey);}
    }
  },

  _addSkeleton(){
    const img=this.images['skeleton'];if(!img)return;
    this.walkers.push(new Walker(img,SPRITE_DEFS['skeleton'],this.canvas.width,this.canvas.height));
  },

  addBandMember(spKey){
    const img=this.images[spKey];if(!img||!SPRITE_DEFS[spKey])return;
    const w=new Walker(img,SPRITE_DEFS[spKey],this.canvas.width,this.canvas.height);
    w.x=Math.random()<0.5?-80:this.canvas.width+80;
    this.walkers.push(w);
  },

  setMap(idx){const n=Math.max(0,Math.min(5,idx));if(n!==this.currentMap)this.currentMap=n;},

  setAtmo(name){
    this.atmo=name;
    const ov=document.getElementById('atmo-overlay');if(!ov)return;
    ov.className='atmo-'+name;
    document.querySelectorAll('.atmo-btn').forEach(b=>b.classList.toggle('active',b.dataset.effect===name));
  },

  syncWithState(state){
    const total=state.buildings_total||0,workers=state.bld['skel_worker']||0;
    const targetSkel=Math.min(1+Math.floor(workers/3),8);
    const curSkel=this.walkers.filter(w=>w.cfg===SPRITE_DEFS['skeleton']).length;
    for(let i=curSkel;i<targetSkel;i++)this._addSkeleton();
    const mapIdx=total===0?0:total<5?1:total<15?2:total<35?3:total<70?4:5;
    this.setMap(mapIdx);
  },

  triggerDig(){
    this.shovelFrame=1;this.shovelTimer=280;
    // Spawn 20 dirt particles on the shovel canvas
    this.particles=[];
    for(let i=0;i<20;i++){
      const ang=-Math.PI*0.5+((Math.random()-0.5)*Math.PI*1.4);
      const spd=40+Math.random()*70;
      this.particles.push({
        x:70+( Math.random()-0.5)*18,y:78,
        vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd-30,
        life:1,size:4+Math.random()*6,
        col:['#8b5e3c','#6b4423','#a07040','#c8a84b'][Math.floor(Math.random()*4)]
      });
    }
  },

  loop(t){
    const dt=Math.min(t-this.lastT,100);this.lastT=t;
    if(this.shovelTimer>0){this.shovelTimer-=dt;if(this.shovelTimer<=0)this.shovelFrame=0;}
    for(const w of this.walkers)w.update(dt);
    // Update particles
    if(this.particles&&this.particles.length){
      for(const p of this.particles){p.life-=dt/500;p.x+=p.vx*dt/1000;p.y+=p.vy*dt/1000;p.vy+=120*dt/1000;}
      this.particles=this.particles.filter(p=>p.life>0);
    }
    if(this.digEffect){this.digEffect.age+=dt;if(this.digEffect.age>=this.digEffect.maxAge)this.digEffect=null;}
    this._drawWorld();this._drawShovel();
    requestAnimationFrame((t2)=>this.loop(t2));
  },

  _drawWorld(){
    const{ctx,canvas}=this,W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    const mi=this.mapImgs[this.currentMap];
    if(mi&&mi.complete&&mi.naturalWidth>0)ctx.drawImage(mi,0,0,W,H);
    else{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0d0d1a');g.addColorStop(1,'#050510');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
    const sorted=[...this.walkers].sort((a,b)=>a.y-b.y);
    for(const w of sorted)w.draw(ctx);
  },

  _drawShovel(){
    const{shCtx}=this,W=140,H=110;
    shCtx.clearRect(0,0,W,H);
    // Draw particles behind shovel
    if(this.particles&&this.particles.length){
      shCtx.save();
      for(const p of this.particles){
        shCtx.globalAlpha=Math.max(0,p.life)*0.88;
        shCtx.fillStyle=p.col;
        shCtx.beginPath();shCtx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);shCtx.fill();
      }
      shCtx.restore();
    }
    if(!this.shovelImg||!this.shovelImg.complete||!this.shovelImg.naturalWidth){
      shCtx.fillStyle='#c8a84b';shCtx.font='32px serif';shCtx.textAlign='center';shCtx.fillText('⛏',70,70);return;
    }
    const srcX=this.shovelFrame*138,bounce=this.shovelFrame===0?Math.sin(Date.now()/600)*2:0;
    shCtx.save();shCtx.translate(0,bounce);shCtx.drawImage(this.shovelImg,srcX,0,138,184,0,0,W,H);shCtx.restore();
  },
};

// ── GAME ─────────────────────────────────────────────────────────────────────
const game={
  state:null,activeEffects:[],shopTab:'buildings',tickerIdx:0,_autoT:0,

  defState(){return{ver:2,
    res:{bones:0,souls:0,ectoplasm:0,dark_signal:0,fan_rep:0,dark_energy:0},
    bld:Object.fromEntries(BUILDINGS.map(b=>[b.id,0])),
    bmult:Object.fromEntries(BUILDINGS.map(b=>[b.id,1])),
    cmult:1,gmult:1,czmult:1,upgrades:[],chars:[],lore:[],
    prestige_count:0,skin:'graveyard',
    bones_earned:0,total_clicks:0,buildings_total:0,cz_seen:0,
    lastSave:Date.now(),nextCZ:60+Math.random()*90};},

  em(type){const now=Date.now();return this.activeEffects.filter(e=>e.type===type&&e.exp>now).reduce((a,e)=>a*e.mult,1);},

  rates(){
    const s=this.state,r={bones:0,souls:0,ectoplasm:0,dark_signal:0,fan_rep:0,dark_energy:0};
    BUILDINGS.forEach(b=>{
      const n=s.bld[b.id]||0;if(!n)return;const bm=s.bmult[b.id]||1;
      for(const[res,base]of Object.entries(b.production)){
        let v=base*n*bm*s.gmult;
        if(res==='bones')v*=this.em('bones')*this.em('all');
        else if(res==='ectoplasm')v*=this.em('ecto')*this.em('all');
        else if(res==='fan_rep')v*=this.em('fan')*this.em('all');
        else v*=this.em('all');
        if(res==='bones'&&this.hasChar('vox'))v*=1.15;
        if(res==='ectoplasm'&&this.hasChar('riffrot'))v*=1.25;
        if(res==='fan_rep'&&this.hasChar('taz'))v*=1.30;
        if(res==='dark_energy'&&this.hasChar('r3x'))v*=2.00;
        r[res]=(r[res]||0)+v;
      }
    });
    return r;
  },

  hasChar(id){return this.state.chars.includes(id);},

  clickVal(){
    const s=this.state;let v=s.cmult*s.gmult*this.em('click')*this.em('all');
    if(this.hasChar('bonecrush'))v*=1.50;if(this.hasChar('r3x'))v*=(1+this.em('click'));
    return Math.max(1,v);
  },

  fmt(n,dec){
    dec=dec||0;
    if(n<1e3)return n.toFixed(dec>0?dec:(n<10?1:0));
    if(n<1e6)return(n/1e3).toFixed(1)+'K';if(n<1e9)return(n/1e6).toFixed(2)+'M';
    if(n<1e12)return(n/1e9).toFixed(2)+'B';return(n/1e12).toFixed(2)+'T';
  },

  canAfford(cost){return Object.entries(cost).every(([k,v])=>(this.state.res[k]||0)>=v);},
  deduct(cost){for(const[k,v]of Object.entries(cost))this.state.res[k]=Math.max(0,(this.state.res[k]||0)-v);},

  buyBuilding(id,qty){
    qty=qty||1;const b=BUILDINGS.find(x=>x.id===id);if(!b||!this.bldUnlocked(b))return;
    let n=0;
    for(let i=0;i<qty;i++){const c=this.bldCost(id);if(!this.canAfford(c))break;this.deduct(c);this.state.bld[id]=(this.state.bld[id]||0)+1;this.state.buildings_total++;n++;}
    if(n)this.updateUI();
  },

  buyMax(id){
    let n=0;while(true){const c=this.bldCost(id);if(!this.canAfford(c))break;this.deduct(c);this.state.bld[id]=(this.state.bld[id]||0)+1;this.state.buildings_total++;if(++n>5000)break;}
    if(n)this.updateUI();
  },

  bldCost(id){
    const b=BUILDINGS.find(x=>x.id===id);
    const factor=Math.pow(b.costScale,this.state.bld[id]||0);
    const out={};for(const[k,v]of Object.entries(b.baseCost))out[k]=Math.ceil(v*factor);return out;
  },

  bldUnlocked(b){
    const s=this.state;
    if(b.unlockAt.bones_earned!==undefined&&s.bones_earned<b.unlockAt.bones_earned)return false;
    if(b.unlockAt.buildings_total!==undefined&&s.buildings_total<b.unlockAt.buildings_total)return false;
    if(b.unlockAt.prestige_count!==undefined&&s.prestige_count<b.unlockAt.prestige_count)return false;
    return true;
  },

  buyUpgrade(id){
    if(this.state.upgrades.includes(id))return;
    const u=UPGRADES.find(x=>x.id===id);if(!u||!this.upgUnlocked(u)||!this.canAfford(u.cost))return;
    this.deduct(u.cost);this.state.upgrades.push(id);this.applyUpg(u);
    this.floatMsg('✓ '+u.name,'#00e87a');this.updateUI();
  },

  upgUnlocked(u){
    const s=this.state,r=u.req;if(!r)return true;
    if(r.bones_earned!==undefined&&s.bones_earned<r.bones_earned)return false;
    if(r.bld_count)for(const[k,v]of Object.entries(r.bld_count)){if((s.bld[k]||0)<v)return false;}
    if(r.res_amt)for(const[k,v]of Object.entries(r.res_amt)){if((s.res[k]||0)<v)return false;}
    return true;
  },

  applyUpg(u){
    const e=u.effect,s=this.state;
    if(e.click_mult)s.cmult*=e.click_mult;
    if(e.bld_mult)for(const[k,m]of Object.entries(e.bld_mult))s.bmult[k]=(s.bmult[k]||1)*m;
    if(e.global_mult)s.gmult*=(1+e.global_mult);
    if(e.cz_mult)s.czmult=(s.czmult||1)*e.cz_mult;
  },

  handleClick(ev){
    const v=this.clickVal();this.state.res.bones+=v;this.state.bones_earned+=v;this.state.total_clicks++;
    const dz=document.getElementById('dig-zone');
    if(dz){const r=dz.getBoundingClientRect();this.floatText(r.left+r.width/2-20,r.top-10,'+'+this.fmt(v),'#c8a84b');}
  },

  checkUnlocks(){
    const s=this.state;
    BUILDINGS.forEach(b=>{
      if(b.unlockResource&&(s.bld[b.id]||0)>0){
        const elId=RES_EL[b.unlockResource];
        const el=elId?document.getElementById('res-'+elId):null;
        if(el)el.classList.remove('hidden');
      }
    });
    const hasPrt=(s.bld['portal']||0)>0;
    const pb=document.getElementById('prestige-btn');if(pb)pb.classList.toggle('hidden',!hasPrt);
    if(hasPrt){const badge=document.getElementById('prestige-badge');if(badge)badge.classList.remove('hidden');}
  },

  checkMilestones(){
    const s=this.state;
    CHARACTERS.forEach(c=>{
      if(s.chars.includes(c.id))return;let ok=true;const r=c.unlockReq;
      if(r.bones_earned&&s.bones_earned<r.bones_earned)ok=false;
      if(r.total_clicks&&s.total_clicks<r.total_clicks)ok=false;
      if(r.bld_owned)for(const[k,v]of Object.entries(r.bld_owned)){if((s.bld[k]||0)<v){ok=false;break;}}
      if(ok)this.unlockChar(c);
    });
  },

  unlockChar(c){
    this.state.chars.push(c.id);this.showMilestone(c.icon,c.unlockMsg,c.bonus);
    this.renderChars();if(c.spKey)SCENE.addBandMember(c.spKey);
  },

  tickCZ(dt){
    const s=this.state;s.nextCZ-=dt/1000;
    if(s.nextCZ<=0){
      s.nextCZ=45+Math.random()*120;s.cz_seen++;
      const pool=CZ_EVENTS.filter(e=>e.rarity==='legendary'?Math.random()<0.02:e.rarity==='rare'?Math.random()<0.18:e.rarity==='uncommon'?Math.random()<0.45:true);
      const ev=pool[Math.floor(Math.random()*pool.length)]||CZ_EVENTS[0];this.showCZ(ev);
    }
  },

  showCZ(ev){
    const s=this.state,cz=s.czmult||1;
    switch(ev.effect){
      case 'bones_x2':this.addEfx('bones',ev.dur||60,2*cz);break;
      case 'click_x5':this.addEfx('click',ev.dur||30,5*cz);break;
      case 'ecto_x3':this.addEfx('ecto',ev.dur||45,3*cz);break;
      case 'all_x2':this.addEfx('all',ev.dur||30,2*cz);break;
      case 'fan_x4':this.addEfx('fan',ev.dur||60,4*cz);break;
      case 'grand_x10':this.addEfx('all',ev.dur||60,10*cz);break;
      case 'soul_drop':s.res.souls=(s.res.souls||0)+500*cz;break;
      case 'signal_drop':s.res.dark_signal=(s.res.dark_signal||0)+50*cz;break;
      case 'bone_drop':{const bd=5000*cz;s.res.bones+=bd;s.bones_earned+=bd;}break;
      case 'de_drop':s.res.dark_energy=(s.res.dark_energy||0)+10*cz;break;
      case 'lore':if(!s.lore.includes(ev.id))s.lore.push(ev.id);break;
    }
    const title=document.getElementById('cz-event-title');
    title.textContent=ev.title;title.style.color=ev.color||'#c8a84b';
    document.getElementById('cz-event-msg').textContent=ev.msg;
    document.getElementById('cz-event-sub').textContent=ev.sub;
    document.getElementById('cz-overlay').classList.remove('hidden');
    clearTimeout(this._czTimer);this._czTimer=setTimeout(()=>this.dismissCZ(),8000);
  },

  addEfx(type,dur,mult){this.activeEffects.push({type,mult,exp:Date.now()+dur*1000});},
  dismissCZ(){document.getElementById('cz-overlay').classList.add('hidden');},

  rotateTicker(){
    const el=document.getElementById('cz-ticker');
    if(el)el.textContent='◈ '+CZ_TICKER[this.tickerIdx%CZ_TICKER.length]+' ◈';
    this.tickerIdx++;setTimeout(()=>this.rotateTicker(),7000);
  },

  showPrestige(){
    const s=this.state;
    document.getElementById('prestige-desc').innerHTML='Built <span style="color:#c8a84b">'+s.buildings_total.toLocaleString()+'</span> structures.<br>Harvested <span style="color:#c8a84b">'+this.fmt(s.bones_earned)+'</span> bones.<br><br>The Graveyard Dimension calls you back.';
    document.getElementById('pmodal-count').textContent=s.prestige_count;
    const ns=SKINS.find(sk=>sk.unlockAt===s.prestige_count+1);
    document.getElementById('prestige-skin-unlock').textContent=ns?'NEW DIMENSION: '+ns.name:'';
    document.getElementById('prestige-overlay').classList.remove('hidden');
  },

  closePrestige(){document.getElementById('prestige-overlay').classList.add('hidden');},

  confirmPrestige(){
    const s=this.state;s.prestige_count++;s.gmult=(s.gmult||1)*1.10;
    const sk=[...SKINS].reverse().find(x=>s.prestige_count>=x.unlockAt);
    if(sk){document.body.className=sk.cls;s.skin=sk.id;}
    const lbl=document.getElementById('skin-label');
    if(lbl&&s.prestige_count>0){const skn=SKINS.find(x=>x.id===s.skin);if(skn)lbl.textContent='◈ '+skn.name+' ◈';}
    s.res={bones:0,souls:0,ectoplasm:0,dark_signal:0,fan_rep:0,dark_energy:0};
    s.bld=Object.fromEntries(BUILDINGS.map(b=>[b.id,0]));
    s.buildings_total=0;s.bmult=Object.fromEntries(BUILDINGS.map(b=>[b.id,1]));s.cmult=1;
    s.upgrades.forEach(id=>{const u=UPGRADES.find(x=>x.id===id);if(u)this.applyUpg(u);});
    this.activeEffects=[];
    SCENE.walkers=SCENE.walkers.filter(w=>w.cfg!==SPRITE_DEFS['skeleton']);
    for(let i=0;i<3;i++)SCENE._addSkeleton();SCENE.setMap(0);
    this.closePrestige();this.showMilestone('🌀','DIMENSION CROSSING #'+s.prestige_count,'+10% ALL PRODUCTION FOREVER');
    this.save(true);this.renderBuildings();this.renderUpgrades();this.updateUI();
  },

  save(silent){
    this.state.lastSave=Date.now();localStorage.setItem('jurn_necropolis_v2',JSON.stringify(this.state));
    if(!silent)this.floatMsg('💾 SAVED','#00e87a');
  },

  load(){
    try{
      let raw=localStorage.getItem('jurn_necropolis_v2');if(!raw)raw=localStorage.getItem('jurn_necropolis_v1');if(!raw)return;
      const sv=JSON.parse(raw);
      if(sv.ver===1||sv.ver===2){
        this.state=Object.assign(this.defState(),sv);
        BUILDINGS.forEach(b=>{if(this.state.bld[b.id]===undefined)this.state.bld[b.id]=0;if(this.state.bmult[b.id]===undefined)this.state.bmult[b.id]=1;});
        const sk=SKINS.find(x=>x.id===this.state.skin);if(sk)document.body.className=sk.cls;
        const upgs=[...this.state.upgrades];this.state.upgrades=[];this.state.cmult=1;
        this.state.bmult=Object.fromEntries(BUILDINGS.map(b=>[b.id,1]));
        this.state.gmult=this.state.prestige_count>0?Math.pow(1.10,this.state.prestige_count):1;
        upgs.forEach(id=>{const u=UPGRADES.find(x=>x.id===id);if(u){this.state.upgrades.push(id);this.applyUpg(u);}});
      }
    }catch(e){console.warn('Load failed',e);}
  },

  checkOffline(){
    const el=Math.min((Date.now()-this.state.lastSave)/1000,28800);if(el<60)return;
    const rt=this.rates(),gained={};
    for(const[k,v]of Object.entries(rt)){const g=v*el;if(g>0){this.state.res[k]=(this.state.res[k]||0)+g;if(k==='bones')this.state.bones_earned+=g;gained[k]=g;}}
    const hrs=Math.floor(el/3600),mins=Math.floor((el%3600)/60);
    const ts=hrs>0?hrs+'h '+mins+'m':mins+'m';
    const gs=Object.entries(gained).filter(([,v])=>v>=1).map(([k,v])=>'+'+this.fmt(v)+' '+k.replace(/_/g,' ').toUpperCase()).join(' | ');
    if(gs){document.getElementById('offline-desc').innerHTML='Away for <b>'+ts+'</b>.<br><br>'+gs;document.getElementById('offline-overlay').classList.remove('hidden');}
  },

  showNewGame(){document.getElementById('newgame-overlay').classList.remove('hidden');},
  confirmNewGame(){
    localStorage.removeItem('jurn_necropolis_v2');
    localStorage.removeItem('jurn_necropolis_v1');
    document.getElementById('newgame-overlay').classList.add('hidden');
    this.state=this.defState();
    this.activeEffects=[];
    document.body.className='skin-graveyard';
    SCENE.walkers=[];SCENE.currentMap=0;
    if(SCENE.images['skeleton'])for(let i=0;i<3;i++)SCENE._addSkeleton();
    this.renderBuildings();this.renderUpgrades();this.renderChars();this.checkUnlocks();this.updateUI();
    this.floatMsg('NEW GAME STARTED','#ff3344');
  },

  exportSave(){this.save(true);prompt('Copy save code:',btoa(JSON.stringify(this.state)));},
  importSavePrompt(){
    const d=prompt('Paste save code:');if(!d)return;
    try{this.state=Object.assign(this.defState(),JSON.parse(atob(d)));this.save(true);this.floatMsg('📥 IMPORTED','#00ccff');this.renderBuildings();this.renderUpgrades();this.renderChars();this.updateUI();}
    catch(e){alert('Invalid save.');}
  },

  tickAutoClick(dt){
    if(!this.hasChar('r3x'))return;this._autoT+=dt;
    const interval=5000/Math.max(1,this.em('click'));
    if(this._autoT>=interval){this._autoT=0;const v=this.clickVal();this.state.res.bones+=v;this.state.bones_earned+=v;SCENE.triggerDig();}
  },

  tick(){
    const dt=200,s=this.state,rt=this.rates();
    for(const[k,v]of Object.entries(rt)){if(v>0){s.res[k]=(s.res[k]||0)+v*(dt/1000);if(k==='bones')s.bones_earned+=v*(dt/1000);}}
    const now=Date.now();this.activeEffects=this.activeEffects.filter(e=>e.exp>now);
    this.tickCZ(dt);this.tickAutoClick(dt);this.checkMilestones();this.checkUnlocks();SCENE.syncWithState(s);this.updateUI();
  },

  setShopTab(tab){
    this.shopTab=tab;
    ['buildings','upgrades','band','stats'].forEach(t=>{
      document.getElementById('stab-'+t).classList.toggle('active',t===tab);
      document.getElementById(t+'-list').classList.toggle('hidden',t!==tab);
    });
    if(tab==='buildings')this.renderBuildings();
    else if(tab==='upgrades')this.renderUpgrades();
    else if(tab==='band')this.renderChars();
    else if(tab==='stats')this.renderStats();
  },

  costStr(cost){return Object.entries(cost).map(([k,v])=>this.fmt(v)+' '+k.replace(/_/g,' ')).join(' | ');},
  prodStr(prod){return Object.entries(prod).filter(([,v])=>v>0).map(([k,v])=>'+'+v+' '+k.replace(/_/g,' ')+'/s').join(' ')||'';},

  renderBuildings(){
    const s=this.state,el=document.getElementById('buildings-list');if(!el)return;
    let html='';
    BUILDINGS.forEach(b=>{
      const unlocked=this.bldUnlocked(b);
      const owned=s.bld[b.id]||0;
      const cost=this.bldCost(b.id);
      const afford=this.canAfford(cost);
      const cls='bld-card'+(unlocked?' unlocked':'')+(unlocked&&afford?' can-afford':'');
      const costDisplay=unlocked?this.costStr(cost):'???';
      const prodDisplay=this.prodStr(b.production);
      html+=`<div class="${cls}">
  <div class="bld-header">
    <div class="bld-icon-name"><span class="bld-icon">${b.icon}</span><span class="bld-name">${b.name}</span></div>
    <span class="bld-owned">${owned||''}</span>
  </div>
  ${unlocked?`<div class="bld-desc">${b.desc}</div><div class="bld-flavor" style="opacity:0.4">${b.flavor}</div>`:'<div class="bld-desc" style="opacity:0.3">??? LOCKED ???</div>'}
  <div class="bld-cost">${costDisplay}</div>
  <div class="bld-production">${prodDisplay}</div>
  ${unlocked?`<div class="bld-buy-btns">
    <button class="btn" style="font-size:5px;flex:1" onclick="game.buyBuilding('${b.id}',1)" ${afford?'':'disabled'}>BUY 1</button>
    <button class="btn" style="font-size:5px;flex:1" onclick="game.buyBuilding('${b.id}',10)" ${afford?'':'disabled'}>x10</button>
    <button class="btn" style="font-size:5px;flex:1" onclick="game.buyMax('${b.id}')">MAX</button>
  </div>`:''}
</div>`;
    });
    el.innerHTML=html;
  },

  renderUpgrades(){
    const s=this.state,el=document.getElementById('upgrades-list');if(!el)return;
    let html='';
    UPGRADES.forEach(u=>{
      const bought=s.upgrades.includes(u.id);
      const unlocked=this.upgUnlocked(u);
      const afford=this.canAfford(u.cost);
      const cls='upg-card'+(bought?' bought':unlocked?' unlocked':'');
      const onclick=(!bought&&unlocked&&afford)?`onclick="game.buyUpgrade('${u.id}')"` :'';
      html+=`<div class="${cls}" ${onclick}>
  <div class="upg-header"><span class="upg-icon">${u.icon}</span><span class="upg-name">${u.name}</span></div>
  <div class="upg-desc">${u.desc}</div>
  <div class="upg-cost">${bought?'':'Cost: '+this.costStr(u.cost)}</div>
  ${bought?'<div class="upg-bought-label">&#x2713; ACQUIRED</div>':''}
</div>`;
    });
    el.innerHTML=html;
  },

  renderChars(){
    const s=this.state,el=document.getElementById('band-list');if(!el)return;
    let html='';
    CHARACTERS.forEach(c=>{
      const owned=s.chars.includes(c.id);
      const cls='band-card'+(owned?' unlocked':'');
      const unlockStr=c.unlockReq.bones_earned?'Harvest '+this.fmt(c.unlockReq.bones_earned)+' bones':c.unlockReq.total_clicks?c.unlockReq.total_clicks.toLocaleString()+' clicks':c.unlockReq.bld_owned?'Build a '+Object.keys(c.unlockReq.bld_owned)[0].replace(/_/g,' '):'???';
      html+=`<div class="${cls}">
  <div class="band-icon" style="color:${c.color};font-size:24px">${c.icon}</div>
  <div class="band-info">
    <div class="band-name" style="color:${c.color};font-size:7px">${c.name}</div>
    <div class="band-title" style="font-size:5px;color:#666">${c.title}</div>
    ${owned?`<div class="band-lore" style="font-size:5px;color:#ccc;margin:4px 0">${c.lore}</div><div class="band-bonus" style="font-size:5px;color:#00e87a">&#x25b6; ${c.bonus}</div>`:`<div style="font-size:5px;color:#444;margin-top:4px">LOCKED &mdash; ${unlockStr}</div>`}
  </div>
</div>`;
    });
    el.innerHTML=html;
  },

  renderStats(){
    const s=this.state;
    const ids=['total','clicks','cpower','bcount','prestige2','czevents'];
    const vals=[this.fmt(s.bones_earned),s.total_clicks.toLocaleString(),this.fmt(this.clickVal()),s.buildings_total.toLocaleString(),s.prestige_count,s.cz_seen];
    ids.forEach((id,i)=>{const el=document.getElementById('stat-'+id);if(el)el.textContent=vals[i];});
    const lore=document.getElementById('lore-section');
    if(lore){
      const frags=s.lore.map(id=>{const ev=CZ_EVENTS.find(x=>x.id===id);return ev?`<div class="lore-entry"><div class="lore-title">${ev.title}</div>${ev.msg}</div>`:''}).join('');
      lore.innerHTML=frags||'<div style="color:#444;font-size:5px;padding:8px">NO TRANSMISSIONS RECEIVED YET</div>';
    }
  },

  updateUI(){
    const s=this.state,rt=this.rates();
    const RN={bones:'bones',souls:'souls',ectoplasm:'ecto',dark_signal:'signal',fan_rep:'rep',dark_energy:'de'};
    const RC={bones:'#c8a84b',souls:'#8855ff',ectoplasm:'#00e87a',dark_signal:'#ff3344',fan_rep:'#ff8c00',dark_energy:'#00ccff'};
    for(const[res,id]of Object.entries(RN)){
      const v=s.res[res]||0,r=rt[res]||0;
      const vel=document.getElementById('val-'+id);if(vel)vel.textContent=this.fmt(v);
      const rel=document.getElementById('rate-'+id);if(rel){rel.textContent=r>0?'+'+this.fmt(r,2)+'/s':'';rel.style.color=RC[res]||'#aaa';}
    }
    const bpc=document.getElementById('bpc-val');if(bpc)bpc.textContent=this.fmt(this.clickVal());
    // active effects bar
    const now=Date.now(),eb=document.getElementById('effects-bar');
    if(eb){
      const active=this.activeEffects.filter(e=>e.exp>now);
      const ELABELS={bones:'Bones',ecto:'Ecto',all:'ALL',click:'Click',fan:'Fan'};
      eb.innerHTML=active.map(e=>{
        const sec=Math.ceil((e.exp-now)/1000);
        const lbl=(ELABELS[e.type]||e.type)+' x'+e.mult+' '+sec+'s';
        return`<div class="effect-pill" style="color:#ff8c00;border-color:#ff8c00">${lbl}</div>`;
      }).join('');
    }
    if(this.shopTab==='buildings')this.renderBuildings();
    else if(this.shopTab==='upgrades')this.renderUpgrades();
    else if(this.shopTab==='stats')this.renderStats();
  },

  showMilestone(icon,msg,bonus){
    const t=document.getElementById('milestone-toast');if(!t)return;
    document.getElementById('ms-icon').textContent=icon;
    document.getElementById('ms-msg').textContent=msg;
    document.getElementById('ms-bonus').textContent=bonus||'';
    t.classList.remove('hidden');clearTimeout(this._msTimer);
    this._msTimer=setTimeout(()=>t.classList.add('hidden'),3500);
  },

  floatText(x,y,txt,color){
    const fl=document.getElementById('float-layer');if(!fl)return;
    const d=document.createElement('div');d.className='float-val';
    d.style.cssText=`left:${x}px;top:${y}px;color:${color||'#c8a84b'}`;
    d.textContent=txt;fl.appendChild(d);setTimeout(()=>d.remove(),1300);
  },

  floatMsg(msg,color){
    const fl=document.getElementById('float-layer');if(!fl)return;
    const d=document.createElement('div');d.className='float-msg';d.style.color=color||'#c8a84b';
    d.textContent=msg;fl.appendChild(d);setTimeout(()=>d.remove(),1800);
  },

  init(){
    this.state=this.defState();this.load();
    const sk=SKINS.find(x=>x.id===this.state.skin);if(sk)document.body.className=sk.cls;
    const lbl=document.getElementById('skin-label');
    if(lbl&&this.state.prestige_count>0){const skn=SKINS.find(x=>x.id===this.state.skin);if(skn)lbl.textContent='◈ '+skn.name+' ◈';}
    this.checkOffline();
    SCENE.init();
    this.renderBuildings();this.renderUpgrades();this.renderChars();this.checkUnlocks();this.updateUI();
    this.rotateTicker();
    setInterval(()=>this.save(true),30000);
    setInterval(()=>this.tick(),200);
    if(this.state.prestige_count>0){const badge=document.getElementById('prestige-badge');if(badge)badge.classList.remove('hidden');}
  },
};

window.addEventListener('DOMContentLoaded',()=>game.init());
