import * as React from "react"
import {
  IconArticle,
  IconChartBar,
  IconDashboard,
  IconFileText,
  IconFolder,
  IconLogout,
  IconNewSection,
  IconSettings,
  IconTags,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
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
} from "@/components/ui/sidebar"
import { useAppSelector } from "@/store/hooks"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.auth)

  const data = {
    user: {
      name: user ? `${user.firstName} ${user.lastName}` : "Utilisateur",
      email: user?.email || "",
      avatar: user?.picture || "",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Statistiques",
        url: "/dashboard/stats",
        icon: IconChartBar,
      },
    ],
    articles: [
      {
        title: "Articles",
        icon: IconArticle,
        isActive: true,
        url: "/dashboard/posts",
        items: [
          {
            title: "Tous les articles",
            url: "/dashboard/posts",
          },
          {
            title: "Nouveau",
            url: "/dashboard/posts/new",
          },
          {
            title: "Brouillons",
            url: "/dashboard/posts/drafts",
          },
        ],
      },
      {
        title: "Catégories",
        icon: IconTags,
        url: "/dashboard/categories",
        items: [
          {
            title: "Toutes",
            url: "/dashboard/categories",
          },
          {
            title: "Nouvelle",
            url: "/dashboard/categories/new",
          },
        ],
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
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconFileText className="!size-5" />
                <span className="text-base font-semibold">Mini Blog</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.articles} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
