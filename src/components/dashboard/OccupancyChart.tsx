import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface HourBarData {
  hour: string;
  /** Porcentaje de ocupación: 0 – 100 */
  occupancy: number;
}

interface OccupancyChartProps {
  bars: HourBarData[];
  peakLabel?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const PERIOD_OPTIONS = ["Hoy", "Semana"] as const;

/** Convierte un porcentaje en una clase de altura de Tailwind aproximada */
function getHeightClass(occupancy: number): string {
  if (occupancy >= 95) return "h-[95%]";
  if (occupancy >= 90) return "h-[90%]";
  if (occupancy >= 80) return "h-[80%]";
  if (occupancy >= 75) return "h-3/4";
  if (occupancy >= 65) return "h-2/3";
  if (occupancy >= 50) return "h-1/2";
  return "h-1/2";
}

/** El color de la barra se satura cuanto mayor es la ocupación */
function getBarColorClass(occupancy: number): string {
  if (occupancy < 40) return "bg-brand/20";
  if (occupancy < 60) return "bg-brand/40";
  if (occupancy < 75) return "bg-brand/60";
  return "bg-brand";
}

export function OccupancyChart({
  bars,
  peakLabel,
  period = "Hoy",
  onPeriodChange,
}: OccupancyChartProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between p-8 pb-6">
        <div>
          <CardTitle>Ocupación por horas</CardTitle>
          {peakLabel && <CardDescription>{peakLabel}</CardDescription>}
        </div>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <div className="flex items-end justify-between h-48 px-2 gap-2">
          {bars.map(({ hour, occupancy }) => {
            const isPeak = occupancy >= 90;
            return (
              <div
                key={hour}
                className="flex flex-col items-center gap-3 w-full"
              >
                <div className="w-full bg-muted rounded-lg h-24 relative overflow-hidden">
                  <div
                    className={cn(
                      "absolute bottom-0 w-full rounded-lg transition-all",
                      getBarColorClass(occupancy),
                      getHeightClass(occupancy),
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-bold uppercase",
                    isPeak ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {hour}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
