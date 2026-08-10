import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Settings, Users, ArrowDownCircle, ArrowUpCircle, LogOut, Save } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('settings');
  const [settings, setSettings] = useState({
    bkashNumber: '',
    nagadNumber: '',
    youtubeLink: '',
    facebookLink: '',
    adsterraLink: ''
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data);
    } catch (e) {}
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    setMsg('Saving settings...');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMsg('✅ All settings saved & live on user app!');
      } else {
        setMsg('❌ Failed to save settings');
      }
    } catch (e) {
      setMsg('❌ Error updating settings');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#060911] text-white p-4 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between p-4 bg-[#0F172A] border border-amber-500/30 rounded-2xl mb-6 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-amber-400">BDT MINING ADMIN</h1>
          <p className="text-xs text-gray-400">Control Panel</p>
        </div>
        <button onClick={logout} className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 border border-red-500/40 rounded-xl flex items-center gap-1">
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button onClick={() => setTab('settings')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center ${tab==='settings' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <Settings className="w-4 h-4" /> Settings
        </button>
        <button onClick={() => setTab('deposits')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center ${tab==='deposits' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <ArrowDownCircle className="w-4 h-4" /> Deposits
        </button>
        <button onClick={() => setTab('withdrawals')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center ${tab==='withdrawals' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <ArrowUpCircle className="w-4 h-4" /> Withdrawals
        </button>
        <button onClick={() => setTab('users')} className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center ${tab==='users' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}>
          <Users className="w-4 h-4" /> Users
        </button>
      </div>

      {tab === 'settings' && (
        <div className="p-5 bg-[#0F172A] border border-amber-500/30 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Global Settings & Payment Links
          </h2>
          {msg && <div className="p-3 text-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl">{msg}</div>}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-300 mb-1 block">bKash Personal Number</label>
                <input
                  type="text"
                  value={settings.bkashNumber || ''}
                  onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full p-3 bg-[#060911] border border-slate-700 rounded-xl text-sm text-amber-400 font-bold outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-300 mb-1 block">Nagad Personal Number</label>
                <input
                  type="text"
                  value={settings.nagadNumber || ''}
                  onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                  placeholder="018XXXXXXXX"
                  className="w-full p-3 bg-[#060911] border border-slate-700 rounded-xl text-sm text-amber-400 font-bold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">YouTube Channel Link (Task)</label>
              <input
                type="text"
                value={settings.youtubeLink || ''}
                onChange={(e) => setSettings({ ...settings, youtubeLink: e.target.value })}
                className="w-full p-3 bg-[#060911] border border-slate-700 rounded-xl text-sm text-gray-200 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Facebook Page Link (Task)</label>
              <input
                type="text"
                value={settings.facebookLink || ''}
                onChange={(e) => setSettings({ ...settings, facebookLink: e.target.value })}
                className="w-full p-3 bg-[#060911] border border-slate-700 rounded-xl text-sm text-gray-200 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Adsterra Direct Link (Ads trigger)</label>
              <input
                type="text"
                value={settings.adsterraLink || ''}
                onChange={(e) => setSettings({ ...settings, adsterraLink: e.target.value })}
                className="w-full p-3 bg-[#060911] border border-slate-700 rounded-xl text-sm text-gray-200 outline-none"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save All Settings
            </button>
          </form>
        </div>
      )}

      {tab !== 'settings' && (
        <div className="p-8 text-center bg-[#0F172A] border border-slate-800 rounded-2xl text-gray-400 text-sm">
          No pending requests in {tab} queue right now.
        </div>
      )}
    </div>
  );
}
