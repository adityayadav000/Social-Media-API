import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import { Heart, MessageSquare, Trash2, Send, CornerDownRight, User } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  
  const isInitiallyLiked = user?._id ? post.likes.includes(user._id) : false;
  const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
  const [likesCount, setLikesCount] = useState<number>(post.likes.length);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const isOwner = user?._id === (post.owner?._id || (post.owner as unknown as string));

  const handleToggleLike = async () => {
    if (!isAuthenticated) return alert('Please login to like posts!');
    if (isLiking) return;

    setIsLiking(true);
    const prevLiked = isLiked;
    const prevCount = likesCount;

    // Optimistic UI Update
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      if (prevLiked) {
        await postService.unlikePost(post._id);
      } else {
        await postService.likePost(post._id);
      }
    } catch {
      // Revert if error
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleComments = async () => {
    const nextState = !showComments;
    setShowComments(nextState);

    if (nextState && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await postService.getComments(post._id);
        if (res && res.comments) {
          setComments(res.comments);
        }
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await postService.createComment(post._id, newComment.trim());
      if (res && res.comment) {
        setComments((prev) => [res.comment, ...prev]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await postService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      await postService.deletePost(post._id);
      if (onPostDeleted) onPostDeleted(post._id);
    } catch (err) {
      console.error('Failed to delete post', err);
      setDeleting(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '20px', marginBottom: '18px', opacity: deleting ? 0.5 : 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <Link
          to={`/profile/${post.owner?._id}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#fff',
            fontSize: '1.1rem'
          }}>
            {post.owner?.username ? post.owner.username[0].toUpperCase() : <User size={20} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.98rem' }}>
              {post.owner?.fullName || post.owner?.username || 'User'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              @{post.owner?.username} • {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </Link>

        {isOwner && (
          <button
            onClick={handleDeletePost}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-full)'
            }}
            title="Delete post"
          >
            <Trash2 size={18} color="var(--accent-rose)" />
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{
        fontSize: '1.02rem',
        lineHeight: 1.5,
        color: '#e2e8f0',
        marginBottom: '16px',
        whiteSpace: 'pre-wrap'
      }}>
        {post.content}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        borderTop: '1px solid var(--border-glass)',
        paddingTop: '12px'
      }}>
        <button
          onClick={handleToggleLike}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: isLiked ? 'var(--accent-rose)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'transform 0.15s ease'
          }}
        >
          <Heart size={20} fill={isLiked ? 'var(--accent-rose)' : 'none'} color={isLiked ? 'var(--accent-rose)' : 'var(--text-muted)'} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={handleToggleComments}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: showComments ? 'var(--accent-cyan)' : 'var(--text-muted)',
            fontWeight: 500,
            fontSize: '0.9rem'
          }}
        >
          <MessageSquare size={19} color={showComments ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
          <span>{comments.length > 0 ? comments.length : 'Comments'}</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-full)',
                  padding: '8px 16px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.88rem'
                }}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                className="btn-gradient"
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)' }}
              >
                <Send size={16} />
              </button>
            </form>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Please login to add a comment.
            </div>
          )}

          {/* Comment List */}
          {loadingComments ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '10px' }}>
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', padding: '10px' }}>
              No comments yet. Be the first to start the discussion!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {comments.map((c) => {
                const isCommentOwner = user?._id === (c.owner?._id || c.user?._id || c.owner as unknown as string);
                const commentUser = c.owner || c.user;

                return (
                  <div
                    key={c._id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-glass)'
                    }}
                  >
                    <CornerDownRight size={14} color="var(--text-dim)" style={{ marginTop: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          @{commentUser?.username || 'User'}
                        </span>
                        {isCommentOwner && (
                          <button
                            onClick={() => handleDeleteComment(c._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-rose)' }}
                            title="Delete comment"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {c.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
