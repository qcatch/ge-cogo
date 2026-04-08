'use client'

import { useState } from 'react'
import type { SavingsIdea } from '@/lib/cost-of-living'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Mail } from 'lucide-react'
import { EmailDraftSheet } from './email-draft-sheet'

interface IdeaCardProps {
  idea: SavingsIdea
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const [emailOpen, setEmailOpen] = useState(false)

  return (
    <>
      <Card className="hover:border-primary/30 transition-colors">
        <CardContent className="py-3 px-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-foreground text-sm leading-snug">{idea.title}</p>
            <Badge variant="outline" className="shrink-0 text-xs bg-accent/20">
              {idea.savingsEstimate}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{idea.description}</p>
          <div className="pt-1">
            {idea.actionType === 'link' && idea.actionUrl && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary" asChild>
                <a href={idea.actionUrl} target="_blank" rel="noopener noreferrer">
                  {idea.actionLabel}
                  <ChevronRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            )}
            {idea.actionType === 'habit' && (
              <Badge variant="secondary" className="text-xs">{idea.actionLabel}</Badge>
            )}
            {idea.actionType === 'partner' && (
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                {idea.partnerName}: {idea.actionLabel}
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            )}
            {idea.actionType === 'email' && idea.emailBody && (
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setEmailOpen(true)}>
                <Mail className="mr-1 h-3 w-3" />
                {idea.actionLabel}
              </Button>
            )}
            {idea.actionType === 'email' && !idea.emailBody && (
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled>
                {idea.actionLabel} (coming soon)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {idea.emailBody && idea.emailSubject && (
        <EmailDraftSheet
          open={emailOpen}
          onOpenChange={setEmailOpen}
          subject={idea.emailSubject}
          body={idea.emailBody}
        />
      )}
    </>
  )
}
