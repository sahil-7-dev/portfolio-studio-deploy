import React, { useEffect, useRef, useState } from 'react';

export default function PreviewNav({ personal, hasSkills, hasProjects, hasExperience }) {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  // Watch the scroll container (.preview-stage) for "scrolled" state styling.
  useEffect(() => {
    const stage = navRef.current?.closest('.preview-stage');
    if (!stage) return;
    const onScroll = () => setScrolled(stage.scrollTop > 8);
    onScroll();
    stage.addEventListener('scroll', onScroll, { passive: true });
    return () => stage.removeEventListener('scroll', onScroll);
  }, []);

  const links = [];
  if (hasSkills)     links.push({ label: 'Skills',     href: '#skills' });
  if (hasProjects)   links.push({ label: 'Work',       href: '#work' });
  if (hasExperience) links.push({ label: 'Experience', href: '#experience' });

  const initials = (personal.name || 'You')
    .split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  const firstName = (personal.name || '').split(/\s+/)[0] || 'Portfolio';

  // Use Lenis for smooth scroll to anchor; fall back to native scrollIntoView.
  const onAnchor = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const navH = navRef.current?.offsetHeight || 64;
    if (window.__previewLenis && typeof window.__previewLenis.scrollTo === 'function') {
      window.__previewLenis.scrollTo(target, { offset: -navH - 8, duration: 1.1 });
    } else {
      const stage = navRef.current?.closest('.preview-stage');
      if (stage) {
        const rect = target.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();
        stage.scrollTo({ top: stage.scrollTop + (rect.top - stageRect.top) - navH - 8, behavior: 'smooth' });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <nav ref={navRef} className={`pv-nav-bar ${scrolled ? 'is-scrolled' : ''}`} aria-label="Site">
      <div className="pv-wrap pv-nav-inner">
        <a className="pv-nav-brand" href="#top" onClick={(e) => onAnchor(e, '#top')}>
          <span className="pv-nav-mark" aria-hidden="true">{initials}</span>
          <span className="pv-nav-name">{firstName}</span>
          <span className="pv-nav-suffix" aria-hidden="true">/ portfolio</span>
        </a>

        {links.length > 0 && (
          <ul className="pv-nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={(e) => onAnchor(e, l.href)}>{l.label}</a>
              </li>
            ))}
          </ul>
        )}

        {personal.email ? (
          <a className="pv-nav-cta" href={`mailto:${personal.email}`}>
            <span>Get in touch</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        ) : <span className="pv-nav-cta-spacer" aria-hidden="true" />}
      </div>
    </nav>
  );
}
