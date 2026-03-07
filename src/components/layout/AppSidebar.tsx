import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Goal,
  BadgeDollarSign,
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { RiDashboardFill } from "react-icons/ri";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { FaMoneyBills } from "react-icons/fa6";

const navItems = [
  {
    label: "Dashboard",
    icon: RiDashboardFill,
    path: "/dashboard",
  },
  {
    label: "Reservas",
    icon: CalendarDays,
    path: "/reservas",
  },
  {
    label: "Canchas",
    icon: MdOutlineSportsSoccer,
    path: "/canchas",
  },
  {
    label: "Tarifas",
    icon: FaMoneyBills,
    path: "/tarifas",
  },
  {
    label: "Configuración",
    icon: Settings,
    path: "/configuracion",
  },
];

const currentUser = {
  name: "Admin",
  email: "admin@pichangealo.com",
  initials: "AD",
};

export function AppSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/login");
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#22c55e] shadow-sm">
            <Goal className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-base font-bold tracking-tight text-foreground">
              Pichangealo
            </span>
            <span className="text-[11px] text-muted-foreground">
              Admin Panel
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <NavLink to={item.path} end>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        className={cn(
                          "h-10 px-4 rounded-full",
                          isActive &&
                            "text-[#22c55e] data-[active=true]:bg-[#eafdf1] data-[active=true]:text-[#22c55e] hover:bg-[#eafdf1] hover:text-[#22c55e]",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={currentUser.name}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-[#22c55e] text-white text-xs font-semibold">
                      {currentUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-0.5 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-foreground">
                      {currentUser.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {currentUser.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56 rounded-xl"
              >
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
