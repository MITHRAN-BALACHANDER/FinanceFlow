
'use client';

import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentExpensesCard } from '@/components/dashboard/RecentExpensesCard';
import { BudgetsCard } from '@/components/dashboard/BudgetsCard';
import { CreditCard, DollarSign, Landmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { type Expense } from '@/lib/types';
import { collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { startOfMonth, endOfMonth } from 'date-fns';
import { SetIncomeDialog } from '@/components/dashboard/SetIncomeDialog';

export default function DashboardPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (user && db) {
      const today = new Date();
      const start = startOfMonth(today);
      const end = endOfMonth(today);

      const expensesQuery = query(
        collection(db, 'expenses'), 
        where("userId", "==", user.uid),
        where("date", ">=", start),
        where("date", "<=", end)
      );
      
      const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
        const monthlyExpenses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        }) as Expense);
        setExpenses(monthlyExpenses);
      });

      const profileRef = doc(db, 'userProfiles', user.uid);
      const unsubscribeProfile = onSnapshot(profileRef, (doc) => {
        if (doc.exists()) {
          setTotalIncome(doc.data().monthlyIncome || 0);
        } else {
          setTotalIncome(0);
        }
      });

      return () => {
        unsubscribeExpenses();
        unsubscribeProfile();
      };
    }
  }, [user]);

  const handleSetIncome = async ({ monthlyIncome }: { monthlyIncome: number }) => {
    if (user && db) {
        const profileRef = doc(db, 'userProfiles', user.uid);
        await setDoc(profileRef, { monthlyIncome }, { merge: true });
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = totalIncome - totalExpenses;

  return (
    <>
      <PageHeader title="Dashboard">
        <SetIncomeDialog onSubmit={handleSetIncome} currentIncome={totalIncome} />
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Expenses (Month)"
          value={`₹${totalExpenses.toFixed(2)}`}
          icon={DollarSign}
          description="Your total spending for this month"
        />
        <StatCard 
          title="Total Income (Month)"
          value={`₹${totalIncome.toFixed(2)}`}
          icon={Landmark}
          description="Your total income for this month"
        />
        <StatCard 
          title="Net Savings (Month)"
          value={`₹${savings.toFixed(2)}`}
          icon={CreditCard}
          description="Your net savings for this month"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentExpensesCard />
        <BudgetsCard />
      </div>
    </>
  );
}
