import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function WalletCard({ stats }) {
  const {
    balance = '0.00',
    todayMining = '0.00',
    totalMiningIncome = '0.00',
    totalDeposit = '0.00',
    totalWithdrawal = '0.00',
  } = stats || {};

  return (
    <div className="bg-gradient-to-br from-navyCard to-darkBg border border-goldPrimary/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-goldPrimary/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Balance */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            Total Available Balance
          </span>
          <h2 className="text-3xl font-extrabold text-goldPrimary tracking-tight mt-1">
            ৳{parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="w-10 h-10 rounded-xl bg-goldPrimary/10 border border-goldPrimary/30 flex items-center justify-center text-goldPrimary shadow-inner">
          <Wallet className="w-5 h-5" />
        </div>
      </div>

      {/* Today Mining Badge */}
      <div className="bg-darkBg/80 border border-goldPrimary/20 rounded-xl p-2.5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-activeGreen animate-bounce" />
          <span className="text-xs text-gray-300 font-medium">Today's Mining Income</span>
        </div>
        <span className="text-xs font-bold text-activeGreen">
          +৳{parseFloat(todayMining).toFixed(2)}
        </span>
      </div>

      {/* Sub Stats Grid */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-goldPrimary/15 text-center">
        <div>
          <span className="text-[10px] text-gray-400 block mb-0.5">Total Mining</span>
          <span className="text-xs font-bold text-white">৳{parseFloat(totalMiningIncome).toFixed(0)}</span>
        </div>
        <div className="border-x border-goldPrimary/15">
          <span className="text-[10px] text-gray-400 block mb-0.5">Total Deposit</span>
          <span className="text-xs font-bold text-activeGreen flex items-center justify-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" />৳{parseFloat(totalDeposit).toFixed(0)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 block mb-0.5">Total Withdraw</span>
          <span className="text-xs font-bold text-statusPurple flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />৳{parseFloat(totalWithdrawal).toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
}