"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  BarChart4,
  Database,
  HardDrive,
  Home,
  Layers,
  MessageSquareWarning,
  Search,
  Server,
  Settings,
  Shield,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function SidebarNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-14 items-center px-4 font-semibold">
            <Shield className="mr-2 h-6 w-6" />
            Enterprise Crypto Manager
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="px-4 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input type="search" placeholder="Search..." className="w-full bg-slate-100 pl-8 dark:bg-slate-800" />
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/inventory"}>
                <Link href="/inventory">
                  <Layers className="mr-2 h-4 w-4" />
                  Asset Inventory
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/vulnerabilities")}>
                <Link href="/vulnerabilities">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Vulnerabilities
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    12
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/remediation")}>
                <Link href="/remediation">
                  <Wrench className="mr-2 h-4 w-4" />
                  Remediation
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/reports")}>
                <Link href="/reports">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Reports
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/ai-assistant")}>
                <Link href="/ai-assistant">
                  <MessageSquareWarning className="mr-2 h-4 w-4" />
                  AI Assistant
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="py-2">
            <div className="px-3 text-xs font-medium text-slate-500 dark:text-slate-400">Resources</div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Server className="mr-2 h-4 w-4" />
                  Hosts
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">134,892</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="#">Virtual Machines</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="#">Containers</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="#">Physical Servers</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <HardDrive className="mr-2 h-4 w-4" />
                  Applications
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">20,587</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Shield className="mr-2 h-4 w-4" />
                  Certificates
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">57,238</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Database className="mr-2 h-4 w-4" />
                  Encryption Keys
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">94,321</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-3 py-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex min-h-screen flex-col">
        <SidebarTrigger className="absolute left-4 top-4 z-50 sm:left-6" />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}
