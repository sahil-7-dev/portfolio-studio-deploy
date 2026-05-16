import React, { useEffect, useRef } from 'react';
import PreviewWrapper from './PreviewWrapper.jsx';

const DESIGN_WIDTH = 1280;

function useScaleToFit(shellRef, contentRef) {
  useEffect(() => {
    const shell = shellRef.current;
    const content = contentRef.current;
    if (!shell || !content) return;

    const apply = () => {
      const containerWidth = shell.offsetWidth;
      if (containerWidth <= 0) return;

      if (containerWidth >= DESIGN_WIDTH) {
        // No scaling needed — reset everything
        content.style.transform = '';
        content.style.width = '';
        content.style.minHeight = '';
        shell.style.paddingBottom = '';
        return;
      }

      const scale = containerWidth / DESIGN_WIDTH;
      content.style.width = `${DESIGN_WIDTH}px`;
      content.style.transformOrigin = 'top left';
      content.style.transform = `scale(${scale})`;

      // After browser applies scale, measure actual rendered height
      // and push the shell out to match so the absolute stage can scroll it
      requestAnimationFrame(() => {
        const scaledHeight = content.offsetHeight * scale;
        // Set a min-height on content so stage (position:absolute inset:0)
        // has something to scroll against
        content.style.minHeight = `${scaledHeight / scale}px`;
        // Also set explicit height on shell so parent knows how tall to be
        shell.style.height = `${scaledHeight}px`;
      });
    };

    const ro = new ResizeObserver(apply);
    ro.observe(shell);
    ro.observe(content);

    const mo = new MutationObserver(apply);
    mo.observe(content, { childList: true, subtree: true });

    apply();

    return () => { ro.disconnect(); mo.disconnect(); };
  }, [shellRef, contentRef]);
}

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
  const shellRef = useRef(null);
  const contentRef = useRef(null);

  useLenisOn(stageRef);
  useScaleToFit(shellRef, contentRef);

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

      {/* shell is measured for width; stage scrolls; content is scaled */}
      <div ref={shellRef} className="preview-frame-shell">
        <div ref={stageRef} className="preview-stage" style={{ background: themeBg }}>
          <div ref={contentRef}>
            <PreviewWrapper data={data} accentStyle={accentStyle} fontVars={fontVars} />
          </div>
        </div>
      </div>
    </>
  );
}
