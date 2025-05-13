"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Home, Shield, Database, AlertTriangle, Code, FileText, Wrench, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart },
  { name: "Inventory", href: "/inventory", icon: Database },
  { name: "Vulnerabilities", href: "/vulnerabilities", icon: AlertTriangle },
  { name: "Libraries", href: "/libraries", icon: Code },
  { name: "Remediation", href: "/remediation", icon: Wrench },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "AI Assistant", href: "/ai-assistant", icon: BrainCircuit },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
      <div className="p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.name}
                asChild
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>

      <div className="p-4 mt-4">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-sm font-medium text-blue-800 dark:text-blue-300">Security Status</span>
          </div>
          <div className="mt-2 text-xs font-medium text-blue-800 dark:text-blue-300">
            Overall Risk Score:
            <span className="ml-1 text-amber-500 font-bold">73/100</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: "73%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
