export type Category = 'Food' | 'Transport' | 'Shopping' | 'Utilities' | 'Entertainment' | 'Health' | 'Other';

export const categories: Category[] = ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Health', 'Other'];

export const categoryIcons: Record<Category, string> = {
    Food: 'Utensils',
    Transport: 'Car',
    Shopping: 'ShoppingBag',
    Utilities: 'Lightbulb',
    Entertainment: 'Ticket',
    Health: 'HeartPulse',
    Other: 'Sprout'
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: Date;
};

export type Budget = {
  id: string;
  category: Category;
  amount: number;
};
