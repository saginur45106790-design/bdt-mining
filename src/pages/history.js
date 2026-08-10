import React, { useState, useEffect } from 'react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import { History, ShieldAlert, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function HistoryPage() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(d => setList(d || []))
      .catch(() => {});
  }, []);

  const filteredList = list.filter(item => {
    if (filter === 'All') return true;
    return item.type === filter;
  });

  return (
    <MobileWrapper>
      <div className="min-h-screen bg-[#070A0F] text-white p-4 pb-28 max-w-md mx-auto space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-6 h-6 text-amber-400" />
          <h1 className="text-xl font-bold text-amber-400">Transaction History</h1>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {['All', 'Deposit', 'Withdraw', 'Mining'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`py-2 text-xs font-bold rounded-xl border ${filter === t ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-900 border-slate-800 text-gray-400'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {filteredList.length === 0 ? (
          <div className="p-8 text-center bg-[#0F172A] border border-slate-800 rounded-2xl text-gray-400 text-sm space-y-2">
            <ShieldAlert className="w-8 h-8 mx-auto text-amber-400/60" />
            <p>No records found in {filter}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#0F172A] border border-amber-500/20 shadow-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{item.type} ({item.method})</span>
                  </div>
                  <p className="text-xs text-amber-400 font-bold mt-0.5">TrxID: {item.trxId}</p>
                  <p className="text-[10px] text-gray-400">{item.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-amber-400">৳{item.amount}</span>
                  <div className="mt-1">
                    {item.status === 'Approved' && <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-lg inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>}
                    {item.status === 'Pending' && <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>}
                    {item.status === 'Rejected' && <span className="px-2.5 py-1 text-[10px] font-bold bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg inline-flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileWrapper>
  );
}
