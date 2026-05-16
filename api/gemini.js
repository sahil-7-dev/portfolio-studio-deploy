// api/gemini.js — Vercel serverless proxy for Google Gemini
// Keeps GEMINI_API_KEY server-side. Set it in Vercel → Settings → Environment Variables.
//
// Required env:
//   GEMINI_API_KEY            — your Google Gemini API key
//
// Optional env (enables IP rate limiting):
//   UPSTASH_REDIS_REST_URL    — from Upstash dashboard
//   UPSTASH_REDIS_REST_TOKEN  — from Upstash dashboard

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Layer 2 — rate limit config
const RATE_LIMIT_PER_MIN = 4;
const RATE_LIMIT_PER_DAY = 10;

export const config = { maxDuration: 30 };

// Upstash Redis helper — lightweight fetch-based, no SDK needed
async function redisCmd(commands) {
  const url  = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commands)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function checkRateLimit(ip) {
  const minKey  = `ps:min:${ip}:${Math.floor(Date.now() / 60000)}`;
  const dayKey  = `ps:day:${ip}:${new Date().toISOString().slice(0, 10)}`;

  const results = await redisCmd([
    ['INCR', minKey],
    ['EXPIRE', minKey, 60],
    ['INCR', dayKey],
    ['EXPIRE', dayKey, 86400]
  ]);

  if (!results) return { allowed: true }; // Redis unavailable — fail open

  const minCount = results[0]?.result ?? 0;
  const dayCount = results[2]?.result ?? 0;

  if (minCount > RATE_LIMIT_PER_MIN) {
    return { allowed: false, reason: 'Too many requests. Please wait a minute.' };
  }
  if (dayCount > RATE_LIMIT_PER_DAY) {
    return { allowed: false, reason: 'Daily AI limit reached. Come back tomorrow.' };
  }
  return { allowed: true };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Layer 1 — Origin check
  const origin = req.headers.origin || req.headers.referer || '';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowedOrigins.length > 0 && !allowedOrigins.some(o => origin.includes(o))) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Layer 2 — IP rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const { allowed, reason } = await checkRateLimit(ip);
  if (!allowed) {
    return res.status(429).json({ error: reason });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
      })
    });

    if (!response.ok) {
      const err = await response.text().catch(() => '');
      return res.status(response.status).json({ error: `Gemini error: ${err}` });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Proxy error' });
  }
}
