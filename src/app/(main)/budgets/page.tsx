'use client';

import { PageHeader } from "@/components/PageHeader";
import { AddBudgetDialog } from "@/components/budgets/AddBudgetDialog";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { initialBudgets, initialExpenses } from "@/lib/data";
import type { Budget } from "@/lib/types";
import { useState } from "react";

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

    const addBudget = (budget: Omit<Budget, 'id'>) => {
        const existingBudgetIndex = budgets.findIndex(b => b.category === budget.category);
        if (existingBudgetIndex > -1) {
            const updatedBudgets = [...budgets];
            updatedBudgets[existingBudgetIndex].amount = budget.amount;
            setBudgets(updatedBudgets);
        } else {
            setBudgets(prev => [...prev, { ...budget, id: Date.now().toString() }]);
        }
    }

    const budgetsWithSpending = budgets.map(budget => {
        const spent = initialExpenses
          .filter(expense => expense.category === budget.category)
          .reduce((sum, expense) => sum + expense.amount, 0);
        return { ...budget, spent };
      });

    return (
        <>
            <PageHeader title="Budgets">
                <AddBudgetDialog onSubmit={addBudget} />
            </PageHeader>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {budgetsWithSpending.map(budget => (
                    <BudgetCard key={budget.id} budget={budget} />
                ))}
            </div>
            {budgets.length === 0 && (
                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center">
                    <h3 className="text-xl font-semibold tracking-tight">No Budgets Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Get started by creating a new budget.</p>
                    <div className="mt-4">
                        <AddBudgetDialog onSubmit={addBudget} />
                    </div>
                </div>
            )}
        </>
    )
}