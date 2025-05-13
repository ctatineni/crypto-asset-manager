"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getApp, getAppVulnerabilities, getAppHosts, getAppLibraries } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  AlertTriangle,
  BadgeIcon as Certificate,
  Database,
  Key,
  LayoutDashboard,
  Server,
  Shield,
  Terminal,
  Wrench,
  CheckCircle,
} from "lucide-react"
import { ChartContainer, Chart, ChartBars, ChartBar, ChartTooltip } from "@/components/ui/chart"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const appId = searchParams.get("appId") || "app-1"
  const [app, setApp] = useState(getApp(appId))
  const [vulnerabilities, setVulnerabilities] = useState(getAppVulnerabilities(appId))
  const [hosts, setHosts] = useState(getAppHosts(appId))
  const [libraries, setLibraries] = useState(getAppLibraries(appId))

  useEffect(() => {
    setApp(getApp(appId))
    setVulnerabilities(getAppVulnerabilities(appId))
    setHosts(getAppHosts(appId))
    setLibraries(getAppLibraries(appId))
  }, [appId])

  // For chart
  const chartData = [
    { name: "Critical", value: app?.vulnerabilities.critical || 0, color: "#ef4444" },
    { name: "High", value: app?.vulnerabilities.high || 0, color: "#f97316" },
    { name: "Medium", value: app?.vulnerabilities.medium || 0, color: "#eab308" },
    { name: "Low", value: app?.vulnerabilities.low || 0, color: "#22c55e" },
  ]

  // App stats overview
  const stats = [
    {
      name: "Risk Score",
      value: app?.risk_score || 0,
      icon: Shield,
      color:
        app?.risk_score && app.risk_score >= 90
          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900"
          : app?.risk_score && app.risk_score >= 70
            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900"
            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900",
    },
    {
      name: "Certificates",
      value: app?.certificates || 0,
      icon: Certificate,
      color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900",
    },
    {
      name: "Encryption Keys",
      value: app?.keys || 0,
      icon: Key,
      color:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900",
    },
    {
      name: "Hosts",
      value: app?.hosts || 0,
      icon: Server,
      color:
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900",
    },
  ]

  // If no app is found
  if (!app) {
    return (
      <div className="container max-w-7xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Application not found. Please select a valid application.</AlertDescription>
        </Alert>

        <Button asChild>
          <Link href="/">Return to Application List</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{app.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{app.description}</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`border ${stat.color}`}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendation Alert */}
      <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="ml-2 text-blue-800 dark:text-blue-300 font-medium">
            AI Security Recommendation
          </AlertTitle>
        </div>
        <AlertDescription className="mt-2 text-blue-800 dark:text-blue-300">
          <p className="mb-2">
            Our AI analysis detected that this application is using an outdated version of OpenSSL (1.0.2k) with known
            vulnerabilities. We recommend updating to the latest version (3.1.0) as soon as possible.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
          >
            View Detailed Recommendation
          </Button>
        </AlertDescription>
      </Alert>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <LayoutDashboard className="mr-1 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="vulnerabilities">
            <AlertTriangle className="mr-1 h-4 w-4" />
            Vulnerabilities
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Database className="mr-1 h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="libraries">
            <Terminal className="mr-1 h-4 w-4" />
            Libraries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Score */}
          <Card>
            <CardHeader>
              <CardTitle>Security Posture Overview</CardTitle>
              <CardDescription>AI-driven analysis of your application's cryptographic security posture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Security Score</span>
                  <span className="text-sm font-medium">{app.risk_score}/100</span>
                </div>
                <Progress
                  value={app.risk_score}
                  className="h-2"
                  indicatorClassName={
                    app.risk_score >= 90 ? "bg-green-500" : app.risk_score >= 70 ? "bg-amber-500" : "bg-red-500"
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Vulnerability Distribution</h4>
                    <div className="h-60">
                      <ChartContainer height={250} data={chartData}>
                        <Chart>
                          <ChartBars>
                            {chartData.map((d) => (
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
                    <h4 className="text-sm font-medium mb-3">Security Findings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-sm">Critical Vulnerabilities</span>
                        </div>
                        <Badge variant="outline" className="text-red-500">
                          {app.vulnerabilities.critical}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                          <span className="text-sm">Certificates Expiring Soon</span>
                        </div>
                        <Badge variant="outline" className="text-amber-500">
                          2
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm">Outdated Libraries</span>
                        </div>
                        <Badge variant="outline" className="text-blue-500">
                          3
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm">Compliance Status</span>
                        </div>
                        <Badge variant="outline" className="text-amber-500">
                          Partial
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-100 dark:border-blue-800">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <CardTitle>AI Security Insights</CardTitle>
              </div>
              <CardDescription>
                AI-driven analysis and recommendations for improving your security posture
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Top Vulnerabilities</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Our AI analysis detected that your application is using OpenSSL v1.0.2k which has multiple known
                    vulnerabilities including CVE-2023-0286 and CVE-2022-3602. These could allow for remote code
                    execution and data leakage.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Recommended Actions</h4>
                  <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li>Update OpenSSL to version 3.1.0 or newer across all 3 hosts</li>
                    <li>Rotate the 2 certificates that are currently set to expire within 30 days</li>
                    <li>Review and update the 4 instances of hardcoded API keys found in the codebase</li>
                    <li>Replace MD5 hashing with SHA-256 or better in authentication flows</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Compliance Impact</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    These vulnerabilities affect your PCI-DSS compliance status in sections 2.2.1 (secure
                    configuration), 6.2 (security patches), and 8.2.1 (strong cryptography for authentication).
                  </p>
                </div>

                <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">View Detailed AI Analysis</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerabilities</CardTitle>
              <CardDescription>Detected cryptographic vulnerabilities in your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vulnerabilities.length > 0 ? (
                  vulnerabilities.map((vuln) => (
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
                        <div className="text-xs text-slate-500">
                          Detected: {new Date(vuln.detected).toLocaleDateString()}
                        </div>
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
                      Great job! Your application is currently free of detected cryptographic vulnerabilities.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Cryptographic Asset Inventory</CardTitle>
              <CardDescription>All cryptographic assets associated with this application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Hosts</h3>
                <div className="space-y-4">
                  {hosts.map((host) => (
                    <div
                      key={host.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{host.name}</h4>
                          <p className="text-sm text-slate-500">
                            {host.type} | {host.os} | {host.ip}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {host.vulnerabilities.critical + host.vulnerabilities.high} Issues
                        </Badge>
                      </div>

                      <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Certificates:</span>
                          <span className="ml-1 font-medium">{host.certificates}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Keys:</span>
                          <span className="ml-1 font-medium">{host.keys}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Critical:</span>
                          <span className="ml-1 font-medium text-red-500">{host.vulnerabilities.critical}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">High:</span>
                          <span className="ml-1 font-medium text-amber-500">{host.vulnerabilities.high}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/inventory/${host.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Certificates & Keys</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left border-b border-slate-200 dark:border-slate-800">
                        <th className="pb-2 font-medium text-slate-500">Type</th>
                        <th className="pb-2 font-medium text-slate-500">Name</th>
                        <th className="pb-2 font-medium text-slate-500">Host</th>
                        <th className="pb-2 font-medium text-slate-500">Expires</th>
                        <th className="pb-2 font-medium text-slate-500">Status</th>
                        <th className="pb-2 font-medium text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3">Certificate</td>
                        <td className="py-3">api.example.com</td>
                        <td className="py-3">prod-api-01</td>
                        <td className="py-3">2023-06-15</td>
                        <td className="py-3">
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                          >
                            Expiring Soon
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3">Certificate</td>
                        <td className="py-3">web.example.com</td>
                        <td className="py-3">prod-web-01</td>
                        <td className="py-3">2023-11-22</td>
                        <td className="py-3">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Valid
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3">Key</td>
                        <td className="py-3">api-auth-key</td>
                        <td className="py-3">prod-api-01</td>
                        <td className="py-3">N/A</td>
                        <td className="py-3">
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                          >
                            Weak (1024-bit)
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3">Key</td>
                        <td className="py-3">payment-encryption</td>
                        <td className="py-3">db-server-01</td>
                        <td className="py-3">N/A</td>
                        <td className="py-3">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Strong (4096-bit)
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="libraries">
          <Card>
            <CardHeader>
              <CardTitle>Cryptographic Libraries & Languages</CardTitle>
              <CardDescription>Libraries and programming languages used for cryptographic operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {libraries.map((lib) => (
                  <div
                    key={lib.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{lib.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{lib.usage}</p>
                      </div>
                      <Badge
                        className={
                          lib.vulnerabilities > 0
                            ? "bg-red-500"
                            : lib.version !== lib.latest_version
                              ? "bg-amber-500"
                              : "bg-green-500"
                        }
                      >
                        {lib.vulnerabilities > 0
                          ? `${lib.vulnerabilities} Vulnerabilities`
                          : lib.version !== lib.latest_version
                            ? "Update Available"
                            : "Up to Date"}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                        <span className="text-slate-500">Language:</span>
                        <span className="ml-1 font-medium">{lib.language}</span>
                      </div>
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                        <span className="text-slate-500">Current Version:</span>
                        <span className="ml-1 font-medium">{lib.version}</span>
                      </div>
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                        <span className="text-slate-500">Latest Version:</span>
                        <span className="ml-1 font-medium">{lib.latest_version}</span>
                      </div>
                    </div>

                    {lib.version !== lib.latest_version && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-sm text-amber-800 dark:text-amber-300">
                        <div className="font-medium">AI Recommendation:</div>
                        <p>
                          Update to the latest version to resolve {lib.vulnerabilities} known vulnerabilities and
                          improve security posture.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-slate-500">Used by {lib.apps_using.length} applications</div>
                      <Button size="sm" asChild>
                        <Link href={`/libraries/${lib.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
