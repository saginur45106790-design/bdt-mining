import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Phone, Lock, Cpu } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getOrCreateDeviceId = () => {
    let devId = localStorage.getItem('bdt_device_id');
    if (!devId) {
      devId = 'DEV_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      localStorage.setItem('bdt_device_id', devId);
    }
    return devId;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const deviceId = getOrCreateDeviceId();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, deviceId })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('miner_user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid Credentials');
      }
    } catch (e) {
      setError('Connection Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-white p-6 max-w-md mx-auto flex flex-col justify-center space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Cpu className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-amber-400">Welcome Back!</h1>
        <p className="text-xs text-gray-400">Log in to continue BDT Mining</p>
      </div>

      {error && <div className="p-3 text-xs bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-center font-bold">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-300 mb-1 block">Mobile Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              required
              className="w-full pl-10 pr-4 py-3.5 bg-[#0F172A] border border-amber-500/40 rounded-xl text-sm font-bold text-white placeholder-gray-400 outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-300 mb-1 block">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full pl-10 pr-4 py-3.5 bg-[#0F172A] border border-amber-500/40 rounded-xl text-sm font-bold text-white placeholder-gray-400 outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-sm rounded-xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all uppercase tracking-wide"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400">
        Don't have an account?{' '}
        <button onClick={() => router.push('/register')} className="text-amber-400 font-extrabold underline">
          Sign Up
        </button>
      </div>
    </div>
  );
}
