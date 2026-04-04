import { useEffect, useRef, useState } from "react";
import type { Field, FieldState } from "../types/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  refinedFieldSchema,
  type FieldFormValues,
} from "../schema/fieldSchema";

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
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";

// ── Tag Input ────────────────────────────────────────────────────────────────

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
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
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
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

// ── Modal ────────────────────────────────────────────────────────────────────

interface FieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Partial<Field>) => void;
  initialData?: Field;
}

const FIELD_STATES: FieldState[] = ["Activa", "Inactiva", "Mantenimiento"];

const labelClassName =
  "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

export function FieldFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: FieldFormModalProps) {
  const form = useForm<FieldFormValues>({
    resolver: zodResolver(refinedFieldSchema),
    defaultValues: {
      name: "",
      type: "Fútbol 5",
      category: "",
      basePrice: 0,
      state: "Activa",
      capacity: 10,
      imageUrl: "",
      tags: [],
      internalNotes: "",
      maintenanceReason: "",
    },
  });

  const stateWatch = form.watch("state");

  useEffect(() => {
    form.reset(
      initialData
        ? {
            name: initialData.name,
            type: initialData.type,
            category: initialData.category ?? "",
            basePrice: initialData.basePrice ?? 0,
            state: initialData.state,
            capacity: initialData.capacity ?? 10,
            imageUrl: initialData.imageUrl ?? "",
            tags: initialData.tags ?? [],
            internalNotes: initialData.internalNotes ?? "",
            maintenanceReason: initialData.maintenanceReason ?? "",
          }
        : {
            name: "",
            type: "Fútbol 5",
            category: "",
            basePrice: 0,
            state: "Activa",
            capacity: 10,
            imageUrl: "",
            tags: [],
            internalNotes: "",
            maintenanceReason: "",
          },
    );
  }, [initialData, isOpen, form]);

  const onSubmit = (data: FieldFormValues) => {
    onSave(data as Partial<Field>);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="px-8 pt-8 pb-4 shrink-0">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {initialData ? "Editar Cancha" : "Registrar Nueva Cancha"}
          </DialogTitle>
          <DialogDescription>
            Completa los detalles para tu espacio deportivo.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-8 py-4">
          <Form {...form}>
            <form
              id="field-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>
                      Nombre de la cancha
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Cancha Central F5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>URL de imagen</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>
                        Tipo de cancha
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fútbol 5">Fútbol 5</SelectItem>
                          <SelectItem value="Fútbol 6">Fútbol 6</SelectItem>
                          <SelectItem value="Fútbol 7">Fútbol 7</SelectItem>
                          <SelectItem value="Fútbol 11">Fútbol 11</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>
                        Categoría
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej. Principal"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>Capacidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ej. 14"
                          min={1}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : e.target.valueAsNumber
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClassName}>
                        Precio base / hora
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
                                e.target.value === "" ? undefined : e.target.valueAsNumber
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
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Tags</FormLabel>
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

              <FormField
                control={form.control}
                name="internalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Notas internas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas operativas..."
                        className="resize-none min-h-[100px]"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className={labelClassName}>
                      Estado de la cancha
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-wrap gap-3"
                      >
                        {FIELD_STATES.map((state) => (
                          <FormItem
                            key={state}
                            className="flex items-center space-x-0 space-y-0 border-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={state} className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="cursor-pointer px-5 py-2.5 rounded-full border border-border text-muted-foreground text-sm font-medium hover:bg-accent transition-all peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background peer-data-[state=checked]:border-foreground">
                              {state}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {stateWatch === "Mantenimiento" && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <FormField
                    control={form.control}
                    name="maintenanceReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>
                          Motivo de mantenimiento
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Reparación de malla"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center italic">
                Las reglas de tarifas y horarios se configuran en el módulo de Tarifas.
              </p>
            </form>
          </Form>
        </div>

        <DialogFooter className="px-8 py-5 bg-muted/50 border-t border-border shrink-0">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="field-form"
            className="bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20 font-bold"
          >
            Guardar Cancha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
