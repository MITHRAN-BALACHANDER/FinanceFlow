export type Category = string;

export const defaultCategories: Category[] = ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Health', 'Other'];

export const categoryIcons: Record<string, string> = {
    Food: 'Utensils',
    Transport: 'Car',
    Shopping: 'ShoppingBag',
    Utilities: 'Lightbulb',
    Entertainment: 'Ticket',
    Health: 'HeartPulse',
    Other: 'Sprout',
    Default: 'Shapes'
};

export type Expense = {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: Category;
  date: Date;
};

export type Budget = {
  id: string;
  userId: string;
  category: Category;
  amount: number;
};

export type UserCategory = {
    id: string;
    userId: string;
    name: string;
}
