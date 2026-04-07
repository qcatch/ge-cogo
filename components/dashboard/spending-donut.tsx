'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { CategorySpending } from '@/lib/household-model/types'
import { CHART_COLORS } from '@/lib/chart-colors'
import { formatCurrency } from '@/lib/format'

interface SpendingDonutProps {
  categories: CategorySpending[]
  totalMonthly: number
  onCategoryClick?: (category: CategorySpending) => void
}

function CustomTooltip({ active, payload }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { label: string; monthlyAmount: number; percentOfTotal: number } }>
}) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-foreground">{item.label}</p>
      <p className="text-muted-foreground">{formatCurrency(item.monthlyAmount)}/mo ({item.percentOfTotal}%)</p>
    </div>
  )
}

export function SpendingDonut({ categories, totalMonthly, onCategoryClick }: SpendingDonutProps) {
  const data = categories
    .filter((c) => c.monthlyAmount > 0)
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount)

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="monthlyAmount"
            nameKey="label"
            cx="50%"
            cy="45%"
            innerRadius="50%"
            outerRadius="75%"
            strokeWidth={2}
            stroke="var(--background)"
          >
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={CHART_COLORS[entry.category]}
                className={onCategoryClick ? 'cursor-pointer' : ''}
                onClick={() => onCategoryClick?.(entry)}
              />
            ))}
          </Pie>
          {/* Center label */}
          <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-xl font-bold">
            {formatCurrency(totalMonthly)}
          </text>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
            per month
          </text>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
