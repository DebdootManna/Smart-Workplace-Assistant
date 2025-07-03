"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { apiService } from "../../services/apiService"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Lightbulb, Loader, Sparkles } from "lucide-react"
import toast from "react-hot-toast"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<string[]>([])
  const [loadingInsights, setLoadingInsights] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadInsights()
    // Add welcome message
    setMessages([
      {
        id: "welcome",
        type: "ai",
        content:
          "Hello! I'm your Smart Workplace Assistant. I can help you with task management, productivity insights, and workflow optimization. How can I assist you today?",
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadInsights = async () => {
    try {
      const data = await apiService.getAIInsights()
      setInsights(data.insights)
    } catch (error) {
      console.error("Failed to load insights:", error)
    } finally {
      setLoadingInsights(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setLoading(true)

    try {
      const response = await apiService.chatWithAI(userMessage.content)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      toast.error("Failed to get AI response")
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
  }

  const quickQuestions = [
    "How can I improve my productivity?",
    "What tasks should I prioritize today?",
    "Show me my productivity trends",
    "How can I better organize my workflow?",
    "What are some time management tips?",
  ]

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-1 flex gap-6">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          <div className="card flex-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">AI Assistant</h2>
                  <p className="text-sm text-gray-500">Your intelligent productivity companion</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === "ai" && <Bot className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />}
                        {message.type === "user" && <User className="w-4 h-4 mt-0.5 text-blue-100 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <Loader className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about productivity..."
                  className="input flex-1"
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !inputValue.trim()} className="btn btn-primary">
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Questions */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                      disabled={loading}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Sidebar */}
        <div className="w-80 space-y-6">
          {/* AI Insights */}
          <div className="card p-4">
            <div className="flex items-center mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="font-semibold text-gray-900">AI Insights</h3>
            </div>

            {loadingInsights ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-start">
                      <Sparkles className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">{insight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <button onClick={loadInsights} className="w-full mt-4 btn btn-secondary text-sm" disabled={loadingInsights}>
              {loadingInsights ? "Loading..." : "Refresh Insights"}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  disabled={loading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
