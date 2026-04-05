import type { PaymentMethodId } from "@/features/settings/types/settings";

export type BookingStatus =
  | "Pendiente"
  | "Confirmada"
  | "En Curso"
  | "Completada"
  | "Cancelada"
  | "No Asistió";

export interface BookingClient {
  name: string;
  phone: string;
  email?: string;
}

export interface Booking {
  id: string;
  fieldId: string;
  client: BookingClient;
  date: string;          // "YYYY-MM-DD"
  startTime: string;     // "HH:MM"
  endTime: string;       // "HH:MM"
  status: BookingStatus;
  amount: number;
  paymentMethod?: PaymentMethodId;
  paidAt?: string;       // ISO datetime
  notes?: string;
  createdAt: string;     // ISO datetime
}

// ── Grid helpers ──────────────────────────────────────────────────────────────

/** Minutes from midnight → "HH:MM" */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** "HH:MM" → minutes from midnight */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Calculate booking duration in grid slots (each slot = 15 min) */
export function bookingSlotSpan(booking: Booking): number {
  return (timeToMinutes(booking.endTime) - timeToMinutes(booking.startTime)) / 15;
}

/** Slot index from time (0-based, relative to grid start) */
export function timeToSlotIndex(time: string, gridStartTime: string): number {
  return (timeToMinutes(time) - timeToMinutes(gridStartTime)) / 15;
}
