import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'transactions.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { method, amount, trxId, userPhone } = req.body;
    let list = [];
    if (fs.existsSync(file)) {
      list = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
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
    list.unshift(newTx);
    fs.writeFileSync(file, JSON.stringify(list, null, 2));
    return res.status(200).json({ success: true, message: 'Deposit request submitted!' });
  }
  return res.status(405).end();
}
