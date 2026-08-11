import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, Settings, LogOut, Save, CheckCircle, XCircle, Edit3 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('users');
  const [deposits, setDeposits] = useState([]);
  const [withdraws, setWithdraws] = useState([]);
  const [users, setUsers] = useState([]);
  const [editBalance, setEditBalance] = useState({});
  const [settings, setSettings] = useState({ bkashNumber: '', nagadNumber: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => setSettings(d || {})).catch(()=>{});
    fetch('/api/admin/deposits').then(r => r.json()).then(d => setDeposits(d || [])).catch(()=>{});
    fetch('/api/admin/withdraws').then(r => r.json()).then(d => setWithdraws(d || [])).catch(()=>{});
    fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(d || [])).catch(()=>{});
  };

  const handleUpdateBalance = async (phone) => {
    const balance = editBalance[phone];
    if (balance === undefined) return;

    try {
      const res = await fetch('/api/admin/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, balance })
      });
      if (res.ok) {
        alert(`✅ Balance updated to ৳${balance} for ${phone}`);
        fetchAllData();
      }
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#060911] text-white p-4 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between p-4 bg-[#0F172A] border border-amber-500/30 rounded-2xl mb-6 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-amber-400">BDT MINING ADMIN</h1>
          <p className="text-xs text-gray-400">Control Panel</p>
        </div>
        <button onClick={() => { localStorage.removeItem('adminToken'); router.push('/admin/login'); }} className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 border border-red-500/40 rounded-xl flex items-center gap-1">
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <button onClick={() => setTab('users')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 justify-center ${tab==='users' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <Users className="w-4 h-4" /> Users ({users.length})
        </button>
        <button onClick={() => setTab('deposits')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 justify-center ${tab==='deposits' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <ArrowDownCircle className="w-4 h-4" /> Deposits
        </button>
        <button onClick={() => setTab('withdrawals')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 justify-center ${tab==='withdrawals' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <ArrowUpCircle className="w-4 h-4" /> Withdrawals
        </button>
        <button onClick={() => setTab('settings')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 justify-center ${tab==='settings' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <Settings className="w-4 h-4" /> Settings
        </button>
      </div>

      {tab === 'users' && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">Registered Users List & Balance Editor</h2>
          {users.map((u) => (
            <div key={u.id} className="p-4 bg-[#0F172A] border border-amber-500/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-white">{u.name} ({u.phone})</p>
                  <p className="text-xs text-amber-400 font-bold">Current Balance: {u.balance}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg">
                  {u.status}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="number"
                  placeholder="Set New Balance (৳)"
                  value={editBalance[u.phone] || ''}
                  onChange={(e) => setEditBalance({ ...editBalance, [u.phone]: e.target.value })}
                  className="px-3 py-2 bg-[#060911] border border-slate-700 rounded-xl text-xs text-amber-400 font-bold outline-none flex-1"
                />
                <button
                  onClick={() => handleUpdateBalance(u.phone)}
                  className="px-3 py-2 bg-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Save Balance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
