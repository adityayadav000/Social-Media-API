import React, { useState, useRef } from 'react';
import type { Reel, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { reelService } from '../services/api';
import { Heart, MessageSquare, Eye, Volume2, VolumeX, Play, Send, Trash2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReelPlayerProps {
  reel: Reel;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({ reel }) => {
  const { user, isAuthenticated } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const isInitiallyLiked = user?._id ? reel.likes.includes(user._id) : false;
  const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
  const [likesCount, setLikesCount] = useState<number>(reel.likes.length);
  const [viewsCount, setViewsCount] = useState<number>(reel.viewsCount || 0);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [hasRecordedView, setHasRecordedView] = useState<boolean>(false);

  // Record view on play / component view
  const handlePlayVideo = async () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        if (!hasRecordedView && isAuthenticated) {
          setHasRecordedView(true);
          try {
            await reelService.viewReel(reel._id);
            setViewsCount((prev) => prev + 1);
          } catch {
            // silent catch
          }
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return alert('Please login to like reels!');

    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      if (prevLiked) {
        await reelService.unlikeReel(reel._id);
      } else {
        await reelService.likeReel(reel._id);
      }
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleToggleComments = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !showComments;
    setShowComments(nextState);

    if (nextState && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await reelService.getReelComments(reel._id);
        if (res && res.comments) {
          setComments(res.comments);
        }
      } catch (err) {
        console.error('Failed to load reel comments', err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await reelService.createReelComment(reel._id, newComment.trim());
      if (res && res.comment) {
        setComments((prev) => [res.comment, ...prev]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to post reel comment', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await reelService.deleteReelComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Failed to delete reel comment', err);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        height: '680px',
        margin: '0 auto 40px auto',
        overflow: 'hidden',
        borderRadius: '24px',
        background: '#000',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        playsInline
        muted={isMuted}
        onClick={handlePlayVideo}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: 'pointer'
        }}
      />

      {/* Play/Pause Overlay Indicator */}
      {!isPlaying && (
        <div
          onClick={handlePlayVideo}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Play size={32} color="#fff" style={{ marginLeft: '4px' }} />
        </div>
      )}

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          border: 'none',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Right Side Action Icons */}
      <div
        style={{
          position: 'absolute',
          right: '16px',
          bottom: '100px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        {/* Like */}
        <button
          onClick={handleToggleLike}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Heart size={24} fill={isLiked ? 'var(--accent-rose)' : 'none'} color={isLiked ? 'var(--accent-rose)' : '#fff'} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {likesCount}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={handleToggleComments}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MessageSquare size={22} color="#fff" />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {comments.length}
          </span>
        </button>

        {/* View Count */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Eye size={22} color="var(--accent-cyan)" />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {viewsCount}
          </span>
        </div>
      </div>

      {/* Bottom Creator Overlay Info */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '20px 70px 20px 16px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
          zIndex: 5
        }}
      >
        <Link
          to={`/profile/${reel.owner?._id}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#fff'
          }}>
            {reel.owner?.username ? reel.owner.username[0].toUpperCase() : <User size={16} />}
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
            @{reel.owner?.username || 'creator'}
          </span>
        </Link>
        {reel.caption && (
          <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.4 }}>
            {reel.caption}
          </p>
        )}
      </div>

      {/* Comments Drawer overlay */}
      {showComments && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '16px',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Reel Comments</span>
            <button
              onClick={() => setShowComments(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Comment List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {loadingComments ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                Loading...
              </div>
            ) : comments.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                No comments on this reel yet.
              </div>
            ) : (
              comments.map((c) => {
                const commentUser = c.owner || c.user;
                const isCommentOwner = user?._id === (commentUser?._id || commentUser as unknown as string);
                return (
                  <div key={c._id} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 10px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                        @{commentUser?.username || 'User'}
                      </span>
                      {isCommentOwner && (
                        <button onClick={() => handleDeleteComment(c._id)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '2px' }}>{c.content}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Comment Form */}
          {isAuthenticated && (
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Comment on reel..."
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn-gradient" style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)' }}>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
