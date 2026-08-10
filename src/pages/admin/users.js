import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserEditModal from '@/components/admin/UserEditModal';
import { Edit, Search, UserX, UserCheck } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (updatedData) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error('Failed to update user');
    fetchUsers();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">User Management</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input rounded-xl py-2 pl-9 pr-3 text-xs"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-navyCard border border-amber-500/50/20 rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-amber-500/50/15 bg-darkBg/60 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="p-3">User</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Balance</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goldPrimary/10">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-darkBg/40 transition-colors">
                  <td className="p-3 font-semibold text-white">{u.fullName}</td>
                  <td className="p-3 font-mono text-gray-300">{u.phone}</td>
                  <td className="p-3 font-bold text-amber-400">৳{parseFloat(u.balance).toFixed(2)}</td>
                  <td className="p-3">
                    {u.isSuspended ? (
                      <span className="bg-lockedRed/10 text-lockedRed px-2 py-0.5 rounded-full border border-lockedRed/30 text-[9px] font-bold">
                        Suspended
                      </span>
                    ) : (
                      <span className="bg-activeGreen/10 text-activeGreen px-2 py-0.5 rounded-full border border-activeGreen/30 text-[9px] font-bold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="bg-amber-500/10 border border-amber-500/50/30 text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/20 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <UserEditModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
        />
      </div>
    </AdminLayout>
  );
}