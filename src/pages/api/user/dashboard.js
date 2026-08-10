import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        userEngines: { include: { engine: true } },
        transactions: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const currentMiningRate = user.userEngines.reduce(
      (acc, ue) => acc + parseFloat(ue.engine.miningRatePerHour),
      0
    );

    return res.status(200).json({
      balance: user.balance,
      stats: {
        balance: user.balance,
        todayMining: '75.00',
        totalMiningIncome: user.balance,
        totalDeposit: user.totalDeposit,
        totalWithdrawal: user.totalWithdrawal,
      },
      currentMiningRate: currentMiningRate || 5,
      machineProgress: {
        1: { isUnlocked: true },
        2: { isUnlocked: false },
        3: { isUnlocked: false },
        4: { isUnlocked: false },
        5: { isUnlocked: false },
      },
      recentActivities: user.transactions,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
}