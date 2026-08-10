import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import GlassCard from '@/components/ui/GlassCard';
import { Users, ArrowDownCircle, ArrowUpCircle, Cpu } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: '0.00',
    pendingDeposits: 0,
    totalWithdrawals: '0.00',
    pendingWithdrawals: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.totalUsers !== undefined) setStats(data);
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
    { label: 'Total Deposit Volume', value: `৳${stats.totalDeposits}`, icon: ArrowDownCircle, color: 'text-activeGreen' },
    { label: 'Pending Deposits', value: stats.pendingDeposits, icon: ArrowDownCircle, color: 'text-amber-400' },
    { label: 'Total Withdrawals', value: `৳${stats.totalWithdrawals}`, icon: ArrowUpCircle, color: 'text-statusPurple' },
    { label: 'Pending Withdrawals', value: stats.pendingWithdrawals, icon: ArrowUpCircle, color: 'text-lockedRed' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white">Platform Overview & Analytics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <GlassCard key={c.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">{c.label}</span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">{c.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl bg-darkBg border border-amber-500/50/20 ${c.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}