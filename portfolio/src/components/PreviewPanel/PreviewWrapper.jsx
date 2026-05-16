import React, { useMemo } from 'react';
import { FONT_MAP } from '../../App.jsx';

import HeroSection from './HeroSection.jsx';
import PreviewNav from './PreviewNav.jsx';
import PreviewSkills from './PreviewSkills.jsx';
import ProjectsGrid from './ProjectsGrid.jsx';
import ExperienceTimeline from './ExperienceTimeline.jsx';
import { GithubMark, LinkedinMark, MailMark } from '../ui/BrandIcons.jsx';

function Particles({ count = 22 }) {
  const items = useMemo(() =>
    Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: -(Math.random() * 20),
      duration: 16 + Math.random() * 14,
      size: 1 + Math.random() * 3
    })),
    [count]
  );
  return (
    <div className="pv-particles" aria-hidden="true">
      {items.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            top: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}
    </div>
  );
}

export default function PreviewWrapper({ data, accentStyle, fontVars }) {
  const year = new Date().getFullYear();
  const fontOverride = FONT_MAP[data.appearance.font] || FONT_MAP.inter;

  const wrapperStyle = {
    ...accentStyle,
    '--pv-font-display': fontOverride.display,
    '--pv-font-body': fontOverride.body
  };

  const social = [];
  if (data.personal.github)   social.push({ label: 'GitHub',   href: data.personal.github,            icon: <GithubMark />   });
  if (data.personal.linkedin) social.push({ label: 'LinkedIn', href: data.personal.linkedin,          icon: <LinkedinMark /> });
  if (data.personal.email)    social.push({ label: 'Email',    href: `mailto:${data.personal.email}`, icon: <MailMark />     });

  return (
    <div
      className={`preview-root theme-${data.appearance.theme}`}
      style={wrapperStyle}
    >
      {data.appearance.theme === 'aurora' && <Particles />}

      <PreviewNav
        personal={data.personal}
        hasSkills={data.skills.length > 0}
        hasProjects={data.projects.length > 0}
        hasExperience={data.experience.length > 0}
      />

      <HeroSection personal={data.personal} />

      {data.skills.length > 0 && <PreviewSkills skills={data.skills} />}
      <ProjectsGrid projects={data.projects} />
      <ExperienceTimeline experience={data.experience} />

      <footer className="pv-footer">
        <div className="pv-wrap">
          <div className="pv-footer-row pv-footer-row--main">
            <span className="pv-footer-cell">© {year} {data.personal.name || '—'}</span>
            {social.length > 0 && (
              <span className="pv-footer-cell pv-socials">
                {social.map((s) => (
                  <a
                    key={s.label}
                    className="pv-social pv-social--sm"
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </a>
                ))}
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
