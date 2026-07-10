Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (req.method === "POST" && url.pathname === "/api/chat") {
    try {
      const body = await req.json();
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "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",
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
  return new Response("OK", { status: 200 });
});
