import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { bookingRulesSchema, type BookingRulesFormValues } from "../schema/settingsSchema";
import type { BookingRules } from "../types/settings";

interface BookingRulesFormProps {
  data: BookingRules;
  onSave: (data: BookingRules) => void;
}

const lbl = "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

const FIELDS: {
  name: keyof BookingRulesFormValues;
  label: string;
  hint: string;
  suffix: string;
  min: number;
}[] = [
  { name: "minAdvanceHours",    label: "Anticipación mínima",   hint: "Horas antes del inicio con las que se puede reservar.", suffix: "horas",  min: 0  },
  { name: "maxAdvanceDays",     label: "Anticipación máxima",   hint: "Días hacia adelante que el cliente puede reservar.",    suffix: "días",   min: 1  },
  { name: "minDurationMinutes", label: "Duración mínima",       hint: "Duración mínima permitida por turno.",                  suffix: "min",    min: 30 },
  { name: "maxDurationMinutes", label: "Duración máxima",       hint: "Duración máxima permitida por turno.",                  suffix: "min",    min: 30 },
  { name: "bufferMinutes",      label: "Buffer entre reservas", hint: "Tiempo libre que se deja entre un turno y el siguiente.", suffix: "min",   min: 0  },
];

export function BookingRulesForm({ data, onSave }: BookingRulesFormProps) {
  const form = useForm<BookingRulesFormValues>({
    resolver: zodResolver(bookingRulesSchema),
    defaultValues: data,
  });

  useEffect(() => { form.reset(data); }, [data, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map(({ name, label, hint, suffix, min }) => (
            <FormField key={name} control={form.control} name={name} render={({ field }) => (
              <FormItem>
                <FormLabel className={lbl}>{label}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="number"
                      min={min}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? min : e.target.valueAsNumber)
                      }
                      className="pr-14"
                    />
                  </FormControl>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    {suffix}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{hint}</p>
                <FormMessage />
              </FormItem>
            )} />
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-brand hover:bg-brand/90 text-white font-bold shadow-sm shadow-brand/20">
            Guardar Reglas
          </Button>
        </div>
      </form>
    </Form>
  );
}
