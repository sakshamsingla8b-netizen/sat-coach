/**
 * ScoreUp AI proxy — Cloudflare Worker
 *
 * Holds the Groq API key secretly (as an env secret named GROQ_API_KEY)
 * and forwards chat requests to Groq. Visitors never need their own key.
 *
 * Basic protections included:
 *   - Only allows requests from your own site (ALLOWED_ORIGINS)
 *   - Only allows POST
 *   - Caps how much text a request can send (stops abuse of your free tier)
 *   - Forces a sane model + max token limit
 */

const ALLOWED_ORIGINS = [
  "https://sakshamsingla8b-netizen.github.io", // your live site
  "http://localhost:8000",                     // local testing
  "http://127.0.0.1:5500",                     // VS Code Live Server
];

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b"; // upgraded for accurate math reasoning
const MAX_INPUT_CHARS = 6000; // reject huge requests

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    // Browser preflight check
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }

    // Only let YOUR site use this proxy
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return json({ error: "Origin not allowed" }, 403, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "Invalid JSON" }, 400, cors);
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "messages required" }, 400, cors);
    }

    // Guard: reject oversized requests
    const totalChars = messages.reduce((n, m) => n + (m.content?.length || 0), 0);
    if (totalChars > MAX_INPUT_CHARS) {
      return json({ error: "Request too large" }, 413, cors);
    }

    // Forward to Groq using YOUR secret key
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + env.GROQ_API_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: typeof body.temperature === "number" ? body.temperature : 0.4,
        max_tokens: 1200,
      }),
    });

    const data = await groqRes.json();
    return json(data, groqRes.status, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
