import React from 'react';

export default function MobileWrapper({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0e17] flex justify-center items-center">
      <div className="w-full max-w-[430px] min-h-screen bg-darkBg text-white relative shadow-2xl overflow-x-hidden flex flex-col border-x border-amber-500/50/10">
        {children}
      </div>
    </div>
  );
}