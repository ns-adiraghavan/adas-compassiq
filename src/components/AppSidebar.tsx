
import { Home, BarChart3, Database, Settings, Brain, Users, Globe } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import SidebarPartnerEcosystem from "./SidebarPartnerEcosystem"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Data Sources",
    url: "/data",
    icon: Database,
  },
  {
    title: "AI Insights",
    url: "/ai",
    icon: Brain,
  },
  {
    title: "OEM Partners",
    url: "/partners",
    icon: Users,
  },
  {
    title: "Global View",
    url: "/global",
    icon: Globe,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

interface AppSidebarProps {
  selectedOEM?: string
}

export function AppSidebar({ selectedOEM = "" }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">WP</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">WayPoint</h2>
            <p className="text-xs text-muted-foreground">AI-Powered Analytics</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarPartnerEcosystem selectedOEM={selectedOEM} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
