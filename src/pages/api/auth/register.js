import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fullName, phone, password, referralCode } = req.body;
  if (!fullName || !phone || !password) return res.status(400).json({ error: 'All required fields must be filled' });

  try {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) return res.status(400).json({ error: 'Phone number already registered' });

    let referredById = null;
    if (referralCode) {
      const refUser = await prisma.user.findUnique({ where: { referralCode } });
      if (refUser) referredById = refUser.id;
    }

    const newReferralCode = 'MINER' + Math.floor(10000 + Math.random() * 90000);
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        phone,
        passwordHash: hashedPassword,
        referralCode: newReferralCode,
        referredById,
      },
    });

    // Auto-activate Free Machine 1 Engine 1
    const engine1 = await prisma.engine.findFirst({ where: { machineId: 1 } });
    if (engine1) {
      await prisma.userEngine.create({
        data: { userId: user.id, engineId: engine1.id },
      });
    }

    const token = generateToken({ id: user.id, role: user.role });
    return res.status(201).json({ token, user: { id: user.id, fullName: user.fullName } });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
}