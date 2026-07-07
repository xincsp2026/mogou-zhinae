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
const lines = [
    "<!DOCTYPE html>",
    "<html lang=zh><head><meta charset=UTF-8>",
    "<meta name=viewport content='width=device-width,initial-scale=1.0'>",
    "<title>模构智脑</title><style>",
    "*{box-sizing:border-box;margin:0;padding:0}",
    "body{background:#0D0D0B;color:#F0EDE8;font-family:Arial,sans-serif;height:100vh;display:flex;flex-direction:column;overflow:hidden}",
    ".nav{height:52px;background:#161614;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 1rem;flex-shrink:0}",
    ".lb{width:32px;height:32px;background:#6A9E2F;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;margin-right:.6rem}",
    ".on{margin-left:auto;font-size:11px;color:#8BC34A;padding:.28rem .65rem;border-radius:10px;background:rgba(139,195,74,.1)}",
    ".msgs{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.65rem}",
    ".msg{display:flex;gap:8px;align-items:flex-start}",
    ".msg.u{flex-direction:row-reverse}",
    ".av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;background:#6A9E2F;color:#fff}",
    ".av.u{background:#3A3A35}",
    ".bbl{padding:.65rem .9rem;font-size:13px;line-height:1.8;max-width:85%;white-space:pre-wrap;word-break:break-word;background:#161614;border:1px solid rgba(255,255,255,.07);border-radius:3px 12px 12px 12px}",
    ".msg.u .bbl{background:#6A9E2F;color:#fff;border-radius:12px 3px 12px 12px}",
    ".qw{padding:.35rem 1rem;display:flex;flex-wrap:wrap;gap:.35rem}",
    ".qr{padding:.3rem .75rem;border-radius:14px;font-size:12px;border:1px solid rgba(255,255,255,.13);color:rgba(240,237,232,.5);cursor:poin
