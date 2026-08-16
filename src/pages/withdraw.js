import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import Toast from '@/components/ui/Toast';
import { ArrowUpCircle, ArrowLeft, Lock, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';

export default function WithdrawPage() {
  const router = useRouter();
  const [method, setMethod] = useState('bKash');
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('50');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('miner_user') : null;
    if (raw) {
      const user = JSON.parse(raw);
      fetch(`/api/user/state?phone=${user.phone}`)
        .then(r => r.json())
        .then(d => setUserState(d))
        .catch(() => {});
    }
  }, []);

  const realAmount = parseFloat(amount) || 0;
  const miningDeduction = realAmount * 10000;
  const availableBal = parseFloat(userState?.availableBalance) || 0;
  const isEnabled = !!userState?.withdrawEnabled;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEnabled) {
      setToast({ type: 'error', message: '❌ Withdrawal locked! You must unlock all 3 engines of Machine 5 to enable withdrawal.' });
      return;
    }

    if (realAmount < 50) {
      setToast({ type: 'error', message: 'Minimum withdrawal is ৳50 Real BDT' });
      return;
    }

    if (availableBal < miningDeduction) {
      setToast({ type: 'error', message: `Insufficient mining balance! Need ৳${miningDeduction.toLocaleString()}` });
      return;
    }

    if (!accountNo) {
      setToast({ type: 'error', message: 'Please enter your wallet account number' });
      return;
    }

    const raw = localStorage.getItem('miner_user');
    const user = raw ? JSON.parse(raw) : {};

    setLoading(true);

    try {
      const res = await fetch('/api/withdraws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, accountNo, amount: realAmount, userPhone: user.phone })
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: data.message });
        setAccountNo('');
        // Refresh balance
        fetch(`/api/user/state?phone=${user.phone}`).then(r=>r.json()).then(d=>setUserState(d));
      } else {
        setToast({ type: 'error', message: data.message || 'Withdrawal failed' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Server Connection Error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileWrapper>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="min-h-screen bg-[#070A0F] text-white p-4 pb-28 max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/dashboard')} className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black text-amber-400 flex items-center gap-2">
              <ArrowUpCircle className="w-6 h-6" /> Withdraw Money
            </h1>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
            Mining: ৳{availableBal.toLocaleString()}
          </span>
        </div>

        {/* Withdrawal Lock/Unlock Banner */}
        {!isEnabled ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-rose-400 uppercase">
              <Lock className="w-4 h-4 text-rose-400" /> Withdrawal System Locked
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Notice: Complete all engines of <b>Machine 5</b> to permanently unlock withdrawal payouts!
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-400 uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Withdrawal Enabled (Machine 5 Unlocked)
            </div>
            <p className="text-xs text-gray-300">
              Formula: <b>10,000 Mining Balance = ৳1 Real BDT</b> | Min: <b>৳50</b>
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {['bKash', 'Nagad', 'Rocket'].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`py-3 rounded-xl font-bold text-xs border transition-all ${method === m ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-400'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[#0F172A] p-4 rounded-2xl border border-amber-500/30 shadow-xl">
          <div>
            <label className="text-xs font-bold text-gray-300 mb-1 block">{method} Wallet Number</label>
            <input
              type="text"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              placeholder="017XXXXXXXX"
              required
              className="w-full p-3.5 bg-[#070A0F] border border-slate-700 rounded-xl text-sm font-bold text-amber-400 outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 mb-1 block">Real BDT Amount to Withdraw (৳)</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {['50', '100', '200', '500'].map((val) => (
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
              min="50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3.5 bg-[#070A0F] border border-slate-700 rounded-xl text-base font-black text-amber-400 outline-none"
            />
          </div>

          {/* Mathematical Preview Box */}
          <div className="p-3.5 bg-[#070A0F] border border-amber-500/30 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-gray-300">
              <span>You Will Receive:</span>
              <span className="font-extrabold text-emerald-400 text-sm">৳{realAmount} Real BDT</span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Deducted from Mining Balance:</span>
              <span className="font-bold text-amber-400">৳{miningDeduction.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isEnabled}
            className={`w-full py-4 text-black font-black text-base rounded-xl shadow-xl transition-all uppercase ${
              isEnabled
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-amber-500/20 active:scale-95'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            }`}
          >
            {isEnabled ? (loading ? 'Processing...' : 'Submit Withdraw Request') : 'Withdrawal Locked (Unlock Machine 5)'}
          </button>
        </form>
      </div>
    </MobileWrapper>
  );
}
