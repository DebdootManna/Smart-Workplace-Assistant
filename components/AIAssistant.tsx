"use client"

import type React from "react"

import { useState } from "react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "Hello! I'm your Smart Workplace Assistant. I can help you with task management, productivity insights, and workflow optimization. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)

  const insights = [
    "Focus on completing pending tasks to improve your completion rate",
    "Consider breaking down large tasks into smaller, manageable chunks",
    "Set realistic time estimates based on your historical performance",
    "Prioritize high-impact tasks during your most productive hours",
  ]

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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `I understand you're asking about "${userMessage.content}". Based on your current tasks and productivity patterns, I recommend focusing on high-priority items first and breaking down complex tasks into smaller, manageable steps. Would you like me to help you prioritize your current tasks?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setLoading(false)
    }, 1500)
  }

  const quickQuestions = [
    "How can I improve my productivity?",
    "What tasks should I prioritize today?",
    "Show me my productivity trends",
    "How can I better organize my workflow?",
  ]

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-lg border shadow-sm flex-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white">🤖</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">AI Assistant</h2>
                <p className="text-sm text-gray-500">Your intelligent productivity companion</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-sm">{message.type === "ai" ? "🤖" : "👤"}</span>
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <span>🤖</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about productivity..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📤
              </button>
            </form>

            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 2).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
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
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 mr-2">💡</span>
            <h3 className="font-semibold text-gray-900">AI Insights</h3>
          </div>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">✨</span>
                  <p className="text-sm text-yellow-800">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputValue(question)}
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
  )
}
