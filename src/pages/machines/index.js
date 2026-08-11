import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { MACHINES_CONFIG } from '@/data/config';
import { Cpu, Lock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function MachinesListPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = typeof window !== 'undefined' ? localStorage.getItem('miner_user') : null;
    if (!raw) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(raw);
    fetch(`/api/user/state?phone=${user.phone}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, [router]);

  if (!mounted || !data) return <div className="p-8 text-center text-amber-400 font-bold">Loading Mining Rigs...</div>;

  return (
    <MobileWrapper>
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-slate-900 border border-amber-500/40">
          <h1 className="text-xl font-extrabold text-amber-400 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-400" /> Mining Machines Overview
          </h1>
        </div>

        <div className="space-y-3">
          {MACHINES_CONFIG.map((m) => {
            const isAccessible = data?.machineAccess?.[m.id];

            return (
              <div
                key={m.id}
                onClick={() => {
                  if (isAccessible) {
                    router.push(`/machines/${m.id}`);
                  } else {
                    alert(`Machine ${m.id} is Locked! Complete previous engines to enter.`);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  isAccessible
                    ? 'bg-[#0F172A] border-amber-500/40 hover:border-amber-400 shadow-lg'
                    : 'bg-[#0A0E17]/80 border-slate-800 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border ${
                    isAccessible ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-gray-600'
                  }`}>
                    M{m.id}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{m.name}</h3>
                    <p className="text-xs font-bold text-amber-400">{m.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAccessible ? (
                    <span className="px-3 py-1 text-[11px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enter
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-[11px] font-bold bg-slate-800 border border-slate-700 text-gray-400 rounded-xl flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileWrapper>
  );
}
