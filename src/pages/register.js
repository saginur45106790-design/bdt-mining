import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { User, Phone, Lock, Cpu, Gift } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password, refCode })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('miner_user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (e) {
      setError('Server Connection Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-white p-6 max-w-md mx-auto flex flex-col justify-center space-y-5">
      <div className="text-center space-y-1">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Cpu className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-amber-400">Create Account</h1>
        <p className="text-xs text-gray-400">Start mining and earning BDT today</p>
      </div>

      <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300 flex items-center gap-2 font-bold">
        <Gift className="w-5 h-5 text-amber-400 shrink-0" />
        <span>🎁 Free Mining Activation: Machine 1 Engine 1 will be activated automatically!</span>
      </div>

      {error && <div className="p-3 text-xs bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-center font-bold">{error}</div>}

      <form onSubmit={handleRegister} className="space-y-3.5">
        <div>
          <label className="text-xs font-bold text-gray-300 mb-1 block">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
              className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-amber-500/40 rounded-xl text-sm font-bold text-white placeholder-gray-400 outline-none focus:border-amber-400"
            />
          </div>
        </div>

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
              className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-amber-500/40 rounded-xl text-sm font-bold text-white placeholder-gray-400 outline-none focus:border-amber-400"
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
              placeholder="Create password"
              required
              className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-amber-500/40 rounded-xl text-sm font-bold text-white placeholder-gray-400 outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-300 mb-1 block">Referral Code (Optional)</label>
          <input
            type="text"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value)}
            placeholder="e.g. MINER12345"
            className="w-full px-4 py-3 bg-[#0F172A] border border-amber-500/40 rounded-xl text-sm font-bold text-white placeholder-gray-400 outline-none focus:border-amber-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-sm rounded-xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all uppercase tracking-wide"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400">
        Already have an account?{' '}
        <button onClick={() => router.push('/login')} className="text-amber-400 font-extrabold underline">
          Login
        </button>
      </div>
    </div>
  );
}
