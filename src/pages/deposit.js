import React, { useState, useEffect } from 'react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { ArrowDownCircle, Copy, CheckCircle2 } from 'lucide-react';

export default function DepositPage() {
  const [method, setMethod] = useState('bKash');
  const [amount, setAmount] = useState('500');
  const [trxId, setTrxId] = useState('');
  const [settings, setSettings] = useState({ bkashNumber: '01700000000', nagadNumber: '01800000000' });
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d) setSettings(d); })
      .catch(() => {});
  }, []);

  const handleCopy = () => {
    const num = method === 'bKash' ? settings.bkashNumber : settings.nagadNumber;
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trxId) {
      setStatusMsg('❌ Please enter Transaction ID (TrxID)');
      return;
    }
    setLoading(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, amount, trxId })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('✅ SUCCESS: Deposit request submitted! Pending approval.');
        setTrxId('');
      } else {
        setStatusMsg('❌ Failed to submit deposit request.');
      }
    } catch (err) {
      setStatusMsg('❌ Server Connection Error.');
    } finally {
      setLoading(false);
    }
  };

  const currentNumber = method === 'bKash' ? settings.bkashNumber : settings.nagadNumber;

  return (
    <MobileWrapper>
      <div className="min-h-screen bg-[#070A0F] text-white p-4 pb-28 max-w-md mx-auto space-y-5">
        <div className="flex items-center gap-2">
          <ArrowDownCircle className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-black text-amber-400">Deposit Balance</h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod('bKash')}
            className={`py-3 rounded-xl font-bold text-xs border transition-all ${method === 'bKash' ? 'bg-pink-900/40 border-pink-500 text-pink-300' : 'bg-slate-900 border-slate-700 text-gray-400'}`}
          >
            bKash Send Money
          </button>
          <button
            onClick={() => setMethod('Nagad')}
            className={`py-3 rounded-xl font-bold text-xs border transition-all ${method === 'Nagad' ? 'bg-orange-900/40 border-orange-500 text-orange-300' : 'bg-slate-900 border-slate-700 text-gray-400'}`}
          >
            Nagad Send Money
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/30 space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase">SEND MONEY TO ({method})</p>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#070A0F] border border-slate-800">
            <span className="text-lg font-black text-amber-400 tracking-wider">{currentNumber}</span>
            <button onClick={handleCopy} className="px-3 py-1.5 text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg flex items-center gap-1">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 mb-1 block">Select or Enter Amount (৳)</label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {['20', '50', '100', '500', '1000'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-2 rounded-xl text-xs font-bold border ${amount === val ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}
                >
                  ৳{val}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3.5 bg-[#0F172A] border border-amber-500/40 rounded-xl text-base font-extrabold text-amber-400 outline-none"
              placeholder="Amount"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 mb-1 block">Transaction ID (TrxID)</label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="E.G. 8N7A6D5C"
              required
              className="w-full p-3.5 bg-[#0F172A] border border-amber-500/50 rounded-xl text-sm font-bold text-white placeholder-gray-500 focus:border-amber-400 outline-none"
            />
          </div>

          {statusMsg && (
            <div className="p-3 text-xs bg-slate-900 border border-amber-500/40 text-amber-300 rounded-xl text-center font-bold">
              {statusMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-base rounded-xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all uppercase tracking-wide"
          >
            {loading ? 'Submitting...' : 'Submit Deposit Request'}
          </button>
        </form>
      </div>
    </MobileWrapper>
  );
}
