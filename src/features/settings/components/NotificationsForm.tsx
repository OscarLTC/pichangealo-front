import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Bell, Info } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import type {
  NotificationSettings,
  NotificationChannel,
  NotificationChannelId,
  NotificationEvent,
  NotificationEventId,
} from "../types/settings";

interface NotificationsFormProps {
  data: NotificationSettings;
  onSave: (data: NotificationSettings) => void;
}

const CHANNEL_META: Record<NotificationChannelId, { emoji: string; label: string; placeholder: string; inputType: string }> = {
  whatsapp: { emoji: "💬", label: "WhatsApp",    placeholder: "987 654 321",        inputType: "tel"   },
  email:    { emoji: "📧", label: "Email",        placeholder: "contacto@sede.com",  inputType: "email" },
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-brand" : "bg-input"
      )}
    >
      <span className={cn(
        "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
        checked ? "translate-x-4" : "translate-x-0"
      )} />
    </button>
  );
}

const lbl = "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

export function NotificationsForm({ data, onSave }: NotificationsFormProps) {
  const [channels, setChannels] = useState<NotificationChannel[]>(data.channels);
  const [events, setEvents] = useState<NotificationEvent[]>(data.events);

  const toggleChannel = (id: NotificationChannelId) => {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const updateContact = (id: NotificationChannelId, contact: string) => {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, contact } : c));
  };

  const toggleEvent = (id: NotificationEventId) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, enabled: !e.enabled } : e));
  };

  const updateReminderHours = (id: NotificationEventId, hours: number) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, reminderHours: hours } : e));
  };

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
        <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          El envío automático de notificaciones estará disponible próximamente como característica Pro.
          Por ahora puedes configurar los canales y definir qué eventos notificar para cuando esté activo.
        </p>
      </div>

      {/* Channels */}
      <div className="space-y-3">
        <p className={lbl}>Canales de contacto</p>
        {channels.map((channel) => {
          const meta = CHANNEL_META[channel.id];
          return (
            <div key={channel.id} className={cn(
              "rounded-xl border p-4 transition-colors",
              channel.enabled ? "border-border bg-card" : "border-border bg-muted/30"
            )}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{meta.emoji}</span>
                  <span className={cn("font-semibold text-sm", !channel.enabled && "text-muted-foreground")}>
                    {meta.label}
                  </span>
                </div>
                <Toggle checked={channel.enabled} onChange={() => toggleChannel(channel.id)} />
              </div>
              {channel.enabled && (
                <div className="mt-3 animate-in slide-in-from-top-1 duration-150">
                  <Input
                    type={meta.inputType}
                    placeholder={meta.placeholder}
                    value={channel.contact}
                    onChange={(e) => updateContact(channel.id, e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Events */}
      <div className="space-y-3">
        <div>
          <p className={lbl}>Eventos a notificar</p>
          <p className="text-xs text-muted-foreground mt-1">
            Activa los eventos que quieres que se notifiquen cuando las notificaciones estén disponibles.
          </p>
        </div>
        {events.map((event) => (
          <div key={event.id} className={cn(
            "rounded-xl border p-4 transition-colors",
            event.enabled ? "border-border bg-card" : "border-border bg-muted/30"
          )}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Bell className={cn("w-4 h-4 mt-0.5 shrink-0", event.enabled ? "text-foreground" : "text-muted-foreground")} />
                <div>
                  <p className={cn("text-sm font-semibold", !event.enabled && "text-muted-foreground")}>
                    {event.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
              </div>
              <Toggle checked={event.enabled} onChange={() => toggleEvent(event.id)} />
            </div>
            {event.enabled && event.id === "booking_reminder" && (
              <div className="mt-3 flex items-center gap-2 animate-in slide-in-from-top-1 duration-150">
                <p className="text-xs text-muted-foreground shrink-0">Enviar</p>
                <div className="relative w-24">
                  <Input
                    type="number"
                    min={1}
                    value={event.reminderHours ?? 2}
                    onChange={(e) => updateReminderHours(event.id, e.target.valueAsNumber)}
                    className="h-8 text-sm pr-12"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">horas</span>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">antes del turno.</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          className="bg-brand hover:bg-brand/90 text-white font-bold shadow-sm shadow-brand/20"
          onClick={() => onSave({ channels, events })}
        >
          Guardar Notificaciones
        </Button>
      </div>
    </div>
  );
}
