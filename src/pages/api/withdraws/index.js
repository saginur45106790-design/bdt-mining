import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'transactions.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { method, accountNo, amount } = req.body;
    let list = [];
    if (fs.existsSync(file)) {
      try { list = JSON.parse(fs.readFileSync(file, 'utf8')); } catch(e){}
    }
    const newTx = {
      id: 'WX-' + Date.now(),
      type: 'Withdraw',
      method: method || 'bKash',
      amount: parseFloat(amount) || 0,
      trxId: accountNo || 'N/A',
      userPhone: '01836345346',
      status: 'Pending',
      date: new Date().toLocaleString()
    };
    list.unshift(newTx);
    fs.writeFileSync(file, JSON.stringify(list, null, 2));
    return res.status(200).json({ success: true, message: 'Withdraw request submitted!' });
  }

  if (req.method === 'GET') {
    let list = [];
    if (fs.existsSync(file)) {
      try { list = JSON.parse(fs.readFileSync(file, 'utf8')); } catch(e){}
    }
    return res.status(200).json(list.filter(t => t.type === 'Withdraw'));
  }

  return res.status(405).end();
}
