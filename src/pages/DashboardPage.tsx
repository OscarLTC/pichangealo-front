import { useNavigate } from "react-router";
import {
  KpiCard,
  NextReservationBanner,
  OccupancyChart,
  UpcomingReservationsTable,
  AlertsPanel,
  FieldStatusCard,
  CashSummary,
  QuickActions,
} from "@/components/dashboard";
import type {
  KpiCardProps,
  NextReservationData,
  HourBarData,
  ReservationRow,
  AlertItem,
  FieldStatusData,
  PaymentMethodRow,
  QuickActionItem,
} from "@/components/dashboard";

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: reemplazar con hooks de API (useQuery / SWR) cuando el backend esté listo

const KPI_CARDS: KpiCardProps[] = [
  {
    label: "Reservas hoy",
    value: "12",
    badge: { text: "+20%", variant: "positive" },
  },
  {
    label: "Cobrado hoy",
    value: "S/ 1,180",
    badge: { text: "+12%", variant: "positive" },
  },
  {
    label: "Pendiente por cobrar",
    value: "S/ 270",
    badge: { text: "3 reservas", variant: "neutral" },
  },
  {
    label: "Ocupación de hoy",
    value: "85%",
    badge: { text: "+5%", variant: "positive" },
  },
];

const NEXT_RESERVATION: NextReservationData = {
  customerName: "Juan Pérez",
  time: "18:00",
  field: "Cancha 1",
  sport: "Fútbol 7",
  status: "Confirmada",
  startsInMinutes: 25,
};

const OCCUPANCY_BARS: HourBarData[] = [
  { hour: "15h", occupancy: 50 },
  { hour: "16h", occupancy: 65 },
  { hour: "17h", occupancy: 75 },
  { hour: "18h", occupancy: 100 },
  { hour: "19h", occupancy: 90 },
  { hour: "20h", occupancy: 95 },
  { hour: "21h", occupancy: 80 },
];

const UPCOMING_RESERVATIONS: ReservationRow[] = [
  {
    id: "res-1",
    time: "19:00",
    customer: "Carlos Medina",
    field: "Cancha 2",
    status: "Confirmado",
    payment: "Pagado",
  },
  {
    id: "res-2",
    time: "19:30",
    customer: "Maria Torres",
    field: "Cancha 1",
    status: "Pendiente",
    payment: "S/ 120",
  },
  {
    id: "res-3",
    time: "20:00",
    customer: "Roberto Ruiz",
    field: "Cancha 3",
    status: "Confirmado",
    payment: "Pagado",
  },
  {
    id: "res-4",
    time: "21:00",
    customer: "Gimnasio FC",
    field: "Cancha 4",
    status: "Confirmado",
    payment: "S/ 90",
  },
  {
    id: "res-5",
    time: "21:30",
    customer: "Lucia Ramos",
    field: "Cancha 2",
    status: "Manual",
    payment: "Pagado",
  },
];

const ALERTS: AlertItem[] = [
  {
    id: "alert-1",
    variant: "warning",
    icon: "pending_actions",
    title: "Confirmaciones pendientes",
    description: "4 reservas de Yape sin validar",
    actionLabel: "Revisar ahora",
  },
  {
    id: "alert-2",
    variant: "danger",
    icon: "payments",
    title: "Pagos vencidos",
    description: "S/ 150 pendientes de ayer",
    actionLabel: "Ver reporte",
  },
  {
    id: "alert-3",
    variant: "neutral",
    icon: "construction",
    title: "Bloqueos programados",
    description: "Cancha 4: Mantenimiento (Hoy 12:00)",
  },
];

const FIELDS: FieldStatusData[] = [
  {
    id: "field-1",
    name: "Cancha 1",
    status: "Ocupada",
    statusDetail: "42m restantes",
    dailyOccupancy: 85,
  },
  {
    id: "field-2",
    name: "Cancha 2",
    status: "Libre",
    statusDetail: "Disponible ahora",
    dailyOccupancy: 60,
  },
  {
    id: "field-3",
    name: "Cancha 3",
    status: "Ocupada",
    statusDetail: "12m restantes",
    dailyOccupancy: 92,
  },
  {
    id: "field-4",
    name: "Cancha 4",
    status: "Bloqueada",
    statusDetail: "Mantenimiento",
    dailyOccupancy: 45,
  },
];

const CASH_ROWS: PaymentMethodRow[] = [
  {
    id: "pay-1",
    label: "Efectivo",
    icon: "local_atm",
    iconStyle: "bg-green-100 text-green-600",
    amount: "S/ 450",
  },
  {
    id: "pay-2",
    label: "Yape",
    icon: "qr_code_2",
    iconStyle: "bg-indigo-100 text-indigo-600",
    amount: "S/ 480",
  },
  {
    id: "pay-3",
    label: "Plin",
    icon: "touch_app",
    iconStyle: "bg-cyan-100 text-cyan-600",
    amount: "S/ 130",
  },
  {
    id: "pay-4",
    label: "Tarjeta",
    icon: "credit_card",
    iconStyle: "bg-blue-100 text-blue-600",
    amount: "S/ 120",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();

  const quickActions: QuickActionItem[] = [
    {
      id: "qa-1",
      icon: "block",
      label: "Bloquear horario",
      onClick: () => navigate("/canchas"),
    },
    {
      id: "qa-2",
      icon: "payments",
      label: "Pago manual",
      onClick: () => navigate("/reservas"),
    },
    {
      id: "qa-3",
      icon: "schedule",
      label: "Editar horarios",
      onClick: () => navigate("/configuracion"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Section A: KPI Row */}
      <section
        aria-label="Métricas del día"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {KPI_CARDS.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section aria-label="Próxima reserva">
            <NextReservationBanner
              reservation={NEXT_RESERVATION}
              onViewDetails={() => navigate("/reservas")}
            />
          </section>

          <section aria-label="Ocupación por horas">
            <OccupancyChart
              bars={OCCUPANCY_BARS}
              peakLabel="Peak: 19:00 - 21:00"
            />
          </section>

          {/* Section D: Upcoming reservations */}
          <section aria-label="Próximas reservas">
            <UpcomingReservationsTable
              reservations={UPCOMING_RESERVATIONS}
              onViewAll={() => navigate("/reservas")}
            />
          </section>

          {/* Section F: Field status grid */}
          <section aria-label="Estado de canchas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FIELDS.map((field) => (
                <FieldStatusCard key={field.id} field={field} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Section E: Alerts */}
          <section aria-label="Atención inmediata">
            <AlertsPanel alerts={ALERTS} />
          </section>

          {/* Section G: Cash summary */}
          <section aria-label="Resumen de caja">
            <CashSummary rows={CASH_ROWS} total="S/ 1,180" />
          </section>

          {/* Section H: Quick actions */}
          <section aria-label="Acciones rápidas">
            <QuickActions actions={quickActions} />
          </section>
        </div>
      </div>
    </div>
  );
}
