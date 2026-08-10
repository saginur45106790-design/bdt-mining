import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import WalletCard from '@/components/dashboard/WalletCard';
import MiningStatusCard from '@/components/dashboard/MiningStatusCard';
import QuickActions from '@/components/dashboard/QuickActions';
import GlassCard from '@/components/ui/GlassCard';
import { Cpu, CheckCircle2, Lock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/user/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]);

  if (loading) {
    return (
      <MobileWrapper>
        <div className="flex-1 flex items-center justify-center bg-darkBg text-amber-400 font-bold">
          Loading Dashboard...
        </div>
      </MobileWrapper>
    );
  }

  const { stats, currentMiningRate, machineProgress, recentActivities } = data || {};

  return (
    <MobileWrapper>
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20 overflow-y-auto no-scrollbar">
        {/* Wallet Section */}
        <WalletCard stats={stats} />

        {/* Mining Live Status */}
        <MiningStatusCard miningRate={currentMiningRate || 5} isActive={true} />

        {/* Quick Action Buttons */}
        <QuickActions />

        {/* Machine Progress Overview */}
        <GlassCard>
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" /> Machine Progress Overview
          </h3>
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {[1, 2, 3, 4, 5].map((level) => {
              const isUnlocked = machineProgress?.[level]?.isUnlocked;
              return (
                <div
                  key={level}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                    isUnlocked
                      ? 'bg-activeGreen/10 border-activeGreen/30 text-activeGreen'
                      : 'bg-darkBg/80 border-gray-800 text-gray-500'
                  }`}
                >
                  <span className="text-[10px] font-bold">M{level}</span>
                  {isUnlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Recent Activity List */}
        <GlassCard>
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Recent Activity</h3>
          <div className="space-y-2.5">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-darkBg/80 p-2.5 rounded-xl border border-amber-500/50/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        act.amount > 0
                          ? 'bg-activeGreen/10 text-activeGreen border border-activeGreen/30'
                          : 'bg-lockedRed/10 text-lockedRed border border-lockedRed/30'
                      }`}
                    >
                      {act.amount > 0 ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">{act.description}</span>
                      <span className="text-[9px] text-gray-400">
                        {new Date(act.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      act.amount > 0 ? 'text-activeGreen' : 'text-gray-300'
                    }`}
                  >
                    {act.amount > 0 ? '+' : ''}৳{parseFloat(act.amount).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-gray-500 block text-center py-2">No recent activity found.</span>
            )}
          </div>
        </GlassCard>
      </main>
      <BottomNav />
    </MobileWrapper>
  );
}