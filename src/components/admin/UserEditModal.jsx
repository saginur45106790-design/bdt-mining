import React, { useState } from 'react';
import { X, Save, ShieldAlert } from 'lucide-react';

export default function UserEditModal({ user, onClose, onSave }) {
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [balance, setBalance] = useState(user?.balance || '0.00');
  const [isSuspended, setIsSuspended] = useState(user?.isSuspended || false);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        userId: user.id,
        fullName,
        phone,
        email,
        balance,
        isSuspended,
      });
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-navyCard border border-goldPrimary/30 rounded-2xl p-5 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-white mb-4">Edit User Account</h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-gray-300 block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full glass-input rounded-xl p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Mobile Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full glass-input rounded-xl p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@gmail.com"
              className="w-full glass-input rounded-xl p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="text-goldPrimary font-bold block mb-1">Adjust Wallet Balance (৳)</label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
              className="w-full glass-input rounded-xl p-2.5 text-xs font-bold text-goldPrimary"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="suspend"
              checked={isSuspended}
              onChange={(e) => setIsSuspended(e.target.checked)}
              className="w-4 h-4 rounded accent-lockedRed"
            />
            <label htmlFor="suspend" className="text-lockedRed font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Suspend This User Account
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-goldPrimary to-goldHover text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all mt-4"
          >
            <Save className="w-4 h-4" /> {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}