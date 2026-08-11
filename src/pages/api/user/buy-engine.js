import { getDB, saveDB } from '@/lib/db';
import { MACHINES_CONFIG } from '@/data/config';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone, machineId, engineId } = req.body;
  const db = getDB();

  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const machine = MACHINES_CONFIG.find(m => m.id === parseInt(machineId));
  const engine = machine.engines.find(e => e.id === parseInt(engineId));

  const userTxs = db.transactions.filter(t => t.userPhone === user.phone && t.status === 'Approved');
  const approvedDeposits = userTxs.filter(t => t.type === 'Deposit').reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);
  const approvedWithdraws = userTxs.filter(t => t.type === 'Withdraw').reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);

  let totalSpent = 0;
  MACHINES_CONFIG.forEach(m => {
    m.engines.forEach(e => {
      const key = `m${m.id}_e${e.id}`;
      if (user.purchasedEngines && user.purchasedEngines[key]) totalSpent += e.price;
    });
  });

  const availableBalance = approvedDeposits + 75.00 - approvedWithdraws - totalSpent;

  if (availableBalance < engine.price) {
    return res.status(400).json({ success: false, message: `Insufficient balance! Price is ৳${engine.price}` });
  }

  if (engine.id > 1) {
    const prevKey = `m${machine.id}_e${engine.id - 1}`;
    if (!user.purchasedEngines[prevKey]) {
      return res.status(400).json({ success: false, message: `Must unlock Engine ${engine.id - 1} first!` });
    }
  }

  user.purchasedEngines[`m${machine.id}_e${engine.id}`] = true;
  saveDB(db);

  return res.status(200).json({ success: true, message: `Engine ${engine.id} unlocked successfully!` });
}
