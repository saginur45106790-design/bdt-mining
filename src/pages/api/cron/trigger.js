import { processHourlyMiningRewards } from '@/lib/cron';

export default async function handler(req, res) {
  const secret = req.query.secret || req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized Cron Execution' });
  }

  try {
    await processHourlyMiningRewards();
    return res.status(200).json({ success: true, message: 'Hourly mining rewards credited successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Cron execution failed' });
  }
}