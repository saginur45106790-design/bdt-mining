import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, Phone, Lock, Cpu, Mail, MapPin, Gift, Navigation } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [refCode, setRefCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (router.query.ref) {
      setRefCode(router.query.ref);
    }
  }, [router.query]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);
        setAddress(`GPS: Lat ${lat}, Lng ${lng} (Verified Location)`);
        setLocating(false);
      },
      (err) => {
        setError('Location permission denied! Please enable GPS to register.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!address) {
      setError('Location is mandatory! Click "Detect Live Location" to verify GPS.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password, address, refCode })
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
    <div className="min-h-screen bg-[#070A0F] text-white p-6 max-w-md mx-auto flex flex-col justify-center space-y-4">
      <div className="text-center space-y-1">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Cpu className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-amber-400">Create Account</h1>
        <p className="text-xs text-gray-400">Start mining and earning BDT today</p>
      </div>

      <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300 flex items-center gap-2 font-bold">
        <Gift className="w-5 h-5 text-amber-400 shrink-0" />
        <span>🎁 Free Mining Activation + Referral Bonus Ready!</span>
      </div>

      {error && <div className="p-3 text-xs bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl text-center font-bold">{error}</div>}

      <form onSubmit={handleRegister} className="space-y-3">
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
          <label className="text-xs font-bold text-gray-300 mb-1 block">Gmail Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@gmail.com"
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
          <label className="text-xs font-bold text-gray-300 mb-1 block">Live Location / Address</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
              <input
                type="text"
                value={address}
                readOnly
                placeholder="Click Detect GPS Location"
                required
                className="w-full pl-10 pr-3 py-3 bg-[#0F172A] border border-amber-500/40 rounded-xl text-xs font-bold text-amber-400 placeholder-gray-500 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className="px-3 py-3 bg-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center gap-1 shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              {locating ? 'GPS...' : 'Detect GPS'}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-300 mb-1 block">Referral Code (Optional)</label>
          <input
            type="text"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value)}
            placeholder="Auto-filled via Ref Link"
            className="w-full px-4 py-3 bg-[#0F172A] border border-amber-500/40 rounded-xl text-sm font-bold text-amber-400 outline-none"
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
