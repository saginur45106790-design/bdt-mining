import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  const { depositId, action } = req.body;

  try {
    const deposit = await prisma.deposit.findUnique({ where: { id: depositId } });
    if (!deposit || deposit.status !== 'PENDING') {
      return res.status(400).json({ error: 'Invalid deposit request' });
    }

    if (action === 'APPROVE') {
      await prisma.$transaction([
        prisma.deposit.update({
          where: { id: depositId },
          data: { status: 'APPROVED' },
        }),
        prisma.user.update({
          where: { id: deposit.userId },
          data: {
            balance: { increment: deposit.amount },
            totalDeposit: { increment: deposit.amount },
          },
        }),
        prisma.transactionHistory.create({
          data: {
            userId: deposit.userId,
            type: 'DEPOSIT',
            amount: deposit.amount,
            description: `Deposit Approved (${deposit.paymentMethod})`,
          },
        }),
      ]);
    } else {
      await prisma.deposit.update({
        where: { id: depositId },
        data: { status: 'REJECTED' },
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Action failed' });
  }
}