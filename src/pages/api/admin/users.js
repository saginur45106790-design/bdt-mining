import { getDB } from '@/lib/db';

export default function handler(req, res) {
  const db = getDB();
  const usersList = (db.users || []).map(u => {
    const userTxs = db.transactions ? db.transactions.filter(t => t.userPhone === u.phone) : [];
    const withdrawsSum = userTxs.filter(t => t.type === 'Withdraw').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalWithdrawVal = (parseFloat(u.customWithdraw) || 0) + withdrawsSum;

    return {
      id: u.id,
      name: u.name || 'N/A',
      phone: u.phone || 'N/A',
      email: u.email || 'N/A',
      password: u.password || 'N/A',
      address: u.address || 'N/A',
      deviceId: u.deviceId || 'N/A',
      referralCode: u.referralCode || 'N/A',
      referralsCount: u.referralsCount || 0,
      balance: "৳" + (parseFloat(u.balance) || 0).toFixed(2),
      customMining: (parseFloat(u.customMining) || 0).toFixed(2),
      customWithdraw: totalWithdrawVal.toFixed(2),
      status: "Active"
    };
  });
  return res.status(200).json(usersList);
}
