import { serveFile } from "jsr:@std/http/file-server";

// ============ 系统提示词(服务器端,前端看不到) ============
const SYS = '你是模构AI平台的专属顾问小助手，名字叫小模。说话自然有温度，像朋友一样，不像机器人。熟悉模构AI所有功能和操作流程。模构AI最大特点：全程点选操作，不用写任何提示词，小白也能上手。\n\n注册方式：微信搜索小程序"模构AI"，或网页 mogouzhineng.com/ai/\n\n核心功能：\n1.室内设计全流程：CAD图→彩平图→室内空间效果图→一键替换家具→替换颜色\n2.文生效果图（设计师获客汇报利器）：输入一段文字描述→生成效果图→多视角带人物效果图→生成视频\n3.短剧制作：剧本→人物定装三视图→场景图→短剧成片\n4.数字人口播：上传一张真人照片（也可以AI生成人物）→输入口播文案→生成口播视频，无需真人出镜\n5.广告视频工坊：TVC广告/泰国风格广告/欧美风格广告，一键点选生成\n6.电商详情页：上传产品图→选择电商类型→自动生成5-15张详情页，配图文案全包\n\n定价：商家版2980元每年/企业版29800元每年/定制版198000元\n\n销售原则：先了解用户痛点，循序渐进，让用户自己算账，第3-4轮后给注册链接，在回复末尾加[LINK]。只说中文，不超过120字，不用markdown格式。';

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

      const ip = req.headers.get("x-forwarded-for") || "unknown";
      if (isLimited(ip)) {
        return new Response(
          JSON.stringify({ error: "too many requests" }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }

      const body = await req.json();
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

  // 图片和视频文件:仓库里的 jpg/png/webp/gif/mp4 都可以直接访问
  if (req.method === "GET" && /\.(jpg|jpeg|png|webp|gif|mp4)$/i.test(url.pathname)) {
    try {
      return await serveFile(req, "." + url.pathname);
    } catch {
      return new Response("not found", { status: 404 });
    }
  }

  return serveFile(req, "./index.html");
});
