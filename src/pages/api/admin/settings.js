import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  const { bkashNumber, nagadNumber, youtubeLink, facebookLink, adsterraDirectLink } = req.body;

  try {
    const settings = await prisma.systemSettings.upsert({
      where: { id: 1 },
      update: { bkashNumber, nagadNumber, youtubeLink, facebookLink, adsterraDirectLink },
      create: { bkashNumber, nagadNumber, youtubeLink, facebookLink, adsterraDirectLink },
    });

    return res.status(200).json(settings);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save settings' });
  }
}