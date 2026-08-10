import React, { useEffect, useState } from 'react';
import { Cpu, Zap, Clock } from 'lucide-react';

export default function MiningStatusCard({ miningRate = 5, isActive = true }) {
  const [timeLeft, setTimeLeft] = useState(3599);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3599));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-navyCard/90 border border-goldPrimary/20 rounded-2xl p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-activeGreen opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-activeGreen"></span>
          </span>
          <span className="text-xs font-bold text-activeGreen uppercase tracking-wider">
            {isActive ? 'Mining Active' : 'Mining Paused'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-400 bg-darkBg/60 px-2.5 py-1 rounded-full border border-goldPrimary/10">
          <Clock className="w-3 h-3 text-goldPrimary" />
          <span>Next Credit: <strong className="text-white">{formatTimer(timeLeft)}</strong></span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-darkBg/90 p-3 rounded-xl border border-goldPrimary/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-goldPrimary/10 border border-goldPrimary/30 flex items-center justify-center text-goldPrimary">
            <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Current Speed</span>
            <span className="text-sm font-extrabold text-white flex items-center gap-1">
              ৳{miningRate} <span className="text-xs text-goldPrimary font-semibold">/ Hour</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-goldPrimary/10 text-goldPrimary px-3 py-1.5 rounded-lg border border-goldPrimary/20 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 fill-goldPrimary" />
          <span>Live Engine</span>
        </div>
      </div>
    </div>
  );
}