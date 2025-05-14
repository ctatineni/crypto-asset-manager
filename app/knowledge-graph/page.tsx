"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  RefreshCw,
  Shield,
  Key,
  Package,
  Code,
  Server,
  HardDrive,
  Info,
  X,
  Plus,
  Minus,
  Layers,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { apps, libraries, hosts, vulnerabilities } from "@/lib/mock-data"

// Mock data for certificates and keys
const certificates = [
  { id: "cert-1", name: "api.example.com", type: "SSL/TLS", expiry: "2023-06-15", status: "expired", risk: "high" },
  { id: "cert-2", name: "payment.example.com", type: "SSL/TLS", expiry: "2023-12-30", status: "valid", risk: "low" },
  { id: "cert-3", name: "auth.example.com", type: "SSL/TLS", expiry: "2024-03-22", status: "valid", risk: "low" },
  { id: "cert-4", name: "admin.example.com", type: "SSL/TLS", expiry: "2023-08-10", status: "valid", risk: "medium" },
  { id: "cert-5", name: "data.example.com", type: "SSL/TLS", expiry: "2023-05-01", status: "expired", risk: "high" },
]

const keys = [
  { id: "key-1", name: "API Auth Key", type: "RSA", size: "2048-bit", algorithm: "RSA-2048", risk: "medium" },
  { id: "key-2", name: "Payment Processing Key", type: "RSA", size: "4096-bit", algorithm: "RSA-4096", risk: "low" },
  { id: "key-3", name: "Session Encryption Key", type: "AES", size: "256-bit", algorithm: "AES-256", risk: "low" },
  { id: "key-4", name: "Database Encryption Key", type: "AES", size: "128-bit", algorithm: "AES-128", risk: "high" },
  { id: "key-5", name: "JWT Signing Key", type: "ECDSA", size: "256-bit", algorithm: "ECDSA-P256", risk: "medium" },
]

const languages = [
  { id: "lang-1", name: "Java", version: "17" },
  { id: "lang-2", name: "Python", version: "3.11" },
  { id: "lang-3", name: "C++", version: "C++20" },
  { id: "lang-4", name: "JavaScript", version: "ES2022" },
  { id: "lang-5", name: "Go", version: "1.20" },
]

// Define relationships between entities
const relationships = [
  // App to Certificate relationships
  { source: "app-1", target: "cert-1", type: "uses" },
  { source: "app-1", target: "cert-2", type: "uses" },
  { source: "app-2", target: "cert-3", type: "uses" },
  { source: "app-3", target: "cert-1", type: "uses" }, // Shared certificate
  { source: "app-4", target: "cert-4", type: "uses" },
  { source: "app-5", target: "cert-5", type: "uses" },
  { source: "app-6", target: "cert-3", type: "uses" }, // Shared certificate

  // App to Key relationships
  { source: "app-1", target: "key-1", type: "uses" },
  { source: "app-1", target: "key-2", type: "uses" },
  { source: "app-2", target: "key-3", type: "uses" },
  { source: "app-3", target: "key-1", type: "uses" }, // Shared key
  { source: "app-4", target: "key-4", type: "uses" },
  { source: "app-5", target: "key-5", type: "uses" },
  { source: "app-6", target: "key-3", type: "uses" }, // Shared key

  // App to Library relationships
  { source: "app-1", target: "lib-1", type: "uses" },
  { source: "app-2", target: "lib-2", type: "uses" },
  { source: "app-3", target: "lib-1", type: "uses" }, // Shared library
  { source: "app-4", target: "lib-3", type: "uses" },
  { source: "app-5", target: "lib-1", type: "uses" }, // Shared library
  { source: "app-6", target: "lib-2", type: "uses" }, // Shared library

  // App to Host relationships
  { source: "app-1", target: "host-1", type: "deployed_on" },
  { source: "app-2", target: "host-2", type: "deployed_on" },
  { source: "app-3", target: "host-3", type: "deployed_on" },
  { source: "app-4", target: "host-2", type: "deployed_on" }, // Shared host
  { source: "app-5", target: "host-4", type: "deployed_on" },
  { source: "app-6", target: "host-5", type: "deployed_on" },

  // App to Language relationships
  { source: "app-1", target: "lang-3", type: "written_in" },
  { source: "app-2", target: "lang-1", type: "written_in" },
  { source: "app-3", target: "lang-2", type: "written_in" },
  { source: "app-4", target: "lang-4", type: "written_in" },
  { source: "app-5", target: "lang-3", type: "written_in" }, // Shared language
  { source: "app-6", target: "lang-4", type: "written_in" }, // Shared language

  // Host to Certificate relationships
  { source: "host-1", target: "cert-1", type: "stores" },
  { source: "host-1", target: "cert-2", type: "stores" },
  { source: "host-2", target: "cert-3", type: "stores" },
  { source: "host-3", target: "cert-1", type: "stores" }, // Shared certificate
  { source: "host-4", target: "cert-4", type: "stores" },
  { source: "host-5", target: "cert-5", type: "stores" },

  // Host to Key relationships
  { source: "host-1", target: "key-1", type: "stores" },
  { source: "host-1", target: "key-2", type: "stores" },
  { source: "host-2", target: "key-3", type: "stores" },
  { source: "host-3", target: "key-1", type: "stores" }, // Shared key
  { source: "host-4", target: "key-4", type: "stores" },
  { source: "host-5", target: "key-5", type: "stores" },

  // Library to Language relationships
  { source: "lib-1", target: "lang-3", type: "implemented_in" },
  { source: "lib-2", target: "lang-1", type: "implemented_in" },
  { source: "lib-3", target: "lang-2", type: "implemented_in" },
  { source: "lib-4", target: "lang-4", type: "implemented_in" },
  { source: "lib-5", target: "lang-5", type: "implemented_in" },

  // Vulnerability to App relationships
  { source: "vuln-1", target: "app-1", type: "affects" },
  { source: "vuln-1", target: "app-3", type: "affects" }, // Shared vulnerability
  { source: "vuln-2", target: "app-2", type: "affects" },
  { source: "vuln-2", target: "app-6", type: "affects" }, // Shared vulnerability
  { source: "vuln-3", target: "app-1", type: "affects" },
  { source: "vuln-3", target: "app-4", type: "affects" }, // Shared vulnerability
  { source: "vuln-4", target: "app-2", type: "affects" },
  { source: "vuln-4", target: "app-5", type: "affects" }, // Shared vulnerability
  { source: "vuln-5", target: "app-3", type: "affects" },
  { source: "vuln-5", target: "app-5", type: "affects" }, // Shared vulnerability
  { source: "vuln-6", target: "app-1", type: "affects" },
  { source: "vuln-6", target: "app-3", type: "affects" }, // Shared vulnerability
  { source: "vuln-6", target: "app-5", type: "affects" }, // Shared vulnerability
]

// Combine all entities into a single array for the graph
const allEntities = [
  ...apps.map((app) => ({
    id: app.id,
    label: app.name,
    type: "application",
    risk: app.risk_score > 80 ? "high" : app.risk_score > 60 ? "medium" : "low",
  })),
  ...certificates.map((cert) => ({
    id: cert.id,
    label: cert.name,
    type: "certificate",
    risk: cert.risk,
    expiry: cert.expiry,
    status: cert.status,
  })),
  ...keys.map((key) => ({ id: key.id, label: key.name, type: "key", risk: key.risk, algorithm: key.algorithm })),
  ...libraries.map((lib) => ({
    id: lib.id,
    label: lib.name,
    type: "library",
    risk: lib.vulnerabilities > 3 ? "high" : lib.vulnerabilities > 1 ? "medium" : "low",
    version: lib.version,
  })),
  ...languages.map((lang) => ({ id: lang.id, label: lang.name, type: "language", version: lang.version })),
  ...hosts.map((host) => ({ id: host.id, label: host.name, type: "host", os: host.os })),
  ...vulnerabilities.map((vuln) => ({ id: vuln.id, label: vuln.name, type: "vulnerability", severity: vuln.severity })),
]

export default function KnowledgeGraph() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"graph" | "table" | "shared">("graph")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [filterType, setFilterType] = useState<string>("all")
  const [sharedAssetType, setSharedAssetType] = useState<string>("certificate")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // In a real implementation, we would render the graph using a library like D3.js or vis.js
    // For this mockup, we'll just draw a simple representation on the canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        drawMockGraph(ctx)
      }
    }
  }, [zoomLevel, filterType, selectedEntity])

  const drawMockGraph = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set scale based on zoom level
    ctx.save()
    ctx.scale(zoomLevel, zoomLevel)

    // Draw nodes
    const nodeRadius = 20
    const nodePositions: Record<string, { x: number; y: number }> = {}

    // Position nodes in a circular layout
    const centerX = width / (2 * zoomLevel)
    const centerY = height / (2 * zoomLevel)
    const radius = Math.min(centerX, centerY) * 0.7

    // Filter entities based on the selected filter
    const filteredEntities = allEntities.filter(
      (entity) =>
        (filterType === "all" || entity.type === filterType) &&
        (searchQuery === "" || entity.label.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    // If an entity is selected, only show it and its direct connections
    let visibleEntityIds = filteredEntities.map((e) => e.id)
    if (selectedEntity) {
      const connectedIds = relationships
        .filter((rel) => rel.source === selectedEntity.id || rel.target === selectedEntity.id)
        .flatMap((rel) => [rel.source, rel.target])

      visibleEntityIds = [...new Set([selectedEntity.id, ...connectedIds])]
    }

    const visibleEntities = allEntities.filter((entity) => visibleEntityIds.includes(entity.id))

    // Position nodes
    visibleEntities.forEach((entity, i) => {
      const angle = (i / visibleEntities.length) * 2 * Math.PI
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      nodePositions[entity.id] = { x, y }

      // Draw node
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI)

      // Color based on type
      switch (entity.type) {
        case "application":
          ctx.fillStyle = "#3b82f6" // blue
          break
        case "certificate":
          ctx.fillStyle = "#22c55e" // green
          break
        case "key":
          ctx.fillStyle = "#8b5cf6" // purple
          break
        case "library":
          ctx.fillStyle = "#f97316" // orange
          break
        case "language":
          ctx.fillStyle = "#ec4899" // pink
          break
        case "host":
          ctx.fillStyle = "#64748b" // slate
          break
        case "vulnerability":
          ctx.fillStyle = "#ef4444" // red
          break
        default:
          ctx.fillStyle = "#94a3b8" // gray
      }

      // Highlight selected entity
      if (selectedEntity && entity.id === selectedEntity.id) {
        ctx.lineWidth = 3
        ctx.strokeStyle = "#fbbf24" // yellow
        ctx.stroke()
      }

      ctx.fill()

      // Draw label
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = "10px Arial"
      ctx.fillText(entity.label.substring(0, 8) + (entity.label.length > 8 ? "..." : ""), x, y)
    })

    // Draw edges
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1

    relationships.forEach((rel) => {
      // Only draw if both nodes are visible
      if (nodePositions[rel.source] && nodePositions[rel.target]) {
        const sourcePos = nodePositions[rel.source]
        const targetPos = nodePositions[rel.target]

        ctx.beginPath()
        ctx.moveTo(sourcePos.x, sourcePos.y)
        ctx.lineTo(targetPos.x, targetPos.y)

        // Highlight relationships for selected entity
        if (selectedEntity && (rel.source === selectedEntity.id || rel.target === selectedEntity.id)) {
          ctx.lineWidth = 2
          ctx.strokeStyle = "#fbbf24" // yellow
        } else {
          ctx.lineWidth = 1
          ctx.strokeStyle = "#94a3b8" // slate
        }

        ctx.stroke()
      }
    })

    ctx.restore()
  }

  const handleEntityClick = (entity: any) => {
    if (selectedEntity && selectedEntity.id === entity.id) {
      setSelectedEntity(null) // Deselect if already selected
    } else {
      setSelectedEntity(entity)
    }
  }

  // Get all entities of a specific type
  const getEntitiesByType = (type: string) => {
    return allEntities.filter(
      (entity) =>
        entity.type === type && (searchQuery === "" || entity.label.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  // Get entities that share the specified asset type
  const getSharedAssets = (assetType: string) => {
    // Find all relationships where the target is of the specified type
    const assetRelationships = relationships.filter((rel) => {
      const targetEntity = allEntities.find((e) => e.id === rel.target)
      return targetEntity && targetEntity.type === assetType
    })

    // Group by target (asset) to find shared assets
    const assetUsage: Record<string, string[]> = {}
    assetRelationships.forEach((rel) => {
      if (!assetUsage[rel.target]) {
        assetUsage[rel.target] = []
      }
      assetUsage[rel.target].push(rel.source)
    })

    // Filter to only assets used by multiple entities
    const sharedAssets = Object.entries(assetUsage)
      .filter(([_, users]) => users.length > 1)
      .map(([assetId, userIds]) => {
        const asset = allEntities.find((e) => e.id === assetId)
        const users = userIds.map((userId) => allEntities.find((e) => e.id === userId))
        return { asset, users }
      })

    return sharedAssets
  }

  // Get related entities for the selected entity
  const getRelatedEntities = (entityId: string) => {
    const relatedLinks = relationships.filter((rel) => rel.source === entityId || rel.target === entityId)
    const relatedNodeIds = relatedLinks.map((link) => (link.source === entityId ? link.target : link.source))
    return allEntities.filter((entity) => relatedNodeIds.includes(entity.id))
  }

  // Get icon for entity type
  const getEntityIcon = (type: string) => {
    switch (type) {
      case "application":
        return <HardDrive className="h-5 w-5" />
      case "certificate":
        return <FileText className="h-5 w-5" />
      case "key":
        return <Key className="h-5 w-5" />
      case "library":
        return <Package className="h-5 w-5" />
      case "language":
        return <Code className="h-5 w-5" />
      case "host":
        return <Server className="h-5 w-5" />
      case "vulnerability":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  // Get color class for entity type
  const getEntityColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
      case "certificate":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      case "key":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
      case "library":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
      case "language":
        return "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800"
      case "host":
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800"
      case "vulnerability":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800"
    }
  }

  // Get color for risk level
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800"
    }
  }

  // Filter entities based on search and type filter
  const filteredEntities = allEntities.filter(
    (entity) =>
      (filterType === "all" || entity.type === filterType) &&
      (searchQuery === "" || entity.label.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (!isClient) {
    return null // Prevent hydration issues
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cryptographic Knowledge Graph</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Visualize relationships between applications, certificates, keys, libraries, and more
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setViewMode("graph")}
            className={viewMode === "graph" ? "bg-slate-100 dark:bg-slate-800" : ""}
          >
            <Network className="mr-1 h-4 w-4" />
            Graph View
          </Button>
          <Button
            variant="outline"
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-slate-100 dark:bg-slate-800" : ""}
          >
            <Layers className="mr-1 h-4 w-4" />
            Table View
          </Button>
          <Button
            variant="outline"
            onClick={() => setViewMode("shared")}
            className={viewMode === "shared" ? "bg-slate-100 dark:bg-slate-800" : ""}
          >
            <Shield className="mr-1 h-4 w-4" />
            Shared Assets
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Filters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filters & Controls</CardTitle>
            <CardDescription>Refine the knowledge graph visualization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search entities..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Entity Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="application">Applications</SelectItem>
                  <SelectItem value="certificate">Certificates</SelectItem>
                  <SelectItem value="key">Keys</SelectItem>
                  <SelectItem value="library">Libraries</SelectItem>
                  <SelectItem value="language">Languages</SelectItem>
                  <SelectItem value="host">Hosts</SelectItem>
                  <SelectItem value="vulnerability">Vulnerabilities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {viewMode === "shared" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Shared Asset Type</label>
                <Select value={sharedAssetType} onValueChange={setSharedAssetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Certificate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificate">Certificates</SelectItem>
                    <SelectItem value="key">Keys</SelectItem>
                    <SelectItem value="library">Libraries</SelectItem>
                    <SelectItem value="host">Hosts</SelectItem>
                    <SelectItem value="vulnerability">Vulnerabilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {viewMode === "graph" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Zoom Level</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Slider
                    value={[zoomLevel]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setZoomLevel(value[0])}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">Certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Libraries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                  <span className="text-sm">Languages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-500"></div>
                  <span className="text-sm">Hosts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">Vulnerabilities</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Relationship Types</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">uses</span> - App uses certificate/key/library
                </div>
                <div>
                  <span className="font-medium">written_in</span> - App written in language
                </div>
                <div>
                  <span className="font-medium">deployed_on</span> - App deployed on host
                </div>
                <div>
                  <span className="font-medium">implemented_in</span> - Library in language
                </div>
                <div>
                  <span className="font-medium">stores</span> - Host stores certificate/key
                </div>
                <div>
                  <span className="font-medium">affects</span> - Vulnerability affects app
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center panel - Graph or Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {viewMode === "graph" && "Knowledge Graph"}
                {viewMode === "table" && "Entity Table"}
                {viewMode === "shared" &&
                  `Shared ${sharedAssetType.charAt(0).toUpperCase() + sharedAssetType.slice(1)}s`}
              </CardTitle>
              <CardDescription>
                {viewMode === "graph" &&
                  `${filteredEntities.length} entities and ${relationships.length} relationships`}
                {viewMode === "table" && `${filteredEntities.length} entities`}
                {viewMode === "shared" && `Assets shared across multiple applications or hosts`}
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Download">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "graph" && (
              <div className="relative border rounded-md h-[600px] bg-slate-50 dark:bg-slate-900">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-full"
                  onClick={() => {
                    // In a real implementation, we would detect which node was clicked
                    // For this mockup, we'll just select a random node if none is selected
                    if (!selectedEntity) {
                      const randomNode = allEntities[Math.floor(Math.random() * allEntities.length)]
                      handleEntityClick(randomNode)
                    } else {
                      setSelectedEntity(null)
                    }
                  }}
                />
                <div className="absolute bottom-4 right-4 flex gap-1">
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(1)}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {viewMode === "table" && (
              <div className="border rounded-md overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-white dark:bg-slate-950">
                    <TableRow>
                      <TableHead>Entity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Relationships</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntities.map((entity) => {
                      const relationshipCount = relationships.filter(
                        (rel) => rel.source === entity.id || rel.target === entity.id,
                      ).length

                      return (
                        <TableRow key={entity.id} onClick={() => handleEntityClick(entity)} className="cursor-pointer">
                          <TableCell className="font-medium">{entity.label}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getEntityColor(entity.type)}>
                              {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {entity.risk && (
                              <Badge variant="outline" className={getRiskBadgeColor(entity.risk)}>
                                {entity.risk.charAt(0).toUpperCase() + entity.risk.slice(1)}
                              </Badge>
                            )}
                            {entity.severity && (
                              <Badge variant="outline" className={getRiskBadgeColor(entity.severity)}>
                                {entity.severity.charAt(0).toUpperCase() + entity.severity.slice(1)}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{relationshipCount}</TableCell>
                          <TableCell>
                            {entity.type === "certificate" && entity.expiry && (
                              <span className="text-sm">Expires: {entity.expiry}</span>
                            )}
                            {entity.type === "key" && entity.algorithm && (
                              <span className="text-sm">{entity.algorithm}</span>
                            )}
                            {entity.type === "library" && entity.version && (
                              <span className="text-sm">v{entity.version}</span>
                            )}
                            {entity.type === "host" && entity.os && <span className="text-sm">{entity.os}</span>}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" onClick={() => handleEntityClick(entity)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {viewMode === "shared" && (
              <div className="space-y-6">
                {getSharedAssets(sharedAssetType).map(({ asset, users }) => (
                  <Card key={asset?.id} className="overflow-hidden">
                    <CardHeader className={`${getEntityColor(sharedAssetType)} py-3`}>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(sharedAssetType)}
                        <CardTitle className="text-lg">{asset?.label}</CardTitle>
                      </div>
                      <CardDescription className="text-slate-700 dark:text-slate-300">
                        Shared across {users.length} {users.length === 1 ? "entity" : "entities"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Used By</h3>
                          <div className="space-y-2">
                            {users.map((user) => (
                              <div key={user?.id} className="flex items-center justify-between p-2 rounded-md border">
                                <div className="flex items-center gap-2">
                                  {getEntityIcon(user?.type || "")}
                                  <span className="text-sm font-medium">{user?.label}</span>
                                </div>
                                <Badge variant="outline" className={getEntityColor(user?.type || "")}>
                                  {user?.type?.charAt(0).toUpperCase() + user?.type?.slice(1)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Asset Details</h3>
                          <div className="space-y-2">
                            {asset?.type === "certificate" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Expiry:</span>
                                  <span className="text-sm font-medium">{asset.expiry}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Status:</span>
                                  <Badge variant={asset.status === "expired" ? "destructive" : "outline"}>
                                    {asset.status}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Risk:</span>
                                  <Badge variant="outline" className={getRiskBadgeColor(asset.risk || "")}>
                                    {asset.risk?.charAt(0).toUpperCase() + asset.risk?.slice(1)}
                                  </Badge>
                                </div>
                              </>
                            )}
                            {asset?.type === "key" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Algorithm:</span>
                                  <span className="text-sm font-medium">{asset.algorithm}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Risk:</span>
                                  <Badge variant="outline" className={getRiskBadgeColor(asset.risk || "")}>
                                    {asset.risk?.charAt(0).toUpperCase() + asset.risk?.slice(1)}
                                  </Badge>
                                </div>
                              </>
                            )}
                            {asset?.type === "library" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Version:</span>
                                  <span className="text-sm font-medium">{asset.version}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Risk:</span>
                                  <Badge variant="outline" className={getRiskBadgeColor(asset.risk || "")}>
                                    {asset.risk?.charAt(0).toUpperCase() + asset.risk?.slice(1)}
                                  </Badge>
                                </div>
                              </>
                            )}
                            {asset?.type === "vulnerability" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Severity:</span>
                                  <Badge variant="outline" className={getRiskBadgeColor(asset.severity || "")}>
                                    {asset.severity?.charAt(0).toUpperCase() + asset.severity?.slice(1)}
                                  </Badge>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getSharedAssets(sharedAssetType).length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Shield className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Shared Assets Found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                      There are no {sharedAssetType}s that are shared across multiple applications or hosts. This is
                      good from a security isolation perspective.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Entity details panel */}
      {selectedEntity && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${getEntityColor(selectedEntity.type)}`}>
                {getEntityIcon(selectedEntity.type)}
              </div>
              <div>
                <CardTitle>{selectedEntity.label}</CardTitle>
                <CardDescription>
                  {selectedEntity.type.charAt(0).toUpperCase() + selectedEntity.type.slice(1)} Details
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedEntity(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="relationships">Relationships</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Entity Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">ID:</span>
                        <span className="text-sm font-medium">{selectedEntity.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Type:</span>
                        <Badge variant="outline" className={getEntityColor(selectedEntity.type)}>
                          {selectedEntity.type.charAt(0).toUpperCase() + selectedEntity.type.slice(1)}
                        </Badge>
                      </div>
                      {selectedEntity.risk && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Risk Level:</span>
                          <Badge variant="outline" className={getRiskBadgeColor(selectedEntity.risk)}>
                            {selectedEntity.risk.charAt(0).toUpperCase() + selectedEntity.risk.slice(1)}
                          </Badge>
                        </div>
                      )}
                      {selectedEntity.severity && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Severity:</span>
                          <Badge variant="outline" className={getRiskBadgeColor(selectedEntity.severity)}>
                            {selectedEntity.severity.charAt(0).toUpperCase() + selectedEntity.severity.slice(1)}
                          </Badge>
                        </div>
                      )}
                      {selectedEntity.expiry && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Expiry Date:</span>
                          <span className="text-sm font-medium">{selectedEntity.expiry}</span>
                        </div>
                      )}
                      {selectedEntity.algorithm && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Algorithm:</span>
                          <span className="text-sm font-medium">{selectedEntity.algorithm}</span>
                        </div>
                      )}
                      {selectedEntity.version && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Version:</span>
                          <span className="text-sm font-medium">{selectedEntity.version}</span>
                        </div>
                      )}
                      {selectedEntity.os && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Operating System:</span>
                          <span className="text-sm font-medium">{selectedEntity.os}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Related Entities</h3>
                    <div className="space-y-2">
                      {getRelatedEntities(selectedEntity.id).map((entity) => (
                        <div key={entity.id} className="flex items-center justify-between p-2 rounded-md border">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${getEntityColor(entity.type)}`}>
                              {getEntityIcon(entity.type)}
                            </div>
                            <span className="text-sm font-medium">{entity.label}</span>
                          </div>
                          <Badge variant="outline" className={getEntityColor(entity.type)}>
                            {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="relationships">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Direction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relationships
                      .filter((rel) => rel.source === selectedEntity.id || rel.target === selectedEntity.id)
                      .map((rel, index) => {
                        const isSource = rel.source === selectedEntity.id
                        const relatedEntityId = isSource ? rel.target : rel.source
                        const relatedEntity = allEntities.find((node) => node.id === relatedEntityId)

                        if (!relatedEntity) return null

                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{relatedEntity.label}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getEntityColor(relatedEntity.type)}>
                                {relatedEntity.type.charAt(0).toUpperCase() + relatedEntity.type.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{rel.type}</TableCell>
                            <TableCell>{isSource ? "Outgoing" : "Incoming"}</TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="risk">
                <div className="space-y-4">
                  {selectedEntity.type === "application" && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Risk Factors</h3>
                        <div className="space-y-2">
                          {/* Show vulnerabilities affecting this application */}
                          {relationships
                            .filter((rel) => rel.target === selectedEntity.id && rel.source.startsWith("vuln-"))
                            .map((rel) => {
                              const vuln = vulnerabilities.find((v) => v.id === rel.source)
                              if (!vuln) return null

                              return (
                                <div key={vuln.id} className="p-3 border rounded-md">
                                  <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    <span className="font-medium">{vuln.name}</span>
                                    <Badge variant="outline" className={getRiskBadgeColor(vuln.severity)}>
                                      {vuln.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{vuln.description}</p>
                                </div>
                              )
                            })}

                          {/* Show expired certificates used by this application */}
                          {relationships
                            .filter((rel) => rel.source === selectedEntity.id && rel.target.startsWith("cert-"))
                            .map((rel) => {
                              const cert = certificates.find((c) => c.id === rel.target)
                              if (!cert || cert.status !== "expired") return null

                              return (
                                <div key={cert.id} className="p-3 border rounded-md">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FileText className="h-4 w-4 text-red-500" />
                                    <span className="font-medium">Expired Certificate: {cert.name}</span>
                                    <Badge variant="destructive">Expired</Badge>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    This certificate expired on {cert.expiry} and needs to be renewed immediately.
                                  </p>
                                </div>
                              )
                            })}

                          {/* Show outdated libraries used by this application */}
                          {relationships
                            .filter((rel) => rel.source === selectedEntity.id && rel.target.startsWith("lib-"))
                            .map((rel) => {
                              const lib = libraries.find((l) => l.id === rel.target)
                              if (!lib || lib.vulnerabilities === 0) return null

                              return (
                                <div key={lib.id} className="p-3 border rounded-md">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Package className="h-4 w-4 text-amber-500" />
                                    <span className="font-medium">Vulnerable Library: {lib.name}</span>
                                    <Badge variant="outline" className="bg-amber-100 text-amber-800">
                                      {lib.vulnerabilities}{" "}
                                      {lib.vulnerabilities === 1 ? "vulnerability" : "vulnerabilities"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Using version {lib.version} (latest: {lib.latest_version}). Update recommended.
                                  </p>
                                </div>
                              )
                            })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Remediation Recommendations</h3>
                        <div className="space-y-2">
                          <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Update Vulnerable Libraries</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Update all libraries to their latest versions to address known vulnerabilities.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Renew Expired Certificates</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Immediately renew all expired certificates and implement automated monitoring.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Implement Certificate Rotation</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Set up automated certificate rotation to prevent future expirations.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedEntity.type === "certificate" && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Certificate Risk Assessment</h3>
                        <div className="space-y-2">
                          {selectedEntity.status === "expired" && (
                            <div className="p-3 border rounded-md bg-red-50 dark:bg-red-900/20">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="font-medium">Expired Certificate</span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                This certificate expired on {selectedEntity.expiry}. All applications using this
                                certificate are at risk of connection failures and security warnings.
                              </p>
                            </div>
                          )}

                          {/* Show applications affected by this certificate */}
                          <div className="p-3 border rounded-md">
                            <div className="flex items-center gap-2 mb-1">
                              <HardDrive className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Applications Affected</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {relationships
                                .filter((rel) => rel.target === selectedEntity.id && rel.source.startsWith("app-"))
                                .map((rel) => {
                                  const app = apps.find((a) => a.id === rel.source)
                                  if (!app) return null

                                  return (
                                    <div key={app.id} className="flex items-center gap-2">
                                      <Badge variant="outline" className={getEntityColor("application")}>
                                        {app.name}
                                      </Badge>
                                    </div>
                                  )
                                })}
                            </div>
                          </div>

                          {/* Show hosts storing this certificate */}
                          <div className="p-3 border rounded-md">
                            <div className="flex items-center gap-2 mb-1">
                              <Server className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Hosts Storing This Certificate</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {relationships
                                .filter((rel) => rel.target === selectedEntity.id && rel.source.startsWith("host-"))
                                .map((rel) => {
                                  const host = hosts.find((h) => h.id === rel.source)
                                  if (!host) return null

                                  return (
                                    <div key={host.id} className="flex items-center gap-2">
                                      <Badge variant="outline" className={getEntityColor("host")}>
                                        {host.name}
                                      </Badge>
                                    </div>
                                  )
                                })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Remediation Recommendations</h3>
                        <div className="space-y-2">
                          {selectedEntity.status === "expired" && (
                            <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                              <div className="flex items-center gap-2 mb-1">
                                <Shield className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">Renew Certificate Immediately</span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Renew this certificate immediately to prevent service disruptions and security warnings.
                              </p>
                            </div>
                          )}

                          <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Implement Certificate Monitoring</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Set up automated monitoring to receive alerts before certificates expire.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Automate Certificate Management</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Implement a certificate management solution to automate the renewal process.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedEntity.type === "key" && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Key Risk Assessment</h3>
                        <div className="space-y-2">
                          {selectedEntity.algorithm?.includes("RSA-1024") && (
                            <div className="p-3 border rounded-md bg-red-50 dark:bg-red-900/20">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="font-medium">Weak Key Strength</span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                RSA-1024 is considered insecure by modern standards. Upgrade to at least RSA-2048.
                              </p>
                            </div>
                          )}

                          {/* Show applications using this key */}
                          <div className="p-3 border rounded-md">
                            <div className="flex items-center gap-2 mb-1">
                              <HardDrive className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Applications Using This Key</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {relationships
                                .filter((rel) => rel.target === selectedEntity.id && rel.source.startsWith("app-"))
                                .map((rel) => {
                                  const app = apps.find((a) => a.id === rel.source)
                                  if (!app) return null

                                  return (
                                    <div key={app.id} className="flex items-center gap-2">
                                      <Badge variant="outline" className={getEntityColor("application")}>
                                        {app.name}
                                      </Badge>
                                    </div>
                                  )
                                })}
                            </div>
                          </div>

                          {/* Show hosts storing this key */}
                          <div className="p-3 border rounded-md">
                            <div className="flex items-center gap-2 mb-1">
                              <Server className="h-4 w-4 text-slate-500" />
                              <span className="font-medium">Hosts Storing This Key</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              {relationships
                                .filter((rel) => rel.target === selectedEntity.id && rel.source.startsWith("host-"))
                                .map((rel) => {
                                  const host = hosts.find((h) => h.id === rel.source)
                                  if (!host) return null

                                  return (
                                    <div key={host.id} className="flex items-center gap-2">
                                      <Badge variant="outline" className={getEntityColor("host")}>
                                        {host.name}
                                      </Badge>
                                    </div>
                                  )
                                })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Remediation Recommendations</h3>
                        <div className="space-y-2">
                          {selectedEntity.algorithm?.includes("RSA-1024") && (
                            <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                              <div className="flex items-center gap-2 mb-1">
                                <Shield className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">Upgrade Key Strength</span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Replace this key with at least RSA-2048 or consider using ECC for better performance.
                              </p>
                            </div>
                          )}

                          <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Implement Key Rotation</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Set up regular key rotation to limit the impact of potential key compromise.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">Secure Key Storage</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Ensure keys are stored in secure key management systems rather than in code or config
                              files.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Asset Sharing Analysis</CardTitle>
          <CardDescription>Summary of shared cryptographic assets across applications and hosts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-center">
              <FileText className="h-6 w-6 mx-auto text-green-600 dark:text-green-400 mb-2" />
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {getSharedAssets("certificate").length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Shared Certificates</div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md text-center">
              <Key className="h-6 w-6 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {getSharedAssets("key").length}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Shared Keys</div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-md text-center">
              <Package className="h-6 w-6 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {getSharedAssets("library").length}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Shared Libraries</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-md text-center">
              <Server className="h-6 w-6 mx-auto text-slate-600 dark:text-slate-400 mb-2" />
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {getSharedAssets("host").length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Shared Hosts</div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md text-center">
              <AlertTriangle className="h-6 w-6 mx-auto text-red-600 dark:text-red-400 mb-2" />
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {getSharedAssets("vulnerability").length}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">Shared Vulnerabilities</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Security Insights</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Shared Certificate Risk</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {getSharedAssets("certificate").length} certificates are shared across multiple applications. If
                      one of these certificates is compromised, multiple applications could be affected.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Shared Key Risk</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {getSharedAssets("key").length} cryptographic keys are shared across multiple applications. This
                      increases the impact of a potential key compromise.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Shared Host Risk</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {getSharedAssets("host").length} hosts run multiple applications. If a host is compromised,
                      multiple applications could be affected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
