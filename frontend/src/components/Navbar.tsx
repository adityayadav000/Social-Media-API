import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Search, PlusCircle, Film, User as UserIcon, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenCreatePost: () => void;
  onOpenCreateReel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenCreatePost, onOpenCreateReel }) => {
  const { user, isAuthenticated, logout, isApiOnline } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '12px 24px',
      marginBottom: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }} className="gradient-text">
              SocialPulse
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isApiOnline ? '#10b981' : '#ef4444',
                boxShadow: isApiOnline ? '0 0 8px #10b981' : '0 0 8px #ef4444'
              }} className={isApiOnline ? 'live-pulse' : ''} />
              {isApiOnline ? 'API Connected' : 'Connecting...'}
            </div>
          </div>
        </Link>

        {/* Global Search Bar */}
        <button
          onClick={onOpenSearch}
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            border: '1px solid var(--border-glass)',
            minWidth: '220px',
            fontSize: '0.9rem'
          }}
        >
          <Search size={16} color="var(--accent-cyan)" />
          <span>Search creators...</span>
        </button>

        {/* Right Actions */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={onOpenCreatePost} className="btn-secondary" title="New Post">
              <PlusCircle size={18} color="var(--accent-primary)" />
              <span>Post</span>
            </button>

            <button onClick={onOpenCreateReel} className="btn-gradient" style={{ padding: '8px 16px' }} title="New Reel">
              <Film size={18} />
              <span>Reel</span>
            </button>

            <Link
              to={`/profile/${user?._id}`}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px 4px 4px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: '0.9rem'
              }}>
                {user?.username ? user.username[0].toUpperCase() : <UserIcon size={16} />}
              </div>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600, paddingRight: '4px' }}>
                @{user?.username}
              </span>
            </Link>

            <button
              onClick={() => { logout(); navigate('/auth'); }}
              className="btn-secondary"
              style={{ padding: '8px' }}
              title="Logout"
            >
              <LogOut size={18} color="var(--accent-rose)" />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="btn-gradient">
            Sign In / Register
          </Link>
        )}
      </div>
    </header>
  );
};
