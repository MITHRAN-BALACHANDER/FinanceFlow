import { PageHeader } from "@/components/PageHeader";
import { CategorySpendingChart } from "@/components/reports/CategorySpendingChart";
import { initialExpenses } from "@/lib/data";

export default function ReportsPage() {
    return (
        <>
            <PageHeader title="Reports" />
            <div className="grid gap-6">
                <CategorySpendingChart data={initialExpenses} />
            </div>
        </>
    )
}