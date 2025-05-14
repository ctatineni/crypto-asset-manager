"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getApp, getAppVulnerabilities, getAppLibraries, getAppHosts } from "@/lib/mock-data"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Key,
  Library,
  Server,
  Shield,
  Wrench,
  Eye,
} from "lucide-react"

export default function InventoryDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"list" | "visual">("list")
  
  const app = getApp(params.id)
  const vulnerabilities = getAppVulnerabilities(params.id)
  const libraries = getAppLibraries(params.id)
  const hosts = getAppHosts(params.id)

  if (!app) {
    return (
      <div className="container mx-auto max-w-7xl py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Application Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <Shield className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-medium mb-2">Application Not Found</h2>
            <p className="text-slate-500 mb-6">The application you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/inventory">View All Applications</Link>
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
            <h1 className="text-2xl font-bold">{app.name}</h1>
            <p className="text-slate-500">{app.description}</p>
          </div>
        </div>
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
          Risk Score: {app.risk_score}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Certificates</CardTitle>
            <CardDescription>SSL/TLS certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{app.certificates}</div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/certificates?appId=${app.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  View Certificates
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Keys</CardTitle>
            <CardDescription>Cryptographic keys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{app.keys}</div>
              <Key className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/keys?appId=${app.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  View Keys
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vulnerabilities</CardTitle>
            <CardDescription>Security issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">
                {app.vulnerabilities.critical +
                  app.vulnerabilities.high +
                  app.vulnerabilities.medium +
                  app.vulnerabilities.low}
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/vulnerabilities?appId=${app.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  View Vulnerabilities
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Hosts</CardTitle>
            <CardDescription>Deployment servers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{app.hosts}</div>
              <Server className="h-8 w-8 text-slate-500" />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/hosts?appId=${app.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  View Hosts
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="keys">Keys</TabsTrigger>
            <TabsTrigger value="hosts">Hosts</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-slate-100 dark:bg-slate-800" : ""}>
              List View
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode("visual")} className={viewMode === "visual" ? "bg-slate-100 dark:bg-slate-800" : ""}>
              Visual View
            </Button>
          </div>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Summary</CardTitle>
                <CardDescription>Security issues affecting this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span>Critical</span>
                    </div>
                    <span className="font-medium">{app.vulnerabilities.critical}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      <span>High</span>
                    </div>
                    <span className="font-medium">{app.vulnerabilities.high}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                      <span>Medium</span>
                    </div>
                    <span className="font-medium">{app.vulnerabilities.medium}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Low</span>
                    </div>
                    <span className="font-medium">{app.vulnerabilities.low}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Top Issues</h3>
                  <div className="space-y-2">
                    {vulnerabilities.slice(0, 3).map((vuln) => (
                      <div
                        key={vuln.id}
                        className={`p-2 rounded text-sm ${
                          vuln.severity === "critical"
                            ? "bg-red-50 dark:bg-red-900/20"
                            : vuln.severity === "high"
                            ? "bg-amber-50 dark:bg-amber-900/20"
                            : "bg-yellow-50 dark:bg-yellow-900/20"
                        }`}
                      >
                        <div
                          className={`font-medium ${
                            vuln.severity === "critical"
                              ? "text-red-800 dark:text-red-300"
                              : vuln.severity === "high"
                              ? "text-amber-800 dark:text-amber-300"
                              : "text-yellow-800 dark:text-yellow-300"
                          }`}
                        >
                          {vuln.name}
                        </div>
                        <div
                          className={`${
                            vuln.severity === "critical"
                              ? "text-red-600 dark:text-red-400"
                              : vuln.severity === "high"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {vuln.description.substring(0, 60)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest security events for this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <div className="font-medium">New Vulnerability Detected</div>
                      <div className="text-sm text-slate-500">
                        {vulnerabilities[0]?.name || "SSL certificate expired"}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 2 hours ago
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded">
                      <Shield className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">Security Scan Completed</div>
                      <div className="text-sm text-slate-500">
                        Full scan completed with {app.vulnerabilities.critical} critical findings
                      </div>
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
                      <div className="font-medium">Certificate Renewed</div>
                      <div className="text-sm text-slate-500">SSL certificate renewed for another year</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 3 days ago
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded">
                      <Wrench className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <div className="font-medium">Library Updated</div>
                      <div className="text-sm text-slate-500">
                        {libraries[0]?.name || "OpenSSL"} updated to latest version
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 5 days ago
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Libraries</CardTitle>
              <CardDescription>Cryptographic libraries used by this application</CardDescription>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
              <CardDescription>SSL/TLS certificates used by this application</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "list" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Mock certificate data */}
                    <TableRow>
                      <TableCell className="font-medium">api.example.com</TableCell>
                      <TableCell>SSL/TLS</TableCell>
                      <TableCell>2023-12-15</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Valid
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">auth.example.com</TableCell>
                      <TableCell>SSL/TLS</TableCell>
                      <TableCell>2023-06-30</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Expired</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-md h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Certificate Visualization</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      In a real implementation, this would show a visual representation of the certificates and their
                      relationships to hosts and applications.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys">
          <Card>
            <CardHeader>
              <CardTitle>Cryptographic Keys</CardTitle>
              <CardDescription>Encryption and signing keys used by this application</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "list" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Algorithm</TableHead>
                      <TableHead>Key Size</TableHead>
                      <TableHead>Last Rotated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Mock key data */}
                    <TableRow>
                      <TableCell className="font-medium">API Authentication Key</TableCell>
                      <TableCell>RSA</TableCell>
                      <TableCell>RSA-OAEP</TableCell>
                      <TableCell>2048-bit</TableCell>
                      <TableCell>2023-03-15</TableCell>
                      <Table\
