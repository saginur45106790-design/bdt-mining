import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'transactions.json');

export default function handler(req, res) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
  let list = JSON.parse(fs.readFileSync(file, 'utf8'));

  if (req.method === 'GET') {
    return res.status(200).json(list.filter(t => t.type === 'Deposit'));
  }

  if (req.method === 'POST') {
    const { id, action } = req.body;
    list = list.map(t => {
      if (t.id === id) {
        return { ...t, status: action === 'approve' ? 'Approved' : 'Rejected' };
      }
      return t;
    });
    fs.writeFileSync(file, JSON.stringify(list, null, 2));
    return res.status(200).json({ success: true });
  }
}
