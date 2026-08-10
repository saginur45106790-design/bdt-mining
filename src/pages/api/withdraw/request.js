import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Check Machine 5 condition
    const m5EnginesCount = await prisma.engine.count({ where: { machineId: 5 } });
    const userM5Engines = await prisma.userEngine.count({
      where: { userId: payload.id, engine: { machineId: 5 } },
    });

    if (userM5Engines < m5EnginesCount) {
      return res.status(403).json({
        error: '⚠️ Withdrawal is locked! Complete Machine 5 to activate withdrawals.',
      });
    }

    const { amount, paymentMethod, accountNumber } = req.body;
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (parseFloat(user.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: payload.id,
        amount: parseFloat(amount),
        paymentMethod,
        accountNumber,
      },
    });

    return res.status(201).json(withdrawal);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process withdrawal request' });
  }
}