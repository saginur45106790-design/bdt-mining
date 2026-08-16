import { getDB, saveDB } from '@/lib/db';
import { MACHINES_CONFIG } from '@/data/config';

export default function handler(req, res) {
  const { phone } = req.query;
  const db = getDB();

  const userPhone = phone || '01836345346';
  let user = db.users.find(u => u.phone === userPhone);

  if (!user) {
    user = {
      id: 'usr_' + Date.now(),
      name: 'Miner',
      phone: userPhone,
      password: '123',
      balance: 100.00,
      customMining: 0,
      customWithdraw: 0,
      referralCode: 'MINER' + Math.floor(100000 + Math.random() * 900000),
      referralsCount: 0,
      tasksCompleted: { youtube: false, facebook: false },
      purchasedEngines: { "m1_e1": true },
      purchasedMachines: { 1: true },
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    saveDB(db);
  }

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
  const liveMiningIncome = (currentHourlyRate * hoursElapsed) + (parseFloat(user.customMining) || 0);

  const userWithdraws = db.transactions ? db.transactions.filter(t => t.userPhone === user.phone && t.type === 'Withdraw') : [];
  const totalMiningDeducted = userWithdraws.reduce((sum, t) => sum + (parseFloat(t.miningDeducted) || (parseFloat(t.amount) * 10000)), 0);
  const totalWithdrawReal = (parseFloat(user.customWithdraw) || 0) + userWithdraws.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const baseBalance = parseFloat(user.balance) || 0;
  const availableMiningBalance = Math.max(0, baseBalance + liveMiningIncome - totalMiningDeducted);

  const approvedDepositsList = db.transactions ? db.transactions.filter(t => t.userPhone === user.phone && t.type === 'Deposit' && t.status === 'Approved') : [];
  const has20Approved = approvedDepositsList.some(t => parseFloat(t.amount) === 20);
  const has50Approved = approvedDepositsList.some(t => parseFloat(t.amount) === 50);

  const m1Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m1_e${id}`]);
  const m2Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m2_e${id}`]);
  const m3Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m3_e${id}`]);
  const m4Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m4_e${id}`]);
  const m5Complete = [1,2,3].every(id => user.purchasedEngines?.[`m5_e${id}`]);

  return res.status(200).json({
    user,
    availableBalance: availableMiningBalance.toFixed(2),
    todayMining: liveMiningIncome.toFixed(2),
    totalWithdraw: totalWithdrawReal.toFixed(2),
    currentHourlyRate,
    m1Complete,
    m2TasksDone: !!(user.tasksCompleted?.youtube && user.tasksCompleted?.facebook),
    has20Approved,
    has50Approved,
    allDepositsCompleted: has20Approved && has50Approved,
    machineAccess: {
      1: true,
      2: m1Complete,
      3: m2Complete,
      4: m3Complete,
      5: m4Complete
    },
    withdrawEnabled: m5Complete
  });
}
