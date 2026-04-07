'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowDown, Leaf, TrendingDown, Zap } from 'lucide-react'
import type { TCEResult } from '@/lib/energy-model/types'
import { formatCurrency, formatPercent, formatTonnes } from '@/lib/format'
import { CostChart } from './cost-chart'
import { SavingsRoadmap } from './savings-roadmap'
import { BillTracker } from './bill-tracker'
import { generateBillHistory } from '@/lib/energy-model/bill-history'

interface TCEResultsProps {
  result: TCEResult
  onEdit: () => void
}

export function TCEResults({ result, onEdit }: TCEResultsProps) {
  return (
    <div className="space-y-6">
      {/* Hero Numbers */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <HeroStat
              label="Current annual cost"
              value={formatCurrency(result.currentCosts.total)}
              sublabel="/year"
              className="text-foreground"
            />
            <HeroStat
              label="Fully electrified"
              value={formatCurrency(result.electrifiedCosts.total)}
              sublabel="/year"
              className="text-primary"
            />
            <HeroStat
              label="You could save"
              value={formatCurrency(result.annualSavings)}
              sublabel={`/year (${formatPercent(result.savingsPercent)})`}
              className="text-green-600"
              icon={<TrendingDown className="h-5 w-5" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Savings Callout */}
      <div className="rounded-xl bg-accent px-4 py-3 text-center">
        <p className="text-sm text-accent-foreground">
          That&apos;s <span className="font-bold text-lg">{formatCurrency(result.monthlySavings)}/month</span> less on energy
        </p>
      </div>

      {/* Cost Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cost comparison by energy type</CardTitle>
        </CardHeader>
        <CardContent>
          <CostChart
            currentCosts={result.currentCosts}
            electrifiedCosts={result.electrifiedCosts}
          />
        </CardContent>
      </Card>

      {/* Per-Vector Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <BreakdownTile
          label="Electricity"
          current={result.currentCosts.electricity}
          electrified={result.electrifiedCosts.electricity}
          icon={<Zap className="h-4 w-4" />}
        />
        <BreakdownTile
          label="Gas"
          current={result.currentCosts.gas}
          electrified={result.electrifiedCosts.gas}
          icon={<span className="text-xs">🔥</span>}
        />
        <BreakdownTile
          label="Transport"
          current={result.currentCosts.transport}
          electrified={result.electrifiedCosts.transport}
          icon={<span className="text-xs">⛽</span>}
        />
      </div>

      {/* Bill Tracker */}
      <div id="bill-tracker">
        <BillTracker history={generateBillHistory(result.currentCosts)} />
      </div>

      {/* Emissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <Leaf className="h-4 w-4 text-green-600" />
            </div>
            <CardTitle className="text-sm font-medium">Carbon emissions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatTonnes(result.emissions.currentTonnes)}</p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
            <ArrowDown className="h-5 w-5 text-green-600 rotate-[-90deg]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatTonnes(result.emissions.electrifiedTonnes)}</p>
              <p className="text-xs text-muted-foreground">Electrified</p>
            </div>
            <div className="rounded-full bg-green-500/10 px-3 py-1">
              <p className="text-sm font-medium text-green-600">-{formatPercent(result.emissions.reductionPercent)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Roadmap */}
      {result.roadmap.length > 0 && (
        <SavingsRoadmap
          roadmap={result.roadmap}
          totalUpfrontCost={result.totalUpfrontCost}
        />
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onEdit} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Edit my profile
        </Button>
        {result.roadmap.length > 0 && (
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => document.getElementById('savings-roadmap')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See savings roadmap
            <ArrowDown className="h-4 w-4 ml-2 rotate-[-90deg]" />
          </Button>
        )}
      </div>
    </div>
  )
}

function HeroStat({
  label,
  value,
  sublabel,
  className,
  icon,
}: {
  label: string
  value: string
  sublabel: string
  className: string
  icon?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        {icon}
        <span className="text-3xl sm:text-4xl font-bold">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{sublabel}</p>
    </div>
  )
}

function BreakdownTile({
  label,
  current,
  electrified,
  icon,
}: {
  label: string
  current: number
  electrified: number
  icon: React.ReactNode
}) {
  const saving = current - electrified
  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-bold">{formatCurrency(current)}</span>
        <span className="text-sm text-muted-foreground">→ {formatCurrency(electrified)}</span>
      </div>
      {saving > 0 && (
        <p className="text-xs text-green-600">Save {formatCurrency(saving)}/yr</p>
      )}
    </div>
  )
}
