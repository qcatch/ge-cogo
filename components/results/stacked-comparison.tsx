'use client'

import type { EnergyBreakdown } from '@/lib/energy-model'
import { formatCurrency } from '@/lib/format'

interface StackedComparisonProps {
  currentCosts: EnergyBreakdown
  electrifiedCosts: EnergyBreakdown
  annualSavings: number
}

interface Segment {
  label: string
  amount: number
  className: string
  textClassName: string
}

function buildSegments(costs: EnergyBreakdown): Segment[] {
  const segments: Segment[] = []
  // Top to bottom: Petrol → Gas → Electricity (matching mockup order)
  if (costs.petrol > 0) {
    segments.push({ label: 'Petrol', amount: costs.petrol, className: 'bg-foreground', textClassName: 'text-white' })
  }
  if (costs.gas > 0) {
    segments.push({ label: 'Gas', amount: costs.gas, className: 'bg-accent', textClassName: 'text-foreground' })
  }
  if (costs.electricity > 0) {
    segments.push({ label: 'Electricity', amount: costs.electricity, className: 'bg-primary', textClassName: 'text-white' })
  }
  if (costs.vehicleRuc > 0) {
    segments.push({ label: 'Vehicle RUC', amount: costs.vehicleRuc, className: 'bg-muted-foreground', textClassName: 'text-white' })
  }
  return segments
}

export function StackedComparison({ currentCosts, electrifiedCosts, annualSavings }: StackedComparisonProps) {
  const maxTotal = Math.max(currentCosts.total, electrifiedCosts.total + annualSavings)
  const barHeight = 400

  const currentSegments = buildSegments(currentCosts)
  const electrifiedSegments = buildSegments(electrifiedCosts)

  const savingsPct = maxTotal > 0 ? (annualSavings / maxTotal) * 100 : 0

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-stretch justify-center">
      {/* Left: Current Total Energy Costs */}
      <div className="flex-1 max-w-[280px] mx-auto sm:mx-0 space-y-3">
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Current Total<br />Energy Costs</p>
          <p className="text-3xl font-bold text-foreground mt-1">
            {formatCurrency(Math.round(currentCosts.total))}
            <span className="text-sm font-normal text-muted-foreground ml-1">/ year</span>
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg" style={{ height: `${barHeight}px` }}>
          {currentSegments.map((seg) => {
            const pct = maxTotal > 0 ? (seg.amount / maxTotal) * 100 : 0
            return (
              <div
                key={seg.label}
                className={`${seg.className} flex items-center justify-center px-2`}
                style={{ height: `${pct}%` }}
              >
                {pct > 8 && (
                  <div className={`text-center ${seg.textClassName}`}>
                    <p className="font-semibold text-sm">{seg.label}</p>
                    <p className="text-xs opacity-90">{formatCurrency(Math.round(seg.amount))} / year</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Fully Electrified */}
      <div className="flex-1 max-w-[280px] mx-auto sm:mx-0 space-y-3">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Fully Electrified</p>
          <p className="text-3xl font-bold text-primary mt-1">
            {formatCurrency(Math.round(electrifiedCosts.total))}
            <span className="text-sm font-normal text-muted-foreground ml-1">/ year</span>
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg" style={{ height: `${barHeight}px` }}>
          {/* Savings gap at top */}
          {annualSavings > 0 && (
            <div
              className="border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center px-2"
              style={{ height: `${savingsPct}%` }}
            >
              {savingsPct > 8 && (
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground">Annual Savings</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(Math.round(annualSavings))}</p>
                </div>
              )}
            </div>
          )}
          {/* Electrified cost segments */}
          {electrifiedSegments.map((seg) => {
            const pct = maxTotal > 0 ? (seg.amount / maxTotal) * 100 : 0
            return (
              <div
                key={seg.label}
                className={`${seg.className} flex items-center justify-center px-2`}
                style={{ height: `${pct}%` }}
              >
                {pct > 8 && (
                  <div className={`text-center ${seg.textClassName}`}>
                    <p className="font-semibold text-sm">{seg.label}</p>
                    <p className="text-xs opacity-90">{formatCurrency(Math.round(seg.amount))} / year</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
