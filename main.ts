Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method === "POST" && url.pathname === "/api/chat") {
    try {
      const body = await req.json();
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "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",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 800,
          system: body.system,
          messages: body.messages,
        }),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
  }

  return new Response(`<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>模构智脑</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0D0D0B;color:#F0EDE8;font-family:Arial,sans-serif;height:100vh;display:flex;flex-direction:column}
.nav{height:52px;background:#161614;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 1.25rem;flex-shrink:0}
.logo{display:flex;align-items:center;gap:.6rem}
.logo-box{width:32px;height:32px;background:#6A9E2F;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff}
.logo-name{font-size:15px;font-weight:600}
.logo-sub{font-size:10px;color:rgba(240,237,232,.5);margin-left:.2rem}
.online{margin-left:auto;font-size:11px;color:#8BC34A;padding:.28rem .65rem;border-radius:10px;background:rgba(139,195,74,.1);border:1px solid rgba(139,195,74,.2)}
.layout{flex:1;display:flex;overflow:hidden}
.chat-panel{flex:1;display:flex;flex-direction:column}
.msgs{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.65rem}
.msg{display:flex;gap:8px;align-items:flex-start}
.msg.u{flex-direction:row-reverse}
.av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}
.av.ai{background:#6A9E2F;color:#fff}
.av.u{background:#3A3A35;color:#F0EDE8}
.bbl{padding:.65rem .9rem;border-radius:12px;font-size:13px;line-height:1.8;max-width:82%;white-space:pre-wrap;word-break:break-word}
.msg.ai .bbl{background:#161614;border:1px solid rgba(255,255,255,.07);border-radius:3px 12px 12px 12px}
.msg.u .bbl{background:#6A9E2F;color:#fff;border-radius:12px 3px 12px 12px}
.dots{display:flex;gap:4px;padding:.65rem .9rem;background:#161614;border:1px solid rgba(255,255,255,.07);border-radius:3px 12px 12px 12px;align-self:flex-start;margin-left:38px}
.dots span{width:6px;height:6px;border-radius:50%;background:rgba(240,237,232,.4);animation:dt 1.2s infinite}
.dots span:nth-child(2){animation-delay:.2s}
.dots span:nth-child(3){animation-delay:.4s}
@keyframes dt{0%,100%{opacity:.3}50%{opacity:1}}
.qr-wrap{padding:.35rem 1rem .35rem 46px;display:flex;flex-wrap:wrap;gap:.35rem}
.qr{padding:.28rem .7rem;border-radius:14px;font-size:11px;border:1px solid rgba(255,255,255,.13);color:rgba(240,237,232,.5);cursor:pointer;background:transparent}
.qr:hover{border-color:#8BC34A;color:#8BC34A}
.inp-area{padding:.85rem 1rem;border-top:1px solid rgba(255,255,255,.07);background:#161614;display:flex;gap:.55rem;flex-shrink:0}
.inp{flex:1;padding:.6rem .95rem;background:#1E1E1B;border:1px solid rgba(255,255,255,.13);border-radius:22px;color:#F0EDE8;font-size:13px;font-family:Arial,sans-serif}
.inp:focus{outline:none;border-color:#8BC34A}
.sbtn{width:38px;height:38px;border-radius:50%;background:#6A9E2F;color:#fff;border:none;cursor:pointer;font-size:16px;flex-shrink:0}
.sbtn:disabled{opacity:.35}
.sb{width:255px;background:#161614;border-left:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;overflow:hidden;flex-shrink:0}
.sb-sec{padding:.8rem 1rem;border-bottom:1px solid rgba(255,255,255,.07)}
.sb-ttl{font-size:10px;letter-spacing:.12em;color:rgba(240,237,232,.5);text-transform:uppercase;margin-bottom:.6rem}
.int-big{font-size:34px;font-weight:300;color:#8BC34A}
.int-bar-bg{height:5px;background:#1E1E1B;border-radius:3px;overflow:hidden;margin:.4rem 0}
.int-bar-fill{height:100%;background:linear-gradient(90deg,#6A9E2F,#8BC34A);border-radius:3px;transition:width .6s ease;width:0%}
.ist{display:flex;align-items:center;gap:.4rem;font-size:11px;color:rgba(240,237,232,.2);padding:.18rem 0}
.ist-dot{width:5px;height:5px;border-radius:50%;background:rgba(240,237,232,.2);flex-shrink:0}
.ist.done{color:rgba(240,237,232,.5)} .ist.done .ist-dot{background:#8BC34A}
.ist.curr{color:#8BC34A} .ist.curr .ist-dot{background:#8BC34A}
.ho-card{background:#1E1E1B;border-radius:9px;padding:.9rem;border:1px solid rgba(139,195,74,.25)}
.ho-ttl{font-size:11px;color:#8BC34A;font-weight:600;margin-bottom:.6rem}
.hof{margin-bottom:.5rem}
.hof label{display:block;font-size:10px;color:rgba(240,237,232,.5);margin-bottom:.22rem}
.hof input{width:100%;padding:.48rem .7rem;background:#0D0D0B;border:1px solid rgba(255,255,255,.13);border-radius:6px;color:#F0EDE8;font-size:12px;font-family:Arial,sans-serif}
.hof input:focus{outline:none;border-color:#8BC34A}
.ho-btn{width:100%;padding:.58rem;background:#6A9E2F;color:#fff;border:none;border-radius:7px;font-size:12px;cursor:pointer;margin-top:.35rem}
.stat-r{display:flex;justify-content:space-between;font-size:11px;padding:.22rem 0;border-bottom:1px solid rgba(255,255,255,.07)}
.stat-r:last-child{border-bottom:none}
::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.13);border-radius:2px}
</style>
</head>
<body>
<nav class="nav">
  <div class="logo">
    <div class="logo-box">MG</div>
    <div class="logo-name">模构智脑</div>
    <div class="logo-sub">深圳模构智能科技</div>
  </div>
  <div class="online">● 在线服务中</div>
</nav>
<div class="layout">
  <div class="chat-panel">
    <div class="msgs" id="msgs"></div>
    <div id="qrArea"></div>
    <div class="inp-area">
      <input class="inp" id="inp" placeholder="有什么想了解的，直接说..." onkeydown="if(event.key==='Enter')send()"/>
      <button class="sbtn" id="sbtn" onclick="send()">→</button>
    </div>
  </div>
  <div class="sb">
    <div class="sb-sec">
      <div class="sb-ttl">购买意向</div>
      <div class="int-big" id="iVal">0%</div>
      <div class="int-bar-bg"><div class="int-bar-fill" id="iBar"></div></div>
      <div class="ist curr" id="is0"><div class="ist-dot"></div>感受产品价值</div>
      <div class="ist" id="is1"><div class="ist-dot"></div>识别客户痛点</div>
      <div class="ist" id="is2"><div class="ist-dot"></div>推荐核心功能</div>
      <div class="ist" id="is3"><div class="ist-dot"></div>版本方案确认</div>
      <div class="ist" id="is4"><div class="ist-dot"></div>体验引导</div>
      <div class="ist" id="is5"><div class="ist-dot"></div>转人工成交</div>
    </div>
    <div class="sb-sec">
      <div class="sb-ttl">客户类型</div>
      <div id="ctArea" style="color:rgba(240,237,232,.2);font-size:12px">识别中...</div>
    </div>
    <div class="sb-sec" style="flex:1;overflow-y:auto">
      <div class="sb-ttl">推荐版本</div>
      <div id="recArea" style="color:rgba(240,237,232,.2);font-size:12px">对话后自动匹配</div>
    </div>
    <div class="sb-sec" id="hoSec" style="display:none">
      <div class="ho-card">
        <div class="ho-ttl">✓ 预约专属顾问</div>
        <div class="hof"><label>姓名</label><input id="hoN" placeholder="您的姓名"/></div>
        <div class="hof"><label>联系电话</label><input id="hoP" placeholder="手机号码"/></div>
        <div class="hof"><label>公司/行业</label><input id="hoC" placeholder="便于顾问了解需求"/></div>
        <button class="ho-btn" onclick="submitHO()">立即预约 →</button>
      </div>
    </div>
    <div class="sb-sec">
      <div class="sb-ttl">今日数据</div>
      <div class="stat-r"><span style="color:rgba(240,237,232,.5)">接待咨询</span><span id="stT">1</span></div>
      <div class="stat-r"><span style="color:rgba(240,237,232,.5)">有效意向</span><span id="stI">0</span></div>
      <div class="stat-r"><span style="color:rgba(240,237,232,.5)">转人工</span><span id="stH">0</span></div>
    </div>
  </div>
</div>
<script>
var hist=[],intentN=0,hoShown=false;
function $(i){return document.getElementById(i);}
function addMsg(role,text){
  var d=document.createElement('div');d.className='msg '+role;
  var av=document.createElement('div');av.className='av '+role;av.textContent=role==='ai'?'MG':'您';
  var bbl=document.createElement('div');bbl.className='bbl';bbl.textContent=text;
  d.appendChild(av);d.appendChild(bbl);
  $('msgs').appendChild(d);$('msgs').scrollTop=9999;
}
function showDots(){
  var d=document.createElement('div');d.className='dots';d.id='typing';
  d.innerHTML='<span></span><span></span><span></span>';
  $('msgs').appendChild(d);$('msgs').scrollTop=9999;
}
function removeDots(){var t=$('typing');if(t)t.remove();}
function showQR(opts){
  var area=$('qrArea');area.innerHTML='';
  var wrap=document.createElement('div');wrap.className='qr-wrap';
  opts.forEach(function(o){
    var b=document.createElement('button');b.className='qr';b.textContent=o;
    b.onclick=function(){area.innerHTML='';sendText(o);};
    wrap.appendChild(b);
  });
  area.appendChild(wrap);
}
function setIntent(pct,step){
  intentN=Math.min(100,Math.max(intentN,pct));
  $('iBar').style.width=intentN+'%';
  $('iVal').textContent=intentN+'%';
  for(var i=0;i<6;i++){
    var e=$('is'+i);if(!e)continue;
    e.className='ist';
    if(i<step)e.classList.add('done');
    else if(i===step)e.classList.add('curr');
  }
  if(intentN>=40){$('stI').textContent='1';}
}
function setCtype(type){
  var icons={'家具工厂':'🏭','室内设计师':'🎨','短视频创作者':'🎬','建材品牌':'🧱','电商卖家':'🛒','MCN机构':'📱','代理商':'🤝'};
  $('ctArea').innerHTML='<span style="background:rgba(139,195,74,.1);color:#8BC34A;padding:.25rem .6rem;border-radius:7px;font-size:12px">'+(icons[type]||'👤')+' '+type+'</span>';
}
function setRec(v,p,d){
  $('recArea').innerHTML='<div style="background:#1E1E1B;border-radius:8px;padding:.75rem;border:1px solid rgba(255,255,255,.07)"><div style="font-size:12px;font-weight:600;color:#8BC34A">'+v+'</div><div style="font-size:17px;font-weight:300;margin:.12rem 0">'+p+'</div><div style="font-size:10px;color:rgba(240,237,232,.5);line-height:1.55">'+d+'</div></div>';
}
function showHO(){
  if(hoShown)return;hoShown=true;
  $('hoSec').style.display='block';
  $('stH').textContent='1';
}
function submitHO(){
  var n=$('hoN').value.trim(),p=$('hoP').value.trim();
  if(!n||!p){return;}
  $('hoSec').innerHTML='<div style="text-align:center;padding:.85rem;color:#8BC34A;font-size:13px">✓ 预约成功！<br><small style="color:rgba(240,237,232,.5);font-size:11px">顾问2小时内致电 '+p+'</small></div>';
  addMsg('ai','太好了，'+n+'！顾问将在2小时内致电您（'+p+'）。期待帮您提升效率 🎉');
}
var SYS='你是深圳模构智能科技有限公司的专属销售顾问，名字叫模构小助手。你不是客服，你是销售顾问。熟悉模构AI所有功能，就像用了两年一样。\n\n模构AI核心功能：\n视频创作：人物视频（数字人代言）、短剧视频（海量模板）、批量视频（一键下载拆解混剪）\n图片创作：效果图片、推理图片\n电商专属9大功能：电商图片、场景替换、商品替换、商品换色、AI抠图、无损放大、一键超清、智能延展、局部重绘、图片翻译\n视频分镜工坊6步：产品三视图→卖点分析→25宫格分镜图→拍摄脚本→视频合成→种草视频\n一键出图：15+分类，装修效果图/空间设计/电商虚拟摄影等\n生态圈素材库：家具/建材/设计行业\n董事长机器人助理（企业版及以上）\n注意：作品仅保留24小时\n\n定价：\n个人版：月充值最低500元\n商家版：2980元/年，赠2000算力（推荐家具工厂/设计师）\n企业版：29800元/年，赠20000算力+10子账号（推荐MCN/团队）\n定制版：198000元终身，OEM70%分润（推荐代理商）\n\n对话原则：先给震撼案例，再问需求。用场景化语言，数字说话。每次100字以内。\n\n每次回复结尾必须加：<!--D:{"i":意向0到100,"s":步骤0到5,"t":"客户类型","v":"推荐版本","p":"价格"}-->\n意向达85时加：<!--HO-->';

function send(){var v=$('inp').value.trim();if(!v)return;$('inp').value='';sendText(v);}
function sendText(text){
  $('qrArea').innerHTML='';
  addMsg('u',text);
  $('sbtn').disabled=true;
  hist.push({role:'user',content:text});
  showDots();
  fetch('/api/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({system:SYS,messages:hist})
  })
  .then(function(r){return r.json();})
  .then(function(d){
    removeDots();$('sbtn').disabled=false;
    if(d.error){addMsg('ai','抱歉，请求失败：'+d.error);return;}
    var t=(d.content||[]).map(function(b){return b.text||'';}).join('');
    var dm=t.match(/<!--D:(\{[^>]+\})-->/);
    if(dm){try{var sc=JSON.parse(dm[1]);setIntent(sc.i,sc.s);if(sc.t)setCtype(sc.t);if(sc.v&&sc.p)setRec(sc.v,'¥'+sc.p,'点击预约顾问了解详情');}catch(e){}}
    var doHO=t.includes('<!--HO-->');
    var clean=t.replace(/<!--D:[^>]+-->/g,'').replace(/<!--HO-->/g,'').trim();
    hist.push({role:'assistant',content:clean});
    addMsg('ai',clean);
    if(doHO||intentN>=85)showHO();
    else if(hist.length===2)showQR(['我做家具的','我是室内设计师','我做短视频/内容','我是建材品牌','我想做代理']);
    else if(hist.length===4)showQR(['想了解价格','想申请试用','想了解企业版']);
  })
  .catch(function(){removeDots();$('sbtn').disabled=false;addMsg('ai','网络错误，请重试。');});
}
function initChat(){
  addMsg('ai','您好！我是模构小助手 👋\\n\\n先给您看一个真实案例：\\n\\n佛山某家具工厂昨天用模构AI做了件事——\\n上传1张沙发实拍图，10秒出6种颜色版本，放进5个不同场景，生成25宫格分镜+完整拍摄脚本，一套电商详情页全部自动生成。\\n\\n全程没有摄影师、没有设计师，传统方式要花¥3000+和3天。\\n\\n您目前做什么行业？');
  showQR(['我做家具的','我是室内设计师','我做短视频/内容','我是建材品牌','我想了解代理合作']);
}
initChat();
</script>
</body>
</html>`, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});
