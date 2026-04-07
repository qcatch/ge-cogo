'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { MessageList, type Message } from '@/components/chat/message-list'
import { ChatInput } from '@/components/chat/chat-input'

interface ConversationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  systemPrompt: string
  initialContext?: string
}

export function ConversationPanel({
  open,
  onOpenChange,
  systemPrompt,
  initialContext,
}: ConversationPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const initialContextSent = useRef(false)
  const previousContext = useRef<string | undefined>(undefined)

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setStreamingContent('')

    try {
      const allMessages = [...messages, userMessage]
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            id: m.id,
            role: m.role,
            parts: [{ type: 'text', text: m.content }],
          })),
          systemPrompt,
        }),
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('data:')) {
            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'text-delta' && parsed.delta) {
                fullContent += parsed.delta
                setStreamingContent(fullContent)
              }
            } catch {
              // skip invalid JSON
            }
          }
        }
      }

      if (fullContent) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: fullContent },
        ])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
      setStreamingContent('')
    }
  }, [messages, isLoading, systemPrompt])

  // Auto-send initial context when panel opens with new context
  useEffect(() => {
    if (open && initialContext && initialContext !== previousContext.current) {
      previousContext.current = initialContext
      initialContextSent.current = false
    }
    if (open && initialContext && !initialContextSent.current) {
      initialContextSent.current = true
      setMessages([])
      setTimeout(() => handleSend(initialContext), 50)
    }
  }, [open, initialContext, handleSend])

  // Reset on close
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setMessages([])
      setStreamingContent('')
      setIsLoading(false)
      previousContext.current = undefined
      initialContextSent.current = false
    }
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-lg p-0">
        <SheetHeader className="px-4 py-3 border-b border-border">
          <SheetTitle className="text-sm font-medium">AI Energy Advisor</SheetTitle>
        </SheetHeader>
        <MessageList
          messages={messages}
          streamingContent={streamingContent}
          isLoading={isLoading}
        />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </SheetContent>
    </Sheet>
  )
}
