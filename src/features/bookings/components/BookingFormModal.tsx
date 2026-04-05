import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, Mail, StickyNote, Clock, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import type { Field } from "@/features/fields/types/field";
import type { Booking, BookingStatus } from "../types/booking";
import { bookingSchema, type BookingFormValues } from "../schema/bookingSchema";

// ── Constants ────────────────────────────────────────────────────────────────

const STATUSES: { value: BookingStatus; label: string; color: string }[] = [
  { value: "Pendiente",   label: "Pendiente",   color: "bg-amber-400" },
  { value: "Confirmada",  label: "Confirmada",  color: "bg-emerald-500" },
  { value: "En Curso",    label: "En Curso",    color: "bg-blue-500" },
  { value: "Completada",  label: "Completada",  color: "bg-muted-foreground" },
  { value: "Cancelada",   label: "Cancelada",   color: "bg-red-500" },
  { value: "No Asistió",  label: "No Asistió",  color: "bg-muted-foreground" },
];

const PAYMENT_METHODS = [
  { value: "cash",     label: "Efectivo" },
  { value: "yape",     label: "Yape" },
  { value: "plin",     label: "Plin" },
  { value: "transfer", label: "Transferencia" },
  { value: "card",     label: "Tarjeta" },
] as const;

const lbl = "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

// ── Props ────────────────────────────────────────────────────────────────────

interface BookingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: Field[];
  booking?: Booking | null;
  defaultValues?: Partial<BookingFormValues>;
  onSave: (values: BookingFormValues, bookingId?: string) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export function BookingFormModal({
  open,
  onOpenChange,
  fields,
  booking,
  defaultValues,
  onSave,
}: BookingFormModalProps) {
  const isEdit = !!booking;

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fieldId: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      date: new Date().toISOString().slice(0, 10),
      startTime: "08:00",
      endTime: "09:00",
      status: "Pendiente",
      amount: 0,
      notes: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (booking) {
      form.reset({
        fieldId: booking.fieldId,
        clientName: booking.client.name,
        clientPhone: booking.client.phone,
        clientEmail: booking.client.email ?? "",
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        amount: booking.amount,
        paymentMethod: booking.paymentMethod,
        notes: booking.notes ?? "",
      });
    } else {
      form.reset({
        fieldId: "",
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        date: new Date().toISOString().slice(0, 10),
        startTime: "08:00",
        endTime: "09:00",
        status: "Pendiente",
        amount: 0,
        notes: "",
        ...defaultValues,
      });
    }
  }, [open, booking, defaultValues, form]);

  function handleSubmit(values: BookingFormValues) {
    onSave(values, booking?.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="px-8 pt-8 pb-4 shrink-0">
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Editar Reserva" : "Nueva Reserva"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEdit
              ? "Modifica los datos de la reserva."
              : "Completa los datos para crear una reserva."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-8 py-4">
          <Form {...form}>
            <form id="booking-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              {/* Field + Date row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fieldId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={lbl}>Cancha</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fields.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={lbl}>Fecha</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Time row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={lbl}>Hora Inicio</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                          <Input type="time" step={900} {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={lbl}>Hora Fin</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                          <Input type="time" step={900} {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Client info */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Datos del cliente
              </p>

              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={lbl}>Nombre</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <Input placeholder="Juan Pérez" {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={lbl}>Teléfono</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                          <Input placeholder="987 654 321" {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={lbl}>Email (opcional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                          <Input placeholder="correo@email.com" {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Status + Payment */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={lbl}>Estado</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                                {s.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={lbl}>Monto (S/)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                          <Input
                            type="number"
                            min={0}
                            step={5}
                            placeholder="0"
                            className="pl-9"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={lbl}>Método de pago (opcional)</FormLabel>
                    <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v || undefined)}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sin especificar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_METHODS.map((pm) => (
                          <SelectItem key={pm.value} value={pm.value}>
                            {pm.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={lbl}>Notas (opcional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <StickyNote className="absolute left-3 top-3 w-4 h-4 text-muted-foreground z-10" />
                        <Textarea
                          placeholder="Información adicional…"
                          rows={2}
                          {...field}
                          className="pl-9 resize-none"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-muted/50 border-t border-border shrink-0 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="booking-form"
            className="bg-brand hover:bg-brand/90 text-white font-bold shadow-sm shadow-brand/20"
          >
            {isEdit ? "Guardar Cambios" : "Crear Reserva"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
