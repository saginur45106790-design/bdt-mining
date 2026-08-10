import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  const { amount, paymentMethod, trxId } = req.body;

  try {
    const deposit = await prisma.deposit.create({
      data: {
        userId: payload.id,
        amount: parseFloat(amount),
        paymentMethod,
        trxId,
      },
    });

    return res.status(201).json(deposit);
  } catch (err) {
    return res.status(400).json({ error: 'Duplicate Transaction ID or invalid input' });
  }
}