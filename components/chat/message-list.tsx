'use client'

import { useEffect, useRef } from 'react'
import { MarkdownContent } from './markdown-content'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface MessageListProps {
  messages: Message[]
  streamingContent: string
  isLoading: boolean
}

export function MessageList({ messages, streamingContent, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Streaming response */}
      {streamingContent && (
        <div className="flex gap-2">
          <GenesisIcon />
          <div className="rounded-lg bg-muted px-3 py-2 max-w-[85%]">
            <MarkdownContent content={streamingContent} />
            <span className="inline-block w-2 h-4 ml-0.5 bg-primary animate-pulse" />
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && !streamingContent && (
        <div className="flex gap-2">
          <GenesisIcon />
          <div className="rounded-lg bg-muted px-3 py-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="rounded-lg bg-primary text-primary-foreground px-3 py-2 max-w-[85%]">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <GenesisIcon />
      <div className="rounded-lg bg-muted px-3 py-2 max-w-[85%]">
        <MarkdownContent content={message.content} />
      </div>
    </div>
  )
}

function GenesisIcon() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden>
        <path
          d="M8 2 L13 7 L10.5 7 L13 11 L9.5 11 L11.5 14 L3 8 L6.5 8 L4 5 L7.5 5 Z"
          fill="white"
          fillRule="evenodd"
        />
      </svg>
    </div>
  )
}
