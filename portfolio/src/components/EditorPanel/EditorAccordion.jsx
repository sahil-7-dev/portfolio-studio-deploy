import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResetButton from '../ui/ResetButton.jsx';

export default function EditorAccordion({
  number,
  title,
  meta,
  open,
  onToggle,
  onReset,
  resetLabel,
  children
}) {
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className={`section ${open ? 'open' : ''}`}>
      <div
        className="section-head"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={handleKey}
        aria-expanded={open}
      >
        <span className="section-num">{number}</span>
        <span className="section-title">
          {title}<span className="accent">.</span>
        </span>
        <span className="section-meta">
          {meta}
          {onReset && <ResetButton onConfirm={onReset} label={resetLabel || 'Reset'} />}
          <span className="section-chevron">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="section-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
