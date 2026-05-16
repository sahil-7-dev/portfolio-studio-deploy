import React, { useEffect, useRef, useState } from 'react';

function TimelineEntry({ entry, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="pv-timeline-entry"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-12px)',
        transition: `opacity 460ms var(--pv-ease) ${index * 100}ms, transform 460ms var(--pv-ease) ${index * 100}ms`
      }}
    >
      <div className="pv-timeline-duration">{entry.duration}</div>
      <h3 className="pv-timeline-role">{entry.role}</h3>
      <div className="pv-timeline-company">{entry.company}</div>
      {entry.bullets && entry.bullets.filter(Boolean).length > 0 && (
        <ul className="pv-timeline-bullets">
          {entry.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </div>
  );
}

export default function ExperienceTimeline({ experience }) {
  if (!experience.length) return null;
  return (
    <section id="experience" className="pv-section">
      <div className="pv-wrap">
        <div className="pv-section-label">03 / Track Record</div>
        <h2 className="pv-section-title">Where I’ve been.</h2>
        <div className="pv-timeline">
          {experience.map((e, i) => <TimelineEntry key={e.id} entry={e} index={i} />)}
        </div>
      </div>
    </section>
  );
}
