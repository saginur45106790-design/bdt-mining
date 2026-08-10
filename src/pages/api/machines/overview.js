import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const userMachines = await prisma.userMachine.findMany({
      where: { userId: payload.id },
    });

    const userEngines = await prisma.userEngine.findMany({
      where: { userId: payload.id },
      include: { engine: true },
    });

    const unlockedMachineIds = new Set(userMachines.map((um) => um.machineId));
    unlockedMachineIds.add(1); // Machine 1 is always unlocked for free

    const progress = {};
    [1, 2, 3, 4, 5].forEach((level) => {
      const activeEnginesCount = userEngines.filter(
        (ue) => ue.engine.machineId === level
      ).length;

      progress[level] = {
        isUnlocked: unlockedMachineIds.has(level),
        activeEnginesCount,
      };
    });

    return res.status(200).json({ progress });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch machines overview' });
  }
}