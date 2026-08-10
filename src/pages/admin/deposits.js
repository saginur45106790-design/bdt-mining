import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([]);

  const fetchDeposits = () => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/deposits', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDeposits(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem('adminToken');
    await fetch('/api/admin/deposit-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ depositId: id, action }),
    });
    fetchDeposits();
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Deposit Requests Review</h2>

        <div className="bg-navyCard border border-goldPrimary/20 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-goldPrimary/15 bg-darkBg/60 text-gray-400 uppercase text-[10px]">
                <th className="p-3">User</th>
                <th className="p-3">Method</th>
                <th className="p-3">TrxID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goldPrimary/10">
              {deposits.map((d) => (
                <tr key={d.id}>
                  <td className="p-3 font-semibold text-white">{d.user?.fullName} ({d.user?.phone})</td>
                  <td className="p-3 font-bold">{d.paymentMethod}</td>
                  <td className="p-3 font-mono text-goldPrimary font-bold">{d.trxId}</td>
                  <td className="p-3 font-extrabold text-activeGreen">৳{parseFloat(d.amount).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      d.status === 'APPROVED' ? 'bg-activeGreen/10 text-activeGreen' : d.status === 'REJECTED' ? 'bg-lockedRed/10 text-lockedRed' : 'bg-goldPrimary/10 text-goldPrimary'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    {d.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAction(d.id, 'APPROVE')}
                          className="bg-activeGreen text-black font-bold p-1.5 rounded-lg flex items-center gap-1 text-[10px]"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(d.id, 'REJECT')}
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