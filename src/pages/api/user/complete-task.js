import { getDB, saveDB } from '@/lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone, task } = req.body || {};
  const db = getDB();

  if (!phone || !task) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  const user = db.users.find(u => u.phone === phone);
  if (user) {
    if (!user.tasksCompleted) user.tasksCompleted = {};
    user.tasksCompleted[task] = true;
    saveDB(db);
    return res.status(200).json({ success: true, message: `${task.toUpperCase()} task verified!` });
  }

  return res.status(404).json({ success: false, message: 'User not found' });
}
