import { Edit2, Footprints } from "lucide-react";
import type { Field } from "../types/field";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";

interface FieldCardProps {
  field: Field;
  onEdit: (field: Field) => void;
  onViewDetail: (field: Field) => void;
}

const STATE_BADGE: Record<Field["state"], { dot: string; text: string }> = {
  Activa: { dot: "bg-emerald-500", text: "text-emerald-700" },
  Inactiva: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
  Mantenimiento: { dot: "bg-amber-500", text: "text-amber-700" },
};

function StatusBadge({ state }: { state: Field["state"] }) {
  const { dot, text } = STATE_BADGE[state];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm shadow-sm ${text}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {state}
    </span>
  );
}

export function FieldCard({ field, onEdit, onViewDetail }: FieldCardProps) {
  return (
    <div
      onClick={() => onViewDetail(field)}
      className="group flex flex-col bg-card rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden border border-transparent hover:border-brand/30 cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted flex items-center justify-center">
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge state={field.state} />
        </div>

        {field.imageUrl ? (
          <div
            className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${field.imageUrl})` }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/40 select-none">
            <Footprints className="w-10 h-10" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              {field.type}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-foreground leading-tight mb-1">
              {field.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {field.type}
              {field.category && (
                <span className="before:content-['·'] before:mx-1.5">
                  {field.category}
                </span>
              )}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground uppercase font-semibold">
              Base
            </p>
            <p className="font-bold text-foreground">
              S/{field.basePrice}
              <span className="text-xs font-normal text-muted-foreground">
                /hr
              </span>
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3 mt-auto">
          <Badge
            variant="secondary"
            className="truncate max-w-[150px] font-medium"
            title={field.operationalHint}
          >
            {field.operationalHint}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(field);
            }}
            className="gap-1.5 shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Editar
          </Button>
        </div>
      </div>
    </div>
  );
}
