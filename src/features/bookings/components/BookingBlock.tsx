import { useRef, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import type { Booking, BookingStatus } from "../types/booking";

const STATUS_COLORS: Record<BookingStatus, { bg: string; border: string; text: string }> = {
  Pendiente:   { bg: "bg-amber-100 dark:bg-amber-950/40",   border: "border-amber-300 dark:border-amber-700",   text: "text-amber-900 dark:text-amber-200" },
  Confirmada:  { bg: "bg-emerald-100 dark:bg-emerald-950/40", border: "border-emerald-300 dark:border-emerald-700", text: "text-emerald-900 dark:text-emerald-200" },
  "En Curso":  { bg: "bg-blue-100 dark:bg-blue-950/40",     border: "border-blue-300 dark:border-blue-700",     text: "text-blue-900 dark:text-blue-200" },
  Completada:  { bg: "bg-muted",                             border: "border-border",                             text: "text-muted-foreground" },
  Cancelada:   { bg: "bg-red-50 dark:bg-red-950/30",        border: "border-red-200 dark:border-red-800",       text: "text-red-700 dark:text-red-300" },
  "No Asistió": { bg: "bg-muted",                            border: "border-border",                             text: "text-muted-foreground line-through" },
};

interface BookingBlockProps {
  booking: Booking;
  slotWidth: number;
  spanSlots: number;
  onClick: (booking: Booking) => void;
  onDragStart: (booking: Booking, type: "move" | "resize") => void;
  onDragMove: (deltaSlots: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function BookingBlock({
  booking,
  slotWidth,
  spanSlots,
  onClick,
  onDragStart,
  onDragMove,
  onDragEnd,
  isDragging,
}: BookingBlockProps) {
  const colors = STATUS_COLORS[booking.status];
  const dragOriginX = useRef(0);
  const lastDelta = useRef(0);
  const isInactive = booking.status === "Cancelada" || booking.status === "No Asistió" || booking.status === "Completada";

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, type: "move" | "resize") => {
      if (isInactive) return;
      e.stopPropagation();
      e.preventDefault();
      dragOriginX.current = e.clientX;
      lastDelta.current = 0;
      onDragStart(booking, type);

      const handleMouseMove = (ev: MouseEvent) => {
        const dx = ev.clientX - dragOriginX.current;
        const deltaSlots = Math.round(dx / slotWidth);
        if (deltaSlots !== lastDelta.current) {
          lastDelta.current = deltaSlots;
          onDragMove(deltaSlots);
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        onDragEnd();
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [booking, slotWidth, onDragStart, onDragMove, onDragEnd, isInactive]
  );

  const width = spanSlots * slotWidth;

  return (
    <div
      className={cn(
        "absolute top-0.5 bottom-0.5 rounded-lg border-t-[3px] px-2 py-0.5 cursor-pointer select-none overflow-hidden transition-shadow flex flex-col justify-center",
        colors.bg,
        colors.border,
        isDragging && "shadow-lg opacity-80",
        isInactive && "opacity-60 cursor-default"
      )}
      style={{ left: 0, width: Math.max(width, slotWidth) }}
      onClick={(e) => { e.stopPropagation(); onClick(booking); }}
      onMouseDown={(e) => handleMouseDown(e, "move")}
    >
      <p className={cn("text-xs font-semibold truncate leading-tight", colors.text)}>
        {booking.client.name}
      </p>
      {width >= slotWidth * 3 && (
        <p className="text-[10px] text-muted-foreground truncate">
          {booking.startTime} – {booking.endTime}
        </p>
      )}
      {width >= slotWidth * 5 && (
        <p className="text-[10px] text-muted-foreground truncate">
          S/{booking.amount}
        </p>
      )}

      {/* Resize handle — right edge */}
      {!isInactive && (
        <div
          className="absolute top-0 bottom-0 right-0 w-2 cursor-e-resize hover:bg-foreground/10 rounded-r-lg"
          onMouseDown={(e) => handleMouseDown(e, "resize")}
        />
      )}
    </div>
  );
}
