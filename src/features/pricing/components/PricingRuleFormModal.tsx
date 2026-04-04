import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Field } from "@/features/fields/types/field";
import type { PricingRule, DayOfWeek, TimeSlotName } from "../types/pricing";
import {
  pricingRuleSchema,
  type PricingRuleFormValues,
} from "../schema/pricingSchema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

// ── Shared sub-components ──────────────────────────────────────────────────

interface TogglePillsProps<T extends string> {
  options: { label: string; value: T }[];
  value: T[];
  onChange: (values: T[]) => void;
}

function TogglePills<T extends string>({
  options,
  value,
  onChange,
}: TogglePillsProps<T>) {
  const toggle = (v: T) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => toggle(opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-full border text-sm font-medium transition-all",
            value.includes(opt.value)
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:bg-accent",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && value.length > 0)
      onChange(value.slice(0, -1));
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs cursor-text focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 transition-[color,box-shadow]"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="hover:text-destructive transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={value.length === 0 ? "Ej. Con luz, Techada…" : ""}
        className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground text-sm"
      />
    </div>
  );
}

// ── Constants ──────────────────────────────────────────────────────────────

const DAY_OPTIONS: { label: string; value: DayOfWeek }[] = [
  { label: "Lu", value: "Lunes" },
  { label: "Ma", value: "Martes" },
  { label: "Mi", value: "Miércoles" },
  { label: "Ju", value: "Jueves" },
  { label: "Vi", value: "Viernes" },
  { label: "Sá", value: "Sábado" },
  { label: "Do", value: "Domingo" },
];

const SLOT_OPTIONS: { label: string; value: TimeSlotName }[] = [
  { label: "Día", value: "Día" },
  { label: "Tarde", value: "Tarde" },
  { label: "Noche", value: "Noche" },
];

const TYPE_OPTIONS = [
  { label: "Fútbol 5", value: "Fútbol 5" as const },
  { label: "Fútbol 6", value: "Fútbol 6" as const },
  { label: "Fútbol 7", value: "Fútbol 7" as const },
  { label: "Fútbol 11", value: "Fútbol 11" as const },
];

const labelClassName =
  "text-xs font-semibold text-muted-foreground uppercase tracking-wider";
const sectionClassName = "space-y-4 pt-4 border-t border-border";

// ── Modal ──────────────────────────────────────────────────────────────────

interface PricingRuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<PricingRule, "id">) => void;
  initialData?: PricingRule;
  fields: Field[];
}

export function PricingRuleFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  fields,
}: PricingRuleFormModalProps) {
  const form = useForm<PricingRuleFormValues>({
    resolver: zodResolver(pricingRuleSchema),
    defaultValues: {
      name: "",
      price: 0,
      priority: 1,
      active: true,
      fieldIds: [],
      fieldTypes: [],
      tags: [],
      days: [],
      timeSlots: [],
    },
  });

  useEffect(() => {
    form.reset(
      initialData
        ? {
            name: initialData.name,
            price: initialData.price,
            priority: initialData.priority,
            active: initialData.active,
            fieldIds: initialData.fieldIds ?? [],
            fieldTypes: initialData.fieldTypes ?? [],
            tags: initialData.tags ?? [],
            days: initialData.days ?? [],
            timeSlots: initialData.timeSlots ?? [],
          }
        : {
            name: "",
            price: 0,
            priority: 1,
            active: true,
            fieldIds: [],
            fieldTypes: [],
            tags: [],
            days: [],
            timeSlots: [],
          },
    );
  }, [initialData, isOpen, form]);

  const onSubmit = (data: PricingRuleFormValues) => {
    onSave({
      ...data,
      fieldIds: data.fieldIds?.length ? data.fieldIds : undefined,
      fieldTypes: data.fieldTypes?.length ? data.fieldTypes : undefined,
      tags: data.tags?.length ? data.tags : undefined,
      days: data.days?.length ? data.days : undefined,
      timeSlots: data.timeSlots?.length ? data.timeSlots : undefined,
    });
    onClose();
  };

  const fieldOptions = fields.map((f) => ({ label: f.name, value: f.id }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="px-8 pt-8 pb-4 shrink-0">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {initialData ? "Editar Regla" : "Nueva Regla de Tarifa"}
          </DialogTitle>
          <DialogDescription>
            Define el precio y las condiciones en que aplica esta tarifa.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-8 py-4">
          <Form {...form}>
            <form
              id="pricing-rule-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>
                      Nombre de la regla
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Tarifa Nocturna" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>
                        Precio / hora
                      </FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground z-10">
                          S/
                        </span>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="0.00"
                            min={0}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? 0
                                  : e.target.valueAsNumber,
                              )
                            }
                            className="pl-9 font-medium"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>
                        Prioridad
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          min={1}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 1
                                : e.target.valueAsNumber,
                            )
                          }
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Mayor número = más precedencia.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Estado</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {[true, false].map((v) => (
                          <button
                            key={String(v)}
                            type="button"
                            onClick={() => field.onChange(v)}
                            className={cn(
                              "px-5 py-2.5 rounded-full border text-sm font-medium transition-all",
                              field.value === v
                                ? "bg-foreground text-background border-foreground"
                                : "border-border text-muted-foreground hover:bg-accent",
                            )}
                          >
                            {v ? "Activa" : "Inactiva"}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditions */}
              <div className={sectionClassName}>
                <div>
                  <p className={labelClassName}>Condiciones</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Opcionales. Si dejas todo vacío, la regla aplica a todas las
                    canchas y horarios.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="timeSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>
                        Franja horaria
                      </FormLabel>
                      <FormControl>
                        <TogglePills
                          options={SLOT_OPTIONS}
                          value={field.value ?? []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>
                        Días de la semana
                      </FormLabel>
                      <FormControl>
                        <TogglePills
                          options={DAY_OPTIONS}
                          value={field.value ?? []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fieldTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>
                        Tipo de cancha
                      </FormLabel>
                      <FormControl>
                        <TogglePills
                          options={TYPE_OPTIONS}
                          value={field.value ?? []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fieldOptions.length > 0 && (
                  <FormField
                    control={form.control}
                    name="fieldIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>
                          Canchas específicas
                        </FormLabel>
                        <FormControl>
                          <TogglePills
                            options={fieldOptions}
                            value={field.value ?? []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>
                        Tags de cancha
                      </FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value ?? []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="px-8 py-5 bg-muted/50 border-t border-border shrink-0">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="pricing-rule-form"
            className="bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20 font-bold"
          >
            Guardar Regla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
