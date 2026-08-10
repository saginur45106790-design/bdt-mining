import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MobileWrapper from '@/components/layout/MobileWrapper';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import EngineItem from '@/components/machines/EngineItem';
import AdModal from '@/components/ui/AdModal';
import { MACHINES_DATA } from '@/utils/constants';
import { Cpu, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function MachineDetail() {
  const router = useRouter();
  const { id } = router.query;
  const machineLevel = parseInt(id) || 1;

  const machine = MACHINES_DATA.find((m) => m.level === machineLevel) || MACHINES_DATA[0];
  const [purchasedEngines, setPurchasedEngines] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [adUrl, setAdUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`/api/machines/engines?level=${machineLevel}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.purchasedEngineIds) setPurchasedEngines(data.purchasedEngineIds);
      })
      .catch(() => {});

    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.adsterraDirectLink) setAdUrl(data.adsterraDirectLink);
      })
      .catch(() => {});
  }, [machineLevel]);

  const handleBuyClick = (engine) => {
    setSelectedEngine(engine);
    setIsAdOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedEngine) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/machines/engine-buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ engineId: selectedEngine.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to buy engine');

      setPurchasedEngines([...purchasedEngines, selectedEngine.id]);
      alert(`Success! ${selectedEngine.name} activated.`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <MobileWrapper>
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20 overflow-y-auto no-scrollbar">
        <button onClick={() => router.push('/machines')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Machines
        </button>

        <div className="bg-gradient-to-br from-navyCard to-darkBg border border-amber-500/50/30 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/50/30 flex items-center justify-center text-amber-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">{machine.name}</h2>
              <span className="text-xs text-amber-400 font-semibold">
                Total Output: ৳{machine.engines.reduce((acc, curr) => acc + curr.rate, 0)} / Hour
              </span>
            </div>
          </div>
        </div>

        {/* Engine List */}
        <div className="space-y-2.5">
          {machine.engines.map((engine, idx) => {
            const isPurchased = purchasedEngines.includes(engine.id);
            const isPrevCompleted = idx === 0 || purchasedEngines.includes(machine.engines[idx - 1].id);
            const isLocked = !isPurchased && !isPrevCompleted;

            return (
              <EngineItem
                key={engine.id}
                engine={engine}
                isPurchased={isPurchased}
                isLocked={isLocked}
                onBuy={handleBuyClick}
              />
            );
          })}
        </div>

        <AdModal
          isOpen={isAdOpen}
          onClose={() => setIsAdOpen(false)}
          onComplete={handleConfirmPurchase}
          adUrl={adUrl}
        />
      </main>
      <BottomNav />
    </MobileWrapper>
  );
}