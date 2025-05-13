"use client"

import { useState } from "react"
import { libraries, apps } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { AlertTriangle, ArrowUpDown, CheckCircle, Code, FileCode, Search, Shield, Wrench } from "lucide-react"
import { ChartContainer, Chart, ChartBars, ChartBar, ChartTooltip } from "@/components/ui/chart"

export default function Libraries() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApp, setSelectedApp] = useState("all")
  const [sortBy, setSortBy] = useState("vulnerabilities")
  const [filterType, setFilterType] = useState("all")

  const filteredLibraries = libraries
    .filter(
      (lib) =>
        lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lib.language.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((lib) => (selectedApp === "all" ? true : lib.apps_using.includes(selectedApp)))
    .filter((lib) => (filterType === "all" ? true : lib.type === filterType))
    .sort((a, b) => {
      if (sortBy === "vulnerabilities") {
        return b.vulnerabilities - a.vulnerabilities
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "usage") {
        return b.apps_using.length - a.apps_using.length
      }
      return 0
    })

  // For language chart
  const languages = [...new Set(libraries.map((lib) => lib.language))]
  const languageChartData = languages.map((lang) => ({
    name: lang,
    value: libraries.filter((lib) => lib.language === lang).length,
    color:
      lang === "JavaScript"
        ? "#f7df1e"
        : lang === "Python"
          ? "#3776ab"
          : lang === "Java"
            ? "#b07219"
            : lang === "C"
              ? "#555555"
              : "#6e56cf",
  }))

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cryptographic Libraries</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage cryptographic libraries and programming languages
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search libraries or languages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-full md:w-64">
              <Select value={selectedApp} onValueChange={setSelectedApp}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by application" />
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

            <div className="w-full md:w-64">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cryptographic">Cryptographic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-64">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vulnerabilities">Vulnerabilities (High to Low)</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="usage">Usage (Most to Least)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Library Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cryptographic Library Overview</CardTitle>
              <CardDescription>Summary of cryptographic libraries in use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Total Libraries</p>
                        <p className="text-2xl font-bold mt-1">{libraries.length}</p>
                      </div>
                      <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        <FileCode className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Languages</p>
                        <p className="text-2xl font-bold mt-1">{languages.length}</p>
                      </div>
                      <div className="p-2 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                        <Code className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Outdated</p>
                        <p className="text-2xl font-bold mt-1">
                          {libraries.filter((lib) => lib.version !== lib.latest_version).length}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        <ArrowUpDown className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Vulnerabilities</p>
                        <p className="text-2xl font-bold mt-1">
                          {libraries.reduce((sum, lib) => sum + lib.vulnerabilities, 0)}
                        </p>
                      </div>
                      <div className="p-2 rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="h-64">
                <h3 className="text-sm font-medium mb-4">Languages Distribution</h3>
                <ChartContainer height={250} data={languageChartData}>
                  <Chart>
                    <ChartBars>
                      {languageChartData.map((d) => (
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>AI-driven cryptographic library insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <h3 className="font-medium text-red-800 dark:text-red-300 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Critical Findings
                </h3>
                <p className="text-sm mt-1 text-red-800 dark:text-red-300">
                  OpenSSL 1.0.2k has 4 known vulnerabilities including 2 critical issues
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Security Recommendations
                </h3>
                <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
                  4 out of 5 cryptographic libraries are outdated and need updates
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
                  <Code className="h-4 w-4 mr-1" />
                  Usage Analysis
                </h3>
                <p className="text-sm mt-1 text-blue-800 dark:text-blue-300">
                  Node-Forge is used in 3 applications with potentially risky implementations
                </p>
              </div>

              <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">View Full AI Analysis</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Libraries List */}
      <Card>
        <CardHeader>
          <CardTitle>Cryptographic Libraries</CardTitle>
          <CardDescription>
            {filteredLibraries.length} libraries found
            {selectedApp !== "all" && ` in ${apps.find((a) => a.id === selectedApp)?.name}`}
            {filterType !== "all" && ` of type ${filterType}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLibraries.length > 0 ? (
              filteredLibraries.map((lib) => (
                <div
                  key={lib.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{lib.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{lib.usage}</p>
                    </div>
                    <Badge
                      className={
                        lib.vulnerabilities > 0
                          ? "bg-red-500"
                          : lib.version !== lib.latest_version
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }
                    >
                      {lib.vulnerabilities > 0
                        ? `${lib.vulnerabilities} Vulnerabilities`
                        : lib.version !== lib.latest_version
                          ? "Update Available"
                          : "Up to Date"}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-500">Language:</span>
                      <span className="ml-1 font-medium">{lib.language}</span>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-500">Current Version:</span>
                      <span className="ml-1 font-medium">{lib.version}</span>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-500">Latest Version:</span>
                      <span className="ml-1 font-medium">{lib.latest_version}</span>
                    </div>
                  </div>

                  {lib.version !== lib.latest_version && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-sm text-amber-800 dark:text-amber-300">
                      <div className="font-medium">AI Recommendation:</div>
                      <p>
                        Update to the latest version to resolve {lib.vulnerabilities} known vulnerabilities and improve
                        security posture.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-slate-500">Used by {lib.apps_using.length} applications</div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-medium">No Libraries Found</h3>
                <p className="text-slate-500 mt-1">No libraries matching your current filters</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedApp("all")
                    setFilterType("all")
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
