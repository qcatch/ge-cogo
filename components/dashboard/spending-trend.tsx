'use client'

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { HouseholdSpending, SpendingCategory } from '@/lib/household-model/types'
import { generateSpendingHistory, CATEGORY_LABELS } from '@/lib/household-model'
import { CHART_COLORS, CHART_CATEGORY_ORDER } from '@/lib/chart-colors'
import { formatCurrencyShort, formatCurrency } from '@/lib/format'

interface SpendingTrendProps {
  spending: HouseholdSpending
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((sum, p) => sum + p.value, 0)
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-md max-w-[200px]">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.filter((p) => p.value > 0).map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-3">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-muted-foreground">{formatCurrency(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-border mt-1 pt-1 flex items-center justify-between gap-3 font-semibold text-foreground">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}

export function SpendingTrend({ spending }: SpendingTrendProps) {
  const history = generateSpendingHistory(spending)

  // Transform Record<SpendingCategory, number> into flat keys for Recharts
  const data = history.map((record) => ({
    monthShort: record.monthShort,
    ...record.categories,
  }))

  // Only render areas for categories with non-zero spending
  const activeCategories = CHART_CATEGORY_ORDER.filter((cat) =>
    spending.categories.some((c) => c.category === cat && c.monthlyAmount > 0)
  )

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            {activeCategories.map((cat) => (
              <linearGradient key={cat} id={`trend-${cat}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS[cat]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={CHART_COLORS[cat]} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
          <XAxis
            dataKey="monthShort"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => formatCurrencyShort(v)}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-foreground">{value}</span>
            )}
          />
          {activeCategories.map((cat) => (
            <Area
              key={cat}
              type="monotone"
              dataKey={cat}
              name={CATEGORY_LABELS[cat]}
              stackId="spending"
              stroke={CHART_COLORS[cat]}
              strokeWidth={1.5}
              fill={`url(#trend-${cat})`}
              fillOpacity={1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
