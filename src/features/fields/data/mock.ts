import type { Field } from "../types/field";

export const MOCK_FIELDS: Field[] = [
  {
    id: "1",
    name: "La Bombonera",
    type: "Fútbol 7",
    category: "Techada",
    tags: ["Con luz", "Techada", "Vestuarios"],
    state: "Activa",
    basePrice: 40,
    operationalHint: "Libre ahora",
    imageUrl:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop",
    capacity: 14,
    internalNotes: "Balones en custodia central",
    nextReservation: "Hoy, 19:00 - 20:00 (Juan Pérez)",
  },
  {
    id: "2",
    name: "El Camp Nou",
    type: "Fútbol 5",
    tags: ["Sintética"],
    state: "Inactiva",
    basePrice: 30,
    operationalHint: "Cerrada",
    imageUrl:
      "https://images.unsplash.com/photo-1602432141202-e8b683524997?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Wembley",
    type: "Fútbol 11",
    category: "Principal",
    tags: ["Con luz", "Natural", "Estacionamiento"],
    state: "Activa",
    basePrice: 80,
    operationalHint: "Próxima reserva en 2h",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1684106554193-89dcabcd600b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Maracaná 2",
    type: "Fútbol 7",
    tags: ["Sintética", "Con luz"],
    state: "Mantenimiento",
    basePrice: 45,
    operationalHint: "En mantenimiento",
    imageUrl:
      "https://images.unsplash.com/photo-1531861218190-f90c89febf69?q=80&w=600&auto=format&fit=crop",
    maintenanceReason: "Reparación de malla lateral",
  },
];
