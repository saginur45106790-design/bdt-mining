import { getDB, saveDB } from '@/lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  
  try {
    const { name, phone, email, password, address, refCode } = req.body || {};

    if (!phone || !password || !email || !address) {
      return res.status(400).json({ success: false, message: 'All fields including Live GPS Location/Address are required!' });
    }

    const db = getDB();
    if (!Array.isArray(db.users)) db.users = [];

    const existingUser = db.users.find(u => u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This phone number is already registered! Please login.' });
    }

    let initialBalance = 0;
    if (refCode && refCode.trim() !== '') {
      const refUser = db.users.find(u => u.referralCode === refCode.trim());
      if (refUser) {
        refUser.balance = (parseFloat(refUser.balance) || 0) + 200;
        refUser.referralsCount = (parseInt(refUser.referralsCount) || 0) + 1;
        initialBalance = 100;
      }
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name || 'Miner',
      phone,
      email,
      password,
      address,
      balance: initialBalance,
      referralCode: 'MINER' + Math.floor(100000 + Math.random() * 900000),
      referralsCount: 0,
      tasksCompleted: { youtube: false, facebook: false },
      purchasedEngines: { "m1_e1": true },
      purchasedMachines: { 1: true },
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    return res.status(200).json({ success: true, user: newUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
}
