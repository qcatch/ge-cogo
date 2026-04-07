# Genesis Energy — Total Cost of Energy (Prototype)

A working prototype demonstrating a **Total Cost of Energy** tool for New Zealand households. Shows combined energy spend across electricity, gas, and petrol, models the financial impact of full electrification, and includes an AI-powered energy advisor.

Built for stakeholder review (Stephen England-Hall, Ed Hyde) ahead of the August 2026 Genesis brand relaunch.

## Features

- **TCE Calculator** — Guided household energy profile form that calculates total annual energy cost across all vectors (power, gas, transport)
- **Before/After Comparison** — Hero savings numbers + Recharts bar chart showing current vs. fully-electrified costs
- **Savings Roadmap** — Prioritised switch list (heat pump, hot water, induction, EV, solar) sorted by best ROI with payback periods
- **Bill Tracker** — 12-month energy spend history as a stacked area chart with NZ seasonal patterns
- **AI Energy Advisor** — Claude-powered conversational assistant grounded in the user's actual TCE data (demo mode works without API key)
- **Genesis Brand 4.0** — Ultra Orange, Space, Ultra Violet, Sunwash Yellow design tokens with new Genesis wordmark

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
# Click "Auckland Family" for instant demo
```

### Optional: Enable Claude AI

```bash
cp .env.example .env.local
# Edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...
```

Without an API key, the AI advisor runs in demo mode with pre-written NZ energy responses.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (New York) |
| Charts | Recharts 2.15 |
| AI | Anthropic Claude (via @ai-sdk/anthropic) |
| Language | TypeScript 5 (strict) |
| Fonts | Geist / Geist Mono |

## Project Structure

```
app/
  layout.tsx              # Root layout (Geist fonts, Brand 4.0 tokens)
  page.tsx                # Home route — Header + Dashboard
  globals.css             # Design tokens, Tailwind v4 @theme
  api/chat/route.ts       # SSE streaming API (Claude + demo mode)

components/
  layout/header.tsx       # Genesis logo, nav, Prototype badge
  dashboard/
    index.tsx             # Dashboard orchestrator (form ↔ results state)
    energy-form.tsx       # Household energy profile input form
    tce-results.tsx       # TCE results display
    cost-chart.tsx        # Recharts bar chart (current vs electrified)
    savings-roadmap.tsx   # Prioritised switch list
    bill-tracker.tsx      # 12-month stacked area chart
  ai/
    command-bar.tsx       # Bottom input bar
    conversation-panel.tsx # Slide-out Sheet chat panel
  chat/
    message-list.tsx      # Chat message rendering + streaming cursor
    chat-input.tsx        # Text input with auto-resize

lib/
  energy-model/           # NZ energy cost calculation engine
    types.ts              # Input/output type definitions
    constants.ts          # 2026 NZ pricing data (Rewiring Aotearoa methodology)
    consumption.ts        # kWh/year calculations by appliance/vehicle
    costs.ts              # NZD cost calculations (current + electrified)
    roadmap.ts            # Switch order recommendations + payback
    bill-history.ts       # Simulated 12-month history with seasonal variation
    demo-profiles.ts      # Auckland Family, Wellington Renter, Christchurch Homeowner
    index.ts              # Public API: calculateTCE()
  tce-context.ts          # AI system prompt builder (TCE data injection)
  format.ts               # Currency, kWh, percentage formatting
  utils.ts                # cn() — clsx + tailwind-merge
```

## Demo Profiles

Three pre-built household profiles for instant stakeholder demos:

| Profile | Region | Occupants | Current Cost | Electrified | Savings |
|---------|--------|-----------|-------------|-------------|---------|
| Auckland Family | Auckland | 4 | $7,366/yr | $4,708/yr | $2,658 (36%) |
| Wellington Renter | Wellington | 2 | $4,472/yr | $2,584/yr | $1,888 (42%) |
| Christchurch Homeowner | Canterbury | 3 | $7,384/yr | $3,518/yr | $3,866 (52%) |

## Energy Cost Model

Based on the [Rewiring Aotearoa household-model](https://github.com/rewiring-nz/household-model) open-source methodology with 2026 NZ pricing:

- Electricity: 39.3c/kWh national average (regional variation from 34.6c to 48c)
- Gas: 11.8c/kWh + $689/yr fixed
- Petrol: $3.42/litre (April 2026)
- Regional heating multipliers (Northland 0.49x to Southland 1.76x)
- Occupancy scaling (1-5+ people)

## Documentation

- [Architecture](docs/architecture.md) — System architecture and data flow
- [Technical Specification](docs/technical.md) — Technical details and decisions
- [PRD](/.claude/PRPs/prds/genesis-total-cost-of-energy.prd.md) — Full product requirements document

## Status

**Prototype** — all 7 implementation phases complete. Ready for stakeholder review.

| Phase | Status |
|-------|--------|
| 1. Scaffold + Brand 4.0 | Complete |
| 2. Energy Cost Model | Complete |
| 3. TCE Calculator UI | Complete |
| 4. Savings Roadmap | Complete |
| 5. Bill Tracker | Complete |
| 6. AI Energy Advisor | Complete |
| 7. Integration + Polish | Complete |
