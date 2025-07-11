import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowUp className={cn('h-4 w-4', trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180')} />
            <span className={cn(trend === 'up' ? 'text-green-500' : 'text-red-500')}>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
