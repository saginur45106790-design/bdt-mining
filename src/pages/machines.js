import React from "react";

export default function MachinesPage() {
  const list = [
    { id: 1, name: "Machine 1 - Basic Miner", rate: "৳5 / Hour", desc: "Engine 1-5 Unlocked", active: true, price: "Free", bg: "from-emerald-500 via-teal-500 to-cyan-500" },
    { id: 2, name: "Machine 2 - Silver Rig", rate: "৳10 / Hour", desc: "Unlock after Machine 1", active: false, price: "৳500", bg: "from-amber-400 via-orange-500 to-yellow-500" },
    { id: 3, name: "Machine 3 - Gold Turbo", rate: "৳15 / Hour", desc: "Unlock after Machine 2", active: false, price: "৳1,500", bg: "from-blue-500 via-indigo-500 to-purple-600" },
    { id: 4, name: "Machine 4 - Platinum Node", rate: "৳20 / Hour", desc: "Unlock after Machine 3", active: false, price: "৳3,000", bg: "from-fuchsia-500 via-pink-600 to-rose-600" },
    { id: 5, name: "Machine 5 - Quantum Server", rate: "৳50 / Hour", desc: "Unlock after Machine 4", active: false, price: "৳5,000", bg: "from-violet-600 via-purple-600 to-indigo-700" }
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-white p-4 pb-28 max-w-md mx-auto">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/80 via-indigo-900/60 to-slate-900 border border-purple-500/40 shadow-xl mb-6">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500">
          ⚡ Mining Machines Setup
        </h1>
        <p className="text-xs text-cyan-300 mt-1">Activate higher grade machines to multiply hourly profit!</p>
      </div>

      <div className="space-y-4">
        {list.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl flex items-center justify-between relative overflow-hidden">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.bg} flex items-center justify-center text-white font-extrabold text-lg shadow-lg`}>
                M{m.id}
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{m.name}</h3>
                <p className="text-sm font-black text-amber-400">{m.rate}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
              </div>
            </div>
            <div>
              {m.active ? (
                <span className="px-3 py-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-xl">
                  Unlocked
                </span>
              ) : (
                <button className={`px-4 py-2 text-xs font-black text-black bg-gradient-to-r ${m.bg} rounded-xl shadow-lg`}>
                  Unlock {m.price}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
