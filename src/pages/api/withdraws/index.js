import { getDB, saveDB } from '@/lib/db';

export default function handler(req, res) {
  const db = getDB();
  if (!Array.isArray(db.transactions)) db.transactions = [];

  if (req.method === 'POST') {
    const { method, accountNo, amount, userPhone } = req.body;
    const user = db.users.find(u => u.phone === userPhone);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount!' });
    }

    if ((user.availableBalance || 0) < withdrawAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance!' });
    }

    // ব্যালেন্স স্থায়ীভাবে কেটে নেওয়া
    user.availableBalance -= withdrawAmount;

    const newTx = {
      id: 'WX-' + Date.now(),
      type: 'Withdraw',
      method: method || 'Bkash/Nagad',
      amount: withdrawAmount,
      trxId: accountNo || '',
      userPhone: user.phone,
      status: 'Pending',
      date: new Date().toISOString()
    };

    db.transactions.unshift(newTx);
    saveDB(db);

    return res.status(200).json({ success: true, message: 'Withdrawal request submitted!' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.transactions.filter(t => t.type === 'Withdraw'));
  }
}
