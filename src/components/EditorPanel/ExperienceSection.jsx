import React from 'react';
import { uid } from '../../data/defaults.js';

export default function ExperienceSection({ experience, onChange }) {
  const update = (id, patch) =>
    onChange(experience.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const add = () => {
    onChange([
      ...experience,
      { id: uid(), company: 'New Company', role: 'Role', duration: '2024 — Present', bullets: [''] }
    ]);
  };

  const remove = (id) => onChange(experience.filter((e) => e.id !== id));

  const updateBullet = (id, idx, value) => {
    const entry = experience.find((e) => e.id === id);
    const next = [...entry.bullets];
    next[idx] = value;
    update(id, { bullets: next });
  };

  const addBullet = (id) => {
    const entry = experience.find((e) => e.id === id);
    update(id, { bullets: [...entry.bullets, ''] });
  };

  const removeBullet = (id, idx) => {
    const entry = experience.find((e) => e.id === id);
    update(id, { bullets: entry.bullets.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      {experience.map((e, i) => (
        <div key={e.id} className="entry-card">
          <div className="entry-card-head">
            <span>Role / {String(i + 1).padStart(2, '0')}</span>
            <div className="entry-card-actions">
              <button className="icon-btn" onClick={() => remove(e.id)} aria-label="Remove role">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
              </button>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label">Company</label>
              <input className="input" value={e.company} onChange={(ev) => update(e.id, { company: ev.target.value })} />
            </div>
            <div className="field">
              <label className="field-label">Role</label>
              <input className="input" value={e.role} onChange={(ev) => update(e.id, { role: ev.target.value })} />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Duration</label>
            <input className="input" value={e.duration} onChange={(ev) => update(e.id, { duration: ev.target.value })} placeholder="2022 — Present" />
          </div>

          <div className="field">
            <label className="field-label">Highlights</label>
            <div className="bullet-list">
              {e.bullets.map((b, idx) => (
                <div key={idx} className="bullet-row">
                  <span className="bullet-mark">→</span>
                  <input
                    className="input"
                    style={{ borderBottom: '1px solid var(--line)' }}
                    value={b}
                    onChange={(ev) => updateBullet(e.id, idx, ev.target.value)}
                    placeholder="Shipped X / led Y / cut Z by N%"
                  />
                  <button className="icon-btn" onClick={() => removeBullet(e.id, idx)} aria-label="Remove bullet">
                    <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4"><path d="M1 1l8 8M9 1l-8 8" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => addBullet(e.id)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>
              Add bullet
            </button>
          </div>
        </div>
      ))}

      <button className="btn" onClick={add}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" /></svg>
        Add experience
      </button>
    </div>
  );
}
