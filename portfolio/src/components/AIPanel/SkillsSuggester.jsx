import React, { useState } from 'react';
import { suggestSkills } from '../../utils/ai.js';
import { uid } from '../../data/defaults.js';

export default function SkillsSuggester({ data, setData }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSuggest = async () => {
    setLoading(true);
    setError('');
    setItems([]);
    try {
      const results = await suggestSkills(data.skills);
      setItems(results);
    } catch (e) {
      setError(e.message || 'Could not reach Claude.');
    } finally {
      setLoading(false);
    }
  };

  const addOne = (label) => {
    if (data.skills.some((s) => s.label.toLowerCase() === label.toLowerCase())) return;
    const next = [...data.skills, { id: uid(), label }];
    setData({ ...data, skills: next });
    setItems((arr) => arr.filter((s) => s !== label));
  };

  return (
    <div className="ai-tool">
      <div className="ai-tool-head">
        <span className="ai-tool-name">Skills suggester</span>
        <button className="btn" onClick={onSuggest} disabled={loading}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          {loading ? 'Thinking…' : 'Suggest 5'}
        </button>
      </div>
      <div className="ai-tool-desc">
        Looks at your existing skills and suggests five complementary additions. Click to add.
      </div>

      {(loading || items.length > 0 || error) && (
        <div className={`ai-output ${items.length || loading ? '' : 'empty'}`}>
          {loading ? 'Considering related skills…' :
            error ? <span style={{ color: 'var(--ink-warn)' }}>{error}</span> :
            items.length === 0 ? 'No suggestions yet.' :
            'Tap any chip below to add it.'}
        </div>
      )}

      {items.length > 0 && (
        <div className="suggested-skills">
          {items.map((label) => (
            <button
              key={label}
              className="suggested-skill"
              onClick={() => addOne(label)}
              type="button"
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
