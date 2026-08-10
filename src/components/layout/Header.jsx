import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Hammer } from 'lucide-react';

export default function Header({ unreadCount = 0 }) {
  const [balance, setBalance] = useState('0.00');

  useEffect(() => {
    fetch('/api/user/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.balance) {
          setBalance(data.balance);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-navyCard/90 backdrop-blur-md border-b border-amber-500/50/15 px-4 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-goldPrimary/20 to-goldPrimary/5 border border-amber-500/50/40 flex items-center justify-center shadow-lg shadow-goldPrimary/10">
          <Hammer className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-wider text-white leading-tight">
            BDT <span className="text-amber-400">MINING</span>
          </h1>
          <p className="text-[9px] text-gray-400 tracking-widest uppercase">Cloud Platform</p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <div className="bg-darkBg/80 px-3 py-1 rounded-full border border-amber-500/50/20 text-xs font-semibold text-amber-400">
          ৳{parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        
        <Link href="/support" className="relative p-2 rounded-xl bg-darkBg/60 border border-amber-500/50/20 text-gray-300 hover:text-amber-400 transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-lockedRed text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}