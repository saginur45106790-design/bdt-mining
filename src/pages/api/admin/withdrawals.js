import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  try {
    const withdrawals = await prisma.withdrawal.findMany({
      include: { user: { select: { fullName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(withdrawals);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
}