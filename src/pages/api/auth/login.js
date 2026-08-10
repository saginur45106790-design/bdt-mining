import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Phone and password required' });

  try {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(401).json({ error: 'Invalid phone or password' });

    if (user.isSuspended) return res.status(403).json({ error: 'Your account is suspended' });

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid phone or password' });

    const token = generateToken({ id: user.id, role: user.role });
    return res.status(200).json({ token, user: { id: user.id, fullName: user.fullName, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}