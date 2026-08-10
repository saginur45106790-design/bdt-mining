import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'transactions.json');

export default function handler(req, res) {
  if (fs.existsSync(file)) {
    const list = JSON.parse(fs.readFileSync(file, 'utf8'));
    return res.status(200).json(list);
  }
  return res.status(200).json([]);
}
