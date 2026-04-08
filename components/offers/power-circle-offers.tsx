'use client'

import type { SwitchRecommendation, HouseholdInput } from '@/lib/energy-model'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Car, Flame, Thermometer, Sun, Utensils, ChevronRight } from 'lucide-react'

interface OfferConfig {
  matchKey: string
  title: string
  subtitle: string
  icon: React.ElementType
  ctaLabel: string
}

const OFFER_MAP: OfferConfig[] = [
  { matchKey: 'EV', title: 'Genesis EV Plan', subtitle: 'Switch to electric driving', icon: Car, ctaLabel: 'Explore EV plans' },
  { matchKey: 'Heat Pump (Heating)', title: 'Genesis Heat Pump', subtitle: 'Efficient home heating', icon: Thermometer, ctaLabel: 'Get a heat pump quote' },
  { matchKey: 'Heat Pump Hot Water', title: 'Genesis Hot Water', subtitle: 'Heat pump hot water cylinder', icon: Flame, ctaLabel: 'Upgrade hot water' },
  { matchKey: 'Induction Cooktop', title: 'Genesis Induction', subtitle: 'Modern electric cooking', icon: Utensils, ctaLabel: 'Switch to induction' },
  { matchKey: 'Solar', title: 'Genesis Solar', subtitle: 'Generate your own power', icon: Sun, ctaLabel: 'Explore solar options' },
]

function matchOffer(item: SwitchRecommendation): OfferConfig | undefined {
  return OFFER_MAP.find(o => item.appliance.includes(o.matchKey))
}

interface PowerCircleOffersProps {
  roadmap: SwitchRecommendation[]
  input: HouseholdInput
}

export function PowerCircleOffers({ roadmap }: PowerCircleOffersProps) {
  const offers = roadmap
    .map(item => ({ item, config: matchOffer(item) }))
    .filter((o): o is { item: SwitchRecommendation; config: OfferConfig } => o.config !== undefined)

  if (offers.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Genesis Power Circle Offers</h3>
        <p className="text-sm text-muted-foreground">Personalised recommendations based on your household profile</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {offers.map(({ item, config }) => {
          const Icon = config.icon
          return (
            <Card key={item.appliance} className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="py-4 px-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{config.title}</p>
                        <Badge variant="secondary" className="text-xs">Power Circle</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{config.subtitle}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">
                      Save {formatCurrency(item.annualSaving)}/year
                      {item.upfrontCost > 0 && item.paybackYears > 0 && item.paybackYears < Infinity && (
                        <span className="font-normal text-muted-foreground"> — pays back in {item.paybackYears > 20 ? '20+' : item.paybackYears} years</span>
                      )}
                    </p>
                    <Button variant="outline" size="sm" className="mt-1">
                      {config.ctaLabel}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
