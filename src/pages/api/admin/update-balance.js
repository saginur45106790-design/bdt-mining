import { getDB, saveDB } from '@/lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone, balance } = req.body;
  const db = getDB();

  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.customBalance = parseFloat(balance) || 0;
  saveDB(db);

  return res.status(200).json({ success: true, message: 'Balance updated successfully!' });
}
