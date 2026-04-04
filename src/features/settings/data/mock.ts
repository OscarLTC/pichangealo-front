import type { Settings } from "../types/settings";

export const MOCK_SETTINGS: Settings = {
  venue: {
    name: "Pichangealo Sports Center",
    address: "Av. Javier Prado Este 4200, Santiago de Surco, Lima",
    location: { lat: -12.0978, lng: -77.0174 },
    phone: "987654321",
    whatsapp: "987654321",
    instagram: "pichangealo",
    facebook: "pichangealo",
    tiktok: "",
  },

  operating: {
    days: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    openTime: "08:00",
    closeTime: "23:00",
    timeSlots: [
      { name: "Día",   startTime: "08:00", endTime: "13:00" },
      { name: "Tarde", startTime: "13:00", endTime: "18:00" },
      { name: "Noche", startTime: "18:00", endTime: "23:00" },
    ],
  },

  booking: {
    minAdvanceHours: 2,
    maxAdvanceDays: 30,
    minDurationMinutes: 60,
    maxDurationMinutes: 120,
    bufferMinutes: 0,
  },

  cancellation: {
    allowCancellation: true,
    deadlineHours: 24,
    penaltyType: "none",
    penaltyValue: 0,
    allowRefund: true,
  },

  payments: [
    { id: "cash",     label: "Efectivo",             enabled: true,  details: "" },
    { id: "yape",     label: "Yape",                 enabled: true,  details: "987654321" },
    { id: "plin",     label: "Plin",                 enabled: true,  details: "987654321" },
    { id: "transfer", label: "Transferencia Bancaria", enabled: true, details: "BCP - Cta. Cte. 123-456789-0-12" },
    { id: "card",     label: "Tarjeta de Crédito/Débito", enabled: false, details: "" },
  ],

  notifications: {
    channels: [
      { id: "whatsapp", enabled: true,  contact: "987654321" },
      { id: "email",    enabled: false, contact: "" },
    ],
    events: [
      { id: "booking_confirmed",  label: "Confirmación de reserva", description: "Al confirmar una nueva reserva.",       enabled: true  },
      { id: "booking_reminder",   label: "Recordatorio",            description: "Horas antes del inicio del turno.",     enabled: true,  reminderHours: 2 },
      { id: "booking_cancelled",  label: "Cancelación",             description: "Cuando se cancela una reserva.",        enabled: true  },
      { id: "payment_received",   label: "Pago recibido",           description: "Al registrar un pago en el sistema.",   enabled: false },
    ],
  },
};
