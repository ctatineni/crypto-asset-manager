"use client"

import { useState } from "react"
import { libraries } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Code, FileCode, Filter, Package, Search } from "lucide-react"

// Define a mock languages array since it might be missing from mock-data
const mockLanguages = [
  {
    id: "lang-1",
    name: "JavaScript",
    description: "High-level, often just-in-time compiled language that conforms to the ECMAScript specification",
    type: "Frontend",
    version: "ES2022",
    latest_version: "ES2022",
    secure: true,
    vulnerabilities: 0,
    support_status: "Active",
    last_scan: "2023-05-15T10:30:00Z",
    usage: ["Web App", "Dashboard", "API Gateway"],
  },
  {
    id: "lang-2",
    name: "Python",
    description: "Interpreted high-level general-purpose programming language",
    type: "Backend",
    version: "3.10",
    latest_version: "3.11",
    secure: true,
    vulnerabilities: 1,
    support_status: "Active",
    last_scan: "2023-05-14T09:15:00Z",
    usage: ["Data Processing", "API Gateway", "Analytics"],
  },
  {
    id: "lang-3",
    name: "Java",
    description: "High-level, class-based, object-oriented programming language",
    type: "Backend",
    version: "17",
    latest_version: "20",
    secure: true,
    vulnerabilities: 0,
    support_status: "Active",
    last_scan: "2023-05-13T14:45:00Z",
    usage: ["Core Banking", "Transaction Processing"],
  },
  {
    id: "lang-4",
    name: "C++",
    description: "General-purpose programming language created as an extension of the C programming language",
    type: "Systems",
    version: "C++17",
    latest_version: "C++20",
    secure: false,
    vulnerabilities: 3,
    support_status: "Active",
    last_scan: "2023-05-12T11:20:00Z",
    usage: ["Trading Engine", "Risk Calculation"],
  },
  {
    id: "lang-5",
    name: "Ruby",
    description: "Interpreted, high-level, general-purpose programming language",
    type: "Backend",
    version: "2.7",
    latest_version: "3.2",
    secure: false,
    vulnerabilities: 2,
    support_status: "Maintenance",
    last_scan: "2023-05-11T16:10:00Z",
    usage: ["Legacy Systems", "Reporting"],
  },
]

export default function LibrariesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVersion, setSelectedVersion] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")

  // Use the libraries array from mock-data or an empty array if undefined
  const librariesData = libraries || []

  // Use our mock languages array
  const languagesData = mockLanguages

  // Get unique categories and versions for filters
  const categories = Array.from(new Set(librariesData.map((lib) => lib.category || "Unknown")))
  const versions = Array.from(new Set(librariesData.map((lib) => lib.version || "Unknown")))
  const programmingLanguages = Array.from(new Set(languagesData.map((lang) => lang.name)))

  // Filter libraries based on search and filters
  const filteredLibraries = librariesData.filter((library) => {
    const matchesSearch =
      library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (library.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || library.category === selectedCategory
    const matchesVersion = selectedVersion === "all" || library.version === selectedVersion

    return matchesSearch && matchesCategory && matchesVersion
  })

  // Filter languages based on search and filters
  const filteredLanguages = languagesData.filter((language) => {
    const matchesSearch =
      language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = selectedLanguage === "all" || language.name === selectedLanguage

    return matchesSearch && matchesLanguage
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Libraries & Languages</h1>

      <Tabs defaultValue="libraries" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="libraries" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Libraries
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center">
            <Code className="mr-2 h-4 w-4" />
            Programming Languages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="libraries">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Library Filters</CardTitle>
              <CardDescription>Filter libraries by name, category, or version</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search libraries..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Versions</SelectItem>
                      {versions.map((version) => (
                        <SelectItem key={version} value={version}>
                          {version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedVersion("all")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Scan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLibraries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No libraries found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLibraries.map((library) => (
                    <TableRow key={library.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{library.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {library.description || "No description"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{library.category || "Unknown"}</Badge>
                      </TableCell>
                      <TableCell>{library.version || "Unknown"}</TableCell>
                      <TableCell>
                        {library.status === "secure" ? (
                          <Badge className="bg-green-500">Secure</Badge>
                        ) : library.status === "vulnerable" ? (
                          <Badge className="bg-red-500">Vulnerable</Badge>
                        ) : (
                          <Badge className="bg-yellow-500">Warning</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {library.last_scan ? new Date(library.last_scan).toLocaleDateString() : "Never"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="languages">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Language Filters</CardTitle>
              <CardDescription>Filter programming languages by name or type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search languages..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {programmingLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedLanguage("all")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLanguages.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground border rounded-md">
                No programming languages found matching your filters.
              </div>
            ) : (
              filteredLanguages.map((language) => (
                <Card key={language.id} className="overflow-hidden">
                  <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <FileCode className="mr-2 h-5 w-5" />
                        {language.name}
                      </CardTitle>
                      {language.secure && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                    <CardDescription>
                      {language.type} • {language.version}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{language.description}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Security Status</h4>
                        <div className="flex items-center">
                          {language.secure ? (
                            <Badge className="bg-green-500">Secure</Badge>
                          ) : (
                            <Badge className="bg-red-500">Vulnerable</Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-2">
                            Last scanned: {new Date(language.last_scan).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Usage</h4>
                        <div className="flex flex-wrap gap-2">
                          {language.usage &&
                            language.usage.map((app, index) => (
                              <Badge key={index} variant="outline">
                                {app}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
