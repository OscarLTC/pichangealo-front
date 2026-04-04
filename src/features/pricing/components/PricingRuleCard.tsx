import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import type { PricingRule } from "../types/pricing";
import type { Field } from "@/features/fields/types/field";

interface PricingRuleCardProps {
  rule: PricingRule;
  fields: Field[];
  onEdit: (rule: PricingRule) => void;
  onDelete: (rule: PricingRule) => void;
  onToggleActive: (rule: PricingRule) => void;
}

const DAY_ABBR: Record<string, string> = {
  Lunes: "Lu", Martes: "Ma", Miércoles: "Mi", Jueves: "Ju",
  Viernes: "Vi", Sábado: "Sá", Domingo: "Do",
};

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs font-medium">
      {label}
    </span>
  );
}

export function PricingRuleCard({
  rule, fields, onEdit, onDelete, onToggleActive,
}: PricingRuleCardProps) {
  const fieldMap = Object.fromEntries(fields.map(f => [f.id, f.name]));

  const conditionChips: string[] = [
    ...(rule.timeSlots ?? []),
    ...(rule.days?.map(d => DAY_ABBR[d] ?? d) ?? []),
    ...(rule.fieldTypes?.map(t => t.replace("Fútbol ", "F")) ?? []),
    ...(rule.tags ?? []),
    ...(rule.fieldIds?.map(id => fieldMap[id] ?? id) ?? []),
  ];

  const hasConditions = conditionChips.length > 0;

  return (
    <div className="flex flex-col bg-card rounded-2xl border border-border shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="flex flex-col gap-3 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-foreground leading-tight">{rule.name}</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              P·{rule.priority}
            </span>
          </div>
          {/* Active toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={rule.active}
            onClick={() => onToggleActive(rule)}
            title={rule.active ? "Desactivar regla" : "Activar regla"}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none",
              rule.active ? "bg-brand" : "bg-input"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                rule.active ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>

        {/* Price */}
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-0.5">Precio</p>
          <p className="text-2xl font-bold text-foreground leading-none">
            S/{rule.price}
            <span className="text-sm font-normal text-muted-foreground">/hr</span>
          </p>
        </div>

        <Separator />

        {/* Conditions */}
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-2">Condiciones</p>
          <div className="flex flex-wrap gap-1.5">
            {hasConditions
              ? conditionChips.map((chip, i) => <Chip key={i} label={chip} />)
              : <Chip label="Aplica a todo" />
            }
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 px-5 py-3 bg-muted/40 border-t border-border mt-auto">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(rule)}
          title="Eliminar regla"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onEdit(rule)}>
          <Edit2 className="w-3.5 h-3.5" />
          Editar
        </Button>
      </div>
    </div>
  );
}
