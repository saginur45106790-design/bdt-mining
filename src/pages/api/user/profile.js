import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        referrals: { select: { id: true, userEngines: true } },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const totalReferrals = user.referrals.length;
    const activeReferrals = user.referrals.filter((r) => r.userEngines.length > 0).length;

    return res.status(200).json({
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
      totalReferrals,
      activeReferrals,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}