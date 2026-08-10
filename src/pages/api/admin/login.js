export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { phone, password } = req.body;

  if (phone === '01798147447' && password === 'Al@2580d') {
    return res.status(200).json({
      success: true,
      token: 'admin-token-bdt-mining-2026-secret-key',
      user: { phone: '01798147447', role: 'ADMIN' }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
}
