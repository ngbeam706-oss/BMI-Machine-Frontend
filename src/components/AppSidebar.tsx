import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Cpu, Users, BarChart3,
  BellRing, UserCog, Settings, LogOut, LucideIcon
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Branches", url: "/branches", icon: Building2 },
  { title: "Devices", url: "/devices", icon: Cpu },
  { title: "Patients", url: "/patients", icon: Users },
];

const insightItems = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Alerts", url: "/alerts", icon: BellRing, badge: 7 },
];

const adminItems = [
  // { title: "Add Device", url: "/devices?add=true", icon: Cpu },
  { title: "Users / Staff", url: "/users", icon: UserCog },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const renderItem = (item: { title: string; url: string; icon: LucideIcon; badge?: number }) => {
    const isActive = item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url);
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild className="h-10">
          <NavLink
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground font-semibold"
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={isActive ? 2.4 : 2} />
            {!collapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center justify-center px-4">
        <Logo showText={!collapsed} />
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3">Monitoring</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{mainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          {!collapsed && <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3">Insights</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{insightItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          {!collapsed && <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3">Administration</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{adminItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">AR</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Dr. Anitha Rao</p>
              <p className="text-xs text-muted-foreground truncate">Super Admin</p>
            </div>
            <NavLink to="/login" className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </NavLink>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">AR</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
