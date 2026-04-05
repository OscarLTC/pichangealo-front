import { Clock, User, Phone, Mail, StickyNote, CreditCard, CalendarDays } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import type { Booking, BookingStatus } from "../types/booking";
import type { Field } from "@/features/fields/types/field";

// ── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bgBadge: string }> = {
  Pendiente:    { label: "Pendiente",   color: "bg-amber-400",          bgBadge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200" },
  Confirmada:   { label: "Confirmada",  color: "bg-emerald-500",        bgBadge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" },
  "En Curso":   { label: "En Curso",    color: "bg-blue-500",           bgBadge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200" },
  Completada:   { label: "Completada",  color: "bg-muted-foreground",   bgBadge: "bg-muted text-muted-foreground" },
  Cancelada:    { label: "Cancelada",   color: "bg-red-500",            bgBadge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200" },
  "No Asistió": { label: "No Asistió",  color: "bg-muted-foreground",   bgBadge: "bg-muted text-muted-foreground" },
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Efectivo",
  yape: "Yape",
  plin: "Plin",
  transfer: "Transferencia",
  card: "Tarjeta",
};

const QUICK_ACTIONS: { from: BookingStatus; actions: { label: string; to: BookingStatus; variant: "default" | "outline" }[] }[] = [
  { from: "Pendiente",  actions: [{ label: "Confirmar",   to: "Confirmada", variant: "default" }, { label: "Cancelar", to: "Cancelada", variant: "outline" }] },
  { from: "Confirmada", actions: [{ label: "Iniciar",     to: "En Curso",   variant: "default" }, { label: "No Asistió", to: "No Asistió", variant: "outline" }, { label: "Cancelar", to: "Cancelada", variant: "outline" }] },
  { from: "En Curso",   actions: [{ label: "Completar",   to: "Completada", variant: "default" }] },
];

// ── Props ────────────────────────────────────────────────────────────────────

interface BookingDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  field?: Field;
  onEdit: (booking: Booking) => void;
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
  onDelete: (bookingId: string) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function BookingDetailDrawer({
  open,
  onOpenChange,
  booking,
  field,
  onEdit,
  onStatusChange,
  onDelete,
}: BookingDetailDrawerProps) {
  if (!booking) return null;

  const statusCfg = STATUS_CONFIG[booking.status];
  const quickActions = QUICK_ACTIONS.find((qa) => qa.from === booking.status)?.actions ?? [];
  const isInactive = booking.status === "Cancelada" || booking.status === "No Asistió" || booking.status === "Completada";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-6 pr-12 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className={cn("w-3 h-3 rounded-full shrink-0", statusCfg.color)} />
            <SheetTitle className="text-lg font-bold truncate">
              {booking.client.name}
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">Detalles de la reserva</SheetDescription>
          <Badge className={cn("w-fit text-xs font-medium border-0 mt-1", statusCfg.bgBadge)}>
            {statusCfg.label}
          </Badge>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
          {/* Quick status actions */}
          {quickActions.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.to}
                    size="sm"
                    variant={action.variant}
                    className={cn(
                      action.variant === "default" && "bg-brand hover:bg-brand/90 text-white",
                      action.to === "Cancelada" && "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    )}
                    onClick={() => onStatusChange(booking.id, action.to)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Booking details */}
          <div className="space-y-4">
            <DetailRow icon={CalendarDays} label="Fecha" value={booking.date} />
            <DetailRow icon={Clock} label="Horario" value={`${booking.startTime} – ${booking.endTime}`} />
            {field && (
              <DetailRow
                icon={CalendarDays}
                label="Cancha"
                value={`${field.name} (${field.type})`}
              />
            )}
          </div>

          <Separator />

          {/* Client */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cliente
            </p>
            <DetailRow icon={User} label="Nombre" value={booking.client.name} />
            <DetailRow icon={Phone} label="Teléfono" value={booking.client.phone} />
            <DetailRow icon={Mail} label="Email" value={booking.client.email} />
          </div>

          <Separator />

          {/* Payment */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pago
            </p>
            <DetailRow
              icon={CreditCard}
              label="Monto"
              value={`S/ ${booking.amount.toFixed(2)}`}
            />
            {booking.paymentMethod && (
              <DetailRow
                icon={CreditCard}
                label="Método"
                value={PAYMENT_LABELS[booking.paymentMethod] ?? booking.paymentMethod}
              />
            )}
            {booking.paidAt && (
              <DetailRow
                icon={Clock}
                label="Pagado"
                value={new Date(booking.paidAt).toLocaleString("es-PE")}
              />
            )}
          </div>

          {/* Notes */}
          {booking.notes && (
            <>
              <Separator />
              <DetailRow icon={StickyNote} label="Notas" value={booking.notes} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 bg-muted/50 border-t border-border flex items-center gap-3">
          {!isInactive && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onEdit(booking)}
            >
              Editar
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(booking.id)}
          >
            Eliminar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
