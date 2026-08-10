import React from 'react';
import Link from 'next/link';
import { Cpu, Lock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function MachineCard({ machine, userProgress }) {
  const { id, level, name, engines } = machine;
  const activeEnginesCount = userProgress?.activeEnginesCount || 0;
  const isUnlocked = userProgress?.isUnlocked || false;
  const totalEngines = engines.length;
  const progressPercent = Math.round((activeEnginesCount / totalEngines) * 100);

  return (
    <div className={`bg-navyCard border rounded-2xl p-4 relative overflow-hidden transition-all ${isUnlocked ? 'border-amber-500/50/30' : 'border-gray-800 opacity-80'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-amber-500/10 border border-amber-500/50/30 text-amber-400' : 'bg-gray-800 text-gray-500'}`}>
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Machine {level}</h3>
            <span className="text-[10px] text-gray-400">{name}</span>
          </div>
        </div>

        {isUnlocked ? (
          <span className="bg-activeGreen/10 border border-activeGreen/30 text-activeGreen text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Unlocked
          </span>
        ) : (
          <span className="bg-lockedRed/10 border border-lockedRed/30 text-lockedRed text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
          <span>Engines Active</span>
          <span className="font-bold text-white">{activeEnginesCount}/{totalEngines} ({progressPercent}%)</span>
        </div>
        <div className="w-full h-2 bg-darkBg rounded-full overflow-hidden border border-amber-500/50/10">
          <div className="h-full bg-gradient-to-r from-goldPrimary to-activeGreen transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <Link href={isUnlocked ? `/machines/${level}` : '#'}>
        <button
          disabled={!isUnlocked}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
            isUnlocked
              ? 'bg-gradient-to-r from-goldPrimary to-goldHover text-black shadow-lg shadow-goldPrimary/10 active:scale-95'
              : 'bg-darkBg/80 text-gray-500 border border-gray-800 cursor-not-allowed'
          }`}
        >
          {isUnlocked ? (
            <>View Engines <ChevronRight className="w-3.5 h-3.5" /></>
          ) : (
            <>🔒 Machine Locked</>
          )}
        </button>
      </Link>
    </div>
  );
}