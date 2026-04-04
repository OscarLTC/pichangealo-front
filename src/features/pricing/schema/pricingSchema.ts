import { z } from "zod";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;
const SLOTS = ["Día", "Tarde", "Noche"] as const;
const FIELD_TYPES = ["Fútbol 5", "Fútbol 6", "Fútbol 7", "Fútbol 11"] as const;

export const pricingRuleSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  price: z.number().min(0, "El precio no puede ser negativo."),
  priority: z.number().int().min(1, "La prioridad debe ser al menos 1."),
  active: z.boolean(),
  fieldIds: z.array(z.string()).optional(),
  fieldTypes: z.array(z.enum(FIELD_TYPES)).optional(),
  tags: z.array(z.string()).optional(),
  days: z.array(z.enum(DAYS)).optional(),
  timeSlots: z.array(z.enum(SLOTS)).optional(),
});

export type PricingRuleFormValues = z.infer<typeof pricingRuleSchema>;

export const operatingConfigSchema = z.object({
  days: z.array(z.enum(DAYS)).min(1, "Selecciona al menos un día."),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM inválido."),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM inválido."),
  timeSlots: z.array(
    z.object({
      name: z.enum(SLOTS),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
    })
  ),
});

export type OperatingConfigFormValues = z.infer<typeof operatingConfigSchema>;
