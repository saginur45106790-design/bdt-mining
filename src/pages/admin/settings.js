import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import GlassCard from '@/components/ui/GlassCard';
import { Save, Settings as SettingsIcon } from 'lucide-react';

export default function AdminSettings() {
  const [bkashNumber, setBkashNumber] = useState('');
  const [nagadNumber, setNagadNumber] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [adsterraDirectLink, setAdsterraDirectLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.bkashNumber) setBkashNumber(data.bkashNumber);
        if (data.nagadNumber) setNagadNumber(data.nagadNumber);
        if (data.youtubeLink) setYoutubeLink(data.youtubeLink);
        if (data.facebookLink) setFacebookLink(data.facebookLink);
        if (data.adsterraDirectLink) setAdsterraDirectLink(data.adsterraDirectLink);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bkashNumber,
          nagadNumber,
          youtubeLink,
          facebookLink,
          adsterraDirectLink,
        }),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setMsg('Settings updated successfully!');
    } catch (err) {
      setMsg('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-goldPrimary" />
          <h2 className="text-lg font-bold text-white">Global Settings & Links</h2>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">bKash Personal Number</label>
                <input
                  type="text"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Nagad Personal Number</label>
                <input
                  type="text"
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">YouTube Channel Link (Task)</label>
                <input
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 text-xs"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Facebook Page Link (Task)</label>
                <input
                  type="text"
                  value={facebookLink}
                  onChange={(e) => setFacebookLink(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 text-xs"
                />
              </div>

              <div>
                <label className="text-goldPrimary block mb-1 font-semibold">Adsterra Direct Link (Ads trigger)</label>
                <input
                  type="text"
                  value={adsterraDirectLink}
                  onChange={(e) => setAdsterraDirectLink(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 text-xs"
                />
              </div>
            </div>

            {msg && (
              <div className="p-3 rounded-xl bg-goldPrimary/10 border border-goldPrimary/30 text-goldPrimary font-bold text-center">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-goldPrimary to-goldHover text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save All Settings'}
            </button>
          </form>
        </GlassCard>
      </div>
    </AdminLayout>
  );
}