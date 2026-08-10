import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Hammer, Phone, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileWrapper>
      <div className="flex-1 flex flex-col justify-center p-6 bg-darkBg relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/50/30 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-lg shadow-goldPrimary/10">
            <Hammer className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-gray-400 mt-1">Log in to continue BDT Mining</p>
        </div>

        {error && (
          <div className="bg-lockedRed/10 border border-lockedRed/30 text-lockedRed text-xs font-semibold p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-sm focus:border-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-3 pl-10 pr-10 text-sm focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-amber-400 hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-goldPrimary to-goldHover text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-goldPrimary/20 active:scale-95 transition-all mt-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          Don't have an account?{' '}
          <Link href="/register" className="text-amber-400 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </MobileWrapper>
  );
}