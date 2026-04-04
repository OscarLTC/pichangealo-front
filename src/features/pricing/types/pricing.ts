import type { FieldType } from "@/features/fields/types/field";

export type DayOfWeek =
  | "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes"
  | "Sábado" | "Domingo";

export type TimeSlotName = "Día" | "Tarde" | "Noche";

export interface TimeSlot {
  name: TimeSlotName;
  startTime: string; // "HH:MM"
  endTime: string;
}

export interface OperatingConfig {
  days: DayOfWeek[];
  openTime: string;  // "HH:MM"
  closeTime: string; // "HH:MM"
  timeSlots: TimeSlot[];
}

export interface PricingRule {
  id: string;
  name: string;
  price: number;
  priority: number;   // higher = takes precedence
  active: boolean;
  // All conditions optional — empty means "applies to all"
  fieldIds?: string[];
  fieldTypes?: FieldType[];
  tags?: string[];
  days?: DayOfWeek[];
  timeSlots?: TimeSlotName[];
}
