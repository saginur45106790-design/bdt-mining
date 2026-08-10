import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { ArrowUpCircle, ArrowLeft, Clock, CheckCircle, XCircle, History } from 'lucide-react';

export default function WithdrawPage() {
  const router = useRouter();
  const [method, setMethod] = useState('bKash');
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('200');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    fetch('/api/withdraws')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d); })
      .catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        fetchHistory();
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
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-base rounded-xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all uppercase"
          >
            {loading ? 'Submitting...' : 'Submit Withdraw Request'}
          </button>
        </form>

        <div className="pt-2 space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-amber-400">Withdrawal History</h2>
          </div>

          {history.length === 0 ? (
            <div className="p-4 text-center bg-[#0F172A] border border-slate-800 rounded-xl text-gray-400 text-xs">
              No withdrawal history yet.
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-[#0F172A] border border-amber-500/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{item.method} Withdraw</p>
                    <p className="text-[11px] text-amber-400 font-bold">Acc: {item.trxId}</p>
                    <p className="text-[10px] text-gray-400">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-amber-400">৳{item.amount}</p>
                    <div className="mt-0.5">
                      {item.status === 'Approved' && <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-md inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>}
                      {item.status === 'Pending' && <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-md inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>}
                      {item.status === 'Rejected' && <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 rounded-md inline-flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileWrapper>
  );
}
