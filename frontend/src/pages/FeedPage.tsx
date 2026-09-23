import React, { useState, useEffect } from 'react';
import type { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import { PostCard } from '../components/PostCard';
import { Sparkles, RefreshCw, Compass, Users, PlusCircle } from 'lucide-react';

interface FeedPageProps {
  onOpenCreatePost: () => void;
  newPostSignal?: Post | null;
}

export const FeedPage: React.FC<FeedPageProps> = ({ onOpenCreatePost, newPostSignal }) => {
  const { user, isAuthenticated } = useAuth();
  const [feedType, setFeedType] = useState<'feed' | 'explore'>(isAuthenticated ? 'feed' : 'explore');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (feedType === 'feed' && isAuthenticated) {
        const res = await postService.getFeed(1, 20);
        if (res && res.posts) {
          setPosts(res.posts);
        } else {
          setPosts([]);
        }
      } else {
        const res = await postService.getAllPosts();
        if (res && (res.posts || Array.isArray(res))) {
          setPosts(res.posts || res);
        } else {
          setPosts([]);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch posts', err);
      // Fallback to explore posts if feed fails or requires login
      try {
        const res = await postService.getAllPosts();
        if (res && (res.posts || Array.isArray(res))) {
          setPosts(res.posts || res);
        }
      } catch {
        setError('Unable to load feed content.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType, isAuthenticated]);

  // Prepend newly created post
  useEffect(() => {
    if (newPostSignal) {
      setPosts((prev) => [newPostSignal, ...prev]);
    }
  }, [newPostSignal]);

  const handlePostDeleted = (deletedPostId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedPostId));
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Create Post Prompt Banner */}
      {isAuthenticated && (
        <div
          className="glass-card"
          style={{
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
          onClick={onOpenCreatePost}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700
          }}>
            {user?.username ? user.username[0].toUpperCase() : 'U'}
          </div>
          <div style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-full)',
            padding: '10px 16px',
            color: 'var(--text-muted)',
            fontSize: '0.92rem'
          }}>
            Share what's on your mind...
          </div>
          <button className="btn-gradient" style={{ padding: '8px 14px' }}>
            <PlusCircle size={18} />
          </button>
        </div>
      )}

      {/* Feed Filter Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isAuthenticated && (
            <button
              onClick={() => setFeedType('feed')}
              style={{
                background: feedType === 'feed' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: feedType === 'feed' ? '1px solid var(--border-glow)' : '1px solid transparent',
                color: feedType === 'feed' ? '#fff' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={16} color="var(--accent-primary)" />
              <span>Following</span>
            </button>
          )}

          <button
            onClick={() => setFeedType('explore')}
            style={{
              background: feedType === 'explore' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              border: feedType === 'explore' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              color: feedType === 'explore' ? '#fff' : 'var(--text-muted)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Compass size={16} color="var(--accent-cyan)" />
            <span>Explore All</span>
          </button>
        </div>

        <button
          onClick={fetchPosts}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px'
          }}
          title="Refresh Feed"
        >
          <RefreshCw size={18} className={loading ? 'live-pulse' : ''} />
        </button>
      </div>

      {/* Feed List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <Sparkles size={28} className="live-pulse" color="var(--accent-primary)" style={{ marginBottom: '10px' }} />
          <p style={{ fontSize: '0.9rem' }}>Fetching stream...</p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '30px', color: 'var(--accent-rose)' }}>
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <Compass size={36} color="var(--accent-cyan)" style={{ marginBottom: '12px' }} />
          <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>No posts available yet</h4>
          <p style={{ fontSize: '0.88rem' }}>Be the pioneer creator! Publish a post to get started.</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
        ))
      )}
    </div>
  );
};
