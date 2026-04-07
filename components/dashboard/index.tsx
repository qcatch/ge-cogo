'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { DEMO_PROFILES, NZ_AVERAGE_WEEKLY_TOTAL } from '@/lib/household-model'
import type { HouseholdSpending, SpendingCategory, CategorySpending } from '@/lib/household-model/types'
import { buildHouseholdSystemPrompt, buildDefaultSystemPrompt, generateConversationStarters } from '@/lib/household-context'
import { formatCurrency, formatPercent } from '@/lib/format'
import { ConversationPanel } from '@/components/ai/conversation-panel'
import { CommandBar } from '@/components/ai/command-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SpendingDonut } from './spending-donut'
import { SpendingTrend } from './spending-trend'
import { CategoryCard } from './category-card'
import { ConversationStarters } from './conversation-starters'
import { ReceiptScanner } from './receipt-scanner'
import { ProfileSwitcher } from './profile-switcher'
import { DollarSign, CalendarDays, Percent } from 'lucide-react'

// NZ averages for hero stat benchmarks
const NZ_AVG_MONTHLY = Math.round(NZ_AVERAGE_WEEKLY_TOTAL * 4.33)
const NZ_AVG_ANNUAL = Math.round(NZ_AVERAGE_WEEKLY_TOTAL * 52)

interface DashboardProps {
  onRegisterNavigate?: (handler: (target: string) => void) => void
}

export function Dashboard({ onRegisterNavigate }: DashboardProps) {
  const [profileKey, setProfileKey] = useState('christchurch-family')
  const [transitioning, setTransitioning] = useState(false)
  const [expenseAdjustments, setExpenseAdjustments] = useState<Record<SpendingCategory, number>>({} as Record<SpendingCategory, number>)

  // Build spending from base profile + any added expenses
  const spending: HouseholdSpending = useMemo(() => {
    const base = DEMO_PROFILES[profileKey]
    const hasAdjustments = Object.values(expenseAdjustments).some((v) => v > 0)
    if (!hasAdjustments) return base

    const categories = base.categories.map((cat) => {
      const adj = expenseAdjustments[cat.category] ?? 0
      if (adj === 0) return cat
      const newMonthly = cat.monthlyAmount + adj
      return { ...cat, monthlyAmount: newMonthly, annualAmount: newMonthly * 12 }
    })
    const totalMonthly = categories.reduce((sum, c) => sum + c.monthlyAmount, 0)
    const totalAnnual = totalMonthly * 12
    // Recalculate percentages
    const withPercent = categories.map((c) => ({
      ...c,
      percentOfTotal: totalMonthly > 0 ? Math.round((c.monthlyAmount / totalMonthly) * 100) : 0,
    }))
    return { ...base, categories: withPercent, totalMonthly, totalAnnual }
  }, [profileKey, expenseAdjustments])

  // Chat state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState('')

  const systemPrompt = spending
    ? buildHouseholdSystemPrompt(spending)
    : buildDefaultSystemPrompt()

  // Profile switch handler
  function handleProfileChange(key: string) {
    setTransitioning(true)
    setChatOpen(false)
    setChatContext('')
    setExpenseAdjustments({} as Record<SpendingCategory, number>)
    setTimeout(() => {
      setProfileKey(key)
      setTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 150)
  }

  function handleAddExpense(category: string, amount: number) {
    setExpenseAdjustments((prev) => ({
      ...prev,
      [category]: (prev[category as SpendingCategory] ?? 0) + amount,
    }))
  }

  function handleCategoryAsk(question: string) {
    handleCommandSubmit(question)
  }

  function handleDonutClick(cat: CategorySpending) {
    handleCommandSubmit(`How can I reduce my ${formatCurrency(cat.monthlyAmount)}/month ${cat.label.toLowerCase()} costs?`)
  }

  const handleNavigate = useCallback((target: string) => {
    if (target === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(target)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  useEffect(() => {
    if (onRegisterNavigate) {
      onRegisterNavigate(handleNavigate)
    }
  }, [onRegisterNavigate, handleNavigate])

  function handleCommandSubmit(text: string) {
    setChatContext(text)
    setChatOpen(true)
  }

  const activeCategories = spending.categories.filter((c) => c.monthlyAmount > 0)
  const incomePercent = Math.round((spending.totalAnnual / spending.profile.annualIncome) * 100)
  const starters = generateConversationStarters(spending)

  return (
    <div className="flex-1 overflow-auto">
      <div
        id="dashboard"
        className={`max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6 transition-opacity duration-200 ${transitioning ? 'opacity-40' : 'opacity-100'}`}
      >
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Where does your money go?
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {spending.profile.description}
          </p>
          {/* Profile Switcher */}
          <div className="flex justify-center">
            <ProfileSwitcher
              profiles={DEMO_PROFILES}
              activeKey={profileKey}
              onSelect={handleProfileChange}
            />
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card>
            <CardContent className="py-4 px-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(spending.totalMonthly)}</p>
                <p className="text-xs text-muted-foreground">per month</p>
                <p className="text-[10px] text-muted-foreground">NZ avg: {formatCurrency(NZ_AVG_MONTHLY)}/mo</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 px-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <CalendarDays className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(spending.totalAnnual)}</p>
                <p className="text-xs text-muted-foreground">per year</p>
                <p className="text-[10px] text-muted-foreground">NZ avg: {formatCurrency(NZ_AVG_ANNUAL)}/yr</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 px-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <Percent className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatPercent(incomePercent)}</p>
                <p className="text-xs text-muted-foreground">of gross income</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts — Tabbed */}
        <div id="spending">
          <Tabs defaultValue="overview">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Spending Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingDonut categories={activeCategories} totalMonthly={spending.totalMonthly} onCategoryClick={handleDonutClick} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="trends">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">12-Month Spending Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingTrend spending={spending} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Category Cards */}
        <div id="insights">
          <h2 className="text-lg font-semibold text-foreground mb-3">Cost Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeCategories
              .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
              .map((cat) => (
                <CategoryCard key={cat.category} spending={cat} onAskAdvisor={handleCategoryAsk} />
              ))}
          </div>
        </div>

        {/* Receipt Scanner */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Scan a Receipt</h2>
          <ReceiptScanner onAddExpense={handleAddExpense} />
        </div>

        {/* Conversation Starters */}
        <ConversationStarters starters={starters} onSelect={handleCommandSubmit} />

        {/* Command Bar */}
        <CommandBar
          onSubmit={handleCommandSubmit}
          isLoading={false}
        />

        {/* Footer */}
        <footer className="border-t border-border pt-6 pb-2 mt-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-4 h-4" aria-label="Genesis Energy">
                  <path d="M20 8 L32 18 L26 18 L32 28 L24 28 L28 32 L8 20 L16 20 L10 14 L18 14 Z" fill="white" fillRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-medium text-foreground">Genesis Energy</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Cost of Living Advisor &middot; Prototype &middot; April 2026
            </p>
            <p className="text-[10px] text-muted-foreground">
              Powered by AI &middot; Helping Kiwi households keep more of their money
            </p>
          </div>
        </footer>
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
