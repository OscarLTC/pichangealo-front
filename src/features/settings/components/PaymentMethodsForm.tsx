import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { PaymentMethod, PaymentMethodId } from "../types/settings";

interface PaymentMethodsFormProps {
  data: PaymentMethod[];
  onSave: (data: PaymentMethod[]) => void;
}

const METHOD_META: Record<PaymentMethodId, { emoji: string; hint?: string; detailLabel?: string; detailPlaceholder?: string }> = {
  cash:     { emoji: "💵", hint: "Sin configuración adicional." },
  yape:     { emoji: "💜", detailLabel: "Número de Yape",            detailPlaceholder: "987 654 321" },
  plin:     { emoji: "💙", detailLabel: "Número de Plin",            detailPlaceholder: "987 654 321" },
  transfer: { emoji: "🏦", detailLabel: "Banco y número de cuenta",  detailPlaceholder: "BCP - Cta. Cte. 123-456789-0-12" },
  card:     { emoji: "💳", detailLabel: "Notas sobre POS disponible", detailPlaceholder: "Ej. POS Visa/Mastercard en caja" },
};

export function PaymentMethodsForm({ data, onSave }: PaymentMethodsFormProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>(data);

  const toggle = (id: PaymentMethodId) => {
    setMethods((prev) =>
      prev.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m)
    );
  };

  const updateDetails = (id: PaymentMethodId, details: string) => {
    setMethods((prev) =>
      prev.map((m) => m.id === id ? { ...m, details } : m)
    );
  };

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const meta = METHOD_META[method.id];
        return (
          <div
            key={method.id}
            className={cn(
              "rounded-xl border p-4 transition-colors",
              method.enabled ? "border-border bg-card" : "border-border bg-muted/30"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">{meta.emoji}</span>
                <span className={cn("font-semibold text-sm", !method.enabled && "text-muted-foreground")}>
                  {method.label}
                </span>
              </div>
              {/* Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={method.enabled}
                onClick={() => toggle(method.id)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors",
                  method.enabled ? "bg-brand" : "bg-input"
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                  method.enabled ? "translate-x-4" : "translate-x-0"
                )} />
              </button>
            </div>

            {method.enabled && (
              <div className="mt-3 animate-in slide-in-from-top-1 duration-150">
                {meta.hint ? (
                  <p className="text-xs text-muted-foreground">{meta.hint}</p>
                ) : meta.detailLabel && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">{meta.detailLabel}</p>
                    <Input
                      placeholder={meta.detailPlaceholder}
                      value={method.details ?? ""}
                      onChange={(e) => updateDetails(method.id, e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          className="bg-brand hover:bg-brand/90 text-white font-bold shadow-sm shadow-brand/20"
          onClick={() => onSave(methods)}
        >
          Guardar Métodos de Pago
        </Button>
      </div>
    </div>
  );
}
