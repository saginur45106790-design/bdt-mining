import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'admin-settings.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
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

  if (req.method === 'POST') {
    fs.writeFileSync(file, JSON.stringify(req.body, null, 2));
    return res.status(200).json({ success: true, message: 'Settings saved successfully!' });
  }

  return res.status(405).end();
}
