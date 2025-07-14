export interface Transaction {
  id: number;
  date: string; // ISO date string
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
}

const transactions: Transaction[] = [
  { id: 1, date: '2024-01-05', description: 'Salary', category: 'Income', type: 'income', amount: 5000 },
  { id: 2, date: '2024-01-10', description: 'Groceries', category: 'Food', type: 'expense', amount: 120 },
  { id: 3, date: '2024-01-15', description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 60 },
  { id: 4, date: '2024-02-03', description: 'Freelance Project', category: 'Income', type: 'income', amount: 800 },
  { id: 5, date: '2024-02-14', description: 'Restaurant', category: 'Food', type: 'expense', amount: 45 },
  { id: 6, date: '2024-03-07', description: 'Rent', category: 'Housing', type: 'expense', amount: 1000 },
  { id: 7, date: '2024-03-18', description: 'Stock Dividend', category: 'Investment', type: 'income', amount: 200 },
  { id: 8, date: '2023-11-22', description: 'Car Repair', category: 'Transport', type: 'expense', amount: 300 },
  { id: 9, date: '2023-12-02', description: 'Bonus', category: 'Income', type: 'income', amount: 1200 },
  { id: 10, date: '2024-04-13', description: 'New Laptop', category: 'Electronics', type: 'expense', amount: 1500 },
  { id: 11, date: '2024-04-20', description: 'Tax Refund', category: 'Income', type: 'income', amount: 400 },
  { id: 12, date: '2024-05-05', description: 'Vacation', category: 'Travel', type: 'expense', amount: 700 },
  { id: 13, date: '2024-06-09', description: 'Gift', category: 'Income', type: 'income', amount: 150 },
  { id: 14, date: '2024-06-15', description: 'Internet Bill', category: 'Utilities', type: 'expense', amount: 80 },
  { id: 15, date: '2024-07-01', description: 'Salary', category: 'Income', type: 'income', amount: 5200 },
  { id: 16, date: '2024-07-09', description: 'Gym Membership', category: 'Health', type: 'expense', amount: 50 },
];

export default transactions;
