import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/tasks';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Login</h1>
      {generalError && <p className="text-red-600 mb-4">{generalError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
          {fieldErrors.email && <p className="text-red-600 mt-1">{fieldErrors.email}</p>}
        </div>
        <div><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" />
          {fieldErrors.password && <p className="text-red-600 mt-1">{fieldErrors.password}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
