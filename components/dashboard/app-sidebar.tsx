"use client";

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Brain, Zap, Settings } from "lucide-react"
import { APP_VERSION } from "@/lib/constants"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navigationItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Memories", href: "/memories", icon: Brain },
  { name: "Automations", href: "/automations", icon: Zap },
  { name: "Settings", href: "/settings", icon: Settings },
]

const AppSidebarHeader = () => {
  return (
    <SidebarHeader>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 pl-2">
          <img
            src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
            alt="BARK Logo"
            className="h-8 w-8"
          />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold leading-none">BARK</span>
            <span className="font-inter font-semibold text-xs text-muted-foreground">AI Chatbot</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <div className="flex items-center gap-1.5 group-data-[collapsible=icon]:hidden">
            <span className="select-none rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              {APP_VERSION}
            </span>
          </div>
        </div>
      </div>
    </SidebarHeader>
  )
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <span className="select-none rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {APP_VERSION}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

