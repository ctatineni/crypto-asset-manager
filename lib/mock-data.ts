export const apps = [
  {
    id: "app-1",
    name: "Payment Gateway",
    description: "Handles all payment processing for the e-commerce platform",
    risk_score: 82,
    certificates: 12,
    keys: 8,
    vulnerabilities: { critical: 1, high: 3, medium: 5, low: 2 },
    hosts: 5,
    last_scan: "2023-05-02T13:45:00Z",
  },
  {
    id: "app-2",
    name: "User Authentication Service",
    description: "Manages user authentication and authorization",
    risk_score: 67,
    certificates: 8,
    keys: 15,
    vulnerabilities: { critical: 0, high: 2, medium: 6, low: 4 },
    hosts: 3,
    last_scan: "2023-05-01T09:30:00Z",
  },
  {
    id: "app-3",
    name: "Data Analytics Platform",
    description: "Processes and analyzes user behavior data",
    risk_score: 91,
    certificates: 5,
    keys: 10,
    vulnerabilities: { critical: 2, high: 4, medium: 1, low: 3 },
    hosts: 7,
    last_scan: "2023-05-03T16:20:00Z",
  },
  {
    id: "app-4",
    name: "Content Management System",
    description: "Manages website content and assets",
    risk_score: 74,
    certificates: 7,
    keys: 4,
    vulnerabilities: { critical: 0, high: 1, medium: 4, low: 7 },
    hosts: 2,
    last_scan: "2023-05-02T10:15:00Z",
  },
  {
    id: "app-5",
    name: "Inventory Management",
    description: "Tracks and manages product inventory",
    risk_score: 88,
    certificates: 9,
    keys: 6,
    vulnerabilities: { critical: 1, high: 2, medium: 3, low: 5 },
    hosts: 4,
    last_scan: "2023-05-03T14:50:00Z",
  },
  {
    id: "app-6",
    name: "Customer Support Portal",
    description: "Platform for customer support and ticket management",
    risk_score: 59,
    certificates: 6,
    keys: 11,
    vulnerabilities: { critical: 0, high: 0, medium: 8, low: 6 },
    hosts: 3,
    last_scan: "2023-05-01T11:40:00Z",
  },
]

export const vulnerabilities = [
  {
    id: "vuln-1",
    name: "Expired Certificate",
    description: "SSL certificate has expired on the production server",
    severity: "critical",
    affected_apps: ["app-1", "app-3"],
    status: "open",
    detected: "2023-04-28T13:45:00Z",
    recommendation:
      "Renew the SSL certificate immediately and implement automated monitoring for certificate expiration",
  },
  {
    id: "vuln-2",
    name: "Weak Encryption Algorithm",
    description: "MD5 hashing algorithm detected in password storage",
    severity: "high",
    affected_apps: ["app-2", "app-6"],
    status: "open",
    detected: "2023-04-29T09:30:00Z",
    recommendation: "Replace MD5 with bcrypt or Argon2 for password hashing and migrate existing passwords",
  },
  {
    id: "vuln-3",
    name: "Hardcoded API Keys",
    description: "API keys found hardcoded in application source code",
    severity: "high",
    affected_apps: ["app-1", "app-4"],
    status: "in_progress",
    detected: "2023-04-30T16:20:00Z",
    recommendation: "Move all API keys to environment variables or a secure vault and rotate compromised keys",
  },
  {
    id: "vuln-4",
    name: "Insecure Random Number Generation",
    description: "Non-cryptographically secure random number generator used for session tokens",
    severity: "medium",
    affected_apps: ["app-2", "app-5"],
    status: "open",
    detected: "2023-05-01T10:15:00Z",
    recommendation: "Replace with cryptographically secure random number generation functions like SecureRandom",
  },
  {
    id: "vuln-5",
    name: "Missing Certificate Validation",
    description: "TLS certificate validation disabled in API client",
    severity: "high",
    affected_apps: ["app-3", "app-5"],
    status: "open",
    detected: "2023-05-02T14:50:00Z",
    recommendation: "Enable proper certificate validation and implement certificate pinning where appropriate",
  },
  {
    id: "vuln-6",
    name: "Outdated Cryptographic Library",
    description: "Using an outdated version of OpenSSL with known vulnerabilities",
    severity: "critical",
    affected_apps: ["app-1", "app-3", "app-5"],
    status: "in_progress",
    detected: "2023-05-01T11:40:00Z",
    recommendation: "Update OpenSSL to the latest version and implement a dependency management policy",
  },
]

export const libraries = [
  {
    id: "lib-1",
    name: "OpenSSL",
    type: "cryptographic",
    version: "1.0.2k",
    latest_version: "3.1.0",
    language: "C",
    usage: "TLS/SSL implementation",
    vulnerabilities: 4,
    apps_using: ["app-1", "app-3", "app-5"],
  },
  {
    id: "lib-2",
    name: "BouncyCastle",
    type: "cryptographic",
    version: "1.68",
    latest_version: "1.70",
    language: "Java",
    usage: "Cryptographic operations",
    vulnerabilities: 2,
    apps_using: ["app-2", "app-4"],
  },
  {
    id: "lib-3",
    name: "PyCA/cryptography",
    type: "cryptographic",
    version: "3.4.6",
    latest_version: "39.0.1",
    language: "Python",
    usage: "Cryptography for Python applications",
    vulnerabilities: 1,
    apps_using: ["app-3", "app-6"],
  },
  {
    id: "lib-4",
    name: "Node-Forge",
    type: "cryptographic",
    version: "0.10.0",
    latest_version: "1.3.1",
    language: "JavaScript",
    usage: "JavaScript cryptography implementation",
    vulnerabilities: 3,
    apps_using: ["app-1", "app-4", "app-6"],
  },
  {
    id: "lib-5",
    name: "WolfSSL",
    type: "cryptographic",
    version: "4.7.0",
    latest_version: "5.5.3",
    language: "C",
    usage: "Embedded SSL/TLS library",
    vulnerabilities: 0,
    apps_using: ["app-5"],
  },
]

export const hosts = [
  {
    id: "host-1",
    name: "prod-api-01",
    type: "VM",
    os: "Ubuntu 20.04 LTS",
    ip: "10.0.1.5",
    certificates: 4,
    keys: 3,
    apps: ["app-1", "app-2"],
    vulnerabilities: { critical: 1, high: 2, medium: 1, low: 0 },
  },
  {
    id: "host-2",
    name: "prod-web-01",
    type: "VM",
    os: "CentOS 8",
    ip: "10.0.1.6",
    certificates: 3,
    keys: 2,
    apps: ["app-1", "app-4"],
    vulnerabilities: { critical: 0, high: 1, medium: 3, low: 2 },
  },
  {
    id: "host-3",
    name: "analytics-server",
    type: "Physical",
    os: "Debian 11",
    ip: "10.0.2.10",
    certificates: 2,
    keys: 5,
    apps: ["app-3"],
    vulnerabilities: { critical: 2, high: 1, medium: 0, low: 3 },
  },
  {
    id: "host-4",
    name: "app-container-01",
    type: "Container",
    os: "Alpine Linux 3.15",
    ip: "10.0.3.15",
    certificates: 1,
    keys: 4,
    apps: ["app-2", "app-5"],
    vulnerabilities: { critical: 0, high: 0, medium: 2, low: 1 },
  },
  {
    id: "host-5",
    name: "db-server-01",
    type: "VM",
    os: "RHEL 8",
    ip: "10.0.1.8",
    certificates: 2,
    keys: 1,
    apps: ["app-1", "app-5"],
    vulnerabilities: { critical: 0, high: 1, medium: 1, low: 2 },
  },
]

export function getApp(id: string) {
  return apps.find((app) => app.id === id)
}

export function getVulnerability(id: string) {
  return vulnerabilities.find((vuln) => vuln.id === id)
}

export function getLibrary(id: string) {
  return libraries.find((lib) => lib.id === id)
}

export function getHost(id: string) {
  return hosts.find((host) => host.id === id)
}

export function getAppVulnerabilities(appId: string) {
  return vulnerabilities.filter((vuln) => vuln.affected_apps.includes(appId))
}

export function getAppLibraries(appId: string) {
  return libraries.filter((lib) => lib.apps_using.includes(appId))
}

export function getAppHosts(appId: string) {
  return hosts.filter((host) => host.apps.includes(appId))
}
