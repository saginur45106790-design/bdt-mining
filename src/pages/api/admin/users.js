import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'GET') {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        balance: true,
        isSuspended: true,
        createdAt: true,
      },
    });
    return res.status(200).json(users);
  }

  if (req.method === 'PATCH') {
    const { userId, fullName, phone, email, balance, isSuspended } = req.body;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phone,
        email,
        balance: parseFloat(balance),
        isSuspended,
      },
    });
    return res.status(200).json(updated);
  }

  return res.status(405).end();
}