import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios';

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
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    setStrength(getStrength(password));
    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
    if (passwordConfirm && password !== passwordConfirm) {
      setPasswordError("Passwords don't match");
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
        password_confirmation: passwordConfirm
      });
      localStorage.setItem('token', res.data.access_token);
      navigate('/tasks');
    } catch (err: any) {
      const firstError = err.response?.data?.errors ? 
        Object.values(err.response.data.errors)[0][0] :
        err.response?.data?.message || 'Registration failed';
      setGeneralError(firstError);
    }
  };

  const { text, color } = strengthLabel(strength);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4">Register</h1>
      {generalError && <p className="text-red-600">{generalError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded" />

        <div>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded" />
          <p style={{ color }}>{text}</p>
        </div>
        
        <div>
          <input type="password" placeholder="Confirm Password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        {passwordError && <p className="text-red-600">{passwordError}</p>}

        <button type="submit" disabled={!!passwordError} className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
