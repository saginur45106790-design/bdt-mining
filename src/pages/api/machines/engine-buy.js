import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  const { engineId } = req.body;

  try {
    const engine = await prisma.engine.findUnique({ where: { id: engineId } });
    if (!engine) return res.status(404).json({ error: 'Engine not found' });

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (parseFloat(user.balance) < parseFloat(engine.price)) {
      return res.status(400).json({ error: 'Insufficient balance to purchase engine' });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: engine.price } },
      }),
      prisma.userEngine.create({
        data: { userId: user.id, engineId: engine.id },
      }),
      prisma.transactionHistory.create({
        data: {
          userId: user.id,
          type: 'ENGINE_BUY',
          amount: -engine.price,
          description: `Purchased ${engine.name}`,
        },
      }),
    ]);

    return res.status(200).json({ success: true, message: 'Engine activated' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to buy engine' });
  }
}