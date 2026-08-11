import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { MACHINES_CONFIG } from '@/data/config';
import { ArrowLeft, Cpu, Lock, CheckCircle2, Youtube, Facebook, ShieldCheck } from 'lucide-react';

export default function MachineDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [userState, setUserState] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = typeof window !== 'undefined' ? localStorage.getItem('miner_user') : null;
    if (!raw) {
      router.push('/login');
      return;
    }
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
    const user = JSON.parse(raw);
    setLoading(true);

    try {
      const res = await fetch('/api/user/buy-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, machineId, engineId })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchData(user.phone);
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Error unlocking engine');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskName, link) => {
    window.open(link, '_blank');
    const raw = localStorage.getItem('miner_user');
    const user = JSON.parse(raw);

    await fetch('/api/user/complete-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: user.phone, task: taskName })
    });
    fetchData(user.phone);
  };

  return (
    <MobileWrapper>
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
          <p className="text-xs text-gray-400">{machine.unlockCondition}</p>
        </div>

        {machineId === 2 && !userState.m2TasksDone && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-3">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Unlock Requirement Tasks</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleTaskComplete('youtube', settings.youtubeLink || 'https://youtube.com')}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  userState.user?.tasksCompleted?.youtube ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-900/30 border-red-500 text-red-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" /> Subscribe YouTube Channel
                </div>
                <span>{userState.user?.tasksCompleted?.youtube ? '✅ Done' : 'Go Task'}</span>
              </button>

              <button
                onClick={() => handleTaskComplete('facebook', settings.facebookLink || 'https://facebook.com')}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  userState.user?.tasksCompleted?.facebook ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-blue-900/30 border-blue-500 text-blue-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" /> Follow Facebook Page
                </div>
                <span>{userState.user?.tasksCompleted?.facebook ? '✅ Done' : 'Go Task'}</span>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Engine List (Unlock in Order)</h2>
          {machine.engines.map((e) => {
            const key = `m${machineId}_e${e.id}`;
            const isPurchased = userState.user?.purchasedEngines?.[key];

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
                      disabled={loading}
                      onClick={() => handleBuyEngine(e.id)}
                      className="px-4 py-2 text-xs font-black bg-gradient-to-r from-amber-400 to-amber-600 text-black rounded-xl shadow-md active:scale-95"
                    >
                      Unlock ৳{e.price}
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
