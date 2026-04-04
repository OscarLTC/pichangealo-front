import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { PricingRuleCard } from "../components/PricingRuleCard";
import { PricingRuleFormModal } from "../components/PricingRuleFormModal";
import type { PricingRule } from "../types/pricing";
import { MOCK_PRICING_RULES } from "../data/mock";
import { MOCK_FIELDS } from "@/features/fields/data/mock";

export default function PricingPage() {
  const [rules, setRules] = useState<PricingRule[]>(MOCK_PRICING_RULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | undefined>();

  const handleCreate = () => {
    setEditingRule(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleDelete = (rule: PricingRule) => {
    setRules((prev) => prev.filter((r) => r.id !== rule.id));
  };

  const handleToggleActive = (rule: PricingRule) => {
    setRules((prev) =>
      prev.map((r) => r.id === rule.id ? { ...r, active: !r.active } : r)
    );
  };

  const handleSave = (data: Omit<PricingRule, "id">) => {
    if (editingRule) {
      setRules((prev) => prev.map((r) => r.id === editingRule.id ? { ...r, ...data } : r));
    } else {
      setRules((prev) => [{ ...data, id: Math.random().toString() }, ...prev]);
    }
  };

  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Tarifas</h1>
          <p className="text-muted-foreground mt-1">
            Reglas de precios por franja, día, tipo de cancha o tags.
          </p>
        </div>
        <Button
          className="bg-brand hover:bg-brand/90 text-white font-bold shadow-lg shadow-brand/20 gap-2 shrink-0"
          onClick={handleCreate}
        >
          <Plus className="w-4 h-4" />
          Nueva Regla
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-foreground">Reglas de Tarifa</h2>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {rules.length}
          </span>
          <p className="text-xs text-muted-foreground ml-1">ordenadas por prioridad</p>
        </div>

        {sortedRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border text-center gap-3">
            <p className="text-lg font-semibold text-foreground">Sin reglas de tarifa</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Las canchas usarán su precio base. Crea una regla para aplicar precios según horario, día o tipo de cancha.
            </p>
            <Button
              className="mt-2 bg-brand hover:bg-brand/90 text-white font-bold gap-2"
              onClick={handleCreate}
            >
              <Plus className="w-4 h-4" />
              Crear primera regla
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedRules.map((rule) => (
              <PricingRuleCard
                key={rule.id}
                rule={rule}
                fields={MOCK_FIELDS}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      <PricingRuleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingRule}
        fields={MOCK_FIELDS}
      />
    </div>
  );
}
