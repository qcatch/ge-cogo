'use client'

import type { CategorySpending, SpendingCategory } from '@/lib/household-model/types'
import { CATEGORY_BENCHMARKS } from '@/lib/household-model'
import { CHART_COLORS } from '@/lib/chart-colors'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Zap, ShoppingCart, Home, Landmark, Shield, Car, Wifi, Heart,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react'

const ICON_MAP: Record<SpendingCategory, React.ElementType> = {
  'energy': Zap,
  'groceries': ShoppingCart,
  'mortgage': Home,
  'rates': Landmark,
  'insurance': Shield,
  'transport': Car,
  'communications': Wifi,
  'healthcare': Heart,
}

interface CategoryCardProps {
  spending: CategorySpending
  onAskAdvisor?: (question: string) => void
}

export function CategoryCard({ spending: cat, onAskAdvisor }: CategoryCardProps) {
  const Icon = ICON_MAP[cat.category]
  const TrendIcon = cat.trend === 'up' ? TrendingUp : cat.trend === 'down' ? TrendingDown : Minus
  const trendVariant = cat.trend === 'up' ? 'destructive' : cat.trend === 'down' ? 'secondary' : 'outline'
  const chartColor = CHART_COLORS[cat.category]

  // NZ benchmark comparison
  const benchmark = CATEGORY_BENCHMARKS.find((b) => b.category === cat.category)
  let benchmarkText = ''
  if (benchmark && benchmark.monthlyAverage > 0) {
    const diff = ((cat.monthlyAmount - benchmark.monthlyAverage) / benchmark.monthlyAverage) * 100
    const absDiff = Math.abs(Math.round(diff))
    benchmarkText = diff > 5 ? `${absDiff}% above NZ avg` : diff < -5 ? `${absDiff}% below NZ avg` : 'Near NZ avg'
  }

  function handleClick() {
    if (!onAskAdvisor) return
    onAskAdvisor(`How can I reduce my ${formatCurrency(cat.monthlyAmount)}/month ${cat.label.toLowerCase()} costs?`)
  }

  return (
    <Card
      className={onAskAdvisor ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''}
      onClick={handleClick}
    >
      <CardContent className="py-3 px-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: chartColor, opacity: 0.15 }}
            >
              <Icon className="h-4 w-4" style={{ color: chartColor }} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{cat.label}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(cat.annualAmount)}/yr</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{formatCurrency(cat.monthlyAmount)}</p>
            <p className="text-xs text-muted-foreground">{cat.percentOfTotal}% of total</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <Progress value={cat.percentOfTotal} className="h-1.5" />
          {/* Overlay the colour on the indicator */}
          <div
            className="absolute inset-0 h-1.5 rounded-full overflow-hidden pointer-events-none"
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${cat.percentOfTotal}%`,
                backgroundColor: chartColor,
              }}
            />
          </div>
        </div>

        {/* Trend + benchmark row */}
        <div className="flex items-center justify-between">
          <Badge variant={trendVariant} className="text-[10px] px-1.5 py-0">
            <TrendIcon className="h-3 w-3" />
            {formatPercent(Math.abs(cat.trendPercent))} YoY
          </Badge>
          {benchmarkText && (
            <span className="text-[10px] text-muted-foreground">{benchmarkText}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
