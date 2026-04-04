// ── Venue ────────────────────────────────────────────────────────────────────

export interface VenueLocation {
  lat: number;
  lng: number;
}

export interface VenueInfo {
  name: string;
  address: string;
  location?: VenueLocation;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

// ── Operating config ─────────────────────────────────────────────────────────

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
  openTime: string;
  closeTime: string;
  timeSlots: TimeSlot[];
}

// ── Booking rules ─────────────────────────────────────────────────────────────

export interface BookingRules {
  minAdvanceHours: number;
  maxAdvanceDays: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  bufferMinutes: number;
}

// ── Cancellation policy ───────────────────────────────────────────────────────

export type PenaltyType = "none" | "percentage" | "fixed";

export interface CancellationPolicy {
  allowCancellation: boolean;
  deadlineHours: number;
  penaltyType: PenaltyType;
  penaltyValue: number;
  allowRefund: boolean;
}

// ── Payment methods ───────────────────────────────────────────────────────────

export type PaymentMethodId = "cash" | "yape" | "plin" | "transfer" | "card";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  enabled: boolean;
  details?: string;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export type NotificationChannelId = "whatsapp" | "email";

export interface NotificationChannel {
  id: NotificationChannelId;
  enabled: boolean;
  contact: string;
}

export type NotificationEventId =
  | "booking_confirmed"
  | "booking_reminder"
  | "booking_cancelled"
  | "payment_received";

export interface NotificationEvent {
  id: NotificationEventId;
  label: string;
  description: string;
  enabled: boolean;
  reminderHours?: number;
}

export interface NotificationSettings {
  channels: NotificationChannel[];
  events: NotificationEvent[];
}

// ── Full settings ─────────────────────────────────────────────────────────────

export interface Settings {
  venue: VenueInfo;
  operating: OperatingConfig;
  booking: BookingRules;
  cancellation: CancellationPolicy;
  payments: PaymentMethod[];
  notifications: NotificationSettings;
}
