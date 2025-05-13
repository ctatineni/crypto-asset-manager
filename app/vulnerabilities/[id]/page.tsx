"use client"

import { useParams, useRouter } from "next/navigation"
import { getVulnerability, apps } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  ArrowLeft,
  Code,
  FileText,
  GitBranch,
  Link2,
  ListChecks,
  MessageSquare,
  Wrench,
} from "lucide-react"
import Link from "next/link"

export default function VulnerabilityDetail() {
  const params = useParams()
  const router = useRouter()
  const vulnId = params.id as string
  const vulnerability = getVulnerability(vulnId)

  if (!vulnerability) {
    return (
      <div className="container max-w-7xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Vulnerability not found. The vulnerability you are looking for does not exist or has been removed.
          </AlertDescription>
        </Alert>

        <Button asChild>
          <Link href="/vulnerabilities">Return to Vulnerabilities</Link>
        </Button>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-amber-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-slate-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-red-500 border-red-200 dark:border-red-800"
      case "in_progress":
        return "text-amber-500 border-amber-200 dark:border-amber-800"
      case "resolved":
        return "text-green-500 border-green-200 dark:border-green-800"
      default:
        return "text-slate-500 border-slate-200 dark:border-slate-800"
    }
  }

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {vulnerability.name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getSeverityColor(vulnerability.severity)}>
              {vulnerability.severity.charAt(0).toUpperCase() + vulnerability.severity.slice(1)}
            </Badge>
            <Badge variant="outline" className={getStatusColor(vulnerability.status)}>
              {vulnerability.status === 'open' ? 'Open' : 
               vulnerability.status === 'in_progress' ? 'In Progress' : 
               'Resolved'}
            </Badge>
            <span className="text-sm text-slate-500">
              Detected: {new Date(vulnerability.detected).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Description</h3>
                  <p className="mt-1">{vulnerability.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Affected Applications</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {vulnerability.affected_apps.map((appId) => {
                      const app = apps.find(a => a.id === appId);
                      return (
                        <Badge key={appId} variant="outline" className="border-blue-200 dark:border-blue-800">
                          {app?.name || appId}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Technical Details</h3>
                  <div className="mt-1 p-4 bg-slate-100 dark:bg-slate-800 rounded-md font-mono text-sm">
                    {vulnerability.name === "Expired Certificate" ? (
                      <>
                        Certificate: api.example.com<br />
                        Expiration: 2023-04-15T23:59:59Z<br />
                        Current date: 2023-05-03T14:50:00Z<br />
                        Status: Expired (18 days ago)
                      </>
                    ) : vulnerability.name === "Weak Encryption Algorithm" ? (
                      <>
                        Algorithm: MD5<br />
                        Current usage: Password hashing<br />
                        Problem: Cryptographically broken, vulnerable to collision attacks<br />
                        NIST Recommendation: Use SHA-3, BLAKE2, or Argon2 instead
                      </>
                    ) : vulnerability.name === "Hardcoded API Keys" ? (
                      <>
                        Location: /src/api/client.js, line 42<br />
                        Key type: AWS Secret Access Key<br />
                        Exposure: Private repository, but embedded in compiled code<br />
                        Risk: Credential exposure in distributed application
                      </>
                    ) : (
                      <>
                        Component: OpenSSL v1.0.2k<br />
                        CVE: CVE-2023-0286, CVE-2022-3602<br />
                        Impact: Remote code execution, TLS handshake vulnerability<br />
                        Fixed in: OpenSSL 3.1.0
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500">AI Risk Assessment</h3>
                  <div className="mt-1 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md">
                    <div className="flex items-start mb-3">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${vulnerability.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                      <div className="ml-2">
                        <h4 className="font-medium">Risk Level: {vulnerability.severity.charAt(0).toUpperCase() + vulnerability.severity.slice(1)}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {vulnerability.name === "Expired Certificate" ? 
                            "Expired certificates expose your application to potential MITM attacks and cause trust issues with users." :
                           vulnerability.name === "Weak Encryption Algorithm" ? 
                            "MD5 is cryptographically broken and can lead to account compromises through collision attacks." :
                           vulnerability.name === "Hardcoded API Keys" ? 
                            "Hardcoded credentials can be extracted from distributed applications, potentially leading to unauthorized access to services." :
                            "Outdated cryptographic libraries contain known vulnerabilities that can be exploited by attackers to compromise your system."
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Link2 className="h-5 w-5 mt-0.5 text-blue-500" />
                      <div className="ml-2">
                        <h4 className="font-medium">Potential Impact</h4>
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 mt-1 space-y-1">
                          {vulnerability.name === "Expired Certificate" ? (
                            <>
                              <li>Man-in-the-middle attacks</li>
                              <li>Browser warnings for users</li>
                              <li>Loss of customer trust</li>
                              <li>Potential data exposure</li>
                            </>
                          ) : vulnerability.name === "Weak Encryption Algorithm" ? (
                            <>
                              <li>Password hash collisions</li>
                              <li>Potential account takeovers</li>
                              <li>Regulatory compliance issues</li>
                              <li>Reputational damage</li>
                            </>
                          ) : vulnerability.name === "Hardcoded API Keys" ? (
                            <>
                              <li>Unauthorized service access</li>
                              <li>Potential data breaches</li>
                              <li>Financial losses from service abuse</li>
                              <li>Violation of cloud provider terms</li>
                            </>
                          ) : (
                            <>
                              <li>Remote code execution</li>
                              <li>Data interception</li>
                              <li>System compromise</li>
                              <li>Lateral movement through network</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Remediation Plan</CardTitle>
              <CardDescription>AI-generated steps to fix this vulnerability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">Recommended Action</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                    {vulnerability.recommendation}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Step-by-Step Remediation</h3>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">#</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead className="w-[150px]">Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vulnerability.name === "Expired Certificate" ? (
                          <>
                            <TableRow>
                              <TableCell>1</TableCell>
                              <TableCell>Generate new SSL certificate from your CA or renew existing one</TableCell>
                              <TableCell><Badge className="bg-red-500">Critical</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>2</TableCell>
                              <TableCell>Install and configure the new certificate on affected servers</TableCell>
                              <TableCell><Badge className="bg-red-500">Critical</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>3</TableCell>
                              <TableCell>Implement automated monitoring for certificate expiration</TableCell>
                              <TableCell><Badge className="bg-amber-500">High</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>4</TableCell>
                              <TableCell>Set up alerts for certificates expiring within 30 days</TableCell>
                              <TableCell><Badge className="bg-amber-500">High</Badge></TableCell>
                            </TableRow>
                          </>
                        ) : vulnerability.name === "Weak Encryption Algorithm" ? (
                          <>
                            <TableRow>
                              <TableCell>1</TableCell>
                              <TableCell>Update authentication code to use bcrypt or Argon2 for password hashing</TableCell>
                              <TableCell><Badge className="bg-red-500">Critical</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>2</TableCell>
                              <TableCell>Create a migration script to rehash existing passwords when users log in</TableCell>
                              <TableCell><Badge className="bg-amber-500">High</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>3</TableCell>
                              <TableCell>Force password reset for all users after migration (optional but recommended)</TableCell>
                              <TableCell><Badge className="bg-yellow-500">Medium</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>4</TableCell>
                              <TableCell>Update security policy to prohibit using deprecated cryptographic algorithms</TableCell>
                              <TableCell><Badge className="bg-yellow-500">Medium</Badge></TableCell>
                            </TableRow>
                          </>
                        ) : vulnerability.name === "Hardcoded API Keys" ? (
                          <>
                            <TableRow>
                              <TableCell>1</TableCell>
                              <TableCell>Revoke and rotate all exposed API keys immediately</TableCell>
                              <TableCell><Badge className="bg-red-500">Critical</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>2</TableCell>
                              <TableCell>Move API keys to environment variables or a secure vault service</TableCell>
                              <TableCell><Badge className="bg-amber-500">High</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>3</TableCell>
                              <TableCell>Implement runtime secrets injection rather than build-time inclusion</TableCell>
                              <TableCell><Badge className="bg-amber-500">High</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>4</TableCell>
                              <TableCell>Add pre-commit hooks to scan for credentials in code</TableCell>
                              <TableCell><Badge className="bg-yellow-500">Medium</Badge></TableCell>
                            </TableRow>
                          </>
                        ) : (
                          <>
                            <TableRow>
                              <TableCell>1</TableCell>
                              <TableCell>Update OpenSSL to version 3.1.0 or newer on all affected systems</TableCell>
                              <TableCell><Badge className="bg-red-500">Critical</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>2</TableCell>
                              <TableCell>Test application functionality after the update in a staging environment</TableCell>
                              <TableCell><Badge className="bg-amber-500">High</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>3</TableCell>
                              <TableCell>Update deployment pipelines to include the newer version</TableCell>
                              <TableCell><Badge className="bg-amber-500">High</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>4</TableCell>
                              <TableCell>Implement automated dependency scanning in CI/CD pipeline</TableCell>
                              <TableCell><Badge className="bg-yellow-500">Medium</Badge></TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Code Example</h3>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {vulnerability.name === "Expired Certificate" ? (
                      <>
                        <div className="text-slate-500"># Using certbot to renew Let's Encrypt certificate</div>
                        <div className="text-green-400">sudo certbot renew --cert-name api.example.com</div>
                        <br />
                        <div className="text-slate-500"># Automated monitoring with script in crontab</div>
                        <div className="text-blue-400">#!/bin/bash</div>
                        <div className="text-slate-300">
                          DOMAIN="api.example.com"<br />
                          DAYS=30<br />
                          EXPIRY=$(openssl s_client -connect $DOMAIN:443 &lt; /dev/null 2&gt;/dev/null | openssl x509 -enddate -noout | cut -d= -f2)<br />
                          EXPIRY_DATE=$(date -d "$EXPIRY" +%s)<br />
                          NOW=$(date +%s)<br />
                          DIFF=$(( ($EXPIRY_DATE - $NOW) / 86400 ))<br /><br />
                          
                          if [ $DIFF -lt $DAYS ]<br />
                          then<br />
                          &nbsp;&nbsp;echo "Certificate for $DOMAIN will expire in $DIFF days" | mail -s "Certificate Expiry Warning" admin@example.com<br />
                          fi
                        </div>
                      </>
                    ) : vulnerability.name === "Weak Encryption Algorithm" ? (
                      <>
                        <div className="text-slate-500">// Before: Using MD5 for password hashing (insecure)</div>
                        <div className="text-red-400">
                          const crypto = require('crypto');<br />
                          <br />
                          function hashPassword(password) {<br />\
                          &nbsp;&nbsp;return crypto.createHash('md5').update(password).digest('hex');<br />
                          }
                        </div>
                        <br />
                        <div className="text-slate-500">// After: Using bcrypt for secure password hashing</div>
                        <div className="text-green-400">
                          const bcrypt = require('bcrypt');<br />
                          const SALT_ROUNDS = 12;<br />
                          <br />
                          async function hashPassword(password) {<br />
                          &nbsp;&nbsp;return await bcrypt.hash(password, SALT_ROUNDS);<br />
                          }<br />
                          <br />
                          async function verifyPassword(password, hash) {<br />
                          &nbsp;&nbsp;return await bcrypt.compare(password, hash);<br />
                          }
                        </div>
                      </>
                    ) : vulnerability.name === "Hardcoded API Keys" ? (
                      <>
                        <div className="text-slate-500">// Before: Hardcoded API key (insecure)</div>
                        <div className="text-red-400">
                          const apiClient = new AWS.S3({<br />
                          &nbsp;&nbsp;accessKeyId: 'AKIAIOSFODNN7EXAMPLE',<br />
                          &nbsp;&nbsp;secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',<br />
                          &nbsp;&nbsp;region: 'us-west-2'<br />
                          });
                        </div>
                        <br />
                        <div className="text-slate-500">// After: Using environment variables</div>
                        <div className="text-green-400">
                          const apiClient = new AWS.S3({<br />
                          &nbsp;&nbsp;accessKeyId: process.env.AWS_ACCESS_KEY_ID,<br />
                          &nbsp;&nbsp;secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,<br />
                          &nbsp;&nbsp;region: process.env.AWS_REGION<br />
                          });
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-slate-500"># Ubuntu/Debian update OpenSSL</div>
                        <div className="text-green-400">
                          sudo apt update<br />
                          sudo apt install openssl
                        </div>
                        <br />
                        <div className="text-slate-500"># CentOS/RHEL update OpenSSL</div>
                        <div className="text-green-400">
                          sudo yum update openssl
                        </div>
                        <br />
                        <div className="text-slate-500"># Check version after update</div>
                        <div className="text-green-400">
                          openssl version
                        </div>
                        <br />
                        <div className="text-slate-500"># Docker - update base image in Dockerfile</div>
                        <div className="text-blue-400">
                          FROM ubuntu:22.04<br/>
                          # Instead of<br/>
                          # FROM ubuntu:18.04
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                Copy Code Example
              </Button>
              <Button>
                Mark as In Progress
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Remediation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="outline" className={getStatusColor(vulnerability.status)}>
                    {vulnerability.status === 'open' ? 'Open' : 
                    vulnerability.status === 'in_progress' ? 'In Progress' : 
                    'Resolved'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Priority</span>
                  <Badge className={getSeverityColor(vulnerability.severity)}>
                    {vulnerability.severity.charAt(0).toUpperCase() + vulnerability.severity.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Assigned To</span>
                  <span>Security Team</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Due Date</span>
                  <span>{new Date(new Date(vulnerability.detected).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button className="w-full">
                    <Wrench className="mr-2 h-4 w-4" />
                    Begin Remediation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Security Documentation
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#" className="flex items-center">
                    <Code className="mr-2 h-4 w-4" />
                    Secure Coding Guidelines
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#" className="flex items-center">
                    <ListChecks className="mr-2 h-4 w-4" />
                    OWASP Cryptographic Standards
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#" className="flex items-center">
                    <GitBranch className="mr-2 h-4 w-4" />
                    View in Code Repository
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Request Assistance
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Get help with this vulnerability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 mb-4 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  How can I help you remediate this {vulnerability.severity} {vulnerability.name.toLowerCase()} vulnerability?
                </p>
              </div>
              
              <Button className="w-full">Ask AI Assistant</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
