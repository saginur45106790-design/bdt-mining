import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import Toast from '@/components/ui/Toast';
import { MACHINES_CONFIG } from '@/data/config';
import { ArrowLeft, Cpu, Youtube, Facebook, ShieldCheck, CheckCircle2, Users, Copy, ArrowDownCircle, Clock, XCircle } from 'lucide-react';

export default function MachineDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [userState, setUserState] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = typeof window !== 'undefined' ? localStorage.getItem('miner_user') : null;
    if (!raw) return router.push('/login');
    const user = JSON.parse(raw);
    fetchData(user.phone);
  }, [id, router]);

  const fetchData = (phone) => {
    fetch(`/api/user/state?phone=${phone}`)
      .then(r => r.json())
      .then(d => setUserState(d))
      .catch(() => {});

    fetch('/api/settings')
      .then(r => r.json())
      .then(s => setSettings(s))
      .catch(() => {});
  };

  if (!mounted || !userState || !id) return <div className="p-8 text-center text-amber-400 font-bold">Loading Engine Details...</div>;

  const machineId = parseInt(id);
  const machine = MACHINES_CONFIG.find(m => m.id === machineId);
  if (!machine) return <div className="p-8 text-center text-red-400 font-bold">Invalid Machine ID</div>;

  const handleBuyEngine = async (engineId) => {
    const raw = localStorage.getItem('miner_user');
    const user = raw ? JSON.parse(raw) : {};
    setLoading(true);

    try {
      const res = await fetch('/api/user/buy-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, machineId, engineId })
      });
      const data = await res.json();
      setToast({ type: data.success ? 'success' : 'error', message: data.message });
      if (data.success) {
        fetchData(user.phone);
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Error unlocking engine' });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = async (taskName, link) => {
    window.open(link, '_blank');
    const raw = localStorage.getItem('miner_user');
    const user = raw ? JSON.parse(raw) : {};

    try {
      const res = await fetch('/api/user/complete-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, task: taskName })
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: `✅ ${taskName.toUpperCase()} Verified & Completed!` });
        fetchData(user.phone);
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Task verification failed' });
    }
  };

  const handleCopyRef = () => {
    const refCode = userState.user?.referralCode || 'MINER12345';
    navigator.clipboard.writeText(`https://bdt-mining.onrender.com/register?ref=${refCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ytDone = !!userState.user?.tasksCompleted?.youtube;
  const fbDone = !!userState.user?.tasksCompleted?.facebook;
  const currentRefs = userState.user?.referralsCount || 0;
  const m3Done = currentRefs >= 3;
  const m4DepositDone = !!userState.has20Approved;
  const m5DepositDone = !!userState.has50Approved;

  return (
    <MobileWrapper>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/machines')} className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 flex items-center gap-1 text-xs font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to List
          </button>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
            Available: ৳{userState.availableBalance}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-amber-500/40 text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-amber-400">{machine.name}</h1>
          <p className="text-sm font-bold text-white">Rate: {machine.subtitle}</p>
        </div>

        {/* Machine 2 Requirement Block */}
        {machineId === 2 && (
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Unlock Requirement Tasks</h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${ytDone && fbDone ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}>
                {ytDone && fbDone ? 'Tasks Cleared' : 'Tasks Required'}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleTaskClick('youtube', settings.youtubeLink || 'https://youtube.com')}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  ytDone ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-900/20 border-red-500/50 text-red-300 hover:bg-red-900/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" /> Subscribe YouTube Channel
                </div>
                {ytDone ? (
                  <span className="flex items-center gap-1 font-extrabold text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Done</span>
                ) : (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-[10px] font-extrabold">Visit & Subscribe</span>
                )}
              </button>

              <button
                onClick={() => handleTaskClick('facebook', settings.facebookLink || 'https://facebook.com')}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  fbDone ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-blue-900/20 border-blue-500/50 text-blue-300 hover:bg-blue-900/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-500" /> Follow Facebook Page
                </div>
                {fbDone ? (
                  <span className="flex items-center gap-1 font-extrabold text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Done</span>
                ) : (
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-extrabold">Visit & Follow</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Machine 3 Requirement Block */}
        {machineId === 3 && (
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Unlock Requirement</h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${m3Done ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}>
                {m3Done ? '3/3 Referrals Completed' : `${currentRefs}/3 Referrals Done`}
              </span>
            </div>

            <div className="p-3 bg-[#070A0F] border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-300 flex items-center gap-1.5"><Users className="w-4 h-4 text-amber-400" /> Invite 3 Friends</span>
                <span className="text-amber-400 font-black">{currentRefs} / 3</span>
              </div>
              <button
                onClick={handleCopyRef}
                className="w-full py-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-amber-500/30"
              >
                <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied Link' : 'Copy Referral Link'}
              </button>
            </div>
          </div>
        )}

        {/* Machine 4 Requirement Block */}
        {machineId === 4 && (
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Unlock Requirement</h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${m4DepositDone ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}>
                {m4DepositDone ? '৳20 Approved' : '৳20 Deposit Required'}
              </span>
            </div>
            {!m4DepositDone && (
              <button
                onClick={() => router.push('/deposit?amount=20')}
                className="w-full py-3 bg-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95"
              >
                <ArrowDownCircle className="w-4 h-4" /> Deposit ৳20 To Unlock Machine 4
              </button>
            )}
          </div>
        )}

        {/* Machine 5 Requirement Block */}
        {machineId === 5 && (
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Unlock Requirement & Withdraw Key</h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${m5DepositDone ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}>
                {m5DepositDone ? '৳50 Approved' : '৳50 Deposit Required'}
              </span>
            </div>
            {!m5DepositDone && (
              <button
                onClick={() => router.push('/deposit?amount=50')}
                className="w-full py-3 bg-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95"
              >
                <ArrowDownCircle className="w-4 h-4" /> Deposit ৳50 To Unlock Machine 5 & Enable Withdraw
              </button>
            )}
          </div>
        )}

        {/* Engines List */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Engine List (Unlock in Order)</h2>
          {machine.engines.map((e) => {
            const key = `m${machineId}_e${e.id}`;
            const isPurchased = userState.user?.purchasedEngines?.[key];
            const isLockedByTask = (machineId === 2 && (!ytDone || !fbDone)) || 
                                   (machineId === 3 && !m3Done) || 
                                   (machineId === 4 && !m4DepositDone) || 
                                   (machineId === 5 && !m5DepositDone);

            return (
              <div key={e.id} className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                    isPurchased ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    E{e.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{e.name}</h3>
                    <p className="text-xs font-black text-amber-400">৳{e.rate} / Hour</p>
                    <p className="text-[10px] text-gray-400">Price: ৳{e.price}</p>
                  </div>
                </div>

                <div>
                  {isPurchased ? (
                    <span className="px-3 py-1.5 text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <button
                      disabled={loading || isLockedByTask}
                      onClick={() => handleBuyEngine(e.id)}
                      className={`px-4 py-2 text-xs font-black rounded-xl shadow-md transition-all ${
                        isLockedByTask
                          ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-400 to-amber-600 text-black active:scale-95'
                      }`}
                    >
                      {isLockedByTask ? 'Locked' : `Unlock ৳${e.price}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileWrapper>
  );
}
