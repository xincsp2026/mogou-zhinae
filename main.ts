import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  
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
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  return new Response(`你好，模构智脑正在运行`, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}, { port: 8000 });
