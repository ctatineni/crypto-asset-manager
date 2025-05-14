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
  Upload,
} from "lucide-react"

// Mock certificate data
const certificates = [
  {
    id: "cert-1",
    name: "api.example.com",
    host: "prod-api-01",
    issuer: "DigiCert",
    subject: "api.example.com",
    validFrom: "2023-01-15",
    validTo: "2023-06-15",
    status: "expiring",
    applications: ["app-1", "app-2"],
  },
  {
    id: "cert-2",
    name: "web.example.com",
    host: "prod-web-01",
    issuer: "Let's Encrypt",
    subject: "web.example.com",
    validFrom: "2023-05-22",
    validTo: "2023-11-22",
    status: "valid",
    applications: ["app-4"],
  },
  {
    id: "cert-3",
    name: "auth.example.com",
    host: "prod-api-01",
    issuer: "DigiCert",
    subject: "auth.example.com",
    validFrom: "2022-11-10",
    validTo: "2023-05-01",
    status: "expired",
    applications: ["app-2"],
  },
  {
    id: "cert-4",
    name: "cms.example.com",
    host: "prod-web-01",
    issuer: "GeoTrust",
    subject: "cms.example.com",
    validFrom: "2023-03-15",
    validTo: "2024-03-15",
    status: "valid",
    applications: ["app-4"],
  },
  {
    id: "cert-5",
    name: "data.example.com",
    host: "analytics-server",
    issuer: "Let's Encrypt",
    subject: "data.example.com",
    validFrom: "2023-02-01",
    validTo: "2023-05-01",
    status: "expired",
    applications: ["app-3"],
  },
]

export default function Certificates() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCerts, setSelectedCerts] = useState<string[]>([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [filters, setFilters] = useState({
    issuer: "all",
    status: "all",
    application: "all",
  })

  const itemsPerPage = 10
  const totalCertificates = 57238 // Mock total for enterprise scale
  const totalPages = Math.ceil(totalCertificates / itemsPerPage)

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesIssuer = filters.issuer === "all" ? true : cert.issuer.toLowerCase() === filters.issuer.toLowerCase()
    const matchesStatus = filters.status === "all" ? true : cert.status === filters.status
    const matchesApp = filters.application === "all" ? true : cert.applications.includes(filters.application)

    return matchesSearch && matchesIssuer && matchesStatus && matchesApp
  })

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCerts([])
    } else {
      setSelectedCerts(filteredCertificates.map((cert) => cert.id))
    }
    setIsAllSelected(!isAllSelected)
  }

  const toggleSelectCert = (certId: string) => {
    if (selectedCerts.includes(certId)) {
      setSelectedCerts(selectedCerts.filter((id) => id !== certId))
    } else {
      setSelectedCerts([...selectedCerts, certId])
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            Valid
          </Badge>
        )
      case "expiring":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
          >
            Expiring Soon
          </Badge>
        )
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            Expired
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">SSL/TLS Certificates</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Managing {totalCertificates.toLocaleString()} certificates across your infrastructure
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
              Certificate Rotation
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
                <p className="text-sm font-medium">Total Certificates</p>
                <p className="text-2xl font-bold mt-1">57,238</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <Shield className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Valid Certificates</p>
                <p className="text-2xl font-bold mt-1">56,617</p>
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
                <p className="text-sm font-medium">Expiring Soon</p>
                <p className="text-2xl font-bold mt-1">432</p>
              </div>
              <div className="p-2 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Expired</p>
                <p className="text-2xl font-bold mt-1">189</p>
              </div>
              <div className="p-2 rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
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
                placeholder="Search by domain, issuer, or host..."
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
                    Issuer
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Issuer</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.issuer === "all"}
                    onCheckedChange={() => setFilters({ ...filters, issuer: "all" })}
                  >
                    All Issuers
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.issuer === "digicert"}
                    onCheckedChange={() => setFilters({ ...filters, issuer: "digicert" })}
                  >
                    DigiCert
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.issuer === "letsencrypt"}
                    onCheckedChange={() => setFilters({ ...filters, issuer: "letsencrypt" })}
                  >
                    Let's Encrypt
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.issuer === "geotrust"}
                    onCheckedChange={() => setFilters({ ...filters, issuer: "geotrust" })}
                  >
                    GeoTrust
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
                    checked={filters.status === "valid"}
                    onCheckedChange={() => setFilters({ ...filters, status: "valid" })}
                  >
                    Valid
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "expiring"}
                    onCheckedChange={() => setFilters({ ...filters, status: "expiring" })}
                  >
                    Expiring Soon
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "expired"}
                    onCheckedChange={() => setFilters({ ...filters, status: "expired" })}
                  >
                    Expired
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={() => setFilters({ issuer: "all", status: "all", application: "all" })}
              >
                Reset Filters
              </Button>

              <div className="ml-auto">
                <Button>
                  <Upload className="mr-1 h-4 w-4" />
                  Import Certificates
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Inventory */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Certificate Inventory</CardTitle>
              <CardDescription>Manage and monitor SSL/TLS certificates</CardDescription>
            </div>
            <div className="flex gap-2">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
                  <TabsTrigger value="expired">Expired</TabsTrigger>
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

              {selectedCerts.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {selectedCerts.length} selected
                </Badge>
              )}
            </div>

            {selectedCerts.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-1 h-4 w-4" />
                  Renew Selected
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
                  <TableHead>Domain Name</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Valid From</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCerts.includes(cert.id)}
                        onCheckedChange={() => toggleSelectCert(cert.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{cert.name}</TableCell>
                    <TableCell>{cert.issuer}</TableCell>
                    <TableCell>{cert.host}</TableCell>
                    <TableCell>{cert.validFrom}</TableCell>
                    <TableCell>{cert.validTo}</TableCell>
                    <TableCell>{getStatusBadge(cert.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/certificates/${cert.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCertificates)} of {totalCertificates.toLocaleString()}{" "}
              certificates
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
