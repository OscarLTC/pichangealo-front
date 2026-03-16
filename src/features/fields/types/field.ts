export type FieldState = 'Activa' | 'Inactiva' | 'Mantenimiento';
export type FieldType = 'Fútbol 5' | 'Fútbol 6' | 'Fútbol 7' | 'Fútbol 11';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  category?: string;
  state: FieldState;
  basePrice: number;
  operationalHint: string;
  imageUrl?: string;
  capacity?: number;
  internalNotes?: string;
  maintenanceReason?: string;
  nextReservation?: string;
}
