import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/tasks';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await API.post('/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      setLoggedIn(true);
    } catch (err: any) {
      setGeneralError(err.response?.status === 401
        ? 'Incorrect email or password'
        : 'Login failed. Try again.');
    }
  };

  useEffect(() => {
    if (loggedIn) navigate(from, { replace: true });
  }, [loggedIn, from, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-black p-6">
      <div className="max-w-md w-full bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl mb-6 font-semibold text-center">Login</h1>
        {generalError && <p className="text-red-500 mb-4 text-center">{generalError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {fieldErrors.email && <p className="text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
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
            {fieldErrors.password && <p className="text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 p-3 rounded text-white font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
