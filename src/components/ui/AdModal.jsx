import React, { useState, useEffect } from 'react';
import { PlayCircle, ShieldCheck, X } from 'lucide-react';
import { triggerAdsterraAd } from '@/utils/adsterra';

export default function AdModal({ isOpen, onClose, onComplete, adUrl }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [adOpened, setAdOpened] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isOpen && adOpened && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isOpen) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isOpen, adOpened, timeLeft]);

  if (!isOpen) return null;

  const handleWatchAd = () => {
    setAdOpened(true);
    triggerAdsterraAd(adUrl);
  };

  const handleConfirm = () => {
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-[360px] bg-navyCard border border-goldPrimary/30 rounded-2xl p-5 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-goldPrimary/10 border border-goldPrimary/30 flex items-center justify-center mx-auto mb-3">
            <PlayCircle className="w-6 h-6 text-goldPrimary" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">Ad Verification Required</h3>
          <p className="text-xs text-gray-300 mb-4">
            Watch advertisement to unlock option & activate machine engine.
          </p>

          {!adOpened ? (
            <button
              onClick={handleWatchAd}
              className="w-full py-3 bg-gradient-to-r from-goldPrimary to-goldHover text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-goldPrimary/20 active:scale-95 transition-all"
            >
              <PlayCircle className="w-4 h-4" /> Watch Sponsor Ad
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-darkBg/80 p-3 rounded-xl border border-goldPrimary/20">
                <span className="text-xs text-gray-400 block mb-1">Verification Progress</span>
                <span className="text-2xl font-bold text-goldPrimary">{timeLeft}s</span>
              </div>

              <button
                disabled={timeLeft > 0}
                onClick={handleConfirm}
                className={`w-full py-3 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all ${
                  timeLeft === 0
                    ? 'bg-activeGreen text-black shadow-lg shadow-activeGreen/20 active:scale-95 cursor-pointer'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {timeLeft === 0 ? 'Confirm & Continue' : `Wait ${timeLeft} seconds...`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}