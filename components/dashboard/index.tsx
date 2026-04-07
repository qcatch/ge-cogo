'use client'

import { useState } from 'react'
import { calculateTCE, DEMO_PROFILES } from '@/lib/energy-model'
import type { HouseholdInput, TCEResult } from '@/lib/energy-model/types'
import { buildTCESystemPrompt, buildDefaultSystemPrompt } from '@/lib/tce-context'
import { EnergyForm } from './energy-form'
import { TCEResults } from './tce-results'
import { ConversationPanel } from '@/components/ai/conversation-panel'
import { CommandBar } from '@/components/ai/command-bar'

type View = 'form' | 'results'

export function Dashboard() {
  const [view, setView] = useState<View>('form')
  const [result, setResult] = useState<TCEResult | null>(null)
  const [lastInput, setLastInput] = useState<HouseholdInput | null>(null)

  // Chat state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState('')

  // Build system prompt based on whether we have TCE results
  const systemPrompt = lastInput && result
    ? buildTCESystemPrompt(lastInput, result)
    : buildDefaultSystemPrompt()

  function handleFormSubmit(input: HouseholdInput) {
    const tceResult = calculateTCE(input)
    setLastInput(input)
    setResult(tceResult)
    setView('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDemo(profileKey: string) {
    const profile = DEMO_PROFILES[profileKey]
    if (!profile) return
    handleFormSubmit(profile.input)
  }

  function handleEdit() {
    setView('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCommandSubmit(text: string) {
    setChatContext(text)
    setChatOpen(true)
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {view === 'form'
              ? 'What does your energy really cost?'
              : 'Your Total Cost of Energy'}
          </h1>
          {view === 'form' && (
            <p className="text-muted-foreground max-w-xl mx-auto">
              See your total household energy spend across power, gas, and petrol
              — and discover how much you could save by going electric.
            </p>
          )}
        </div>

        {/* Main Content */}
        {view === 'form' ? (
          <EnergyForm
            onSubmit={handleFormSubmit}
            onDemo={handleDemo}
            defaultValues={lastInput}
          />
        ) : result ? (
          <TCEResults result={result} onEdit={handleEdit} />
        ) : null}

        {/* Command Bar */}
        <CommandBar
          onSubmit={handleCommandSubmit}
          isLoading={false}
        />
      </div>

      {/* Chat Panel */}
      <ConversationPanel
        open={chatOpen}
        onOpenChange={setChatOpen}
        systemPrompt={systemPrompt}
        initialContext={chatContext}
      />
    </div>
  )
}
