import React, { useEffect, useRef, useState } from 'react';

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <article
      ref={ref}
      className={`pv-project ${project.featured ? 'featured' : ''}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 480ms var(--pv-ease) ${index * 80}ms, transform 480ms var(--pv-ease) ${index * 80}ms, border-color 240ms, box-shadow 240ms`
      }}
    >
      <div className="pv-project-meta">
        <span>Project / {String(index + 1).padStart(2, '0')}</span>
        {project.featured && <span className="pv-project-featured-badge">Featured</span>}
      </div>
      <h3 className="pv-project-title">{project.title}</h3>
      <p className="pv-project-desc">{project.desc}</p>
      {(project.tags || []).length > 0 && (
        <div className="pv-tags">
          {project.tags.map((t) => <span key={t} className="pv-tag">{t}</span>)}
        </div>
      )}
      {(project.liveUrl || project.githubUrl) && (
        <div className="pv-project-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Live <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              Source <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default function ProjectsGrid({ projects }) {
  if (!projects.length) return null;
  const sorted = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
  return (
    <section id="work" className="pv-section">
      <div className="pv-wrap">
        <div className="pv-section-label">02 / Selected Work</div>
        <h2 className="pv-section-title">Things I’ve built.</h2>
        <div className="pv-projects">
          {sorted.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
