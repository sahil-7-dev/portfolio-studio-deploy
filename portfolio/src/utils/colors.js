// HSL manipulation derived from a single hex accent input.
// Used to inject derived variables into the preview wrapper.

export function hexToRgb(hex) {
  const cleaned = hex.replace('#', '').trim();
  const v = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned.padEnd(6, '0').slice(0, 6);
  const num = parseInt(v, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hexToHsl(hex) {
  return rgbToHsl(hexToRgb(hex));
}

export function hsl(h, s, l, a = 1) {
  if (a === 1) return `hsl(${h}, ${s}%, ${l}%)`;
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

export function deriveAccentVars(hex) {
  const { h, s, l } = hexToHsl(hex);
  return {
    '--accent':         hsl(h, s, l),
    '--accent-soft':    hsl(h, s, Math.min(96, l + 25)),
    '--accent-deep':    hsl(h, s, Math.max(8, l - 18)),
    '--accent-bg':      hsl(h, s, l, 0.12),
    '--accent-bg-hi':   hsl(h, s, l, 0.22),
    '--accent-ring':    hsl(h, s, l, 0.45),
    '--accent-h': String(h),
    '--accent-s': `${s}%`,
    '--accent-l': `${l}%`
  };
}

export function isValidHex(hex) {
  return /^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/.test(hex.trim());
}
