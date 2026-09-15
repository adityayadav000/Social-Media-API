import React, { useState, useEffect } from 'react';
import type { Reel } from '../types';
import { useAuth } from '../context/AuthContext';
import { reelService } from '../services/api';
import { ReelPlayer } from '../components/ReelPlayer';
import { Film, Video, RefreshCw, Compass } from 'lucide-react';

interface ReelsPageProps {
  onOpenCreateReel: () => void;
  newReelSignal?: Reel | null;
}

export const ReelsPage: React.FC<ReelsPageProps> = ({ onOpenCreateReel, newReelSignal }) => {
  const { isAuthenticated } = useAuth();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReels = async () => {
    setLoading(true);
    try {
      let res;
      if (isAuthenticated) {
        try {
          res = await reelService.getReelFeed();
        } catch {
          res = await reelService.getReels();
        }
      } else {
        res = await reelService.getReels();
      }

      if (res && (res.reels || Array.isArray(res))) {
        setReels(res.reels || res);
      } else {
        setReels([]);
      }
    } catch (err) {
      console.error('Failed to fetch reels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, [isAuthenticated]);

  useEffect(() => {
    if (newReelSignal) {
      setReels((prev) => [newReelSignal, ...prev]);
    }
  }, [newReelSignal]);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Film size={24} color="var(--accent-rose)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Reels Stream</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAuthenticated && (
            <button onClick={onOpenCreateReel} className="btn-gradient" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Video size={16} />
              <span>Upload</span>
            </button>
          )}
          <button onClick={fetchReels} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <RefreshCw size={18} className={loading ? 'live-pulse' : ''} />
          </button>
        </div>
      </div>

      {/* Reel Feed */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Film size={32} className="live-pulse" color="var(--accent-rose)" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '0.9rem' }}>Loading reels video feed...</p>
        </div>
      ) : reels.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
          <Compass size={40} color="var(--accent-cyan)" style={{ marginBottom: '14px' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>No video reels found</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Upload your short videos to showcase them to the community.</p>
          {isAuthenticated && (
            <button onClick={onOpenCreateReel} className="btn-gradient">
              <Video size={18} />
              <span>Create First Reel</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reels.map((reel) => (
            <ReelPlayer key={reel._id} reel={reel} />
          ))}
        </div>
      )}
    </div>
  );
};
