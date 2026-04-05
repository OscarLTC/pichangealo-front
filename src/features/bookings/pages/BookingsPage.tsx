import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { MOCK_FIELDS } from "@/features/fields/data/mock";
import type { Booking, BookingStatus } from "../types/booking";
import { MOCK_BOOKINGS } from "../data/mock";
import type { BookingFormValues } from "../schema/bookingSchema";
import { TimeGrid } from "../components/TimeGrid";
import { BookingFormModal } from "../components/BookingFormModal";
import { BookingDetailDrawer } from "../components/BookingDetailDrawer";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const diff = (d.getTime() - today.getTime()) / 86400000;
  const label = d.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (diff === 0) return `Hoy — ${label}`;
  if (diff === 1) return `Mañana — ${label}`;
  if (diff === -1) return `Ayer — ${label}`;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// ── Default operating hours (would come from settings) ───────────────────────
const OPEN_TIME = "08:00";
const CLOSE_TIME = "23:00";

// ── Component ────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  // ── Date state ─────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = toDateString(selectedDate);

  // ── Data state ─────────────────────────────────────────────────────────
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const activeFields = useMemo(
    () => MOCK_FIELDS.filter((f) => f.state === "Activa"),
    []
  );

  const dayBookings = useMemo(
    () => bookings.filter((b) => b.date === dateStr),
    [bookings, dateStr]
  );

  // ── Modal / drawer state ───────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [formDefaults, setFormDefaults] = useState<Partial<BookingFormValues>>({});

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleSlotClick = useCallback(
    (fieldId: string, startTime: string, endTime: string) => {
      setEditBooking(null);
      setFormDefaults({
        fieldId,
        date: dateStr,
        startTime,
        endTime,
        status: "Pendiente",
        amount: 0,
      });
      setFormOpen(true);
    },
    [dateStr]
  );

  const handleBookingClick = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  }, []);

  const handleBookingUpdate = useCallback(
    (bookingId: string, startTime: string, endTime: string) => {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, startTime, endTime } : b))
      );
    },
    []
  );

  const handleSave = useCallback(
    (values: BookingFormValues, bookingId?: string) => {
      if (bookingId) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  fieldId: values.fieldId,
                  client: {
                    name: values.clientName,
                    phone: values.clientPhone,
                    email: values.clientEmail || undefined,
                  },
                  date: values.date,
                  startTime: values.startTime,
                  endTime: values.endTime,
                  status: values.status,
                  amount: values.amount,
                  paymentMethod: values.paymentMethod,
                  notes: values.notes || undefined,
                }
              : b
          )
        );
      } else {
        const newBooking: Booking = {
          id: `b${Date.now()}`,
          fieldId: values.fieldId,
          client: {
            name: values.clientName,
            phone: values.clientPhone,
            email: values.clientEmail || undefined,
          },
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          status: values.status,
          amount: values.amount,
          paymentMethod: values.paymentMethod,
          notes: values.notes || undefined,
          createdAt: new Date().toISOString(),
        };
        setBookings((prev) => [...prev, newBooking]);
      }
    },
    []
  );

  const handleStatusChange = useCallback(
    (bookingId: string, status: BookingStatus) => {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      setSelectedBooking((prev) =>
        prev && prev.id === bookingId ? { ...prev, status } : prev
      );
    },
    []
  );

  const handleDelete = useCallback((bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    setDrawerOpen(false);
    setSelectedBooking(null);
  }, []);

  const handleEdit = useCallback((booking: Booking) => {
    setDrawerOpen(false);
    setEditBooking(booking);
    setFormDefaults({});
    setFormOpen(true);
  }, []);

  const selectedField = activeFields.find(
    (f) => f.id === selectedBooking?.fieldId
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedDate((d) => addDays(d, -1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-semibold gap-2"
            onClick={() => setSelectedDate(new Date())}
          >
            <CalendarDays className="w-4 h-4" />
            {formatDateLabel(selectedDate)}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Button
          className="bg-brand hover:bg-brand/90 text-white font-bold shadow-sm shadow-brand/20 gap-2"
          onClick={() => {
            setEditBooking(null);
            setFormDefaults({ date: dateStr, status: "Pendiente", amount: 0 });
            setFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Nueva Reserva
        </Button>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0">
        <TimeGrid
          fields={activeFields}
          bookings={dayBookings}
          openTime={OPEN_TIME}
          closeTime={CLOSE_TIME}
          onSlotClick={handleSlotClick}
          onBookingClick={handleBookingClick}
          onBookingUpdate={handleBookingUpdate}
        />
      </div>

      {/* Form modal */}
      <BookingFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        fields={activeFields}
        booking={editBooking}
        defaultValues={formDefaults}
        onSave={handleSave}
      />

      {/* Detail drawer */}
      <BookingDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        booking={selectedBooking}
        field={selectedField}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
