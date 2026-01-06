'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChatMessage } from '@/components/ChatMessage'
import { Send, Loader2, MessageSquare, Trash2 } from 'lucide-react'

interface Citation {
  chunkId: string
  sourceId: string
  sourceTitle: string
  snippet: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  created_at?: string
}

interface ChatSession {
  id: string
  title: string | null
  created_at: string
}

interface ChatInterfaceProps {
  projectId: string
  initialSessionId?: string
}

export function ChatInterface({ projectId, initialSessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(initialSessionId || null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load sessions on mount
  useEffect(() => {
    loadSessions()
  }, [projectId])

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      loadSessionMessages(currentSessionId)
    } else {
      setMessages([])
    }
  }, [currentSessionId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadSessions() {
    try {
      const response = await fetch(`/api/projects/${projectId}/chat`)
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  async function loadSessionMessages(sessionId: string) {
    setIsLoadingSession(true)
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setIsLoadingSession(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])
    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: currentSessionId
        })
      })

      if (response.ok) {
        const data = await response.json()

        // Update session ID if new session was created
        if (data.sessionId && data.sessionId !== currentSessionId) {
          setCurrentSessionId(data.sessionId)
          await loadSessions() // Refresh session list
        }

        // Add assistant message
        const assistantMessage: Message = {
          id: data.message.id,
          role: 'assistant',
          content: data.message.content,
          citations: data.message.citations,
          created_at: data.message.created_at
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        // Remove optimistic message on error
        setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
        console.error('Failed to send message')
      }
    } catch (error) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteSession(sessionId: string) {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId))
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null)
          setMessages([])
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  function handleNewChat() {
    setCurrentSessionId(null)
    setMessages([])
  }

  return (
    <div className="grid h-[calc(100vh-16rem)] gap-4 lg:grid-cols-4">
      {/* Sessions Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Chat History</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleNewChat}>
              New Chat
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[calc(100%-4rem)] overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="text-center text-sm text-zinc-500">No previous chats</p>
          ) : (
            <div className="space-y-2">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`group flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    currentSessionId === session.id
                      ? 'bg-zinc-100 dark:bg-zinc-800'
                      : ''
                  }`}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <MessageSquare className="h-4 w-4 shrink-0 text-zinc-400" />
                    <span className="truncate text-sm">
                      {session.title || 'New Chat'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteSession(session.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-zinc-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex flex-col lg:col-span-3">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-lg">
            {currentSessionId
              ? sessions.find(s => s.id === currentSessionId)?.title || 'Chat'
              : 'Ask Your Sources'}
          </CardTitle>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4">
          {isLoadingSession ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageSquare className="mb-4 h-12 w-12 text-zinc-300" />
              <h3 className="text-lg font-medium">Start a conversation</h3>
              <p className="mt-1 max-w-md text-sm text-zinc-500">
                Ask questions about your uploaded sources. The AI will search your
                content and provide answers with citations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  citations={message.citations}
                  createdAt={message.created_at}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question about your sources..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
