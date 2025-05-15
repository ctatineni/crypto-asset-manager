"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { antiPatterns, apps } from "@/lib/mock-data"
import { Code, Filter, Search } from "lucide-react"

export default function AntiPatterns() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("all")

  // Get unique languages from anti-patterns
  const uniqueLanguages = Array.from(new Set(antiPatterns.flatMap((ap) => (ap.languages ? ap.languages : [])))).sort()

  // Filter anti-patterns based on search and filters
  const filteredAntiPatterns = antiPatterns.filter((ap) => {
    const matchesSearch =
      searchQuery === "" ||
      ap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ap.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = severityFilter === "all" || ap.severity === severityFilter

    const matchesLanguage = languageFilter === "all" || (ap.languages && ap.languages.includes(languageFilter))

    return matchesSearch && matchesSeverity && matchesLanguage
  })

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Code Anti-Patterns</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Security anti-patterns detected in your application code
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Anti-Patterns Overview</CardTitle>
          <CardDescription>Security code issues across your applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">Critical</h3>
              </div>
              <p className="text-2xl font-bold">{antiPatterns.filter((ap) => ap.severity === "critical").length}</p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">High</h3>
              </div>
              <p className="text-2xl font-bold">{antiPatterns.filter((ap) => ap.severity === "high").length}</p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-yellow-500" />
                <h3 className="font-medium">Medium</h3>
              </div>
              <p className="text-2xl font-bold">{antiPatterns.filter((ap) => ap.severity === "medium").length}</p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Affected Apps</h3>
              </div>
              <p className="text-2xl font-bold">{new Set(antiPatterns.flatMap((ap) => ap.affected_apps)).size}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Anti-Patterns</CardTitle>
            <CardDescription>Security code issues detected in your applications</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search anti-patterns..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-[130px]">
                <Code className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {uniqueLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anti-Pattern</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Affected Apps</TableHead>
                <TableHead>Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAntiPatterns.map((ap) => (
                <TableRow key={ap.id}>
                  <TableCell className="font-medium">{ap.name}</TableCell>
                  <TableCell>{ap.description}</TableCell>
                  <TableCell>
                    {ap.severity === "critical" ? (
                      <Badge variant="destructive">Critical</Badge>
                    ) : ap.severity === "high" ? (
                      <Badge className="bg-amber-500">High</Badge>
                    ) : ap.severity === "medium" ? (
                      <Badge className="bg-yellow-500">Medium</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Low
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ap.languages &&
                        ap.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="bg-slate-100 text-slate-800">
                            {lang}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ap.affected_apps &&
                        ap.affected_apps.slice(0, 2).map((appId) => {
                          const app = apps.find((a) => a.id === appId)
                          return (
                            <Badge key={appId} variant="outline" className="bg-blue-100 text-blue-800">
                              {app ? app.name : appId}
                            </Badge>
                          )
                        })}
                      {ap.affected_apps && ap.affected_apps.length > 2 && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          +{ap.affected_apps.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{ap.recommendation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
