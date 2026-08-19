import { getDB } from '@/lib/db';

export default function handler(req, res) {
  const { phone } = req.query;
  const db = getDB();
  const user = db.users.find(u => u.phone === phone);
  
  if (!user) return res.status(404).json({ message: "User not found" });

  const totalApprovedWithdraw = (db.transactions || [])
    .filter(t => t.userPhone === phone && t.type === 'Withdraw' && t.status === 'Approved')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  res.status(200).json({
    ...user,
    totalWithdraw: totalApprovedWithdraw
  });
}
