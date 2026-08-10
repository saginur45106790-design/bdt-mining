import React from 'react';
import { Cpu, Zap, Lock, CheckCircle2 } from 'lucide-react';

export default function EngineItem({ engine, isPurchased, isLocked, onBuy }) {
  return (
    <div className={`bg-darkBg/90 border rounded-xl p-3.5 flex items-center justify-between transition-all ${
      isPurchased ? 'border-activeGreen/40' : isLocked ? 'border-gray-800 opacity-60' : 'border-goldPrimary/30'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          isPurchased ? 'bg-activeGreen/10 border border-activeGreen/30 text-activeGreen' : 'bg-goldPrimary/10 border border-goldPrimary/30 text-goldPrimary'
        }`}>
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">{engine.name}</h4>
          <span className="text-[10px] text-goldPrimary font-semibold flex items-center gap-0.5 mt-0.5">
            <Zap className="w-3 h-3 fill-goldPrimary" /> ৳{engine.rate} / Hour
          </span>
        </div>
      </div>

      <div>
        {isPurchased ? (
          <span className="bg-activeGreen/10 border border-activeGreen/30 text-activeGreen text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        ) : isLocked ? (
          <span className="bg-gray-800 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        ) : (
          <button
            onClick={() => onBuy(engine)}
            className="bg-gradient-to-r from-goldPrimary to-goldHover text-black text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-md shadow-goldPrimary/10 active:scale-95 transition-all"
          >
            Buy ৳{engine.price}
          </button>
        )}
      </div>
    </div>
  );
}