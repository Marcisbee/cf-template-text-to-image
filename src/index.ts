export default {
  async fetch(request, env) {
    // Add CORS headers to allow all origins
    const headers = new Headers()
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (request.method === 'OPTIONS') {
      return new Response("ok", {
        status: 204,
        headers
      });
    }

    if (request.method !== 'POST') {
      return Response.json({
        error: "Not allowed",
      }, {
        status: 400,
        headers
      });
    }

    const json: any = await request.clone().json()

    if (typeof json?.prompt !== "string") {
      return Response.json({
        error: "Invalid prompt",
      }, {
        status: 400,
        headers
      });
    }

    const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: json.prompt,
    });
    return Response.json({ image: response.image }, {
      status: 200,
      headers
    });
  },
} satisfies ExportedHandler<Env>;
