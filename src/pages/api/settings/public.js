import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    let settings = await prisma.systemSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          bkashNumber: "01700000000",
          nagadNumber: "01800000000",
          youtubeLink: "https://youtube.com",
          facebookLink: "https://facebook.com",
          adsterraDirectLink: "https://www.google.com",
        },
      });
    }

    return res.status(200).json({
      bkashNumber: settings.bkashNumber,
      nagadNumber: settings.nagadNumber,
      youtubeLink: settings.youtubeLink,
      facebookLink: settings.facebookLink,
      adsterraDirectLink: settings.adsterraDirectLink,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch public settings' });
  }
}