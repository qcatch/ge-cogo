'use client'

import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'

interface ConversationStartersProps {
  starters: string[]
  onSelect: (text: string) => void
}

export function ConversationStarters({ starters, onSelect }: ConversationStartersProps) {
  if (starters.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-medium">Ask the Savings Advisor</p>
      <div className="flex flex-wrap gap-2">
        {starters.map((starter) => (
          <Button
            key={starter}
            variant="outline"
            size="sm"
            className="text-xs h-auto py-1.5 px-3 text-left"
            onClick={() => onSelect(starter)}
          >
            <MessageSquare className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{starter}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
