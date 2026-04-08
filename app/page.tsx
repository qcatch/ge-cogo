'use client'

import { useRef, useCallback, useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Dashboard } from '@/components/dashboard'
import { calculateTCE, TCE_DEMO_PROFILES } from '@/lib/energy-model'
import type { TCEResult, HouseholdInput } from '@/lib/energy-model'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TCEForm } from '@/components/calculator/tce-form'
import { PowerCircleOffers } from '@/components/offers/power-circle-offers'
import { SavingsPlaybook } from '@/components/savings/savings-playbook'
import { TotalCostView } from '@/components/household/total-cost-view'
import { SavingsSummaryCard } from '@/components/share/savings-summary-card'
import { ConversationPanel } from '@/components/ai/conversation-panel'
import { CommandBar } from '@/components/ai/command-bar'
import { buildTCESystemPrompt, generateTCEStarters } from '@/lib/tce-context'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Zap, ArrowDown, ArrowRight, Leaf, ChevronRight, MessageSquare, Info } from 'lucide-react'

export default function Home() {
  const navigateRef = useRef<((target: string) => void) | null>(null)
  const [householdInput, setHouseholdInput] = useState<HouseholdInput>(
    TCE_DEMO_PROFILES['auckland-family'].input
  )

  const tceResult: TCEResult = useMemo(() => {
    return calculateTCE(householdInput)
  }, [householdInput])

  // AI chat state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState('')
  const systemPrompt = buildTCESystemPrompt(householdInput, tceResult)
  const starters = generateTCEStarters(tceResult)

  const handleChatSubmit = useCallback((text: string) => {
    setChatContext(text)
    setChatOpen(true)
  }, [])

  const handleRegisterNavigate = useCallback((handler: (target: string) => void) => {
    navigateRef.current = handler
  }, [])

  const handleNavigate = useCallback((target: string) => {
    // Handle new sections
    if (['home', 'calculator', 'results', 'household-costs', 'savings'].includes(target)) {
      if (target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const el = document.getElementById(target)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (navigateRef.current) {
      // Delegate dashboard sections
      navigateRef.current(target)
    }
  }, [])

  // Prepare comparison chart data
  const chartData = [
    {
      category: 'Electricity',
      current: Math.round(tceResult.currentCosts.electricity),
      electrified: Math.round(tceResult.electrifiedCosts.electricity),
    },
    {
      category: 'Gas',
      current: Math.round(tceResult.currentCosts.gas),
      electrified: Math.round(tceResult.electrifiedCosts.gas),
    },
    {
      category: 'Petrol',
      current: Math.round(tceResult.currentCosts.petrol),
      electrified: Math.round(tceResult.electrifiedCosts.petrol),
    },
    {
      category: 'Vehicle RUC',
      current: Math.round(tceResult.currentCosts.vehicleRuc),
      electrified: Math.round(tceResult.electrifiedCosts.vehicleRuc),
    },
  ].filter(d => d.current > 0 || d.electrified > 0)

  return (
    <main className="flex flex-col min-h-screen">
      <Header onNavigate={handleNavigate} />

      {/* ─── LANDING SECTION ─────────────────────────────────────────── */}
      <section id="home" className="relative flex items-center justify-center min-h-[80vh] px-4 md:px-6 bg-gradient-to-b from-background via-background to-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="text-xs px-3 py-1">
            Genesis Energy
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Do you know what energy is <span className="text-primary">actually costing you</span> — across everything?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Most Kiwi households see a power bill, a petrol receipt, and maybe a gas bill as three separate things.
            They never add them up. The total is almost always more than they think — and the gap between what they pay now
            and what they could pay is enormous.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="text-base px-8 py-6"
              onClick={() => {
                const el = document.getElementById('calculator')
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              Find out your real cost
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground">Takes less than 2 minutes</p>
          </div>
        </div>
      </section>

      {/* ─── CALCULATOR SECTION ──────────────────────────────────────── */}
      <section id="calculator" className="py-16 px-4 md:px-6 bg-muted/20 border-t border-border">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Your Household Energy Profile</h2>
            <p className="text-muted-foreground">Tell us about your home and vehicles — or pick a demo household to start.</p>
          </div>

          <TCEForm onInputChange={setHouseholdInput} defaultInput={householdInput} />

          {/* Live preview */}
          <Card className="max-w-2xl mx-auto bg-accent/10 border-primary/20">
            <CardContent className="py-4 px-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="text-center flex-1 min-w-[100px]">
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(Math.round(tceResult.currentCosts.total))}</p>
                  <p className="text-xs text-muted-foreground">per year</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary hidden sm:block shrink-0" />
                <div className="text-center flex-1 min-w-[100px]">
                  <p className="text-xs text-muted-foreground">Electrified</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(Math.round(tceResult.electrifiedCosts.total))}</p>
                  <p className="text-xs text-muted-foreground">per year</p>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Save {formatCurrency(tceResult.annualSavings)}/yr
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Button
              onClick={() => {
                const el = document.getElementById('results')
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              See full breakdown
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── RESULTS SECTION ─────────────────────────────────────────── */}
      <section id="results" className="py-16 px-4 md:px-6 border-t border-border">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Hero Numbers */}
          <div className="text-center space-y-6">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your total cost of energy</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              {/* Current */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Today</p>
                <p className="text-5xl md:text-6xl font-bold text-foreground">
                  {formatCurrency(Math.round(tceResult.currentCosts.total))}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per year</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <div className="hidden md:block w-16 h-px bg-border" />
                <ArrowDown className="h-6 w-6 text-primary md:rotate-[-90deg]" />
                <div className="hidden md:block w-16 h-px bg-border" />
              </div>

              {/* Electrified */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Fully Electrified</p>
                <p className="text-5xl md:text-6xl font-bold text-primary">
                  {formatCurrency(Math.round(tceResult.electrifiedCosts.total))}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per year</p>
              </div>
            </div>

            {/* Savings callout */}
            <div className="inline-flex items-center gap-3 bg-accent/30 rounded-xl px-6 py-3">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                You could save {formatCurrency(tceResult.annualSavings)} per year
              </span>
              <Badge variant="secondary" className="text-xs">
                {formatPercent(tceResult.savingsPercent)} less
              </Badge>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground text-center">Cost Breakdown: Current vs Electrified</h3>
            <Card>
              <CardContent className="py-6 px-4">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 13 }} />
                    <YAxis tickFormatter={(v: number) => `$${v.toLocaleString()}`} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                    <Legend />
                    <Bar dataKey="current" name="Current" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="electrified" name="Electrified" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Switching Roadmap */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground text-center">Your Electrification Roadmap</h3>
            <p className="text-sm text-muted-foreground text-center">Ranked by return on investment — best value first</p>
            <div className="grid gap-3 md:grid-cols-2">
              {tceResult.roadmap.map((item) => (
                <Card key={item.appliance} className="hover:border-primary/40 transition-colors">
                  <CardContent className="py-4 px-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            #{item.priority}
                          </Badge>
                          <p className="font-medium text-foreground">{item.appliance}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Annual saving</p>
                            <p className="text-sm font-semibold text-primary">{formatCurrency(item.annualSaving)}/yr</p>
                          </div>
                          {item.upfrontCost > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Upfront cost</p>
                              <p className="text-sm font-medium text-foreground">{formatCurrency(item.upfrontCost)}</p>
                            </div>
                          )}
                          {item.upfrontCost > 0 && item.paybackYears > 0 && item.paybackYears < Infinity && (
                            <div>
                              <p className="text-xs text-muted-foreground">Payback</p>
                              <p className="text-sm font-medium text-foreground">
                                {item.paybackYears > 20 ? '20+ years' : `${item.paybackYears} years`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Emissions */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Leaf className="h-4 w-4" />
              <span>
                Switching to electricity would also reduce your carbon emissions by{' '}
                <span className="font-medium text-foreground">{formatPercent(tceResult.emissions.reductionPercent)}</span>
                {' '}({Math.round(tceResult.emissions.reductionKgCO2e / 1000 * 10) / 10} tonnes CO2e/year)
              </span>
            </div>
          </div>

          {/* Power Circle Offers */}
          <PowerCircleOffers roadmap={tceResult.roadmap} input={tceResult.input} />

          {/* Methodology note */}
          <details className="text-center">
            <summary className="text-xs text-muted-foreground cursor-pointer inline-flex items-center gap-1 hover:text-foreground">
              <Info className="h-3 w-3" />
              How we calculate this
            </summary>
            <p className="text-xs text-muted-foreground mt-2 max-w-2xl mx-auto leading-relaxed">
              Calculations use the Rewiring Aotearoa household energy model with regional electricity rates from Powerswitch NZ (2025),
              petrol pricing from MBIE weekly monitoring, and appliance efficiency data from EECA GenLess.
              All figures are estimates based on typical NZ household consumption patterns. EV costs include road user charges at $76/1,000km.
              Actual costs may vary based on your specific usage, provider, and plan.
            </p>
          </details>

          {/* AI Chat starters */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>Ask the assistant about your results</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {starters.map(s => (
                <Button key={s} variant="outline" size="sm" className="text-xs" onClick={() => handleChatSubmit(s)}>
                  {s}
                </Button>
              ))}
            </div>
            <div className="max-w-lg mx-auto">
              <CommandBar onSubmit={handleChatSubmit} isLoading={false} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOTAL HOUSEHOLD COSTS ────────────────────────────────────── */}
      <section id="household-costs" className="py-16 px-4 md:px-6 bg-muted/20 border-t border-border scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <TotalCostView energyAnnualCost={tceResult.currentCosts.total} />
        </div>
      </section>

      {/* ─── SAVINGS PLAYBOOK ──────────────────────────────────────────── */}
      <section id="savings" className="py-16 px-4 md:px-6 border-t border-border scroll-mt-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Your Savings Playbook</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beyond energy, there are hundreds of ways to reduce your total household running costs.
              Each idea comes with an immediate action you can take.
            </p>
          </div>
          <SavingsPlaybook />
        </div>
      </section>

      {/* ─── SHAREABLE SUMMARY ─────────────────────────────────────────── */}
      <section className="py-16 px-4 md:px-6 bg-muted/20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <SavingsSummaryCard tceResult={tceResult} />
        </div>
      </section>

      {/* ─── EXISTING DASHBOARD ──────────────────────────────────────── */}
      <div className="border-t border-border">
        <Dashboard onRegisterNavigate={handleRegisterNavigate} />
      </div>

      {/* AI Chat Panel */}
      <ConversationPanel
        open={chatOpen}
        onOpenChange={setChatOpen}
        systemPrompt={systemPrompt}
        initialContext={chatContext}
      />
    </main>
  )
}
