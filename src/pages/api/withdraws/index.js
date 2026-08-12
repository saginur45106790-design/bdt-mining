import { getDB, saveDB } from '@/lib/db';

export default function handler(req, res) {
  const db = getDB();
  if (!Array.isArray(db.transactions)) db.transactions = [];

  if (req.method === 'POST') {
    const { method, accountNo, amount, userPhone } = req.body || {};
    
    if (!accountNo || !amount) {
      return res.status(400).json({ success: false, message: 'Account number and amount required' });
    }

    const newTx = {
      id: 'WX-' + Date.now(),
      type: 'Withdraw',
      method: method || 'bKash',
      amount: parseFloat(amount) || 0,
      trxId: accountNo,
      userPhone: userPhone || '01836345346',
      status: 'Pending',
      date: new Date().toLocaleString()
    };

    db.transactions.unshift(newTx);
    saveDB(db);

    return res.status(200).json({ success: true, message: 'Withdraw request submitted successfully!' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.transactions.filter(t => t.type === 'Withdraw'));
  }

  return res.status(405).end();
}
