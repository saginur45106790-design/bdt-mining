import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Toast from '@/components/ui/Toast';
import { LayoutDashboard, Users, ArrowDownCircle, ArrowUpCircle, Settings, LogOut, Save, CheckCircle, XCircle, Edit3, Mail, Lock, MapPin, Key, Share2 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('users');
  const [deposits, setDeposits] = useState([]);
  const [withdraws, setWithdraws] = useState([]);
  const [users, setUsers] = useState([]);
  const [editBalance, setEditBalance] = useState({});
  const [settings, setSettings] = useState({ bkashNumber: '', nagadNumber: '' });
  const [toast, setToast] = useState(null);

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
    fetch('/api/admin/deposits').then(r => r.json()).then(d => setDeposits(Array.isArray(d) ? d : [])).catch(()=>{});
    fetch('/api/admin/withdraws').then(r => r.json()).then(d => setWithdraws(Array.isArray(d) ? d : [])).catch(()=>{});
    fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : [])).catch(()=>{});
  };

  const handleUpdateBalance = async (phone) => {
    const balance = editBalance[phone];
    if (balance === undefined || balance === '') {
      setToast({ type: 'error', message: 'Please enter a valid balance amount' });
      return;
    }

    try {
      const res = await fetch('/api/admin/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, balance })
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ type: 'success', message: data.message });
        fetchAllData();
      } else {
        setToast({ type: 'error', message: data.message });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Server connection error' });
    }
  };

  const handleDepositAction = async (id, action) => {
    try {
      const res = await fetch('/api/admin/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      if (res.ok) {
        setToast({ type: 'success', message: `Deposit ${action}d successfully!` });
        fetchAllData();
      }
    } catch (e) {}
  };

  const handleWithdrawAction = async (id, action) => {
    try {
      const res = await fetch('/api/admin/withdraws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      if (res.ok) {
        setToast({ type: 'success', message: `Withdrawal ${action}d successfully!` });
        fetchAllData();
      }
    } catch (e) {}
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) setToast({ type: 'success', message: 'All settings saved live!' });
    } catch (e) {
      setToast({ type: 'error', message: 'Failed to save settings' });
    }
  };

  const pendingDeposits = deposits.filter(d => d.status === 'Pending');
  const pendingWithdraws = withdraws.filter(w => w.status === 'Pending');

  return (
    <div className="min-h-screen bg-[#060911] text-white p-4 max-w-4xl mx-auto pb-20">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="flex items-center justify-between p-4 bg-[#0F172A] border border-amber-500/30 rounded-2xl mb-6 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-amber-400">BDT MINING ADMIN</h1>
          <p className="text-xs text-gray-400">Control Panel</p>
        </div>
        <button onClick={() => { localStorage.removeItem('adminToken'); router.push('/admin/login'); }} className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 border border-red-500/40 rounded-xl flex items-center gap-1 font-bold">
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <button onClick={() => setTab('dashboard')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 justify-center ${tab==='dashboard' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>
        <button onClick={() => setTab('users')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 justify-center ${tab==='users' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <Users className="w-4 h-4" /> Users ({users.length})
        </button>
        <button onClick={() => setTab('deposits')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 justify-center ${tab==='deposits' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <ArrowDownCircle className="w-4 h-4" /> Deposits ({pendingDeposits.length})
        </button>
        <button onClick={() => setTab('withdrawals')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 justify-center ${tab==='withdrawals' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <ArrowUpCircle className="w-4 h-4" /> Withdraws ({pendingWithdraws.length})
        </button>
        <button onClick={() => setTab('settings')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 justify-center ${tab==='settings' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <Settings className="w-4 h-4" /> Settings
        </button>
      </div>

      {tab === 'dashboard' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#0F172A] border border-amber-500/30 rounded-2xl">
            <p className="text-xs text-gray-400">Total Users</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{users.length}</p>
          </div>
          <div className="p-4 bg-[#0F172A] border border-amber-500/30 rounded-2xl">
            <p className="text-xs text-gray-400">Pending Deposits</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendingDeposits.length}</p>
          </div>
          <div className="p-4 bg-[#0F172A] border border-amber-500/30 rounded-2xl">
            <p className="text-xs text-gray-400">Pending Withdrawals</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendingWithdraws.length}</p>
          </div>
          <div className="p-4 bg-[#0F172A] border border-amber-500/30 rounded-2xl">
            <p className="text-xs text-gray-400">Total Transactions</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{deposits.length + withdraws.length}</p>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-amber-400">Registered Users Complete Details ({users.length})</h2>
          {users.map((u) => (
            <div key={u.id} className="p-5 bg-[#0F172A] border border-amber-500/30 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="font-extrabold text-base text-white">{u.name}</h3>
                  <p className="text-xs text-amber-400 font-bold">Phone: {u.phone}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg">
                    {u.status}
                  </span>
                  <p className="text-xs font-black text-amber-400 mt-1">{u.balance}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> Gmail: <span className="font-bold text-white">{u.email}</span></p>
                <p className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> Password: <span className="font-bold text-amber-300">{u.password}</span></p>
                <p className="flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5 text-amber-400" /> Ref Code: <span className="font-bold text-amber-400">{u.referralCode} ({u.referralsCount} Refs)</span></p>
                <p className="flex items-center gap-1.5 col-span-1 md:col-span-2"><MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Address/GPS: <span className="font-bold text-cyan-300 break-all">{u.address}</span></p>
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
                  className="px-4 py-2 bg-amber-500 text-black font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Save Balance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'deposits' && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">Deposit Requests Queue</h2>
          {deposits.length === 0 ? (
            <div className="p-8 text-center bg-[#0F172A] rounded-2xl text-gray-400 text-sm">No deposit requests found.</div>
          ) : (
            deposits.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{item.method} - ৳{item.amount}</p>
                  <p className="text-xs text-amber-400 font-bold">TrxID: {item.trxId}</p>
                  <p className="text-[10px] text-gray-400">{item.date}</p>
                </div>
                <div>
                  {item.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleDepositAction(item.id, 'approve')} className="px-3 py-1.5 text-xs font-bold bg-emerald-500 text-black rounded-lg flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => handleDepositAction(item.id, 'reject')} className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg ${item.status==='Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'withdrawals' && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">Withdrawal Requests Queue</h2>
          {withdraws.length === 0 ? (
            <div className="p-8 text-center bg-[#0F172A] rounded-2xl text-gray-400 text-sm">No withdrawal requests found.</div>
          ) : (
            withdraws.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{item.method} - ৳{item.amount}</p>
                  <p className="text-xs text-amber-400 font-bold">Acc No: {item.trxId}</p>
                  <p className="text-[10px] text-gray-400">{item.date}</p>
                </div>
                <div>
                  {item.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleWithdrawAction(item.id, 'approve')} className="px-3 py-1.5 text-xs font-bold bg-emerald-500 text-black rounded-lg flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => handleWithdrawAction(item.id, 'reject')} className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg ${item.status==='Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'}`}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="p-5 bg-[#0F172A] border border-amber-500/30 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-amber-400">Global Settings</h2>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 mb-1 block">bKash Personal Number</label>
                <input type="text" value={settings.bkashNumber || ''} onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })} className="w-full p-3 bg-[#060911] border border-slate-700 rounded-xl text-sm text-amber-400 font-bold outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-300 mb-1 block">Nagad Personal Number</label>
                <input type="text" value={settings.nagadNumber || ''} onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })} className="w-full p-3 bg-[#060911] border border-slate-700 rounded-xl text-sm text-amber-400 font-bold outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 bg-amber-500 text-black font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
