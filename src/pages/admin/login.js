import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Lock, Phone, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid Login Credentials');
      }
    } catch (err) {
      setError('Connection Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[#0F172A] border border-amber-500/40 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-amber-400">BDT MINING ADMIN</h1>
          <p className="text-xs text-gray-400">Secure Administrative Console</p>
        </div>

        {error && <div className="p-3 text-xs bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-300 font-bold mb-1 block">Admin Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3.5 text-amber-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01798147447"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#070A0F] border border-slate-700 rounded-xl text-sm focus:border-amber-400 outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 font-bold mb-1 block">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-amber-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#070A0F] border border-slate-700 rounded-xl text-sm focus:border-amber-400 outline-none text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
