import React, { useState } from 'react';

import EditorAccordion from './EditorAccordion.jsx';
import PersonalSection from './PersonalSection.jsx';
import SkillsSection from './SkillsSection.jsx';
import ProjectsSection from './ProjectsSection.jsx';
import ExperienceSection from './ExperienceSection.jsx';
import AppearanceSection from './AppearanceSection.jsx';

import AIPanel from '../AIPanel/AIPanel.jsx';
import { DEFAULT_PORTFOLIO } from '../../data/defaults.js';

const deepClone = (v) => JSON.parse(JSON.stringify(v));

export default function EditorPanel({ data, setData }) {
  const [open, setOpen] = useState({
    personal: true,
    skills: true,
    projects: false,
    experience: false,
    appearance: false
  });

  const toggle = (k) => setOpen((s) => ({ ...s, [k]: !s[k] }));

  const update = (key) => (value) => setData({ ...data, [key]: value });
  const reset = (key) => () => setData({ ...data, [key]: deepClone(DEFAULT_PORTFOLIO[key]) });

  return (
    <div className="editor-panel">
      <EditorAccordion
        number="01"
        title="Personal"
        meta={data.personal.name ? data.personal.name : 'Unnamed'}
        open={open.personal}
        onToggle={() => toggle('personal')}
        onReset={reset('personal')}
        resetLabel="Personal"
      >
        <PersonalSection data={data.personal} onChange={update('personal')} />
      </EditorAccordion>

      <EditorAccordion
        number="02"
        title="Skills"
        meta={`${data.skills.length} entries`}
        open={open.skills}
        onToggle={() => toggle('skills')}
        onReset={reset('skills')}
        resetLabel="Skills"
      >
        <SkillsSection skills={data.skills} onChange={update('skills')} />
      </EditorAccordion>

      <EditorAccordion
        number="03"
        title="Projects"
        meta={`${data.projects.length} · ${data.projects.filter((p) => p.featured).length} featured`}
        open={open.projects}
        onToggle={() => toggle('projects')}
        onReset={reset('projects')}
        resetLabel="Projects"
      >
        <ProjectsSection
          projects={data.projects}
          onChange={update('projects')}
        />
      </EditorAccordion>

      <EditorAccordion
        number="04"
        title="Experience"
        meta={`${data.experience.length} roles`}
        open={open.experience}
        onToggle={() => toggle('experience')}
        onReset={reset('experience')}
        resetLabel="Experience"
      >
        <ExperienceSection experience={data.experience} onChange={update('experience')} />
      </EditorAccordion>

      <EditorAccordion
        number="05"
        title="Appearance"
        meta={`${data.appearance.theme} · ${data.appearance.accent}`}
        open={open.appearance}
        onToggle={() => toggle('appearance')}
        onReset={reset('appearance')}
        resetLabel="Appearance"
      >
        <AppearanceSection appearance={data.appearance} onChange={update('appearance')} />
      </EditorAccordion>

      <AIPanel data={data} setData={setData} />
    </div>
  );
}
