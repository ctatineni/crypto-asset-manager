"use client"

import { useState } from "react"
import { apps, vulnerabilities, libraries } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { AlertTriangle, Download, Printer, Share2, Wrench } from "lucide-react"

export default function Reports() {
  const [selectedApp, setSelectedApp] = useState<string>("all")
  const [reportType, setReportType] = useState<string>("executive")
  const [includeRemediated, setIncludeRemediated] = useState<boolean>(false)

  const filteredVulnerabilities = vulnerabilities
    .filter((vuln) => (selectedApp === "all" ? true : vuln.affected_apps.includes(selectedApp)))
    .filter((vuln) => (includeRemediated ? true : vuln.status !== "resolved"))

  const criticalCount = filteredVulnerabilities.filter((v) => v.severity === "critical").length
  const highCount = filteredVulnerabilities.filter((v) => v.severity === "high").length
  const mediumCount = filteredVulnerabilities.filter((v) => v.severity === "medium").length
  const lowCount = filteredVulnerabilities.filter((v) => v.severity === "low").length

  const openCount = filteredVulnerabilities.filter((v) => v.status === "open").length
  const inProgressCount = filteredVulnerabilities.filter((v) => v.status === "in_progress").length
  const resolvedCount = filteredVulnerabilities.filter((v) => v.status === "resolved").length

  const totalVulnerabilities = filteredVulnerabilities.length
  const completionPercentage =
    totalVulnerabilities === 0 ? 100 : Math.round((resolvedCount / totalVulnerabilities) * 100)

  const outdatedLibraries = libraries
    .filter((lib) => lib.version !== lib.latest_version)
    .filter((lib) => (selectedApp === "all" ? true : lib.apps_using.includes(selectedApp)))

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Security Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Generate AI-enhanced security reports for your cryptographic assets
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

      {/* Report Configuration */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Application</label>
              <Select value={selectedApp} onValueChange={setSelectedApp}>
                <SelectTrigger>
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  {apps.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="technical">Technical Details</SelectItem>
                  <SelectItem value="compliance">Compliance Report</SelectItem>
                  <SelectItem value="remediation">Remediation Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2 h-10">
                <Checkbox
                  id="include-remediated"
                  checked={includeRemediated}
                  onCheckedChange={(checked) => setIncludeRemediated(checked as boolean)}
                />
                <label
                  htmlFor="include-remediated"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include remediated vulnerabilities
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>
              {selectedApp === "all" ? "All Applications" : apps.find((a) => a.id === selectedApp)?.name} -
              {reportType === "executive"
                ? " Executive Summary"
                : reportType === "technical"
                  ? " Technical Details"
                  : reportType === "compliance"
                    ? " Compliance Report"
                    : " Remediation Plan"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={reportType} value={reportType} onValueChange={setReportType}>
            <TabsList className="mb-6">
              <TabsTrigger value="executive">Executive Summary</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Report</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="executive" className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <h2>Executive Summary</h2>
                <p className="lead">
                  This report provides an overview of the cryptographic security posture for
                  {selectedApp === "all" ? " all applications" : ` ${apps.find((a) => a.id === selectedApp)?.name}`}.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h3 className="text-lg font-medium mb-3">Key Findings</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-2 bg-red-500">{criticalCount + highCount}</Badge>
                        <span>Critical and high severity vulnerabilities requiring immediate attention</span>
                      </li>
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-2 bg-amber-500">{outdatedLibraries.length}</Badge>
                        <span>Outdated cryptographic libraries with known security issues</span>
                      </li>
                      <li className="flex items-start">
                        <Badge className="mt-0.5 mr-2 bg-blue-500">{completionPercentage}%</Badge>
                        <span>Overall remediation completion rate</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h3 className="text-lg font-medium mb-3">AI Risk Assessment</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ${criticalCount > 0 ? "bg-red-500" : highCount > 0 ? "bg-amber-500" : "bg-green-500"}`}
                        ></div>
                        <div className="ml-2">
                          <p className="font-medium">Overall Security Posture</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {criticalCount > 0
                              ? "Critical vulnerabilities present significant risk and require immediate attention."
                              : highCount > 0
                                ? "High severity issues need to be addressed promptly to reduce security risk."
                                : "No critical or high severity issues detected. Continue monitoring for new vulnerabilities."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ${outdatedLibraries.length > 3 ? "bg-red-500" : outdatedLibraries.length > 0 ? "bg-amber-500" : "bg-green-500"}`}
                        ></div>
                        <div className="ml-2">
                          <p className="font-medium">Cryptographic Libraries</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {outdatedLibraries.length > 3
                              ? "Multiple outdated libraries detected. Update immediately to prevent exploitation."
                              : outdatedLibraries.length > 0
                                ? "Some libraries need updates to address potential security issues."
                                : "All cryptographic libraries are up-to-date with the latest security patches."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ${completionPercentage < 50 ? "bg-red-500" : completionPercentage < 80 ? "bg-amber-500" : "bg-green-500"}`}
                        ></div>
                        <div className="ml-2">
                          <p className="font-medium">Remediation Progress</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {completionPercentage < 50
                              ? "Remediation efforts are behind schedule. Allocate additional resources."
                              : completionPercentage < 80
                                ? "Remediation is progressing but requires continued focus."
                                : "Excellent remediation progress. Continue monitoring for new issues."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3>Executive Recommendations</h3>
                <ol>
                  <li>
                    <strong>Prioritize Critical Vulnerabilities:</strong> Address the {criticalCount} critical
                    vulnerabilities immediately to mitigate the highest risk exposures.
                  </li>
                  <li>
                    <strong>Update Cryptographic Libraries:</strong> Implement a systematic update of the{" "}
                    {outdatedLibraries.length} outdated libraries to reduce security debt.
                  </li>
                  <li>
                    <strong>Implement Automated Monitoring:</strong> Deploy automated certificate expiration monitoring
                    to prevent service disruptions.
                  </li>
                  <li>
                    <strong>Enhance Developer Training:</strong> Provide targeted training on secure cryptographic
                    implementations to prevent future issues.
                  </li>
                </ol>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-6">
                  <h3 className="text-blue-800 dark:text-blue-300 font-medium">AI-Enhanced Insight</h3>
                  <p className="text-blue-800 dark:text-blue-300 mt-1">
                    Our AI analysis indicates that implementing automated certificate management would prevent 60% of
                    the current critical issues. Additionally, standardizing on a single, well-maintained cryptographic
                    library across all applications would reduce complexity and improve security posture by an estimated
                    40%.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <h2>Technical Details Report</h2>
                <p className="lead">
                  This report provides detailed technical information about cryptographic vulnerabilities and
                  configurations for
                  {selectedApp === "all" ? " all applications" : ` ${apps.find((a) => a.id === selectedApp)?.name}`}.
                </p>

                <h3>Vulnerability Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="text-left py-3 px-4">Severity</th>
                        <th className="text-left py-3 px-4">Count</th>
                        <th className="text-left py-3 px-4">Open</th>
                        <th className="text-left py-3 px-4">In Progress</th>
                        <th className="text-left py-3 px-4">Resolved</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3 px-4">
                          <Badge className="bg-red-500">Critical</Badge>
                        </td>
                        <td className="py-3 px-4">{criticalCount}</td>
                        <td className="py-3 px-4">
                          {
                            filteredVulnerabilities.filter((v) => v.severity === "critical" && v.status === "open")
                              .length
                          }
                        </td>
                        <td className="py-3 px-4">
                          {
                            filteredVulnerabilities.filter(
                              (v) => v.severity === "critical" && v.status === "in_progress",
                            ).length
                          }
                        </td>
                        <td className="py-3 px-4">
                          {
                            filteredVulnerabilities.filter((v) => v.severity === "critical" && v.status === "resolved")
                              .length
                          }
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3 px-4">
                          <Badge className="bg-amber-500">High</Badge>
                        </td>
                        <td className="py-3 px-4">{highCount}</td>
                        <td className="py-3 px-4">
                          {filteredVulnerabilities.filter((v) => v.severity === "high" && v.status === "open").length}
                        </td>
                        <td className="py-3 px-4">
                          {
                            filteredVulnerabilities.filter((v) => v.severity === "high" && v.status === "in_progress")
                              .length
                          }
                        </td>
                        <td className="py-3 px-4">
                          {
                            filteredVulnerabilities.filter((v) => v.severity === "high" && v.status === "resolved")
                              .length
                          }
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3 px-4">
                          <Badge className="bg-yellow-500">Medium</Badge>
                        </td>
                        <td className="py-3 px-4">{mediumCount}</td>
                        <td className="py-3 px-4">
                          {filteredVulnerabilities.filter((v) => v.severity === "medium" && v.status === "open").length}
                        </td>
                        <td className="py-3 px-4">
                          {
                            filteredVulnerabilities.filter((v) => v.severity === "medium" && v.status === "in_progress")
                              .length
                          }
                        </td>
                        <td className="py-3 px-4">
                          {
                            filteredVulnerabilities.filter((v) => v.severity === "medium" && v.status === "resolved")
                              .length
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-500">Low</Badge>
                        </td>
                        <td className="py-3 px-4">{lowCount}</td>
                        <td className="py-3 px-4">
                          {filteredVulnerabilities.filter((v) => v.severity === "low" && v.status === "open").length}
                        </td>
                        <td className="py-3 px-4">
                          {
                            filteredVulnerabilities.filter((v) => v.severity === "low" && v.status === "in_progress")
                              .length
                          }
                        </td>
                        <td className="py-3 px-4">
                          {
                            filteredVulnerabilities.filter((v) => v.severity === "low" && v.status === "resolved")
                              .length
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="mt-6">Cryptographic Libraries</h3>
                <div className="space-y-4">
                  {outdatedLibraries.map((lib) => (
                    <div
                      key={lib.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{lib.name}</h4>
                          <p className="text-sm text-slate-500">{lib.usage}</p>
                        </div>
                        <Badge className={lib.vulnerabilities > 0 ? "bg-red-500" : "bg-amber-500"}>
                          {lib.vulnerabilities > 0 ? `${lib.vulnerabilities} Vulnerabilities` : "Update Available"}
                        </Badge>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Language:</span>
                          <span className="ml-1 font-medium">{lib.language}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Current:</span>
                          <span className="ml-1 font-medium">{lib.version}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Latest:</span>
                          <span className="ml-1 font-medium">{lib.latest_version}</span>
                        </div>
                      </div>

                      {lib.vulnerabilities > 0 && (
                        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-300">
                          <span className="font-medium">Technical Impact:</span> Vulnerable to CVE-2023-0286,
                          CVE-2022-3602 which could allow remote code execution and TLS handshake vulnerabilities.
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h3 className="mt-6">Technical Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h4 className="font-medium">Certificate Management</h4>
                    <p className="text-sm mt-1">
                      Implement automated certificate lifecycle management using a tool like cert-manager or Let's
                      Encrypt with auto-renewal. Configure monitoring to alert 30 days before expiration.
                    </p>
                    <pre className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs overflow-x-auto">
                      <code>
                        # Example cert-manager configuration{"\n"}
                        apiVersion: cert-manager.io/v1{"\n"}
                        kind: Certificate{"\n"}
                        metadata:{"\n"}
                        {"  "}name: example-com-tls{"\n"}
                        spec:{"\n"}
                        {"  "}secretName: example-com-tls{"\n"}
                        {"  "}duration: 2160h # 90 days{"\n"}
                        {"  "}renewBefore: 720h # 30 days{"\n"}
                        {"  "}issuerRef:{"\n"}
                        {"    "}name: letsencrypt-prod{"\n"}
                        {"    "}kind: ClusterIssuer
                      </code>
                    </pre>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h4 className="font-medium">Library Updates</h4>
                    <p className="text-sm mt-1">
                      Update OpenSSL to version 3.1.0 or newer across all affected systems. Test in staging environment
                      before deploying to production.
                    </p>
                    <pre className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs overflow-x-auto">
                      <code>
                        # Ubuntu/Debian{"\n"}
                        sudo apt update{"\n"}
                        sudo apt install openssl{"\n\n"}# CentOS/RHEL{"\n"}
                        sudo yum update openssl{"\n\n"}# Verify version{"\n"}
                        openssl version
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-6">
                  <h3 className="text-blue-800 dark:text-blue-300 font-medium">AI-Enhanced Technical Analysis</h3>
                  <p className="text-blue-800 dark:text-blue-300 mt-1">
                    Our AI analysis of your codebase indicates that 73% of cryptographic implementations use deprecated
                    methods. Specifically, we detected the use of MD5 for password hashing in authentication flows,
                    which should be replaced with bcrypt or Argon2. Additionally, we found 4 instances of hardcoded API
                    keys in the codebase that should be moved to environment variables or a secure vault service.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <h2>Compliance Report</h2>
                <p className="lead">
                  This report evaluates compliance status with industry standards and regulations for
                  {selectedApp === "all" ? " all applications" : ` ${apps.find((a) => a.id === selectedApp)?.name}`}.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h3 className="text-lg font-medium mb-3">Compliance Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">PCI-DSS</span>
                          <span className="text-sm font-medium text-amber-500">Partial Compliance</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">NIST 800-53</span>
                          <span className="text-sm font-medium text-amber-500">Partial Compliance</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">GDPR</span>
                          <span className="text-sm font-medium text-green-500">Compliant</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">HIPAA</span>
                          <span className="text-sm font-medium text-red-500">Non-Compliant</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h3 className="text-lg font-medium mb-3">Critical Compliance Gaps</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full mt-1.5 bg-red-500"></div>
                        <div className="ml-2">
                          <p className="font-medium">PCI-DSS 3.2.1 - Requirement 2.2.1</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Implement only one primary function per server to prevent functions that require different
                            security levels from co-existing.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full mt-1.5 bg-red-500"></div>
                        <div className="ml-2">
                          <p className="font-medium">PCI-DSS 3.2.1 - Requirement 6.2</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Ensure that all system components and software are protected from known vulnerabilities by
                            installing applicable vendor-supplied security patches.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full mt-1.5 bg-red-500"></div>
                        <div className="ml-2">
                          <p className="font-medium">HIPAA - 164.312(a)(2)(iv)</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Implement a mechanism to encrypt and decrypt electronic protected health information.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full mt-1.5 bg-amber-500"></div>
                        <div className="ml-2">
                          <p className="font-medium">NIST 800-53 - SC-13</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            The information system implements FIPS-validated cryptography for protection of sensitive
                            information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3>Detailed Compliance Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="text-left py-3 px-4">Standard</th>
                        <th className="text-left py-3 px-4">Requirement</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Gap</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3 px-4">PCI-DSS</td>
                        <td className="py-3 px-4">3.2.1 - Req 2.2.1</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-red-500">Non-Compliant</Badge>
                        </td>
                        <td className="py-3 px-4">Multiple functions on same server with different security levels</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3 px-4">PCI-DSS</td>
                        <td className="py-3 px-4">3.2.1 - Req 6.2</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-red-500">Non-Compliant</Badge>
                        </td>
                        <td className="py-3 px-4">Outdated OpenSSL with known vulnerabilities</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3 px-4">PCI-DSS</td>
                        <td className="py-3 px-4">3.2.1 - Req 8.2.1</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-amber-500">Partial</Badge>
                        </td>
                        <td className="py-3 px-4">Weak password hashing (MD5) in authentication</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <td className="py-3 px-4">HIPAA</td>
                        <td className="py-3 px-4">164.312(a)(2)(iv)</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-red-500">Non-Compliant</Badge>
                        </td>
                        <td className="py-3 px-4">Insufficient encryption for PHI data at rest</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">NIST</td>
                        <td className="py-3 px-4">800-53 - SC-13</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-amber-500">Partial</Badge>
                        </td>
                        <td className="py-3 px-4">Non-FIPS validated cryptography in use</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-6">
                  <h3 className="text-blue-800 dark:text-blue-300 font-medium">AI-Enhanced Compliance Insights</h3>
                  <p className="text-blue-800 dark:text-blue-300 mt-1">
                    Our AI analysis indicates that addressing the OpenSSL vulnerabilities and implementing proper key
                    management would resolve 65% of your compliance gaps. The most critical compliance issue is the use
                    of MD5 for password hashing, which violates multiple standards including PCI-DSS and NIST
                    guidelines. Implementing a proper cryptographic key lifecycle management system would significantly
                    improve your compliance posture across all standards.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="remediation" className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <h2>Remediation Plan</h2>
                <p className="lead">
                  This report provides a detailed plan for remediating cryptographic vulnerabilities for
                  {selectedApp === "all" ? " all applications" : ` ${apps.find((a) => a.id === selectedApp)?.name}`}.
                </p>

                <h3>Prioritized Remediation Tasks</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
                    <h4 className="font-medium text-red-800 dark:text-red-300">Critical Priority (Immediate)</h4>
                    <ol className="mt-2 space-y-2 text-red-800 dark:text-red-300">
                      <li>
                        <strong>Update OpenSSL:</strong> Update OpenSSL to version 3.1.0 or newer across all affected
                        systems to address CVE-2023-0286 and CVE-2022-3602.
                        <div className="text-xs mt-1">
                          <span className="font-medium">Estimated effort:</span> 4 hours per server
                          <span className="mx-2">|</span>
                          <span className="font-medium">Assigned to:</span> Infrastructure Team
                        </div>
                      </li>
                      <li>
                        <strong>Renew Expired Certificates:</strong> Generate and deploy new SSL certificates for
                        api.example.com.
                        <div className="text-xs mt-1">
                          <span className="font-medium">Estimated effort:</span> 2 hours
                          <span className="mx-2">|</span>
                          <span className="font-medium">Assigned to:</span> Security Team
                        </div>
                      </li>
                      <li>
                        <strong>Rotate Exposed API Keys:</strong> Revoke and rotate all hardcoded API keys found in the
                        codebase.
                        <div className="text-xs mt-1">
                          <span className="font-medium">Estimated effort:</span> 6 hours
                          <span className="mx-2">|</span>
                          <span className="font-medium">Assigned to:</span> Development Team
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20">
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">High Priority (Within 1 Week)</h4>
                    <ol className="mt-2 space-y-2 text-amber-800 dark:text-amber-300">
                      <li>
                        <strong>Replace MD5 Hashing:</strong> Update authentication code to use bcrypt or Argon2 for
                        password hashing.
                        <div className="text-xs mt-1">
                          <span className="font-medium">Estimated effort:</span> 8 hours
                          <span className="mx-2">|</span>
                          <span className="font-medium">Assigned to:</span> Development Team
                        </div>
                      </li>
                      <li>
                        <strong>Implement Certificate Monitoring:</strong> Set up automated monitoring for certificate
                        expiration.
                        <div className="text-xs mt-1">
                          <span className="font-medium">Estimated effort:</span> 4 hours
                          <span className="mx-2">|</span>
                          <span className="font-medium">Assigned to:</span> DevOps Team
                        </div>
                      </li>
                      <li>
                        <strong>Update Node-Forge:</strong> Update Node-Forge library to version 1.3.1 across all
                        applications.
                        <div className="text-xs mt-1">
                          <span className="font-medium">Estimated effort:</span> 3 hours per application
                          <span className="mx-2">|</span>
                          <span className="font-medium">Assigned to:</span> Development Team
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                      Medium Priority (Within 2 Weeks)
                    </h4>
                    <ol className="mt-2 space-y-2 text-yellow-800 dark:text-yellow-300">
                      <li>
                        <strong>Implement Secrets Management:</strong> Move all API keys to a secure vault service.
                        <div className="text-xs mt-1">
                          <span className="font-medium">Estimated effort:</span> 16 hours
                          <span className="mx-2">|</span>
                          <span className="font-medium">Assigned to:</span> DevOps Team
                        </div>
                      </li>
                      <li>
                        <strong>Update BouncyCastle:</strong> Update BouncyCastle to version 1.70 in Java applications.
                        <div className="text-xs mt-1">
                          <span className="font-medium">Estimated effort:</span> 4 hours
                          <span className="mx-2">|</span>
                          <span className="font-medium">Assigned to:</span> Development Team
                        </div>
                      </li>
                      <li>
                        <strong>Implement Pre-commit Hooks:</strong> Add pre-commit hooks to scan for credentials in
                        code.
                        <div className="text-xs mt-1">
                          <span className="font-medium">Estimated effort:</span> 6 hours
                          <span className="mx-2">|</span>
                          <span className="font-medium">Assigned to:</span> DevOps Team
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

                <h3 className="mt-6">Implementation Timeline</h3>
                <div className="relative overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 font-medium">
                        Task
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 text-center font-medium">
                        Week 1
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 text-center font-medium">
                        Week 2
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 text-center font-medium">
                        Week 3
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 text-center font-medium">
                        Week 4
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 text-center font-medium">
                        Week 5
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 text-center font-medium">
                        Week 6
                      </div>
                    </div>

                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800">Update OpenSSL</div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 bg-red-100 dark:bg-red-900/30"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800">
                        Renew Certificates
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 bg-red-100 dark:bg-red-900/30"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800">
                        Rotate API Keys
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 bg-red-100 dark:bg-red-900/30"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800">
                        Replace MD5 Hashing
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 bg-amber-100 dark:bg-amber-900/30"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800">
                        Implement Certificate Monitoring
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 bg-amber-100 dark:bg-amber-900/30"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800">
                        Update Node-Forge
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 bg-amber-100 dark:bg-amber-900/30"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800">
                        Implement Secrets Management
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 bg-yellow-100 dark:bg-yellow-900/30"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800">
                        Update BouncyCastle
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 bg-yellow-100 dark:bg-yellow-900/30"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-8 gap-0">
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800">
                        Implement Pre-commit Hooks
                      </div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800 bg-yellow-100 dark:bg-yellow-900/30"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                      <div className="p-2 border-b border-r border-slate-200 dark:border-slate-800"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-6">
                  <h3 className="text-blue-800 dark:text-blue-300 font-medium">AI-Enhanced Remediation Strategy</h3>
                  <p className="text-blue-800 dark:text-blue-300 mt-1">
                    Our AI analysis suggests that implementing the critical and high priority items will reduce your
                    overall security risk by 78%. The most efficient approach is to tackle the OpenSSL updates first, as
                    this addresses the most severe vulnerabilities affecting multiple applications. We recommend
                    assigning a dedicated security engineer to coordinate the certificate renewal process to ensure no
                    disruptions to service availability.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
