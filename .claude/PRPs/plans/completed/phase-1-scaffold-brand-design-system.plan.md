# Feature: Project Scaffold + Brand 4.0 Design System

## Summary

Scaffold a greenfield Next.js 16 application with Genesis Brand 4.0 visual identity, Tailwind CSS 4 design tokens, shadcn/ui component library, and a responsive mobile-first layout shell. The scaffold mirrors proven patterns from the existing EIQ PoC (`gen-agentforce-poc`) but replaces the approximate oklch colours with the exact Brand 4.0 palette from Figma, and adds the new Genesis wordmark logo.

## User Story

As a Genesis Energy stakeholder reviewing the Total Cost of Energy prototype
I want to see the new Brand 4.0 visual identity applied consistently
So that I can evaluate the product concept in the context of the upcoming August brand relaunch

## Problem Statement

The `ge-cogo` repository is an empty greenfield scaffold with engineering standards but no application code. Before any TCE features can be built, the project needs a working Next.js application with the Genesis Brand 4.0 design system correctly configured.

## Solution Statement

Create a Next.js 16 App Router application mirroring the EIQ PoC's architecture (single-page, mobile-first responsive layout) but with Genesis Brand 4.0 tokens (Ultra Orange, Space, Ultra Violet, Sunwash Yellow) as oklch CSS custom properties, the new Genesis wordmark + spark logo as an SVG component, Geist typography, and a themed shadcn/ui component library. The app renders a branded header and empty dashboard shell ready for TCE features.

## Metadata

| Field            | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| Type             | NEW_CAPABILITY                                         |
| Complexity       | MEDIUM                                                 |
| Systems Affected | app scaffold, design tokens, component library, layout |
| Dependencies     | next@16, react@19, tailwindcss@4, shadcn/ui, recharts  |
| Estimated Tasks  | 10                                                     |

---

## UX Design

### Before State

```
╔═══════════════════════════════════════════════════════╗
║                    BEFORE STATE                       ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║   ┌───────────────────────────────────────────────┐   ║
║   │          Empty repo — no application          │   ║
║   │     CLAUDE.md, docs/, empty memory-bank/      │   ║
║   │     No package.json, no source files          │   ║
║   └───────────────────────────────────────────────┘   ║
║                                                       ║
║   USER_FLOW: None — nothing to run                    ║
║   PAIN_POINT: Cannot demo anything to stakeholders    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### After State

```
╔═══════════════════════════════════════════════════════════╗
║                     AFTER STATE                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   ┌─────────────────────────────────────────────────┐     ║
║   │  [Genesis Logo ✦] Total Cost of Energy  [≡]    │     ║
║   │  ─────────────────────────────────────────────  │     ║
║   │                                                 │     ║
║   │  ┌──────────┐  ┌──────────┐                     │     ║
║   │  │  Card 1  │  │  Card 2  │    (empty shells)   │     ║
║   │  │ (placeholder)│(placeholder)│                  │     ║
║   │  └──────────┘  └──────────┘                     │     ║
║   │                                                 │     ║
║   │  ┌─────────────────────────────┐                │     ║
║   │  │     Full-width card         │                │     ║
║   │  └─────────────────────────────┘                │     ║
║   │                                                 │     ║
║   │  ┌─────────────────────────────────────────┐    │     ║
║   │  │  Ask about your energy...        [mic]  │    │     ║
║   │  └─────────────────────────────────────────┘    │     ║
║   └─────────────────────────────────────────────────┘     ║
║                                                           ║
║   Ultra Orange header/accents, Space body text            ║
║   Ultra Violet buttons, Sunwash Yellow section BGs        ║
║   Geist font, mobile-first responsive                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Interaction Changes

| Location          | Before        | After                                         | User Impact                              |
| ----------------- | ------------- | --------------------------------------------- | ---------------------------------------- |
| `/` (root)        | No app exists | Branded dashboard shell with header + layout   | Can see Brand 4.0 identity in context    |
| Header            | N/A           | Genesis logo + "Total Cost of Energy" title    | Brand recognition                        |
| Dashboard grid    | N/A           | Responsive card grid (1-col mobile, 3-col desktop) | Layout ready for TCE content         |
| Design tokens     | N/A           | All Brand 4.0 colours as CSS vars + Tailwind utilities | Consistent brand application       |
| Components        | N/A           | Themed shadcn Button, Card, Sheet, Popover     | Ready-made UI primitives for features    |

---

## Mandatory Reading

**CRITICAL: Implementation agent MUST read these files before starting any task:**

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/app/globals.css` | all | Design token structure to MIRROR — swap colours only |
| P0 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/package.json` | all | Exact dependency versions to match |
| P0 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/app/layout.tsx` | all | Root layout pattern to MIRROR |
| P1 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/app/page.tsx` | all | Page structure to MIRROR |
| P1 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/components.json` | all | shadcn/ui config to MIRROR |
| P1 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/tsconfig.json` | all | TypeScript config to MIRROR |
| P1 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/postcss.config.mjs` | all | PostCSS config to MIRROR |
| P1 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/next.config.mjs` | all | Next.js config to MIRROR |
| P1 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/components/chat/header.tsx` | all | Header/nav layout pattern |
| P2 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/components/dashboard/index.tsx` | 60-135 | Dashboard grid layout pattern |
| P2 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/components/ui/button.tsx` | all | shadcn button pattern |
| P2 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/components/ui/card.tsx` | all | shadcn card pattern |
| P2 | `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/lib/utils.ts` | all | cn() utility pattern |

**External Documentation (from web research):**

| Source | Section | Why Needed |
|--------|---------|------------|
| [Next.js 16 Release Blog](https://nextjs.org/blog/next-16) | Breaking changes | Async APIs (`await params`), `middleware.ts` → `proxy.ts`, Node 20.9+ minimum |
| [Tailwind v4 + Next.js Install](https://tailwindcss.com/docs/guides/nextjs) | PostCSS setup | No `tailwind.config.js`; single `@import 'tailwindcss'` replaces all three directives |
| [Tailwind v4 Theme Variables](https://tailwindcss.com/docs/configuration/) | `@theme` vs `@theme inline` | `@theme inline` REQUIRED when referencing CSS custom properties; `@theme` for raw values |
| [shadcn/ui Tailwind v4 Docs](https://ui.shadcn.com/docs/tailwind-v4) | Init + component install | CLI auto-detects v4; `config: ""` must be blank |
| [shadcn/ui components.json](https://ui.shadcn.com/docs/components-json) | All config fields | `"new-york"` style is permanent after init |
| [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) | Geist + CSS variable mode | Must use `variable` option for Tailwind; `className` mode is incompatible with `@theme inline` |
| [oklch.com](https://oklch.com/) | Colour verification | Visual verification of hex → oklch conversions |

**Key Gotchas from Research:**
- `@theme {}` for raw colour values (oklch literals), `@theme inline {}` for CSS variable references — mixing them up will cause silent failures
- Geist font: PoC uses `_geist = Geist({ subsets: ["latin"] })` WITHOUT `variable` option — this works by coincidence (font name string in `@theme inline`). The CORRECT approach is `variable: '--font-geist-sans'` + `className` on `<html>` + `@theme inline { --font-sans: var(--font-geist-sans) }`
- Do NOT create `tailwind.config.js` — its existence confuses both Tailwind v4 and shadcn CLI
- `postcss.config.mjs` must use ES module syntax (`export default`) — CommonJS `.js` may conflict
- `"new-york"` shadcn style is permanent after init; always use it for new projects

---

## Patterns to Mirror

**PROJECT_STRUCTURE:**
```
# SOURCE: gen-agentforce-poc directory structure
# MIRROR THIS LAYOUT:
app/
  layout.tsx          ← Root layout (fonts, metadata, globals.css)
  page.tsx            ← Single route, Server Component
  globals.css         ← Design tokens + Tailwind v4 @theme inline
  api/                ← API routes (created in later phases)
components/
  ui/                 ← shadcn/ui themed primitives
  dashboard/          ← Dashboard layout + cards
  chat/               ← Header, chat components (later phases)
lib/
  utils.ts            ← cn() helper
public/               ← Favicons, logo SVGs
```

**DESIGN_TOKEN_PATTERN:**
```css
/* SOURCE: gen-agentforce-poc/app/globals.css:6-39 */
/* MIRROR this structure but swap oklch values for Brand 4.0: */
:root {
  --background: oklch(...);
  --foreground: oklch(...);
  --primary: oklch(...);        /* ← Ultra Orange */
  --primary-foreground: oklch(...);
  --secondary: oklch(...);      /* ← Space (body text colour) */
  /* ... all shadcn semantic tokens ... */
}
```

**TAILWIND_V4_CONFIG:**
```css
/* SOURCE: gen-agentforce-poc/app/globals.css:1-5, 42-81 (IMPROVED per research) */
/* CRITICAL: No tailwind.config.js file. All config via CSS: */
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

/* @theme inline — bridges CSS vars into Tailwind utilities */
/* Use 'inline' because values reference CSS custom properties */
@theme inline {
  --font-sans: var(--font-geist-sans);   /* from next/font variable option */
  --font-mono: var(--font-geist-mono);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... maps all --color-* to Tailwind colour utilities ... */
}
```

**ROOT_LAYOUT:**
```tsx
// SOURCE: gen-agentforce-poc/app/layout.tsx (IMPROVED per Next.js docs)
// Use CSS variable mode for proper Tailwind v4 integration
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
// Then in globals.css @theme inline:
// --font-sans: var(--font-geist-sans);
// --font-mono: var(--font-geist-mono);
```

**COMPONENT_IMPORTS:**
```tsx
// SOURCE: gen-agentforce-poc — consistent pattern across all files
// Path alias: @/ maps to repo root (NOT src/)
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
```

**RESPONSIVE_GRID:**
```tsx
// SOURCE: gen-agentforce-poc/components/dashboard/index.tsx:68-71
// Mobile-first: single column → 3-column at lg breakpoint
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div className="lg:col-span-2 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Cards */}
    </div>
  </div>
  <div className="space-y-4">
    {/* Sidebar */}
  </div>
</div>
```

**HEADER_PATTERN:**
```tsx
// SOURCE: gen-agentforce-poc/components/chat/header.tsx
// Sticky header with backdrop blur, responsive nav
<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
  <div className="flex items-center justify-between px-4 md:px-6 py-3">
    {/* Logo + title left, nav right */}
  </div>
</header>
```

---

## Files to Change

| File                                | Action | Justification                                    |
| ----------------------------------- | ------ | ------------------------------------------------ |
| `package.json`                      | CREATE | Dependencies matching PoC versions               |
| `next.config.mjs`                   | CREATE | Next.js config mirroring PoC                     |
| `tsconfig.json`                     | CREATE | TypeScript config with @/ alias                  |
| `postcss.config.mjs`               | CREATE | Tailwind v4 PostCSS plugin                       |
| `components.json`                   | CREATE | shadcn/ui config (new-york, Tailwind v4)         |
| `app/globals.css`                   | CREATE | Brand 4.0 design tokens + Tailwind @theme        |
| `app/layout.tsx`                    | CREATE | Root layout with Geist fonts + metadata          |
| `app/page.tsx`                      | CREATE | Single route rendering Header + Dashboard shell  |
| `lib/utils.ts`                      | CREATE | cn() utility (clsx + tailwind-merge)             |
| `components/ui/button.tsx`          | CREATE | shadcn Button (via CLI or manual)                |
| `components/ui/card.tsx`            | CREATE | shadcn Card (via CLI or manual)                  |
| `components/ui/sheet.tsx`           | CREATE | shadcn Sheet (for future chat panel)             |
| `components/ui/popover.tsx`         | CREATE | shadcn Popover (for future inline assists)       |
| `components/layout/header.tsx`      | CREATE | Genesis Brand 4.0 header with new logo SVG       |
| `components/dashboard/index.tsx`    | CREATE | Responsive dashboard grid shell (empty cards)    |
| `public/genesis-logo.svg`           | CREATE | New Genesis wordmark + spark icon SVG            |
| `public/icon.svg`                   | CREATE | Favicon SVG                                      |
| `public/robots.txt`                 | CREATE | Disallow crawlers (prototype)                    |

---

## NOT Building (Scope Limits)

- No API routes — created in Phase 6 (AI Energy Advisor)
- No energy calculator logic — created in Phase 2 (Energy Cost Model)
- No dashboard card content — created in Phase 3 (TCE Calculator UI)
- No dark mode — Brand 4.0 Figma only defines light mode colours
- No authentication or user accounts
- No Vercel Analytics — add in Phase 7 (Integration + Polish)
- No real Genesis logo SVG path data extraction from Figma — will use a clean SVG recreation from the Figma screenshot; exact vector can be refined later with design team

---

## Genesis Brand 4.0 — Design Token Reference

### Colour Palette (Hex → oklch)

| Name           | Hex       | oklch                       | Usage                    |
| -------------- | --------- | --------------------------- | ------------------------ |
| Ultra Orange   | `#FF5800` | `oklch(0.679 0.215 39.5)`  | Primary, accents, logo   |
| White          | `#FFFFFF` | `oklch(1.000 0.000 0)`     | Backgrounds, primary-fg  |
| Space          | `#472D3E` | `oklch(0.335 0.047 340.5)` | Body text, foreground    |
| Ultra Violet   | `#60005F` | `oklch(0.342 0.157 328.9)` | Buttons, CTA elements    |
| Sunwash Yellow | `#FEFAC0` | `oklch(0.974 0.074 104.4)` | Section backgrounds      |

### Token Mapping (shadcn semantic → Brand 4.0)

| CSS Variable          | Brand 4.0 Mapping                          | oklch Value                  |
| --------------------- | ------------------------------------------ | ---------------------------- |
| `--background`        | White                                      | `oklch(0.99 0 0)`           |
| `--foreground`        | Space (body text)                          | `oklch(0.335 0.047 340.5)`  |
| `--primary`           | Ultra Orange                               | `oklch(0.679 0.215 39.5)`   |
| `--primary-foreground`| White                                      | `oklch(0.99 0 0)`           |
| `--secondary`         | Ultra Violet                               | `oklch(0.342 0.157 328.9)`  |
| `--secondary-foreground` | White                                   | `oklch(0.99 0 0)`           |
| `--accent`            | Sunwash Yellow                             | `oklch(0.974 0.074 104.4)`  |
| `--accent-foreground` | Space                                      | `oklch(0.335 0.047 340.5)`  |
| `--muted`             | Light neutral (near-white warm)            | `oklch(0.96 0.01 340)`      |
| `--muted-foreground`  | Mid-tone Space                             | `oklch(0.55 0.02 340)`      |
| `--card`              | White                                      | `oklch(1 0 0)`              |
| `--card-foreground`   | Space                                      | `oklch(0.335 0.047 340.5)`  |
| `--border`            | Light warm grey                            | `oklch(0.90 0.01 340)`      |
| `--input`             | Very light warm                            | `oklch(0.96 0.005 340)`     |
| `--ring`              | Ultra Orange (focus rings)                 | `oklch(0.679 0.215 39.5)`   |
| `--destructive`       | Standard red                               | `oklch(0.577 0.245 27.325)` |
| `--chart-1`           | Ultra Orange                               | `oklch(0.679 0.215 39.5)`   |
| `--chart-2`           | Ultra Violet                               | `oklch(0.342 0.157 328.9)`  |
| `--chart-3`           | Space                                      | `oklch(0.335 0.047 340.5)`  |
| `--chart-4`           | Sunwash Yellow                             | `oklch(0.974 0.074 104.4)`  |
| `--chart-5`           | Teal (supplementary for data viz)          | `oklch(0.6 0.118 184.7)`    |

---

## Step-by-Step Tasks

Execute in order. Each task is atomic and independently verifiable.

### Task 1: CREATE `package.json` + install dependencies

- **ACTION**: Initialise npm project and install all dependencies matching PoC versions
- **IMPLEMENT**: Create `package.json` with:
  - `name`: `"ge-cogo"`
  - `private`: `true`
  - `scripts`: `{ "dev": "next dev", "build": "next build", "start": "next start", "lint": "next lint" }`
  - Dependencies mirroring PoC: `next@16.0.10`, `react@^19.2.1`, `react-dom@^19.2.1`, `tailwindcss@^4.1.9`, `@tailwindcss/postcss@^4.1.9`, `tw-animate-css@1.3.3`, `class-variance-authority@^0.7.1`, `clsx@^2.1.1`, `tailwind-merge@^3.3.1`, `lucide-react@^0.454.0`, `recharts@2.15.4`, `radix-ui@^1.4.3`, `@radix-ui/react-slot@1.1.1`, `zod@3.25.76`, `react-hook-form@^7.60.0`, `@hookform/resolvers@^3.10.0`
  - DevDependencies: `typescript@^5`, `@types/node@^22`, `@types/react@^19`, `@types/react-dom@^19`, `postcss@^8.5`
- **MIRROR**: `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/package.json`
- **GOTCHA**: Do NOT include `@ai-sdk/anthropic`, `ai`, `@vercel/analytics`, `sonner`, or Agentforce deps — those belong to Phase 6/7
- **VALIDATE**: `npm install` completes without errors

### Task 2: CREATE config files (`next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`)

- **ACTION**: Create three config files mirroring PoC exactly
- **IMPLEMENT**:
  - `next.config.mjs`: `typescript.ignoreBuildErrors: true`, `images.unoptimized: true`
  - `tsconfig.json`: Target ES6, bundler resolution, `@/*` path alias to `./*`, incremental, `react-jsx`
  - `postcss.config.mjs`: Single plugin `@tailwindcss/postcss: {}`
- **MIRROR**: PoC config files listed in Mandatory Reading
- **GOTCHA**: No `tailwind.config.js/ts` — Tailwind v4 is configured entirely in CSS. The `postcss.config.mjs` must NOT include `autoprefixer` (Tailwind v4 handles it)
- **VALIDATE**: Files created, no syntax errors

### Task 3: CREATE `components.json` (shadcn/ui config)

- **ACTION**: Create shadcn/ui configuration
- **IMPLEMENT**:
  ```json
  {
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "new-york",
    "rsc": true,
    "tsx": true,
    "tailwind": {
      "config": "",
      "css": "app/globals.css",
      "baseColor": "neutral",
      "cssVariables": true,
      "prefix": ""
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils",
      "ui": "@/components/ui",
      "lib": "@/lib",
      "hooks": "@/hooks"
    },
    "iconLibrary": "lucide"
  }
  ```
- **MIRROR**: `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/components.json`
- **GOTCHA**: `"config": ""` is intentional — tells shadcn that Tailwind v4 has no config file
- **VALIDATE**: File is valid JSON

### Task 4: CREATE `app/globals.css` (Brand 4.0 design tokens)

- **ACTION**: Create the design system CSS file with Genesis Brand 4.0 colour tokens
- **IMPLEMENT**: Mirror the PoC's `globals.css` structure but replace ALL oklch colour values with the Brand 4.0 palette computed above. Key mappings:
  - `--primary`: Ultra Orange `oklch(0.679 0.215 39.5)`
  - `--foreground` / `--card-foreground`: Space `oklch(0.335 0.047 340.5)`
  - `--secondary`: Ultra Violet `oklch(0.342 0.157 328.9)`
  - `--accent`: Sunwash Yellow `oklch(0.974 0.074 104.4)`
  - Full `@theme inline` block mapping all `--color-*` vars to CSS custom properties
  - `@import 'tailwindcss'` and `@import 'tw-animate-css'`
  - Font definitions in `@theme inline`: `--font-sans: var(--font-geist-sans)` and `--font-mono: var(--font-geist-mono)` (references CSS vars injected by `next/font` on `<html>`)
  - Radius: `--radius: 0.75rem`
  - Base layer: `* { @apply border-border outline-ring/50; }` and `body { @apply bg-background text-foreground; }`
- **MIRROR**: `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/app/globals.css` (structure)
- **GOTCHA**: Use oklch colour space throughout — do NOT use hex or rgb in CSS vars. The `@custom-variant dark` line should be included for future-proofing even though we don't define dark overrides.
- **VALIDATE**: No CSS syntax errors when app runs

### Task 5: CREATE `lib/utils.ts`

- **ACTION**: Create the cn() utility
- **IMPLEMENT**:
  ```typescript
  import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```
- **MIRROR**: `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/lib/utils.ts`
- **VALIDATE**: `npx tsc --noEmit` passes

### Task 6: CREATE shadcn/ui components (`components/ui/`)

- **ACTION**: Add themed shadcn components via CLI or manual copy from PoC
- **IMPLEMENT**: Add these four components:
  - `components/ui/button.tsx` — with all variants (default, destructive, outline, secondary, ghost, link) and sizes (default, sm, lg, icon)
  - `components/ui/card.tsx` — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
  - `components/ui/sheet.tsx` — Sheet slide-out panel (for future chat panel)
  - `components/ui/popover.tsx` — Popover (for future inline assists)
- **MIRROR**: PoC `components/ui/` files — use `data-slot` attributes (new-york style)
- **GOTCHA**: shadcn CLI command is `npx shadcn@latest add button card sheet popover`. If CLI fails with Tailwind v4, manually copy from PoC and adjust imports. New Radix UI imports use `"radix-ui"` umbrella package, not individual `@radix-ui/*` packages.
- **VALIDATE**: `npx tsc --noEmit` passes; components render without errors

### Task 7: CREATE `app/layout.tsx` (Root layout)

- **ACTION**: Create the root layout with Geist fonts and Genesis metadata
- **IMPLEMENT**:
  - Import `Geist`, `Geist_Mono` from `next/font/google`
  - Import `./globals.css`
  - Font instantiation with CSS variable mode (DIFFERS FROM PoC — research confirms this is correct):
    ```tsx
    const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' })
    const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })
    ```
  - Apply font variables to `<html>`:
    ```tsx
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    ```
  - Body: `<body>{children}</body>` (no extra classes needed — `font-sans` applied via `@theme inline`)
  - Metadata: `title: 'Genesis Energy — Total Cost of Energy'`, `description: 'See your total household energy spend and how much you could save by going electric'`, `robots: { index: false }`
  - Favicon: light/dark mode icons (create placeholder SVG)
- **MIRROR**: `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/app/layout.tsx` (structure only — font loading pattern improved per research)
- **GOTCHA**: The PoC uses `_geist = Geist({ subsets: ["latin"] })` WITHOUT the `variable` option — this works by accident because the `@theme inline` block references the font by string name `'Geist'`. The CORRECT approach (confirmed by Next.js docs) is to use `variable: '--font-geist-sans'` and reference `var(--font-geist-sans)` in `@theme inline`. This ensures proper font optimisation and avoids FOUT.
- **VALIDATE**: `npm run dev` starts without errors; DevTools shows `--font-geist-sans` CSS variable on `<html>` element

### Task 8: CREATE `components/layout/header.tsx` (Genesis Brand 4.0 header)

- **ACTION**: Create the branded header component with new Genesis logo
- **IMPLEMENT**:
  - `'use client'` directive
  - Sticky header with `bg-background/80 backdrop-blur-sm`
  - Genesis wordmark + spark logo as inline SVG (recreated from Figma Brand 4.0 screenshot — the angular spark/bird icon in Ultra Orange with "Genesis" text or simplified mark)
  - "Total Cost of Energy" title text
  - Responsive: hamburger on mobile (`md:hidden`), nav links on desktop (`md:flex`)
  - Nav items: "Calculator", "Savings", "Bill Tracker" (non-functional placeholders)
- **MIRROR**: `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/components/chat/header.tsx` (layout pattern)
- **GOTCHA**: The PoC header uses a simplified circle+arc SVG placeholder, NOT the real Genesis logo. For Brand 4.0, create a clean geometric recreation of the spark mark from the Figma screenshot. The real logo vector paths can be extracted from Figma later.
- **VALIDATE**: Header renders with correct colours and responsive behaviour

### Task 9: CREATE `components/dashboard/index.tsx` (Dashboard shell)

- **ACTION**: Create the responsive dashboard layout with placeholder cards
- **IMPLEMENT**:
  - `'use client'` directive
  - Mobile-first grid: `grid-cols-1 lg:grid-cols-3 gap-4`
  - Left column (`lg:col-span-2`): two placeholder Cards in `md:grid-cols-2` grid + one full-width Card
  - Right column: one Card placeholder
  - Cards use shadcn Card component with placeholder titles: "Your Energy Profile", "Total Cost of Energy", "Savings Roadmap", "Energy Breakdown"
  - Bottom section: placeholder for command bar area (styled div, not functional)
  - Padding: `px-4 md:px-6 py-4`
- **MIRROR**: `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/components/dashboard/index.tsx:68-135`
- **GOTCHA**: Dashboard component in PoC is the single state owner for all features. Keep this pattern — export a named `Dashboard` component that will grow to own state in later phases.
- **VALIDATE**: Grid renders correctly at mobile and desktop widths

### Task 10: CREATE `app/page.tsx` + public assets + verify

- **ACTION**: Wire everything together and verify the full scaffold
- **IMPLEMENT**:
  - `app/page.tsx`: Server Component, renders `<Header />` + `<Dashboard />` in `flex flex-col h-screen`
  - `public/robots.txt`: `User-agent: *\nDisallow: /`
  - `public/icon.svg`: Simple Genesis spark mark SVG for favicon
- **MIRROR**: `/Users/qfogarty/Sites/Genesis/Azure/gen-agentforce-poc/app/page.tsx`
- **VALIDATE**:
  1. `npm run dev` — app starts on localhost:3000
  2. Header shows Genesis logo + "Total Cost of Energy" in Ultra Orange
  3. Body text renders in Space colour
  4. Dashboard grid is responsive (1-col mobile, 3-col desktop)
  5. Cards render with correct border radius and styling
  6. `npm run build` — production build succeeds

---

## Testing Strategy

### Visual Verification (Primary for this phase)

Since this phase is purely scaffold + design system with no business logic, testing is visual:

| Check | Expected Result |
|-------|-----------------|
| Header logo colour | Ultra Orange (#FF5800) |
| Body text colour | Space (#472D3E) |
| Button default variant | Ultra Orange background, white text |
| Button secondary variant | Ultra Violet background, white text |
| Card backgrounds | White with warm grey border |
| Accent sections | Sunwash Yellow background |
| Font | Geist Sans (check via DevTools) |
| Mobile layout (< 768px) | Single column cards |
| Desktop layout (> 1024px) | 3-column grid |
| Focus rings | Ultra Orange ring |

### Build Verification

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Page loads at `localhost:3000`

### Edge Cases Checklist

- [ ] Very narrow viewport (320px) — no horizontal overflow
- [ ] Very wide viewport (2560px) — content doesn't stretch uncomfortably
- [ ] Zoom 200% — layout doesn't break
- [ ] No console errors or warnings

---

## Validation Commands

### Level 1: STATIC_ANALYSIS

```bash
npx tsc --noEmit
```

**EXPECT**: Exit 0, no type errors

### Level 2: BUILD

```bash
npm run build
```

**EXPECT**: Build succeeds, no compilation errors

### Level 3: DEV_SERVER

```bash
npm run dev
```

**EXPECT**: Server starts, page renders at localhost:3000 with Brand 4.0 colours

### Level 5: BROWSER_VALIDATION

Verify in browser:
- [ ] Genesis logo renders in Ultra Orange
- [ ] Body text is Space colour
- [ ] Dashboard grid is responsive
- [ ] Geist font is loaded (check via DevTools → Computed → font-family)
- [ ] No layout overflow on mobile widths

---

## Acceptance Criteria

- [ ] Next.js 16 app runs locally with `npm run dev`
- [ ] Genesis Brand 4.0 colours applied via oklch CSS custom properties
- [ ] All design tokens from the mapping table are implemented in `globals.css`
- [ ] shadcn/ui components (Button, Card, Sheet, Popover) themed with Brand 4.0
- [ ] Genesis logo renders in header with Ultra Orange colour
- [ ] Dashboard grid is mobile-first responsive (1-col → 3-col)
- [ ] Geist font loads and displays correctly
- [ ] `npm run build` succeeds
- [ ] `npx tsc --noEmit` passes

---

## Completion Checklist

- [ ] All 10 tasks completed in dependency order
- [ ] Each task validated immediately after completion
- [ ] Level 1: TypeScript compilation passes
- [ ] Level 2: Production build succeeds
- [ ] Level 3: Dev server runs and page renders
- [ ] Level 5: Browser shows correct Brand 4.0 visual identity
- [ ] All acceptance criteria met

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| shadcn CLI incompatible with Tailwind v4 setup | Medium | Low | Manually copy component files from PoC and adjust |
| oklch colour conversion inaccuracy | Low | Medium | Verified via computation; visually compare against Figma |
| Geist font not loading via @theme inline pattern | Low | Medium | Proven pattern from PoC; fallback font stack defined |
| Genesis logo SVG not matching brand guidelines | High | Medium | Using geometric recreation from Figma screenshot; plan to get official SVG from design team |
| Dependencies version conflicts during npm install | Low | Low | Pin exact versions from PoC's working package-lock.json |

---

## Notes

- The PoC's `@theme inline` pattern for Tailwind v4 is unconventional but proven. No `tailwind.config.js` exists — ALL theming happens in CSS.
- The PoC has `typescript.ignoreBuildErrors: true` in next.config — we mirror this for prototype speed but should remove for production.
- The Genesis logo SVG in the PoC (`components/chat/header.tsx`) is a simplified circle+arc placeholder, NOT the real Brand 4.0 mark. We need to recreate the angular spark icon from the Figma screenshot. The exact vector paths should be obtained from the design team or extracted from the Figma file in a follow-up.
- `--secondary` in the PoC maps to a neutral grey. In Brand 4.0, we remap it to Ultra Violet per the brand guidelines (Ultra Violet = buttons/CTAs).
- `--accent` in the PoC equals `--primary`. In Brand 4.0, we remap it to Sunwash Yellow (section backgrounds), which is a departure. This means `accent` Tailwind utilities will produce yellow, not orange — components using `bg-accent` will look different from the PoC.
