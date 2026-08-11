import { getDB } from '@/lib/db';
import { MACHINES_CONFIG } from '@/data/config';

export default function handler(req, res) {
  const { phone } = req.query;
  const db = getDB();

  const user = db.users.find(u => u.phone === (phone || '01836345346')) || db.users[0];

  const userTxs = db.transactions.filter(t => t.userPhone === user.phone && t.status === 'Approved');
  const approvedDeposits = userTxs.filter(t => t.type === 'Deposit').reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
  const approvedWithdraws = userTxs.filter(t => t.type === 'Withdraw').reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);

  let totalSpent = 0;
  let currentHourlyRate = 0;

  MACHINES_CONFIG.forEach(m => {
    m.engines.forEach(e => {
      const key = `m${m.id}_e${e.id}`;
      if (user.purchasedEngines && user.purchasedEngines[key]) {
        totalSpent += e.price;
        currentHourlyRate += e.rate;
      }
    });
  });

  const baseMining = 75.00;
  const availableBalance = Math.max(0, approvedDeposits + baseMining - approvedWithdraws - totalSpent);

  const m1Complete = [1,2,3,4,5].every(id => user.purchasedEngines[`m1_e${id}`]);
  const m2TasksDone = user.tasksCompleted?.youtube && user.tasksCompleted?.facebook;
  const m2Unlocked = m1Complete && m2TasksDone;

  const m2Complete = [1,2,3,4,5].every(id => user.purchasedEngines[`m2_e${id}`]);
  const m3Unlocked = m2Complete && (user.referralsCount >= 3);

  const m3Complete = [1,2,3,4,5].every(id => user.purchasedEngines[`m3_e${id}`]);
  const m4Unlocked = m3Complete && (approvedDeposits >= 20);

  const m4Complete = [1,2,3,4,5].every(id => user.purchasedEngines[`m4_e${id}`]);
  const m5Unlocked = m4Complete && (approvedDeposits >= 50);

  const machineAccess = {
    1: true,
    2: m2Unlocked,
    3: m3Unlocked,
    4: m4Unlocked,
    5: m5Unlocked
  };

  const withdrawEnabled = m5Unlocked;

  return res.status(200).json({
    user,
    availableBalance: availableBalance.toFixed(2),
    approvedDeposits: approvedDeposits.toFixed(2),
    approvedWithdraws: approvedWithdraws.toFixed(2),
    currentHourlyRate,
    machineAccess,
    withdrawEnabled
  });
}
