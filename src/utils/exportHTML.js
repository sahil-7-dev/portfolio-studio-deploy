// Build a self-contained, deployable HTML file from portfolio data.
// All CSS is inlined. Fonts loaded via @import inside <style>.
// No JS frameworks — pure HTML/CSS with a tiny vanilla typewriter + IO script.

import { deriveAccentVars } from './colors.js';
import { SOCIAL_SVG } from '../components/ui/BrandIcons.jsx';

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;700;900&family=JetBrains+Mono:wght@300;400;500;600&display=swap');`;

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s = '') {
  return escapeHtml(s);
}

function accentBlock(accentHex, textScale = 1) {
  const vars = deriveAccentVars(accentHex);
  const scale = Number(textScale) || 1;
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  lines.push(`  --pv-scale: ${scale};`);
  return lines.join('\n');
}

const BASE_CSS = `
:root {
  /* Type scale — driven by --pv-scale (set on :root via the appearance var block). */
  --t-micro:    calc(var(--pv-scale) * 10px);
  --t-tiny:     calc(var(--pv-scale) * 11px);
  --t-small:    calc(var(--pv-scale) * 12px);
  --t-base:     calc(var(--pv-scale) * 14px);
  --t-md:       calc(var(--pv-scale) * 15px);
  --t-lg:       calc(var(--pv-scale) * 18px);
  --t-xl:       calc(var(--pv-scale) * 22px);
  --t-2xl:      calc(var(--pv-scale) * 28px);
  --t-3xl:      calc(var(--pv-scale) * 44px);
  --t-hero:     calc(var(--pv-scale) * clamp(56px, 9vw, 128px));
  --t-display:  calc(var(--pv-scale) * clamp(40px, 6vw, 80px));
  --t-title-sm: calc(var(--pv-scale) * clamp(20px, 2.4vw, 32px));
  --t-title-md: calc(var(--pv-scale) * clamp(24px, 3vw, 40px));
  --t-title-lg: calc(var(--pv-scale) * clamp(36px, 5vw, 56px));
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { min-height: 100%; scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--ink);
  font-size: var(--t-md);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  position: relative;
  overflow-x: hidden;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
.nav-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid var(--accent);
  flex-shrink: 0;
}
.hero-avatar-wrap { margin-bottom: 24px; }
.hero-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent);
  display: block;
}

.wrap { max-width: 1280px; margin: 0 auto; padding: 0 64px; position: relative; }

/* STICKY NAVBAR */
.nav-bar {
  position: sticky; top: 0; z-index: 50;
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  backdrop-filter: blur(16px) saturate(140%);
  border-bottom: 1px solid transparent;
  transition: border-color 240ms var(--ease-out), background 240ms var(--ease-out);
}
.nav-bar.is-scrolled {
  border-bottom-color: var(--line);
  background: color-mix(in srgb, var(--bg) 90%, transparent);
}
.nav-inner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 28px; padding-top: 14px; padding-bottom: 14px;
}
.nav-brand { display: inline-flex; align-items: center; gap: 12px; color: var(--ink); flex-shrink: 0; }
.nav-mark {
  width: 32px; height: 32px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--accent); color: #0b0b0d;
  font-family: var(--font-mono); font-weight: 600;
  font-size: var(--t-tiny); letter-spacing: 0.04em;
  flex-shrink: 0;
  transition: transform 240ms var(--ease-out), box-shadow 240ms;
}
.nav-brand:hover .nav-mark {
  transform: rotate(-4deg) scale(1.05);
  box-shadow: 0 8px 24px var(--accent-bg-hi);
}
.nav-name {
  font-family: var(--font-display); font-weight: 600;
  font-size: var(--t-md); letter-spacing: -0.01em;
}
.nav-suffix {
  font-family: var(--font-mono); font-size: var(--t-micro);
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-muted); margin-left: 4px;
}
.nav-links { display: flex; align-items: center; gap: 32px; list-style: none; margin: 0; padding: 0; }
.nav-links a {
  position: relative; display: inline-block; padding: 6px 0;
  font-family: var(--font-mono); font-size: var(--t-tiny);
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-muted); transition: color 220ms var(--ease-out);
}
.nav-links a::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0;
  height: 1px; background: var(--accent);
  transform: scaleX(0); transform-origin: left;
  transition: transform 280ms var(--ease-out);
}
.nav-links a:hover { color: var(--ink); }
.nav-links a:hover::after { transform: scaleX(1); }
.nav-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 16px;
  font-family: var(--font-mono); font-size: var(--t-tiny);
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--accent); background: var(--accent-bg);
  border: 1px solid var(--accent); flex-shrink: 0;
  transition: all 220ms var(--ease-out);
}
.nav-cta svg { transition: transform 220ms var(--ease-out); }
.nav-cta:hover { background: var(--accent); color: #0b0b0d; }
.nav-cta:hover svg { transform: translateX(3px); }
body.theme-arctic .nav-mark { color: #ffffff; }
body.theme-terminal .nav-mark { color: #0d1117; box-shadow: 0 0 12px var(--accent-ring); }
body.theme-internsphere .nav-mark { border-radius: 999px; }
body.theme-internsphere .nav-cta { border-radius: 999px; }
body.theme-aurora .nav-mark {
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accent), #22d3ee);
}
@media (max-width: 720px) {
  .nav-suffix, .nav-links { display: none; }
}

/* HERO */
.hero {
  min-height: calc(100vh - 64px);
  display: flex; align-items: center;
  padding: 64px 0 96px;
  position: relative;
}
.hero-main { width: 100%; display: flex; flex-direction: column; justify-content: center; }
.hero-eyebrow {
  font-family: var(--font-mono); font-size: var(--t-tiny);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 24px;
  display: inline-flex; align-items: center; gap: 10px;
}
.hero-eyebrow::before {
  content: ''; display: inline-block; width: 28px; height: 1px; background: var(--accent);
}
.hero-name {
  font-family: var(--font-display);
  font-size: var(--t-hero);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
  margin-bottom: 16px;
}
.hero-title {
  font-family: var(--font-display);
  font-size: var(--t-title-sm);
  font-weight: 400;
  color: var(--ink-soft);
  margin-bottom: 32px;
  min-height: 1.4em;
}
.hero-title .cursor {
  display: inline-block; width: 3px; height: 0.95em; background: var(--accent);
  vertical-align: -0.12em; margin-left: 4px; animation: blink 1.05s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.hero-bio { max-width: 60ch; color: var(--ink-soft); font-size: var(--t-lg); margin-bottom: 32px; }

.hero-meta { display: flex; gap: 28px; flex-wrap: wrap;
  font-family: var(--font-mono); font-size: var(--t-tiny);
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-muted); }
.hero-meta .meta-row { display: inline-flex; align-items: center; gap: 8px; }
.hero-meta .meta-row strong { color: var(--ink); font-weight: 500; }

.socials { display: inline-flex; flex-wrap: wrap; gap: 4px; }
.social-link {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px; border: 1px solid var(--line);
  color: var(--ink-soft);
  font-family: var(--font-mono); font-size: var(--t-tiny);
  letter-spacing: 0.16em; text-transform: uppercase;
  transition: all 200ms var(--ease-out);
}
.social-link svg { display: block; transition: transform 240ms var(--ease-out); }
.social-link:hover {
  color: var(--accent); border-color: var(--accent);
  background: var(--accent-bg);
}
.social-link:hover svg { transform: translateY(-1px); }
body.theme-internsphere .social-link {
  border-radius: 999px;
  background: #26262a;
  border-color: rgba(255,255,255,0.06);
}

/* SECTIONS */
section { padding: 112px 0; position: relative; }
.section-label {
  display: inline-flex; align-items: center; gap: 12px;
  font-family: var(--font-mono); font-size: var(--t-tiny);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 28px;
}
.section-label::before {
  content: ''; width: 24px; height: 1px; background: var(--accent);
}
.section-title {
  font-family: var(--font-display);
  font-size: var(--t-display);
  font-weight: 700; letter-spacing: -0.03em; line-height: 0.95;
  margin-bottom: 56px;
}

/* SKILLS */
.skills-grid { display: flex; flex-wrap: wrap; gap: 12px; max-width: 920px; }
.skill-chip {
  padding: 10px 16px; border: 1px solid var(--line);
  font-family: var(--font-mono); font-size: var(--t-small); letter-spacing: 0.04em;
  background: var(--chip-bg); color: var(--ink);
  opacity: 0; transform: translateY(8px);
  transition: all 240ms var(--ease-out);
}
.skill-chip.visible { opacity: 1; transform: translateY(0); }
.skill-chip:hover { border-color: var(--accent); color: var(--accent); }

/* PROJECTS */
.projects-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
.project-card {
  border: 1px solid var(--line); padding: 36px;
  background: var(--card-bg); position: relative;
  transition: all 320ms var(--ease-out);
  opacity: 0; transform: translateY(20px);
}
.project-card.visible { opacity: 1; transform: translateY(0); }
.project-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 18px 36px var(--accent-bg);
}
.project-card.featured { grid-column: 1 / -1; padding: 64px; }
.project-meta {
  display: flex; justify-content: space-between; align-items: center;
  font-family: var(--font-mono); font-size: var(--t-tiny);
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-muted);
  margin-bottom: 18px;
}
.project-featured-badge { color: var(--accent); }
.project-title {
  font-family: var(--font-display);
  font-size: var(--t-title-md); font-weight: 600;
  letter-spacing: -0.02em; margin-bottom: 16px; line-height: 1.05;
}
.project-card.featured .project-title { font-size: var(--t-title-lg); }
.project-desc { color: var(--ink-soft); margin-bottom: 24px; max-width: 56ch; }
.project-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; }
.project-tag {
  padding: 4px 10px; border: 1px solid var(--line);
  font-family: var(--font-mono); font-size: var(--t-tiny);
  color: var(--ink-soft);
}
.project-links { display: flex; gap: 18px;
  font-family: var(--font-mono); font-size: var(--t-tiny);
  letter-spacing: 0.16em; text-transform: uppercase; }
.project-links a { color: var(--ink-soft); display: inline-flex; align-items: center; gap: 6px;
  border-bottom: 1px solid transparent; padding-bottom: 2px; transition: all 200ms; }
.project-links a:hover { color: var(--accent); border-bottom-color: var(--accent); }

/* TIMELINE */
.timeline { position: relative; padding-left: 36px; max-width: 880px; }
.timeline::before {
  content: ''; position: absolute; top: 0; bottom: 0; left: 8px;
  width: 1px; background: var(--line);
}
.timeline-entry { position: relative; padding-bottom: 56px; opacity: 0; transform: translateX(-12px); transition: all 360ms var(--ease-out); }
.timeline-entry.visible { opacity: 1; transform: translateX(0); }
.timeline-entry:last-child { padding-bottom: 0; }
.timeline-entry::before {
  content: ''; position: absolute; left: -36px; top: 6px;
  width: 17px; height: 17px; border: 2px solid var(--accent);
  background: var(--bg);
}
.timeline-duration {
  font-family: var(--font-mono); font-size: var(--t-tiny);
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 6px;
}
.timeline-role {
  font-family: var(--font-display); font-size: var(--t-2xl);
  font-weight: 600; letter-spacing: -0.02em; margin-bottom: 4px;
}
.timeline-company { color: var(--ink-soft); margin-bottom: 16px; font-size: var(--t-md); }
.timeline-bullets { list-style: none; padding: 0; }
.timeline-bullets li {
  position: relative; padding-left: 18px; color: var(--ink-soft);
  margin-bottom: 8px; font-size: var(--t-md);
}
.timeline-bullets li::before {
  content: '→'; position: absolute; left: 0; color: var(--accent); font-family: var(--font-mono);
}

/* FOOTER */
footer {
  margin-top: 64px;
  padding: 36px 0 44px;
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  color: var(--ink-muted);
  position: relative;
  z-index: 2;
}
footer .footer-row {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px 32px;
}
footer .footer-row--main {
  min-height: 30px;
  font-size: var(--t-tiny);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
footer .footer-row--meta {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  font-size: var(--t-micro);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
  opacity: 0.85;
}
footer .footer-cell { display: inline-flex; align-items: center; min-height: 28px; }
footer a:hover { color: var(--accent); }
.social-link--sm { padding: 4px 10px; font-size: var(--t-micro); letter-spacing: 0.14em; gap: 6px; }
.social-link--sm svg { width: 11px; height: 11px; }
footer .socials { gap: 6px; }
@media (max-width: 640px) { footer .footer-row { justify-content: flex-start; } }

@media (max-width: 1100px) {
  .wrap { padding: 0 48px; }
}
@media (max-width: 900px) {
  .wrap { padding: 0 32px; }
  .projects-grid { grid-template-columns: 1fr; }
  .project-card { padding: 28px; }
  .project-card.featured { padding: 36px; }
  section { padding: 72px 0; }
  .hero { padding: 32px 0 64px; }
}
`;

const THEMES = {
  obsidian: `
    :root {
      --bg: #0a0a0a; --ink: #f5f5f5; --ink-soft: #b8b8b8; --ink-muted: #6e6e6e;
      --line: rgba(255,255,255,0.1); --card-bg: rgba(255,255,255,0.02); --chip-bg: rgba(255,255,255,0.03);
      --font-display: 'Inter', sans-serif; --font-body: 'Inter', sans-serif; --font-mono: 'JetBrains Mono', monospace;
    }
    body::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.5;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
    .wrap { position: relative; z-index: 1; }
    .hero::before {
      content: ''; position: absolute; top: 20%; right: -10%; width: 460px; height: 460px;
      background: radial-gradient(circle, var(--accent-bg-hi), transparent 70%);
      filter: blur(60px); pointer-events: none; z-index: 0;
    }
  `,
  arctic: `
    :root {
      --bg: #ffffff; --ink: #0a0a0a; --ink-soft: #4a4a4a; --ink-muted: #8a8a8a;
      --line: rgba(0,0,0,0.1); --card-bg: rgba(0,0,0,0.015); --chip-bg: rgba(0,0,0,0.02);
      --font-display: 'DM Sans', sans-serif; --font-body: 'DM Sans', sans-serif; --font-mono: 'JetBrains Mono', monospace;
    }
    .hero::before {
      content: ''; position: absolute; top: -10%; right: -10%; width: 600px; height: 600px;
      background: radial-gradient(circle, var(--accent-bg), transparent 60%);
      pointer-events: none; z-index: 0;
    }
    .project-card { background: #fafafa; }
    .project-card.featured {
      background: linear-gradient(135deg, var(--accent-bg) 0%, transparent 60%);
    }
  `,
  terminal: `
    :root {
      --bg: #0d1117; --ink: #00ff41; --ink-soft: #00cc34; --ink-muted: #008820;
      --line: rgba(0, 255, 65, 0.18); --card-bg: rgba(0, 255, 65, 0.025); --chip-bg: rgba(0, 255, 65, 0.04);
      --font-display: 'JetBrains Mono', monospace; --font-body: 'JetBrains Mono', monospace; --font-mono: 'JetBrains Mono', monospace;
    }
    body { text-shadow: 0 0 6px rgba(0, 255, 65, 0.25); }
    body::after {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 100;
      background: repeating-linear-gradient(0deg, rgba(0, 255, 65, 0.04) 0 1px, transparent 1px 3px);
    }
    body::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 99;
      background: radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.4) 100%);
    }
    .hero-name { letter-spacing: -0.02em; }
    .hero-title .cursor { background: #00ff41; box-shadow: 0 0 8px #00ff41; }
    .skill-chip:hover { box-shadow: 0 0 12px var(--accent-ring); }
    .timeline-entry::before { box-shadow: 0 0 8px var(--accent-ring); }
  `,
  internsphere: `
    :root {
      --bg: #111113; --ink: rgba(255,255,255,0.95); --ink-soft: rgba(255,255,255,0.78); --ink-muted: rgba(255,255,255,0.62);
      --line: rgba(255,255,255,0.08); --card-bg: #1c1c1f; --chip-bg: #26262a;
      --font-display: 'Inter', sans-serif; --font-body: 'Inter', sans-serif; --font-mono: 'JetBrains Mono', monospace;
      --is-grad: linear-gradient(135deg, #7c6bff 0%, #a855f7 45%, #ec4899 100%);
      --is-glow: 0 0 24px rgba(124, 107, 255, 0.32), 0 0 60px rgba(168, 85, 247, 0.20);
    }
    body::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(720px 460px at 12% 8%, rgba(124, 107, 255, 0.16), transparent 60%),
        radial-gradient(620px 420px at 88% 80%, rgba(236, 72, 153, 0.14), transparent 60%);
    }
    .wrap { position: relative; z-index: 1; }
    .hero-name {
      background: var(--is-grad);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero-title .cursor { background: var(--is-grad); }
    .project-card { border-radius: 22px; }
    .project-tag { border-radius: 999px; padding: 4px 12px; }
    .skill-chip { border-radius: 999px; background: #26262a; border-color: rgba(255,255,255,0.06); }
    .project-card:hover {
      border-color: transparent;
      box-shadow: var(--is-glow), 0 18px 48px rgba(0,0,0,0.5);
    }
    .project-card.featured {
      background:
        linear-gradient(#1c1c1f, #1c1c1f) padding-box,
        var(--is-grad) border-box;
      border: 1px solid transparent;
    }
    .section-label::before, .hero-eyebrow::before { background: var(--is-grad); }
    .timeline-entry::before {
      background-image: var(--is-grad);
      border: 0; border-radius: 999px;
    }
  `,
  aurora: `
    :root {
      --bg: #050818; --ink: #f0f4ff; --ink-soft: #b8c0d8; --ink-muted: #6878a0;
      --line: rgba(255,255,255,0.08); --card-bg: rgba(255,255,255,0.04); --chip-bg: rgba(255,255,255,0.05);
      --font-display: 'Inter', sans-serif; --font-body: 'Inter', sans-serif; --font-mono: 'JetBrains Mono', monospace;
    }
    body::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(800px 500px at 10% 10%, rgba(168, 85, 247, 0.25), transparent 60%),
        radial-gradient(800px 500px at 90% 80%, rgba(34, 211, 238, 0.22), transparent 60%),
        radial-gradient(600px 400px at 50% 50%, rgba(99, 102, 241, 0.18), transparent 60%);
    }
    .wrap { position: relative; z-index: 1; }
    .project-card, .skill-chip {
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .project-card.featured {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(34, 211, 238, 0.08) 100%);
    }
    .hero-name {
      background: linear-gradient(135deg, #ffffff 0%, var(--accent) 50%, #22d3ee 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .particles {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
    }
    .particles span {
      position: absolute; width: 3px; height: 3px; border-radius: 50%;
      background: var(--accent); opacity: 0.5;
      animation: drift 22s linear infinite;
    }
    @keyframes drift {
      from { transform: translateY(110vh); }
      to   { transform: translateY(-10vh); }
    }
  `
};

function buildParticlesMarkup(theme) {
  if (theme !== 'aurora') return '';
  let html = '<div class="particles" aria-hidden="true">';
  for (let i = 0; i < 24; i++) {
    const left = (Math.random() * 100).toFixed(2);
    const delay = -(Math.random() * 22).toFixed(2);
    const dur = (16 + Math.random() * 14).toFixed(2);
    const size = (1 + Math.random() * 3).toFixed(1);
    html += `<span style="left:${left}%;animation-delay:${delay}s;animation-duration:${dur}s;width:${size}px;height:${size}px"></span>`;
  }
  html += '</div>';
  return html;
}

export function buildExportedHTML(data) {
  const { personal, skills, projects, experience, appearance } = data;
  const accentVars = accentBlock(appearance.accent, appearance.textScale);

  const sortedProjects = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));

  const skillChips = skills.map((s, i) =>
    `<div class="skill-chip" data-reveal data-delay="${i * 50}">${escapeHtml(s.label)}</div>`
  ).join('');

  const projectCards = sortedProjects.map((p, i) => {
    const tags = (p.tags || []).map((t) => `<span class="project-tag">${escapeHtml(t)}</span>`).join('');
    const links = [];
    if (p.liveUrl)   links.push(`<a href="${escapeAttr(p.liveUrl)}" target="_blank" rel="noopener">Live ↗</a>`);
    if (p.githubUrl) links.push(`<a href="${escapeAttr(p.githubUrl)}" target="_blank" rel="noopener">Source ↗</a>`);
    return `
      <article class="project-card ${p.featured ? 'featured' : ''}" data-reveal data-delay="${i * 80}">
        <div class="project-meta">
          <span>Project / ${String(i + 1).padStart(2, '0')}</span>
          ${p.featured ? '<span class="project-featured-badge">Featured</span>' : ''}
        </div>
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.desc)}</p>
        ${tags ? `<div class="project-tags">${tags}</div>` : ''}
        ${links.length ? `<div class="project-links">${links.join('')}</div>` : ''}
      </article>`;
  }).join('');

  const timelineEntries = experience.map((e, i) => {
    const bullets = (e.bullets || []).filter(Boolean).map((b) => `<li>${escapeHtml(b)}</li>`).join('');
    return `
      <div class="timeline-entry" data-reveal data-delay="${i * 100}">
        <div class="timeline-duration">${escapeHtml(e.duration)}</div>
        <h3 class="timeline-role">${escapeHtml(e.role)}</h3>
        <div class="timeline-company">${escapeHtml(e.company)}</div>
        ${bullets ? `<ul class="timeline-bullets">${bullets}</ul>` : ''}
      </div>`;
  }).join('');

  const buildSocial = (cls) => {
    const arr = [];
    if (personal.github)   arr.push(`<a class="${cls}" href="${escapeAttr(personal.github)}" target="_blank" rel="noopener">${SOCIAL_SVG.github}<span>GitHub</span></a>`);
    if (personal.linkedin) arr.push(`<a class="${cls}" href="${escapeAttr(personal.linkedin)}" target="_blank" rel="noopener">${SOCIAL_SVG.linkedin}<span>LinkedIn</span></a>`);
    if (personal.email)    arr.push(`<a class="${cls}" href="mailto:${escapeAttr(personal.email)}">${SOCIAL_SVG.email}<span>Email</span></a>`);
    return arr;
  };
  const social = buildSocial('social-link');
  const socialSm = buildSocial('social-link social-link--sm');

  const navItems = [];
  if (skills.length)     navItems.push({ label: 'Skills',     href: '#skills' });
  if (projects.length)   navItems.push({ label: 'Work',       href: '#work' });
  if (experience.length) navItems.push({ label: 'Experience', href: '#experience' });

  const initials = (personal.name || 'You')
    .split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const firstName = (personal.name || '').split(/\s+/)[0] || 'Portfolio';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(personal.name || 'Portfolio')} — ${escapeHtml(personal.title || '')}</title>
<link rel="stylesheet" href="https://unpkg.com/lenis@1.1.20/dist/lenis.css" />
<script src="https://unpkg.com/lenis@1.1.20/dist/lenis.min.js"></script>
<style>
${FONT_IMPORT}
:root {
${accentVars}
}
${THEMES[appearance.theme] || THEMES.obsidian}
${BASE_CSS}
</style>
</head>
<body class="theme-${appearance.theme}">
${buildParticlesMarkup(appearance.theme)}

<nav class="nav-bar" aria-label="Site">
  <div class="wrap nav-inner">
    <a class="nav-brand" href="#top">
      ${personal.avatar
        ? `<img class="nav-avatar" src="${escapeAttr(personal.avatar)}" alt="${escapeAttr(personal.name || '')}" />`
        : `<span class="nav-mark" aria-hidden="true">${escapeHtml(initials)}</span>`}
      <span class="nav-name">${escapeHtml(firstName)}</span>
      <span class="nav-suffix" aria-hidden="true">/ portfolio</span>
    </a>
    ${navItems.length ? `<ul class="nav-links">${navItems.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>` : ''}
    ${personal.email
      ? `<a class="nav-cta" href="mailto:${escapeAttr(personal.email)}"><span>Get in touch</span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>`
      : ''}
  </div>
</nav>

<header class="hero" id="top">
  <div class="wrap">
    <div class="hero-main">
      ${personal.avatar ? `<div class="hero-avatar-wrap"><img class="hero-avatar" src="${escapeAttr(personal.avatar)}" alt="${escapeAttr(personal.name || 'Profile photo')}" /></div>` : ''}
      <div class="hero-eyebrow">${personal.location ? escapeHtml(personal.location) : 'Portfolio'} / Available for work</div>
      <h1 class="hero-name">${escapeHtml(personal.name || 'Your Name')}</h1>
      <div class="hero-title" data-typewriter="${escapeAttr(personal.title || '')}"></div>
      <p class="hero-bio">${escapeHtml(personal.bio || '')}</p>
      <div class="hero-meta">
        ${personal.location ? `<span class="meta-row">Based in <strong>${escapeHtml(personal.location)}</strong></span>` : ''}
        ${social.length ? `<span class="socials">${social.join('')}</span>` : ''}
      </div>
    </div>
  </div>
</header>

${skills.length ? `
<section id="skills">
  <div class="wrap">
    <div class="section-label">01 / Toolkit</div>
    <h2 class="section-title">What I work with.</h2>
    <div class="skills-grid">${skillChips}</div>
  </div>
</section>` : ''}

${projects.length ? `
<section id="work">
  <div class="wrap">
    <div class="section-label">02 / Selected Work</div>
    <h2 class="section-title">Things I&rsquo;ve built.</h2>
    <div class="projects-grid">${projectCards}</div>
  </div>
</section>` : ''}

${experience.length ? `
<section id="experience">
  <div class="wrap">
    <div class="section-label">03 / Track Record</div>
    <h2 class="section-title">Where I&rsquo;ve been.</h2>
    <div class="timeline">${timelineEntries}</div>
  </div>
</section>` : ''}

<footer>
  <div class="wrap">
    <div class="footer-row footer-row--main">
      <span class="footer-cell">© ${new Date().getFullYear()} ${escapeHtml(personal.name || '—')}</span>
      ${socialSm.length ? `<span class="footer-cell socials">${socialSm.join('')}</span>` : ''}
    </div>

  </div>
</footer>

<script>
(function () {
  // Lenis smooth scroll (CDN loaded in <head>)
  if (typeof Lenis !== 'undefined') {
    var lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // anchor links should still play nicely
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        var navEl = document.querySelector('.nav-bar');
        var off = navEl ? -(navEl.offsetHeight + 8) : -16;
        lenis.scrollTo(t, { offset: off });
      });
    });
  }

  // Typewriter — cursor hides once typing finishes
  document.querySelectorAll('[data-typewriter]').forEach(function (el) {
    var text = el.getAttribute('data-typewriter') || '';
    el.innerHTML = '<span class="typed"></span><span class="cursor"></span>';
    var typed = el.querySelector('.typed');
    var cursor = el.querySelector('.cursor');
    var i = 0;
    function tick() {
      if (i <= text.length) {
        typed.textContent = text.slice(0, i++);
        if (i <= text.length) {
          setTimeout(tick, 55 + Math.random() * 40);
        } else if (cursor) {
          cursor.style.transition = 'opacity 320ms ease';
          cursor.style.opacity = '0';
          setTimeout(function () { cursor.remove(); }, 360);
        }
      }
    }
    setTimeout(tick, 600);
  });

  // Sticky nav: add .is-scrolled when the page has scrolled
  var navBar = document.querySelector('.nav-bar');
  if (navBar) {
    var setScrolled = function () {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      navBar.classList.toggle('is-scrolled', y > 8);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
          setTimeout(function () { entry.target.classList.add('visible'); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('visible'); });
  }
})();
</script>
</body>
</html>`;
}

export function downloadHTML(data, filename = 'portfolio.html') {
  const html = buildExportedHTML(data);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
}
