import type { Expense, Budget } from './types';

// This data is now for reference and no longer used directly in the app.
// Data is now fetched from and stored in Firestore.

export const initialExpenses: Expense[] = [
  {
    id: '1',
    userId: 'user-1',
    description: 'Groceries from SuperMart',
    amount: 75.50,
    category: 'Food',
    date: new Date('2024-07-28'),
  },
  {
    id: '2',
    userId: 'user-1',
    description: 'Monthly train pass',
    amount: 120.00,
    category: 'Transport',
    date: new Date('2024-07-01'),
  },
  {
    id: '3',
    userId: 'user-1',
    description: 'New sneakers',
    amount: 89.99,
    category: 'Shopping',
    date: new Date('2024-07-15'),
  },
  {
    id: '4',
    userId: 'user-1',
    description: 'Electricity bill',
    amount: 65.20,
    category: 'Utilities',
    date: new Date('2024-07-20'),
  },
  {
    id: '5',
    userId: 'user-1',
    description: 'Movie tickets for "Dune: Part Two"',
    amount: 32.00,
    category: 'Entertainment',
    date: new Date('2024-07-12'),
  },
];

export const initialBudgets: Budget[] = [
  {
    id: '1',
    userId: 'user-1',
    category: 'Food',
    amount: 500,
  },
  {
    id: '2',
    userId: 'user-1',
    category: 'Transport',
    amount: 200,
  },
  {
    id: '3',
    userId: 'user-1',
    category: 'Shopping',
    amount: 250,
  },
];
