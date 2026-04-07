export const maxDuration = 60

interface ReceiptResult {
  merchant: string
  amount: number
  category: string
  date: string
  confidence: number
}

const DEMO_RECEIPTS: ReceiptResult[] = [
  { merchant: 'Countdown Riccarton', amount: 127.43, category: 'groceries', date: '2026-04-05', confidence: 0.95 },
  { merchant: 'Z Energy Moorhouse Ave', amount: 94.60, category: 'transport', date: '2026-04-04', confidence: 0.92 },
  { merchant: 'Spark NZ', amount: 89.00, category: 'communications', date: '2026-04-01', confidence: 0.98 },
]

let demoIndex = 0

export async function POST(request: Request) {
  const { imageBase64, mimeType } = await request.json()

  if (!imageBase64) {
    return Response.json({ error: 'No image provided' }, { status: 400 })
  }

  // Demo mode — no API key
  if (!process.env.ANTHROPIC_API_KEY) {
    await new Promise((r) => setTimeout(r, 1500))
    const result = DEMO_RECEIPTS[demoIndex % DEMO_RECEIPTS.length]
    demoIndex++
    return Response.json({ ...result, demo: true })
  }

  try {
    const { createAnthropic } = await import('@ai-sdk/anthropic')
    const { generateText } = await import('ai')

    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const { text } = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Extract the merchant name, total amount in NZD, date, and spending category from this receipt photo. Return ONLY valid JSON with these exact keys:
{
  "merchant": "Store Name",
  "amount": 123.45,
  "category": "groceries",
  "date": "2026-04-05",
  "confidence": 0.95
}
Category MUST be one of: energy, groceries, mortgage, rates, insurance, transport, communications, healthcare.
If you cannot determine a field, use your best guess. Confidence should reflect how sure you are (0-1).`,
            },
            {
              type: 'image',
              image: imageBase64,
              mediaType: mimeType || 'image/jpeg',
            },
          ],
        },
      ],
    })

    // Parse the JSON response — Claude may wrap it in markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: 'Could not parse receipt data' }, { status: 422 })
    }

    const result = JSON.parse(jsonMatch[0]) as ReceiptResult
    return Response.json(result)
  } catch (error) {
    console.error('Receipt scan error:', error)
    // Fall back to demo mode on error
    const result = DEMO_RECEIPTS[demoIndex % DEMO_RECEIPTS.length]
    demoIndex++
    return Response.json({ ...result, demo: true })
  }
}
