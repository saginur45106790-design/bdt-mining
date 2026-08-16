import { getDB, saveDB } from '@/lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { phone, password, deviceId } = req.body;
  const db = getDB();

  const user = db.users.find(u => u.phone === phone && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid phone or password' });
  }

  // Device Lock Protection
  if (deviceId) {
    const anotherUserWithDevice = db.users.find(u => u.deviceId === deviceId && u.phone !== phone);
    if (anotherUserWithDevice) {
      return res.status(403).json({ 
        success: false, 
        message: '❌ এই ডিভাইসে অন্য একটি অ্যাকাউন্ট যুক্ত রয়েছে! এক ডিভাইসে একাধিক অ্যাকাউন্ট ব্যবহার নিষিদ্ধ।' 
      });
    }
    if (!user.deviceId) {
      user.deviceId = deviceId;
      saveDB(db);
    }
  }

  return res.status(200).json({ success: true, user });
}
