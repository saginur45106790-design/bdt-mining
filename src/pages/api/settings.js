import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const file = path.join(process.cwd(), 'admin-settings.json');
  if (fs.existsSync(file)) {
    try { return res.status(200).json(JSON.parse(fs.readFileSync(file, 'utf8'))); } catch(e){}
  }
  return res.status(200).json({
    bkashNumber: '01700000000',
    nagadNumber: '01800000000',
    youtubeLink: 'https://youtube.com',
    facebookLink: 'https://facebook.com',
    adsterraLink: 'https://adsterra.com'
  });
}
