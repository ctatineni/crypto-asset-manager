"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apps, linesOfBusiness } from "@/lib/mock-data"
import Link from "next/link"
import { ArrowUpRight, Building, Filter, Search, Shield } from "lucide-react"

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [lobFilter, setLobFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

  // Filter apps based on search and filters
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      searchQuery === "" ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appId.includes(searchQuery)

    const matchesLob = lobFilter === "all" || app.lobId === lobFilter

    const matchesRisk =
      riskFilter === "all" ||
      (riskFilter === "critical" && app.risk_score > 80) ||
      (riskFilter === "high" && app.risk_score > 60 && app.risk_score <= 80) ||
      (riskFilter === "medium" && app.risk_score > 40 && app.risk_score <= 60) ||
      (riskFilter === "low" && app.risk_score <= 40)

    return matchesSearch && matchesLob && matchesRisk
  })

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Application Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and monitor all applications and their cryptographic assets
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Applications Overview</CardTitle>
          <CardDescription>Summary of applications across all lines of business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {linesOfBusiness.map((lob) => {
              const lobApps = apps.filter((app) => app.lobId === lob.id)
              return (
                <div
                  key={lob.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">{lob.name}</h3>
                  </div>
                  <p className="text-2xl font-bold">{lobApps.length}</p>
                  <div className="mt-2">
                    <Button variant="link" size="sm" asChild className="p-0">
                      <Link href={`/lob/${lob.id}`}>View Applications</Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Applications</CardTitle>
            <CardDescription>All applications with cryptographic assets</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={lobFilter} onValueChange={setLobFilter}>
              <SelectTrigger className="w-[180px]">
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Line of Business" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lines of Business</SelectItem>
                {linesOfBusiness.map((lob) => (
                  <SelectItem key={lob.id} value={lob.id}>
                    {lob.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Line of Business</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Keys</TableHead>
                <TableHead>Hosts</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => {
                const lob = linesOfBusiness.find((l) => l.id === app.lobId)

                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono">{app.appId}</TableCell>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>
                      {lob && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {lob.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          app.risk_score > 80
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            : app.risk_score > 60
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                              : app.risk_score > 40
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        }
                      >
                        {app.risk_score}
                      </Badge>
                    </TableCell>
                    <TableCell>{app.certificates}</TableCell>
                    <TableCell>{app.keys}</TableCell>
                    <TableCell>{app.hosts}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/inventory/${app.id}`}>
                            <Shield className="h-4 w-4 mr-1" />
                            Assets
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard?appId=${app.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
