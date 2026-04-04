import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import {
  Building2, Clock, CalendarCheck, Ban, Wallet, Bell,
} from "lucide-react";
import type { Settings } from "../types/settings";
import { MOCK_SETTINGS } from "../data/mock";
import { VenueInfoForm } from "../components/VenueInfoForm";
import { OperatingConfigForm } from "../components/OperatingConfigForm";
import { BookingRulesForm } from "../components/BookingRulesForm";
import { CancellationPolicyForm } from "../components/CancellationPolicyForm";
import { PaymentMethodsForm } from "../components/PaymentMethodsForm";
import { NotificationsForm } from "../components/NotificationsForm";

type SectionId =
  | "venue"
  | "operating"
  | "booking"
  | "cancellation"
  | "payments"
  | "notifications";

const SECTIONS: { id: SectionId; label: string; description: string; icon: React.ElementType }[] = [
  { id: "venue",        label: "Información de la Sede",  description: "Nombre, dirección, contacto y redes.",         icon: Building2    },
  { id: "operating",    label: "Configuración Operativa", description: "Días, horarios y franjas del complejo.",        icon: Clock        },
  { id: "booking",      label: "Reglas de Reserva",       description: "Anticipación, duración y buffer de turnos.",    icon: CalendarCheck },
  { id: "cancellation", label: "Política de Cancelación", description: "Condiciones, plazos y penalidades.",            icon: Ban          },
  { id: "payments",     label: "Métodos de Pago",         description: "Yape, Plin, efectivo, transferencia y más.",    icon: Wallet       },
  { id: "notifications",label: "Notificaciones",          description: "Canales y eventos a notificar.",                icon: Bell         },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("venue");
  const [settings, setSettings] = useState<Settings>(MOCK_SETTINGS);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const current = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Ajustes generales de tu sede deportiva.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar nav */}
        <nav className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm shrink-0 lg:shrink w-full",
                activeSection === id
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-card rounded-2xl border border-border p-6 lg:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">{current.label}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{current.description}</p>
          </div>

          {activeSection === "venue" && (
            <VenueInfoForm
              data={settings.venue}
              onSave={(v) => update("venue", v)}
            />
          )}
          {activeSection === "operating" && (
            <OperatingConfigForm
              data={settings.operating}
              onSave={(v) => update("operating", v)}
            />
          )}
          {activeSection === "booking" && (
            <BookingRulesForm
              data={settings.booking}
              onSave={(v) => update("booking", v)}
            />
          )}
          {activeSection === "cancellation" && (
            <CancellationPolicyForm
              data={settings.cancellation}
              onSave={(v) => update("cancellation", v)}
            />
          )}
          {activeSection === "payments" && (
            <PaymentMethodsForm
              data={settings.payments}
              onSave={(v) => update("payments", v)}
            />
          )}
          {activeSection === "notifications" && (
            <NotificationsForm
              data={settings.notifications}
              onSave={(v) => update("notifications", v)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
