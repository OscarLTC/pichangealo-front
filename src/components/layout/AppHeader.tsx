import { useLocation, useNavigate } from "react-router";
import { Search, Plus, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const moduleNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/reservas": "Reservas",
  "/canchas": "Canchas",
  "/tarifas": "Tarifas",
  "/configuracion": "Configuración",
};

function useModuleName() {
  const { pathname } = useLocation();
  const matched = Object.keys(moduleNames).find((key) =>
    pathname.startsWith(key),
  );
  return matched ? moduleNames[matched] : "Dashboard";
}

const NOTIFICATION_COUNT = 3;

export function AppHeader() {
  const navigate = useNavigate();
  const moduleName = useModuleName();

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1 md:hidden" />

      <h1 className="text-base font-semibold text-foreground min-w-[100px] whitespace-nowrap">
        {moduleName}
      </h1>

      <div className="relative flex-1 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="header-search"
          placeholder="Buscar cliente o reserva..."
          className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring h-9 rounded-full"
        />
      </div>

      <div className="flex-1" />

      <Button
        id="btn-nueva-reserva"
        size="sm"
        className="rounded-full bg-brand hover:bg-brand/80 text-white font-semibold shadow-sm"
        onClick={() => navigate("/reservas")}
      >
        <Plus className="h-4 w-4" />
        Nueva reserva
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id="btn-notifications"
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full"
          >
            <Bell className="h-4 w-4" />
            {NOTIFICATION_COUNT > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-2 border-background rounded-full">
                {NOTIFICATION_COUNT}
              </Badge>
            )}
            <span className="sr-only">Notificaciones</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Notificaciones</TooltipContent>
      </Tooltip>
    </header>
  );
}
