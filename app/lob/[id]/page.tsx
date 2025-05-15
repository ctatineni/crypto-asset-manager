"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { getLOB, getAppsForLOB } from "@/lib/mock-data"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Building, Search, Shield } from "lucide-react"
import { useState } from "react"

export default function LOBDetail() {
  const params = useParams()
  const router = useRouter()
  const lobId = params.id as string
  const lob = getLOB(lobId)
  const apps = getAppsForLOB(lobId)

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter apps based on search query
  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appId.includes(searchQuery),
  )

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage)
  const paginatedApps = filteredApps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (!lob) {
    return (
      <div className="container mx-auto max-w-7xl py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Line of Business Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <Building className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-medium mb-2">Line of Business Not Found</h2>
            <p className="text-slate-500 mb-6">
              The line of business you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/">Return to Overview</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{lob.name}</h1>
            <p className="text-slate-500">{lob.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          {apps.length} Applications
        </Badge>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Applications</CardTitle>
            <CardDescription>All applications in the {lob.name} line of business</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search applications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Keys</TableHead>
                <TableHead>Vulnerabilities</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApps.length > 0 ? (
                paginatedApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono">{app.appId}</TableCell>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{app.description}</TableCell>
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {app.vulnerabilities.critical > 0 && (
                          <Badge variant="destructive">{app.vulnerabilities.critical}</Badge>
                        )}
                        {app.vulnerabilities.high > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                          >
                            {app.vulnerabilities.high}
                          </Badge>
                        )}
                        {app.vulnerabilities.medium + app.vulnerabilities.low > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300"
                          >
                            {app.vulnerabilities.medium + app.vulnerabilities.low}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-slate-500">
                    No applications found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
