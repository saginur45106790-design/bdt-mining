import { getDB, saveDB } from '@/lib/db';

export default function handler(req, res) {
  const db = getDB();
  if (!Array.isArray(db.transactions)) db.transactions = [];

  if (req.method === 'GET') {
    return res.status(200).json(db.transactions.filter(t => t.type === 'Withdraw'));
  }

  if (req.method === 'POST') {
    const { id, action } = req.body;
    db.transactions = db.transactions.map(t => {
      if (t.id === id) {
        return { ...t, status: action === 'approve' ? 'Approved' : 'Rejected' };
      }
      return t;
    });
    saveDB(db);
    return res.status(200).json({ success: true });
  }
}
