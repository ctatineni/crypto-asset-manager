"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, CheckCircle, Filter, Network, Search, Share2, Shield, XCircle } from "lucide-react"
import { apps, hosts, libraries, vulnerabilities } from "@/lib/mock-data"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Use the existing hosts data to create certificate data
const certificates = [
  {
    id: "cert-1",
    name: "api.example.com",
    host: "prod-api-01",
    issuer: "DigiCert",
    subject: "api.example.com",
    validFrom: "2023-01-15",
    validTo: "2023-06-15",
    expiryDate: "2023-06-15",
    status: "expiring",
    applications: ["app-1", "app-2"],
    hosts: ["host-1"],
    isExpired: false,
  },
  {
    id: "cert-2",
    name: "web.example.com",
    host: "prod-web-01",
    issuer: "Let's Encrypt",
    subject: "web.example.com",
    validFrom: "2023-05-22",
    validTo: "2023-11-22",
    expiryDate: "2023-11-22",
    status: "valid",
    applications: ["app-4"],
    hosts: ["host-2"],
    isExpired: false,
  },
  {
    id: "cert-3",
    name: "auth.example.com",
    host: "prod-api-01",
    issuer: "DigiCert",
    subject: "auth.example.com",
    validFrom: "2022-11-10",
    validTo: "2023-05-01",
    expiryDate: "2023-05-01",
    status: "expired",
    applications: ["app-2"],
    hosts: ["host-1"],
    isExpired: true,
  },
  {
    id: "cert-4",
    name: "cms.example.com",
    host: "prod-web-01",
    issuer: "GeoTrust",
    subject: "cms.example.com",
    validFrom: "2023-03-15",
    validTo: "2024-03-15",
    expiryDate: "2024-03-15",
    status: "valid",
    applications: ["app-4"],
    hosts: ["host-2"],
    isExpired: false,
  },
  {
    id: "cert-5",
    name: "data.example.com",
    host: "analytics-server",
    issuer: "Let's Encrypt",
    subject: "data.example.com",
    validFrom: "2023-02-01",
    validTo: "2023-05-01",
    expiryDate: "2023-05-01",
    status: "expired",
    applications: ["app-3"],
    hosts: ["host-3"],
    isExpired: true,
  },
]

// Define entity types for the knowledge graph
const entityTypes = {
  APPLICATION: "application",
  HOST: "host",
  CERTIFICATE: "certificate",
  LIBRARY: "library",
  VULNERABILITY: "vulnerability",
}

// Define relationship types
const relationshipTypes = {
  USES: "uses",
  HOSTS: "hosts",
  AFFECTS: "affects",
  DEPENDS_ON: "depends_on",
  SHARES: "shares",
}

// Generate graph data from our mock data
const generateGraphData = () => {
  const nodes = []
  const links = []

  // Add applications as nodes
  apps.forEach((app) => {
    nodes.push({
      id: `app-${app.id}`,
      name: app.name,
      type: entityTypes.APPLICATION,
      data: app,
    })
  })

  // Add hosts as nodes
  hosts.forEach((host) => {
    nodes.push({
      id: `host-${host.id}`,
      name: host.name || host.hostname,
      type: entityTypes.HOST,
      data: host,
    })

    // Link hosts to applications
    // Use apps property from the host object
    if (host.apps && Array.isArray(host.apps)) {
      host.apps.forEach((appId) => {
        links.push({
          source: `host-${host.id}`,
          target: `app-${appId}`,
          type: relationshipTypes.HOSTS,
        })
      })
    }
  })

  // Add certificates as nodes
  certificates.forEach((cert) => {
    nodes.push({
      id: `cert-${cert.id}`,
      name: cert.name,
      type: entityTypes.CERTIFICATE,
      data: cert,
    })

    // Link certificates to applications
    if (cert.applications && Array.isArray(cert.applications)) {
      cert.applications.forEach((appId) => {
        links.push({
          source: `app-${appId}`,
          target: `cert-${cert.id}`,
          type: relationshipTypes.USES,
        })
      })
    }

    // Link certificates to hosts
    if (cert.hosts && Array.isArray(cert.hosts)) {
      cert.hosts.forEach((hostId) => {
        links.push({
          source: `host-${hostId}`,
          target: `cert-${cert.id}`,
          type: relationshipTypes.USES,
        })
      })
    }
  })

  // Add libraries as nodes
  libraries.forEach((lib) => {
    nodes.push({
      id: `lib-${lib.id}`,
      name: lib.name,
      type: entityTypes.LIBRARY,
      data: lib,
    })

    // Link libraries to applications
    // Use apps_using property from the library object
    if (lib.apps_using && Array.isArray(lib.apps_using)) {
      lib.apps_using.forEach((appId) => {
        links.push({
          source: `app-${appId}`,
          target: `lib-${lib.id}`,
          type: relationshipTypes.DEPENDS_ON,
        })
      })
    }
  })

  // Add vulnerabilities as nodes
  vulnerabilities.forEach((vuln) => {
    nodes.push({
      id: `vuln-${vuln.id}`,
      name: vuln.name,
      type: entityTypes.VULNERABILITY,
      data: vuln,
    })

    // Link vulnerabilities to libraries
    if (vuln.affectedLibraries && Array.isArray(vuln.affectedLibraries)) {
      vuln.affectedLibraries.forEach((libId) => {
        links.push({
          source: `vuln-${vuln.id}`,
          target: `lib-${libId}`,
          type: relationshipTypes.AFFECTS,
        })
      })
    }
  })

  return { nodes, links }
}

// Find shared assets (certificates, libraries) across applications and hosts
const findSharedAssets = (graphData) => {
  const sharedAssets = {
    certificates: [],
    libraries: [],
  }

  // Find certificates used by multiple applications or hosts
  const certUsage = {}
  graphData.links.forEach((link) => {
    if (link.type === relationshipTypes.USES && link.target.startsWith("cert-")) {
      if (!certUsage[link.target]) {
        certUsage[link.target] = {
          certId: link.target,
          applications: [],
          hosts: [],
        }
      }

      if (link.source.startsWith("app-")) {
        certUsage[link.target].applications.push(link.source)
      } else if (link.source.startsWith("host-")) {
        certUsage[link.target].hosts.push(link.source)
      }
    }
  })

  // Filter to only include certificates used by multiple entities
  Object.values(certUsage).forEach((usage) => {
    if (usage.applications.length > 1 || usage.hosts.length > 1) {
      const certNode = graphData.nodes.find((node) => node.id === usage.certId)
      if (certNode) {
        sharedAssets.certificates.push({
          ...certNode,
          usedBy: {
            applications: usage.applications
              .map((appId) => {
                const appNode = graphData.nodes.find((node) => node.id === appId)
                return appNode ? appNode.data : null
              })
              .filter(Boolean),
            hosts: usage.hosts
              .map((hostId) => {
                const hostNode = graphData.nodes.find((node) => node.id === hostId)
                return hostNode ? hostNode.data : null
              })
              .filter(Boolean),
          },
        })
      }
    }
  })

  // Find libraries used by multiple applications
  const libUsage = {}
  graphData.links.forEach((link) => {
    if (link.type === relationshipTypes.DEPENDS_ON && link.target.startsWith("lib-")) {
      if (!libUsage[link.target]) {
        libUsage[link.target] = {
          libId: link.target,
          applications: [],
        }
      }

      if (link.source.startsWith("app-")) {
        libUsage[link.target].applications.push(link.source)
      }
    }
  })

  // Filter to only include libraries used by multiple applications
  Object.values(libUsage).forEach((usage) => {
    if (usage.applications.length > 1) {
      const libNode = graphData.nodes.find((node) => node.id === usage.libId)
      if (libNode) {
        sharedAssets.libraries.push({
          ...libNode,
          usedBy: {
            applications: usage.applications
              .map((appId) => {
                const appNode = graphData.nodes.find((node) => node.id === appId)
                return appNode ? appNode.data : null
              })
              .filter(Boolean),
          },
        })
      }
    }
  })

  return sharedAssets
}

export default function KnowledgeGraph() {
  const [activeTab, setActiveTab] = useState("graph")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEntityTypes, setSelectedEntityTypes] = useState({
    [entityTypes.APPLICATION]: true,
    [entityTypes.HOST]: true,
    [entityTypes.CERTIFICATE]: true,
    [entityTypes.LIBRARY]: true,
    [entityTypes.VULNERABILITY]: true,
  })
  const [selectedNode, setSelectedNode] = useState(null)
  const [highlightNodes, setHighlightNodes] = useState(new Set())
  const [highlightLinks, setHighlightLinks] = useState(new Set())
  const [sharedAssetView, setSharedAssetView] = useState("all")

  // Add these state variables near the other useState declarations
  const [tableAssetType, setTableAssetType] = useState("certificates")
  const [tableSearchTerm, setTableSearchTerm] = useState("")

  // Generate graph data
  const graphData = useMemo(() => generateGraphData(), [])

  // Find shared assets
  const sharedAssets = useMemo(() => findSharedAssets(graphData), [graphData])

  // Filter nodes based on search term and selected entity types
  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter((node) => {
      const matchesSearch = searchTerm === "" || node.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedEntityTypes[node.type]
      return matchesSearch && matchesType
    })
  }, [graphData.nodes, searchTerm, selectedEntityTypes])

  // Filter links based on filtered nodes
  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((node) => node.id))
    return graphData.links.filter(
      (link) => nodeIds.has(link.source.id || link.source) && nodeIds.has(link.target.id || link.target),
    )
  }, [graphData.links, filteredNodes])

  // Filtered graph data
  const filteredGraphData = useMemo(
    () => ({
      nodes: filteredNodes,
      links: filteredLinks,
    }),
    [filteredNodes, filteredLinks],
  )

  // Handle node click
  const handleNodeClick = (node) => {
    setSelectedNode(node)

    // Highlight connected nodes and links
    const connectedNodeIds = new Set()
    const connectedLinkIds = new Set()

    graphData.links.forEach((link, index) => {
      const sourceId = link.source.id || link.source
      const targetId = link.target.id || link.target

      if (sourceId === node.id || targetId === node.id) {
        connectedNodeIds.add(sourceId)
        connectedNodeIds.add(targetId)
        connectedLinkIds.add(index)
      }
    })

    setHighlightNodes(connectedNodeIds)
    setHighlightLinks(connectedLinkIds)
  }

  // Get all assets for table view
  const allAssets = useMemo(() => {
    return {
      applications: graphData.nodes.filter((node) => node.type === entityTypes.APPLICATION),
      hosts: graphData.nodes.filter((node) => node.type === entityTypes.HOST),
      certificates: graphData.nodes.filter((node) => node.type === entityTypes.CERTIFICATE),
      libraries: graphData.nodes.filter((node) => node.type === entityTypes.LIBRARY),
      vulnerabilities: graphData.nodes.filter((node) => node.type === entityTypes.VULNERABILITY),
    }
  }, [graphData.nodes])

  // Get filtered shared assets based on view selection
  const filteredSharedAssets = useMemo(() => {
    if (sharedAssetView === "certificates") {
      return { certificates: sharedAssets.certificates, libraries: [] }
    } else if (sharedAssetView === "libraries") {
      return { certificates: [], libraries: sharedAssets.libraries }
    } else {
      return sharedAssets
    }
  }, [sharedAssets, sharedAssetView])

  // Node color by type
  const getNodeColor = (node) => {
    const isHighlighted = highlightNodes.has(node.id)
    const baseColors = {
      [entityTypes.APPLICATION]: "#3b82f6", // blue
      [entityTypes.HOST]: "#10b981", // green
      [entityTypes.CERTIFICATE]: "#f59e0b", // amber
      [entityTypes.LIBRARY]: "#8b5cf6", // purple
      [entityTypes.VULNERABILITY]: "#ef4444", // red
    }

    return isHighlighted ? baseColors[node.type] : `${baseColors[node.type]}99`
  }

  // Node size by type
  const getNodeSize = (node) => {
    const isHighlighted = highlightNodes.has(node.id)
    const baseSizes = {
      [entityTypes.APPLICATION]: 8,
      [entityTypes.HOST]: 8,
      [entityTypes.CERTIFICATE]: 6,
      [entityTypes.LIBRARY]: 6,
      [entityTypes.VULNERABILITY]: 5,
    }

    return isHighlighted ? baseSizes[node.type] * 1.5 : baseSizes[node.type]
  }

  // Link color by type
  const getLinkColor = (link, index) => {
    const isHighlighted = highlightLinks.has(index)
    const baseColors = {
      [relationshipTypes.USES]: "#6b7280",
      [relationshipTypes.HOSTS]: "#6b7280",
      [relationshipTypes.AFFECTS]: "#ef4444",
      [relationshipTypes.DEPENDS_ON]: "#8b5cf6",
      [relationshipTypes.SHARES]: "#f59e0b",
    }

    return isHighlighted ? baseColors[link.type] : `${baseColors[link.type]}55`
  }

  // Link width by type
  const getLinkWidth = (link, index) => {
    const isHighlighted = highlightLinks.has(index)
    return isHighlighted ? 2 : 1
  }

  // Format entity type for display
  const formatEntityType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  // Get related entities for selected node
  const getRelatedEntities = (node) => {
    if (!node) return {}

    const related = {
      applications: [],
      hosts: [],
      certificates: [],
      libraries: [],
      vulnerabilities: [],
    }

    graphData.links.forEach((link) => {
      const sourceId = link.source.id || link.source
      const targetId = link.target.id || link.target

      if (sourceId === node.id) {
        const targetNode = graphData.nodes.find((n) => n.id === targetId)
        if (targetNode) {
          const category = `${targetNode.type}s`
          if (related[category]) {
            related[category].push(targetNode)
          }
        }
      } else if (targetId === node.id) {
        const sourceNode = graphData.nodes.find((n) => n.id === sourceId)
        if (sourceNode) {
          const category = `${sourceNode.type}s`
          if (related[category]) {
            related[category].push(sourceNode)
          }
        }
      }
    })

    return related
  }

  // Get related entities for selected node
  const relatedEntities = useMemo(() => {
    return getRelatedEntities(selectedNode)
  }, [selectedNode, graphData.links, graphData.nodes])

  const getFilteredAssets = () => {
    const assetsByType = {
      applications: allAssets.applications,
      hosts: allAssets.hosts,
      certificates: allAssets.certificates,
      libraries: allAssets.libraries,
      vulnerabilities: allAssets.vulnerabilities,
    }

    const assets = assetsByType[tableAssetType] || []

    if (!tableSearchTerm) return assets

    return assets.filter((asset) => asset.name.toLowerCase().includes(tableSearchTerm.toLowerCase()))
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Graph</h1>
          <p className="text-muted-foreground">
            Visualize relationships between applications, hosts, certificates, and other assets
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-[400px]">
          <TabsTrigger value="graph">
            <Network className="h-4 w-4 mr-2" />
            Graph View
          </TabsTrigger>
          <TabsTrigger value="table">
            <BarChart className="h-4 w-4 mr-2" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="shared">
            <Share2 className="h-4 w-4 mr-2" />
            Shared Assets
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security View
          </TabsTrigger>
        </TabsList>

        {/* Graph View */}
        <TabsContent value="graph" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Interactive Knowledge Graph</CardTitle>
              <CardDescription>
                Explore relationships between applications, hosts, certificates, and other assets
              </CardDescription>

              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search entities..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter:</span>

                  {Object.keys(entityTypes).map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${type}`}
                        checked={selectedEntityTypes[entityTypes[type]]}
                        onCheckedChange={(checked) => {
                          setSelectedEntityTypes({
                            ...selectedEntityTypes,
                            [entityTypes[type]]: !!checked,
                          })
                        }}
                      />
                      <Label htmlFor={`filter-${type}`} className="text-sm">
                        {formatEntityType(entityTypes[type])}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex gap-4 h-[600px]">
                <div className="flex-1 border rounded-md overflow-hidden bg-slate-50 dark:bg-slate-900 p-4">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Network className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                      <h3 className="text-lg font-medium mb-2">Knowledge Graph Visualization</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        The interactive graph visualization requires the ForceGraph2D component, which is not available
                        in this environment.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        You can still explore relationships using the Table, Shared Assets, and Security views.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-80 border rounded-md p-4 overflow-y-auto">
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedNode.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {formatEntityType(selectedNode.type)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Details</h4>
                        <div className="text-sm space-y-1">
                          {selectedNode.type === entityTypes.APPLICATION && (
                            <>
                              <p>
                                <span className="font-medium">Owner:</span> {selectedNode.data.owner || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Status:</span> {selectedNode.data.status || "N/A"}
                              </p>
                            </>
                          )}

                          {selectedNode.type === entityTypes.HOST && (
                            <>
                              <p>
                                <span className="font-medium">IP:</span> {selectedNode.data.ip || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Environment:</span>{" "}
                                {selectedNode.data.environment || "N/A"}
                              </p>
                            </>
                          )}

                          {selectedNode.type === entityTypes.CERTIFICATE && (
                            <>
                              <p>
                                <span className="font-medium">Issuer:</span> {selectedNode.data.issuer || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Expiry:</span> {selectedNode.data.expiryDate || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Status:</span>{" "}
                                {selectedNode.data.isExpired ? (
                                  <span className="text-red-500 flex items-center">
                                    <XCircle className="h-3 w-3 mr-1" /> Expired
                                  </span>
                                ) : (
                                  <span className="text-green-500 flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1" /> Valid
                                  </span>
                                )}
                              </p>
                            </>
                          )}

                          {selectedNode.type === entityTypes.LIBRARY && (
                            <>
                              <p>
                                <span className="font-medium">Version:</span> {selectedNode.data.version || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">License:</span> {selectedNode.data.license || "N/A"}
                              </p>
                            </>
                          )}

                          {selectedNode.type === entityTypes.VULNERABILITY && (
                            <>
                              <p>
                                <span className="font-medium">Severity:</span> {selectedNode.data.severity || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">CVSS:</span> {selectedNode.data.cvssScore || "N/A"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Related Entities</h4>

                        {Object.entries(relatedEntities).map(([category, entities]) => {
                          if (entities.length === 0) return null

                          return (
                            <div key={category} className="space-y-1">
                              <h5 className="text-xs font-medium text-muted-foreground">
                                {formatEntityType(category)}
                              </h5>
                              <ul className="text-sm space-y-1">
                                {entities.map((entity) => (
                                  <li
                                    key={entity.id}
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => handleNodeClick(entity)}
                                  >
                                    {entity.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Network className="h-12 w-12 mb-2 opacity-20" />
                      <p>Select a node to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Table View */}
        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Asset Inventory</CardTitle>
              <CardDescription>View all assets in a tabular format</CardDescription>

              <div className="flex items-center gap-4 mt-2">
                <Select defaultValue="certificates" value={tableAssetType} onValueChange={setTableAssetType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applications">Applications</SelectItem>
                    <SelectItem value="hosts">Hosts</SelectItem>
                    <SelectItem value="certificates">Certificates</SelectItem>
                    <SelectItem value="libraries">Libraries</SelectItem>
                    <SelectItem value="vulnerabilities">Vulnerabilities</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex-1 max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assets..."
                      className="pl-8"
                      value={tableSearchTerm}
                      onChange={(e) => setTableSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Related Applications</TableHead>
                    <TableHead>Related Hosts</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredAssets().map((asset) => {
                    const relatedApps = getRelatedEntities(asset).applications || []
                    const relatedHosts = getRelatedEntities(asset).hosts || []

                    return (
                      <TableRow
                        key={asset.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleNodeClick(asset)}
                      >
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{formatEntityType(asset.type)}</Badge>
                        </TableCell>
                        <TableCell>
                          {relatedApps.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {relatedApps.slice(0, 2).map((app) => (
                                <Badge key={app.id} variant="secondary" className="text-xs">
                                  {app.name}
                                </Badge>
                              ))}
                              {relatedApps.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{relatedApps.length - 2} more
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {relatedHosts.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {relatedHosts.slice(0, 2).map((host) => (
                                <Badge key={host.id} variant="secondary" className="text-xs">
                                  {host.name}
                                </Badge>
                              ))}
                              {relatedHosts.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{relatedHosts.length - 2} more
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {asset.type === entityTypes.CERTIFICATE &&
                            (asset.data.isExpired ? (
                              <span className="text-red-500 flex items-center">
                                <XCircle className="h-3 w-3 mr-1" /> Expired
                              </span>
                            ) : (
                              <span className="text-green-500 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" /> Valid
                              </span>
                            ))}
                          {asset.type !== entityTypes.CERTIFICATE && (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shared Assets View */}
        <TabsContent value="shared" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Shared Assets Analysis</CardTitle>
              <CardDescription>
                Identify certificates and libraries shared across multiple applications and hosts
              </CardDescription>

              <div className="flex items-center gap-4 mt-2">
                <Select defaultValue="all" value={sharedAssetView} onValueChange={setSharedAssetView}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shared Assets</SelectItem>
                    <SelectItem value="certificates">Certificates</SelectItem>
                    <SelectItem value="libraries">Libraries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Shared Certificates */}
              {filteredSharedAssets.certificates && filteredSharedAssets.certificates.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Shared Certificates</h3>
                  <p className="text-sm text-muted-foreground">Certificates used by multiple applications or hosts</p>

                  <div className="space-y-4">
                    {filteredSharedAssets.certificates.map((cert) => (
                      <Card key={cert.id} className="overflow-hidden">
                        <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950/20">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{cert.name}</CardTitle>
                              <CardDescription>
                                Issuer: {cert.data.issuer || "N/A"} | Expires: {cert.data.expiryDate || "N/A"}
                              </CardDescription>
                            </div>
                            <Badge variant={cert.data.isExpired ? "destructive" : "outline"}>
                              {cert.data.isExpired ? "Expired" : "Valid"}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Applications using this certificate */}
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Applications ({cert.usedBy.applications.length})
                              </h4>
                              <ul className="space-y-2">
                                {cert.usedBy.applications.map((app) => (
                                  <li key={app.id} className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                    <span>{app.name}</span>
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {app.status || "N/A"}
                                    </Badge>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Hosts using this certificate */}
                            <div>
                              <h4 className="text-sm font-medium mb-2">Hosts ({cert.usedBy.hosts.length})</h4>
                              <ul className="space-y-2">
                                {cert.usedBy.hosts.map((host) => (
                                  <li key={host.id} className="flex items-center text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                    <span>{host.name || host.hostname}</span>
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {host.environment || "N/A"}
                                    </Badge>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const certNode = graphData.nodes.find((node) => node.id === cert.id)
                                if (certNode) {
                                  handleNodeClick(certNode)
                                  setActiveTab("graph")
                                }
                              }}
                            >
                              <Network className="h-4 w-4 mr-2" />
                              View in Graph
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Shared Libraries */}
              {filteredSharedAssets.libraries && filteredSharedAssets.libraries.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Shared Libraries</h3>
                  <p className="text-sm text-muted-foreground">Libraries used by multiple applications</p>

                  <div className="space-y-4">
                    {filteredSharedAssets.libraries.map((lib) => (
                      <Card key={lib.id} className="overflow-hidden">
                        <CardHeader className="pb-2 bg-purple-50 dark:bg-purple-950/20">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{lib.name}</CardTitle>
                              <CardDescription>
                                Version: {lib.data.version || "N/A"} | License: {lib.data.license || "N/A"}
                              </CardDescription>
                            </div>
                            <Badge variant="outline">{lib.usedBy.applications.length} Applications</Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Applications</h4>
                            <ul className="space-y-2">
                              {lib.usedBy.applications.map((app) => (
                                <li key={app.id} className="flex items-center text-sm">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                  <span>{app.name}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {app.status || "N/A"}
                                  </Badge>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const libNode = graphData.nodes.find((node) => node.id === lib.id)
                                if (libNode) {
                                  handleNodeClick(libNode)
                                  setActiveTab("graph")
                                }
                              }}
                            >
                              <Network className="h-4 w-4 mr-2" />
                              View in Graph
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {(!filteredSharedAssets.certificates || filteredSharedAssets.certificates.length === 0) &&
                (!filteredSharedAssets.libraries || filteredSharedAssets.libraries.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Share2 className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg">No shared assets found</p>
                    <p className="text-sm max-w-md mt-2">
                      There are no certificates or libraries that are shared across multiple applications or hosts.
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security View */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Security Risk Analysis</CardTitle>
              <CardDescription>Identify security risks related to shared assets and vulnerabilities</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Expired Certificates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Expired Certificates</h3>
                <p className="text-sm text-muted-foreground">
                  Certificates that have expired and need immediate attention
                </p>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Certificate</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Applications Affected</TableHead>
                      <TableHead>Hosts Affected</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allAssets.certificates
                      .filter((cert) => cert.data.isExpired)
                      .map((cert) => {
                        const relatedApps = getRelatedEntities(cert).applications || []
                        const relatedHosts = getRelatedEntities(cert).hosts || []

                        return (
                          <TableRow key={cert.id}>
                            <TableCell className="font-medium">{cert.name}</TableCell>
                            <TableCell className="text-red-500">{cert.data.expiryDate || "N/A"}</TableCell>
                            <TableCell>{relatedApps.length}</TableCell>
                            <TableCell>{relatedHosts.length}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleNodeClick(cert)
                                  setActiveTab("graph")
                                }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </div>

              {/* Vulnerable Libraries */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vulnerable Libraries</h3>
                <p className="text-sm text-muted-foreground">
                  Libraries with known vulnerabilities that affect multiple applications
                </p>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Library</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Vulnerabilities</TableHead>
                      <TableHead>Applications Affected</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allAssets.libraries
                      .filter((lib) => {
                        const vulns = getRelatedEntities(lib).vulnerabilities || []
                        return vulns.length > 0
                      })
                      .map((lib) => {
                        const vulns = getRelatedEntities(lib).vulnerabilities || []
                        const relatedApps = getRelatedEntities(lib).applications || []

                        return (
                          <TableRow key={lib.id}>
                            <TableCell className="font-medium">{lib.name}</TableCell>
                            <TableCell>{lib.data.version || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {vulns.map((vuln) => (
                                  <Badge key={vuln.id} variant="destructive" className="text-xs">
                                    {vuln.name}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{relatedApps.length}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleNodeClick(lib)
                                  setActiveTab("graph")
                                }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
