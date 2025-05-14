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
import { libraries } from "@/lib/mock-data"
import Link from "next/link"
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  Eye,
  ExternalLink,
  Filter,
  GitBranch,
  Package,
  Search,
  Shield,
  Wrench,
} from "lucide-react"
import { ChartContainer, Chart, ChartBars, ChartBar } from "@/components/ui/chart"

// Mock additional data
const cryptoMaterials = [
  ...libraries,
  {
    id: "lib-6",
    name: "Libsodium",
    type: "cryptographic",
    version: "1.0.18",
    latest_version: "1.0.19",
    language: "C",
    usage: "Modern cryptographic library",
    vulnerabilities: 0,
    apps_using: ["app-3", "app-5"],
  },
  {
    id: "lib-7",
    name: "Crypto++",
    type: "cryptographic",
    version: "8.4.0",
    latest_version: "8.7.0",
    language: "C++",
    usage: "C++ cryptographic library",
    vulnerabilities: 2,
    apps_using: ["app-2", "app-5"],
  },
]

const programmingLanguages = [
  {
    id: "lang-1",
    name: "Python",
    versions: ["3.8", "3.9", "3.10", "3.11"],
    cryptoLibraries: ["PyCA/cryptography", "PyCryptodome"],
    usage: "Backend services, Data analysis",
    apps: 128,
    securityScore: 85,
  },
  {
    id: "lang-2",
    name: "JavaScript",
    versions: ["ES2020", "ES2021", "ES2022"],
    cryptoLibraries: ["Node-Forge", "crypto-js", "Web Crypto API"],
    usage: "Frontend, Node.js services",
    apps: 245,
    securityScore: 72,
  },
  {
    id: "lang-3",
    name: "Java",
    versions: ["11", "17", "21"],
    cryptoLibraries: ["JCA/JCE", "BouncyCastle"],
    usage: "Enterprise applications",
    apps: 189,
    securityScore: 88,
  },
  {
    id: "lang-4",
    name: "C/C++",
    versions: ["C11", "C++17", "C++20"],
    cryptoLibraries: ["OpenSSL", "Crypto++", "WolfSSL"],
    usage: "Low-level services, Embedded systems",
    apps: 92,
    securityScore: 76,
  },
  {
    id: "lang-5",
    name: "Go",
    versions: ["1.18", "1.19", "1.20"],
    cryptoLibraries: ["crypto", "golang.org/x/crypto"],
    usage: "Microservices, Cloud native apps",
    apps: 104,
    securityScore: 91,
  },
]

export default function CryptographyMaterials() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [activeTab, setActiveTab] = useState("libraries")
  const [filters, setFilters] = useState({
    language: "all",
    status: "all",
  })

  const itemsPerPage = 10
  const totalLibraries = 547 // Mock total for enterprise scale
  const totalPages = Math.ceil(totalLibraries / itemsPerPage)

  const filteredLibraries = cryptoMaterials.filter((lib) => {
    const matchesSearch =
      searchQuery === "" ||
      lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lib.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lib.usage.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLanguage =
      filters.language === "all" ? true : lib.language.toLowerCase() === filters.language.toLowerCase()
    const matchesStatus =
      filters.status === "all"
        ? true
        : filters.status === "vulnerable"
          ? lib.vulnerabilities > 0
          : filters.status === "outdated"
            ? lib.version !== lib.latest_version
            : filters.status === "secure"
              ? lib.vulnerabilities === 0 && lib.version === lib.latest_version
              : true

    return matchesSearch && matchesLanguage && matchesStatus
  })

  const filteredLanguages = programmingLanguages.filter((lang) => {
    return (
      searchQuery === "" ||
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.cryptoLibraries.some((lib) => lib.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lang.usage.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredLibraries.map((lib) => lib.id))
    }
    setIsAllSelected(!isAllSelected)
  }

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Data for charts
  const libraryLanguageData = [
    { name: "C", value: 124, color: "#3b82f6" },
    { name: "Java", value: 98, color: "#8b5cf6" },
    { name: "JavaScript", value: 176, color: "#ec4899" },
    { name: "Python", value: 82, color: "#10b981" },
    { name: "Go", value: 67, color: "#f97316" },
  ]

  const vulnerabilityData = [
    { name: "Critical", value: 8, color: "#ef4444" },
    { name: "High", value: 24, color: "#f97316" },
    { name: "Medium", value: 53, color: "#eab308" },
    { name: "Low", value: 91, color: "#22c55e" },
  ]

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cryptography Materials</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Libraries, languages, and frameworks used for cryptographic operations
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Crypto Libraries</p>
                <p className="text-2xl font-bold mt-1">547</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Languages Used</p>
                <p className="text-2xl font-bold mt-1">12</p>
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
                <p className="text-sm font-medium">Outdated Libraries</p>
                <p className="text-2xl font-bold mt-1">142</p>
              </div>
              <div className="p-2 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <GitBranch className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Vulnerable</p>
                <p className="text-2xl font-bold mt-1">85</p>
              </div>
              <div className="p-2 rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="destructive">8 Critical</Badge>
              <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">
                24 High Risk
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Libraries by Language</CardTitle>
            <CardDescription>Distribution of cryptographic libraries by programming language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer height={250} data={libraryLanguageData}>
                <Chart>
                  <ChartBars>
                    {libraryLanguageData.map((d) => (
                      <ChartBar
                        key={d.name}
                        value={d.value}
                        style={{
                          fill: d.color,
                        }}
                      />
                    ))}
                  </ChartBars>
                </Chart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vulnerabilities in Libraries</CardTitle>
            <CardDescription>Distribution of vulnerabilities by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer height={250} data={vulnerabilityData}>
                <Chart>
                  <ChartBars>
                    {vulnerabilityData.map((d) => (
                      <ChartBar
                        key={d.name}
                        value={d.value}
                        style={{
                          fill: d.color,
                        }}
                      />
                    ))}
                  </ChartBars>
                </Chart>
              </ChartContainer>
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
                placeholder="Search libraries, languages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button
                onClick={() => setActiveTab("libraries")}
                className={`px-3 py-1 rounded-md ${
                  activeTab === "libraries"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <Package className="inline mr-1 h-4 w-4" />
                Libraries
              </button>

              <button
                onClick={() => setActiveTab("languages")}
                className={`px-3 py-1 rounded-md ${
                  activeTab === "languages"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <Code className="inline mr-1 h-4 w-4" />
                Languages
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>By Language</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.language === "all"}
                    onCheckedChange={() => setFilters({ ...filters, language: "all" })}
                  >
                    All Languages
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.language === "c"}
                    onCheckedChange={() => setFilters({ ...filters, language: "c" })}
                  >
                    C
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.language === "java"}
                    onCheckedChange={() => setFilters({ ...filters, language: "java" })}
                  >
                    Java
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.language === "javascript"}
                    onCheckedChange={() => setFilters({ ...filters, language: "javascript" })}
                  >
                    JavaScript
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.language === "python"}
                    onCheckedChange={() => setFilters({ ...filters, language: "python" })}
                  >
                    Python
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>By Status</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "all"}
                    onCheckedChange={() => setFilters({ ...filters, status: "all" })}
                  >
                    All Status
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "vulnerable"}
                    onCheckedChange={() => setFilters({ ...filters, status: "vulnerable" })}
                  >
                    Vulnerable
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "outdated"}
                    onCheckedChange={() => setFilters({ ...filters, status: "outdated" })}
                  >
                    Outdated
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === "secure"}
                    onCheckedChange={() => setFilters({ ...filters, status: "secure" })}
                  >
                    Secure & Up-to-date
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={() => setFilters({ language: "all", status: "all" })}>
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === "libraries" ? (
        <Card>
          <CardHeader>
            <CardTitle>Cryptographic Libraries</CardTitle>
            <CardDescription>
              Libraries used for encryption, hashing, and other cryptographic operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select All
                </label>

                {selectedItems.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {selectedItems.length} selected
                  </Badge>
                )}
              </div>

              {selectedItems.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Shield className="mr-1 h-4 w-4" />
                    Scan Selected
                  </Button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Library</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Current Version</TableHead>
                    <TableHead>Latest Version</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Vulnerabilities</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLibraries.map((lib) => (
                    <TableRow key={lib.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(lib.id)}
                          onCheckedChange={() => toggleSelectItem(lib.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{lib.name}</TableCell>
                      <TableCell>{lib.language}</TableCell>
                      <TableCell>{lib.version}</TableCell>
                      <TableCell className={lib.version !== lib.latest_version ? "text-amber-500" : ""}>
                        {lib.latest_version}
                      </TableCell>
                      <TableCell>{lib.usage}</TableCell>
                      <TableCell>
                        {lib.vulnerabilities === 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            None
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {lib.vulnerabilities}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/libraries/${lib.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-4 w-4" />
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalLibraries)}{" "}
                of {totalLibraries.toLocaleString()} libraries
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Programming Languages</CardTitle>
            <CardDescription>Languages used for cryptographic implementations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Language</TableHead>
                    <TableHead>Versions</TableHead>
                    <TableHead>Crypto Libraries</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Security Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLanguages.map((lang) => (
                    <TableRow key={lang.id}>
                      <TableCell className="font-medium">{lang.name}</TableCell>
                      <TableCell>{lang.versions.join(", ")}</TableCell>
                      <TableCell>{lang.cryptoLibraries.join(", ")}</TableCell>
                      <TableCell>{lang.usage}</TableCell>
                      <TableCell>{lang.apps}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            lang.securityScore >= 90
                              ? "bg-green-500"
                              : lang.securityScore >= 70
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }
                        >
                          {lang.securityScore}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
