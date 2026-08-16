import { getDB, saveDB } from '@/lib/db';
import { MACHINES_CONFIG } from '@/data/config';

export default function handler(req, res) {
  const db = getDB();
  if (!Array.isArray(db.transactions)) db.transactions = [];

  if (req.method === 'POST') {
    const { method, accountNo, amount, userPhone } = req.body || {};
    
    if (!accountNo || !amount) {
      return res.status(400).json({ success: false, message: 'Account number and amount required' });
    }

    const realAmount = parseFloat(amount) || 0;
    if (realAmount < 50) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ৳50 Real BDT' });
    }

    const user = db.users.find(u => u.phone === userPhone);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    // Machine 5 Unlocked Check (All 3 engines must be unlocked)
    const m5Unlocked = [1, 2, 3].every(id => user.purchasedEngines?.[`m5_e${id}`]);
    if (!m5Unlocked) {
      return res.status(400).json({ 
        success: false, 
        message: 'Withdrawal locked! You must unlock all engines of Machine 5 first.' 
      });
    }

    // Calculate Available Mining Balance
    let currentHourlyRate = 0;
    MACHINES_CONFIG.forEach(m => {
      m.engines.forEach(e => {
        const key = `m${m.id}_e${e.id}`;
        if (user.purchasedEngines && user.purchasedEngines[key]) {
          currentHourlyRate += e.rate;
        }
      });
    });

    const createdTime = new Date(user.createdAt || Date.now()).getTime();
    const hoursElapsed = Math.max(0, (Date.now() - createdTime) / (1000 * 60 * 60));
    const liveMiningIncome = (currentHourlyRate * hoursElapsed);

    const userWithdraws = db.transactions.filter(t => t.userPhone === user.phone && t.type === 'Withdraw');
    const totalMiningDeducted = userWithdraws.reduce((sum, t) => sum + (parseFloat(t.miningDeducted) || (parseFloat(t.amount) * 10000)), 0);

    const availableMiningBalance = (parseFloat(user.balance) || 0) + liveMiningIncome - totalMiningDeducted;
    const requiredMiningBalance = realAmount * 10000;

    if (availableMiningBalance < requiredMiningBalance) {
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient Mining Balance! ৳${realAmount} Real BDT requires ৳${requiredMiningBalance.toLocaleString()} Mining Balance.` 
      });
    }

    const newTx = {
      id: 'WX-' + Date.now(),
      type: 'Withdraw',
      method: method || 'bKash',
      amount: realAmount,
      miningDeducted: requiredMiningBalance,
      trxId: accountNo,
      userPhone: user.phone,
      status: 'Pending',
      date: new Date().toLocaleString()
    };

    db.transactions.unshift(newTx);
    saveDB(db);

    return res.status(200).json({ 
      success: true, 
      message: `✅ Withdraw request of ৳${realAmount} submitted! (৳${requiredMiningBalance.toLocaleString()} deducted from Mining Balance)` 
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.transactions.filter(t => t.type === 'Withdraw'));
  }

  return res.status(405).end();
}
