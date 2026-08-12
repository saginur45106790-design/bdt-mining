import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import Toast from '@/components/ui/Toast';
import { ArrowDownCircle, Copy, CheckCircle2, History, Clock, CheckCircle, XCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function DepositPage() {
  const router = useRouter();
  const [method, setMethod] = useState('bKash');
  const [amount, setAmount] = useState('20');
  const [trxId, setTrxId] = useState('');
  const [settings, setSettings] = useState({ bkashNumber: '01700000000', nagadNumber: '01800000000' });
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    if (router.query.amount) {
      setAmount(router.query.amount);
    }
    fetchSettings();
    fetchUserData();
  }, [router.query]);

  const fetchUserData = () => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('miner_user') : null;
    if (raw) {
      const user = JSON.parse(raw);
      fetch(`/api/user/state?phone=${user.phone}`)
        .then(r => r.json())
        .then(d => {
          if (d) setUserState(d);
        })
        .catch(() => {});

      fetch('/api/history')
        .then(r => r.json())
        .then(d => {
          if (Array.isArray(d)) {
            setHistory(d.filter(item => item.type === 'Deposit' && item.userPhone === user.phone));
          }
        })
        .catch(() => {});
    }
  };

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d) setSettings(d); })
      .catch(() => {});
  };

  const handleCopy = () => {
    const num = method === 'bKash' ? settings.bkashNumber : settings.nagadNumber;
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const raw = localStorage.getItem('miner_user');
    const user = raw ? JSON.parse(raw) : {};

    if (!trxId) {
      setToast({ type: 'error', message: 'Please enter Transaction ID (TrxID)' });
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, amount, trxId, userPhone: user.phone })
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', message: '✅ Deposit request submitted! Pending admin approval.' });
        setTrxId('');
        fetchUserData();
      } else {
        setToast({ type: 'error', message: 'Failed to submit deposit request.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Connection Error.' });
    } finally {
      setLoading(false);
    }
  };

  const currentNumber = method === 'bKash' ? settings.bkashNumber : settings.nagadNumber;
  const isCompleted = userState?.allDepositsCompleted;

  return (
    <MobileWrapper>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="min-h-screen bg-[#070A0F] text-white p-4 pb-28 max-w-md mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/dashboard')} className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black text-amber-400 flex items-center gap-2">
              <ArrowDownCircle className="w-6 h-6" /> Deposit Balance
            </h1>
          </div>
        </div>

        {isCompleted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-2 shadow-xl">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-base font-extrabold text-emerald-400">All Required Machine Deposits Approved!</h2>
            <p className="text-xs text-gray-300">You have completed ৳20 (Machine 4) and ৳50 (Machine 5) deposits. Deposit form is now hidden.</p>
          </div>
        ) : (
          <>
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
                <label className="text-xs font-bold text-gray-300 mb-2 block">Required Machine Deposit Amount (৳)</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setAmount('20')}
                    className={`py-3 rounded-xl text-xs font-extrabold border ${amount === '20' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}
                  >
                    ৳20 (For Machine 4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount('50')}
                    className={`py-3 rounded-xl text-xs font-extrabold border ${amount === '50' ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-700 text-gray-300'}`}
                  >
                    ৳50 (For Machine 5)
                  </button>
                </div>
                <input
                  type="number"
                  value={amount}
                  readOnly
                  className="w-full p-3.5 bg-[#0F172A] border border-amber-500/40 rounded-xl text-base font-extrabold text-amber-400 outline-none"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-base rounded-xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all uppercase tracking-wide"
              >
                {loading ? 'Submitting...' : 'Submit Deposit Request'}
              </button>
            </form>
          </>
        )}

        {/* Live Deposit History at Bottom */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-amber-400">Recent Deposit History</h2>
          </div>

          {history.length === 0 ? (
            <div className="p-4 text-center bg-[#0F172A] border border-slate-800 rounded-xl text-gray-400 text-xs">
              No deposit requests yet.
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-[#0F172A] border border-amber-500/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{item.method} Deposit (৳{item.amount})</p>
                    <p className="text-[11px] text-amber-400 font-bold">TrxID: {item.trxId}</p>
                    <p className="text-[10px] text-gray-400">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-400">৳{item.amount}</span>
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
