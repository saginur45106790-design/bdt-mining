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

  const approvedWithdraws = list
    .filter(t => t.type === 'Withdraw' && t.status === 'Approved')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const todayMining = 75.00;
  const availableBalance = approvedDeposits + todayMining - approvedWithdraws;

  return res.status(200).json({
    availableBalance: availableBalance.toFixed(2),
    todayMining: todayMining.toFixed(2),
    totalMining: "0.00",
    totalDeposit: approvedDeposits.toFixed(2),
    totalWithdraw: approvedWithdraws.toFixed(2),
    miningActive: true,
    currentSpeed: 5
  });
}
