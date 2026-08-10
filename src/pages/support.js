import React, { useEffect, useState } from 'react';
import MobileWrapper from '@/components/layout/MobileWrapper';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import GlassCard from '@/components/ui/GlassCard';
import { Headphones, Send, Ticket, HelpCircle, ShieldAlert } from 'lucide-react';

export default function Support() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/support/ticket', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTickets(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit ticket');

      setStatusMsg('SUCCESS: Ticket submitted! Token: ' + data.ticketNumber);
      setSubject('');
      setMessage('');
      setTickets([data, ...tickets]);
    } catch (err) {
      setStatusMsg(`ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileWrapper>
      <Header />
      <main className="flex-1 p-4 space-y-4 pb-20 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <Headphones className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-extrabold text-white">Support & Ticket Desk</h2>
        </div>

        {/* Create Ticket */}
        <GlassCard>
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-amber-400" /> Submit New Ticket
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Subject (e.g. Deposit issue)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full glass-input rounded-xl p-3 text-xs"
              />
            </div>
            <div>
              <textarea
                rows="3"
                placeholder="Explain your problem in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full glass-input rounded-xl p-3 text-xs resize-none"
              />
            </div>

            {statusMsg && (
              <div className="text-[11px] p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/50/30 text-amber-400">
                {statusMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-goldPrimary to-goldHover text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-goldPrimary/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" /> {loading ? 'Submitting...' : 'Send Ticket'}
            </button>
          </form>
        </GlassCard>

        {/* Ticket List */}
        <div>
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">My Support Tickets</h3>
          <div className="space-y-2">
            {tickets.length > 0 ? (
              tickets.map((t) => (
                <GlassCard key={t.id} className="!p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-mono font-bold text-amber-400">{t.ticketNumber}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      t.status === 'REPLIED'
                        ? 'bg-activeGreen/10 border-activeGreen/30 text-activeGreen'
                        : 'bg-amber-500/10 border-amber-500/50/30 text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{t.subject}</h4>
                  <p className="text-[11px] text-gray-400 mt-1">{t.message}</p>
                  {t.reply && (
                    <div className="mt-2 pt-2 border-t border-amber-500/50/15 bg-darkBg/60 p-2 rounded-lg">
                      <span className="text-[10px] font-bold text-activeGreen block">Admin Reply:</span>
                      <p className="text-[11px] text-gray-300">{t.reply}</p>
                    </div>
                  )}
                </GlassCard>
              ))
            ) : (
              <span className="text-xs text-gray-500 block text-center py-4">No support tickets found.</span>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </MobileWrapper>
  );
}