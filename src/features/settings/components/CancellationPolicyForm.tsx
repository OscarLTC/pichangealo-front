import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/shared/lib/utils";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cancellationPolicySchema, type CancellationPolicyFormValues } from "../schema/settingsSchema";
import type { CancellationPolicy, PenaltyType } from "../types/settings";

interface CancellationPolicyFormProps {
  data: CancellationPolicy;
  onSave: (data: CancellationPolicy) => void;
}

const lbl = "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

function BoolToggle({
  value,
  onChange,
  labelOn,
  labelOff,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  labelOn: string;
  labelOff: string;
}) {
  return (
    <div className="flex gap-2">
      {([true, false] as const).map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "px-5 py-2.5 rounded-full border text-sm font-medium transition-all",
            value === v
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:bg-accent"
          )}
        >
          {v ? labelOn : labelOff}
        </button>
      ))}
    </div>
  );
}

const PENALTY_OPTIONS: { label: string; value: PenaltyType }[] = [
  { label: "Sin penalidad", value: "none" },
  { label: "Porcentaje (%)", value: "percentage" },
  { label: "Monto fijo (S/)", value: "fixed" },
];

export function CancellationPolicyForm({ data, onSave }: CancellationPolicyFormProps) {
  const form = useForm<CancellationPolicyFormValues>({
    resolver: zodResolver(cancellationPolicySchema),
    defaultValues: data,
  });

  useEffect(() => { form.reset(data); }, [data, form]);

  const allowCancellation = form.watch("allowCancellation");
  const penaltyType = form.watch("penaltyType");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <FormField control={form.control} name="allowCancellation" render={({ field }) => (
          <FormItem>
            <FormLabel className={lbl}>¿Se permite cancelar reservas?</FormLabel>
            <FormControl>
              <BoolToggle
                value={field.value}
                onChange={field.onChange}
                labelOn="Sí, se permite"
                labelOff="No se permite"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {allowCancellation && (
          <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
            <Separator />

            <FormField control={form.control} name="deadlineHours" render={({ field }) => (
              <FormItem>
                <FormLabel className={lbl}>Límite de cancelación</FormLabel>
                <div className="relative w-40">
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? 0 : e.target.valueAsNumber)}
                      className="pr-14"
                    />
                  </FormControl>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    horas
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Horas antes del turno en que se puede cancelar sin consecuencias adicionales.
                </p>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="penaltyType" render={({ field }) => (
              <FormItem>
                <FormLabel className={lbl}>Penalidad por cancelación tardía</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {PENALTY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          field.onChange(opt.value);
                          if (opt.value === "none") form.setValue("penaltyValue", 0);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                          field.value === opt.value
                            ? "bg-foreground text-background border-foreground"
                            : "border-border text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {penaltyType !== "none" && (
              <FormField control={form.control} name="penaltyValue" render={({ field }) => (
                <FormItem>
                  <FormLabel className={lbl}>
                    {penaltyType === "percentage" ? "Porcentaje de penalidad" : "Monto de penalidad"}
                  </FormLabel>
                  <div className="relative w-40">
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={penaltyType === "percentage" ? 100 : undefined}
                        step={penaltyType === "percentage" ? 1 : 0.1}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? 0 : e.target.valueAsNumber)}
                        className={penaltyType === "percentage" ? "pr-8" : "pl-9"}
                      />
                    </FormControl>
                    {penaltyType === "percentage" ? (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">%</span>
                    ) : (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">S/</span>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <Separator />

            <FormField control={form.control} name="allowRefund" render={({ field }) => (
              <FormItem>
                <FormLabel className={lbl}>¿Se realiza reembolso?</FormLabel>
                <FormControl>
                  <BoolToggle
                    value={field.value}
                    onChange={field.onChange}
                    labelOn="Sí, se reembolsa"
                    labelOff="No se reembolsa"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-brand hover:bg-brand/90 text-white font-bold shadow-sm shadow-brand/20">
            Guardar Política
          </Button>
        </div>
      </form>
    </Form>
  );
}
