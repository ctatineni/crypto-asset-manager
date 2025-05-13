"use client"

import { useState } from "react"
import { vulnerabilities, apps } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, FileText, Wrench } from "lucide-react"
import { ChartContainer, Chart, ChartBars, ChartBar, ChartTooltip } from "@/components/ui/chart"

export default function Remediation() {
  const [selectedApp, setSelectedApp] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("priority")

  const filteredVulnerabilities = vulnerabilities
    .filter((vuln) => (selectedApp === "all" ? true : vuln.affected_apps.includes(selectedApp)))
    .sort((a, b) => {
      if (sortBy === "priority") {
        const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 }
        // @ts-ignore
        return severityOrder[b.severity] - severityOrder[a.severity]
      } else if (sortBy === "date") {
        return new Date(b.detected).getTime() - new Date(a.detected).getTime()
      } else if (sortBy === "status") {
        const statusOrder = { open: 2, in_progress: 1, resolved: 0 }
        // @ts-ignore
        return statusOrder[a.status] - statusOrder[b.status]
      }
      return 0
    })

  const totalVulnerabilities = filteredVulnerabilities.length
  const openVulnerabilities = filteredVulnerabilities.filter((v) => v.status === "open").length
  const inProgressVulnerabilities = filteredVulnerabilities.filter((v) => v.status === "in_progress").length
  const resolvedVulnerabilities = filteredVulnerabilities.filter((v) => v.status === "resolved").length

  const completionPercentage =
    totalVulnerabilities === 0 ? 100 : Math.round((resolvedVulnerabilities / totalVulnerabilities) * 100)

  // For chart
  const chartData = [
    { name: "Open", value: openVulnerabilities, color: "#ef4444" },
    { name: "In Progress", value: inProgressVulnerabilities, color: "#eab308" },
    { name: "Resolved", value: resolvedVulnerabilities, color: "#22c55e" },
  ]

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Remediation Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track and manage cryptographic vulnerability remediation efforts
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
          <div className="flex flex-col sm:flex-row justify-between gap-4">
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
              <label className="text-sm font-medium block mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority (High to Low)</SelectItem>
                  <SelectItem value="date">Detection Date (Newest First)</SelectItem>
                  <SelectItem value="status">Status (Open First)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remediation Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Remediation Progress</CardTitle>
            <CardDescription>{completionPercentage}% of vulnerabilities have been remediated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              <Progress
                value={completionPercentage}
                className="h-2"
                indicatorClassName={
                  completionPercentage >= 75
                    ? "bg-green-500"
                    : completionPercentage >= 40
                      ? "bg-amber-500"
                      : "bg-red-500"
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-red-800 dark:text-red-300">Open</h3>
                  <span className="text-lg font-bold text-red-800 dark:text-red-300">{openVulnerabilities}</span>
                </div>
                <p className="text-xs text-red-800 dark:text-red-300 mt-1">Vulnerabilities that need attention</p>
              </div>

              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">In Progress</h3>
                  <span className="text-lg font-bold text-amber-800 dark:text-amber-300">
                    {inProgressVulnerabilities}
                  </span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">Vulnerabilities being fixed</p>
              </div>

              <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-green-800 dark:text-green-300">Resolved</h3>
                  <span className="text-lg font-bold text-green-800 dark:text-green-300">
                    {resolvedVulnerabilities}
                  </span>
                </div>
                <p className="text-xs text-green-800 dark:text-green-300 mt-1">Vulnerabilities successfully fixed</p>
              </div>
            </div>

            <div className="h-60">
              <h3 className="text-sm font-medium mb-4">Remediation Status</h3>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>AI-driven remediation insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <h3 className="font-medium text-blue-800 dark:text-blue-300">Prioritization Strategy</h3>
                <p className="text-sm mt-1 text-blue-800 dark:text-blue-300">
                  Focus on the 3 critical OpenSSL vulnerabilities first as they affect multiple applications
                </p>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
                <h3 className="font-medium text-purple-800 dark:text-purple-300">Resource Allocation</h3>
                <p className="text-sm mt-1 text-purple-800 dark:text-purple-300">
                  Assign 2 security engineers to the certificate expiration issues to prevent service disruption
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <h3 className="font-medium text-green-800 dark:text-green-300">Automation Opportunity</h3>
                <p className="text-sm mt-1 text-green-800 dark:text-green-300">
                  Implement automated certificate renewal to prevent future expiration issues
                </p>
              </div>

              <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">View Full AI Analysis</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remediation Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Remediation Tasks</CardTitle>
          <CardDescription>
            {filteredVulnerabilities.length} vulnerabilities requiring remediation
            {selectedApp !== "all" && ` in ${apps.find((a) => a.id === selectedApp)?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vulnerability</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Detected</TableHead>
                  <TableHead>Affected Apps</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVulnerabilities.map((vuln) => (
                  <TableRow key={vuln.id}>
                    <TableCell className="font-medium">{vuln.name}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-slate-500" />
                        {new Date(vuln.detected).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{vuln.affected_apps.length} apps</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {vuln.status === "open" ? (
                          <Button size="sm">
                            <Wrench className="h-4 w-4 mr-1" />
                            Start Fix
                          </Button>
                        ) : vuln.status === "in_progress" ? (
                          <Button size="sm" variant="outline">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Mark Resolved
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" disabled>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Resolved
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/vulnerabilities/${vuln.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
