export const maxDuration = 60

// Demo responses for when no API key is configured
const demoResponses: Record<string, string> = {
  groceries: `The single biggest grocery saving for most NZ families is switching to Pak'nSave — Consumer NZ data shows it's consistently 15-20% cheaper than New World, saving around $700 a year for a typical household.

Beyond that, doing one big weekly shop instead of multiple trips is surprisingly effective. Those quick "top-up" shops at the dairy or New World tend to add $45-60/month in impulse purchases. Meal planning and a shopping list sound boring, but they genuinely cut food waste by 20-30%.`,

  insurance: `Insurance is where most Kiwi households are leaving the most money on the table. Sorted.org.nz found the average quote gap between providers is $610/year for car insurance, $894 for home, and $462 for contents. That's potentially $2,000+ a year just by comparing quotes.

The key is to shop around every year at renewal — not just accept the automatic increase. Also consider paying annually instead of monthly (saves fees), and raising your excess to $500 or $1,000 if you have savings to cover smaller claims.`,

  rates: `Council rates are one of the trickiest costs to reduce because they're largely non-negotiable. Most councils are putting through 8-15% increases in 2025/26, driven by infrastructure investment and climate adaptation.

Your main options are: check if you're eligible for the government Rates Rebate scheme (available to low-income homeowners via Work and Income), set up direct debit to spread payments across the year, and if you think your property's capital value is too high, you can lodge a formal rating objection — though that's rarely done.`,

  mortgage: `With the OCR now at 2.25% after six consecutive cuts, it's a good time to renegotiate your mortgage rate. The key is to compare across lenders, not just accept your bank's standard offer — even a 0.25% difference on a $400,000 mortgage saves over $1,000 a year.

Another effective strategy is switching to fortnightly payments instead of monthly. You end up making the equivalent of 13 monthly payments per year instead of 12, which can shorten your mortgage term by 2-3 years and save tens of thousands in interest.`,

  transport: `Transport is NZ's second-largest household cost after housing, averaging $251/week nationally. The Gaspy app shows real-time fuel prices at stations near you — the price gap between the cheapest and most expensive can be 20-30c/litre.

If you're commuting, working from home even 1-2 days a week saves roughly $15-25/week in fuel and parking. AA or Z fuel cards give consistent small discounts. For longer term, an EV cuts running costs by 75-80% — about 3-5c/km versus 15-20c/km for petrol.`,

  energy: `The quickest win for power bills is using Powerswitch.org.nz to compare electricity retailers — 94% of users find savings, typically $400-500 a year, and it takes about 10 minutes.

Beyond switching, the biggest home savings come from efficient heating. A heat pump set to 19-21 degrees with clean filters (every two months) is far cheaper than running a gas heater or old electric panel heater. Closing doors to rooms you're not using makes a noticeable difference too.`,

  biggest: `Looking at this household's costs, insurance stands out — it's risen 14% in the last year alone. The average NZ household can save $2,000-3,000 a year just by comparing insurance quotes across providers. That's the single biggest quick-win available.

After insurance, the grocery bill at $1,650/month is the next target. Switching from New World to Pak'nSave saves the average family ~$700/year, and consolidating to one weekly shop cuts impulse spending by another $500-700/year.

Combined, these two changes alone could save this family over $3,500 a year — without changing their lifestyle at all.`,

  savings: `Looking at your overall spending, the areas with the biggest savings potential are usually insurance (up to $2,000-3,000/yr by comparing quotes), groceries ($500-825/yr by switching supermarket and reducing trips), and energy ($400-500/yr via Powerswitch).

The key is to tackle one category at a time rather than trying to cut everything at once. Start with the highest-impact change — usually insurance comparison, since it takes 30 minutes and can save thousands. Then move to the next category each month.`,

  communications: `Broadband and mobile plans are one of those costs that creep up because most people set and forget. Use Broadband Compare (broadbandcompare.co.nz) to check if you're getting the best deal — plans change frequently and you might be on an old expensive one.

The main savings come from: bundling your mobile and broadband with one provider (often $10-20/month cheaper), checking if you're paying for data you don't use (many people are on unlimited plans when 40GB would be fine), and calling to renegotiate when your contract is up. Most providers will offer a better deal to keep you.`,

  healthcare: `Health costs are tricky because you don't want to cut corners on your wellbeing. But there are smart ways to manage them. If you have private health insurance, review it annually — many Kiwis are paying for specialist or surgical cover they rarely use when a simpler plan would save $50-100/month.

For everyday health costs, make the most of community services: free flu vaccinations through your GP for eligible groups, Pharmac-subsidised medications (most common prescriptions are $5), and community health centres which often have lower consultation fees than private GPs. ACC covers injuries, so you don't need private cover for those.`,

  default: `I'm your Genesis Savings Advisor! I can help you understand your household costs and find practical ways to save money across all your major expenses.

Try asking me about:
- **Groceries** — "How can I cut my food bill?"
- **Insurance** — "Am I paying too much for insurance?"
- **Energy** — "How do I reduce my power bill?"
- **Mortgage** — "Should I refinance?"
- **Transport** — "How can I save on fuel?"
- **Overall savings** — "Where's my biggest savings opportunity?"

I'm here to help you keep more of your money — without giving up the things you enjoy.`,
}

function getMessageText(messages: Array<{ role: string; parts?: Array<{ type: string; text?: string }>; content?: string }>): string {
  const last = messages[messages.length - 1]
  if (!last) return ''
  if (last.parts) {
    const textPart = last.parts.find((p) => p.type === 'text')
    return textPart?.text ?? ''
  }
  return last.content ?? ''
}

function getDemoResponse(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('biggest') || lower.includes('most') || lower.includes('where should') || lower.includes('priority') || lower.includes('first') || lower.includes('opportunity')) return demoResponses.biggest
  if (lower.includes('grocer') || lower.includes('food') || lower.includes('supermarket') || lower.includes('pak')) return demoResponses.groceries
  if (lower.includes('insur') || lower.includes('premium') || lower.includes('cover')) return demoResponses.insurance
  if (lower.includes('rate') || lower.includes('council') || lower.includes('property')) return demoResponses.rates
  if (lower.includes('mortgage') || lower.includes('home loan') || lower.includes('refinanc') || lower.includes('interest')) return demoResponses.mortgage
  if (lower.includes('transport') || lower.includes('fuel') || lower.includes('petrol') || lower.includes('car') || lower.includes('driv')) return demoResponses.transport
  if (lower.includes('broadband') || lower.includes('internet') || lower.includes('phone') || lower.includes('mobile') || lower.includes('commun')) return demoResponses.communications
  if (lower.includes('health') || lower.includes('doctor') || lower.includes('medical') || lower.includes('dentist') || lower.includes('pharmac')) return demoResponses.healthcare
  if (lower.includes('power') || lower.includes('electri') || lower.includes('energy') || lower.includes('heat')) return demoResponses.energy
  if (lower.includes('sav') || lower.includes('reduc') || lower.includes('cut') || lower.includes('spend') || lower.includes('cost') || lower.includes('budget') || lower.includes('money')) return demoResponses.savings
  return demoResponses.default
}

async function* streamWords(text: string): AsyncGenerator<string> {
  const words = text.split(' ')
  for (const word of words) {
    yield word + ' '
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 20))
  }
}

function createSSEResponse(textGenerator: AsyncGenerator<string>): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'message-start', id: crypto.randomUUID() })}\n\n`)
      )
      for await (const chunk of textGenerator) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'text-delta', delta: chunk })}\n\n`)
        )
      }
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'message-end' })}\n\n`)
      )
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

function demoModeResponse(messages: Array<{ role: string; parts?: Array<{ type: string; text?: string }> }>): Response {
  const text = getMessageText(messages)
  const response = '*[Demo mode — Claude not connected]*\n\n' + getDemoResponse(text)
  return createSSEResponse(streamWords(response))
}

export async function POST(request: Request) {
  const { messages, systemPrompt } = await request.json()

  // Check for Anthropic API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return demoModeResponse(messages)
  }

  try {
    // Claude mode — use Anthropic SDK
    const { createAnthropic } = await import('@ai-sdk/anthropic')
    const { streamText } = await import('ai')

    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt || 'You are Genesis Energy\'s Household Savings Advisor for New Zealand families.',
      messages: messages.map((m: { role: string; parts?: Array<{ type: string; text?: string }>; content?: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.parts ? m.parts.map((p) => p.text).join('') : m.content ?? '',
      })),
    })

    // Convert AI SDK stream to our SSE format
    const encoder = new TextEncoder()
    const aiStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'message-start', id: crypto.randomUUID() })}\n\n`)
        )
        for await (const textPart of (await result).textStream) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'text-delta', delta: textPart })}\n\n`)
          )
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'message-end' })}\n\n`)
        )
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new Response(aiStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Claude API error, falling back to demo mode:', error)
    return demoModeResponse(messages)
  }
}
