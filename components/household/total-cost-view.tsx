'use client'

import { useMemo } from 'react'
import { CATEGORY_BENCHMARKS } from '@/lib/household-model'
import { CHART_COLORS } from '@/lib/chart-colors'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Zap, ShoppingCart, Home, Landmark, Shield, Car, Wifi, Heart } from 'lucide-react'
import type { SpendingCategory } from '@/lib/household-model'

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

const NZ_MEDIAN_INCOME = 70000

interface TotalCostViewProps {
  energyAnnualCost: number
}

export function TotalCostView({ energyAnnualCost }: TotalCostViewProps) {
  const categories = useMemo(() => {
    return CATEGORY_BENCHMARKS.map(bench => ({
      category: bench.category,
      label: bench.label,
      annualAmount: bench.category === 'energy'
        ? Math.round(energyAnnualCost) // Use actual TCE cost
        : bench.annualAverage,
    }))
      .filter(c => c.annualAmount > 0)
      .sort((a, b) => b.annualAmount - a.annualAmount)
  }, [energyAnnualCost])

  const totalAnnual = useMemo(() =>
    categories.reduce((sum, c) => sum + c.annualAmount, 0),
    [categories],
  )

  const totalMonthly = Math.round(totalAnnual / 12)
  const incomePercent = Math.round((totalAnnual / NZ_MEDIAN_INCOME) * 100)

  const chartData = categories.map(c => ({
    name: c.label,
    value: c.annualAmount,
    category: c.category,
  }))

  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="text-center space-y-3">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total household running costs</p>
        <p className="text-4xl md:text-5xl font-bold text-foreground">
          {formatCurrency(totalAnnual)}
          <span className="text-lg font-normal text-muted-foreground ml-2">per year</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(totalMonthly)}/month — approximately {formatPercent(incomePercent)} of NZ median income
        </p>
      </div>

      {/* Donut + Legend */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <Card>
          <CardContent className="py-6 px-4">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="75%"
                  paddingAngle={2}
                >
                  {chartData.map(entry => (
                    <Cell
                      key={entry.category}
                      fill={CHART_COLORS[entry.category as SpendingCategory] ?? 'var(--chart-8)'}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {categories.map(c => {
            const Icon = ICON_MAP[c.category as SpendingCategory] ?? Home
            const color = CHART_COLORS[c.category as SpendingCategory] ?? 'var(--chart-8)'
            const percent = Math.round((c.annualAmount / totalAnnual) * 100)
            const isEnergy = c.category === 'energy'
            return (
              <div
                key={c.category}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isEnergy ? 'bg-primary/5 border border-primary/20' : ''}`}
              >
                <div
                  className="h-8 w-8 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: color, opacity: 0.15 }}
                >
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{c.label}</p>
                    {isEnergy && <Badge variant="secondary" className="text-[10px]">Your actual cost</Badge>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-foreground">{formatCurrency(c.annualAmount)}</p>
                  <p className="text-xs text-muted-foreground">{percent}%</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Energy costs are calculated from your household profile. Other categories use NZ average benchmarks (Stats NZ HES 2023).
      </p>
    </div>
  )
}
