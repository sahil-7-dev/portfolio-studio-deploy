import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { DEFAULT_PORTFOLIO } from './data/defaults.js';
import { loadFromStorage, makeDebouncedSaver } from './utils/storage.js';
import { decodePortfolio, readShareTokenFromLocation, clearShareTokenFromLocation, buildShareUrl } from './utils/share.js';
import { deriveAccentVars, isValidHex } from './utils/colors.js';
import { downloadHTML } from './utils/exportHTML.js';

import EditorPanel from './components/EditorPanel/EditorPanel.jsx';
import PreviewPanel from './components/PreviewPanel/PreviewPanel.jsx';

const FONT_MAP = {
  inter:       { display: "'Inter', sans-serif",         body: "'Inter', sans-serif",         mono: "'JetBrains Mono', monospace" },
  'dm-sans':   { display: "'DM Sans', sans-serif",       body: "'DM Sans', sans-serif",       mono: "'JetBrains Mono', monospace" },
  'jetbrains': { display: "'JetBrains Mono', monospace", body: "'JetBrains Mono', monospace", mono: "'JetBrains Mono', monospace" }
};

export { FONT_MAP };

export default function App() {
  const [portfolioData, setPortfolioData] = useState(DEFAULT_PORTFOLIO);
  const [hydrated, setHydrated] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [toast, setToast] = useState(null);

  const saver = useRef(null);
  if (!saver.current) saver.current = makeDebouncedSaver(500);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = readShareTokenFromLocation();
      if (token) {
        const decoded = await decodePortfolio(token);
        if (!cancelled && decoded) {
          setPortfolioData((prev) => ({ ...prev, ...decoded }));
          clearShareTokenFromLocation();
          setHydrated(true);
          showToast('Loaded from share link');
          return;
        }
      }
      const local = loadFromStorage();
      if (!cancelled && local) {
        setPortfolioData((prev) => ({ ...prev, ...local }));
      }
      setHydrated(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const saveFlashTimer = useRef(null);
  useEffect(() => {
    if (!hydrated) return;
    saver.current.onSaved(() => {
      setSavedFlash(true);
      clearTimeout(saveFlashTimer.current);
      saveFlashTimer.current = setTimeout(() => setSavedFlash(false), 1400);
    });
    saver.current.save(portfolioData);
  }, [portfolioData, hydrated]);

  const accentStyle = useMemo(() => {
    const hex = isValidHex(portfolioData.appearance.accent) ? portfolioData.appearance.accent : '#7c3aed';
    const scale = Number(portfolioData.appearance.textScale) || 1;
    return {
      ...deriveAccentVars(hex),
      '--pv-scale': String(scale)
    };
  }, [portfolioData.appearance.accent, portfolioData.appearance.textScale]);

  const fontVars = useMemo(() => {
    const f = FONT_MAP[portfolioData.appearance.font] || FONT_MAP.inter;
    return {
      '--pv-font-display-override': f.display,
      '--pv-font-body-override': f.body
    };
  }, [portfolioData.appearance.font]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  return (
    <div className="app">
      <Topbar
        savedFlash={savedFlash}
        portfolioData={portfolioData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showToast={showToast}
      />

      <div className="workspace">
        <section className={`editor-pane ${activeTab === 'edit' ? 'tab-active' : ''}`}>
          <EditorPanel data={portfolioData} setData={setPortfolioData} />
        </section>

        <section className={`preview-pane ${activeTab === 'preview' ? 'tab-active' : ''}`}>
          <PreviewPanel data={portfolioData} accentStyle={accentStyle} fontVars={fontVars} />
        </section>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Topbar({ savedFlash, portfolioData, activeTab, setActiveTab, showToast }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-dot" />
        <span>Portfolio<span style={{ fontStyle: 'normal', opacity: 0.4, margin: '0 4px' }}>/</span>Studio</span>
        <span className="brand-meta">v1.0 · Editorial</span>
      </div>

      <div className="topbar-center">
        <div className="tab-toggle" role="tablist">
          <button className={activeTab === 'edit' ? 'active' : ''} onClick={() => setActiveTab('edit')}>Edit</button>
          <button className={activeTab === 'preview' ? 'active' : ''} onClick={() => setActiveTab('preview')}>Preview</button>
        </div>
        <span className={`save-indicator ${savedFlash ? '' : 'idle'}`}>
          <span className="dot" />
          {savedFlash ? 'Saved' : 'Auto-save on'}
        </span>
      </div>

      <div className="topbar-right">
        <ExportControls data={portfolioData} showToast={showToast} />
      </div>
    </header>
  );
}

function ExportControls({ data, showToast }) {
  const handleExport = () => {
    const safeName = (data.personal.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    downloadHTML(data, `${safeName || 'portfolio'}.html`);
    showToast('Exported portfolio.html');
  };

  const handleShare = async () => {
    try {
      const url = await buildShareUrl(data);
      await navigator.clipboard.writeText(url);
      showToast('Share link copied');
    } catch {
      showToast('Could not copy link');
    }
  };

  return (
    <>
      <button className="btn btn-ghost" onClick={handleShare} title="Copy a shareable URL">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>
        Share
      </button>
      <button className="btn btn-primary" onClick={handleExport}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>
        Export HTML
      </button>
    </>
  );
}
