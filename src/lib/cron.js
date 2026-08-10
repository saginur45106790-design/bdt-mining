import prisma from './prisma';

export async function processHourlyMiningRewards() {
  try {
    const userEngines = await prisma.userEngine.findMany({
      include: { engine: true, user: true },
    });

    for (const ue of userEngines) {
      if (ue.user.isSuspended) continue;

      const hourlyIncome = ue.engine.miningRatePerHour;

      await prisma.$transaction([
        prisma.user.update({
          where: { id: ue.userId },
          data: { balance: { increment: hourlyIncome } },
        }),
        prisma.transactionHistory.create({
          data: {
            userId: ue.userId,
            type: 'MINING_REWARD',
            amount: hourlyIncome,
            description: `Mining income from ${ue.engine.name}`,
          },
        }),
      ]);
    }
  } catch (error) {
    console.error('CRON_ERROR:', error);
  }
}