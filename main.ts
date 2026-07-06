
Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname === "/api/chat") {
    const body = await req.json();
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "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",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,system:body.system,messages:body.messages}),
    });
    const data = await r.json();
    return new Response(JSON.stringify(data),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }

  return new Response(`<!DOCTYPE html>
<html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>模构智脑</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0D0D0B;color:#F0EDE8;font-family:Arial,sans-serif;height:100vh;display:flex;flex-direction:column}
.nav{height:52px;background:#161614;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 1rem;flex-shrink:0}
.logo-box{width:32px;height:32px;background:#6A9E2F;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;margin-right:.6rem}
.logo-name{font-size:15px;font-weight:600}
.online{margin-left:auto;font-size:11px;color:#8BC34A;padding:.28rem .65rem;border-radius:10px;background:rgba(139,195,74,.1)}
.msgs{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.65rem}
.msg{display:flex;gap:8px;align-items:flex-start}
.msg.u{flex-direction:row-reverse}
.av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}
.av.ai{background:#6A9E2F;color:#fff}
.av.u{background:#3A3A35;color:#F0EDE8}
.bbl{padding:.65rem .9rem;border-radius:12px;font-size:13px;line-height:1.8;max-width:85%;white-space:pre-wrap}
.msg.ai .bbl{background:#161614;border:1px solid rgba(255,255,255,.07);border-radius:3px 12px 12px 12px}
.msg.u .bbl{background:#6A9E2F;color:#fff;border-radius:12px 3px 12px 12px}
.qr-wrap{padding:.35rem 1rem;display:flex;flex-wrap:wrap;gap:.35rem}
.qr{padding:.3rem .75rem;border-radius:14px;font-size:12px;border:1px solid rgba(255,255,255,.13);color:rgba(240,237,232,.5);cursor:pointer;background:transparent}
.inp-area{padding:.85rem 1rem;border-top:1px solid rgba(255,255,255,.07);background:#161614;display:flex;gap:.55rem;flex-shrink:0}
.inp{flex:1;padding:.6rem .95rem;background:#1E1E1B;border:1px solid rgba(255,255,255,.13);border-radius:22px;color:#F0EDE8;font-size:13px;font-family:Arial,sans-serif}
.inp:focus{outline:none;border-color:#8BC34A}
.sbtn{width:38px;height:38px;border-radius:50%;background:#6A9E2F;color:#fff;border:none;cursor:pointer;font-size:16px;flex-shrink:0}
</style></head>
<body>
<nav class="nav">
  <div class="logo-box">MG</div>
  <div class="logo-name">模构智脑</div>
  <div class="online">● 在线服务中</div>
</nav>
<div class="msgs" id="msgs"></div>
<div id="qrArea"></div>
<div class="inp-area">
  <input class="inp" id="inp" placeholder="有什么想了解的，直接说..." onkeydown="if(event.key==='Enter')send()"/>
  <button class="sbtn" id="sbtn" onclick="send()">→</button>
</div>
<script>
var hist=[];
function $(i){return document.getElementById(i);}
function addMsg(role,text){
  var d=document.createElement('div');d.className='msg '+role;
  var av=document.createElement('div');av.className='av '+role;av.textContent=role==='ai'?'MG':'您';
  var bbl=document.createElement('div');bbl.className='bbl';bbl.textContent=text;
  d.appendChild(av);d.appendChild(bbl);
  $('msgs').appendChild(d);$('msgs').scrollTop=9999;
}
function showQR(opts){
  var a=$('qrArea');a.innerHTML='';
  var w=document.createElement('div');w.className='qr-wrap';
  opts.forEach(function(o){
    var b=document.createElement('button');b.className='qr';b.textContent=o;
    b.onclick=function(){a.innerHTML='';sendText(o);};w.appendChild(b);
  });
  a.appendChild(w);
}
var SYS='你是深圳模构智能科技公司的销售顾问模构小助手。熟悉模构AI所有功能：视频创作（人物视频/短剧视频/批量视频）、图片创作、电商专属9功能（场景替换/商品换色/AI抠图等）、视频分镜工坊（产品三视图→卖点分析→25宫格分镜→脚本→合成）。定价：商家版2980元/年、企业版29800元/年、定制版198000元。先给震撼案例，再问需求，100字以内，只说中文。';
function send(){var v=$('inp').value.trim();if(!v)return;$('inp').value='';sendText(v);}
function sendText(text){
  $('qrArea').innerHTML='';
  addMsg('u',text);
  $('sbtn').disabled=true;
  hist.push({role:'user',content:text});
  fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system:SYS,messages:hist})})
  .then(function(r){return r.json();})
  .then(function(d){
    $('sbtn').disabled=false;
    var t=(d.content||[]).map(function(b){return b.text||'';}).join('');
    if(!t){addMsg('ai','抱歉，请重试。');return;}
    hist.push({role:'assistant',content:t});
    addMsg('ai',t);
    if(hist.length===2)showQR(['我做家具的','我是室内设计师','我做短视频','我是建材品牌']);
  })
  .catch(function(){$('sbtn').disabled=false;addMsg('ai','网络错误，请重试。');});
}
addMsg('ai','您好！我是模构小助手！\n\n先给您看一个真实案例：佛山某家具工厂，上传1张沙发图，10秒出6种颜色版本+5个场景效果图+25宫格分镜+完整拍摄脚本+电商详情页，全程没有摄影师和设计师，传统方式要花3000元和3天时间。\n\n您目前做什么行业？');
showQR(['我做家具的','我是室内设计师','我做短视频','我是建材品牌','我想了解代理合作']);
</script>
</body></html>`,{headers:{"Content-Type":"text/html;charset=utf-8"}});
});
