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

  // TCE-specific responses
  ev: `Switching to an EV is one of the biggest energy savings available to NZ households. At current prices, charging an EV at home costs roughly 14-15 cents per km (including road user charges at $76/1,000km), compared to about 28 cents per km for a petrol car.

For a household driving 210km per week, that's a saving of around $1,400-1,800 per year on fuel alone — before you factor in lower maintenance costs (no oil changes, brake pads last longer, fewer moving parts). NZ's electricity is 85%+ renewable, so you're also cutting your transport emissions by 60-80%.

Genesis offers EV-friendly electricity plans with cheaper overnight charging rates. If you're considering the switch, start by checking which EV models fit your driving needs and budget on the EECA Vehicle Total Cost of Ownership Calculator.`,

  solar: `Solar is a strong investment for most NZ homeowners. A typical 5kW system costs around $9,000 installed and generates roughly $1,600/year in electricity value — giving you a payback period of about 5-6 years.

From July 2026, all major NZ electricity retailers will be required to offer fair buyback rates for exported solar electricity. This is expected to improve solar economics further, especially for households that export significant power during the day.

The best scenario is pairing solar with a heat pump hot water cylinder set to heat during the day — this uses your own solar generation directly and reduces grid dependence. Genesis offers solar installation and can help size a system for your roof and usage pattern.`,

  heatpump: `Heat pumps are the single most efficient way to heat a NZ home. They cost roughly $200-300 per year to run — about a third of the cost of a gas heater ($700-900/year) and significantly less than electric resistive heating.

The upfront cost of a quality heat pump is around $3,500-4,000 installed, which typically pays for itself within 4-8 years depending on your current heating type and how cold your region gets. In Canterbury, Otago, and Southland where heating demand is highest, payback is fastest.

One practical tip: set your heat pump to 19-21°C and run it continuously at a low setting rather than cranking it up and turning it off. This is more efficient and keeps the house at a consistent comfortable temperature. Clean the filters every 2 months for optimal performance.`,

  cooktop: `Switching from gas to induction cooking is more about lifestyle and safety than big cost savings — the annual running cost difference is relatively small (around $100-150/year). But there are real benefits.

Induction cooktops are faster (water boils in half the time), more energy-efficient (90% vs 40% for gas), easier to clean (flat glass surface), and safer (no open flame, surface stays cool). They also improve indoor air quality — gas cooking releases nitrogen dioxide, which recent studies have linked to increased asthma risk.

The upfront cost for a quality induction cooktop is around $2,500-2,700 installed. If you're already replacing a worn-out gas cooktop, the incremental cost is much smaller. Note: you'll need induction-compatible pots and pans (a magnet will stick to the base of compatible cookware).`,

  roadmap: `The best approach to electrifying your home is to follow the roadmap in priority order — starting with the changes that give you the biggest return on investment.

For most households, the order is: **1) Switch to an EV** (if you have a petrol car — the fuel savings are immediate and significant), **2) Install a heat pump** (if you're using gas or resistive heating), **3) Consider solar** (5-6 year payback with the July 2026 fair export rules), **4) Upgrade hot water to a heat pump cylinder** (long payback but set-and-forget savings).

You don't have to do everything at once. Start with the highest-priority item and work down the list as budget allows. Each switch reduces your total energy cost and your reliance on fossil fuels. Genesis can help with EV plans, solar installation, and energy management — ask about any specific step.`,

  default: `I'm your Genesis Cost of Living Assistant! I can help you understand your total energy costs and find ways to save across your household.

Try asking me about:
- **EV savings** — "How much would I save switching to an EV?"
- **Heat pumps** — "Should I replace my gas heating?"
- **Solar** — "Is solar worth it for my household?"
- **Electrification roadmap** — "What should I do first?"
- **Groceries** — "How can I cut my food bill?"
- **Insurance** — "Am I paying too much?"
- **Overall savings** — "Where's my biggest opportunity?"

I'm here to help you keep more of your money — starting with energy.`,
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
  // TCE-specific keywords (check first — more specific than generic energy/transport)
  if (lower.includes('ev ') || lower.includes('electric vehicle') || lower.includes('charging') || lower.includes('electric car')) return demoResponses.ev
  if (lower.includes('solar') || lower.includes('panels') || lower.includes('roof')) return demoResponses.solar
  if (lower.includes('heat pump') || lower.includes('heatpump')) return demoResponses.heatpump
  if (lower.includes('cooktop') || lower.includes('induction') || lower.includes('cooking')) return demoResponses.cooktop
  if (lower.includes('roadmap') || lower.includes('step by step') || lower.includes('plan') || lower.includes('order')) return demoResponses.roadmap
  // General keywords
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
