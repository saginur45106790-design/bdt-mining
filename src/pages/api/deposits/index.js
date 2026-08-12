import { getDB, saveDB } from '@/lib/db';

export default function handler(req, res) {
  const db = getDB();
  if (!Array.isArray(db.transactions)) db.transactions = [];

  if (req.method === 'POST') {
    const { method, amount, trxId, userPhone } = req.body || {};

    const newTx = {
      id: 'TX-' + Date.now(),
      type: 'Deposit',
      method: method || 'bKash',
      amount: parseFloat(amount) || 0,
      trxId: trxId || 'N/A',
      userPhone: userPhone || '01836345346',
      status: 'Pending',
      date: new Date().toLocaleString()
    };

    db.transactions.unshift(newTx);
    saveDB(db);

    return res.status(200).json({ success: true, message: 'Deposit request submitted successfully!' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.transactions.filter(t => t.type === 'Deposit'));
  }

  return res.status(405).end();
}
