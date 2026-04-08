'use client'

import { useRef, useState } from 'react'
import type { TCEResult } from '@/lib/energy-model'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Check, Zap, Leaf } from 'lucide-react'

interface SavingsSummaryCardProps {
  tceResult: TCEResult
}

export function SavingsSummaryCard({ tceResult }: SavingsSummaryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  async function handleDownload() {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'genesis-energy-savings.png'
      link.href = dataUrl
      link.click()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2000)
    } catch {
      // Fallback: ignore — user can screenshot
    } finally {
      setDownloading(false)
    }
  }

  const top3 = tceResult.roadmap.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground">Share Your Savings</h3>
        <p className="text-sm text-muted-foreground">Download your personalised savings summary</p>
      </div>

      {/* The shareable card */}
      <div ref={cardRef} className="max-w-md mx-auto">
        <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/10 border-primary/20">
          <CardContent className="py-6 px-6 space-y-5">
            {/* Genesis branding */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Genesis Energy</p>
                <p className="text-[10px] text-muted-foreground">Cost of Living Assistant</p>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">This household could save</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(tceResult.annualSavings)}</p>
              <p className="text-sm text-muted-foreground">per year by switching to electricity</p>
            </div>

            {/* Current vs electrified */}
            <div className="flex justify-between text-center border-t border-b border-border py-3">
              <div>
                <p className="text-xs text-muted-foreground">Current energy cost</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(Math.round(tceResult.currentCosts.total))}/yr</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fully electrified</p>
                <p className="text-lg font-semibold text-primary">{formatCurrency(Math.round(tceResult.electrifiedCosts.total))}/yr</p>
              </div>
            </div>

            {/* Top actions */}
            {top3.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Top actions</p>
                {top3.map(item => (
                  <div key={item.appliance} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.appliance}</span>
                    <Badge variant="outline" className="text-xs">{formatCurrency(item.annualSaving)}/yr</Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Emissions */}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Leaf className="h-3 w-3" />
              <span>{formatPercent(tceResult.emissions.reductionPercent)} less carbon emissions</span>
            </div>

            {/* Date */}
            <p className="text-[10px] text-muted-foreground text-center">
              genesis.co.nz/cost-of-living — {new Date().toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Download button */}
      <div className="text-center">
        <Button onClick={handleDownload} disabled={downloading} variant="outline">
          {downloaded ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Downloaded
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {downloading ? 'Generating...' : 'Download as image'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
