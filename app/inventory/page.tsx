"use client"

import { useState, useEffect } from "react"
import { hosts, apps } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import Link from "next/link"
import {
  AlertTriangle,
  Database,
  Download,
  Filter,
  Search,
  Server,
  Shield,
  Wrench,
  ChevronDown,
  BarChart4,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  HardDrive,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ChartContainer, Chart, ChartBars, ChartBar } from "@/components/ui/chart"

// Mock expanded data for enterprise scale
const TOTAL_HOSTS = 134892
const TOTAL_CERTIFICATES = 57238
const TOTAL_KEYS = 94321
const HOSTS_PER_PAGE = 10

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("hosts")
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleHosts, setVisibleHosts] = useState(hosts)
  const [selectedHosts, setSelectedHosts] = useState<string[]>([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "visual">("list")
  const [filters, setFilters] = useState({
    app: "all",
    type: "all",
    os: "all",
    riskLevel: "all",
  })

  // Pretend we're loading paginated data
  useEffect(() => {
    // Simulate API call with filtering and pagination
    const filteredHosts = hosts.filter((host) => {
      const matchesSearch =
        host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        host.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        host.os.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesApp = filters.app === "all" ? true : host.apps.includes(filters.app)
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

      return matchesSearch && matchesApp && matchesType && matchesOs && matchesRisk
    })

    // Apply pagination
    const startIndex = (currentPage - 1) * HOSTS_PER_PAGE
    setVisibleHosts(filteredHosts.slice(startIndex, startIndex + HOSTS_PER_PAGE))

    // Reset selection when filters change
    setSelectedHosts([])
    setIsAllSelected(false)
  }, [searchQuery, filters, currentPage])

  // Host metrics for charts
  const hostTypeData = [
    { name: "VMs", value: 68294, color: "#3b82f6" },
    { name: "Containers", value: 52398, color: "#8b5cf6" },
    { name: "Physical", value: 14200, color: "#ec4899" },
  ]

  const osDistributionData = [
    { name: "Ubuntu", value: 45712, color: "#ef4444" },
    { name: "CentOS", value: 28935, color: "#f97316" },
    { name: "Debian", value: 19874, color: "#a855f7" },
    { name: "Alpine", value: 26841, color: "#3b82f6" },
    { name: "RHEL", value: 13530, color: "#ef4444" },
  ]

  const vulnerabilityData = [
    { name: "Critical", value: 2341, color: "#ef4444" },
    { name: "High", value: 4982, color: "#f97316" },
    { name: "Medium", value: 3824, color: "#eab308" },
    { name: "Low", value: 1698, color: "#22c55e" },
  ]

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedHosts([])
    } else {
      setSelectedHosts(visibleHosts.map((host) => host.id))
    }
    setIsAllSelected(!isAllSelected)
  }

  const toggleSelectHost = (hostId: string) => {
    if (selectedHosts.includes(hostId)) {
      setSelectedHosts(selectedHosts.filter((id) => id !== hostId))
    } else {
      setSelectedHosts([...selectedHosts, hostId])
    }
  }

  const totalPages = Math.ceil(hosts.length / HOSTS_PER_PAGE)

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Enterprise Crypto Asset Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Managing {TOTAL_HOSTS.toLocaleString()} hosts, {TOTAL_CERTIFICATES.toLocaleString()} certificates, and{" "}
            {TOTAL_KEYS.toLocaleString()} encryption keys
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Hosts</p>
                <p className="text-2xl font-bold mt-1">{TOTAL_HOSTS.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <Server className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="destructive">743 Critical</Badge>
              <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">
                2,891 High Risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Certificates</p>
                <p className="text-2xl font-bold mt-1">{TOTAL_CERTIFICATES.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="outline" className="text-amber-500 border-amber-200 dark:border-amber-800">
                432 Expiring Soon
              </Badge>
              <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">
                189 Expired
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Keys</p>
                <p className="text-2xl font-bold mt-1">{TOTAL_KEYS.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                <Database className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">
                3,421 Weak Algorithms
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Applications</p>
                <p className="text-2xl font-bold mt-1">20,587</p>
              </div>
              <div className="p-2 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <HardDrive className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="destructive">1,243 Critical</Badge>
              <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">
                3,421 High Risk
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
            <div className="relative md:col-span-3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search hosts, IPs, OS, applications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="md:col-span-5 flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Filter className="h-4 w-4" />
                    App
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Application</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.app === "all"}
                    onCheckedChange={() => setFilters({ ...filters, app: "all" })}
                  >
                    All Applications
                  </DropdownMenuCheckboxItem>
                  {apps.map((app) => (
                    <DropdownMenuCheckboxItem
                      key={app.id}
                      checked={filters.app === app.id}
                      onCheckedChange={() => setFilters({ ...filters, app: app.id })}
                    >
                      {app.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Server className="h-4 w-4" />
                    Type
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
                    <AlertTriangle className="h-4 w-4" />
                    Risk
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Risk Level</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.riskLevel === "all"}
                    onCheckedChange={() => setFilters({ ...filters, riskLevel: "all" })}
                  >
                    All Risk Levels
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.riskLevel === "critical"}
                    onCheckedChange={() => setFilters({ ...filters, riskLevel: "critical" })}
                  >
                    Critical Issues
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.riskLevel === "high"}
                    onCheckedChange={() => setFilters({ ...filters, riskLevel: "high" })}
                  >
                    High Risk
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.riskLevel === "secure"}
                    onCheckedChange={() => setFilters({ ...filters, riskLevel: "secure" })}
                  >
                    Secure
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={() => setFilters({ app: "all", type: "all", os: "all", riskLevel: "all" })}
              >
                Reset Filters
              </Button>

              <div className="flex gap-2 ml-auto">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <ListFilter className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "visual" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("visual")}
                >
                  <BarChart4 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "visual" ? (
        // Visual/Charts View
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Host Distribution</CardTitle>
              <CardDescription>Breakdown of hosts by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer height={250} data={hostTypeData}>
                  <Chart>
                    <ChartBars>
                      {hostTypeData.map((d) => (
                        <ChartBar
                          key={d.name}
                          value={d.value}
                          style={{
                            fill: d.color,
                          }}
                        />
                      ))}
                    </ChartBars>
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OS Distribution</CardTitle>
              <CardDescription>Breakdown of hosts by operating system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer height={250} data={osDistributionData}>
                  <Chart>
                    <ChartBars>
                      {osDistributionData.map((d) => (
                        <ChartBar
                          key={d.name}
                          value={d.value}
                          style={{
                            fill: d.color,
                          }}
                        />
                      ))}
                    </ChartBars>
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vulnerabilities by Severity</CardTitle>
              <CardDescription>Distribution of vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer height={250} data={vulnerabilityData}>
                  <Chart>
                    <ChartBars>
                      {vulnerabilityData.map((d) => (
                        <ChartBar
                          key={d.name}
                          value={d.value}
                          style={{
                            fill: d.color,
                          }}
                        />
                      ))}
                    </ChartBars>
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Critical findings from AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <h3 className="font-medium text-red-800 dark:text-red-300 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Weak Encryption Clustering
                </h3>
                <p className="text-sm mt-1 text-red-800 dark:text-red-300">
                  3,421 keys with weak algorithms found in 743 critical applications
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Certificate Expiration Risk
                </h3>
                <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
                  432 certificates will expire within the next 30 days across 286 applications
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
                  <Database className="h-4 w-4 mr-1" />
                  Key Rotation Insight
                </h3>
                <p className="text-sm mt-1 text-blue-800 dark:text-blue-300">
                  87% of keys have not been rotated in over 180 days
                </p>
              </div>

              <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">View Full Analysis</Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Inventory Content */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <CardDescription>Browse and manage cryptographic assets across your infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="hosts">
                <Server className="mr-1 h-4 w-4" />
                Hosts
              </TabsTrigger>
              <TabsTrigger value="certificates">
                <Shield className="mr-1 h-4 w-4" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="keys">
                <Database className="mr-1 h-4 w-4" />
                Encryption Keys
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hosts">
              {viewMode === "list" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                      <label htmlFor="select-all" className="text-sm font-medium">
                        Select All
                      </label>

                      {selectedHosts.length > 0 && (
                        <Badge variant="outline" className="ml-2">
                          {selectedHosts.length} selected
                        </Badge>
                      )}
                    </div>

                    {selectedHosts.length > 0 && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Shield className="mr-1 h-4 w-4" />
                          Scan Selected
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-4 w-4" />
                          Export Selected
                        </Button>
                      </div>
                    )}
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead>Host Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>OS</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Certificates</TableHead>
                        <TableHead>Keys</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleHosts.map((host) => (
                        <TableRow key={host.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedHosts.includes(host.id)}
                              onCheckedChange={() => toggleSelectHost(host.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{host.name}</TableCell>
                          <TableCell>{host.type}</TableCell>
                          <TableCell>{host.os}</TableCell>
                          <TableCell>{host.ip}</TableCell>
                          <TableCell>{host.certificates}</TableCell>
                          <TableCell>{host.keys}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                host.vulnerabilities.critical > 0
                                  ? "bg-red-500"
                                  : host.vulnerabilities.high > 0
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                              }
                            >
                              {host.vulnerabilities.critical > 0
                                ? "Critical"
                                : host.vulnerabilities.high > 0
                                  ? "High"
                                  : "Secure"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" asChild>
                              <Link href={`/inventory/${host.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Enterprise-scale pagination */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-slate-500">
                      Showing {(currentPage - 1) * HOSTS_PER_PAGE + 1} to{" "}
                      {Math.min(currentPage * HOSTS_PER_PAGE, TOTAL_HOSTS)} of {TOTAL_HOSTS.toLocaleString()} hosts
                    </div>

                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            First
                          </PaginationLink>
                        </PaginationItem>

                        {currentPage > 2 && (
                          <PaginationItem>
                            <PaginationLink onClick={() => setCurrentPage(currentPage - 2)}>
                              {currentPage - 2}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                              {currentPage - 1}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        <PaginationItem>
                          <PaginationLink isActive>{currentPage}</PaginationLink>
                        </PaginationItem>

                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                              {currentPage + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {currentPage < totalPages - 1 && (
                          <PaginationItem>
                            <PaginationLink onClick={() => setCurrentPage(currentPage + 2)}>
                              {currentPage + 2}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {currentPage < totalPages - 3 && <PaginationEllipsis />}

                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                          >
                            Last
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </PaginationLink>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="certificates">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">
                        <Checkbox id="select-all-certs" />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Issued Date</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">api.example.com</TableCell>
                      <TableCell>prod-api-01</TableCell>
                      <TableCell>2023-01-15</TableCell>
                      <TableCell>2023-06-15</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                        >
                          Expiring Soon
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="mr-1">
                          Payment Gateway
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">web.example.com</TableCell>
                      <TableCell>prod-web-01</TableCell>
                      <TableCell>2023-05-22</TableCell>
                      <TableCell>2023-11-22</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        >
                          Valid
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="mr-1">
                          CMS
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Additional rows would be here in a real implementation */}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-slate-500">
                    Showing 1 to 10 of {TOTAL_CERTIFICATES.toLocaleString()} certificates
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationLink>
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          First
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink>2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink>3</PaginationLink>
                      </PaginationItem>
                      <PaginationEllipsis />
                      <PaginationItem>
                        <PaginationLink>
                          Last
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </PaginationLink>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="keys">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">
                        <Checkbox id="select-all-keys" />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Algorithm</TableHead>
                      <TableHead>Last Rotated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">api-auth-key</TableCell>
                      <TableCell>prod-api-01</TableCell>
                      <TableCell>Authentication</TableCell>
                      <TableCell>RSA 1024-bit</TableCell>
                      <TableCell>2023-01-10</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                        >
                          Weak
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">web-ssl-key</TableCell>
                      <TableCell>prod-web-01</TableCell>
                      <TableCell>SSL/TLS</TableCell>
                      <TableCell>RSA 2048-bit</TableCell>
                      <TableCell>2023-05-22</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        >
                          Secure
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Additional rows would be here in a real implementation */}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-slate-500">Showing 1 to 10 of {TOTAL_KEYS.toLocaleString()} keys</div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationLink>
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          First
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink>2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink>3</PaginationLink>
                      </PaginationItem>
                      <PaginationEllipsis />
                      <PaginationItem>
                        <PaginationLink>
                          Last
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </PaginationLink>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
