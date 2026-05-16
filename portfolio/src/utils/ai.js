// AI utility — routes through /api/gemini (Vercel serverless proxy)
// Layer 3: client-side throttle — 8s cooldown between calls

const COOLDOWN_MS = 8000;
let lastCallTime = 0;

async function callGemini(prompt) {
  // Layer 3 — client-side throttle
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < COOLDOWN_MS) {
    const wait = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
    throw new Error(`Please wait ${wait}s before generating again.`);
  }
  lastCallTime = now;

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `AI request failed (${response.status})`);
  }

  const data = await response.json();
  return (data.text || '').trim();
}

export async function generateBio({ name, title, skills }) {
  const skillList = skills.map((s) => s.label || s).filter(Boolean).join(', ');
  const prompt = `Write a sharp, professional bio for a developer portfolio website.

Name: ${name || 'a developer'}
Title: ${title || 'software engineer'}
Skills: ${skillList || 'general engineering'}

Constraints:
- Exactly 2-3 sentences.
- First person, confident but not arrogant.
- Mention 1-2 concrete strengths or focus areas — no buzzword soup.
- No emoji. No quotes. No markdown. No lead-in like "Here is...".
Return only the bio text.`;
  return callGemini(prompt);
}

export async function enhanceDescription(rough) {
  const prompt = `Polish this project description for a developer portfolio. Make it sharp, technical, and recruiter-friendly.

Original:
"""
${rough}
"""

Constraints:
- 2-3 sentences max.
- Lead with the user-facing impact or technical achievement.
- Concrete and specific — keep any numbers, technologies, or scale signals.
- No emoji, no markdown, no lead-in. Return only the rewritten description.`;
  return callGemini(prompt);
}

export async function suggestSkills(existing) {
  const list = existing.map((s) => s.label || s).filter(Boolean).join(', ');
  const prompt = `Given these skills a developer already has: ${list || '(none yet)'}.

Suggest exactly 5 ADDITIONAL skills that would complement them and look strong on a portfolio. Pick complementary tools, frameworks, or specializations — avoid restating anything in the input list.

Return ONLY a comma-separated list of 5 skill names. No numbering, no commentary, no markdown.`;
  const raw = await callGemini(prompt);
  return raw
    .split(/[,\n]/)
    .map((s) => s.replace(/^[\d.)\-\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 5);
}
