import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import type { Field } from "../types/field";
import { Button } from "@/shared/components/ui/button";
import { Calendar, Tag, Activity, Settings2, Edit2, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface FieldDetailDrawerProps {
  field: Field | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (field: Field) => void;
}

export function FieldDetailDrawer({ field, isOpen, onClose, onEdit }: FieldDetailDrawerProps) {
  if (!field) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6 mt-4">
          <SheetTitle className="text-2xl font-bold">{field.name}</SheetTitle>
          <SheetDescription className="text-base text-muted-foreground flex items-center gap-2 mt-1">
            <Tag className="w-4 h-4" />
            {field.type} {field.category ? `• ${field.category}` : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Image */}
          {field.imageUrl ? (
            <div className="w-full h-48 rounded-xl bg-center bg-cover border" style={{ backgroundImage: `url(${field.imageUrl})` }} />
          ) : (
            <div className="w-full h-48 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-dashed text-slate-400">
              Sin imagen de portada
            </div>
          )}

          {/* Core Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Estado</p>
              <div className="flex items-center gap-2 font-medium">
                {field.state === 'Activa' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {field.state === 'Mantenimiento' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                {field.state === 'Inactiva' && <Clock className="w-4 h-4 text-slate-500" />}
                {field.state}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Precio Base</p>
              <div className="font-bold text-lg">
                S/{field.basePrice.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/hr</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg border-b pb-2">Información Operativa</h4>
            
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Disponibilidad Actual</p>
                <p className="text-sm text-muted-foreground">{field.operationalHint}</p>
              </div>
            </div>
            
            {field.nextReservation && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Próxima Reserva</p>
                  <p className="text-sm text-muted-foreground">{field.nextReservation}</p>
                </div>
              </div>
            )}

            {field.maintenanceReason && field.state === 'Mantenimiento' && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-amber-800 dark:text-amber-200">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Motivo de Mantenimiento</p>
                  <p className="text-sm">{field.maintenanceReason}</p>
                </div>
              </div>
            )}

            {field.internalNotes && (
              <div className="flex items-start gap-3">
                <Settings2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Notas Internas</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{field.internalNotes}</p>
                </div>
              </div>
            )}
            
            {!field.internalNotes && field.state !== 'Mantenimiento' && !field.nextReservation && (
              <p className="text-sm text-muted-foreground italic">No hay notas operativas adicionales.</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1 gap-2" variant="outline" onClick={() => onEdit(field)}>
              <Edit2 className="w-4 h-4" /> Editar Cancha
            </Button>
            <Button className="flex-1 gap-2 bg-brand hover:bg-brand/90 text-white">
              <Calendar className="w-4 h-4" /> Ver Agenda
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
