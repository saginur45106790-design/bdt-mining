import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, Settings, LogOut, Hammer } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Deposits', path: '/admin/deposits', icon: ArrowDownCircle },
    { name: 'Withdrawals', path: '/admin/withdrawals', icon: ArrowUpCircle },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-navyCard border-b md:border-b-0 md:border-r border-goldPrimary/20 p-4 shrink-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-goldPrimary/20 border border-goldPrimary/40 flex items-center justify-center text-goldPrimary">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider text-white">BDT MINING</h1>
            <span className="text-[10px] text-goldPrimary font-semibold uppercase">Admin Panel</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;
            return (
              <Link key={item.name} href={item.path}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-goldPrimary text-black font-bold shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-darkBg/60'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-lockedRed hover:bg-lockedRed/10 transition-all mt-6"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Admin Body */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}