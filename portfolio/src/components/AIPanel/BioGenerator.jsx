import React, { useEffect, useRef, useState } from 'react';
import { generateBio } from '../../utils/ai.js';

export default function BioGenerator({ data, setData }) {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [committed, setCommitted] = useState(false);
  const cancelRef = useRef(null);

  // Typewriter reveal of full result
  const startReveal = (full) => {
    if (cancelRef.current) cancelRef.current();
    let i = 0;
    let cancelled = false;
    cancelRef.current = () => { cancelled = true; };
    const tick = () => {
      if (cancelled) return;
      i += 1;
      setOutput(full.slice(0, i));
      if (i < full.length) setTimeout(tick, 14 + Math.random() * 18);
    };
    setTimeout(tick, 80);
  };

  useEffect(() => () => { if (cancelRef.current) cancelRef.current(); }, []);

  const onGenerate = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    setCommitted(false);
    try {
      const text = await generateBio({
        name: data.personal.name,
        title: data.personal.title,
        skills: data.skills
      });
      startReveal(text);
    } catch (e) {
      setError(e.message || 'Could not reach Claude.');
    } finally {
      setLoading(false);
    }
  };

  const onUse = () => {
    if (!output) return;
    setData({ ...data, personal: { ...data.personal, bio: output } });
    setCommitted(true);
  };

  return (
    <div className="ai-tool">
      <div className="ai-tool-head">
        <span className="ai-tool-name">Bio generator</span>
        <button className="btn" onClick={onGenerate} disabled={loading}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
          {loading ? 'Thinking…' : 'Generate'}
        </button>
      </div>
      <div className="ai-tool-desc">
        Uses your name, title and skills. 2–3 sharp sentences, first person, no buzzwords.
      </div>
      <div className={`ai-output ${output || loading ? '' : 'empty'}`}>
        {loading && !output ? 'Composing your bio…' :
          output ? (
            <>
              {output}
              {output.length < 320 && <span className="ai-cursor" />}
            </>
          ) : (
            error || 'Click Generate to draft a bio.'
          )}
      </div>
      {output && !loading && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={onUse}>
            {committed ? 'Used ✓' : 'Use this bio'}
          </button>
          <button className="btn btn-ghost" onClick={onGenerate}>Regenerate</button>
        </div>
      )}
      {error && (
        <div style={{ marginTop: 8, fontSize: 'var(--t-tiny)', color: 'var(--ink-warn)', fontFamily: 'var(--f-mono)', letterSpacing: '0.04em' }}>
          {error}
        </div>
      )}
    </div>
  );
}
