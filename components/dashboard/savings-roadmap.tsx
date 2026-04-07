'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Flame, Droplets, UtensilsCrossed, Car, Sun, TrendingDown } from 'lucide-react'
import type { SwitchRecommendation } from '@/lib/energy-model/types'
import { formatCurrency } from '@/lib/format'

const MAX_PAYBACK_YEARS = 50

const categoryIcons: Record<SwitchRecommendation['category'], React.ReactNode> = {
  'heating': <Flame className="h-4 w-4" />,
  'water-heating': <Droplets className="h-4 w-4" />,
  'cooktop': <UtensilsCrossed className="h-4 w-4" />,
  'vehicle': <Car className="h-4 w-4" />,
  'solar': <Sun className="h-4 w-4" />,
}

const categoryColours: Record<SwitchRecommendation['category'], string> = {
  'heating': 'bg-orange-500/10 text-orange-600',
  'water-heating': 'bg-blue-500/10 text-blue-600',
  'cooktop': 'bg-violet-500/10 text-violet-600',
  'vehicle': 'bg-green-500/10 text-green-600',
  'solar': 'bg-yellow-500/10 text-yellow-700',
}

interface SavingsRoadmapProps {
  roadmap: SwitchRecommendation[]
  totalUpfrontCost: number
}

export function SavingsRoadmap({ roadmap, totalUpfrontCost }: SavingsRoadmapProps) {
  const recommended = roadmap.filter(
    (r) => r.paybackYears === 0 || r.paybackYears <= MAX_PAYBACK_YEARS
  )

  if (recommended.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Your home is already well-optimised — no switches recommended.
          </p>
        </CardContent>
      </Card>
    )
  }

  const totalAnnualSaving = recommended.reduce((sum, r) => sum + r.annualSaving, 0)

  return (
    <Card id="savings-roadmap">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <TrendingDown className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium">Your savings roadmap</CardTitle>
            <p className="text-xs text-muted-foreground">Sorted by best return on investment</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommended.map((item, index) => (
          <RoadmapItem key={item.category + index} item={item} index={index} />
        ))}

        <Separator />

        {/* Cumulative Summary */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-sm font-medium">Total potential savings</p>
            {totalUpfrontCost > 0 && (
              <p className="text-xs text-muted-foreground">
                Investment: {formatCurrency(totalUpfrontCost)}
              </p>
            )}
          </div>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(totalAnnualSaving)}/yr
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function RoadmapItem({ item, index }: { item: SwitchRecommendation; index: number }) {
  const icon = categoryIcons[item.category]
  const colourClass = categoryColours[item.category]
  const isVehicle = item.category === 'vehicle'

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      {/* Priority Badge */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-6 w-6 items-center justify-center rounded ${colourClass}`}>
            {icon}
          </span>
          <span className="text-sm font-medium">{item.title}</span>
        </div>
        <p className="text-xs text-muted-foreground">{item.description}</p>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
          {item.upfrontCost > 0 && (
            <span className="text-xs text-muted-foreground">
              Cost: <span className="font-medium text-foreground">{formatCurrency(item.upfrontCost)}</span>
            </span>
          )}
          <span className="text-xs text-green-600">
            Saves: <span className="font-medium">{formatCurrency(item.annualSaving)}/yr</span>
          </span>
          {!isVehicle && item.upfrontCost > 0 && item.paybackYears > 0 && (
            <span className="text-xs text-muted-foreground">
              Payback: <span className="font-medium text-foreground">{item.paybackYears} yrs</span>
            </span>
          )}
          {isVehicle && (
            <span className="text-xs text-muted-foreground italic">Running cost savings</span>
          )}
        </div>
      </div>
    </div>
  )
}
