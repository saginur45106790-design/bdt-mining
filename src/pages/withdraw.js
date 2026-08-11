import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { ArrowUpCircle, ArrowLeft, Lock } from 'lucide-react';

export default function WithdrawPage() {
  const router = useRouter();
  const [method, setMethod] = useState('bKash');
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('200');
  const [statusMsg, setStatusMsg] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userState?.withdrawEnabled) {
      alert("❌ Withdrawal is locked! Unlock Machine 5 to enable withdrawal.");
      return;
    }

    if (!accountNo) {
      setStatusMsg('❌ Please enter your account number');
      return;
    }
    setLoading(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/withdraws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, accountNo, amount })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('✅ Withdraw request submitted! Pending approval.');
        setAccountNo('');
      } else {
        setStatusMsg('❌ Failed to submit request.');
      }
    } catch (err) {
      setStatusMsg('❌ Server Connection Error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileWrapper>
      <div className="min-h-screen bg-[#070A0F] text-white p-4 pb-28 max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/dashboard')} className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black text-amber-400 flex items-center gap-2">
              <ArrowUpCircle className="w-6 h-6" /> Withdraw Money
            </h1>
          </div>
        </div>

        {!userState?.withdrawEnabled && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-400 uppercase">
              <Lock className="w-4 h-4 text-amber-400" /> Withdrawal Disabled (Locked)
            </div>
            <p className="text-xs text-gray-300">
              Notice: You must unlock Machine 5 to enable withdrawal payouts!
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {['bKash', 'Nagad', 'Rocket'].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`py-3 rounded-xl font-bold text-xs border ${method === m ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-400'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-[#0F172A] p-4 rounded-2xl border border-amber-500/30 shadow-xl">
          <div>
            <label className="text-xs font-bold text-gray-300 mb-1 block">{method} Account Number</label>
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
            <label className="text-xs font-bold text-gray-300 mb-1 block">Withdraw Amount (৳)</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {['100', '200', '500', '1000'].map((val) => (
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
              className="w-full p-3.5 bg-[#070A0F] border border-slate-700 rounded-xl text-base font-black text-amber-400 outline-none"
            />
          </div>

          {statusMsg && (
            <div className="p-3 text-xs bg-slate-900 border border-amber-500/40 text-amber-300 rounded-xl text-center font-bold">
              {statusMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !userState?.withdrawEnabled}
            className={`w-full py-4 text-black font-black text-base rounded-xl shadow-xl transition-all uppercase ${
              userState?.withdrawEnabled
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-amber-500/20 active:scale-95'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {userState?.withdrawEnabled ? (loading ? 'Submitting...' : 'Submit Withdraw Request') : 'Withdrawal Disabled (Unlock Machine 5)'}
          </button>
        </form>
      </div>
    </MobileWrapper>
  );
}
