import React from 'react';
import { isValidHex } from '../../utils/colors.js';
import { DEFAULT_PORTFOLIO } from '../../data/defaults.js';
import ResetButton from '../ui/ResetButton.jsx';

const THEMES = [
  { id: 'obsidian',     label: 'Obsidian',      meta: '01' },
  { id: 'arctic',       label: 'Arctic',        meta: '02' },
  { id: 'terminal',     label: 'Terminal',      meta: '03' },
  { id: 'aurora',       label: 'Aurora',        meta: '04' },
  { id: 'internsphere', label: 'InternSphere',  meta: '05' }
];

const FONTS = [
  { id: 'inter',     name: 'Inter',           meta: 'Modern sans · all themes' },
  { id: 'dm-sans',   name: 'DM Sans',         meta: 'Geometric · clean' },
  { id: 'jetbrains', name: 'JetBrains Mono',  meta: 'Monospace · technical' }
];

const PRESETS = ['#7c3aed', '#22d3ee', '#00ff41', '#f97316', '#ec4899', '#facc15', '#10b981', '#ef4444'];

const TEXT_SIZES = [
  { id: 'xs', label: 'XS', value: 0.85 },
  { id: 's',  label: 'S',  value: 0.92 },
  { id: 'm',  label: 'M',  value: 1.00 },
  { id: 'l',  label: 'L',  value: 1.12 },
  { id: 'xl', label: 'XL', value: 1.28 }
];

const DEFAULT_APPEARANCE = DEFAULT_PORTFOLIO.appearance;
const themeName = (id) => THEMES.find((t) => t.id === id)?.label || id;
const fontName  = (id) => FONTS.find((f) => f.id === id)?.name || id;
const textSizeStep = (v) => TEXT_SIZES.reduce((best, s) =>
  Math.abs(s.value - v) < Math.abs(best.value - v) ? s : best, TEXT_SIZES[2]);
const textSizeName = (v) => textSizeStep(v).label;
const sameHex = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

export default function AppearanceSection({ appearance, onChange }) {
  const set = (k, v) => onChange({ ...appearance, [k]: v });

  const currentScale = Number(appearance.textScale) || 1;
  const defaultScale = Number(DEFAULT_APPEARANCE.textScale) || 1;

  const sameTheme  = appearance.theme === DEFAULT_APPEARANCE.theme;
  const sameAccent = sameHex(appearance.accent, DEFAULT_APPEARANCE.accent);
  const sameFont   = appearance.font === DEFAULT_APPEARANCE.font;
  const sameSize   = Math.abs(currentScale - defaultScale) < 0.001;
  const isDefault  = sameTheme && sameAccent && sameFont && sameSize;

  const resetAppearance = () => onChange({ ...DEFAULT_APPEARANCE });

  return (
    <>
      <div className="field">
        <label className="field-label">Theme</label>
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => set('theme', t.id)}
              className={`theme-swatch t-${t.id} ${appearance.theme === t.id ? 'active' : ''}`}
            >
              <span className="theme-swatch-num">{t.meta}</span>
              <span className="theme-swatch-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label">Accent color</label>
        <div className="accent-row">
          <label className="accent-swatch" style={{ background: appearance.accent }}>
            <input
              type="color"
              value={isValidHex(appearance.accent) ? appearance.accent : '#7c3aed'}
              onChange={(e) => set('accent', e.target.value)}
              aria-label="Accent color"
            />
          </label>
          <input
            className="input"
            value={appearance.accent}
            onChange={(e) => set('accent', e.target.value)}
            placeholder="#7c3aed"
            style={{ borderBottom: 0 }}
          />
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 'var(--t-tiny)', letterSpacing: '0.16em', textTransform: 'uppercase', color: isValidHex(appearance.accent) ? 'var(--ink-muted)' : 'var(--ink-warn)' }}>
            {isValidHex(appearance.accent) ? 'Hex' : 'Invalid'}
          </span>
        </div>
        <div className="accent-presets" aria-label="Accent presets">
          {PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              style={{ background: c }}
              onClick={() => set('accent', c)}
              aria-label={c}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label">Font pairing</label>
        <div className="font-grid">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`font-option ${appearance.font === f.id ? 'active' : ''}`}
              onClick={() => set('font', f.id)}
            >
              <span style={{
                fontFamily:
                  f.id === 'inter' ? "'Inter', sans-serif"
                  : f.id === 'dm-sans' ? "'DM Sans', sans-serif"
                  : "'JetBrains Mono', monospace",
                fontWeight: f.id === 'jetbrains' ? 500 : 700,
                fontSize: 18,
                color: 'var(--ink)'
              }}>
                Aa
              </span>
              <div>
                <div className="font-option-name" style={{
                  fontFamily:
                    f.id === 'inter' ? "'Inter', sans-serif"
                    : f.id === 'dm-sans' ? "'DM Sans', sans-serif"
                    : "'JetBrains Mono', monospace"
                }}>
                  {f.name}
                </div>
                <div className="font-option-meta">{f.meta}</div>
              </div>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: appearance.font === f.id ? 'var(--chrome)' : 'var(--line-strong)'
              }} />
            </button>
          ))}
        </div>
      </div>

      <div className="field text-size-block">
        <div className="text-size-head">
          <label className="field-label" style={{ marginBottom: 0 }}>Text size</label>
          <span className="text-size-meta">
            scale<strong>{textSizeName(currentScale)} · {Math.round(currentScale * 100)}%</strong>
          </span>
        </div>
        <div className="text-size-stepper" role="group" aria-label="Text size">
          {TEXT_SIZES.map((s) => {
            const active = Math.abs(s.value - currentScale) < 0.001;
            return (
              <button
                key={s.id}
                type="button"
                className={`text-size-step ${active ? 'active' : ''}`}
                onClick={() => set('textScale', s.value)}
                aria-pressed={active}
                title={`${s.label} — ${Math.round(s.value * 100)}%`}
              >
                <span className="glyph" style={{ fontSize: `${10 + s.value * 8}px` }}>Aa</span>
                <span className="label">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="appearance-reset" data-modified={String(!isDefault)}>
        <div className="appearance-reset-head">
          <span className="appearance-reset-title">Revert to default appearance</span>
          <span className="appearance-reset-status">
            <span className="dot" />
            {isDefault ? 'On defaults' : 'Modified'}
          </span>
        </div>
        <p className="appearance-reset-desc">
          {isDefault
            ? 'Theme, accent, and font are all at the original Portfolio Studio defaults — nothing to revert.'
            : 'One click restores the theme, accent color, and typography to the original Portfolio Studio defaults. Your content is untouched.'}
        </p>

        {!isDefault && (
          <div className="appearance-reset-rows" aria-label="Comparison of current settings vs defaults">
            <span className="k">Theme</span>
            <span className={`v ${sameTheme ? 'is-same' : 'is-current'}`}>
              {themeName(appearance.theme)}
            </span>
            <span className="arrow">→</span>
            <span className={`v ${sameTheme ? 'is-same' : 'is-default'}`}>
              {themeName(DEFAULT_APPEARANCE.theme)}
            </span>

            <span className="k">Accent</span>
            <span className={`v ${sameAccent ? 'is-same' : 'is-current'}`}>
              <span className="swatch-mini" style={{ background: appearance.accent }} />
              <code>{appearance.accent}</code>
            </span>
            <span className="arrow">→</span>
            <span className={`v ${sameAccent ? 'is-same' : 'is-default'}`}>
              <span className="swatch-mini" style={{ background: DEFAULT_APPEARANCE.accent }} />
              <code>{DEFAULT_APPEARANCE.accent}</code>
            </span>

            <span className="k">Font</span>
            <span className={`v ${sameFont ? 'is-same' : 'is-current'}`}>
              {fontName(appearance.font)}
            </span>
            <span className="arrow">→</span>
            <span className={`v ${sameFont ? 'is-same' : 'is-default'}`}>
              {fontName(DEFAULT_APPEARANCE.font)}
            </span>

            <span className="k">Size</span>
            <span className={`v ${sameSize ? 'is-same' : 'is-current'}`}>
              {textSizeName(currentScale)}<code style={{ marginLeft: 6, opacity: 0.6 }}>{Math.round(currentScale * 100)}%</code>
            </span>
            <span className="arrow">→</span>
            <span className={`v ${sameSize ? 'is-same' : 'is-default'}`}>
              {textSizeName(defaultScale)}<code style={{ marginLeft: 6, opacity: 0.6 }}>{Math.round(defaultScale * 100)}%</code>
            </span>
          </div>
        )}

        <div className="appearance-reset-actions">
          <ResetButton
            onConfirm={resetAppearance}
            label={isDefault ? 'Already at defaults' : 'Reset appearance to defaults'}
            armedLabel="Click again to confirm"
            variant="prominent"
            disabled={isDefault}
          />
        </div>
      </div>
    </>
  );
}
