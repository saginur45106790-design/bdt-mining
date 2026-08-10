import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'transactions.json');

export default function handler(req, res) {
  let list = [];
  if (fs.existsSync(file)) {
    try { list = JSON.parse(fs.readFileSync(file, 'utf8')); } catch(e){}
  }

  const approvedDeposits = list
    .filter(t => t.type === 'Deposit' && t.status === 'Approved')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const users = [
    {
      id: 1,
      name: "sajib",
      phone: "01836345346",
      balance: "৳" + (approvedDeposits + 75.00).toFixed(2),
      status: "Active",
      joined: "2026-08-10"
    }
  ];

  return res.status(200).json(users);
}
