import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => onClose(), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-11/12 max-w-sm animate-bounce-in">
      <div className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 ${
        isSuccess 
          ? 'bg-[#0D1B1E]/95 border-emerald-500/60 text-emerald-300 shadow-emerald-500/20' 
          : 'bg-[#1C0D0D]/95 border-rose-500/60 text-rose-300 shadow-rose-500/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${isSuccess ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'}`}>
            {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider">{isSuccess ? 'SUCCESS' : 'NOTICE'}</h4>
            <p className="text-xs font-bold text-white mt-0.5">{toast.message}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
