import { getDB } from '@/lib/db';

export default function handler(req, res) {
  const db = getDB();
  const usersList = (db.users || []).map(u => ({
    id: u.id,
    name: u.name,
    phone: u.phone,
    balance: "৳" + (parseFloat(u.balance) || 0).toFixed(2),
    status: "Active"
  }));
  return res.status(200).json(usersList);
}
