import { serveFile } from "jsr:@std/http/file-server";
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
      const body = await req.json();
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
