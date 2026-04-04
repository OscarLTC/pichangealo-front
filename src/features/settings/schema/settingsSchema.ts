import { z } from "zod";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;
const SLOTS = ["Día", "Tarde", "Noche"] as const;

export const venueInfoSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  address: z.string().min(1, "La dirección es obligatoria."),
  location: z.object({ lat: z.number(), lng: z.number() }).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
});

export type VenueInfoFormValues = z.infer<typeof venueInfoSchema>;

export const operatingConfigSchema = z.object({
  days: z.array(z.enum(DAYS)).min(1, "Selecciona al menos un día."),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM inválido."),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM inválido."),
  timeSlots: z.array(z.object({
    name: z.enum(SLOTS),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  })),
});

export type OperatingConfigFormValues = z.infer<typeof operatingConfigSchema>;

export const bookingRulesSchema = z.object({
  minAdvanceHours: z.number().int().min(0, "Debe ser 0 o más."),
  maxAdvanceDays: z.number().int().min(1, "Debe ser al menos 1 día."),
  minDurationMinutes: z.number().int().min(30, "Mínimo 30 minutos."),
  maxDurationMinutes: z.number().int().min(30, "Mínimo 30 minutos."),
  bufferMinutes: z.number().int().min(0, "Debe ser 0 o más."),
});

export type BookingRulesFormValues = z.infer<typeof bookingRulesSchema>;

export const cancellationPolicySchema = z.object({
  allowCancellation: z.boolean(),
  deadlineHours: z.number().int().min(0),
  penaltyType: z.enum(["none", "percentage", "fixed"]),
  penaltyValue: z.number().min(0),
  allowRefund: z.boolean(),
});

export type CancellationPolicyFormValues = z.infer<typeof cancellationPolicySchema>;
