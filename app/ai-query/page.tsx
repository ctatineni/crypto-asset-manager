"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BrainCircuit,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Shield,
  Key,
  FileText,
  Server,
  Library,
  AlertTriangle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  apps,
  certificates,
  libraries,
  hosts,
  vulnerabilities,
  getAppByAppId,
  getCertificatesForApp,
  getLibrariesForApp,
  getHostsForApp,
  getVulnerabilitiesForApp,
  getAntiPatternsForApp,
  getLanguagesForApp,
} from "@/lib/mock-data"

export default function AIQuery() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI security assistant. How can I help you with your cryptographic assets today?",
      type: "text",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input, type: "text" }])
    setIsLoading(true)

    // Process the query
    setTimeout(() => {
      processQuery(input)
      setIsLoading(false)
      setInput("")
    }, 1500)
  }

  const processQuery = (query: string) => {
    const lowerQuery = query.toLowerCase()

    // Check for application ID query
    const appIdMatch =
      lowerQuery.match(/application id (\d+)/) || lowerQuery.match(/app id (\d+)/) || lowerQuery.match(/appid (\d+)/)

    if (appIdMatch) {
      const appId = appIdMatch[1]
      const app = getAppByAppId(appId)

      if (app) {
        // Get all assets for this application
        const appCertificates = getCertificatesForApp(appId)
        const appLibraries = getLibrariesForApp(appId)
        const appHosts = getHostsForApp(appId)
        const appVulnerabilities = getVulnerabilitiesForApp(appId)
        const appAntiPatterns = getAntiPatternsForApp(appId)
        const appLanguages = getLanguagesForApp(appId)

        // Generate response with application assets
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Here are the cryptographic assets for application ID ${appId} (${app.name}):`,
            type: "text",
          },
        ])

        // Add certificates table
        if (appCertificates.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: {
                title: "Certificates",
                data: appCertificates,
                columns: ["name", "issuer", "expiryDate", "status"],
                icon: FileText,
              },
              type: "table",
            },
          ])
        }

        // Add libraries table
        if (appLibraries.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: {
                title: "Libraries",
                data: appLibraries,
                columns: ["name", "version", "latest_version", "vulnerabilities"],
                icon: Library,
              },
              type: "table",
            },
          ])
        }

        // Add hosts table
        if (appHosts.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: {
                title: "Hosts/Sources",
                data: appHosts,
                columns: ["name", "type", "environment", "ip"],
                icon: Server,
              },
              type: "table",
            },
          ])
        }

        // Add vulnerabilities table
        if (appVulnerabilities.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: {
                title: "Vulnerabilities",
                data: appVulnerabilities,
                columns: ["name", "severity", "status", "cvssScore"],
                icon: AlertTriangle,
              },
              type: "table",
            },
          ])
        }

        // Add anti-patterns table
        if (appAntiPatterns.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: {
                title: "Code Anti-Patterns",
                data: appAntiPatterns,
                columns: ["name", "severity", "languages"],
                icon: AlertTriangle,
              },
              type: "table",
            },
          ])
        }

        // Add languages table
        if (appLanguages.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: {
                title: "Programming Languages",
                data: appLanguages,
                columns: ["name", "version"],
                icon: Library,
              },
              type: "table",
            },
          ])
        }

        // Add summary
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Summary: Application ${app.name} (ID: ${appId}) has ${appCertificates.length} certificates, ${appLibraries.length} libraries, ${appHosts.length} hosts/sources, ${appVulnerabilities.length} vulnerabilities, and ${appAntiPatterns.length} code anti-patterns.`,
            type: "text",
          },
        ])

        return
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I couldn't find an application with ID ${appId}. Please check the ID and try again.`,
            type: "text",
          },
        ])
        return
      }
    }

    // Check for expired certificates query
    if (
      lowerQuery.includes("expired certificate") ||
      lowerQuery.includes("expiring certificate") ||
      lowerQuery.includes("certificates expiring")
    ) {
      const expiredCerts = certificates.filter((cert) => cert.isExpired || cert.status === "expiring")

      if (expiredCerts.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I found ${expiredCerts.length} expired or expiring certificates:`,
            type: "text",
          },
        ])

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: {
              title: "Expired/Expiring Certificates",
              data: expiredCerts,
              columns: ["name", "issuer", "expiryDate", "status"],
              icon: FileText,
            },
            type: "table",
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Good news! I couldn't find any expired or expiring certificates in your environment.",
            type: "text",
          },
        ])
      }

      return
    }

    // Check for vulnerable libraries query
    if (lowerQuery.includes("vulnerable librar") || lowerQuery.includes("library vulnerabilit")) {
      const vulnerableLibs = libraries.filter((lib) => lib.vulnerabilities > 0)

      if (vulnerableLibs.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I found ${vulnerableLibs.length} libraries with known vulnerabilities:`,
            type: "text",
          },
        ])

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: {
              title: "Vulnerable Libraries",
              data: vulnerableLibs,
              columns: ["name", "version", "latest_version", "vulnerabilities"],
              icon: Library,
            },
            type: "table",
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Good news! I couldn't find any libraries with known vulnerabilities in your environment.",
            type: "text",
          },
        ])
      }

      return
    }

    // Check for critical vulnerabilities query
    if (lowerQuery.includes("critical vulnerabilit") || lowerQuery.includes("high vulnerabilit")) {
      const criticalVulns = vulnerabilities.filter((vuln) => vuln.severity === "critical" || vuln.severity === "high")

      if (criticalVulns.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I found ${criticalVulns.length} critical or high severity vulnerabilities:`,
            type: "text",
          },
        ])

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: {
              title: "Critical/High Vulnerabilities",
              data: criticalVulns,
              columns: ["name", "severity", "status", "cvssScore"],
              icon: AlertTriangle,
            },
            type: "table",
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Good news! I couldn't find any critical or high severity vulnerabilities in your environment.",
            type: "text",
          },
        ])
      }

      return
    }

    // Default response for unrecognized queries
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "I can help you query information about your cryptographic assets. Try asking something like:\n\n- Display all cryptographic assets for application ID 123345\n- Show me all expired certificates\n- List vulnerable libraries\n- Show critical vulnerabilities",
        type: "text",
      },
    ])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Render table content
  const renderTableContent = (content) => {
    const { title, data, columns, icon: Icon } = content

    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>
                    {column.charAt(0).toUpperCase() + column.slice(1).replace("_", " ")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>{renderCellContent(item, column)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // Render cell content with appropriate formatting
  const renderCellContent = (item, column) => {
    const value = item[column]

    if (column === "status") {
      if (value === "expired" || value === "critical") {
        return <Badge variant="destructive">{value}</Badge>
      } else if (value === "expiring" || value === "high") {
        return (
          <Badge variant="warning" className="bg-amber-500">
            {value}
          </Badge>
        )
      } else if (value === "valid" || value === "low") {
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {value}
          </Badge>
        )
      } else {
        return value
      }
    }

    if (column === "severity") {
      if (value === "critical") {
        return <Badge variant="destructive">Critical</Badge>
      } else if (value === "high") {
        return (
          <Badge variant="warning" className="bg-amber-500">
            High
          </Badge>
        )
      } else if (value === "medium") {
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Medium
          </Badge>
        )
      } else if (value === "low") {
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Low
          </Badge>
        )
      } else {
        return value
      }
    }

    if (column === "vulnerabilities" && typeof value === "number") {
      if (value > 0) {
        return <Badge variant="destructive">{value}</Badge>
      } else {
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {value}
          </Badge>
        )
      }
    }

    if (column === "languages" && Array.isArray(value)) {
      return value.join(", ")
    }

    return value
  }

  return (
    <div className="container max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Query Assistant</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Ask questions about your cryptographic assets using natural language
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-140px)] flex flex-col">
            <CardHeader>
              <CardTitle>Chat with AI Assistant</CardTitle>
              <CardDescription>
                Ask questions about your cryptographic assets and get AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto pb-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex max-w-[90%] ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                          : "bg-slate-100 dark:bg-slate-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                      } p-3`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 mr-2 shrink-0">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>
                            <BrainCircuit className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="overflow-x-auto w-full">
                        {message.type === "text" ? (
                          <p className="whitespace-pre-line">{message.content}</p>
                        ) : message.type === "table" ? (
                          renderTableContent(message.content)
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>
                            <BrainCircuit className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex space-x-1">
                          <div
                            className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Ask about cryptographic assets, certificates, keys, or vulnerabilities..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Example Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setInput("Display all cryptographic assets for application ID 123345")}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  Display all cryptographic assets for application ID 123345
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setInput("Show me all expired certificates")}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  Show me all expired certificates
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setInput("List all vulnerable libraries")}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  List all vulnerable libraries
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setInput("Show all critical vulnerabilities")}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  Show all critical vulnerabilities
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Applications</span>
                  </div>
                  <span className="font-medium">{apps.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-500 mr-2" />
                    <span>Certificates</span>
                  </div>
                  <span className="font-medium">{certificates.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 text-purple-500 mr-2" />
                    <span>Cryptographic Libraries</span>
                  </div>
                  <span className="font-medium">{libraries.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Server className="h-5 w-5 text-slate-500 mr-2" />
                    <span>Hosts/Sources</span>
                  </div>
                  <span className="font-medium">{hosts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span>Vulnerabilities</span>
                  </div>
                  <span className="font-medium">{vulnerabilities.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
              <CardDescription>Help us improve the AI assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful
                </Button>
                <Button variant="outline" size="sm">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Not Helpful
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
