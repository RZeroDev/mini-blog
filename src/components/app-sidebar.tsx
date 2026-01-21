import * as React from "react"
import {
  IconArticle,
  IconDashboard,
  IconFileText,
  IconLogout,
  IconSettings,
  IconTags,
  IconExternalLink,
  IconActivity,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useAppSelector } from "@/store/hooks"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth)

  const data = {
    user: {
      name: user ? `${user.firstName} ${user.lastName}` : "Utilisateur",
      email: user?.email || "",
      avatar: "",
    },
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Articles",
        url: "/dashboard/posts",
        icon: IconArticle,
      },
      {
        title: "Catégories",
        url: "/dashboard/categories",
        icon: IconTags,
      },
      {
        title: "Logs système",
        url: "/dashboard/logs",
        icon: IconActivity,
      },
    ],
    navSecondary: [
      {
        title: "Paramètres",
        url: "/dashboard/settings",
        icon: IconSettings,
      },
      {
        title: "Déconnexion",
        url: "/logout",
        icon: IconLogout,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <IconFileText className="size-5!" />
                <span className="text-base font-semibold">Mini Blog</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        
        {/* Link to visit the site */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="group hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <a 
                    href="/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <IconExternalLink className="h-4 w-4" />
                      <span>Aller sur le site</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
