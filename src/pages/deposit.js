import React, { useEffect, useState } from 'react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import GlassCard from '@/components/ui/GlassCard';
import { ArrowDownCircle, Copy, Check, ShieldAlert } from 'lucide-react';

export default function Deposit() {
  const [method, setMethod] = useState('bKash');
  const [amount, setAmount] = useState('500');
  const [trxId, setTrxId] = useState('');
  const [settings, setSettings] = useState({ bkashNumber: '01700000000', nagadNumber: '01800000000' });
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const presetAmounts = ['20', '50', '100', '500', '1000'];

  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.bkashNumber) setSettings(data);
      })
      .catch(() => {});
  }, []);

  const activeNumber = method === 'bKash' ? settings.bkashNumber : settings.nagadNumber;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!trxId || !amount) {
      return setMessage('Please enter Amount and Transaction ID');
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/deposit/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, paymentMethod: method, trxId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit deposit');

      setMessage('SUCCESS: Deposit request submitted! Pending approval.');
      setTrxId('');
    } catch (err) {
      setMessage(`ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileWrapper>
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <ArrowDownCircle className="w-5 h-5 text-activeGreen" />
          <h2 className="text-base font-extrabold text-white">Deposit Balance</h2>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMethod('bKash')}
            className={`p-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-all ${
              method === 'bKash'
                ? 'bg-pink-600/20 border-pink-500 text-pink-400 shadow-lg'
                : 'bg-navyCard border-gray-800 text-gray-400'
            }`}
          >
            bKash Send Money
          </button>
          <button
            type="button"
            onClick={() => setMethod('Nagad')}
            className={`p-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-all ${
              method === 'Nagad'
                ? 'bg-orange-600/20 border-orange-500 text-orange-400 shadow-lg'
                : 'bg-navyCard border-gray-800 text-gray-400'
            }`}
          >
            Nagad Send Money
          </button>
        </div>

        {/* Payment Number Card */}
        <GlassCard>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
            Send Money To ({method})
          </span>
          <div className="bg-darkBg/90 p-3 rounded-xl border border-amber-500/50/20 flex items-center justify-between">
            <span className="text-lg font-mono font-bold text-amber-400">{activeNumber}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="bg-amber-500/10 border border-amber-500/50/30 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </GlassCard>

        {/* Amount Selector */}
        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-2">Select or Enter Amount (৳)</label>
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  amount === amt
                    ? 'bg-amber-500 text-black border-amber-500/50'
                    : 'bg-navyCard border-amber-500/50/15 text-gray-300'
                }`}
              >
                ৳{amt}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Custom Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full glass-input rounded-xl p-3 text-sm font-bold text-amber-400"
          />
        </div>

        {/* Deposit Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Transaction ID (TrxID)</label>
            <input
              type="text"
              placeholder="e.g. 8N7A6D5C"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              required
              className="w-full glass-input rounded-xl p-3 text-sm font-mono tracking-wider text-white uppercase"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                message.startsWith('SUCCESS')
                  ? 'bg-activeGreen/10 border border-activeGreen/30 text-activeGreen'
                  : 'bg-lockedRed/10 border border-lockedRed/30 text-lockedRed'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-goldPrimary to-goldHover text-black font-bold text-sm rounded-xl shadow-lg shadow-goldPrimary/20 active:scale-95 transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Deposit Request'}
          </button>
        </form>
      </main>
      <BottomNav />
    </MobileWrapper>
  );
}