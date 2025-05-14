"use client"

import { useState } from "react"
import { hosts } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { AlertTriangle, Filter, Search, Wrench, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function Hosts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    os: "all",
    riskLevel: "all",
  })

  const filteredHosts = hosts.filter((host) => {
    const matchesSearch =
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.os.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filters.type === "all" ? true : host.type === filters.type
    const matchesOs = filters.os === "all" ? true : host.os.includes(filters.os)
    const matchesRisk =
      filters.riskLevel === "all"
        ? true
        : filters.riskLevel === "critical"
          ? host.vulnerabilities.critical > 0
          : filters.riskLevel === "high"
            ? host.vulnerabilities.high > 0
            : true

    return matchesSearch && matchesType && matchesOs && matchesRisk
  })

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Host Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Managing hosts with cryptographic assets across your infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/vulnerabilities">
              <AlertTriangle className="mr-1 h-4 w-4" />
              View Vulnerabilities
            </Link>
          </Button>
          <Button asChild>
            <Link href="/remediation">
              <Wrench className="mr-1 h-4 w-4" />
              Remediation
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search hosts, IP addresses, operating systems..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Filter className="h-4 w-4" />
                    Host Type
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Host Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.type === "all"}
                    onCheckedChange={() => setFilters({ ...filters, type: "all" })}
                  >
                    All Types
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === "VM"}
                    onCheckedChange={() => setFilters({ ...filters, type: "VM" })}
                  >
                    Virtual Machine
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === "Container"}
                    onCheckedChange={() => setFilters({ ...filters, type: "Container" })}
                  >
                    Container
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === "Physical"}
                    onCheckedChange={() => setFilters({ ...filters, type: "Physical" })}
                  >
                    Physical
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Filter className="h-4 w-4" />
                    OS
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Operating System</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.os === "all"}
                    onCheckedChange={() => setFilters({ ...filters, os: "all" })}
                  >
                    All Operating Systems
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.os === "Ubuntu"}
                    onCheckedChange={() => setFilters({ ...filters, os: "Ubuntu" })}
                  >
                    Ubuntu
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.os === "CentOS"}
                    onCheckedChange={() => setFilters({ ...filters, os: "CentOS" })}
                  >
                    CentOS
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.os === "Debian"}
                    onCheckedChange={() => setFilters({ ...filters, os: "Debian" })}
                  >
                    Debian
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.os === "Alpine"}
                    onCheckedChange={() => setFilters({ ...filters, os: "Alpine" })}
                  >
                    Alpine
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={() => setFilters({ type: "all", os: "all", riskLevel: "all" })}>
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hosts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredHosts.map((host) => (
          <Card key={host.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{host.name}</CardTitle>
                <Badge
                  className={`${
                    host.vulnerabilities.critical > 0
                      ? "bg-red-500"
                      : host.vulnerabilities.high > 0
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                >
                  {host.vulnerabilities.critical > 0
                    ? "Critical"
                    : host.vulnerabilities.high > 0
                      ? "High Risk"
                      : "Secure"}
                </Badge>
              </div>
              <CardDescription>
                {host.type} | {host.os} | {host.ip}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Certificates</span>
                  <span className="font-medium">{host.certificates}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Keys</span>
                  <span className="font-medium">{host.keys}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Applications</span>
                  <span className="font-medium">{host.apps.length}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Issues</span>
                  <div className="flex gap-1">
                    {host.vulnerabilities.critical > 0 && (
                      <Badge variant="destructive">{host.vulnerabilities.critical} Critical</Badge>
                    )}
                    {host.vulnerabilities.high > 0 && (
                      <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">
                        {host.vulnerabilities.high} High
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/inventory/${host.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
