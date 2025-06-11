import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function getStrength(password: string): number {
  let s = 0;
  if (password.length >= 8) s++;
  if (/[a-z]/.test(password)) s++;
  if (/[A-Z]/.test(password)) s++;
  if (/[0-9]/.test(password)) s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  return s;
}

function strengthLabel(score: number) {
  if (score <= 2) return { text: 'Weak', color: 'red' };
  if (score === 3) return { text: 'Medium', color: 'orange' };
  return { text: 'Strong', color: 'green' };
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    setStrength(getStrength(password));
    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (passwordConfirm && password !== passwordConfirm) {
      setPasswordError("Passwords don't match");
    } else {
      setPasswordError('');
    }
  }, [password, passwordConfirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordError) return;
    try {
      const res = await API.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
      });
      localStorage.setItem('token', res.data.access_token);
      navigate('/tasks');
    } catch (err: any) {
      const firstError = err.response?.data?.errors
        ? Object.values(err.response.data.errors)[0][0]
        : err.response?.data?.message || 'Registration failed';
      setGeneralError(firstError);
    }
  };

  const { text, color } = strengthLabel(strength);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-black p-6">
      <div className="max-w-md w-full bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl mb-6 font-semibold text-center">Register</h1>
        {generalError && <p className="text-red-500 mb-4 text-center">{generalError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-indigo-400"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          <p style={{ color }} className="mt-1 font-semibold">{text}</p>

          <div className="relative">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              name="password_confirmation"
              autoComplete="new-password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-3 text-gray-400 hover:text-indigo-400"
              aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
            >
              {showPasswordConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {passwordError && <p className="text-red-500">{passwordError}</p>}

          <button
            type="submit"
            disabled={!!passwordError}
            className={`w-full p-3 rounded font-semibold text-white transition-colors duration-300 ${
              passwordError ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

