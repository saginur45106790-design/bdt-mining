import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  try {
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
    const pendingDeposits = await prisma.deposit.count({ where: { status: 'PENDING' } });
    const pendingWithdrawals = await prisma.withdrawal.count({ where: { status: 'PENDING' } });

    const approvedDeposits = await prisma.deposit.aggregate({
      _sum: { amount: true },
      where: { status: 'APPROVED' },
    });

    const approvedWithdrawals = await prisma.withdrawal.aggregate({
      _sum: { amount: true },
      where: { status: 'APPROVED' },
    });

    return res.status(200).json({
      totalUsers,
      pendingDeposits,
      pendingWithdrawals,
      totalDeposits: (approvedDeposits._sum.amount || 0).toString(),
      totalWithdrawals: (approvedWithdrawals._sum.amount || 0).toString(),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
}