import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db_store.json');

const initialData = {
  settings: {
    bkashNumber: '01700000000',
    nagadNumber: '01800000000',
    youtubeLink: 'https://youtube.com',
    facebookLink: 'https://facebook.com',
    adsterraLink: 'https://adsterra.com'
  },
  users: [
    {
      id: "usr_1",
      name: "sajib",
      phone: "01836345346",
      password: "123",
      referralCode: "MINER99817",
      referralsCount: 3,
      tasksCompleted: { youtube: true, facebook: true },
      purchasedEngines: { "m1_e1": true },
      purchasedMachines: { 1: true },
      createdAt: new Date().toISOString()
    }
  ],
  transactions: []
};

export function getDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) {
    return initialData;
  }
}

export function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
