import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";

export type ReservationStatus = "Confirmado" | "Pendiente" | "Manual";
export type PaymentStatus = "Pagado" | string; // string para importes como "S/ 120"

export interface ReservationRow {
  id: string;
  time: string;
  customer: string;
  field: string;
  status: ReservationStatus;
  payment: PaymentStatus;
}

interface StatusBadgeProps {
  status: ReservationStatus;
}

const STATUS_STYLES: Record<ReservationStatus, string> = {
  Confirmado: "bg-blue-100 text-blue-700",
  Pendiente: "bg-orange-100 text-orange-700",
  Manual: "bg-gray-100 text-gray-700",
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-lg font-medium text-xs",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

interface UpcomingReservationsTableProps {
  reservations: ReservationRow[];
  onViewAll?: () => void;
}

export function UpcomingReservationsTable({
  reservations,
  onViewAll,
}: UpcomingReservationsTableProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border flex-row items-center justify-between">
        <CardTitle>Próximas reservas</CardTitle>
        <button
          onClick={onViewAll}
          className="text-brand font-bold text-sm hover:underline cursor-pointer"
        >
          Ver todas
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted text-muted-foreground text-[11px] uppercase tracking-wider font-bold">
              <th className="px-6 py-3">Hora</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Cancha</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Pago</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {reservations.map((row) => (
              <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-6 py-4 font-bold text-foreground">
                  {row.time}
                </td>
                <td className="px-6 py-4 text-foreground">{row.customer}</td>
                <td className="px-6 py-4 text-foreground">{row.field}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td
                  className={cn(
                    "px-6 py-4 font-medium",
                    row.payment === "Pagado"
                      ? "text-brand"
                      : "text-muted-foreground",
                  )}
                >
                  {row.payment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
