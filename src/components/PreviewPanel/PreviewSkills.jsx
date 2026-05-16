import React, { useEffect, useRef, useState } from 'react';

export default function PreviewSkills({ skills }) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.18 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" className="pv-section" ref={containerRef}>
      <div className="pv-wrap">
        <div className="pv-section-label">01 / Toolkit</div>
        <h2 className="pv-section-title">What I work with.</h2>
        <div className="pv-skills">
          {skills.map((s, i) => (
            <span
              key={s.id || i}
              className="pv-skill"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 360ms var(--pv-ease) ${i * 50}ms, transform 360ms var(--pv-ease) ${i * 50}ms, border-color 200ms, color 200ms`
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
