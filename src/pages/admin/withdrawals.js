import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);

  const fetchWithdrawals = () => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/withdrawals', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWithdrawals(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem('adminToken');
    await fetch('/api/admin/withdraw-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ withdrawId: id, action }),
    });
    fetchWithdrawals();
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Withdrawal Requests Review</h2>

        <div className="bg-navyCard border border-goldPrimary/20 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-goldPrimary/15 bg-darkBg/60 text-gray-400 uppercase text-[10px]">
                <th className="p-3">User</th>
                <th className="p-3">Method</th>
                <th className="p-3">Account Number</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goldPrimary/10">
              {withdrawals.map((w) => (
                <tr key={w.id}>
                  <td className="p-3 font-semibold text-white">{w.user?.fullName}</td>
                  <td className="p-3 font-bold">{w.paymentMethod}</td>
                  <td className="p-3 font-mono text-goldPrimary font-bold">{w.accountNumber}</td>
                  <td className="p-3 font-extrabold text-statusPurple">৳{parseFloat(w.amount).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      w.status === 'APPROVED' ? 'bg-activeGreen/10 text-activeGreen' : w.status === 'REJECTED' ? 'bg-lockedRed/10 text-lockedRed' : 'bg-goldPrimary/10 text-goldPrimary'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    {w.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAction(w.id, 'APPROVE')}
                          className="bg-activeGreen text-black font-bold p-1.5 rounded-lg flex items-center gap-1 text-[10px]"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(w.id, 'REJECT')}
                          className="bg-lockedRed/20 text-lockedRed border border-lockedRed/40 font-bold p-1.5 rounded-lg flex items-center gap-1 text-[10px]"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}