import React, { useState } from 'react';
import BioGenerator from './BioGenerator.jsx';
import DescriptionEnhancer from './DescriptionEnhancer.jsx';
import SkillsSuggester from './SkillsSuggester.jsx';

export default function AIPanel({ data, setData }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="ai-rail">
      <button
        className="ai-rail-head"
        style={{ width: '100%', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        <span>
          <span className="star">✦</span>
          AI Studio · Three intelligent helpers
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--ink-faint)' }}>{open ? 'Hide' : 'Show'}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
               style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 240ms' }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="ai-tools">
          <BioGenerator data={data} setData={setData} />
          <DescriptionEnhancer data={data} setData={setData} />
          <SkillsSuggester data={data} setData={setData} />
        </div>
      )}
    </div>
  );
}
