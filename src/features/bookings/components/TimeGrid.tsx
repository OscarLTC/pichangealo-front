import { useRef, useCallback, useState, useEffect, useMemo } from "react";
import { cn } from "@/shared/lib/utils";
import type { Field } from "@/features/fields/types/field";
import type { Booking } from "../types/booking";
import { minutesToTime, timeToMinutes } from "../types/booking";
import { BookingBlock } from "./BookingBlock";

const SLOT_MINUTES = 15;
const SLOT_WIDTH = 48; // px per 15-min slot (horizontal)
const FIELD_ROW_HEIGHT = 64; // px per field row
const HEADER_HEIGHT = 40; // top time-label header row
const FIELD_LABEL_WIDTH = 140; // left field-name column

interface TimeGridProps {
  fields: Field[];
  bookings: Booking[];
  openTime: string;
  closeTime: string;
  onSlotClick: (fieldId: string, startTime: string, endTime: string) => void;
  onBookingClick: (booking: Booking) => void;
  onBookingUpdate: (
    bookingId: string,
    startTime: string,
    endTime: string,
  ) => void;
}

interface DragState {
  booking: Booking;
  type: "move" | "resize";
  originalStart: number;
  originalEnd: number;
  deltaSlots: number;
}

interface SelectionState {
  fieldId: string;
  startSlot: number;
  endSlot: number;
}

function generateTimeSlots(openTime: string, closeTime: string) {
  const start = timeToMinutes(openTime);
  const end = timeToMinutes(closeTime);
  const slots: { minutes: number; label: string }[] = [];
  for (let m = start; m < end; m += SLOT_MINUTES) {
    slots.push({ minutes: m, label: minutesToTime(m) });
  }
  return slots;
}

function getNowOffset(openTime: string, closeTime: string): number | null {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = timeToMinutes(openTime);
  const endMin = timeToMinutes(closeTime);
  if (nowMin < startMin || nowMin > endMin) return null;
  return FIELD_LABEL_WIDTH + ((nowMin - startMin) / SLOT_MINUTES) * SLOT_WIDTH;
}

export function TimeGrid({
  fields,
  bookings,
  openTime,
  closeTime,
  onSlotClick,
  onBookingClick,
  onBookingUpdate,
}: TimeGridProps) {
  const slots = generateTimeSlots(openTime, closeTime);
  const totalSlots = slots.length;
  const scrollRef = useRef<HTMLDivElement>(null);

  const [nowOffset, setNowOffset] = useState<number | null>(() =>
    getNowOffset(openTime, closeTime),
  );

  useEffect(() => {
    const update = () => setNowOffset(getNowOffset(openTime, closeTime));
    update();
    const id = setInterval(update, 60_000); // update every minute
    return () => clearInterval(id);
  }, [openTime, closeTime]);

  useEffect(() => {
    if (nowOffset != null && scrollRef.current) {
      scrollRef.current.scrollLeft = Math.max(
        0,
        nowOffset - scrollRef.current.clientWidth / 3,
      );
    }
  }, []);

  const [dragState, setDragState] = useState<DragState | null>(null);

  const handleDragStart = useCallback(
    (booking: Booking, type: "move" | "resize") => {
      setDragState({
        booking,
        type,
        originalStart: timeToMinutes(booking.startTime),
        originalEnd: timeToMinutes(booking.endTime),
        deltaSlots: 0,
      });
    },
    [],
  );

  const handleDragMove = useCallback((deltaSlots: number) => {
    setDragState((prev) => (prev ? { ...prev, deltaSlots } : null));
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!dragState) return;
    const { booking, type, originalStart, originalEnd, deltaSlots } = dragState;
    const deltaMin = deltaSlots * SLOT_MINUTES;
    const gridStart = timeToMinutes(openTime);
    const gridEnd = timeToMinutes(closeTime);

    let newStart: number;
    let newEnd: number;

    if (type === "move") {
      newStart = originalStart + deltaMin;
      newEnd = originalEnd + deltaMin;
      const duration = originalEnd - originalStart;
      if (newStart < gridStart) {
        newStart = gridStart;
        newEnd = gridStart + duration;
      }
      if (newEnd > gridEnd) {
        newEnd = gridEnd;
        newStart = gridEnd - duration;
      }
    } else {
      newStart = originalStart;
      newEnd = originalEnd + deltaMin;
      if (newEnd <= newStart + SLOT_MINUTES) newEnd = newStart + SLOT_MINUTES;
      if (newEnd > gridEnd) newEnd = gridEnd;
    }

    if (newStart !== originalStart || newEnd !== originalEnd) {
      onBookingUpdate(
        booking.id,
        minutesToTime(newStart),
        minutesToTime(newEnd),
      );
    }
    setDragState(null);
  }, [dragState, openTime, closeTime, onBookingUpdate]);

  const [selection, setSelection] = useState<SelectionState | null>(null);
  const selectionActive = useRef(false);

  const handleCellMouseDown = useCallback(
    (fieldId: string, slotIndex: number) => {
      selectionActive.current = true;
      setSelection({ fieldId, startSlot: slotIndex, endSlot: slotIndex });
    },
    [],
  );

  const handleCellMouseEnter = useCallback(
    (fieldId: string, slotIndex: number) => {
      if (!selectionActive.current) return;
      setSelection((prev) => {
        if (!prev || prev.fieldId !== fieldId) return prev;
        return { ...prev, endSlot: slotIndex };
      });
    },
    [],
  );

  const handleMouseUp = useCallback(() => {
    if (!selectionActive.current || !selection) {
      selectionActive.current = false;
      setSelection(null);
      return;
    }
    selectionActive.current = false;
    const gridStartMin = timeToMinutes(openTime);
    const fromSlot = Math.min(selection.startSlot, selection.endSlot);
    const toSlot = Math.max(selection.startSlot, selection.endSlot);
    const startTime = minutesToTime(gridStartMin + fromSlot * SLOT_MINUTES);
    const endTime = minutesToTime(gridStartMin + (toSlot + 1) * SLOT_MINUTES);
    onSlotClick(selection.fieldId, startTime, endTime);
    setSelection(null);
  }, [selection, openTime, onSlotClick]);

  function getBookingPosition(booking: Booking) {
    let startMin = timeToMinutes(booking.startTime);
    let endMin = timeToMinutes(booking.endTime);

    if (dragState && dragState.booking.id === booking.id) {
      const delta = dragState.deltaSlots * SLOT_MINUTES;
      if (dragState.type === "move") {
        startMin += delta;
        endMin += delta;
      } else {
        endMin += delta;
        if (endMin <= startMin + SLOT_MINUTES) endMin = startMin + SLOT_MINUTES;
      }
    }

    const gridStartMin = timeToMinutes(openTime);
    const startSlot = (startMin - gridStartMin) / SLOT_MINUTES;
    const spanSlots = (endMin - startMin) / SLOT_MINUTES;
    return { startSlot, spanSlots };
  }

  function isSlotSelected(fieldId: string, slotIndex: number) {
    if (!selection || selection.fieldId !== fieldId) return false;
    const from = Math.min(selection.startSlot, selection.endSlot);
    const to = Math.max(selection.startSlot, selection.endSlot);
    return slotIndex >= from && slotIndex <= to;
  }

  return (
    <div
      ref={scrollRef}
      className="relative select-none overflow-x-auto overflow-y-hidden rounded-xl border border-border bg-card"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="grid relative"
        style={{
          gridTemplateColumns: `${FIELD_LABEL_WIDTH}px repeat(${totalSlots}, ${SLOT_WIDTH}px)`,
          gridTemplateRows: `${HEADER_HEIGHT}px repeat(${fields.length}, ${FIELD_ROW_HEIGHT}px)`,
        }}
      >
        <div
          className="sticky top-0 left-0 z-40 bg-card border-b border-r border-border"
          style={{ gridRow: 1, gridColumn: 1 }}
        />

        {slots.map((slot, si) => {
          const isHourBoundary = slot.minutes % 60 === 0;
          const isHalfHour = slot.minutes % 60 === 30;

          return (
            <div
              key={slot.minutes}
              className={cn(
                "sticky top-0 z-30 flex items-end justify-start pb-1.5 pl-1 bg-card border-b border-border",
                isHourBoundary
                  ? "border-l border-l-border"
                  : isHalfHour
                    ? "border-l border-l-border/40"
                    : "",
              )}
              style={{ gridRow: 1, gridColumn: si + 2 }}
            >
              {isHourBoundary && (
                <span className="text-[11px] font-medium text-muted-foreground tabular-nums whitespace-nowrap">
                  {slot.label}
                </span>
              )}
            </div>
          );
        })}

        {fields.map((field, fi) => (
          <div key={field.id} className="contents">
            <div
              className={cn(
                "sticky left-0 z-20 flex flex-col justify-center px-3 bg-card border-r border-border",
                fi < fields.length - 1 && "border-b border-b-border",
              )}
              style={{ gridRow: fi + 2, gridColumn: 1 }}
            >
              <span className="text-sm font-semibold text-foreground truncate">
                {field.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {field.type}
              </span>
            </div>

            {slots.map((slot, si) => {
              const isHourBoundary = slot.minutes % 60 === 0;
              const isHalfHour = slot.minutes % 60 === 30;
              const selected = isSlotSelected(field.id, si);

              return (
                <div
                  key={`${field.id}-${si}`}
                  className={cn(
                    "relative",
                    isHourBoundary
                      ? "border-l border-l-border"
                      : isHalfHour
                        ? "border-l border-l-border/40"
                        : "border-l border-l-transparent",
                    fi < fields.length - 1 && "border-b border-b-border/30",
                    selected && "bg-brand/15",
                  )}
                  style={{ gridRow: fi + 2, gridColumn: si + 2 }}
                  onMouseDown={() => handleCellMouseDown(field.id, si)}
                  onMouseEnter={() => handleCellMouseEnter(field.id, si)}
                />
              );
            })}
          </div>
        ))}

        {fields.map((field, fi) => {
          const fieldBookings = bookings.filter((b) => b.fieldId === field.id);

          return fieldBookings.map((booking) => {
            const { startSlot, spanSlots } = getBookingPosition(booking);
            const isDragging = dragState?.booking.id === booking.id;

            return (
              <div
                key={booking.id}
                className="relative pointer-events-none z-10"
                style={{
                  gridRow: fi + 2,
                  gridColumn: `${Math.floor(startSlot) + 2} / span ${Math.max(Math.ceil(spanSlots), 1)}`,
                }}
              >
                <div className="absolute inset-0 pointer-events-auto">
                  <BookingBlock
                    booking={booking}
                    slotWidth={SLOT_WIDTH}
                    spanSlots={spanSlots}
                    onClick={onBookingClick}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    isDragging={isDragging}
                  />
                </div>
              </div>
            );
          });
        })}
      </div>

      {nowOffset != null && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
          style={{ left: nowOffset, zIndex: 15 }}
        >
          <div className="absolute top-0 -left-[3px] w-2 h-2 rounded-full bg-red-500" />
        </div>
      )}
    </div>
  );
}
