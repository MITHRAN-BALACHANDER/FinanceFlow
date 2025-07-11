import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { categoryIcons, type Budget } from "@/lib/types";
import * as Lucide from "lucide-react";

interface BudgetCardProps {
    budget: Budget & { spent: number };
}

export function BudgetCard({ budget }: BudgetCardProps) {
    const progress = (budget.spent / budget.amount) * 100;
    const remaining = budget.amount - budget.spent;
    // @ts-ignore
    const Icon = Lucide[categoryIcons[budget.category]] || Lucide.Sprout;

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        {budget.category}
                    </CardTitle>
                    <div className="text-lg font-bold">${budget.amount.toFixed(2)}</div>
                </div>
                <CardDescription>Budgeted Amount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Progress value={progress} />
                <div className="text-sm text-muted-foreground flex justify-between">
                    <span>${budget.spent.toFixed(2)} spent</span>
                    <span className={remaining < 0 ? 'text-destructive font-semibold' : ''}>
                        {remaining >= 0 ? `$${remaining.toFixed(2)} remaining` : `$${Math.abs(remaining).toFixed(2)} over`}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
