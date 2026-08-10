import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  const { targetMachineLevel } = req.body;
  if (!targetMachineLevel || targetMachineLevel <= 1 || targetMachineLevel > 5) {
    return res.status(400).json({ error: 'Invalid target machine level' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        userEngines: { include: { engine: true } },
        referrals: true,
      },
    });

    const prevLevel = targetMachineLevel - 1;
    const prevEngines = user.userEngines.filter((ue) => ue.engine.machineId === prevLevel);
    const requiredPrevCount = prevLevel === 5 ? 3 : 5;

    if (prevEngines.length < requiredPrevCount) {
      return res.status(400).json({
        error: `Complete all engines of Machine ${prevLevel} first!`,
      });
    }

    // Requirements Validation
    if (targetMachineLevel === 2 && !user.socialTaskDone) {
      return res.status(400).json({ error: 'Subscribe & Follow YouTube/Facebook task first!' });
    }
    if (targetMachineLevel === 3 && user.referrals.length < 3) {
      return res.status(400).json({ error: `3 Referrals required (${user.referrals.length}/3 complete)` });
    }
    if (targetMachineLevel === 4 && parseFloat(user.totalDeposit) < 20) {
      return res.status(400).json({ error: 'Minimum ৳20 deposit required to unlock Machine 4' });
    }
    if (targetMachineLevel === 5 && parseFloat(user.totalDeposit) < 50) {
      return res.status(400).json({ error: 'Minimum ৳50 deposit required to unlock Machine 5' });
    }

    const entryFee = 500.00;
    if (parseFloat(user.balance) < entryFee) {
      return res.status(400).json({ error: 'Insufficient balance for ৳500 unlock fee' });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: entryFee } },
      }),
      prisma.userMachine.create({
        data: { userId: user.id, machineId: targetMachineLevel },
      }),
      prisma.transactionHistory.create({
        data: {
          userId: user.id,
          type: 'UNLOCK_FEE',
          amount: -entryFee,
          description: `Unlocked Machine ${targetMachineLevel}`,
        },
      }),
    ]);

    return res.status(200).json({ success: true, message: `Machine ${targetMachineLevel} unlocked!` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to unlock machine' });
  }
}