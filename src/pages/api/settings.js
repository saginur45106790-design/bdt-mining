import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const settingsFile = path.join(process.cwd(), 'admin-settings.json');
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
