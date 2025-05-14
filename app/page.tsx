"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apps, vulnerabilities, libraries, hosts } from "@/lib/mock-data"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Key,
  Library,
  Search,
  Server,
  Shield,
  Wrench,
} from "lucide-react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter apps based on search query
  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate summary statistics
  const totalApps = apps.length
  const totalCertificates = apps.reduce((sum, app) => sum + app.certificates, 0)
  const totalKeys = apps.reduce((sum, app) => sum + app.keys, 0)
  const totalVulnerabilities = vulnerabilities.length
  const criticalVulnerabilities = vulnerabilities.filter((vuln) => vuln.severity === "critical").length
  const highVulnerabilities = vulnerabilities.filter((vuln) => vuln.severity === "high").length

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cryptographic Asset Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor and manage cryptographic assets across your organization
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Applications</CardTitle>
            <CardDescription>Total managed applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{totalApps}</div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 text-sm text-slate-500">
              <span className="text-green-500 font-medium">{Math.round(totalApps * 0.8)}</span> secure,{" "}
              <span className="text-red-500 font-medium">{Math.round(totalApps * 0.2)}</span> at risk
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cryptographic Assets</CardTitle>
            <CardDescription>Certificates and keys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{totalCertificates + totalKeys}</div>
              <div className="flex gap-1">
                <FileText className="h-8 w-8 text-green-500" />
                <Key className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-500">
              <span className="text-green-500 font-medium">{totalCertificates}</span> certificates,{" "}
              <span className="text-purple-500 font-medium">{totalKeys}</span> keys
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vulnerabilities</CardTitle>
            <CardDescription>Security issues detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{totalVulnerabilities}</div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2 text-sm text-slate-500">
              <span className="text-red-500 font-medium">{criticalVulnerabilities}</span> critical,{" "}
              <span className="text-amber-500 font-medium">{highVulnerabilities}</span> high risk
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="assets">Cryptographic Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Overview</CardTitle>
                <CardDescription>Application risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span>Critical Risk</span>
                    </div>
                    <span className="font-medium">{apps.filter((app) => app.risk_score > 80).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      <span>High Risk</span>
                    </div>
                    <span className="font-medium">
                      {apps.filter((app) => app.risk_score > 60 && app.risk_score <= 80).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                      <span>Medium Risk</span>
                    </div>
                    <span className="font-medium">
                      {apps.filter((app) => app.risk_score > 40 && app.risk_score <= 60).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Low Risk</span>
                    </div>
                    <span className="font-medium">{apps.filter((app) => app.risk_score <= 40).length}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Top Risk Factors</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                      <div className="font-medium text-red-800 dark:text-red-300">Expired Certificates</div>
                      <div className="text-red-600 dark:text-red-400">
                        {criticalVulnerabilities} certificates expired or expiring soon
                      </div>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-sm">
                      <div className="font-medium text-amber-800 dark:text-amber-300">Weak Encryption</div>
                      <div className="text-amber-600 dark:text-amber-400">
                        {highVulnerabilities} instances of outdated encryption algorithms
                      </div>
                    </div>
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                      <div className="font-medium text-yellow-800 dark:text-yellow-300">Outdated Libraries</div>
                      <div className="text-yellow-600 dark:text-yellow-400">
                        {libraries.filter((lib) => lib.vulnerabilities > 0).length} libraries with known vulnerabilities
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <div className="font-medium">Critical Vulnerability Detected</div>
                      <div className="text-sm text-slate-500">SSL certificate expired for Payment Gateway</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 2 hours ago
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <div className="font-medium">High Risk Vulnerability</div>
                      <div className="text-sm text-slate-500">Weak encryption algorithm detected in Auth Service</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 1 day ago
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium">Vulnerability Remediated</div>
                      <div className="text-sm text-slate-500">Updated OpenSSL to latest version</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 2 days ago
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded">
                      <Shield className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">New Application Added</div>
                      <div className="text-sm text-slate-500">Customer Support Portal added to inventory</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 3 days ago
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/reports">
                      <BarChart3 className="mr-1 h-4 w-4" />
                      View All Activity
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application List */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Applications</CardTitle>
                <CardDescription>All managed applications</CardDescription>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Certificates</TableHead>
                    <TableHead>Keys</TableHead>
                    <TableHead>Vulnerabilities</TableHead>
                    <TableHead>Last Scan</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
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
                      <TableCell>{new Date(app.last_scan).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard?appId=${app.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Application Inventory</CardTitle>
              <CardDescription>All applications with cryptographic assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search applications..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Certificates</TableHead>
                    <TableHead>Keys</TableHead>
                    <TableHead>Hosts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.map((app) => (
                    <TableRow key={app.id}>
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
                      <TableCell>{app.hosts}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard?appId=${app.id}`}>View</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/inventory/${app.id}`}>Assets</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>SSL/TLS certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-500 mr-2" />
                      <span>Total Certificates</span>
                    </div>
                    <span className="font-medium">{totalCertificates}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      <span>Expired Certificates</span>
                    </div>
                    <span className="font-medium">{criticalVulnerabilities}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                      <span>Expiring Soon</span>
                    </div>
                    <span className="font-medium">{highVulnerabilities}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/certificates">
                    <FileText className="mr-1 h-4 w-4" />
                    View All Certificates
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cryptographic Keys</CardTitle>
                <CardDescription>Encryption and signing keys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Key className="h-5 w-5 text-purple-500 mr-2" />
                      <span>Total Keys</span>
                    </div>
                    <span className="font-medium">{totalKeys}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      <span>Weak Keys</span>
                    </div>
                    <span className="font-medium">{Math.round(totalKeys * 0.15)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                      <span>Rotation Needed</span>
                    </div>
                    <span className="font-medium">{Math.round(totalKeys * 0.25)}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/keys">
                    <Key className="mr-1 h-4 w-4" />
                    View All Keys
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Cryptographic Libraries</CardTitle>
              <CardDescription>Libraries used for cryptographic operations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Latest Version</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Vulnerabilities</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {libraries.map((lib) => (
                    <TableRow key={lib.id}>
                      <TableCell className="font-medium">{lib.name}</TableCell>
                      <TableCell>{lib.type}</TableCell>
                      <TableCell>{lib.version}</TableCell>
                      <TableCell>{lib.latest_version}</TableCell>
                      <TableCell>{lib.language}</TableCell>
                      <TableCell>
                        {lib.vulnerabilities > 0 ? (
                          <Badge variant="destructive">{lib.vulnerabilities}</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            0
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/libraries/${lib.id}`}>
                            <Library className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/libraries">
                  <Library className="mr-1 h-4 w-4" />
                  View All Libraries
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Hosts</CardTitle>
              <CardDescription>Servers and devices with cryptographic assets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Certificates</TableHead>
                    <TableHead>Keys</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hosts.map((host) => (
                    <TableRow key={host.id}>
                      <TableCell className="font-medium">{host.name}</TableCell>
                      <TableCell>{host.type}</TableCell>
                      <TableCell>{host.os}</TableCell>
                      <TableCell>{host.ip}</TableCell>
                      <TableCell>{host.certificates}</TableCell>
                      <TableCell>{host.keys}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/inventory/${host.id}`}>
                            <Server className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/hosts">
                  <Server className="mr-1 h-4 w-4" />
                  View All Hosts
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
