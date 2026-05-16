import React from 'react';
import { uid } from '../../data/defaults.js';

function TagsField({ tags, onChange }) {
  const [draft, setDraft] = React.useState('');
  const add = (raw) => {
    const t = String(raw || '').trim();
    if (!t) return;
    if (tags.includes(t)) return;
    onChange([...tags, t]);
  };
  const remove = (t) => onChange(tags.filter((x) => x !== t));
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft); setDraft('');
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };
  return (
    <div className="tag-input" style={{ marginTop: 4 }}>
      {tags.map((t) => (
        <span key={t} className="chip" style={{ cursor: 'default' }}>
          <span>{t}</span>
          <button type="button" className="chip-remove" onClick={() => remove(t)}>
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4"><path d="M1 1l8 8M9 1l-8 8" /></svg>
          </button>
        </span>
      ))}
      <input
        className="tag-input-field"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => { if (draft) { add(draft); setDraft(''); } }}
        placeholder={tags.length ? 'Add tech…' : 'React, Postgres, Go…'}
      />
    </div>
  );
}

export default function ProjectsSection({ projects, onChange, onEnhance }) {
  const update = (id, patch) =>
    onChange(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const add = () => {
    onChange([
      ...projects,
      { id: uid(), title: 'New Project', desc: '', tags: [], liveUrl: '', githubUrl: '', featured: false }
    ]);
  };

  const remove = (id) => onChange(projects.filter((p) => p.id !== id));

  return (
    <div>
      {projects.map((p, i) => (
        <div key={p.id} className="entry-card">
          <div className="entry-card-head">
            <span>Project / {String(i + 1).padStart(2, '0')}</span>
            <div className="entry-card-actions">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={!!p.featured}
                  onChange={(e) => update(p.id, { featured: e.target.checked })}
                />
                <span className="toggle-track"><span className="toggle-thumb" /></span>
                <span>Featured</span>
              </label>
              <button className="icon-btn" onClick={() => remove(p.id)} aria-label="Remove project" title="Remove">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
              </button>
            </div>
          </div>

          <div className="field">
            <label className="field-label">Title</label>
            <input className="input" value={p.title} onChange={(e) => update(p.id, { title: e.target.value })} />
          </div>

          <div className="field">
            <label className="field-label">Description</label>
            <textarea
              className="textarea"
              value={p.desc}
              onChange={(e) => update(p.id, { desc: e.target.value })}
              placeholder="What it does. Who it's for. What you built."
            />
            {onEnhance && (
              <div style={{ marginTop: 8 }}>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => onEnhance(p)}
                  disabled={!p.desc?.trim()}
                  title="Polish this description with AI"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Enhance with AI
                </button>
              </div>
            )}
          </div>

          <div className="field">
            <label className="field-label">Tech stack</label>
            <TagsField tags={p.tags || []} onChange={(t) => update(p.id, { tags: t })} />
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label">Live URL</label>
              <input className="input" value={p.liveUrl} onChange={(e) => update(p.id, { liveUrl: e.target.value })} placeholder="https://…" />
            </div>
            <div className="field">
              <label className="field-label">GitHub URL</label>
              <input className="input" value={p.githubUrl} onChange={(e) => update(p.id, { githubUrl: e.target.value })} placeholder="https://github.com/…" />
            </div>
          </div>
        </div>
      ))}

      <button className="btn" onClick={add}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>
        Add project
      </button>
    </div>
  );
}
