"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { linesOfBusiness, getAppsForLOB } from "@/lib/mock-data"
import { Building, ChevronRight, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LinesOfBusinessPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter LOBs based on search query
  const filteredLOBs = linesOfBusiness.filter(
    (lob) =>
      lob.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lob.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredLOBs.length / itemsPerPage)
  const paginatedLOBs = filteredLOBs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lines of Business</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search lines of business..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="mb-6">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedLOBs.map((lob) => {
              const appCount = getAppsForLOB(lob.id).length
              return (
                <Link href={`/lob/${lob.id}`} key={lob.id}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{lob.name}</CardTitle>
                        <Badge variant="outline">{appCount} Apps</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{lob.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm">
                          View Details <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {paginatedLOBs.map((lob) => {
                  const appCount = getAppsForLOB(lob.id).length
                  return (
                    <Link
                      href={`/lob/${lob.id}`}
                      key={lob.id}
                      className="block hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 text-slate-400 mr-3" />
                          <div>
                            <h3 className="font-medium">{lob.name}</h3>
                            <p className="text-sm text-slate-500 line-clamp-1">{lob.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{appCount} Apps</Badge>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
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

      {filteredLOBs.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <Building className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-medium mb-2">No Lines of Business Found</h2>
            <p className="text-slate-500">
              No lines of business match your search criteria. Try adjusting your search.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
