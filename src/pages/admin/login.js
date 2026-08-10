import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Pickaxe, Lock, Phone } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
      if (data.user?.role !== 'ADMIN') throw new Error('Access denied: Not an Admin');

      localStorage.setItem('adminToken', data.token);
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-navyCard border border-goldPrimary/30 rounded-2xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-goldPrimary/10 border border-goldPrimary/30 flex items-center justify-center mx-auto mb-2 text-goldPrimary">
            <Pickaxe className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">BDT MINING ADMIN</h2>
          <p className="text-xs text-gray-400">Secure Administrative Console</p>
        </div>

        {error && (
          <div className="bg-lockedRed/10 border border-lockedRed/30 text-lockedRed text-xs font-semibold p-2.5 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-gray-300 block mb-1 font-semibold">Admin Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-2.5 pl-10 pr-3 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 block mb-1 font-semibold">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-2.5 pl-10 pr-3 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-goldPrimary to-goldHover text-black font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all mt-2"
          >
            {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}