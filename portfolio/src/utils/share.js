// URL-safe base64 + simple compression of state to share via link.
// We use built-in CompressionStream when available; fallback to plain base64.

function toBase64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function compress(bytes) {
  if (typeof CompressionStream === 'undefined') return bytes;
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

async function decompress(bytes) {
  if (typeof DecompressionStream === 'undefined') return bytes;
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

export async function encodePortfolio(data) {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  const compressed = await compress(bytes);
  return toBase64Url(compressed);
}

export async function decodePortfolio(token) {
  try {
    const bytes = fromBase64Url(token);
    const decompressed = await decompress(bytes);
    const json = new TextDecoder().decode(decompressed);
    return JSON.parse(json);
  } catch {
    // Try without compression as fallback
    try {
      const bytes = fromBase64Url(token);
      const json = new TextDecoder().decode(bytes);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}

export async function buildShareUrl(data) {
  const token = await encodePortfolio(data);
  const url = new URL(window.location.href);
  url.searchParams.set('p', token);
  url.hash = '';
  return url.toString();
}

export function readShareTokenFromLocation() {
  const url = new URL(window.location.href);
  return url.searchParams.get('p');
}

export function clearShareTokenFromLocation() {
  const url = new URL(window.location.href);
  url.searchParams.delete('p');
  window.history.replaceState(null, '', url.toString());
}
