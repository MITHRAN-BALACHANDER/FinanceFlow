import type { Expense, Budget } from './types';

export const initialExpenses: Expense[] = [
  {
    id: '1',
    description: 'Groceries from SuperMart',
    amount: 75.50,
    category: 'Food',
    date: new Date('2024-07-28'),
  },
  {
    id: '2',
    description: 'Monthly train pass',
    amount: 120.00,
    category: 'Transport',
    date: new Date('2024-07-01'),
  },
  {
    id: '3',
    description: 'New sneakers',
    amount: 89.99,
    category: 'Shopping',
    date: new Date('2024-07-15'),
  },
  {
    id: '4',
    description: 'Electricity bill',
    amount: 65.20,
    category: 'Utilities',
    date: new Date('2024-07-20'),
  },
  {
    id: '5',
    description: 'Movie tickets for "Dune: Part Two"',
    amount: 32.00,
    category: 'Entertainment',
    date: new Date('2024-07-12'),
  },
  {
    id: '6',
    description: 'Pharmacy prescription',
    amount: 25.00,
    category: 'Health',
    date: new Date('2024-07-18'),
  },
  {
    id: '7',
    description: 'Dinner with friends',
    amount: 55.40,
    category: 'Food',
    date: new Date('2024-07-25'),
  },
  {
    id: '8',
    description: 'Gas for car',
    amount: 45.00,
    category: 'Transport',
    date: new Date('2024-07-22'),
  },
];

export const initialBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food',
    amount: 500,
  },
  {
    id: '2',
    category: 'Transport',
    amount: 200,
  },
  {
    id: '3',
    category: 'Shopping',
    amount: 250,
  },
  {
    id: '4',
    category: 'Entertainment',
    amount: 150,
  },
];
