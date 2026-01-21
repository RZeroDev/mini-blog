"use client"

import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { type Icon } from "@tabler/icons-react"
import { useAppDispatch } from "@/store/hooks"
import { logout } from "@/store/slices/authSlice"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(logout())
    navigate("/login")
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url
            const isLogout = item.url === "/logout"

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  {isLogout ? (
                    <a href="#" onClick={handleLogout}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  ) : (
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
