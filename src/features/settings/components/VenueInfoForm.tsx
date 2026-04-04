import { useEffect, Suspense, lazy } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, MapPin } from "lucide-react";
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
import { Separator } from "@/shared/components/ui/separator";
import {
  venueInfoSchema,
  type VenueInfoFormValues,
} from "../schema/settingsSchema";
import type { VenueInfo } from "../types/settings";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";

const MapPicker = lazy(() =>
  import("./MapPicker").then((m) => ({ default: m.MapPicker })),
);

interface VenueInfoFormProps {
  data: VenueInfo;
  onSave: (data: VenueInfo) => void;
}

const lbl =
  "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

export function VenueInfoForm({ data, onSave }: VenueInfoFormProps) {
  const form = useForm<VenueInfoFormValues>({
    resolver: zodResolver(venueInfoSchema),
    defaultValues: data,
  });

  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className={lbl}>Nombre del complejo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej. Pichangealo Sports Center"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className={lbl}>Dirección</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Input
                      placeholder="Av. Javier Prado Este 4200, Surco"
                      {...field}
                      className="pl-9"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Map */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={lbl}>Ubicación en el mapa</FormLabel>
              <FormControl>
                <Suspense
                  fallback={
                    <div
                      className="rounded-xl border border-border bg-muted/30 flex items-center justify-center"
                      style={{ height: 280 }}
                    >
                      <p className="text-sm text-muted-foreground">
                        Cargando mapa…
                      </p>
                    </div>
                  }
                >
                  <MapPicker value={field.value} onChange={field.onChange} />
                </Suspense>
              </FormControl>
              {field.value && (
                <p className="text-xs text-muted-foreground">
                  {field.value.lat.toFixed(5)}, {field.value.lng.toFixed(5)}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={lbl}>Teléfono</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Input
                      placeholder="987 654 321"
                      {...field}
                      value={field.value ?? ""}
                      className="pl-9"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={lbl}>WhatsApp</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FaWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Input
                      placeholder="987 654 321"
                      {...field}
                      value={field.value ?? ""}
                      className="pl-9"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={lbl}>Instagram</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FaInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground z-10 select-none">
                      @
                    </span>
                    <Input
                      placeholder="pichangealo"
                      {...field}
                      value={field.value ?? ""}
                      className="pl-14"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={lbl}>Facebook</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FaFacebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground z-10 select-none">
                      @
                    </span>
                    <Input
                      placeholder="pichangealo"
                      {...field}
                      value={field.value ?? ""}
                      className="pl-14"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={lbl}>TikTok</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FaTiktok className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground z-10 select-none">
                      @
                    </span>
                    <Input
                      placeholder="pichangealo"
                      {...field}
                      value={field.value ?? ""}
                      className="pl-14"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="bg-brand hover:bg-brand/90 text-white font-bold shadow-sm shadow-brand/20"
          >
            Guardar Información
          </Button>
        </div>
      </form>
    </Form>
  );
}
