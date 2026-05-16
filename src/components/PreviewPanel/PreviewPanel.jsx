import React, { useEffect, useRef } from 'react';
import PreviewWrapper from './PreviewWrapper.jsx';

// Only initialise Lenis on non-touch devices.
// On mobile, native momentum scrolling is better and Lenis transforms
// cause compositing issues that make images flicker or vanish.
function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}

function useLenisOn(ref) {
  useEffect(() => {
    // Skip Lenis on touch/mobile — use native scroll instead
    if (isTouchDevice()) return;

    let cancelled = false;
    let lenis = null;
    let rafId = null;
    let pollId = null;

    const init = () => {
      if (cancelled) return;
      const wrapper = ref.current;
      if (!wrapper || !window.Lenis) return false;

      lenis = new window.Lenis({
        wrapper,
        content: wrapper.firstElementChild || wrapper,
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4
      });
      window.__previewLenis = lenis;

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      return true;
    };

    if (!init()) {
      pollId = setInterval(() => { if (init()) clearInterval(pollId); }, 50);
    }

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) { try { lenis.destroy(); } catch {} }
      if (window.__previewLenis === lenis) delete window.__previewLenis;
    };
  }, [ref]);
}

export default function PreviewPanel({ data, accentStyle, fontVars }) {
  const stageRef = useRef(null);
  useLenisOn(stageRef);

  const themeBg =
    data.appearance.theme === 'arctic' ? '#ffffff' :
    data.appearance.theme === 'terminal' ? '#0d1117' :
    data.appearance.theme === 'aurora' ? '#050818' :
    data.appearance.theme === 'internsphere' ? '#0f1013' :
    '#0a0a0a';

  return (
    <>
      <div className="preview-toolbar">
        <div className="dots" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="url-bar">
          {data.personal.name
            ? `${data.personal.name.toLowerCase().replace(/\s+/g, '')}.dev`
            : 'portfolio.dev'}
          <span style={{ marginLeft: 6, opacity: 0.5 }}>· live preview · {data.appearance.theme}</span>
        </div>
        <span>{data.skills.length} sk · {data.projects.length} pj · {data.experience.length} xp</span>
      </div>

      <div className="preview-frame-shell">
        <div ref={stageRef} className="preview-stage" style={{ background: themeBg }}>
          <PreviewWrapper data={data} accentStyle={accentStyle} fontVars={fontVars} />
        </div>
      </div>
    </>
  );
}
