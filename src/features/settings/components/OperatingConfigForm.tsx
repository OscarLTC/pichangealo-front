import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { OperatingConfig, DayOfWeek, TimeSlot } from "../types/settings";

interface OperatingConfigFormProps {
  data: OperatingConfig;
  onSave: (data: OperatingConfig) => void;
}

const ALL_DAYS: { label: string; value: DayOfWeek }[] = [
  { label: "Lu", value: "Lunes" },
  { label: "Ma", value: "Martes" },
  { label: "Mi", value: "Miércoles" },
  { label: "Ju", value: "Jueves" },
  { label: "Vi", value: "Viernes" },
  { label: "Sá", value: "Sábado" },
  { label: "Do", value: "Domingo" },
];

const SLOT_NAMES = ["Día", "Tarde", "Noche"] as const;

const lbl = "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

export function OperatingConfigForm({ data, onSave }: OperatingConfigFormProps) {
  const [draft, setDraft] = useState<OperatingConfig>(data);

  const toggleDay = (day: DayOfWeek) => {
    setDraft((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const updateSlot = (name: string, field: keyof TimeSlot, value: string) => {
    setDraft((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.map((s) =>
        s.name === name ? { ...s, [field]: value } : s
      ),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Days */}
      <div className="space-y-3">
        <p className={lbl}>Días de atención</p>
        <div className="flex flex-wrap gap-2">
          {ALL_DAYS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleDay(value)}
              className={cn(
                "w-10 h-10 rounded-full border text-sm font-semibold transition-all",
                draft.days.includes(value)
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Hours */}
      <div className="space-y-3">
        <p className={lbl}>Horario de atención</p>
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Apertura</p>
            <Input
              type="time"
              value={draft.openTime}
              onChange={(e) => setDraft((p) => ({ ...p, openTime: e.target.value }))}
              className="w-36"
            />
          </div>
          <span className="text-muted-foreground mt-5">—</span>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Cierre</p>
            <Input
              type="time"
              value={draft.closeTime}
              onChange={(e) => setDraft((p) => ({ ...p, closeTime: e.target.value }))}
              className="w-36"
            />
          </div>
        </div>
      </div>

      {/* Time slots */}
      <div className="space-y-3">
        <div>
          <p className={lbl}>Franjas horarias</p>
          <p className="text-xs text-muted-foreground mt-1">
            Definen los períodos del día usados en las reglas de tarifas.
          </p>
        </div>
        <div className="space-y-2">
          {SLOT_NAMES.map((name) => {
            const slot = draft.timeSlots.find((s) => s.name === name);
            if (!slot) return null;
            return (
              <div key={name} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                <span className="w-10 text-sm font-semibold text-foreground shrink-0">{name}</span>
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateSlot(name, "startTime", e.target.value)}
                  className="w-32"
                />
                <span className="text-muted-foreground text-sm">—</span>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateSlot(name, "endTime", e.target.value)}
                  className="w-32"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          className="bg-brand hover:bg-brand/90 text-white font-bold shadow-sm shadow-brand/20"
          onClick={() => onSave(draft)}
        >
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
