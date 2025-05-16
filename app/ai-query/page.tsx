"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Download,
  Expand,
  FileText,
  Filter,
  Loader2,
  Maximize2,
  Search,
  Send,
  X,
} from "lucide-react"

// Generate a large dataset for testing
const generateLargeDataset = (count = 1000) => {
  const types = ["Certificate", "Key", "Library", "Application", "Host"]
  const statuses = ["Active", "Expired", "Revoked", "Vulnerable", "Secure"]
  const algorithms = ["RSA", "ECC", "DSA", "AES", "3DES", "Blowfish", "ChaCha20"]
  const owners = ["Security Team", "DevOps", "Development", "Infrastructure", "Cloud Team"]

  return Array.from({ length: count }, (_, i) => ({
    id: `asset-${i + 1}`,
    name: `Asset-${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    algorithm: algorithms[Math.floor(Math.random() * algorithms.length)],
    owner: owners[Math.floor(Math.random() * owners.length)],
    created: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    expires: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString(),
  }))
}

export default function AIQueryPage() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const itemsPerPage = 20

  // Handle query submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate large dataset for testing
      const data = generateLargeDataset(1500)

      setResults(data)
      setCurrentPage(1)
    } catch (error) {
      console.error("Error processing query:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and sort results
  const filteredResults = results
    ? results
        .filter((item) => {
          const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesType = selectedType === "all" || item.type === selectedType
          const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

          return matchesSearch && matchesType && matchesStatus
        })
        .sort((a, b) => {
          if (sortDirection === "asc") {
            return a[sortField] > b[sortField] ? 1 : -1
          } else {
            return a[sortField] < b[sortField] ? 1 : -1
          }
        })
    : []

  // Get unique types and statuses for filters
  const types = results ? [...new Set(results.map((item) => item.type))] : []
  const statuses = results ? [...new Set(results.map((item) => item.status))] : []

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const paginatedResults = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle sort toggle
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle export
  const handleExport = () => {
    const csvContent = [
      // Header row
      ["ID", "Name", "Type", "Status", "Algorithm", "Owner", "Created", "Expires"],
      // Data rows
      ...filteredResults.map((item) => [
        item.id,
        item.name,
        item.type,
        item.status,
        item.algorithm,
        item.owner,
        new Date(item.created).toLocaleDateString(),
        new Date(item.expires).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "cryptography-assets.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`container mx-auto py-6 ${isFullScreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">AI Query</h1>
          <p className="text-muted-foreground">Ask questions about your cryptographic assets</p>
        </div>
        {results && (
          <Button variant="outline" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Maximize2 className="h-4 w-4 mr-2" /> : <Expand className="h-4 w-4 mr-2" />}
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>Use natural language to query your cryptographic assets database</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., Show me all certificates expiring in the next 30 days, or List all RSA keys used by more than 3 applications"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Query
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {results && (
        <Card className={isFullScreen ? "h-[calc(100vh-180px)]" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Query Results</CardTitle>
              <CardDescription>Found {filteredResults.length} assets matching your query</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              {isFullScreen && (
                <Button variant="outline" size="sm" onClick={() => setIsFullScreen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className={isFullScreen ? "overflow-auto h-[calc(100%-180px)]" : ""}>
            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">
                  <FileText className="h-4 w-4 mr-2" />
                  Table View
                </TabsTrigger>
                <TabsTrigger value="filters">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </TabsTrigger>
              </TabsList>

              <TabsContent value="filters">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search assets..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {paginatedResults.length} of {filteredResults.length} results
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedType("all")
                      setSelectedStatus("all")
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="table" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] cursor-pointer" onClick={() => toggleSort("id")}>
                          <div className="flex items-center">
                            ID
                            {sortField === "id" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="ml-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="ml-1 h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                          <div className="flex items-center">
                            Name
                            {sortField === "name" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="ml-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="ml-1 h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("type")}>
                          <div className="flex items-center">
                            Type
                            {sortField === "type" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="ml-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="ml-1 h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                          <div className="flex items-center">
                            Status
                            {sortField === "status" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="ml-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="ml-1 h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("algorithm")}>
                          <div className="flex items-center">
                            Algorithm
                            {sortField === "algorithm" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="ml-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="ml-1 h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("owner")}>
                          <div className="flex items-center">
                            Owner
                            {sortField === "owner" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="ml-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="ml-1 h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("expires")}>
                          <div className="flex items-center">
                            Expires
                            {sortField === "expires" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="ml-1 h-3 w-3" />
                              ) : (
                                <ArrowDown className="ml-1 h-3 w-3" />
                              ))}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <AlertCircle className="h-8 w-8 mb-2" />
                              <p>No results found</p>
                              <p className="text-sm">Try adjusting your filters or search term</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedResults.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  item.status === "Expired" || item.status === "Revoked" || item.status === "Vulnerable"
                                    ? "bg-red-500"
                                    : item.status === "Active" || item.status === "Secure"
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                                }
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.algorithm}</TableCell>
                            <TableCell>{item.owner}</TableCell>
                            <TableCell>{new Date(item.expires).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink isActive={currentPage === pageNum} onClick={() => setCurrentPage(pageNum)}>
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <PaginationItem>
                            <span className="px-2">...</span>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="text-sm text-muted-foreground">Total: {filteredResults.length} assets</div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
