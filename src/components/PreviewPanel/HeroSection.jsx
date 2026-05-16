import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GithubMark, LinkedinMark, MailMark } from '../ui/BrandIcons.jsx';

function useTypewriter(text, speed = 55, startDelay = 350) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    indexRef.current = 0;
    setOut('');
    setDone(false);
    if (!text) { setDone(true); return; }

    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      indexRef.current += 1;
      setOut(text.slice(0, indexRef.current));
      if (indexRef.current < text.length) {
        timerRef.current = setTimeout(tick, speed + Math.random() * 35);
      } else {
        setDone(true);
      }
    };
    timerRef.current = setTimeout(tick, startDelay);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, startDelay]);

  return { out, done };
}

export default function HeroSection({ personal }) {
  const { out: typed, done: typingDone } = useTypewriter(personal.title || '');

  const social = [];
  if (personal.github)   social.push({ label: 'GitHub',   href: personal.github,            icon: <GithubMark />   });
  if (personal.linkedin) social.push({ label: 'LinkedIn', href: personal.linkedin,          icon: <LinkedinMark /> });
  if (personal.email)    social.push({ label: 'Email',    href: `mailto:${personal.email}`, icon: <MailMark />     });

  return (
    <header className="pv-hero" id="top">
      <div className="pv-wrap">
        <div className="pv-hero-main">
          {personal.avatar && (
            <div className="pv-avatar-wrap">
              <img
                className="pv-avatar"
                src={personal.avatar}
                alt={personal.name || 'Profile photo'}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}
          <motion.div
            className="pv-eyebrow"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {personal.location || 'Portfolio'} / Available for work
          </motion.div>

          <motion.h1
            className="pv-name"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {personal.name || 'Your Name'}
          </motion.h1>

          <h2 className="pv-title" aria-label={personal.title}>
            {typed}
            {!typingDone && <span className="pv-title-cursor" />}
          </h2>

          <motion.p
            className="pv-bio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {personal.bio}
          </motion.p>

          <motion.div
            className="pv-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {personal.location && (
              <span className="pv-meta-row">Based in <strong>{personal.location}</strong></span>
            )}
            {social.length > 0 && (
              <span className="pv-socials">
                {social.map((s) => (
                  <a key={s.label} className="pv-social" href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.icon}
                    <span>{s.label}</span>
                  </a>
                ))}
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
