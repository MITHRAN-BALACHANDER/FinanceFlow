import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentExpensesCard } from '@/components/dashboard/RecentExpensesCard';
import { BudgetsCard } from '@/components/dashboard/BudgetsCard';
import { CreditCard, DollarSign, Landmark } from 'lucide-react';

export default function DashboardPage() {
  // In a real app, these values would come from data fetching
  const totalExpenses = 433.09;
  const totalIncome = 2500; // Example value
  const savings = totalIncome - totalExpenses;

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Expenses (Month)"
          value={`₹${totalExpenses.toFixed(2)}`}
          icon={DollarSign}
          description="Your total spending for July"
        />
        <StatCard 
          title="Total Income (Month)"
          value={`₹${totalIncome.toFixed(2)}`}
          icon={Landmark}
          description="Your total income for July"
        />
        <StatCard 
          title="Net Savings (Month)"
          value={`₹${savings.toFixed(2)}`}
          icon={CreditCard}
          description="Your net savings for July"
          trend="up"
          trendValue="+15.2% from last month"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentExpensesCard />
        <BudgetsCard />
      </div>
    </>
  );
}
