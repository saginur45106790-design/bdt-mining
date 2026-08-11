import { getDB, saveDB } from '@/lib/db';
import { MACHINES_CONFIG } from '@/data/config';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone, machineId, engineId } = req.body;
  const db = getDB();

  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ success: false, message: 'User account not found!' });

  const mId = parseInt(machineId);
  const eId = parseInt(engineId);

  if (mId === 2) {
    const ytDone = user.tasksCompleted?.youtube;
    const fbDone = user.tasksCompleted?.facebook;
    if (!ytDone || !fbDone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Locked! You must complete YouTube & Facebook tasks first.' 
      });
    }
  }

  if (mId === 3) {
    const refs = user.referralsCount || 0;
    if (refs < 3) {
      return res.status(400).json({
        success: false,
        message: `Locked! You need 3 successful referrals to unlock Machine 3. Current: ${refs}/3`
      });
    }
  }

  const machine = MACHINES_CONFIG.find(m => m.id === mId);
  const engine = machine?.engines?.find(e => e.id === eId);
  if (!engine) return res.status(400).json({ success: false, message: 'Invalid engine configuration' });

  const currentBal = parseFloat(user.balance) || 0;
  if (currentBal < engine.price) {
    return res.status(400).json({ success: false, message: `Insufficient balance! Engine price is ৳${engine.price}` });
  }

  if (eId > 1) {
    const prevKey = `m${mId}_e${eId - 1}`;
    if (!user.purchasedEngines?.[prevKey]) {
      return res.status(400).json({ success: false, message: `Must unlock Engine ${eId - 1} first!` });
    }
  }

  if (!user.purchasedEngines) user.purchasedEngines = {};
  user.purchasedEngines[`m${mId}_e${eId}`] = true;
  user.balance = Math.max(0, currentBal - engine.price);
  saveDB(db);

  return res.status(200).json({ success: true, message: `Engine ${eId} unlocked successfully!` });
}
