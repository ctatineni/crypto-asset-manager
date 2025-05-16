"use client"

import { useState } from "react"
import { languages, apps } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { AlertTriangle, ArrowUpDown, CheckCircle, Code, FileCode, Search, Shield } from "lucide-react"
import { ChartContainer, Chart, ChartBars, ChartBar, ChartTooltip } from "@/components/ui/chart"

export default function Languages() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApp, setSelectedApp] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [filterType, setFilterType] = useState("all")

  const filteredLanguages = languages
    .filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.type.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((lang) => (selectedApp === "all" ? true : lang.apps_using.includes(selectedApp)))
    .filter((lang) => (filterType === "all" ? true : lang.type === filterType))
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "usage") {
        return b.apps_using.length - a.apps_using.length
      } else if (sortBy === "version") {
        return a.version.localeCompare(b.version)
      }
      return 0
    })

  // For language chart
  const languageTypes = [...new Set(languages.map((lang) => lang.type))]
  const languageChartData = languageTypes.map((type) => ({
    name: type,
    value: languages.filter((lang) => lang.type === type).length,
    color:
      type === "Compiled" ? "#3776ab" : type === "Interpreted" ? "#f7df1e" : type === "Hybrid" ? "#b07219" : "#6e56cf",
  }))

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Programming Languages</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage programming languages used across your applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/libraries">
              <FileCode className="mr-1 h-4 w-4" />
              View Libraries
            </Link>
          </Button>
          <Button asChild>
            <Link href="/vulnerabilities">
              <AlertTriangle className="mr-1 h-4 w-4" />
              View Vulnerabilities
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
                placeholder="Search languages or frameworks..."
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
                  <SelectItem value="Compiled">Compiled</SelectItem>
                  <SelectItem value="Interpreted">Interpreted</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-64">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="usage">Usage (Most to Least)</SelectItem>
                  <SelectItem value="version">Version</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Programming Language Overview</CardTitle>
              <CardDescription>Summary of programming languages in use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Total Languages</p>
                        <p className="text-2xl font-bold mt-1">{languages.length}</p>
                      </div>
                      <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        <Code className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Language Types</p>
                        <p className="text-2xl font-bold mt-1">{languageTypes.length}</p>
                      </div>
                      <div className="p-2 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                        <FileCode className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Outdated Versions</p>
                        <p className="text-2xl font-bold mt-1">
                          {languages.filter((lang) => lang.version !== lang.latest_version).length}
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
                        <p className="text-sm font-medium">Security Issues</p>
                        <p className="text-2xl font-bold mt-1">
                          {languages.reduce((sum, lang) => sum + (lang.security_issues || 0), 0)}
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
                <h3 className="text-sm font-medium mb-4">Language Types Distribution</h3>
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
            <CardDescription>AI-driven programming language insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <h3 className="font-medium text-red-800 dark:text-red-300 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Critical Findings
                </h3>
                <p className="text-sm mt-1 text-red-800 dark:text-red-300">
                  Python 2.7 is end-of-life and has 3 known security vulnerabilities
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Security Recommendations
                </h3>
                <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
                  5 applications are using outdated language versions with known security issues
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
                  <Code className="h-4 w-4 mr-1" />
                  Usage Analysis
                </h3>
                <p className="text-sm mt-1 text-blue-800 dark:text-blue-300">
                  JavaScript is used in 8 applications, making it the most common language
                </p>
              </div>

              <Button asChild className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                <Link href="/ai-query">View Full AI Analysis</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Languages List */}
      <Card>
        <CardHeader>
          <CardTitle>Programming Languages</CardTitle>
          <CardDescription>
            {filteredLanguages.length} languages found
            {selectedApp !== "all" && ` in ${apps.find((a) => a.id === selectedApp)?.name}`}
            {filterType !== "all" && ` of type ${filterType}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <div
                  key={lang.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{lang.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{lang.description}</p>
                    </div>
                    <Badge
                      className={
                        lang.security_issues > 0
                          ? "bg-red-500"
                          : lang.version !== lang.latest_version
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }
                    >
                      {lang.security_issues > 0
                        ? `${lang.security_issues} Security Issues`
                        : lang.version !== lang.latest_version
                          ? "Update Available"
                          : "Up to Date"}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-500">Type:</span>
                      <span className="ml-1 font-medium">{lang.type}</span>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-500">Current Version:</span>
                      <span className="ml-1 font-medium">{lang.version}</span>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="text-slate-500">Latest Version:</span>
                      <span className="ml-1 font-medium">{lang.latest_version}</span>
                    </div>
                  </div>

                  {lang.version !== lang.latest_version && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-sm text-amber-800 dark:text-amber-300">
                      <div className="font-medium">AI Recommendation:</div>
                      <p>
                        Update to the latest version to resolve {lang.security_issues} known security issues and improve
                        security posture.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-slate-500">Used by {lang.apps_using.length} applications</div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-medium">No Languages Found</h3>
                <p className="text-slate-500 mt-1">No languages matching your current filters</p>
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
