'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { type Budget, type Expense } from '@/lib/types';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function BudgetsCard() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (user && db) {
      const budgetsQuery = query(collection(db, "budgets"), where("userId", "==", user.uid));
      const unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
        setBudgets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget)));
      });

      const expensesQuery = query(collection(db, "expenses"), where("userId", "==", user.uid));
      const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
        setExpenses(snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(), 
            date: doc.data().date.toDate() 
        } as Expense)));
      });

      return () => {
        unsubscribeBudgets();
        unsubscribeExpenses();
      };
    }
  }, [user]);

  const budgetsWithSpending = useMemo(() => budgets.map(budget => {
    const spent = expenses
      .filter(expense => expense.category === budget.category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const progress = (spent / budget.amount) * 100;
    return { ...budget, spent, progress };
  }), [budgets, expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budgets</CardTitle>
        <CardDescription>Your spending progress for this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px]">
          <div className="space-y-4">
            {budgetsWithSpending.length === 0 && <p className="text-muted-foreground text-sm">No budgets set yet.</p>}
            {budgetsWithSpending.map(budget => (
              <div key={budget.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{budget.category}</span>
                  <span className="text-muted-foreground">
                    ₹{budget.spent.toFixed(2)} / ₹{budget.amount.toFixed(2)}
                  </span>
                </div>
                <Progress value={budget.progress} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
