'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Cell, Tooltip } from 'recharts'
import type { EnergyBreakdown } from '@/lib/energy-model/types'
import { formatCurrency } from '@/lib/format'

interface CostChartProps {
  currentCosts: EnergyBreakdown
  electrifiedCosts: EnergyBreakdown
}

export function CostChart({ currentCosts, electrifiedCosts }: CostChartProps) {
  const data = [
    {
      name: 'Electricity',
      current: currentCosts.electricity,
      electrified: electrifiedCosts.electricity,
    },
    {
      name: 'Gas',
      current: currentCosts.gas,
      electrified: electrifiedCosts.gas,
    },
    {
      name: 'Transport',
      current: currentCosts.transport,
      electrified: electrifiedCosts.transport,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
        <XAxis
          type="number"
          tickFormatter={(v: number) => formatCurrency(v)}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 13 }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name === 'current' ? 'Current' : 'Electrified',
          ]}
          contentStyle={{
            borderRadius: '0.5rem',
            border: '1px solid var(--border)',
            background: 'var(--card)',
            fontSize: '13px',
          }}
        />
        <Legend
          formatter={(value: string) => (value === 'current' ? 'Current' : 'Electrified')}
          wrapperStyle={{ fontSize: '13px' }}
        />
        <Bar dataKey="current" fill="var(--chart-3)" radius={[0, 4, 4, 0]} barSize={20} />
        <Bar dataKey="electrified" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}
