import React, { useEffect, useRef, useCallback } from 'react';
import PreviewWrapper from './PreviewWrapper.jsx';

// Desktop width the preview is designed for
const DESIGN_WIDTH = 1280;

// Scale the preview content to always fit the container width
function useScaleToFit(stageRef, contentRef) {
  const applyScale = useCallback(() => {
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!stage || !content) return;

    const containerWidth = stage.offsetWidth;
    if (containerWidth >= DESIGN_WIDTH) {
      // Enough room — no scaling needed
      content.style.transform = '';
      content.style.transformOrigin = '';
      content.style.width = '';
      content.style.height = '';
      stage.style.height = '';
      return;
    }

    const scale = containerWidth / DESIGN_WIDTH;
    content.style.transformOrigin = 'top left';
    content.style.transform = `scale(${scale})`;
    content.style.width = `${DESIGN_WIDTH}px`;
    // Make stage scrollable by setting its height to the scaled content height
    const scaledHeight = content.scrollHeight * scale;
    stage.style.height = `${scaledHeight}px`;
  }, [stageRef, contentRef]);

  useEffect(() => {
    applyScale();
    const ro = new ResizeObserver(applyScale);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener('resize', applyScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', applyScale);
    };
  }, [applyScale]);
}

// Attach Lenis (loaded via CDN in index.html) to the preview's scroll container.
function useLenisOn(ref) {
  useEffect(() => {
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
  const contentRef = useRef(null);

  useLenisOn(stageRef);
  useScaleToFit(stageRef, contentRef);

  const themeBg =
    data.appearance.theme === 'arctic' ? '#ffffff' :
    data.appearance.theme === 'terminal' ? '#0d1117' :
    data.appearance.theme === 'aurora' ? '#050818' :
    data.appearance.theme === 'internsphere' ? '#111113' :
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
          <span style={{ marginLeft: 6, opacity: 0.5 }}>· live preview · {data.appearance.theme} · lenis on</span>
        </div>
        <span>{data.skills.length} sk · {data.projects.length} pj · {data.experience.length} xp</span>
      </div>

      <div className="preview-frame-shell">
        <div ref={stageRef} className="preview-stage" style={{ background: themeBg, overflowX: 'hidden' }}>
          <div ref={contentRef}>
            <PreviewWrapper data={data} accentStyle={accentStyle} fontVars={fontVars} />
          </div>
        </div>
      </div>
    </>
  );
}
