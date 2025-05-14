import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Crypto Asset Manager",
  description: "AI-Powered Cryptographic Asset Management System",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
              <Header />
              <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
