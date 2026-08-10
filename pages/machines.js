import React from "react";
import { Cpu, Lock, CheckCircle2 } from "lucide-react";

const list = [
  { id: 1, name: "Machine 1", rate: "৳5 / Hour", desc: "5 / 5 Engine Unlocked", active: true, price: "Free" },
  { id: 2, name: "Machine 2", rate: "৳10 / Hour", desc: "Unlock after completing Machine 1", active: false, price: "৳500" },
  { id: 3, name: "Machine 3", rate: "৳15 / Hour", desc: "Unlock after completing Machine 2", active: false, price: "৳1,500" },
  { id: 4, name: "Machine 4", rate: "৳20 / Hour", desc: "Unlock after completing Machine 3", active: false, price: "৳3,000" },
  { id: 5, name: "Machine 5", rate: "৳50 / Hour", desc: "Unlock after completing Machine 4", active: false, price: "৳5,000" },
];

export default function MachinesPage() {
  return (
    <div className="min-h-screen bg-[#070A0F] text-white p-4 pb-28">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-amber-400 flex items-center gap-2">
          <Cpu className="w-6 h-6 text-amber-400" /> Mining Machines
        </h1>
        <p className="text-xs text-gray-400">Complete each machine to unlock the next</p>
      </div>

      <div className="space-y-4">
        {list.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-gradient-to-b from-[#161C27] to-[#0D121D] border border-amber-500/40 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400">
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{m.name}</h3>
                <p className="text-sm font-extrabold text-amber-400">{m.rate}</p>
                <p className="text-[11px] text-gray-400">{m.desc}</p>
              </div>
            </div>
            <div>
              {m.active ? (
                <span className="px-3 py-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                </span>
              ) : (
                <div className="px-3 py-1.5 text-xs font-bold bg-amber-500 text-black rounded-xl flex items-center gap-1 shadow-md shadow-amber-500/20">
                  <Lock className="w-3.5 h-3.5" /> {m.price}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
