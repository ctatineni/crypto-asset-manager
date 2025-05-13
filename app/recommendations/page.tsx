"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  Info,
  RefreshCw,
  Search,
  Shield,
  Terminal,
  Wrench,
} from "lucide-react"

// Mock data for recommendations
const recommendations = [
  {
    id: "rec-1",
    title: "Rotate expired certificates in Payment Gateway",
    description: "3 SSL certificates have expired in the Payment Gateway application and need immediate rotation",
    impact: "critical",
    effort: "medium",
    status: "open",
    type: "certificate",
    affectedAssets: 3,
    affectedApps: ["Payment Gateway"],
    remediation: "Generate new SSL certificates and deploy them to the affected hosts",
    estimatedTime: "2 hours",
    benefits: "Prevent service disruption and security vulnerabilities",
    createdAt: "2023-05-05T10:30:00Z",
  },
  {
    id: "rec-2",
    title: "Replace weak 1024-bit RSA keys with 2048-bit or stronger",
    description: "2,341 encryption keys are using 1024-bit RSA, which is now considered cryptographically weak",
    impact: "high",
    effort: "high",
    status: "open",
    type: "encryption",
    affectedAssets: 2341,
    affectedApps: ["Payment Gateway", "User Authentication Service", "Data Analytics Platform"],
    remediation: "Generate new 2048-bit RSA or ECDSA keys and replace the weak keys",
    estimatedTime: "1-2 weeks",
    benefits: "Strengthen encryption security and compliance with standards",
    createdAt: "2023-05-04T14:15:00Z",
  },
  {
    id: "rec-3",
    title: "Implement automated certificate monitoring",
    description: "Set up automated monitoring and alerting for certificate expiration",
    impact: "medium",
    effort: "low",
    status: "in_progress",
    type: "operational",
    affectedAssets: 0,
    affectedApps: ["All Applications"],
    remediation: "Deploy certificate monitoring tools and set up alerting 30/60/90 days before expiration",
    estimatedTime: "4 hours",
    benefits: "Prevent unexpected certificate expiration and service outages",
    createdAt: "2023-05-03T09:45:00Z",
  },
  {
    id: "rec-4",
    title: "Consolidate certificate authorities",
    description: "Currently using 5 different certificate authorities, which increases management complexity",
    impact: "low",
    effort: "medium",
    status: "planned",
    type: "operational",
    affectedAssets: 432,
    affectedApps: ["Multiple Applications"],
    remediation: "Standardize on 1-2 certificate authorities for all certificates",
    estimatedTime: "3-4 weeks",
    benefits: "Simplified certificate management, potentially reduced costs",
    createdAt: "2023-05-02T16:20:00Z",
  },
  {
    id: "rec-5",
    title: "Update outdated cryptographic libraries",
    description: "Multiple applications are using outdated versions of OpenSSL with known vulnerabilities",
    impact: "critical",
    effort: "high",
    status: "open",
    type: "library",
    affectedAssets: 1245,
    affectedApps: ["Payment Gateway", "Content Management System", "Customer Support Portal"],
    remediation: "Update OpenSSL to the latest version across all affected systems",
    estimatedTime: "1-3 weeks",
    benefits: "Patch known vulnerabilities and improve security posture",
    createdAt: "2023-05-01T11:10:00Z",
  },
  {
    id: "rec-6",
    title: "Implement key rotation policy",
    description: "87% of encryption keys have not been rotated in over 180 days",
    impact: "high",
    effort: "medium",
    status: "open",
    type: "policy",
    affectedAssets: 82150,
    affectedApps: ["All Applications"],
    remediation: "Define and implement automated key rotation policies based on key type and usage",
    estimatedTime: "2-3 weeks",
    benefits: "Reduced risk of key compromise and improved compliance",
    createdAt: "2023-04-30T13:25:00Z",
  },
]

// Simple statistics based on recommendations
const stats = {
  total: recommendations.length,
  critical: recommendations.filter((r) => r.impact === "critical").length,
  high: recommendations.filter((r) => r.impact === "high").length,
  medium: recommendations.filter((r) => r.impact === "medium").length,
  low: recommendations.filter((r) => r.impact === "low").length,
  open: recommendations.filter((r) => r.status === "open").length,
  inProgress: recommendations.filter((r) => r.status === "in_progress").length,
  planned: recommendations.filter((r) => r.status === "planned").length,
  completed: 0,
  totalAffectedAssets: recommendations.reduce((sum, r) => sum + r.affectedAssets, 0),
}

export default function RecommendationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImpact, setSelectedImpact] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedRecommendation, setSelectedRecommendation] = useState<(typeof recommendations)[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredRecommendations = recommendations.filter((rec) => {
    // Apply search filter
    const matchesSearch =
      !searchQuery ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply impact filter
    const matchesImpact = selectedImpact === "all" || rec.impact === selectedImpact

    // Apply status filter
    const matchesStatus = selectedStatus === "all" || rec.status === selectedStatus

    // Apply type filter
    const matchesType = selectedType === "all" || rec.type === selectedType

    return matchesSearch && matchesImpact && matchesStatus && matchesType
  })

  const openRecommendationDetail = (recommendation: (typeof recommendations)[0]) => {
    setSelectedRecommendation(recommendation)
    setIsDetailOpen(true)
  }

  // Helper function to render impact badges
  const renderImpactBadge = (impact: string) => {
    switch (impact) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-500">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge className="bg-green-500">Low</Badge>
      default:
        return <Badge>{impact}</Badge>
    }
  }

  // Helper function to render status badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="text-red-500 border-red-200">
            Open
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="text-blue-500 border-blue-200">
            In Progress
          </Badge>
        )
      case "planned":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-200">
            Planned
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-green-500 border-green-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Helper function to render type badges
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "certificate":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Certificate
          </Badge>
        )
      case "encryption":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Encryption
          </Badge>
        )
      case "operational":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Operational
          </Badge>
        )
      case "library":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
            Library
          </Badge>
        )
      case "policy":
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Policy
          </Badge>
        )
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  // Helper function to render effort badges
  const renderEffortBadge = (effort: string) => {
    switch (effort) {
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            Low Effort
          </Badge>
        )
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
          >
            Medium Effort
          </Badge>
        )
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
          >
            High Effort
          </Badge>
        )
      default:
        return <Badge variant="outline">{effort} Effort</Badge>
    }
  }

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI-Driven Recommendations</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Optimize your cryptographic assets with AI-generated recommendations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-1 h-4 w-4" />
            Refresh Analysis
          </Button>
          <Button asChild>
            <Link href="/remediation">
              <Wrench className="mr-1 h-4 w-4" />
              Remediation Hub
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Total Recommendations</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <Info className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-slate-500 mb-1">Completion Status</div>
              <Progress
                value={((stats.inProgress + stats.planned + stats.completed) / stats.total) * 100}
                className="h-2"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>
                  {Math.round(((stats.inProgress + stats.planned + stats.completed) / stats.total) * 100)}% Addressed
                </span>
                <span>{stats.open} Open</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Critical Issues</p>
                <p className="text-2xl font-bold mt-1">{stats.critical}</p>
              </div>
              <div className="p-2 rounded-full bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-xs py-1 h-8" size="sm">
                Address Critical Issues
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Affected Assets</p>
                <p className="text-2xl font-bold mt-1">{stats.totalAffectedAssets.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <Badge variant="outline" className="text-amber-500 border-amber-200 dark:border-amber-800">
                Most Common: Keys (87%)
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Projected Savings</p>
                <p className="text-2xl font-bold mt-1 text-green-600">$243,500</p>
              </div>
              <div className="p-2 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <Check className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              <Badge variant="outline" className="text-green-500 border-green-200 dark:border-green-800">
                Risk Reduction: 47%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search recommendations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center">
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Impact
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Tabs value={selectedImpact} onValueChange={setSelectedImpact} className="ml-2">
                  <TabsList>
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="critical" className="text-xs">
                      Critical
                    </TabsTrigger>
                    <TabsTrigger value="high" className="text-xs">
                      High
                    </TabsTrigger>
                    <TabsTrigger value="medium" className="text-xs">
                      Medium
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center">
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="ml-2">
                  <TabsList>
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="open" className="text-xs">
                      Open
                    </TabsTrigger>
                    <TabsTrigger value="in_progress" className="text-xs">
                      In Progress
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Table */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Recommendations</CardTitle>
          <CardDescription>
            {filteredRecommendations.length} recommendations based on analysis of your cryptographic assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Impact</TableHead>
                <TableHead className="w-[40%]">Recommendation</TableHead>
                <TableHead>Affected Assets</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effort</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecommendations.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>{renderImpactBadge(rec.impact)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{rec.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{rec.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{rec.affectedAssets.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">
                      {rec.affectedApps.length === 1 ? rec.affectedApps[0] : `${rec.affectedApps.length} Applications`}
                    </div>
                  </TableCell>
                  <TableCell>{renderTypeBadge(rec.type)}</TableCell>
                  <TableCell>{renderStatusBadge(rec.status)}</TableCell>
                  <TableCell>{renderEffortBadge(rec.effort)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => openRecommendationDetail(rec)}
                    >
                      Details
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredRecommendations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                    <h3 className="text-lg font-medium">No Recommendations Found</h3>
                    <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Recommendation Detail Dialog */}
          {selectedRecommendation && (
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {renderImpactBadge(selectedRecommendation.impact)}
                    <span>{selectedRecommendation.title}</span>
                  </DialogTitle>
                  <DialogDescription>{selectedRecommendation.description}</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Status</div>
                    <div>{renderStatusBadge(selectedRecommendation.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Type</div>
                    <div>{renderTypeBadge(selectedRecommendation.type)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Effort Required</div>
                    <div>{renderEffortBadge(selectedRecommendation.effort)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Affected Assets</h3>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                      <div className="font-medium">{selectedRecommendation.affectedAssets.toLocaleString()} Assets</div>
                      <div className="mt-2 space-y-1">
                        {selectedRecommendation.affectedApps.map((app, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            {app}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Implementation Details</h3>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                      <div className="flex items-center text-sm mb-2">
                        <Clock className="h-4 w-4 mr-1 text-slate-500" />
                        <span>Estimated time: {selectedRecommendation.estimatedTime}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Benefits: </span>
                        {selectedRecommendation.benefits}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Recommended Remediation</h3>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-sm">
                    {selectedRecommendation.remediation}
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="ghost">
                    <Terminal className="mr-1 h-4 w-4" />
                    Generate Script
                  </Button>

                  {selectedRecommendation.status === "open" ? (
                    <>
                      <Button variant="outline">
                        <Clock className="mr-1 h-4 w-4" />
                        Schedule
                      </Button>
                      <Button>
                        <Wrench className="mr-1 h-4 w-4" />
                        Start Remediation
                      </Button>
                    </>
                  ) : selectedRecommendation.status === "in_progress" ? (
                    <Button>
                      <Check className="mr-1 h-4 w-4" />
                      Mark as Complete
                    </Button>
                  ) : (
                    <Button>View Progress</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
