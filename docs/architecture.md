# Architecture

## Overview

The Genesis TCE prototype is a single-page Next.js 16 application (App Router) with a client-side energy cost calculation engine and an optional server-side AI chat API. All computation runs in the browser — no database, no user accounts, no external service dependencies for the core calculator.

## System Architecture

```
Browser (Client)
  ├── app/page.tsx (Server Component — renders layout)
  │   ├── components/layout/header.tsx (Client Component)
  │   └── components/dashboard/index.tsx (Client Component — state owner)
  │       ├── energy-form.tsx → collects HouseholdInput
  │       ├── lib/energy-model/index.ts → calculateTCE(input) → TCEResult
  │       ├── tce-results.tsx → displays results
  │       │   ├── cost-chart.tsx (Recharts)
  │       │   ├── savings-roadmap.tsx
  │       │   └── bill-tracker.tsx (Recharts)
  │       ├── ai/command-bar.tsx → opens chat
  │       └── ai/conversation-panel.tsx → SSE chat client
  │                   │
  │                   ▼
  │           POST /api/chat (SSE stream)
  │                   │
  └───────────────────┘

Server (Next.js API Route)
  └── app/api/chat/route.ts
      ├── Demo mode: keyword-matched canned responses
      └── Claude mode: @ai-sdk/anthropic → Anthropic API
```

## Data Flow

### Calculator Flow

```
HouseholdInput (form state)
  → calculateTCE()
    → calculateTotalConsumption() — kWh/year per category
    → calculateCurrentCosts() — NZD/year per vector
    → calculateElectrifiedCosts() — projected NZD/year
    → generateRoadmap() — sorted switch recommendations
    → calculateEmissions() — CO2 tonnes current vs electrified
  → TCEResult (passed as props to result components)
```

### AI Chat Flow

```
User types in CommandBar
  → Dashboard sets chatContext + opens ConversationPanel
  → ConversationPanel POSTs to /api/chat with { messages, systemPrompt }
  → API route returns SSE stream (text-delta events)
  → ConversationPanel reads stream, accumulates into streamingContent
  → MessageList renders streaming cursor + committed messages
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Client-side calculation | All energy math runs in browser | No backend needed for prototype; instant results |
| SSE streaming (not WebSockets) | Hand-rolled ReadableStream + text/event-stream | Matches PoC pattern; works with serverless |
| Demo mode fallback | Keyword-matched canned responses | Prototype works without API key |
| No state management library | useState in Dashboard component | Sufficient for single-page prototype |
| Recharts (not Chart.js/D3) | recharts@2.15 | Already in PoC, React-native, composable |

## Design System

Genesis Brand 4.0 implemented via CSS custom properties in `app/globals.css`:

| Token | Colour | Usage |
|-------|--------|-------|
| `--primary` | Ultra Orange `#FF5800` | Accents, logo, CTAs |
| `--foreground` | Space `#472D3E` | Body text |
| `--secondary` | Ultra Violet `#60005F` | Buttons, badges |
| `--accent` | Sunwash Yellow `#FEFAC0` | Section backgrounds |

Tailwind v4 configured via `@theme inline` — no `tailwind.config.js`.
