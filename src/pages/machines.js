import React from "react";
import MobileWrapper from "@/components/layout/MobileWrapper";
import { Cpu, Lock } from "lucide-react";

const list = [
  { id: 1, name: "Machine 1", speed: "৳5 / Hour", desc: "5 / 5 Engine Unlocked", active: true },
  { id: 2, name: "Machine 2", speed: "৳10 / Hour", desc: "Unlock after completing Machine 1", active: false },
  { id: 3, name: "Machine 3", speed: "৳15 / Hour", desc: "Unlock after completing Machine 2", active: false },
  { id: 4, name: "Machine 4", speed: "৳20 / Hour", desc: "Unlock after completing Machine 3", active: false },
  { id: 5, name: "Machine 5", speed: "৳50 / Hour", desc: "Unlock after completing Machine 4", active: false },
];

export default function MachinesPage() {
  return (
    <MobileWrapper>
      <div className="p-4 space-y-4 pb-24 bg-[#0a0e17] min-h-screen text-white">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-400" /> Mining Machines
          </h1>
          <p className="text-xs text-gray-400">Complete each machine to unlock next</p>
        </div>

        {list.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-gradient-to-b from-[#1e2638] to-[#111827] border border-amber-500/30 shadow-lg shadow-amber-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{m.name}</h3>
                <p className="text-sm font-semibold text-amber-400">{m.speed}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
              </div>
            </div>
            <div>
              {m.active ? (
                <span className="px-3 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">Unlocked</span>
              ) : (
                <div className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-gray-800 text-gray-400 border border-gray-700 rounded-full">
                  <span>Locked</span>
                  <Lock className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </MobileWrapper>
  );
}
