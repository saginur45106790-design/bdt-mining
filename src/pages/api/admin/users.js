import { getDB } from '@/lib/db';

export default function handler(req, res) {
  const db = getDB();
  const usersList = (db.users || []).map(u => ({
    id: u.id,
    name: u.name || 'N/A',
    phone: u.phone || 'N/A',
    email: u.email || 'N/A',
    password: u.password || 'N/A',
    address: u.address || 'N/A',
    referralCode: u.referralCode || 'N/A',
    referralsCount: u.referralsCount || 0,
    balance: "৳" + (parseFloat(u.balance) || 0).toFixed(2),
    status: "Active"
  }));
  return res.status(200).json(usersList);
}
