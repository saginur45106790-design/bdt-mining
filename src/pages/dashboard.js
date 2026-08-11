import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { Cpu, ArrowUpCircle, Users, Wallet, Clock, Lock, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState({
    availableBalance: '0.00',
    todayMining: '75.00',
    totalDeposit: '0.00',
    totalWithdraw: '0.00',
    currentHourlyRate: 5,
    withdrawEnabled: false
  });

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('miner_user') : null;
    if (!raw) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(raw);
    fetchState(user.phone);
  }, []);

  const fetchState = (phone) => {
    fetch(`/api/user/state?phone=${phone}`)
      .then(r => r.json())
      .then(d => { if (d) setData(d); })
      .catch(() => {});
  };

  return (
    <MobileWrapper>
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0F172A] border border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              ⚒️
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-amber-400 tracking-wide">BDT MINING</h1>
              <p className="text-[10px] text-gray-400">CLOUD PLATFORM</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-bold text-xs">
            ৳{data.availableBalance}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-amber-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL AVAILABLE BALANCE</p>
              <p className="text-3xl font-black text-white mt-1">৳{data.availableBalance}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#070A0F] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Cpu className="w-4 h-4" /> Today's Mining Income
            </div>
            <span className="text-xs font-black text-emerald-400">+৳{data.todayMining}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div>
              <p className="text-[10px] text-gray-400">Total Mining</p>
              <p className="text-xs font-bold text-white mt-0.5">৳0</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Total Deposit</p>
              <p className="text-xs font-bold text-emerald-400 mt-0.5">↘ ৳{data.approvedDeposits || '0'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Total Withdraw</p>
              <p className="text-xs font-bold text-amber-400 mt-0.5">↗ ৳{data.approvedWithdraws || '0'}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">MINING ACTIVE</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" /> Next Credit: 59:30
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#070A0F] border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400">CURRENT SPEED</p>
              <p className="text-sm font-black text-amber-400">৳{data.currentHourlyRate || 5} / Hour</p>
            </div>
            <span className="px-3 py-1.5 text-xs font-bold bg-amber-500 text-black rounded-lg shadow-md">
              ⚡ Live Engine
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button onClick={() => router.push('/withdraw')} className="p-3.5 rounded-2xl bg-[#0F172A] border border-amber-500/30 flex flex-col items-center gap-1.5 hover:border-amber-400">
            <ArrowUpCircle className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] font-bold">Withdraw</span>
          </button>
          <button onClick={() => router.push('/machines')} className="p-3.5 rounded-2xl bg-[#0F172A] border border-amber-500/30 flex flex-col items-center gap-1.5 hover:border-amber-400">
            <Cpu className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] font-bold">Machines</span>
          </button>
          <button onClick={() => router.push('/profile')} className="p-3.5 rounded-2xl bg-[#0F172A] border border-amber-500/30 flex flex-col items-center gap-1.5 hover:border-amber-400">
            <Users className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] font-bold">Referral</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/30 space-y-3">
          <h2 className="text-xs font-extrabold text-amber-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" /> MACHINE PROGRESS OVERVIEW
          </h2>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[1,2,3,4,5].map((id) => {
              const isUnlocked = data.machineAccess?.[id];
              return (
                <div key={id} className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${isUnlocked ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-gray-500'}`}>
                  <span className="text-xs font-bold">M{id}</span>
                  {isUnlocked ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MobileWrapper>
  );
}
