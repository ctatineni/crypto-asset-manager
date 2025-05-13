"use client"

import { useState } from "react"
import { vulnerabilities, apps } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Clock, Code, FileText, Server, Wrench } from "lucide-react"
import { ChartContainer, Chart, ChartBars, ChartBar, ChartTooltip } from "@/components/ui/chart"

export default function Vulnerabilities() {
  const [selectedApp, setSelectedApp] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("severity")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")

  const filteredVulnerabilities = vulnerabilities
    .filter((vuln) => (selectedApp === "all" ? true : vuln.affected_apps.includes(selectedApp)))
    .filter((vuln) => (filterSeverity === "all" ? true : vuln.severity === filterSeverity))
    .sort((a, b) => {
      if (sortBy === "severity") {
        const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 }
        // @ts-ignore
        return severityOrder[b.severity] - severityOrder[a.severity]
      } else if (sortBy === "date") {
        return new Date(b.detected).getTime() - new Date(a.detected).getTime()
      }
      return 0
    })

  const chartData = [
    { name: "Critical", value: vulnerabilities.filter((v) => v.severity === "critical").length, color: "#ef4444" },
    { name: "High", value: vulnerabilities.filter((v) => v.severity === "high").length, color: "#f97316" },
    { name: "Medium", value: vulnerabilities.filter((v) => v.severity === "medium").length, color: "#eab308" },
    { name: "Low", value: vulnerabilities.filter((v) => v.severity === "low").length, color: "#22c55e" },
  ]

  const statusChartData = [
    { name: "Open", value: vulnerabilities.filter((v) => v.status === "open").length, color: "#ef4444" },
    { name: "In Progress", value: vulnerabilities.filter((v) => v.status === "in_progress").length, color: "#eab308" },
    { name: "Resolved", value: vulnerabilities.filter((v) => v.status === "resolved").length, color: "#22c55e" },
  ]

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Vulnerabilities</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage cryptographic vulnerabilities across your applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/remediation">
              <Wrench className="mr-1 h-4 w-4" />
              Remediation
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/reports">
              <FileText className="mr-1 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <label className="text-sm font-medium block mb-2">Application</label>
              <Select value={selectedApp} onValueChange={setSelectedApp}>
                <SelectTrigger>
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  {apps.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-64">
              <label className="text-sm font-medium block mb-2">Severity</label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-64">
              <label className="text-sm font-medium block mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="severity">Severity (High to Low)</SelectItem>
                  <SelectItem value="date">Detection Date (Newest First)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Vulnerability Overview</CardTitle>
            <CardDescription>Distribution of vulnerabilities by severity and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-4">By Severity</h3>
                <div className="h-60">
                  <ChartContainer height={250} data={chartData}>
                    <Chart>
                      <ChartBars>
                        {chartData.map((d) => (
                          <ChartBar
                            key={d.name}
                            value={d.value}
                            style={{
                              fill: d.color,
                            }}
                          />
                        ))}
                      </ChartBars>
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-4">By Status</h3>
                <div className="h-60">
                  <ChartContainer height={250} data={statusChartData}>
                    <Chart>
                      <ChartBars>
                        {statusChartData.map((d) => (
                          <ChartBar
                            key={d.name}
                            value={d.value}
                            style={{
                              fill: d.color,
                            }}
                          />
                        ))}
                      </ChartBars>
                      <ChartTooltip />
                    </Chart>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>AI-driven security insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <h3 className="font-medium text-red-800 dark:text-red-300 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Critical Priority
                </h3>
                <p className="text-sm mt-1 text-red-800 dark:text-red-300">
                  Update OpenSSL to patch CVE-2023-0286 affecting 3 applications
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Expiring Soon
                </h3>
                <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
                  2 SSL certificates will expire within 30 days
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
                  <Code className="h-4 w-4 mr-1" />
                  Code Analysis
                </h3>
                <p className="text-sm mt-1 text-blue-800 dark:text-blue-300">
                  4 instances of hardcoded API keys found across your codebase
                </p>
              </div>

              <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">View Full AI Analysis</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detected Vulnerabilities</CardTitle>
          <CardDescription>
            {filteredVulnerabilities.length} vulnerabilities found
            {selectedApp !== "all" && ` in ${apps.find((a) => a.id === selectedApp)?.name}`}
            {filterSeverity !== "all" && ` with ${filterSeverity} severity`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVulnerabilities.length > 0 ? (
              filteredVulnerabilities.map((vuln) => (
                <div
                  key={vuln.id}
                  className={`p-4 rounded-lg border 
                  ${
                    vuln.severity === "critical"
                      ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20"
                      : vuln.severity === "high"
                        ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20"
                        : "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`font-medium text-base 
                        ${
                          vuln.severity === "critical"
                            ? "text-red-800 dark:text-red-300"
                            : vuln.severity === "high"
                              ? "text-amber-800 dark:text-amber-300"
                              : "text-yellow-800 dark:text-yellow-300"
                        }`}
                      >
                        {vuln.name}
                      </h3>
                      <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{vuln.description}</p>
                    </div>
                    <Badge
                      className={
                        vuln.severity === "critical"
                          ? "bg-red-500"
                          : vuln.severity === "high"
                            ? "bg-amber-500"
                            : "bg-yellow-500"
                      }
                    >
                      {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Server className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Affected Apps: {vuln.affected_apps.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Detected: {new Date(vuln.detected).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <div className="font-medium text-slate-700 dark:text-slate-200">AI Recommendation:</div>
                    <p className="text-slate-600 dark:text-slate-300">{vuln.recommendation}</p>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <Badge
                      variant="outline"
                      className={
                        vuln.status === "open"
                          ? "text-red-500 border-red-200 dark:border-red-800"
                          : vuln.status === "in_progress"
                            ? "text-amber-500 border-amber-200 dark:border-amber-800"
                            : "text-green-500 border-green-200 dark:border-green-800"
                      }
                    >
                      {vuln.status === "open" ? "Open" : vuln.status === "in_progress" ? "In Progress" : "Resolved"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/remediation">
                          <Wrench className="mr-1 h-4 w-4" />
                          Remediate
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/vulnerabilities/${vuln.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-medium">No Vulnerabilities Found</h3>
                <p className="text-slate-500 mt-1">No vulnerabilities matching your current filters</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedApp("all")
                    setFilterSeverity("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
