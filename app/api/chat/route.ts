export const maxDuration = 60

// Demo responses for when no API key is configured
const demoResponses: Record<string, string> = {
  savings: `Based on your household profile, the biggest savings opportunity is switching your vehicles to electric. At current petrol prices ($3.42/litre), a typical NZ household spends over $4,000 a year on fuel alone. An EV cuts that by 75-80% because electricity is so much cheaper per kilometre — roughly 3-5c/km versus 15-20c/km for petrol.

Your savings roadmap shows the recommended order of switches, starting with the best return on investment. I'd suggest focusing on the top 1-2 items first and working down the list over time.`,

  solar: `Solar is a great investment for NZ households, especially in the upper North Island and Nelson/Marlborough regions. A typical 5kW system costs around $9,000 installed and can save about $1,600/year on your electricity bill — that's a payback period of about 5-6 years.

After that, you're essentially generating free electricity for another 20+ years. Solar works particularly well if you're home during the day or have a battery to store excess generation. It also pairs beautifully with an EV — charge your car from your roof for essentially free transport.`,

  ev: `Switching to an EV is one of the most impactful changes you can make. Here's why:

**Running costs**: An EV costs about 3-5c per kilometre vs 15-20c/km for petrol. For a household driving 210km/week, that's savings of $2,000+ per year.

**In NZ specifically**: We have one of the most renewable electricity grids in the world (80%+ renewable), so your EV is genuinely clean. EV/PHEV registrations hit 68% of new vehicle sales in March 2026 — the shift is happening fast.

**The catch**: You do pay Road User Charges ($76 per 1,000km) which petrol cars don't, but the fuel savings far outweigh this.`,

  heating: `Heat pumps are incredibly efficient — they produce 3-4 units of heat for every 1 unit of electricity consumed. That's why they use so much less energy than gas heaters, electric resistive heaters, or wood burners.

For a typical NZ household, switching from gas heating to a heat pump costs around $3,778 installed. The annual savings depend on your region — colder areas like Canterbury, Otago, and Southland see bigger benefits because they use more heating.

If you're already on a heat pump, you're in great shape! The next best switch would typically be hot water — a hot water heat pump uses about 75% less energy than a standard electric cylinder.`,

  costs: `Your Total Cost of Energy includes everything you spend on powering your home and getting around:

**Electricity**: Your power bill — lights, appliances, heating (if electric), hot water (if electric)
**Gas**: If you have piped gas for heating, hot water, or cooking — plus the fixed daily connection charge
**Transport**: Petrol or diesel for your vehicles

Most NZ households don't think about these as a single number, but when you add them all up, the total can be surprisingly high — typically $5,000-$8,000/year for a household with gas appliances and petrol vehicles.

The good news? Going fully electric can cut that total significantly, especially on transport.`,

  emissions: `Your carbon footprint from energy use comes from burning fossil fuels — petrol, gas, and the small fossil component of NZ's electricity grid.

NZ's electricity grid is already about 80% renewable (hydro, geothermal, wind), which means every kWh of electricity produces only 0.074 kg of CO₂. Compare that to petrol (0.258 kg/kWh) or gas (0.201 kg/kWh).

By electrifying everything, you're not just saving money — you're dramatically cutting emissions. Most households see a 70-90% reduction in their energy-related carbon footprint.`,

  default: `I'm your Genesis Energy AI advisor! I can help you understand your Total Cost of Energy and explore your options for going electric.

Try asking me about:
- **Your savings** — "What should I switch first?"
- **Solar panels** — "Is solar worth it for my home?"
- **Electric vehicles** — "How much would I save with an EV?"
- **Heating** — "Should I get a heat pump?"
- **Your costs** — "Break down my energy costs"
- **Emissions** — "What's my carbon footprint?"

I'm here to help you make sense of your energy costs and find the best path forward.`,
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
  if (lower.includes('sav') || lower.includes('switch') || lower.includes('first') || lower.includes('roadmap')) return demoResponses.savings
  if (lower.includes('solar') || lower.includes('panel') || lower.includes('roof')) return demoResponses.solar
  if (lower.includes('ev') || lower.includes('electric vehicle') || lower.includes('car') || lower.includes('petrol') || lower.includes('vehicle')) return demoResponses.ev
  if (lower.includes('heat') || lower.includes('pump') || lower.includes('warm')) return demoResponses.heating
  if (lower.includes('cost') || lower.includes('spend') || lower.includes('bill') || lower.includes('total') || lower.includes('how much')) return demoResponses.costs
  if (lower.includes('emission') || lower.includes('carbon') || lower.includes('co2') || lower.includes('environment') || lower.includes('climate')) return demoResponses.emissions
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
      system: systemPrompt || 'You are a helpful NZ energy advisor.',
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
