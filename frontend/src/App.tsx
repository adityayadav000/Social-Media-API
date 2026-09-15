import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateReelModal } from './components/CreateReelModal';
import { UserSearchModal } from './components/UserSearchModal';
import { FeedPage } from './pages/FeedPage';
import { ReelsPage } from './pages/ReelsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import type { Post, Reel } from './types';

export const AppContent: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [isCreateReelOpen, setIsCreateReelOpen] = useState<boolean>(false);

  const [newPostSignal, setNewPostSignal] = useState<Post | null>(null);
  const [newReelSignal, setNewReelSignal] = useState<Reel | null>(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenCreateReel={() => setIsCreateReelOpen(true)}
      />

      <div className="app-container" style={{ flex: 1, padding: '0 16px 40px 16px' }}>
        <Sidebar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCreatePost={() => setIsCreatePostOpen(true)}
          onOpenCreateReel={() => setIsCreateReelOpen(true)}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <FeedPage
                  onOpenCreatePost={() => setIsCreatePostOpen(true)}
                  newPostSignal={newPostSignal}
                />
              }
            />
            <Route
              path="/reels"
              element={
                <ReelsPage
                  onOpenCreateReel={() => setIsCreateReelOpen(true)}
                  newReelSignal={newReelSignal}
                />
              }
            />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={(post) => setNewPostSignal(post)}
      />

      <CreateReelModal
        isOpen={isCreateReelOpen}
        onClose={() => setIsCreateReelOpen(false)}
        onReelCreated={(reel) => setNewReelSignal(reel)}
      />

      <UserSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
