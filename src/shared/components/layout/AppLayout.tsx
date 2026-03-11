import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { AppSidebar } from "@/shared/components/layout/AppSidebar";
import { AppHeader } from "@/shared/components/layout/AppHeader";

export function AppLayout() {
  return (
    <TooltipProvider delayDuration={300}>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <AppHeader />

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
