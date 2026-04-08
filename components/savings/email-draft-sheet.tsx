'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Mail } from 'lucide-react'

interface EmailDraftSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: string
  body: string
}

export function EmailDraftSheet({ open, onOpenChange, subject, body }: EmailDraftSheetProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const text = `Subject: ${subject}\n\n${body}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Draft Email
          </SheetTitle>
          <SheetDescription>
            Copy this email and personalise the [bracketed] fields before sending.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</p>
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
              <p className="text-sm text-foreground">{subject}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Body</p>
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-3">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{body}</pre>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleCopy} className="flex-1">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied to clipboard
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy email to clipboard
                </>
              )}
            </Button>
          </div>

          <Badge variant="outline" className="text-xs">
            Personalise the [bracketed] fields before sending
          </Badge>
        </div>
      </SheetContent>
    </Sheet>
  )
}
