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
  const liveMiningIncome = (currentHourlyRate * hoursElapsed);

  const baseBalance = parseFloat(user.balance) || 0;
  const availableBalance = baseBalance + liveMiningIncome;

  const m1Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m1_e${id}`]);
  const m2Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m2_e${id}`]);
  const m3Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m3_e${id}`]);
  const m4Complete = [1,2,3,4,5].every(id => user.purchasedEngines?.[`m4_e${id}`]);

  return res.status(200).json({
    user,
    availableBalance: availableBalance.toFixed(2),
    todayMining: liveMiningIncome.toFixed(2),
    currentHourlyRate,
    m1Complete,
    m2TasksDone: !!(user.tasksCompleted?.youtube && user.tasksCompleted?.facebook),
    machineAccess: {
      1: true,
      2: m1Complete,
      3: m2Complete,
      4: m3Complete,
      5: m4Complete
    },
    withdrawEnabled: [1,2,3].every(id => user.purchasedEngines?.[`m5_e${id}`])
  });
}
