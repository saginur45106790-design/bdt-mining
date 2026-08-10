import fs from 'fs';
import path from 'path';

const settingsFile = path.join(process.cwd(), 'admin-settings.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    if (fs.existsSync(settingsFile)) {
      const data = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
      return res.status(200).json(data);
    }
    return res.status(200).json({
      bkashNumber: '01700000000',
      nagadNumber: '01800000000',
      youtubeLink: 'https://youtube.com',
      facebookLink: 'https://facebook.com',
      adsterraLink: 'https://adsterra.com'
    });
  }

  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    if (authHeader !== 'Bearer admin-token-bdt-mining-2026-secret-key') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    fs.writeFileSync(settingsFile, JSON.stringify(req.body, null, 2));
    return res.status(200).json({ success: true, message: 'Settings updated successfully!' });
  }

  return res.status(405).end();
}
