"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BrainCircuit, Send, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react"

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI security assistant. How can I help you with your cryptographic assets today?",
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
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (input.toLowerCase().includes("openssl")) {
        response =
          "I've analyzed your OpenSSL usage and found that you're using version 1.0.2k which has several critical vulnerabilities including CVE-2023-0286 and CVE-2022-3602. I recommend updating to OpenSSL 3.1.0 immediately. Would you like me to provide the specific update commands for your environment?"
      } else if (input.toLowerCase().includes("certificate") || input.toLowerCase().includes("cert")) {
        response =
          "I've detected 2 certificates that will expire within 30 days. The most critical is for api.example.com which expires in 7 days. I recommend implementing automated certificate renewal with Let's Encrypt and setting up monitoring alerts for certificates expiring within 30 days. Would you like me to help you set this up?"
      } else if (input.toLowerCase().includes("key") || input.toLowerCase().includes("keys")) {
        response =
          "I've found 4 instances of hardcoded API keys in your codebase. This is a security risk as these keys could be exposed if your code is compromised. I recommend moving these keys to environment variables or a secure vault service like HashiCorp Vault or AWS Secrets Manager. Would you like me to show you how to refactor your code to use environment variables?"
      } else if (input.toLowerCase().includes("compliance") || input.toLowerCase().includes("pci")) {
        response =
          "Based on my analysis, your current cryptographic implementations are not fully compliant with PCI-DSS requirements. Specifically, you're not meeting requirements 2.2.1 (secure configurations), 6.2 (security patches), and 8.2.1 (strong cryptography for authentication). The most critical issue is the use of MD5 for password hashing, which is considered cryptographically broken."
      } else {
        response =
          "I've analyzed your cryptographic assets and identified several areas for improvement. The most critical issues are:\n\n1. Outdated OpenSSL version with known vulnerabilities\n2. Two certificates expiring within 30 days\n3. Hardcoded API keys in your codebase\n4. Use of MD5 for password hashing\n\nWhich of these would you like me to help you address first?"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
      setInput("")
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Security Assistant</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Get AI-powered help with cryptographic security issues
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-180px)] flex flex-col">
            <CardHeader>
              <CardTitle>Chat with AI Assistant</CardTitle>
              <CardDescription>
                Ask questions about cryptographic vulnerabilities and get AI-powered recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex max-w-[80%] ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                          : "bg-slate-100 dark:bg-slate-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                      } p-3`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>
                            <BrainCircuit className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="whitespace-pre-line">{message.content}</p>
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
                  placeholder="Ask about cryptographic vulnerabilities, certificates, keys, or compliance..."
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
              <CardTitle>Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setInput("What OpenSSL vulnerabilities do I have?")}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  What OpenSSL vulnerabilities do I have?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setInput("Check my certificates for expiration issues")}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  Check my certificates for expiration issues
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setInput("Find hardcoded API keys in my codebase")}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  Find hardcoded API keys in my codebase
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setInput("Am I compliant with PCI-DSS cryptographic requirements?")}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                  Am I compliant with PCI-DSS requirements?
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <h3 className="font-medium text-red-800 dark:text-red-300 text-sm">
                    Critical: OpenSSL Vulnerability
                  </h3>
                  <p className="text-xs mt-1 text-red-800 dark:text-red-300">
                    OpenSSL 1.0.2k has multiple known vulnerabilities
                  </p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 text-sm">
                    Warning: Expiring Certificate
                  </h3>
                  <p className="text-xs mt-1 text-amber-800 dark:text-amber-300">
                    api.example.com certificate expires in 7 days
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 text-sm">Info: Weak Password Hashing</h3>
                  <p className="text-xs mt-1 text-blue-800 dark:text-blue-300">
                    MD5 hashing detected in authentication flows
                  </p>
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
