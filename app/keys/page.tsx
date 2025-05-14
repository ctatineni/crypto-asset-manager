"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  AlertTriangle,
  Clock,
  Download,
  Eye,
  Filter,
  RefreshCw,
  Search,
  Shield,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Key,
  Plus,
} from "lucide-react"

// Mock key data
const encryptionKeys = [
  {
    id: "key-1",
    name: "api-auth-key",
    host: "prod-api-01",
    algorithm: "RSA",
    keySize: 1024,
    usage: "Authentication",
    created: "2023-01-10",
    lastRotated: "2023-01-10",
    status: "weak",
    applications: ["app-1", "app-2"],
  },
  {
    id: "key-2",
    name: "payment-encryption-key",
    host: "db-server-01",
    algorithm: "RSA",
    keySize: 4096,
    usage: "Payment Encryption",
    created: "2022-11-20",
    lastRotated: "2023-02-15",
    status: "strong",
    applications: ["app-1", "app-5"],
  },
  {
    id: "key-3",
    name: "analytics-key",
    host: "analytics-server",
    algorithm: "ECC",
    keySize: 256,
    usage: "Data Signing",
    created: "2022-10-05",
    lastRotated: "2022-10-05",
    status: "strong",
    applications: ["app-3"],
  },
  {
    id: "key-4",
    name: "api-oauth-key",
    host: "prod-api-01",
    algorithm: "RSA",
    keySize: 2048,
    usage: "OAuth Tokens",
    created: "2023-01-15",
    lastRotated: "2023-01-15",
    status: "medium",
    applications: ["app-2"],
  },
  {
    id: "key-5",
    name: "cms-encryption-key",
    host: "prod-web-01",
    algorithm: "AES",
    keySize: 128,
    usage: "Content Encryption",
    created: "2022-09-10",
    lastRotated: "2022-09-10",
    status: "weak",
    applications: ["app-4"],
  },
]

export default function Keys() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [filters, setFilters] = useState({
    algorithm: "all",
    status: "all",
    application: "all",
  })

  const itemsPerPage = 10
  const totalKeys = 94321 // Mock total for enterprise scale
  const totalPages = Math.ceil(totalKeys / itemsPerPage)

  const filteredKeys = encryptionKeys.filter((key) => {
    const matchesSearch =
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.algorithm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.usage.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAlgorithm =
      filters.algorithm === "all" ? true : key.algorithm.toLowerCase() === filters.algorithm.toLowerCase()
    const matchesStatus = filters.status === "all" ? true : key.status === filters.status
    const matchesApp = filters.application === "all" ? true : key.applications.includes(filters.application)

    return matchesSearch && matchesAlgorithm && matchesStatus && matchesApp
  })

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedKeys([])
    } else {
      setSelectedKeys(filteredKeys.map((key) => key.id))
    }
    setIsAllSelected(!isAllSelected)
  }

  const toggleSelectKey = (keyId: string) => {
    if (selectedKeys.includes(keyId)) {
      setSelectedKeys(selectedKeys.filter((id) => id !== keyId))
    } else {
      setSelectedKeys([...selectedKeys, keyId])
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "strong":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            Strong
          </Badge>
        )
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
          >
            Medium
          </Badge>
        )
      case "weak":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            Weak
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="text-slate-700 border-slate-200 dark:text-slate-400 dark:border-slate-800"
          >
            Unknown
          </Badge>
        )
    }
  }

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Encryption Keys</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Managing {totalKeys.toLocaleString()} encryption keys across your infrastructure
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
              <RefreshCw className="mr-1 h-4 w-4" />
              Key Rotation
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Total Keys</p>
                <p className="text-2xl font-bold mt-1">94,321</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <Key className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Strong Keys</p>
                <p className="text-2xl font-bold mt-1">78,453</p>
              </div>
              <div className="p-2 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <Shield className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Weak Algorithms</p>
                <p className="text-2xl font-bold mt-1">3,421</p>
              </div>
              <div className="p-2 rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Needs Rotation</p>
                <p className="text-2xl font-bold mt-1">12,447</p>
              </div>
              <div className="p-2 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search by name, algorithm, or usage..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Filter className="h-4 w-4" />
                    Algorithm
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Algorithm</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.algorithm === "all"}
                    onCheckedChange={() => setFilters({ ...filters, algorithm: "all" })}
                  >
                    All Algorithms
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.algorithm === "rsa"}
                    onCheckedChange={() => setFilters({ ...filters, algorithm: "rsa" })}
                  >
                    RSA
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.algorithm === "ecc"}
                    onCheckedChange={() => setFilters({ ...filters, algorithm: "ecc" })}
                  >
                    ECC
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.algorithm === "aes"}
                    onCheckedChange={() => setFilters({ ...filters, algorithm: "aes" })}
                  >
                    AES
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Filter className="h-4 w-4" />
                    Status
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "all"}
                    onCheckedChange={() => setFilters({ ...filters, status: "all" })}
                  >
                    All Statuses
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "strong"}
                    onCheckedChange={() => setFilters({ ...filters, status: "strong" })}
                  >
                    Strong
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "medium"}
                    onCheckedChange={() => setFilters({ ...filters, status: "medium" })}
                  >
                    Medium
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "weak"}
                    onCheckedChange={() => setFilters({ ...filters, status: "weak" })}
                  >
                    Weak
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={() => setFilters({ algorithm: "all", status: "all", application: "all" })}
              >
                Reset Filters
              </Button>

              <div className="ml-auto">
                <Button>
                  <Plus className="mr-1 h-4 w-4" />
                  Generate New Key
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Inventory */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Key Inventory</CardTitle>
              <CardDescription>Manage and monitor encryption keys</CardDescription>
            </div>
            <div className="flex gap-2">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="weak">Weak Keys</TabsTrigger>
                  <TabsTrigger value="rotation">Needs Rotation</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={toggleSelectAll} />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All
              </label>

              {selectedKeys.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {selectedKeys.length} selected
                </Badge>
              )}
            </div>

            {selectedKeys.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-1 h-4 w-4" />
                  Rotate Selected
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" />
                  Export Selected
                </Button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Algorithm</TableHead>
                  <TableHead>Key Size</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Last Rotated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedKeys.includes(key.id)}
                        onCheckedChange={() => toggleSelectKey(key.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>{key.algorithm}</TableCell>
                    <TableCell>{key.keySize}-bit</TableCell>
                    <TableCell>{key.host}</TableCell>
                    <TableCell>{key.usage}</TableCell>
                    <TableCell>{key.lastRotated}</TableCell>
                    <TableCell>{getStatusBadge(key.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/keys/${key.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalKeys)} of{" "}
              {totalKeys.toLocaleString()} keys
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    First
                  </PaginationLink>
                </PaginationItem>

                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(currentPage - 2)}>{currentPage - 2}</PaginationLink>
                  </PaginationItem>
                )}

                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink isActive>{currentPage}</PaginationLink>
                </PaginationItem>

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                  </PaginationItem>
                )}

                {currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 2}</PaginationLink>
                  </PaginationItem>
                )}

                {currentPage < totalPages - 3 && <PaginationEllipsis />}

                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                    Last
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
