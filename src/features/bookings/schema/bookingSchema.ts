import { z } from "zod";

const TIME_REGEX = /^\d{2}:\d{2}$/;
const STATUSES = [
  "Pendiente", "Confirmada", "En Curso", "Completada", "Cancelada", "No Asistió",
] as const;
const PAYMENT_METHODS = ["cash", "yape", "plin", "transfer", "card"] as const;

export const bookingSchema = z.object({
  fieldId: z.string().min(1, "Selecciona una cancha."),
  clientName: z.string().min(1, "El nombre es obligatorio."),
  clientPhone: z.string().min(6, "Ingresa un teléfono válido."),
  clientEmail: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida."),
  startTime: z.string().regex(TIME_REGEX, "Hora inválida."),
  endTime: z.string().regex(TIME_REGEX, "Hora inválida."),
  status: z.enum(STATUSES),
  amount: z.number().min(0, "El monto no puede ser negativo."),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  notes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
