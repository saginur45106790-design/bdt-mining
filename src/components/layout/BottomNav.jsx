import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Cpu, ArrowDownCircle, History, User } from 'lucide-react';

export default function BottomNav() {
  const router = useRouter();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Machines', path: '/machines', icon: Cpu },
    { name: 'Deposit', path: '/deposit', icon: ArrowDownCircle },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-navyCard/95 backdrop-blur-md border-t border-goldPrimary/20 py-2 px-3 z-40">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.path || (item.path !== '/dashboard' && router.pathname.startsWith(item.path));

          return (
            <Link key={item.name} href={item.path} className="flex-1">
              <div className={`flex flex-col items-center justify-center py-1 transition-all duration-200 ${isActive ? 'text-goldPrimary scale-105' : 'text-gray-400 hover:text-gray-200'}`}>
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-goldPrimary/10 border border-goldPrimary/30' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium mt-1 tracking-wider">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}