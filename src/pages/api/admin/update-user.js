import { getDB, saveDB } from '@/lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone, balance, customMining, customWithdraw } = req.body;
  const db = getDB();

  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ success: false, message: 'User account not found!' });

  if (balance !== undefined && balance !== '') user.balance = parseFloat(balance) || 0;
  if (customMining !== undefined && customMining !== '') user.customMining = parseFloat(customMining) || 0;
  if (customWithdraw !== undefined && customWithdraw !== '') user.customWithdraw = parseFloat(customWithdraw) || 0;

  saveDB(db);

  return res.status(200).json({ success: true, message: `User data updated successfully for ${phone}!` });
}
