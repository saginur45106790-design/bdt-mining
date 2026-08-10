import React from 'react';
import Link from 'next/link';
import { ArrowDownCircle, ArrowUpCircle, Cpu, Users } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { label: 'Deposit', icon: ArrowDownCircle, path: '/deposit', color: 'text-activeGreen border-activeGreen/30' },
    { label: 'Withdraw', icon: ArrowUpCircle, path: '/history', color: 'text-statusPurple border-statusPurple/30' },
    { label: 'Machines', icon: Cpu, path: '/machines', color: 'text-amber-400 border-amber-500/50/30' },
    { label: 'Referral', icon: Users, path: '/profile', color: 'text-blue-400 border-blue-400/30' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.label} href={item.path}>
            <div className="bg-navyCard/70 border border-amber-500/50/15 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 hover:border-amber-500/50/40 transition-all active:scale-95">
              <div className={`p-2 rounded-lg bg-darkBg/80 border ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-gray-200">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}