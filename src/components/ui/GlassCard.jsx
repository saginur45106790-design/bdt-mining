import React from 'react';

export default function GlassCard({ children, className = '', onClick = null }) {
  return (
    <div
      onClick={onClick}
      className={`bg-navyCard/80 backdrop-blur-md border border-amber-500/50/20 rounded-2xl p-4 shadow-xl shadow-black/40 relative overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
      {children}
    </div>
  );
}