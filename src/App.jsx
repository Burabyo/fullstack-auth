// src/App.jsx
import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import Tasks from './components/Tasks';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout} className="btn btn-secondary mb-4">
            Logout
          </button>
          <Tasks />
        </>
      ) : (
        <>
          <AuthForm isLogin={true} onAuthSuccess={() => setIsLoggedIn(true)} />
          <p className="text-center my-4">Or</p>
          <AuthForm isLogin={false} onAuthSuccess={() => setIsLoggedIn(true)} />
        </>
      )}
    </div>
  );
}
