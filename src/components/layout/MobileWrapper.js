import React from 'react';
import { useRouter } from 'next/router';
import { Home, Cpu, History, User } from 'lucide-react';

export default function MobileWrapper({ children }) {
  const router = useRouter();
  const current = router.pathname;

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Machines', path: '/machines', icon: Cpu },
    { label: 'History', path: '/history', icon: History },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#070A0F] text-white flex flex-col justify-between max-w-md mx-auto relative border-x border-slate-800 shadow-2xl">
      <div className="flex-1 pb-20">{children}</div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0D121D]/95 backdrop-blur-md border-t border-amber-500/30 py-2 px-4 flex justify-around items-center z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.path || (item.path === '/machines' && current.startsWith('/machines'));
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-amber-400 font-bold scale-105' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
