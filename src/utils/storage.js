// Debounced localStorage save + load.

const STORAGE_KEY = 'portfolio-studio:v1';

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function makeDebouncedSaver(delay = 500) {
  let timer = null;
  let onSavedCallback = null;

  const save = (data) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        if (onSavedCallback) onSavedCallback();
      } catch {
        // quota or serialization issue — silent fail, app still works
      }
    }, delay);
  };

  return {
    save,
    onSaved(cb) { onSavedCallback = cb; }
  };
}

export function clearStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
