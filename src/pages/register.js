import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Hammer, User, Phone, Lock, Gift, UserPlus } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!agreeTerms) {
      return setError('You must agree to Terms & Conditions');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, password, referralCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

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
      <div className="flex-1 flex flex-col justify-center p-6 bg-darkBg relative overflow-hidden py-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/50/30 flex items-center justify-center mx-auto mb-2 text-amber-400 shadow-lg shadow-goldPrimary/10">
            <Hammer className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-gray-400 mt-0.5">Start mining and earning BDT today</p>
        </div>

        {/* Free Bonus Banner */}
        <div className="bg-gradient-to-r from-goldPrimary/10 to-activeGreen/10 border border-amber-500/50/30 rounded-xl p-3 mb-5 flex items-center gap-3">
          <Gift className="w-6 h-6 text-amber-400 shrink-0 animate-bounce" />
          <div>
            <span className="text-xs font-bold text-amber-400 block">🎁 Free Mining Activation</span>
            <span className="text-[10px] text-gray-300">Machine 1 Engine 1 will be activated automatically!</span>
          </div>
        </div>

        {error && (
          <div className="bg-lockedRed/10 border border-lockedRed/30 text-lockedRed text-xs font-semibold p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-amber-500/50"
              />
            </div>
          </div>

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
                className="w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Referral Code (Optional)</label>
            <input
              type="text"
              placeholder="e.g. MINER12345"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full glass-input rounded-xl py-2.5 px-4 text-sm focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded accent-goldPrimary bg-darkBg border-amber-500/50/30"
            />
            <label htmlFor="terms" className="text-xs text-gray-300">
              I agree to <span className="text-amber-400 font-semibold">Terms & Conditions</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-goldPrimary to-goldHover text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-goldPrimary/20 active:scale-95 transition-all mt-3"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-400 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </MobileWrapper>
  );
}