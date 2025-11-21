
export async function onRequest(context) {
  const { request, env } = context;

  // CORS Headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-auth-key",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const KV = env.SITE_DATA_KV;
  if (!KV) {
    return new Response(JSON.stringify({ error: "KV not bound (SITE_DATA_KV)." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Updated Key for the new OS version to avoid conflicts
  const STORAGE_KEY = "macos_drive_store_v2";

  try {
    // GET: Retrieve data
    if (request.method === "GET") {
      const data = await KV.get(STORAGE_KEY);
      // Return default structure if empty
      const defaultData = { 
        notes: [], 
        events: [],
        music: [], // New music array
        settings: { theme: 'dark', wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' }
      };
      return new Response(data || JSON.stringify(defaultData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT: Save data
    if (request.method === "PUT") {
        const body = await request.text();
        await KV.put(STORAGE_KEY, body);
        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
