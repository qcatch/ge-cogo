# Technical Specification

## Overview

Genesis Total Cost of Energy — a Next.js 16 prototype that calculates and visualises NZ household energy costs across electricity, gas, and transport, models full electrification, and provides AI-powered energy advice.

## System Architecture

See [architecture.md](./architecture.md) for detailed diagrams.

**Key architectural characteristics:**
- Single-page application with two views (form / results)
- Client-side calculation engine (zero API calls for core functionality)
- Optional AI chat via SSE streaming to Claude API
- Mobile-first responsive design

## Technical Requirements

| Requirement | Implementation |
|------------|----------------|
| Framework | Next.js 16.0.10 (App Router, Turbopack) |
| Runtime | Node.js 20.9+ |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 (PostCSS, @theme inline) |
| Components | shadcn/ui (New York style) + Radix UI |
| Charts | Recharts 2.15.4 |
| AI | @ai-sdk/anthropic (optional) |
| Forms | React useState (simplified for prototype) |
| Path alias | `@/*` maps to project root |
| Fonts | Geist / Geist Mono via next/font/google |

## Data Flow

### Energy Cost Model (`lib/energy-model/`)

**Input**: `HouseholdInput` — region, occupants, heating type, water heating type, cooktop type, vehicles array, solar preference.

**Output**: `TCEResult` — current costs, electrified costs, savings, consumption breakdown, switch roadmap, emissions.

**Methodology**: Based on [Rewiring Aotearoa household-model](https://github.com/rewiring-nz/household-model/blob/main/METHODOLOGY.md):
- Energy consumption calculated per appliance category (kWh/day) with regional heating multipliers and occupancy scaling
- Costs derived from 2026 NZ pricing data (electricity by region, gas, petrol energy-equivalent rates)
- Electrified scenario replaces all fossil-fuel appliances with electric equivalents
- Roadmap sorted by payback period (best ROI first)
- Emissions calculated using NZ-specific factors (electricity at 0.074 kgCO2e/kWh)

### AI Chat (`app/api/chat/route.ts`)

**Protocol**: Server-Sent Events (SSE)
- Wire format: `{ type: 'message-start' }`, `{ type: 'text-delta', delta }`, `{ type: 'message-end' }`, `[DONE]`
- Client reads via `ReadableStream` reader with line buffering

**Modes**:
- Demo (no `ANTHROPIC_API_KEY`): keyword-matched responses covering savings, solar, EV, heating, costs, emissions
- Claude (API key set): Anthropic Claude via `streamText()` with system prompt injected from user's TCE data

## APIs / Integrations

| Integration | Purpose | Required |
|------------|---------|----------|
| Anthropic Claude API | AI energy advisor responses | Optional (demo mode fallback) |

No other external APIs. All energy data is static (compiled into the application from EECA/Rewiring Aotearoa/Powerswitch public sources).

## Security

- `robots.txt` blocks all crawlers
- `robots: { index: false }` in metadata
- No user data persisted (no database, no cookies, no localStorage)
- API key stored in environment variable only
- `typescript.ignoreBuildErrors: true` in next.config (prototype only — remove for production)

## Deployment

**Target**: Vercel (or any Node.js 20+ hosting)

**Environment variables**:
- `ANTHROPIC_API_KEY` (optional) — enables Claude AI responses

**Build**:
```bash
npm run build   # Production build (~2s)
npm run start   # Serve production build
```

## Maintenance / Support

This is a **prototype** — not production software. Known limitations:
- Energy pricing data is static (April 2026) — needs periodic updates in `lib/energy-model/constants.ts`
- Bill tracker uses simulated data, not real bill history
- No error boundaries or comprehensive error handling
- No test suite (visual verification only)
- `typescript.ignoreBuildErrors: true` should be removed for production
