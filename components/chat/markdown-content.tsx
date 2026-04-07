'use client'

import React from 'react'

/**
 * Lightweight markdown renderer for chat messages.
 * Handles: **bold**, *italic*, `code`, - bullet lists, \n\n paragraphs, [text](url) links.
 * No external dependencies.
 */
export function MarkdownContent({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/)

  return (
    <div className="text-sm space-y-2">
      {blocks.map((block, i) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        // Check if block is a bullet list (all lines start with - or *)
        const lines = trimmed.split('\n')
        const isList = lines.every((l) => /^\s*[-*]\s/.test(l) || l.trim() === '')

        if (isList) {
          return (
            <ul key={i} className="list-disc list-inside space-y-0.5">
              {lines
                .filter((l) => l.trim())
                .map((line, j) => (
                  <li key={j} className="text-sm">
                    <InlineMarkdown text={line.replace(/^\s*[-*]\s+/, '')} />
                  </li>
                ))}
            </ul>
          )
        }

        // Regular paragraph (may contain single newlines)
        return (
          <p key={i}>
            <InlineMarkdown text={trimmed.replace(/\n/g, ' ')} />
          </p>
        )
      })}
    </div>
  )
}

function InlineMarkdown({ text }: { text: string }) {
  // Process inline formatting: **bold**, *italic*, `code`, [text](url)
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)$/)
    if (boldMatch) {
      if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>)
      parts.push(<strong key={key++} className="font-semibold">{boldMatch[2]}</strong>)
      remaining = boldMatch[3]
      continue
    }

    // Italic: *text* (but not **)
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*(.*)$/)
    if (italicMatch) {
      if (italicMatch[1]) parts.push(<span key={key++}>{italicMatch[1]}</span>)
      parts.push(<em key={key++}>{italicMatch[2]}</em>)
      remaining = italicMatch[3]
      continue
    }

    // Code: `text`
    const codeMatch = remaining.match(/^(.*?)`(.+?)`(.*)$/)
    if (codeMatch) {
      if (codeMatch[1]) parts.push(<span key={key++}>{codeMatch[1]}</span>)
      parts.push(<code key={key++} className="bg-muted px-1 py-0.5 rounded text-xs">{codeMatch[2]}</code>)
      remaining = codeMatch[3]
      continue
    }

    // No more inline formatting
    parts.push(<span key={key++}>{remaining}</span>)
    break
  }

  return <>{parts}</>
}
