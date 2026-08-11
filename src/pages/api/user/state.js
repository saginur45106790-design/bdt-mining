import { getDB } from '@/lib/db';
import { MACHINES_CONFIG } from '@/data/config';

export default function handler(req, res) {
  const { phone } = req.query;
  const db = getDB();

  const user = db.users.find(u => u.phone === (phone || '01836345346')) || db.users[0];

  let currentHourlyRate = 0;
  let totalEngineSpent = 0;
  MACHINES_CONFIG.forEach(m => {
    m.engines.forEach(e => {
      const key = `m${m.id}_e${e.id}`;
      if (user.purchasedEngines && user.purchasedEngines[key]) {
        currentHourlyRate += e.rate;
        if (key !== 'm1_e1') totalEngineSpent += e.price;
      }
    });
  });

  const createdTime = new Date(user.createdAt || Date.now()).getTime();
  const nowTime = Date.now();
  const hoursElapsed = Math.max(0, (nowTime - createdTime) / (1000 * 60 * 60));
  const liveMiningIncome = (currentHourlyRate * hoursElapsed);

  const userTxs = db.transactions.filter(t => t.userPhone === user.phone && t.status === 'Approved');
  const approvedDeposits = userTxs.filter(t => t.type === 'Deposit').reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
  const approvedWithdraws = userTxs.filter(t => t.type === 'Withdraw').reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);

  const baseBalance = parseFloat(user.balance) || 0;
  const availableBalance = Math.max(0, baseBalance + liveMiningIncome + approvedDeposits - approvedWithdraws - totalEngineSpent);

  const m1Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m1_e${id}`]);
  const m2TasksDone = user.tasksCompleted?.youtube && user.tasksCompleted?.facebook;
  const m2Unlocked = m1Complete && m2TasksDone;

  const m2Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m2_e${id}`]);
  const m3Unlocked = m2Complete && (user.referralsCount >= 3);

  const m3Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m3_e${id}`]);
  const m4Unlocked = m3Complete && (approvedDeposits >= 20);

  const m4Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m4_e${id}`]);
  const m5Unlocked = m4Complete && (approvedDeposits >= 50);

  return res.status(200).json({
    user,
    availableBalance: availableBalance.toFixed(2),
    todayMining: liveMiningIncome.toFixed(2),
    approvedWithdraws: approvedWithdraws.toFixed(2),
    currentHourlyRate,
    machineAccess: {
      1: true,
      2: m2Unlocked,
      3: m3Unlocked,
      4: m4Unlocked,
      5: m5Unlocked
    },
    withdrawEnabled: m5Unlocked
  });
}
