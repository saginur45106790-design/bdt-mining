import React, { useEffect, useState } from 'react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import GlassCard from '@/components/ui/GlassCard';
import { History as HistoryIcon, ArrowDownRight, ArrowUpRight, Cpu, Gift, ShieldAlert } from 'lucide-react';

export default function History() {
  const [activeTab, setActiveTab] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/user/history', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTransactions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredData = transactions.filter((item) => {
    if (activeTab === 'mining') return item.type === 'MINING_REWARD';
    if (activeTab === 'deposit') return item.type === 'DEPOSIT';
    if (activeTab === 'withdraw') return item.type === 'WITHDRAW';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'MINING_REWARD': return <Cpu className="w-4 h-4 text-amber-400" />;
      case 'DEPOSIT': return <ArrowDownRight className="w-4 h-4 text-activeGreen" />;
      case 'WITHDRAW': return <ArrowUpRight className="w-4 h-4 text-statusPurple" />;
      default: return <Gift className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <MobileWrapper>
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-extrabold text-white">Transaction History</h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 bg-navyCard p-1 rounded-xl border border-amber-500/50/15 text-xs">
          {['all', 'mining', 'deposit', 'withdraw'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="text-center py-8 text-xs text-gray-400">Loading transactions...</div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <GlassCard key={item.id} className="!p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-darkBg border border-amber-500/50/20 flex items-center justify-center">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{item.description}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(item.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-extrabold block ${
                      item.amount > 0 ? 'text-activeGreen' : 'text-lockedRed'
                    }`}>
                      {item.amount > 0 ? '+' : ''}৳{parseFloat(item.amount).toFixed(2)}
                    </span>
                    <span className="text-[9px] bg-activeGreen/10 border border-activeGreen/30 text-activeGreen px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Completed ✓
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-12">
              <ShieldAlert className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span className="text-xs text-gray-500 block">No history records found.</span>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </MobileWrapper>
  );
}