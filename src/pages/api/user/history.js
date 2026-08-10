import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const transactions = await prisma.transactionHistory.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return res.status(200).json(transactions);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
}