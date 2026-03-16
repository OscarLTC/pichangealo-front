import { X } from "lucide-react";
import { useEffect } from "react";
import type { Field, FieldState } from "../types/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { refinedFieldSchema, type FieldFormValues } from "../schema/fieldSchema";

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

interface FieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Partial<Field>) => void;
  initialData?: Field;
}

export function FieldFormModal({ isOpen, onClose, onSave, initialData }: FieldFormModalProps) {
  const form = useForm<FieldFormValues>({
    resolver: zodResolver(refinedFieldSchema),
    defaultValues: {
      name: "",
      type: "Fútbol 5",
      category: "",
      basePrice: 0,
      state: "Activa",
      capacity: 10,
      internalNotes: "",
      maintenanceReason: ""
    }
  });

  const stateWatch = form.watch("state");

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        type: initialData.type,
        category: initialData.category || "",
        basePrice: initialData.basePrice || 0,
        state: initialData.state,
        capacity: initialData.capacity || 10,
        internalNotes: initialData.internalNotes || "",
        maintenanceReason: initialData.maintenanceReason || ""
      });
    } else {
      form.reset({
        name: "",
        type: "Fútbol 5",
        category: "",
        basePrice: 0,
        state: "Activa",
        capacity: 10,
        internalNotes: "",
        maintenanceReason: ""
      });
    }
  }, [initialData, isOpen, form]);

  if (!isOpen) return null;

  const onSubmit = (data: FieldFormValues) => {
    onSave(data as Partial<Field>);
    onClose();
  };

  const inputClassNames = "w-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-3.5 focus:ring-brand focus:border-brand placeholder:text-slate-400 text-slate-700 dark:text-white transition-all outline-none border shadow-none";
  const labelClassNames = "text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 pt-8 pb-4 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              {initialData ? "Editar Cancha" : "Registrar Nueva Cancha"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Completa los detalles para tu espacio deportivo.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto px-8 py-4">
          <Form {...form}>
            <form id="field-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassNames}>Nombre de la cancha</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej. Cancha Central F5" 
                        {...field} 
                        className={inputClassNames}
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
                      <FormLabel className={labelClassNames}>Tipo de cancha</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClassNames}>
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
                      <FormLabel className={labelClassNames}>Categoría</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej. Techada" 
                          {...field} 
                          value={field.value ?? ""}
                          className={inputClassNames} 
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
                      <FormLabel className={labelClassNames}>Capacidad</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Ej. 14" 
                          {...field} 
                          value={field.value ?? ""}
                          className={inputClassNames} 
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
                      <FormLabel className={labelClassNames}>Precio base por hora</FormLabel>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium z-10">S/</span>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="0.00" 
                            {...field} 
                            value={field.value ?? ""}
                            className={`${inputClassNames} pl-10 font-medium`} 
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
                name="internalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassNames}>Notas internas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Notas operativas..." 
                        className={`${inputClassNames} resize-none min-h-[100px]`} 
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
                    <FormLabel className={labelClassNames}>Estado de la cancha</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        className="flex flex-wrap gap-3"
                      >
                        {(['Activa', 'Inactiva', 'Mantenimiento'] as FieldState[]).map(state => (
                           <FormItem key={state} className="flex items-center space-x-0 space-y-0 relative border-0">
                             <FormControl>
                               <RadioGroupItem value={state} className="peer sr-only" />
                             </FormControl>
                             <FormLabel className="font-sans cursor-pointer px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all peer-data-[state=checked]:bg-brand peer-data-[state=checked]:text-white peer-data-[state=checked]:border-brand">
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

              {stateWatch === 'Mantenimiento' && (
                <div className="animate-in slide-in-from-top-2">
                  <FormField
                    control={form.control}
                    name="maintenanceReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassNames}>Motivo de mantenimiento</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej. Reparación de malla" 
                            {...field}
                            value={field.value ?? ""}
                            className={inputClassNames} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <p className="text-xs text-slate-400 text-center italic mt-2">
                Las reglas de tarifas y horarios se configuran en el módulo de Configuración de Reservas.
              </p>
            </form>
          </Form>
        </div>

        <div className="px-8 py-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 text-slate-500 font-semibold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="field-form"
            className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-brand/20 transition-all transform active:scale-95"
          >
            Guardar Cancha
          </button>
        </div>
      </div>
    </div>
  );
}
