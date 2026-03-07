import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface KpiCardProps {
  label: string;
  value: string;
  badge?: {
    text: string;
    variant?: "positive" | "neutral";
  };
}

export function KpiCard({ label, value, badge }: KpiCardProps) {
  return (
    <Card className="p-6 flex flex-col justify-between h-32 relative overflow-hidden">
      <div className="absolute h-32 w-32 bg-brand/10 -left-10 -bottom-10 rounded-full" />
      <div className="absolute h-20 w-20 bg-brand/10 -right-5 -top-5 rounded-full" />
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {badge && (
          <Badge
            className={cn(
              "text-sm font-bold px-2 py-1 rounded-lg",
              badge.variant === "positive" || badge.variant === undefined
                ? "bg-brand/10 text-brand border-transparent hover:bg-brand/20"
                : "bg-muted text-muted-foreground border-transparent",
            )}
          >
            {badge.text}
          </Badge>
        )}
      </div>
    </Card>
  );
}
