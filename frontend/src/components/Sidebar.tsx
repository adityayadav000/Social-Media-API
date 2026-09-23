import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Film, Search, PlusSquare, Video, User, LogOut } from 'lucide-react';

interface SidebarProps {
  onOpenSearch: () => void;
  onOpenCreatePost: () => void;
  onOpenCreateReel: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSearch, onOpenCreatePost, onOpenCreateReel }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItemStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 18px',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    color: isActive ? '#fff' : 'var(--text-muted)',
    background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
    border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.98rem',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  });

  return (
    <aside
      className="glass-panel"
      style={{
        width: '240px',
        padding: '20px 14px',
        height: 'calc(100vh - 100px)',
        position: 'sticky',
        top: '90px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink to="/" style={({ isActive }) => navItemStyle(isActive)}>
          <Home size={20} color="var(--accent-primary)" />
          <span>Feed</span>
        </NavLink>

        <NavLink to="/reels" style={({ isActive }) => navItemStyle(isActive)}>
          <Film size={20} color="var(--accent-rose)" />
          <span>Reels</span>
        </NavLink>

        <div onClick={onOpenSearch} style={navItemStyle(false)}>
          <Search size={20} color="var(--accent-cyan)" />
          <span>Search</span>
        </div>

        {isAuthenticated && (
          <>
            <div onClick={onOpenCreatePost} style={navItemStyle(false)}>
              <PlusSquare size={20} color="#a855f7" />
              <span>New Post</span>
            </div>

            <div onClick={onOpenCreateReel} style={navItemStyle(false)}>
              <Video size={20} color="#10b981" />
              <span>Upload Reel</span>
            </div>

            <NavLink to={`/profile/${user?._id}`} style={({ isActive }) => navItemStyle(isActive)}>
              <User size={20} color="var(--accent-primary)" />
              <span>Profile</span>
            </NavLink>
          </>
        )}
      </nav>

      {isAuthenticated && (
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
          <button
            onClick={logout}
            style={{
              ...navItemStyle(false),
              width: '100%',
              color: 'var(--accent-rose)',
              background: 'rgba(244, 63, 94, 0.08)'
            }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};
