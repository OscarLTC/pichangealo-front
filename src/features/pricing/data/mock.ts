import type { PricingRule } from "../types/pricing";

export const MOCK_PRICING_RULES: PricingRule[] = [
  {
    id: "1",
    name: "Tarifa Nocturna",
    price: 55,
    priority: 10,
    active: true,
    timeSlots: ["Noche"],
  },
  {
    id: "2",
    name: "Fin de Semana",
    price: 60,
    priority: 8,
    active: true,
    days: ["Sábado", "Domingo"],
  },
  {
    id: "3",
    name: "Fútbol 11 Noche",
    price: 90,
    priority: 15,
    active: true,
    fieldTypes: ["Fútbol 11"],
    timeSlots: ["Noche"],
  },
  {
    id: "4",
    name: "Con Luz – Fin de Semana",
    price: 65,
    priority: 12,
    active: false,
    tags: ["Con luz"],
    days: ["Sábado", "Domingo"],
  },
];
