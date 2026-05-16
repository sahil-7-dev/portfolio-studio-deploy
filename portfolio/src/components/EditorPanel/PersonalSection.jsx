import React from 'react';
import { GithubMark, LinkedinMark } from '../ui/BrandIcons.jsx';

export default function PersonalSection({ data, onChange }) {
  const set = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  return (
    <>
      <div className="field-row">
        <div className="field">
          <label className="field-label">Name</label>
          <input className="input" value={data.name} onChange={set('name')} placeholder="Your full name" />
        </div>
        <div className="field">
          <label className="field-label">Title</label>
          <input className="input" value={data.title} onChange={set('title')} placeholder="Senior Software Engineer" />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Bio</label>
        <textarea className="textarea" value={data.bio} onChange={set('bio')} placeholder="Two or three sentences about what you do." />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">Location</label>
          <input className="input" value={data.location} onChange={set('location')} placeholder="City, Country" />
        </div>
        <div className="field">
          <label className="field-label">Email</label>
          <input className="input" type="email" value={data.email} onChange={set('email')} placeholder="hello@you.dev" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <GithubMark size={11} /> GitHub
          </label>
          <input className="input" value={data.github} onChange={set('github')} placeholder="https://github.com/you" />
        </div>
        <div className="field">
          <label className="field-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <LinkedinMark size={11} /> LinkedIn
          </label>
          <input className="input" value={data.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/you" />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Avatar URL (optional)</label>
        <input className="input" value={data.avatar} onChange={set('avatar')} placeholder="https://…/avatar.jpg" />
      </div>
    </>
  );
}
