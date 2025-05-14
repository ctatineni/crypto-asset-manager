"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  BarChart,
  FileText,
  Home,
  Key,
  LayoutDashboard,
  Library,
  List,
  Server,
  Shield,
  Wrench,
  MessagesSquare,
  Brain,
  Network,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navigation = [
    { name: "Overview", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Cryptographic Assets",
      icon: Shield,
      children: [
        { name: "Inventory", href: "/inventory", icon: List },
        { name: "Certificates", href: "/certificates", icon: FileText },
        { name: "Keys", href: "/keys", icon: Key },
      ],
    },
    { name: "Knowledge Graph", href: "/knowledge-graph", icon: Network },
    { name: "Vulnerabilities", href: "/vulnerabilities", icon: AlertTriangle },
    { name: "Libraries", href: "/libraries", icon: Library },
    { name: "Hosts", href: "/hosts", icon: Server },
    { name: "Remediation", href: "/remediation", icon: Wrench },
    { name: "Reports", href: "/reports", icon: BarChart },
    { name: "AI Assistant", href: "/ai-assistant", icon: MessagesSquare },
    { name: "Recommendations", href: "/recommendations", icon: Brain },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-800 text-white z-10 hidden md:block">
      <div className="flex h-16 items-center justify-center border-b border-slate-700">
        <Shield className="h-6 w-6 text-blue-400 mr-2" />
        <h1 className="text-xl font-bold">CryptoGuard</h1>
      </div>
      <nav className="p-4 space-y-1">
        {navigation.map((item) =>
          !item.children ? (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.href) ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          ) : (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center px-3 py-2 text-sm font-medium text-slate-400">
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </div>
              <div className="space-y-1 pl-10">
                {item.children.map((child) => (
                  <Link
                    key={child.name}
                    href={child.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(child.href)
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <child.icon className="h-4 w-4 mr-2" />
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          ),
        )}
      </nav>
    </aside>
  )
}
