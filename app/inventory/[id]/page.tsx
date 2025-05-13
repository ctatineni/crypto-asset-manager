"use client"

import { useParams, useRouter } from "next/navigation"
import { getHost, apps, getAppVulnerabilities } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Database,
  FileText,
  Server,
  Shield,
  Terminal,
  Wrench,
} from "lucide-react"
import { ChartContainer, Chart, ChartBars, ChartBar, ChartTooltip } from "@/components/ui/chart"

export default function HostDetail() {
  const params = useParams()
  const router = useRouter()
  const hostId = params.id as string
  const host = getHost(hostId)

  if (!host) {
    return (
      <div className="container max-w-7xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Host not found. The host you are looking for does not exist or has been removed.
          </AlertDescription>
        </Alert>

        <Button asChild>
          <Link href="/inventory">Return to Inventory</Link>
        </Button>
      </div>
    )
  }

  // For chart
  const vulnerabilityData = [
    { name: "Critical", value: host.vulnerabilities.critical, color: "#ef4444" },
    { name: "High", value: host.vulnerabilities.high, color: "#f97316" },
    { name: "Medium", value: host.vulnerabilities.medium, color: "#eab308" },
    { name: "Low", value: host.vulnerabilities.low, color: "#22c55e" },
  ]

  // Get all vulnerabilities for this host's apps
  const allVulnerabilities = host.apps.flatMap((appId) => getAppVulnerabilities(appId))
  const uniqueVulnerabilities = [...new Map(allVulnerabilities.map((v) => [v.id, v])).values()]

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{host.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
              {host.type}
            </Badge>
            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
              {host.os}
            </Badge>
            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
              {host.ip}
            </Badge>
            <Badge
              className={
                host.vulnerabilities.critical > 0
                  ? "bg-red-500"
                  : host.vulnerabilities.high > 0
                    ? "bg-amber-500"
                    : "bg-green-500"
              }
            >
              {host.vulnerabilities.critical > 0
                ? "Critical Issues"
                : host.vulnerabilities.high > 0
                  ? "High Risk"
                  : "Secure"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Host Overview</CardTitle>
              <CardDescription>Detailed information about this host and its cryptographic assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Host Type</h3>
                  </div>
                  <p className="text-2xl font-bold">{host.type}</p>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium">Certificates</h3>
                  </div>
                  <p className="text-2xl font-bold">{host.certificates}</p>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Keys</h3>
                  </div>
                  <p className="text-2xl font-bold">{host.keys}</p>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h3 className="font-medium">Vulnerabilities</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {host.vulnerabilities.critical +
                      host.vulnerabilities.high +
                      host.vulnerabilities.medium +
                      host.vulnerabilities.low}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">Vulnerability Distribution</h3>
                  <div className="h-60">
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
                        <ChartTooltip />
                      </Chart>
                    </ChartContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4">Applications</h3>
                  <div className="space-y-3">
                    {host.apps.map((appId) => {
                      const app = apps.find((a) => a.id === appId)
                      if (!app) return null

                      return (
                        <div
                          key={appId}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md"
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-sm">{app.name}</span>
                          </div>
                          <Badge variant="outline" className="text-blue-500">
                            Risk: {app.risk_score}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cryptographic Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="certificates">
                <TabsList className="mb-6">
                  <TabsTrigger value="certificates">
                    <Shield className="mr-1 h-4 w-4" />
                    Certificates
                  </TabsTrigger>
                  <TabsTrigger value="keys">
                    <Database className="mr-1 h-4 w-4" />
                    Encryption Keys
                  </TabsTrigger>
                  <TabsTrigger value="vulnerabilities">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    Vulnerabilities
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="certificates">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Issued Date</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {host.name === "prod-api-01" ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">api.example.com</TableCell>
                              <TableCell>2023-01-15</TableCell>
                              <TableCell>2023-06-15</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                >
                                  Expiring Soon
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">auth.example.com</TableCell>
                              <TableCell>2023-02-20</TableCell>
                              <TableCell>2023-08-20</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                >
                                  Valid
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : host.name === "prod-web-01" ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">web.example.com</TableCell>
                              <TableCell>2023-05-22</TableCell>
                              <TableCell>2023-11-22</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                >
                                  Valid
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : host.name === "analytics-server" ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">analytics.example.com</TableCell>
                              <TableCell>2023-02-10</TableCell>
                              <TableCell>2023-05-10</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                >
                                  Expired
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : host.name === "app-container-01" ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">app.example.com</TableCell>
                              <TableCell>2023-04-05</TableCell>
                              <TableCell>2023-10-05</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                >
                                  Valid
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">db.example.com</TableCell>
                              <TableCell>2023-03-20</TableCell>
                              <TableCell>2023-09-20</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                >
                                  Valid
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="keys">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Algorithm</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {host.name === "prod-api-01" ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">api-auth-key</TableCell>
                              <TableCell>Authentication</TableCell>
                              <TableCell>RSA 1024-bit</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                >
                                  Weak
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">api-jwt-signing</TableCell>
                              <TableCell>JWT Signing</TableCell>
                              <TableCell>ECDSA P-256</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                >
                                  Secure
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : host.name === "prod-web-01" ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">web-ssl-key</TableCell>
                              <TableCell>SSL/TLS</TableCell>
                              <TableCell>RSA 2048-bit</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                >
                                  Secure
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : host.name === "analytics-server" ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">analytics-api-key</TableCell>
                              <TableCell>API</TableCell>
                              <TableCell>HMAC-SHA256</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                >
                                  Secure
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : host.name === "app-container-01" ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">container-auth-key</TableCell>
                              <TableCell>Authentication</TableCell>
                              <TableCell>RSA 1024-bit</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                >
                                  Weak
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">payment-encryption</TableCell>
                              <TableCell>Data Encryption</TableCell>
                              <TableCell>RSA 4096-bit</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                >
                                  Strong
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="vulnerabilities">
                  <div className="space-y-4">
                    {uniqueVulnerabilities.length > 0 ? (
                      uniqueVulnerabilities.map((vuln) => (
                        <div
                          key={vuln.id}
                          className={`p-4 rounded-lg border 
                          ${
                            vuln.severity === "critical"
                              ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20"
                              : vuln.severity === "high"
                                ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20"
                                : "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3
                                className={`font-medium text-base 
                                ${
                                  vuln.severity === "critical"
                                    ? "text-red-800 dark:text-red-300"
                                    : vuln.severity === "high"
                                      ? "text-amber-800 dark:text-amber-300"
                                      : "text-yellow-800 dark:text-yellow-300"
                                }`}
                              >
                                {vuln.name}
                              </h3>
                              <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{vuln.description}</p>
                            </div>
                            <Badge
                              className={
                                vuln.severity === "critical"
                                  ? "bg-red-500"
                                  : vuln.severity === "high"
                                    ? "bg-amber-500"
                                    : "bg-yellow-500"
                              }
                            >
                              {vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1)}
                            </Badge>
                          </div>

                          <div className="mt-3 text-sm">
                            <div className="font-medium text-slate-700 dark:text-slate-200">AI Recommendation:</div>
                            <p className="text-slate-600 dark:text-slate-300">{vuln.recommendation}</p>
                          </div>

                          <div className="mt-3 flex justify-between">
                            <Badge
                              variant="outline"
                              className={
                                vuln.status === "open"
                                  ? "text-red-500 border-red-200 dark:border-red-800"
                                  : vuln.status === "in_progress"
                                    ? "text-amber-500 border-amber-200 dark:border-amber-800"
                                    : "text-green-500 border-green-200 dark:border-green-800"
                              }
                            >
                              {vuln.status === "open"
                                ? "Open"
                                : vuln.status === "in_progress"
                                  ? "In Progress"
                                  : "Resolved"}
                            </Badge>
                            <Button size="sm" asChild>
                              <Link href={`/vulnerabilities/${vuln.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                        <h3 className="text-lg font-medium">No Vulnerabilities Detected</h3>
                        <p className="text-slate-500 mt-1">
                          Great job! This host is currently free of detected cryptographic vulnerabilities.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Host Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Host Name</span>
                  <span>{host.name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">IP Address</span>
                  <span>{host.ip}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Operating System</span>
                  <span>{host.os}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Host Type</span>
                  <span>{host.type}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Applications</span>
                  <span>{host.apps.length}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Certificates</span>
                  <span>{host.certificates}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Keys</span>
                  <span>{host.keys}</span>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button className="w-full">
                    <Terminal className="mr-2 h-4 w-4" />
                    Run Security Scan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>AI-driven security insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {host.vulnerabilities.critical > 0 ? (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <h3 className="font-medium text-red-800 dark:text-red-300 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Critical Risk
                    </h3>
                    <p className="text-sm mt-1 text-red-800 dark:text-red-300">
                      This host has {host.vulnerabilities.critical} critical vulnerabilities that require immediate
                      attention.
                    </p>
                  </div>
                ) : host.vulnerabilities.high > 0 ? (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                    <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      High Risk
                    </h3>
                    <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
                      This host has {host.vulnerabilities.high} high severity vulnerabilities that should be addressed
                      soon.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <h3 className="font-medium text-green-800 dark:text-green-300 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Low Risk
                    </h3>
                    <p className="text-sm mt-1 text-green-800 dark:text-green-300">
                      This host has no critical or high severity vulnerabilities.
                    </p>
                  </div>
                )}

                {host.name === "prod-api-01" && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Certificate Expiration
                    </h3>
                    <p className="text-sm mt-1 text-blue-800 dark:text-blue-300">
                      The certificate for api.example.com will expire in 43 days. Consider renewing it soon.
                    </p>
                  </div>
                )}

                {(host.name === "prod-api-01" || host.name === "app-container-01") && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
                    <h3 className="font-medium text-purple-800 dark:text-purple-300 flex items-center">
                      <Database className="h-4 w-4 mr-1" />
                      Weak Encryption
                    </h3>
                    <p className="text-sm mt-1 text-purple-800 dark:text-purple-300">
                      This host is using RSA 1024-bit keys which are considered weak by modern standards. Consider
                      upgrading to RSA 2048-bit or stronger.
                    </p>
                  </div>
                )}

                <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">View Full AI Analysis</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/remediation" className="flex items-center">
                    <Wrench className="mr-2 h-4 w-4" />
                    Remediate Vulnerabilities
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#" className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Certificates
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#" className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    Manage Encryption Keys
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Security Report
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
