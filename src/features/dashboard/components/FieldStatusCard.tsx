import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/components/ui/card";

export type FieldStatus = "Ocupada" | "Libre" | "Bloqueada";

export interface FieldStatusData {
  id: string;
  name: string;
  status: FieldStatus;
  statusDetail: string;
  dailyOccupancy: number;
}

const STATUS_DOT: Record<FieldStatus, string> = {
  Ocupada: "bg-brand",
  Libre: "bg-slate-200",
  Bloqueada: "bg-slate-800",
};

interface FieldStatusCardProps {
  field: FieldStatusData;
}

export function FieldStatusCard({ field }: FieldStatusCardProps) {
  const { name, status, statusDetail, dailyOccupancy } = field;
  const isBlocked = status === "Bloqueada";

  return (
    <Card className={cn("p-5", isBlocked && "opacity-60")}>
      <div className="flex justify-between mb-4">
        <span className="text-xs font-bold uppercase text-muted-foreground">
          {name}
        </span>
        <span className={cn("size-2.5 rounded-full", STATUS_DOT[status])} />
      </div>

      <h5 className="text-sm font-bold text-foreground mb-1">{status}</h5>
      <p className="text-xs text-muted-foreground mb-4">{statusDetail}</p>

      <div className="w-full bg-muted h-1.5 rounded-full mb-1">
        <div
          className="bg-brand h-full rounded-full transition-all"
          style={{ width: `${dailyOccupancy}%` }}
        />
      </div>
      <p className="text-[10px] font-bold text-muted-foreground">
        {dailyOccupancy}% ocupación diaria
      </p>
    </Card>
  );
}
