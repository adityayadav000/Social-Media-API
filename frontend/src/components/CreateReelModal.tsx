import React, { useState } from 'react';
import { reelService } from '../services/api';
import { X, Upload, Film, Video, AlertCircle } from 'lucide-react';
import type { Reel } from '../types';

interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReelCreated: (reel: Reel) => void;
}

export const CreateReelModal: React.FC<CreateReelModalProps> = ({ isOpen, onClose, onReelCreated }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', videoFile);
    if (caption) formData.append('caption', caption);

    try {
      const res = await reelService.createReel(formData);
      if (res && res.reel) {
        onReelCreated(res.reel);
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setCaption('');
        onClose();
      } else {
        setError(res.message || 'Reel upload completed.');
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload video reel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '24px',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={22} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Upload Video Reel</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--accent-rose)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Select Area */}
          <div style={{ marginBottom: '16px' }}>
            {videoPreviewUrl ? (
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '260px', background: '#000' }}>
                <video src={videoPreviewUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <button
                  type="button"
                  onClick={() => { setVideoFile(null); setVideoPreviewUrl(null); }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '180px',
                border: '2px dashed var(--border-glow)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <Video size={36} color="var(--accent-rose)" style={{ marginBottom: '10px' }} />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>Select Video File</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>MP4, MOV or WEBM</span>
                <input type="file" accept="video/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Caption Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add an engaging caption..."
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                color: '#fff',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={!videoFile || isSubmitting} className="btn-gradient">
              <Upload size={16} />
              <span>{isSubmitting ? 'Uploading...' : 'Upload Reel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
