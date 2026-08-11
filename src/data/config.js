export const MACHINES_CONFIG = [
  {
    id: 1,
    name: "Machine 1",
    subtitle: "b5 / Hour",
    rate: 5,
    unlockCondition: "Free Account Created",
    machinePrice: 0,
    engines: [
      { id: 1, name: "Engine 1", price: 0, rate: 5 },
      { id: 2, name: "Engine 2", price: 20, rate: 5 },
      { id: 3, name: "Engine 3", price: 40, rate: 5 },
      { id: 4, name: "Engine 4", price: 60, rate: 5 },
      { id: 5, name: "Engine 5", price: 80, rate: 5 }
    ]
  },
  {
    id: 2,
    name: "Machine 2",
    subtitle: "b10 / Hour",
    rate: 10,
    unlockCondition: "Complete Machine 1 + YouTube & Facebook Task",
    machinePrice: 500,
    engines: [
      { id: 1, name: "Engine 1", price: 300, rate: 10 },
      { id: 2, name: "Engine 2", price: 600, rate: 10 },
      { id: 3, name: "Engine 3", price: 800, rate: 10 },
      { id: 4, name: "Engine 4", price: 1000, rate: 10 },
      { id: 5, name: "Engine 5", price: 1200, rate: 10 }
    ]
  },
  {
    id: 3,
    name: "Machine 3",
    subtitle: "b15 / Hour",
    rate: 15,
    unlockCondition: "Complete Machine 2 + 3 Referrals",
    machinePrice: 500,
    engines: [
      { id: 1, name: "Engine 1", price: 500, rate: 15 },
      { id: 2, name: "Engine 2", price: 1000, rate: 15 },
      { id: 3, name: "Engine 3", price: 1500, rate: 15 },
      { id: 4, name: "Engine 4", price: 2000, rate: 15 },
      { id: 5, name: "Engine 5", price: 2500, rate: 15 }
    ]
  },
  {
    id: 4,
    name: "Machine 4",
    subtitle: "b20 / Hour",
    rate: 20,
    unlockCondition: "Complete Machine 3 + b20 Deposit",
    machinePrice: 3000,
    engines: [
      { id: 1, name: "Engine 1", price: 700, rate: 20 },
      { id: 2, name: "Engine 2", price: 1400, rate: 20 },
      { id: 3, name: "Engine 3", price: 2100, rate: 20 },
      { id: 4, name: "Engine 4", price: 2800, rate: 20 },
      { id: 5, name: "Engine 5", price: 3500, rate: 20 }
    ]
  },
  {
    id: 5,
    name: "Machine 5",
    subtitle: "b50 / Hour",
    rate: 50,
    unlockCondition: "Complete Machine 4 + b50 Deposit",
    machinePrice: 3000,
    engines: [
      { id: 1, name: "Engine 1", price: 3000, rate: 50 },
      { id: 2, name: "Engine 2", price: 5000, rate: 50 },
      { id: 3, name: "Engine 3", price: 7000, rate: 50 }
    ]
  }
];
