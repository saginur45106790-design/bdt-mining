import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  const { withdrawId, action, rejectReason } = req.body;

  try {
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: withdrawId } });
    if (!withdrawal || withdrawal.status !== 'PENDING') {
      return res.status(400).json({ error: 'Invalid withdrawal request' });
    }

    if (action === 'APPROVE') {
      await prisma.$transaction([
        prisma.withdrawal.update({
          where: { id: withdrawId },
          data: { status: 'APPROVED' },
        }),
        prisma.user.update({
          where: { id: withdrawal.userId },
          data: {
            balance: { decrement: withdrawal.amount },
            totalWithdrawal: { increment: withdrawal.amount },
          },
        }),
        prisma.transactionHistory.create({
          data: {
            userId: withdrawal.userId,
            type: 'WITHDRAW',
            amount: -withdrawal.amount,
            description: `Withdrawal Approved (${withdrawal.paymentMethod})`,
          },
        }),
      ]);
    } else {
      await prisma.withdrawal.update({
        where: { id: withdrawId },
        data: { status: 'REJECTED', rejectReason: rejectReason || 'Rejected by Admin' },
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Action failed' });
  }
}