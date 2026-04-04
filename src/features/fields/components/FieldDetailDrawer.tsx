import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet";
import type { Field } from "../types/field";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Calendar,
  Tag,
  Activity,
  Settings2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Footprints,
  Users,
  Trash2,
} from "lucide-react";

interface FieldDetailDrawerProps {
  field: Field | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (field: Field) => void;
  onDelete: (field: Field) => void;
}

export function FieldDetailDrawer({
  field,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: FieldDetailDrawerProps) {
  if (!field) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] p-0 flex flex-col"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 pr-12 space-y-8">
            <div>
              <SheetTitle className="text-2xl font-bold leading-tight">
                {field.name}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1.5 text-base">
                <Tag className="w-4 h-4 shrink-0" />
                {field.type}
                {field.category && ` · ${field.category}`}
              </SheetDescription>
            </div>

            {field.imageUrl ? (
              <div
                className="w-full h-48 rounded-xl bg-center bg-cover border"
                style={{ backgroundImage: `url(${field.imageUrl})` }}
              />
            ) : (
              <div className="w-full h-48 rounded-xl bg-muted flex flex-col items-center justify-center gap-2 border border-dashed text-muted-foreground/40">
                <Footprints className="w-10 h-10" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  {field.type}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">
                  Estado
                </p>
                <div className="flex items-center gap-2 font-medium text-sm">
                  {field.state === "Activa" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  {field.state === "Mantenimiento" && (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  {field.state === "Inactiva" && (
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  {field.state}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">
                  Precio Base
                </p>
                <p className="font-bold text-lg leading-none">
                  S/{field.basePrice}
                  <span className="text-sm font-normal text-muted-foreground">
                    /hr
                  </span>
                </p>
              </div>

              {field.capacity && (
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">
                    Capacidad
                  </p>
                  <div className="flex items-center gap-2 font-medium text-sm">
                    <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                    {field.capacity} jugadores
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Información Operativa
              </h4>

              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Disponibilidad Actual</p>
                  <p className="text-sm text-muted-foreground">
                    {field.operationalHint}
                  </p>
                </div>
              </div>

              {field.nextReservation && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Próxima Reserva</p>
                    <p className="text-sm text-muted-foreground">
                      {field.nextReservation}
                    </p>
                  </div>
                </div>
              )}

              {field.maintenanceReason && field.state === "Mantenimiento" && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-800 dark:text-amber-200">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      Motivo de Mantenimiento
                    </p>
                    <p className="text-sm">{field.maintenanceReason}</p>
                  </div>
                </div>
              )}

              {field.internalNotes && (
                <div className="flex items-start gap-3">
                  <Settings2 className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Notas Internas</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {field.internalNotes}
                    </p>
                  </div>
                </div>
              )}

              {!field.internalNotes &&
                field.state !== "Mantenimiento" &&
                !field.nextReservation && (
                  <p className="text-sm text-muted-foreground italic">
                    No hay notas operativas adicionales.
                  </p>
                )}
            </div>
          </div>
        </div>

        <div className="shrink-0 p-6 border-t flex gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
            onClick={() => onDelete(field)}
            title="Eliminar cancha"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            className="flex-1 gap-2"
            variant="outline"
            onClick={() => onEdit(field)}
          >
            <Edit2 className="w-4 h-4" />
            Editar Cancha
          </Button>
          <Button className="flex-1 gap-2 bg-brand hover:bg-brand/90 text-white">
            <Calendar className="w-4 h-4" />
            Ver Agenda
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
