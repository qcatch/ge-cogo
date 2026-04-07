'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format'
import {
  Camera, Loader2, CheckCircle2, AlertCircle,
  Zap, ShoppingCart, Home, Landmark, Shield, Car, Wifi, Heart,
} from 'lucide-react'

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'energy': Zap, 'groceries': ShoppingCart, 'mortgage': Home,
  'rates': Landmark, 'insurance': Shield, 'transport': Car,
  'communications': Wifi, 'healthcare': Heart,
}

const CATEGORY_LABEL_MAP: Record<string, string> = {
  'energy': 'Energy', 'groceries': 'Groceries', 'mortgage': 'Housing',
  'rates': 'Council Rates', 'insurance': 'Insurance', 'transport': 'Transport',
  'communications': 'Communications', 'healthcare': 'Healthcare',
}

interface ReceiptResult {
  merchant: string
  amount: number
  category: string
  date: string
  confidence: number
  demo?: boolean
}

interface ReceiptScannerProps {
  onAddExpense?: (category: string, amount: number, merchant: string) => void
}

export function ReceiptScanner({ onAddExpense }: ReceiptScannerProps) {
  const [added, setAdded] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ReceiptResult | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setResult(null)
    setAdded(false)
    setScanning(true)

    // Create preview
    setPreview(URL.createObjectURL(file))

    try {
      // Read as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          resolve(dataUrl.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // POST to API
      const res = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
      })

      if (!res.ok) {
        throw new Error('Scan failed')
      }

      const data = await res.json() as ReceiptResult
      if (data.merchant) {
        setResult(data)
      } else {
        setError('Could not read receipt. Try a clearer photo.')
      }
    } catch {
      setError('Could not read receipt. Try a clearer photo.')
    } finally {
      setScanning(false)
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const CatIcon = result ? (CATEGORY_ICON_MAP[result.category] ?? ShoppingCart) : ShoppingCart
  const catLabel = result ? (CATEGORY_LABEL_MAP[result.category] ?? result.category) : ''

  return (
    <Card>
      <CardContent className="py-4 px-4 space-y-4">
        {/* Upload Area */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Scan a receipt</p>
            <p className="text-xs text-muted-foreground">
              Take a photo or upload an image to automatically extract expense details
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
            >
              {scanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {scanning ? 'Scanning...' : 'Upload'}
            </Button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
            {/* Thumbnail */}
            {preview && (
              <img
                src={preview}
                alt="Receipt"
                className="h-16 w-12 rounded object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <p className="text-sm font-medium text-foreground truncate">{result.merchant}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-foreground">{formatCurrency(result.amount)}</p>
                <Badge variant="outline" className="text-[10px] gap-1">
                  <CatIcon className="h-3 w-3" />
                  {catLabel}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{result.date}</p>
              {result.demo && (
                <p className="text-[10px] text-muted-foreground italic">Demo mode — simulated extraction</p>
              )}
            </div>
            <Button
              variant={added ? 'secondary' : 'outline'}
              size="sm"
              disabled={added || !onAddExpense}
              className="shrink-0 text-xs"
              onClick={() => {
                if (result && onAddExpense) {
                  onAddExpense(result.category, result.amount, result.merchant)
                  setAdded(true)
                }
              }}
            >
              {added ? 'Added' : 'Add to expenses'}
            </Button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
