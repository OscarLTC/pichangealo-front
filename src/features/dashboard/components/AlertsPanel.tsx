import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";

type AlertVariant = "warning" | "danger" | "neutral";

export interface AlertItem {
  id: string;
  variant: AlertVariant;
  /** Nombre del ícono SVG simplificado — usa Material Symbols strings */
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const VARIANT_STYLES: Record<
  AlertVariant,
  { wrapper: string; iconWrapper: string; actionText: string }
> = {
  warning: {
    wrapper: "bg-orange-50",
    iconWrapper: "bg-orange-100 text-orange-600",
    actionText: "text-orange-600",
  },
  danger: {
    wrapper: "bg-red-50",
    iconWrapper: "bg-red-100 text-red-600",
    actionText: "text-red-600",
  },
  neutral: {
    wrapper: "bg-muted",
    iconWrapper: "bg-slate-200 text-slate-600",
    actionText: "text-foreground",
  },
};

interface AlertCardProps {
  alert: AlertItem;
}

function AlertCard({ alert }: AlertCardProps) {
  const styles = VARIANT_STYLES[alert.variant];

  return (
    <div className={cn("p-4 rounded-xl flex gap-4", styles.wrapper)}>
      <div
        className={cn(
          "size-10 rounded-full flex items-center justify-center shrink-0",
          styles.iconWrapper,
        )}
      >
        {/* Material Symbols via span con font cargada en index.html o index.css */}
        <span className="material-symbols-outlined text-xl">{alert.icon}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{alert.title}</p>
        <p className="text-xs text-muted-foreground">{alert.description}</p>
        {alert.actionLabel && (
          <button
            onClick={alert.onAction}
            className={cn(
              "mt-2 text-xs font-bold cursor-pointer hover:underline",
              styles.actionText,
            )}
          >
            {alert.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

interface AlertsPanelProps {
  alerts: AlertItem[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <CardTitle>Atención inmediata</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </CardContent>
    </Card>
  );
}
