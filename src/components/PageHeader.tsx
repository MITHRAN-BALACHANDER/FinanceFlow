import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex items-center justify-between", className)}>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
