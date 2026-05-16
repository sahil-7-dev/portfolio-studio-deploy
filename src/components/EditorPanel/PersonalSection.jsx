import React, { useRef, useState, useCallback } from 'react';
import { GithubMark, LinkedinMark } from '../ui/BrandIcons.jsx';

// Converts a local File to a base64 data URL so it works without a server
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Accepts any image URL and wraps it in a CORS-friendly proxy if needed
function normaliseAvatarUrl(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  // Already a data URL (local upload) — pass through
  if (trimmed.startsWith('data:')) return trimmed;

  // Ensure it has a protocol
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  // Known hosts that block hotlinking — route through wsrv.nl image proxy
  // wsrv.nl is a free, open CDN proxy that re-serves images with permissive CORS
  const blockedHosts = ['pbs.twimg.com', 'twitter.com', 'instagram.com', 'fbcdn.net'];
  try {
    const { hostname } = new URL(withProto);
    if (blockedHosts.some(h => hostname.includes(h))) {
      return `https://wsrv.nl/?url=${encodeURIComponent(withProto)}&w=200&h=200&fit=cover&output=webp`;
    }
  } catch {
    return withProto;
  }

  return withProto;
}

export default function PersonalSection({ data, onChange }) {
  const set = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  const fileInputRef = useRef(null);
  const [urlInput, setUrlInput]   = useState(data.avatar?.startsWith('data:') ? '' : (data.avatar || ''));
  const [avatarTab, setAvatarTab] = useState('url'); // 'url' | 'upload'
  const [uploadErr, setUploadErr] = useState('');
  const [previewSrc, setPreviewSrc] = useState(data.avatar || '');

  const applyAvatar = useCallback((src) => {
    setPreviewSrc(src);
    onChange({ ...data, avatar: src });
  }, [data, onChange]);

  const handleUrlChange = (e) => {
    const raw = e.target.value;
    setUrlInput(raw);
    const normalised = normaliseAvatarUrl(raw);
    applyAvatar(normalised);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr('');

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      setUploadErr('Unsupported format. Use JPG, PNG, WebP, GIF, AVIF, or SVG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErr('File too large. Max 5 MB.');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setUrlInput('');
      applyAvatar(dataUrl);
    } catch {
      setUploadErr('Could not read file. Try another image.');
    }
  };

  const handleClear = () => {
    setUrlInput('');
    setPreviewSrc('');
    setUploadErr('');
    applyAvatar('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <div className="field-row">
        <div className="field">
          <label className="field-label">Name</label>
          <input className="input" value={data.name} onChange={set('name')} placeholder="Your full name" />
        </div>
        <div className="field">
          <label className="field-label">Title</label>
          <input className="input" value={data.title} onChange={set('title')} placeholder="Senior Software Engineer" />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Bio</label>
        <textarea className="textarea" value={data.bio} onChange={set('bio')} placeholder="Two or three sentences about what you do." />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">Location</label>
          <input className="input" value={data.location} onChange={set('location')} placeholder="City, Country" />
        </div>
        <div className="field">
          <label className="field-label">Email</label>
          <input className="input" type="email" value={data.email} onChange={set('email')} placeholder="hello@you.dev" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <GithubMark size={11} /> GitHub
          </label>
          <input className="input" value={data.github} onChange={set('github')} placeholder="https://github.com/you" />
        </div>
        <div className="field">
          <label className="field-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <LinkedinMark size={11} /> LinkedIn
          </label>
          <input className="input" value={data.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/you" />
        </div>
      </div>

      {/* Avatar field */}
      <div className="field">
        <label className="field-label">Profile Photo</label>

        <div className="avatar-editor">
          {/* Preview */}
          <div className="avatar-preview">
            {previewSrc ? (
              <img
                src={previewSrc}
                alt="Avatar preview"
                onError={() => {
                  setUploadErr('URL did not load. Use a direct image link ending in .jpg, .png, or .webp');
                  setPreviewSrc('');
                }}
              />
            ) : (
              <span className="avatar-placeholder">
                {data.name ? data.name[0].toUpperCase() : '?'}
              </span>
            )}
          </div>

          <div className="avatar-controls">
            {/* Tab switcher */}
            <div className="avatar-tabs">
              <button
                type="button"
                className={`avatar-tab ${avatarTab === 'url' ? 'active' : ''}`}
                onClick={() => setAvatarTab('url')}
              >
                URL
              </button>
              <button
                type="button"
                className={`avatar-tab ${avatarTab === 'upload' ? 'active' : ''}`}
                onClick={() => setAvatarTab('upload')}
              >
                Upload
              </button>
            </div>

            {avatarTab === 'url' && (
              <input
                className="input"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder="Direct image URL ending in .jpg .png .webp etc."
              />
            )}

            {avatarTab === 'upload' && (
              <div
                className="avatar-dropzone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    fileInputRef.current.files = e.dataTransfer.files;
                    handleFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <span>Click or drag an image here</span>
                <small>JPG, PNG, WebP, GIF, AVIF, SVG · max 5 MB</small>
              </div>
            )}

            {uploadErr && <p className="avatar-error">{uploadErr}</p>}

            {previewSrc && (
              <button type="button" className="avatar-clear" onClick={handleClear}>
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
