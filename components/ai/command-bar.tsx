'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, SendHorizontal } from 'lucide-react'

interface CommandBarProps {
  onSubmit: (text: string) => void
  isLoading: boolean
}

export function CommandBar({ onSubmit, isLoading }: CommandBarProps) {
  const [input, setInput] = useState('')

  function handleSubmit() {
    const text = input.trim()
    if (!text || isLoading) return
    onSubmit(text)
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm -mx-4 md:-mx-6 px-4 md:px-6">
      <div className="max-w-3xl mx-auto py-4">
        <div className="flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2">
          <Zap className="h-4 w-4 text-primary shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask how to reduce your household costs..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
          {input.trim() && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Powered by AI — your personal savings advisor
        </p>
      </div>
    </div>
  )
}
