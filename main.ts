import { serveFile } from "jsr:@std/http/file-server";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  if (req.method === "POST" && url.pathname === "/api/chat") {
    try {
      const body = await req.json();
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": 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
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 700,
          system: body.system,
          messages: body.messages,
        }),
      });
      const data = await r.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
    }
  }

  return serveFile(req, "./index.html");
});
