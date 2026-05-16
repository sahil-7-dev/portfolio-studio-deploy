import React, { useEffect, useRef } from 'react';
import PreviewWrapper from './PreviewWrapper.jsx';

const DESIGN_WIDTH = 1280;
const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

function useScaleToFit(scrollerRef, contentRef) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;

    const apply = () => {
      const w = scroller.offsetWidth;
      if (!w) return;

      if (w >= DESIGN_WIDTH) {
        content.style.cssText = '';
        return;
      }

      const scale = w / DESIGN_WIDTH;

      // Reset, force reflow, then measure natural height
      content.style.transform = 'none';
      content.style.marginBottom = '0px';
      content.style.width = `${DESIGN_WIDTH}px`;
      content.style.transformOrigin = 'top left';

      void content.offsetHeight; // force reflow

      const naturalHeight = content.scrollHeight;
      const visualHeight = naturalHeight * scale;
      const excess = naturalHeight - visualHeight;

      content.style.transform = `scale(${scale})`;
      content.style.marginBottom = `-${excess}px`;
    };

    const ro = new ResizeObserver(apply);
    ro.observe(scroller);
    const mo = new MutationObserver(apply);
    mo.observe(content, { childList: true, subtree: true });
    apply();

    return () => { ro.disconnect(); mo.disconnect(); };
  }, [scrollerRef, contentRef]);
}

// Only use Lenis on non-touch devices — on real phones native scroll
// handles dynamic viewport changes (toolbar show/hide) correctly
function useLenisOn(ref) {
  useEffect(() => {
    if (isTouchDevice()) return; // native scroll on mobile

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
      const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
      rafId = requestAnimationFrame(raf);
      return true;
    };

    if (!init()) pollId = setInterval(() => { if (init()) clearInterval(pollId); }, 50);

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
  const scrollerRef = useRef(null);
  const contentRef  = useRef(null);

  useLenisOn(scrollerRef);
  useScaleToFit(scrollerRef, contentRef);

  const themeBg =
    data.appearance.theme === 'arctic'       ? '#ffffff' :
    data.appearance.theme === 'terminal'     ? '#0d1117' :
    data.appearance.theme === 'aurora'       ? '#050818' :
    data.appearance.theme === 'internsphere' ? '#111113' :
    '#0a0a0a';

  return (
    <>
      <div className="preview-toolbar">
        <div className="dots" aria-hidden="true"><span /><span /><span /></div>
        <div className="url-bar">
          {data.personal.name
            ? `${data.personal.name.toLowerCase().replace(/\s+/g, '')}.dev`
            : 'portfolio.dev'}
          <span style={{ marginLeft: 6, opacity: 0.5 }}>· live preview · {data.appearance.theme} · lenis on</span>
        </div>
        <span>{data.skills.length} sk · {data.projects.length} pj · {data.experience.length} xp</span>
      </div>

      <div ref={scrollerRef} className="preview-frame-shell" style={{ background: themeBg }}>
        <div ref={contentRef} className="preview-stage">
          <PreviewWrapper data={data} accentStyle={accentStyle} fontVars={fontVars} />
        </div>
      </div>
    </>
  );
}
