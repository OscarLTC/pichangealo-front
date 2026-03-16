import { z } from "zod";

export const fieldSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  type: z.enum(["Fútbol 5", "Fútbol 6", "Fútbol 7", "Fútbol 11"]),
  category: z.string().optional(),
  capacity: z.number().min(1, "La capacidad debe ser mayor a 0").optional(),
  basePrice: z.number().min(0, "El precio no puede ser negativo").optional(),
  state: z.enum(["Activa", "Inactiva", "Mantenimiento"]),
  internalNotes: z.string().optional(),
  maintenanceReason: z.string().optional()
});

export const refinedFieldSchema = fieldSchema.superRefine((data, ctx) => {
  if (data.state === "Mantenimiento" && (!data.maintenanceReason || data.maintenanceReason.trim() === "")) {
    ctx.addIssue({
      path: ["maintenanceReason"],
      message: "Debe especificar el motivo del mantenimiento.",
      code: z.ZodIssueCode.custom,
    });
  }
});

export type FieldFormValues = z.infer<typeof fieldSchema>;
