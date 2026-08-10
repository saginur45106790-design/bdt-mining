import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import GlassCard from '@/components/ui/GlassCard';
import { User, Copy, Check, Users, Headphones, LogOut, ShieldCheck, ChevronRight, Lock } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => {});
  }, [router]);

  const handleCopy = () => {
    if (!user?.referralCode) return;
    const refLink = `${window.location.origin}/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!user) {
    return (
      <MobileWrapper>
        <div className="flex-1 flex items-center justify-center bg-darkBg text-goldPrimary font-bold text-xs">
          Loading Profile...
        </div>
      </MobileWrapper>
    );
  }

  return (
    <MobileWrapper>
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20 overflow-y-auto no-scrollbar">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-navyCard to-darkBg border border-goldPrimary/30 rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-goldPrimary/10 border-2 border-goldPrimary/40 flex items-center justify-center mx-auto mb-3 text-goldPrimary shadow-xl">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-extrabold text-white">{user.fullName}</h2>
          <span className="text-xs font-mono text-gray-400 block mt-0.5">{user.phone}</span>
          
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-activeGreen/10 border border-activeGreen/30 text-activeGreen text-[10px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Account Verified
          </div>
        </div>

        {/* Referral Box */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-goldPrimary" />
            <h3 className="text-xs font-bold text-white">Your Referral Code & Link</h3>
          </div>
          <div className="bg-darkBg p-3 rounded-xl border border-goldPrimary/20 flex items-center justify-between mb-3">
            <span className="text-sm font-mono font-bold text-goldPrimary tracking-wider">{user.referralCode}</span>
            <button
              onClick={handleCopy}
              className="bg-goldPrimary/10 border border-goldPrimary/30 text-goldPrimary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-navyCard/60 p-2.5 rounded-xl border border-goldPrimary/10">
              <span className="text-[10px] text-gray-400 block">Total Referrals</span>
              <span className="font-extrabold text-white text-sm">{user.totalReferrals || 0}</span>
            </div>
            <div className="bg-navyCard/60 p-2.5 rounded-xl border border-goldPrimary/10">
              <span className="text-[10px] text-gray-400 block">Active Miners</span>
              <span className="font-extrabold text-activeGreen text-sm">{user.activeReferrals || 0}</span>
            </div>
          </div>
        </GlassCard>

        {/* Navigation Options */}
        <div className="space-y-2">
          <button
            onClick={() => router.push('/support')}
            className="w-full bg-navyCard/80 border border-goldPrimary/15 p-3.5 rounded-xl flex items-center justify-between hover:border-goldPrimary/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <Headphones className="w-4 h-4 text-goldPrimary" />
              <span className="text-xs font-semibold text-white">Help & Support Desk</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>

          <button
            onClick={() => router.push('/forgot-password')}
            className="w-full bg-navyCard/80 border border-goldPrimary/15 p-3.5 rounded-xl flex items-center justify-between hover:border-goldPrimary/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-goldPrimary" />
              <span className="text-xs font-semibold text-white">Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-lockedRed/10 border border-lockedRed/30 p-3.5 rounded-xl flex items-center justify-center gap-2 text-lockedRed font-bold text-xs active:scale-95 transition-all mt-4"
          >
            <LogOut className="w-4 h-4" /> Logout Account
          </button>
        </div>
      </main>
      <BottomNav />
    </MobileWrapper>
  );
}