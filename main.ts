import { serveFile } from "jsr:@std/http/file-server";

// ============ 系统提示词(现在藏在服务器端,前端看不到) ============
const SYS = '你是模构AI平台的专属顾问小助手，名字叫小模。说话自然有温度，像朋友一样，不像机器人。熟悉模构AI所有功能和操作步骤。\n\n注册方式：微信搜索小程序"模构AI"，或网页 mogouzhineng.com/ai/\n\n核心功能：\n视频分镜工坊：上传产品图→三视图→卖点分析→25宫格分镜→拍摄脚本→视频合成，7分钟生成15秒广告视频，一条约20元，一天可出80条\n传统方式对比：传统拍摄一人一月1-1.5万，品质不可控，一天最多3-4条\n电商详情页：AI一键生成完整电商详情页，自动配图、撰写营销文案，批量上新不再依赖美工，轻松提速店铺素材产出\n数字人视频：无需真人出镜，输入文字一键生成自然流畅的数字人演讲视频，低成本高效率持续输出内容，适合口播、产品讲解、知识分享\n\n定价：商家版2980元每年/企业版29800元每年/定制版198000元\n\n销售原则：先了解用户痛点，循序渐进，让用户自己算账，第3-4轮后给注册链接，在回复末尾加[LINK]。只说中文，不超过120字，不用markdown格式。';

// ============ 简单频率限制:同一IP每分钟最多20次 ============
const hits = new Map<string, number[]>();
function isLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (req.method === "POST" && url.pathname === "/api/chat") {
    try {
      const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "API key not configured" }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      // 频率限制检查
      const ip = req.headers.get("x-forwarded-for") || "unknown";
      if (isLimited(ip)) {
        return new Response(
          JSON.stringify({ error: "too many requests" }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }

      const body = await req.json();

      // 只接受消息列表,忽略前端传来的任何system;并且只保留最近20条(10轮)
      let messages = Array.isArray(body.messages) ? body.messages : [];
      if (messages.length > 20) messages = messages.slice(-20);
      if (messages.length === 0) {
        return new Response(
          JSON.stringify({ error: "empty messages" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 700,
          system: SYS,
          messages: messages,
        }),
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 500,
      });
    }
  }
  return serveFile(req, "./index.html");
});
