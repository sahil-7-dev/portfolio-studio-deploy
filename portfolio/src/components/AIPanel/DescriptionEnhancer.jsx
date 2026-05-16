import React, { useState } from 'react';
import { enhanceDescription } from '../../utils/ai.js';

export default function DescriptionEnhancer({ data, setData }) {
  const [selectedId, setSelectedId] = useState(data.projects[0]?.id || '');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');

  const project = data.projects.find((p) => p.id === selectedId) || null;

  const onEnhance = async () => {
    const source = (draft || project?.desc || '').trim();
    if (!source) return;
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const text = await enhanceDescription(source);
      setOutput(text);
    } catch (e) {
      setError(e.message || 'Could not reach Claude.');
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!output) return;
    if (project) {
      const next = data.projects.map((p) => p.id === project.id ? { ...p, desc: output } : p);
      setData({ ...data, projects: next });
    }
    setDraft('');
  };

  return (
    <div className="ai-tool">
      <div className="ai-tool-head">
        <span className="ai-tool-name">Description enhancer</span>
        <button className="btn" onClick={onEnhance} disabled={loading || !(draft || project?.desc)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4l16 16M4 20L20 4" />
          </svg>
          {loading ? 'Polishing…' : 'Enhance'}
        </button>
      </div>
      <div className="ai-tool-desc">
        Pick a project (or paste a rough draft) and we’ll return a sharp, recruiter-ready version.
      </div>

      <div className="field" style={{ marginBottom: 8 }}>
        <label className="field-label">Project</label>
        <select
          className="input"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ background: 'transparent', borderBottom: '1px solid var(--line)', color: 'var(--ink)', padding: '8px 0', fontFamily: 'var(--f-body)' }}
        >
          {data.projects.length === 0 && <option value="">No projects yet</option>}
          {data.projects.map((p) => (
            <option key={p.id} value={p.id} style={{ background: '#0a0a0c' }}>
              {p.title || 'Untitled'}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field-label">Rough description (optional — overrides selected)</label>
        <textarea
          className="textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={project ? project.desc : 'Paste a rough draft to polish…'}
        />
      </div>

      {(loading || output || error) && (
        <div className={`ai-output ${output || loading ? '' : 'empty'}`}>
          {loading && !output ? 'Polishing your description…' :
            error ? <span style={{ color: 'var(--ink-warn)' }}>{error}</span> : output}
        </div>
      )}

      {output && !loading && project && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={apply}>Apply to “{project.title}”</button>
          <button className="btn btn-ghost" onClick={onEnhance}>Try again</button>
        </div>
      )}
    </div>
  );
}
