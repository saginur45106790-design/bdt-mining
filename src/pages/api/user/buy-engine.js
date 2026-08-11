import { getDB, saveDB } from '@/lib/db';
import { MACHINES_CONFIG } from '@/data/config';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone, machineId, engineId } = req.body;
  const db = getDB();

  if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });

  let user = db.users.find(u => u.phone === phone);
  if (!user) {
    user = {
      id: 'usr_' + Date.now(),
      name: 'Miner',
      phone: phone,
      password: '123',
      balance: 100.00,
      referralCode: 'MINER' + Math.floor(100000 + Math.random() * 900000),
      referralsCount: 0,
      tasksCompleted: { youtube: true, facebook: true },
      purchasedEngines: { "m1_e1": true },
      purchasedMachines: { 1: true },
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    saveDB(db);
  }

  const machine = MACHINES_CONFIG.find(m => m.id === parseInt(machineId));
  if (!machine) return res.status(400).json({ success: false, message: 'Invalid machine' });

  const engine = machine.engines.find(e => e.id === parseInt(engineId));
  if (!engine) return res.status(400).json({ success: false, message: 'Invalid engine' });

  let totalSpent = 0;
  MACHINES_CONFIG.forEach(m => {
    m.engines.forEach(e => {
      const key = `m${m.id}_e${e.id}`;
      if (user.purchasedEngines && user.purchasedEngines[key] && key !== 'm1_e1') {
        totalSpent += e.price;
      }
    });
  });

  const availableBalance = (parseFloat(user.balance) || 0) - totalSpent;

  if (availableBalance < engine.price) {
    return res.status(400).json({ success: false, message: `Insufficient balance! Price is ৳${engine.price}` });
  }

  if (engine.id > 1) {
    const prevKey = `m${machine.id}_e${engine.id - 1}`;
    if (!user.purchasedEngines?.[prevKey]) {
      return res.status(400).json({ success: false, message: `Must unlock Engine ${engine.id - 1} first!` });
    }
  }

  if (!user.purchasedEngines) user.purchasedEngines = {};
  user.purchasedEngines[`m${machine.id}_e${engine.id}`] = true;
  saveDB(db);

  return res.status(200).json({ success: true, message: `Engine ${engine.id} unlocked successfully!` });
}
