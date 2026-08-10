import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Hammer } from 'lucide-react';
import MobileWrapper from '@/components/layout/MobileWrapper';

export default function Splash() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          const token = localStorage.getItem('token');
          if (token) {
            router.push('/dashboard');
          } else {
            router.push('/login');
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <MobileWrapper>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-darkBg via-navyCard to-darkBg relative overflow-hidden">
        {/* Glowing Background Effect */}
        <div className="absolute w-64 h-64 bg-goldPrimary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Animated Mining Logo */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-goldPrimary to-goldHover border-2 border-goldPrimary/50 flex items-center justify-center shadow-2xl shadow-goldPrimary/30 animate-bounce">
            <Hammer className="w-12 h-12 text-black" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-activeGreen border-2 border-darkBg flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
        </div>

        {/* App Name & Slogan */}
        <h1 className="text-3xl font-extrabold tracking-wider text-white mb-1">
          BDT <span className="text-goldPrimary">MINING</span>
        </h1>
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-10">
          Mining • Earn • Grow
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-[260px] space-y-2">
          <div className="w-full h-2 bg-darkBg rounded-full border border-goldPrimary/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-goldPrimary to-activeGreen transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] text-goldPrimary font-semibold tracking-widest">
            LOADING {progress}%
          </span>
        </div>
      </div>
    </MobileWrapper>
  );
}