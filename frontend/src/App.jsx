import React, { useState } from 'react';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Library from './pages/Library';
import Watch from './pages/Watch';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login'); // login, library, watch, admin
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('library');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setCurrentVideo(null);
  };

  const navigateToWatch = (video) => {
    setCurrentVideo(video);
    setCurrentPage('watch');
  };

  const navigateToLibrary = () => {
    setCurrentVideo(null);
    setCurrentPage('library');
  };

  const navigateToAdmin = () => {
    if (user && (user.role === 'admin' || user.username === 'root')) {
      setCurrentPage('admin');
    } else {
      alert('Admin only access this page');
    }
  };

  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  if (currentPage === 'watch' && currentVideo) {
    return <Watch video={currentVideo} user={user} onBack={navigateToLibrary} />;
  }

  // Security Check: Ensure only admins can see this page
  if (currentPage === 'admin') {
    if (user && (user.role === 'admin' || user.username === 'root')) {
      return <Admin user={user} onBack={navigateToLibrary} onLogout={handleLogout} />;
    } else {
      // Fallback if state somehow got here without permission
      setCurrentPage('library');
      return null;
    }
  }

  // Default: Library Page
  return (
    <Library
      user={user}
      onLogout={handleLogout}
      onWatch={navigateToWatch}
      isAdmin={user.role === 'admin' || user.username === 'root'}
      onAdmin={navigateToAdmin}
    />
  );
}

export default App;
