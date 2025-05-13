"use client"

import { useState } from "react"
import { apps } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  SearchIcon,
  Filter,
  ChevronDown,
  Star,
  StarOff,
  Server,
  Shield,
  Database,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { ChartContainer, Chart, ChartBars, ChartBar } from "@/components/ui/chart"

// Mock data for metrics
const overviewMetrics = {
  totalApps: 20587,
  criticalRisk: 1243,
  highRisk: 3421,
  totalHosts: 134892,
  totalCertificates: 57238,
  totalKeys: 94321,
  totalVulnerabilities: 12845,
  resourcesByType: [
    { name: "VMs", value: 68294, color: "#3b82f6" },
    { name: "Containers", value: 52398, color: "#8b5cf6" },
    { name: "Physical", value: 14200, color: "#ec4899" },
  ],
  vulnerabilityBySeverity: [
    { name: "Critical", value: 2341, color: "#ef4444" },
    { name: "High", value: 4982, color: "#f97316" },
    { name: "Medium", value: 3824, color: "#eab308" },
    { name: "Low", value: 1698, color: "#22c55e" },
  ],
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("grid")
  const [selectedFilters, setSelectedFilters] = useState({
    risk: "all",
    type: "all",
    status: "all",
    favorites: false,
  })

  // Paginated data - in a real application, this would be fetched from an API with pagination
  const itemsPerPage = 9
  const totalApps = apps.length
  const totalPages = Math.ceil(totalApps / itemsPerPage)

  const filterApps = () => {
    let filtered = [...apps]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply risk filter
    if (selectedFilters.risk === "high_risk") {
      filtered = filtered.filter((app) => app.risk_score < 70)
    } else if (selectedFilters.risk === "critical") {
      filtered = filtered.filter((app) => app.vulnerabilities.critical > 0)
    }

    // Pagination
    return filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }

  const getRiskColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum)
  }

  return (
    <div className="container max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Enterprise Crypto Asset Manager</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Managing {overviewMetrics.totalApps.toLocaleString()} apps and {overviewMetrics.totalHosts.toLocaleString()}{" "}
            resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/reports">
              Enterprise Report
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Applications</p>
                <p className="text-2xl font-bold mt-1">{overviewMetrics.totalApps.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <Server className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 border-red-200">
                {overviewMetrics.criticalRisk.toLocaleString()} Critical Risk
              </Badge>
              <Badge
                variant="outline"
                className="ml-2 bg-amber-50 text-amber-700 dark:bg-amber-900/20 border-amber-200"
              >
                {overviewMetrics.highRisk.toLocaleString()} High Risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Hosts</p>
                <p className="text-2xl font-bold mt-1">{overviewMetrics.totalHosts.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                <Server className="h-5 w-5" />
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full mt-2">
              <div
                className="h-2 rounded-full bg-purple-500"
                style={{ width: `${(overviewMetrics.resourcesByType[0].value / overviewMetrics.totalHosts) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>
                VMs: {Math.round((overviewMetrics.resourcesByType[0].value / overviewMetrics.totalHosts) * 100)}%
              </span>
              <span>
                Containers: {Math.round((overviewMetrics.resourcesByType[1].value / overviewMetrics.totalHosts) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Certificates</p>
                <p className="text-2xl font-bold mt-1">{overviewMetrics.totalCertificates.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="outline" className="text-amber-500 border-amber-200 dark:border-amber-800">
                432 Expiring within 30 days
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Vulnerabilities</p>
                <p className="text-2xl font-bold mt-1">{overviewMetrics.totalVulnerabilities.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="destructive">
                {overviewMetrics.vulnerabilityBySeverity[0].value.toLocaleString()} Critical
              </Badge>
              <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">
                {overviewMetrics.vulnerabilityBySeverity[1].value.toLocaleString()} High
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
            <CardDescription>Distribution of risk across your enterprise</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="applications">
              <TabsList>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="hosts">Hosts</TabsTrigger>
                <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
              </TabsList>
              <TabsContent value="applications" className="mt-4">
                <div className="h-64">
                  <ChartContainer height={250} data={overviewMetrics.vulnerabilityBySeverity}>
                    <Chart>
                      <ChartBars>
                        {overviewMetrics.vulnerabilityBySeverity.map((d) => (
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
              </TabsContent>
              <TabsContent value="hosts" className="mt-4">
                <div className="h-64">
                  <ChartContainer height={250} data={overviewMetrics.resourcesByType}>
                    <Chart>
                      <ChartBars>
                        {overviewMetrics.resourcesByType.map((d) => (
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
              </TabsContent>
              <TabsContent value="vulnerabilities" className="mt-4">
                <div className="h-64">
                  <ChartContainer height={250} data={overviewMetrics.vulnerabilityBySeverity}>
                    <Chart>
                      <ChartBars>
                        {overviewMetrics.vulnerabilityBySeverity.map((d) => (
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Findings</CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <h3 className="font-medium text-red-800 dark:text-red-300 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Expired Certificates
              </h3>
              <p className="text-sm mt-1 text-red-800 dark:text-red-300">
                189 certificates expired across 47 applications
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Weak Algorithms
              </h3>
              <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
                3,421 encryption keys using deprecated algorithms
              </p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
                <Database className="h-4 w-4 mr-1" />
                Key Rotation
              </h3>
              <p className="text-sm mt-1 text-blue-800 dark:text-blue-300">
                871 keys haven't been rotated in over 180 days
              </p>
            </div>

            <Button className="w-full mt-2" variant="destructive">
              View All Critical Findings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search 20,000+ applications by name, ID, or description..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <Filter className="h-4 w-4" />
                      Risk Level
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Risk</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedFilters.risk === "all"}
                      onCheckedChange={() => setSelectedFilters({ ...selectedFilters, risk: "all" })}
                    >
                      All Risk Levels
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedFilters.risk === "high_risk"}
                      onCheckedChange={() => setSelectedFilters({ ...selectedFilters, risk: "high_risk" })}
                    >
                      High Risk
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedFilters.risk === "critical"}
                      onCheckedChange={() => setSelectedFilters({ ...selectedFilters, risk: "critical" })}
                    >
                      Critical Vulnerabilities
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <Filter className="h-4 w-4" />
                      App Type
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedFilters.type === "all"}
                      onCheckedChange={() => setSelectedFilters({ ...selectedFilters, type: "all" })}
                    >
                      All Types
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedFilters.type === "payment"}
                      onCheckedChange={() => setSelectedFilters({ ...selectedFilters, type: "payment" })}
                    >
                      Payment Processing
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedFilters.type === "auth"}
                      onCheckedChange={() => setSelectedFilters({ ...selectedFilters, type: "auth" })}
                    >
                      Authentication
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedFilters.type === "data"}
                      onCheckedChange={() => setSelectedFilters({ ...selectedFilters, type: "data" })}
                    >
                      Data Storage
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant={selectedFilters.favorites ? "default" : "outline"}
                  className="flex gap-2"
                  onClick={() => setSelectedFilters({ ...selectedFilters, favorites: !selectedFilters.favorites })}
                >
                  {selectedFilters.favorites ? (
                    <>
                      <Star className="h-4 w-4 fill-current" />
                      Favorites
                    </>
                  ) : (
                    <>
                      <StarOff className="h-4 w-4" />
                      Favorites
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="flex gap-2"
                  onClick={() =>
                    setSelectedFilters({
                      risk: "all",
                      type: "all",
                      status: "all",
                      favorites: false,
                    })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Application Inventory</CardTitle>
            <CardDescription className="mt-1">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalApps)} of{" "}
              {totalApps} applications
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterApps().map((app) => (
                <Card
                  key={app.id}
                  className="overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{app.name}</CardTitle>
                      <Badge
                        className={`${app.risk_score < 70 ? "bg-red-500" : app.risk_score < 90 ? "bg-amber-500" : "bg-green-500"}`}
                      >
                        Risk: {app.risk_score}/100
                      </Badge>
                    </div>
                    <CardDescription>{app.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Certificates</span>
                        <span className="font-medium">{app.certificates}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Keys</span>
                        <span className="font-medium">{app.keys}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Hosts</span>
                        <span className="font-medium">{app.hosts}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Vulnerabilities</span>
                        <div className="flex gap-1">
                          {app.vulnerabilities.critical > 0 && (
                            <Badge variant="destructive">{app.vulnerabilities.critical} Critical</Badge>
                          )}
                          {app.vulnerabilities.high > 0 && (
                            <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">
                              {app.vulnerabilities.high} High
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>Security Status</span>
                        <span className={getRiskColor(app.risk_score)}>
                          {app.risk_score >= 90 ? "Good" : app.risk_score >= 70 ? "Needs Attention" : "At Risk"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`${
                            app.risk_score >= 90 ? "bg-green-500" : app.risk_score >= 70 ? "bg-amber-500" : "bg-red-500"
                          } h-2 rounded-full`}
                          style={{ width: `${app.risk_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Last scan: {new Date(app.last_scan).toLocaleDateString()}
                    </div>
                    <Button asChild>
                      <Link href={`/dashboard?appId=${app.id}`}>
                        View Details <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            // Table View
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left font-medium p-2">Name</th>
                    <th className="text-left font-medium p-2">Risk Score</th>
                    <th className="text-left font-medium p-2">Hosts</th>
                    <th className="text-left font-medium p-2">Certificates</th>
                    <th className="text-left font-medium p-2">Keys</th>
                    <th className="text-left font-medium p-2">Vulnerabilities</th>
                    <th className="text-left font-medium p-2">Last Scan</th>
                    <th className="text-left font-medium p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterApps().map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-xs text-slate-500 truncate max-w-xs">{app.description}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge
                          className={`${app.risk_score < 70 ? "bg-red-500" : app.risk_score < 90 ? "bg-amber-500" : "bg-green-500"}`}
                        >
                          {app.risk_score}/100
                        </Badge>
                      </td>
                      <td className="p-2">{app.hosts}</td>
                      <td className="p-2">{app.certificates}</td>
                      <td className="p-2">{app.keys}</td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          {app.vulnerabilities.critical > 0 && (
                            <Badge variant="destructive">{app.vulnerabilities.critical}</Badge>
                          )}
                          {app.vulnerabilities.high > 0 && (
                            <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">
                              {app.vulnerabilities.high}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-xs text-slate-500">{new Date(app.last_scan).toLocaleDateString()}</td>
                      <td className="p-2">
                        <Button asChild size="sm">
                          <Link href={`/dashboard?appId=${app.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                  First
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationLink>
              </PaginationItem>

              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(currentPage - 2)}>{currentPage - 2}</PaginationLink>
                </PaginationItem>
              )}

              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                </PaginationItem>
              )}

              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(currentPage + 2)}>{currentPage + 2}</PaginationLink>
                </PaginationItem>
              )}

              {currentPage < totalPages - 2 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                  Last
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  )
}
