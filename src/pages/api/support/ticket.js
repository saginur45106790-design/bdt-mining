import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const tickets = await prisma.ticket.findMany({
        where: { userId: payload.id },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(tickets);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }

  if (req.method === 'POST') {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message required' });

    try {
      const ticketNumber = '#SUP-' + Math.floor(10000 + Math.random() * 90000);
      const newTicket = await prisma.ticket.create({
        data: {
          userId: payload.id,
          ticketNumber,
          subject,
          message,
        },
      });
      return res.status(201).json(newTicket);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to submit support ticket' });
    }
  }

  return res.status(405).end();
}