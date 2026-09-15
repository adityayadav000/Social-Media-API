import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { User, Post, Reel } from '../types';
import { useAuth } from '../context/AuthContext';
import { authService, postService, reelService } from '../services/api';
import { PostCard } from '../components/PostCard';
import { ReelPlayer } from '../components/ReelPlayer';
import { UserCheck, UserPlus, Grid, Film, Sparkles, User as UserIcon } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, isAuthenticated, refreshUser } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userReels, setUserReels] = useState<Reel[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'followers'>('posts');
  const [loading, setLoading] = useState<boolean>(true);
  const [followingState, setFollowingState] = useState<boolean>(false);
  const [followersCount, setFollowersCount] = useState<number>(0);

  const isOwnProfile = currentUser?._id === userId;

  const loadProfileData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Get user profile
      const userRes = await authService.getUserProfile(userId);
      if (userRes && userRes.user) {
        setProfileUser(userRes.user);
        const followers = userRes.user.followers || [];
        setFollowersCount(followers.length);

        // Check if current user is following this profile
        if (currentUser?._id) {
          const isFollowing = followers.some((f: any) => (typeof f === 'string' ? f === currentUser._id : f._id === currentUser._id));
          setFollowingState(isFollowing);
        }
      }

      // Fetch all posts and filter for this user
      const postsRes = await postService.getAllPosts();
      if (postsRes) {
        const rawPosts: Post[] = postsRes.posts || postsRes;
        const filtered = rawPosts.filter((p) => p.owner?._id === userId || (p.owner as unknown as string) === userId);
        setUserPosts(filtered);
      }

      // Fetch all reels and filter for this user
      const reelsRes = await reelService.getReels();
      if (reelsRes) {
        const rawReels: Reel[] = reelsRes.reels || reelsRes;
        const filteredReels = rawReels.filter((r) => r.owner?._id === userId || (r.owner as unknown as string) === userId);
        setUserReels(filteredReels);
      }
    } catch (err) {
      console.error('Failed to load profile data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [userId, currentUser]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated) return alert('Please login to follow creators!');
    if (!userId) return;

    const prevFollowing = followingState;
    const prevCount = followersCount;

    setFollowingState(!prevFollowing);
    setFollowersCount(prevFollowing ? prevCount - 1 : prevCount + 1);

    try {
      if (prevFollowing) {
        await authService.unfollowUser(userId);
      } else {
        await authService.followUser(userId);
      }
      refreshUser();
    } catch {
      setFollowingState(prevFollowing);
      setFollowersCount(prevCount);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <Sparkles size={32} className="live-pulse" color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
        <p>Loading creator profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        User not found.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Profile Header Card */}
      <div className="glass-panel" style={{ padding: '0 0 24px 0', overflow: 'hidden', marginBottom: '24px' }}>
        {/* Cover Banner */}
        <div style={{
          height: '140px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(236, 72, 153, 0.4), rgba(6, 182, 212, 0.4))',
          position: 'relative'
        }} />

        {/* Avatar & Main Info */}
        <div style={{ padding: '0 24px', marginTop: '-50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            border: '4px solid var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '2.4rem',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {profileUser.username ? profileUser.username[0].toUpperCase() : <UserIcon size={40} />}
          </div>

          {!isOwnProfile && (
            <button
              onClick={handleToggleFollow}
              className={followingState ? 'btn-secondary' : 'btn-gradient'}
              style={{ padding: '10px 24px' }}
            >
              {followingState ? (
                <>
                  <UserCheck size={18} color="var(--accent-cyan)" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Follow Creator</span>
                </>
              )}
            </button>
          )}
        </div>

        <div style={{ padding: '16px 24px 0 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            {profileUser.fullname || profileUser.fullName || profileUser.username}
          </h2>
          <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.92rem', marginTop: '2px' }}>
            @{profileUser.username}
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '18px' }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>{userPosts.length}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>Posts</span>
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>{followersCount}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>Followers</span>
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>{profileUser.following?.length || 0}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-glass)',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('posts')}
          style={{
            flex: 1,
            padding: '12px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'posts' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'posts' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Grid size={18} />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          style={{
            flex: 1,
            padding: '12px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'reels' ? '2px solid var(--accent-rose)' : '2px solid transparent',
            color: activeTab === 'reels' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Film size={18} />
          <span>Reels ({userReels.length})</span>
        </button>
      </div>

      {/* Content Stream */}
      {activeTab === 'posts' && (
        userPosts.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
            No posts published by this creator yet.
          </div>
        ) : (
          userPosts.map((post) => (
            <PostCard key={post._id} post={post} onPostDeleted={(id) => setUserPosts(prev => prev.filter(p => p._id !== id))} />
          ))
        )
      )}

      {activeTab === 'reels' && (
        userReels.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
            No reels uploaded by this creator yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {userReels.map((reel) => (
              <ReelPlayer key={reel._id} reel={reel} />
            ))}
          </div>
        )
      )}
    </div>
  );
};
