'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { initialBudgets, initialExpenses } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';

export function BudgetsCard() {
  const budgetsWithSpending = initialBudgets.map(budget => {
    const spent = initialExpenses
      .filter(expense => expense.category === budget.category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const progress = (spent / budget.amount) * 100;
    return { ...budget, spent, progress };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budgets</CardTitle>
        <CardDescription>Your spending progress for this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px]">
          <div className="space-y-4">
            {budgetsWithSpending.map(budget => (
              <div key={budget.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{budget.category}</span>
                  <span className="text-muted-foreground">
                    ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
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
