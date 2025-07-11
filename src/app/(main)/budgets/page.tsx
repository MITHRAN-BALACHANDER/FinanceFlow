'use client';

import { PageHeader } from "@/components/PageHeader";
import { AddBudgetDialog } from "@/components/budgets/AddBudgetDialog";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import type { Budget, Expense } from "@/lib/types";
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export default function BudgetsPage() {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        if (user) {
            const budgetsQuery = query(collection(db, "budgets"), where("userId", "==", user.uid));
            const unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
                const userBudgets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
                setBudgets(userBudgets);
            });

            const expensesQuery = query(collection(db, "expenses"), where("userId", "==", user.uid));
            const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
                const userExpenses = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        date: data.date.toDate(),
                    } as Expense;
                });
                setExpenses(userExpenses);
            });

            return () => {
                unsubscribeBudgets();
                unsubscribeExpenses();
            };
        }
    }, [user]);


    const addBudget = async (budget: Omit<Budget, 'id' | 'userId'>) => {
        if (!user) return;

        const existingBudget = budgets.find(b => b.category === budget.category);

        if (existingBudget) {
            const budgetRef = doc(db, "budgets", existingBudget.id);
            await updateDoc(budgetRef, { amount: budget.amount });
        } else {
             await addDoc(collection(db, "budgets"), {
                ...budget,
                userId: user.uid,
            });
        }
    }

    const budgetsWithSpending = useMemo(() => budgets.map(budget => {
        const spent = expenses
          .filter(expense => expense.category === budget.category)
          .reduce((sum, expense) => sum + expense.amount, 0);
        return { ...budget, spent };
      }), [budgets, expenses]);

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
