import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { User, Copy, ShieldCheck, LogOut, Share2, Headphones, Key, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [userState, setUserState] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('miner_user') : null;
    if (!raw) return router.push('/login');
    const user = JSON.parse(raw);
    fetch(`/api/user/state?phone=${user.phone}`)
      .then(r => r.json())
      .then(d => setUserState(d))
      .catch(() => {});
  }, [router]);

  const user = userState?.user || {};

  const handleCopy = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bdt-mining.onrender.com';
    navigator.clipboard.writeText(`${origin}/register?ref=${user.referralCode || 'MINER12345'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('miner_user');
    router.push('/login');
  };

  return (
    <MobileWrapper>
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/dashboard')} className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-amber-400">User Profile</h1>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-amber-500/30 text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-extrabold text-white">{user.name || 'Sajib'}</h2>
          <p className="text-xs font-bold text-amber-400">{user.phone}</p>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Account Verified
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Share2 className="w-4 h-4" /> Your Referral Code & Link
          </div>
          <div className="p-3 bg-[#070A0F] border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-sm font-black text-amber-400">{user.referralCode || 'MINER59073'}</span>
            <button onClick={handleCopy} className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied Link' : 'Copy Link'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-2">
            <div className="p-2.5 rounded-xl bg-[#070A0F] border border-slate-800">
              <p className="text-[10px] text-gray-400">Total Referrals</p>
              <p className="text-sm font-black text-white mt-0.5">{user.referralsCount || 0}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070A0F] border border-slate-800">
              <p className="text-[10px] text-gray-400">Active Miners</p>
              <p className="text-sm font-black text-emerald-400 mt-0.5">{user.referralsCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button className="w-full p-3.5 rounded-2xl bg-[#0F172A] border border-amber-500/20 flex items-center justify-between text-xs font-bold text-gray-300">
            <div className="flex items-center gap-2 text-amber-400">
              <Headphones className="w-4 h-4" /> Help & Support Desk
            </div>
            <span>›</span>
          </button>
          <button className="w-full p-3.5 rounded-2xl bg-[#0F172A] border border-amber-500/20 flex items-center justify-between text-xs font-bold text-gray-300">
            <div className="flex items-center gap-2 text-amber-400">
              <Key className="w-4 h-4" /> Change Password
            </div>
            <span>›</span>
          </button>
          <button onClick={handleLogout} className="w-full p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center gap-2 text-xs font-extrabold text-red-400">
            <LogOut className="w-4 h-4" /> Logout Account
          </button>
        </div>
      </div>
    </MobileWrapper>
  );
}
