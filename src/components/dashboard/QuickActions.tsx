import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface QuickActionItem {
  id: string;
  /** Ícono Material Symbols */
  icon: string;
  label: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions: QuickActionItem[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="bg-slate-900 text-white p-6">
      <h4 className="text-lg font-bold mb-6">Acciones rápidas</h4>

      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">
                {action.icon}
              </span>
              <span className="text-sm font-medium">{action.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </button>
        ))}
      </div>
    </Card>
  );
}
