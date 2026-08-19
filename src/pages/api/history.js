import { getDB } from '@/lib/db';

export default function handler(req, res) {
  const { phone } = req.query;
  const db = getDB();
  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(200).json([]);

  const history = (db.transactions || [])
    .filter(t => t.userPhone === phone)
    .map(t => ({
      ...t,
      title: t.title || `${t.method || t.type} Record`,
      subText: t.subText || `Status: ${t.status || 'Processed'}`,
      amount: t.amount ? (t.type === 'Withdraw' ? `-৳${t.amount}` : `+৳${t.amount}`) : '৳0'
    }));

  res.status(200).json(history.sort((a,b) => new Date(b.date) - new Date(a.date)));
}
