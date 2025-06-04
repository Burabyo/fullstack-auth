// src/components/AuthForm.jsx
import React, { useState } from 'react';
import api from '../api/axios';

export default function AuthForm({ isLogin, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? '/login' : '/register';
      const { data } = await api.post(url, { email, password });
      localStorage.setItem('authToken', data.token);
      onAuthSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Auth failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="input"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="input"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="btn-primary">
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
