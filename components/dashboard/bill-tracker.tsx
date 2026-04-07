'use client'

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import type { MonthlyBill } from '@/lib/energy-model/bill-history'
import { formatCurrency } from '@/lib/format'

interface BillTrackerProps {
  history: MonthlyBill[]
}

export function BillTracker({ history }: BillTrackerProps) {
  if (history.length < 2) return null

  const current = history[history.length - 1]
  const previous = history[history.length - 2]
  const trend = current.total - previous.total
  const trendPercent = previous.total > 0 ? Math.round((trend / previous.total) * 100) : 0
  const isUp = trend > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
            <Calendar className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium">Your energy spend over 12 months</CardTitle>
            <p className="text-xs text-muted-foreground">Simulated from your current profile</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="transportGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="monthShort"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-lg border border-border bg-card p-2 shadow-sm text-xs">
                    <p className="font-medium mb-1">{label}</p>
                    {payload.map((entry) => (
                      <div key={entry.dataKey as string} className="flex justify-between gap-4">
                        <span style={{ color: entry.color }}>{entry.name}</span>
                        <span className="font-medium">{formatCurrency(entry.value as number)}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="electricity"
              name="Electricity"
              stackId="1"
              stroke="var(--chart-1)"
              fill="url(#elecGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="gas"
              name="Gas"
              stackId="1"
              stroke="var(--chart-2)"
              fill="url(#gasGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="transport"
              name="Transport"
              stackId="1"
              stroke="var(--chart-5)"
              fill="url(#transportGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Current Month Summary */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">{current.month} (estimated)</p>
            <p className="text-lg font-bold">{formatCurrency(current.total)}</p>
          </div>
          <div className={`flex items-center gap-1 text-sm ${isUp ? 'text-destructive' : 'text-green-600'}`}>
            {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-medium">
              {isUp ? '+' : ''}{trendPercent}% vs {previous.monthShort}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
