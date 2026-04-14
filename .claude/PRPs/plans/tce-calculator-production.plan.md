# Feature: Total Energy Cost Calculator — Production Build

## Summary

Take the validated Genesis TCE Calculator POC to a public-facing production application. The POC is ~85% complete against BHL's scoped brief. This plan covers: stripping out-of-scope features (household dashboard, savings playbook, receipt scanner), building the two missing features (electrification wishlist save, offer link wiring), production hardening (rate limiting, error boundaries, accessibility, compliance), replacing mocked data with real APIs (NZTA rego, EECA fuel economy, MBIE fuel prices), and QA.

## User Story

As a NZ household energy customer
I want to see my total energy cost across electricity, gas, and petrol, toggle electrification options on/off, save my wishlist, and connect to Genesis offers
So that I understand what energy is actually costing me and can take action to reduce it

## Problem Statement

Genesis currently offers the Cogo Go Electric calculator — a white-label product that ASB also has with better financing. Genesis has no differentiation. NZ households have no tool that shows total energy cost across all vectors with personalised AI advice.

## Solution Statement

A Genesis-owned calculator that runs entirely client-side (no backend DB), with an AI Energy Advisor powered by Claude, contextual deep-links to Cogo's installer marketplace, and a wishlist save feature. The POC validates the concept; this plan takes it to production quality.

## Metadata

| Field            | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| Type             | ENHANCEMENT (POC to production)                                      |
| Complexity       | MEDIUM                                                               |
| Systems Affected | app/page.tsx, lib/energy-model/, components/*, app/api/*, lib/*.ts   |
| Dependencies     | html-to-image ^1.11.13, zod 3.25.76, @ai-sdk/anthropic, ai, upstash |
| Estimated Tasks  | 24                                                                   |

---

## Mandatory Reading

**CRITICAL: Implementation agent MUST read these files before starting any task:**

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `app/page.tsx` | all (355 lines) | Orchestrator — state, memos, section layout, ALL integration points |
| P0 | `lib/energy-model/types.ts` | all (103 lines) | Every type definition used throughout |
| P0 | `lib/energy-model/constants.ts` | all (169 lines) | All hardcoded pricing — the file being converted to JSON config |
| P1 | `lib/energy-model/rego-lookup.ts` | all (31 lines) | Current mocked impl being replaced with real APIs |
| P1 | `components/offers/power-circle-offers.tsx` | all (86 lines) | Unwired CTAs being connected |
| P1 | `components/share/savings-summary-card.tsx` | all (128 lines) | Existing share pattern to extend for wishlist |
| P1 | `app/api/chat/route.ts` | all (222 lines) | SSE pattern, rate limiting target |
| P2 | `components/calculator/tce-form.tsx` | 89-115 | useEffect propagation + handleLookup (async conversion needed) |
| P2 | `lib/energy-model/costs.ts` | 30-32, 54-70 | How pricing constants flow into calculations |
| P2 | `components/layout/header.tsx` | 7-13 | Nav items to update |
| P2 | `app/globals.css` | 16-120 | Genesis Brand 4.0 tokens — semantic classes only |
| P2 | `app/layout.tsx` | 22 | `robots: { index: false }` — must change for SEO |

---

## Patterns to Mirror

**COMPONENT_PATTERN:**
```tsx
// SOURCE: components/offers/power-circle-offers.tsx:30-35
// All components use this pattern:
interface PowerCircleOffersProps {
  roadmap: SwitchRecommendation[]
  input: HouseholdInput
}
export function PowerCircleOffers({ roadmap }: PowerCircleOffersProps) {
```

**STATE_MANAGEMENT_PATTERN:**
```tsx
// SOURCE: app/page.tsx:26-32
// No state library — plain useState + useMemo:
const [householdInput, setHouseholdInput] = useState<HouseholdInput>(
  TCE_DEMO_PROFILES['auckland-family'].input
)
const tceResult: TCEResult = useMemo(() => {
  return calculateTCE(householdInput)
}, [householdInput])
```

**TOGGLE_RECALC_PATTERN:**
```tsx
// SOURCE: app/page.tsx:40-51
// Toggles override specific fields, then recalculate:
const electrifiedInput = useMemo((): HouseholdInput => ({
  ...householdInput,
  heating: toggles.heating ? 'heat-pump' : householdInput.heating,
  waterHeating: toggles.waterHeating ? 'heat-pump' : householdInput.waterHeating,
  cooktop: toggles.cooktop ? 'induction' : householdInput.cooktop,
  vehicles: toggles.vehicles
    ? householdInput.vehicles.map(v => ({ ...v, type: 'electric' as const }))
    : householdInput.vehicles,
  includeSolar: toggles.solar,
}), [householdInput, toggles])
const electrifiedResult = useMemo(() => calculateTCE(electrifiedInput), [electrifiedInput])
```

**SSE_STREAMING_PATTERN:**
```tsx
// SOURCE: app/api/chat/route.ts:132-158
// Custom SSE format used by both demo and Claude modes:
function createSSEResponse(textGenerator: AsyncGenerator<string>): Response {
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'message-start', id: crypto.randomUUID() })}\n\n`))
      for await (const chunk of textGenerator) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text-delta', delta: chunk })}\n\n`))
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'message-end' })}\n\n`))
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    }
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
}
```

**TAILWIND_PATTERN:**
```tsx
// SOURCE: throughout all components
// Semantic classes only — never raw hex. Opacity modifiers common:
// bg-primary/5, bg-primary/10, border-primary/20, text-muted-foreground
// Layout: max-w-{n} mx-auto space-y-{n}
// Cards: <Card><CardContent className="py-{n} px-{n} space-y-{n}">
// Section borders: border-t border-border
// Scroll offset: scroll-mt-20
```

**FORM_PROPAGATION_PATTERN:**
```tsx
// SOURCE: components/calculator/tce-form.tsx:89-106
// Form owns local state, propagates via useEffect:
useEffect(() => {
  const vehicleInputs = vehicles.filter(v => v.lookup !== null).map(v => ({
    type: v.lookup!.fuelType, usage: v.mileage,
  }))
  const input: HouseholdInput = {
    region, occupants, heating, waterHeating, cooktop,
    vehicles: vehicleInputs.length > 0 ? vehicleInputs : [{ type: 'petrol', usage: 'medium' }],
    includeSolar: false,
  }
  onInputChangeRef.current(input)
}, [vehicles, region, occupants, heating, waterHeating, cooktop])
```

---

## Files to Change

### Phase 1 — Core Build

| File | Action | Justification |
|------|--------|---------------|
| `app/page.tsx` | UPDATE | Remove household-costs, savings, dashboard sections (lines 314-344). Add wishlist save state + handler. Update nav targets. |
| `components/layout/header.tsx` | UPDATE | Remove "Household" and "Savings" nav items (lines 7-13). Add "Privacy" and "Terms" footer links. |
| `components/offers/power-circle-offers.tsx` | UPDATE | Wire CTA buttons with real hrefs, UTM params, `target="_blank"`, `rel="noopener"` |
| `components/share/savings-summary-card.tsx` | UPDATE | Extend to include wishlist URL copy, PDF export alongside existing PNG |
| `app/api/chat/route.ts` | UPDATE | Add rate limiting via Upstash Redis |
| `app/layout.tsx` | UPDATE | Add error boundary, cookie consent script point, update robots meta, add SEO metadata |
| `app/globals.css` | UPDATE | Add print styles for PDF export if needed |
| `components/calculator/tce-form.tsx` | UPDATE | Minor — remove DEMO_PLATES import after rego goes real (Phase 2) |
| `app/privacy/page.tsx` | CREATE | Privacy policy page |
| `app/terms/page.tsx` | CREATE | Terms of use page |
| `components/ui/cookie-consent.tsx` | CREATE | Cookie consent banner component |
| `components/ui/error-boundary.tsx` | CREATE | React error boundary wrapper |
| `lib/wishlist.ts` | CREATE | Encode/decode wishlist state to/from URL params |

### Phase 1 — Files to Remove

| File/Directory | Lines | Why |
|----------------|-------|-----|
| `components/dashboard/index.tsx` | 268 | Household dashboard — out of scope |
| `components/dashboard/category-card.tsx` | ~50 | Dashboard component |
| `components/dashboard/conversation-starters.tsx` | ~40 | Household AI starters |
| `components/dashboard/profile-switcher.tsx` | ~60 | Household profile switcher |
| `components/dashboard/spending-donut.tsx` | ~80 | Recharts donut — only chart using Recharts |
| `components/dashboard/spending-trend.tsx` | ~100 | Recharts trend chart |
| `components/dashboard/receipt-scanner.tsx` | ~120 | Receipt upload + OCR |
| `components/household/total-cost-view.tsx` | 138 | Full household cost view |
| `components/savings/savings-playbook.tsx` | ~150 | Savings idea browser |
| `components/savings/idea-card.tsx` | ~80 | Individual idea card |
| `components/savings/email-draft-sheet.tsx` | ~100 | Email draft component |
| `lib/household-model/` | 5 files, ~427 lines | All household spending types, constants, profiles |
| `lib/cost-of-living/` | 4 files, ~200+ lines | Savings ideas, types, email templates |
| `lib/household-context.ts` | ~50 | Dashboard AI prompts |
| `lib/chart-colors.ts` | ~20 | Only used by removed components |
| `app/api/scan-receipt/route.ts` | 85 | Receipt OCR endpoint |

**Post-removal check:** Verify `recharts` can be removed from `package.json` — the stacked comparison chart (`stacked-comparison.tsx`) uses pure CSS, not Recharts. All Recharts usage is in the removed dashboard components.

### Phase 2 — Data & Offers

| File | Action | Justification |
|------|--------|---------------|
| `lib/energy-model/rego-lookup.ts` | REWRITE | Replace mock dictionary with async NZTA + EECA API calls |
| `app/api/vehicle-lookup/route.ts` | CREATE | Server-side API route for rego lookup (keeps API keys server-side) |
| `lib/energy-model/constants.ts` | UPDATE | Extract mutable pricing to JSON config, keep immutable constants |
| `data/energy-pricing.json` | CREATE | Regional electricity/gas rates, fuel prices, lastUpdated timestamp |
| `lib/energy-model/pricing.ts` | CREATE | Load and validate pricing from JSON config |
| `components/calculator/tce-form.tsx` | UPDATE | Convert `handleLookup` from sync to async (fetch `/api/vehicle-lookup`) |
| `components/offers/power-circle-offers.tsx` | UPDATE | Load offer config from JSON, real Genesis/Cogo URLs |
| `data/genesis-offers.json` | CREATE | Offer configs: title, URL, eligibility rule, UTM params |

### Phase 3 — QA & Launch

| File | Action | Justification |
|------|--------|---------------|
| `lib/energy-model/__tests__/` | CREATE | Unit tests for calculateTCE and all sub-functions |
| `e2e/calculator.spec.ts` | CREATE | Playwright E2E tests |
| `playwright.config.ts` | CREATE | Playwright config |

---

## NOT Building (Scope Limits)

Per BHL's brief — contain to total cost of energy:

- Wider household expenses (groceries, mortgage, rates, insurance, transport, comms, healthcare)
- Savings playbook (cost-cutting ideas across lifestyle categories)
- Receipt scanner (photo upload + OCR)
- Email capture / lead gen
- Open banking / bank feed integration
- User accounts or authentication
- Address autocomplete (Google Maps API) — nice-to-have for later
- Multi-language (te reo Maori) — future phase

---

## Step-by-Step Tasks

### PHASE 1: CORE BUILD (18 dev days, 2.5 weeks)

---

### Task 1: Strip out-of-scope sections from app/page.tsx

- **ACTION**: Remove household-costs, savings, dashboard sections and their imports
- **FILE**: `app/page.tsx`
- **REMOVE lines**: 314-318 (`#household-costs` section), 321-332 (`#savings` section), 335-339 (shareable summary — relocate to results section), 342-344 (Dashboard render)
- **REMOVE imports**: `Dashboard` (line 5), `TotalCostView` (line 8), `SavingsPlaybook` (line 9)
- **REMOVE state**: `navigateRef` (line 64-66) and `onRegisterNavigate` callback — only used by Dashboard
- **UPDATE**: `handleNavigate` (line 68-81) — remove `'household-costs'` and `'savings'` from the valid targets list, remove the `navigateRef.current` fallback
- **RELOCATE**: Move `<SavingsSummaryCard>` render (line 335-339) into the `#results` section after the offers
- **VALIDATE**: `npx tsc --noEmit` — no type errors. App loads without blank sections.

---

### Task 2: Delete out-of-scope files

- **ACTION**: Remove all files listed in "Phase 1 — Files to Remove" table above
- **DELETE**: `components/dashboard/` (7 files), `components/household/` (1 file), `components/savings/` (3 files), `lib/household-model/` (5 files), `lib/cost-of-living/` (4 files), `lib/household-context.ts`, `lib/chart-colors.ts`, `app/api/scan-receipt/route.ts`
- **CHECK**: After deletion, run `npx tsc --noEmit` — fix any remaining import references
- **CHECK**: Verify whether `recharts` is still imported anywhere. If not, `npm uninstall recharts`
- **CHECK**: Verify `react-hook-form` — imported in `package.json` but not used in any component. Consider removing.
- **VALIDATE**: `npx tsc --noEmit && npm run build` — clean build with no dead imports

---

### Task 3: Update header navigation

- **ACTION**: Remove out-of-scope nav items, add footer links
- **FILE**: `components/layout/header.tsx`
- **UPDATE lines 7-13**: Remove `{ label: 'Household', target: 'household-costs' }` and `{ label: 'Savings', target: 'savings' }` from `navItems`
- **ADD**: Footer-style links to `/privacy` and `/terms` (or add to a new footer component)
- **VALIDATE**: Navigation works, no dead links

---

### Task 4: Build wishlist URL encode/decode

- **ACTION**: Create utility to serialize form state + toggle selections to URL query params
- **FILE**: `lib/wishlist.ts` (CREATE)
- **IMPLEMENT**:
  ```
  encodeWishlist(input: HouseholdInput, toggles: ElectrificationToggles): string
  decodeWishlist(params: URLSearchParams): { input: HouseholdInput, toggles: ElectrificationToggles } | null
  ```
- **ENCODING**: Use short param keys to keep URL under 500 chars:
  - `r` = region (abbreviated), `o` = occupants, `h` = heating, `w` = waterHeating, `c` = cooktop
  - `v` = vehicles (comma-separated `type:usage` pairs)
  - `t` = toggles (bitfield or comma-separated flags)
- **MIRROR**: Use `zod` for decoding validation — same pattern as `lib/energy-model/schemas.ts`
- **GOTCHA**: No PII in URL. Vehicle regos are NOT included — only type + usage.
- **VALIDATE**: `npx tsc --noEmit`. Unit test: encode → decode roundtrip produces identical input.

---

### Task 5: Add wishlist save UI to results section

- **ACTION**: Add "Save my wishlist" button and modal to results section
- **FILE**: `app/page.tsx` (UPDATE), `components/share/savings-summary-card.tsx` (UPDATE)
- **IMPLEMENT**:
  - "Save my wishlist" button below the toggle section (after line ~260)
  - On click: generate URL via `encodeWishlist()`, open modal/sheet with:
    - Shareable link + copy-to-clipboard button
    - "Download as image" (existing `toPng` from `savings-summary-card.tsx:20-37`)
    - "Download as PDF" (new — use `html-to-image` toPng + wrap in a simple HTML-to-PDF approach, or add `jsPDF`)
  - On page load: check `window.location.search` for wishlist params, decode via `decodeWishlist()`, set form state + toggles, show "Your saved electrification wishlist" banner
- **MIRROR**: Use `<Sheet>` component pattern from `components/ai/conversation-panel.tsx` for the save modal
- **DEPENDENCY**: `npm install jspdf` for PDF generation (or use print-to-PDF with `@media print` styles)
- **VALIDATE**: Save → copy link → open in new tab → same results displayed

---

### Task 6: Wire offer CTA buttons to real destinations

- **ACTION**: Add hrefs with UTM params to unwired Power Circle offer buttons
- **FILE**: `components/offers/power-circle-offers.tsx`
- **UPDATE `OFFER_MAP` (line 18-24)**: Add `url` field to each offer config:
  ```ts
  { matchKey: 'EV', title: 'Genesis EV Plan', ctaLabel: 'Explore EV plans',
    url: 'https://www.genesisenergy.co.nz/for-home/products/electric-vehicles/energy-ev' },
  { matchKey: 'Heat Pump (Heating)', ...,
    url: 'https://goelectric.genesisenergy.co.nz/welcome/property' },
  // ... solar, hot water, induction
  ```
- **UPDATE CTA button (line 72-75)**: Wrap in `<a>` or use `asChild` with Link:
  ```tsx
  <a href={`${config.url}?utm_source=tce-calculator&utm_medium=wishlist&utm_content=${encodeURIComponent(config.matchKey)}`}
     target="_blank" rel="noopener noreferrer">
    <Button variant="outline" size="sm" className="mt-1">
      {config.ctaLabel} <ChevronRight className="ml-1 h-4 w-4" />
    </Button>
  </a>
  ```
- **FALLBACK**: If specific URLs not confirmed by Genesis marketing, use generic: `https://www.genesisenergy.co.nz/for-home/products`
- **VALIDATE**: Each offer card CTA opens correct URL in new tab. UTM params visible in URL.

---

### Task 7: Add rate limiting to /api/chat

- **ACTION**: Add per-IP request throttling to prevent Claude API cost blowout
- **DEPENDENCY**: `npm install @upstash/ratelimit @upstash/redis`
- **FILE**: `app/api/chat/route.ts` (UPDATE)
- **IMPLEMENT**: Add at top of POST handler (before line 168):
  ```ts
  import { Ratelimit } from '@upstash/ratelimit'
  import { Redis } from '@upstash/redis'

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, '1h'),
    analytics: true,
  })

  // In POST handler:
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, limit, remaining } = await ratelimit.limit(ip)
  if (!success) {
    return new Response(JSON.stringify({ error: 'Rate limited', retryAfter: '1h' }),
      { status: 429, headers: { 'Retry-After': '3600' } })
  }
  ```
- **ENV VARS**: Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to `.env.local`
- **GRACEFUL DEGRADATION**: Wrap ratelimit call in try/catch — if Redis down, allow request through and log error
- **CLIENT-SIDE**: In `conversation-panel.tsx`, handle 429 response: show "You've asked a lot of questions — please try again shortly" instead of generic error
- **VALIDATE**: Send 21 requests from same IP within 1 hour — 21st returns 429

---

### Task 8: Add React error boundaries

- **ACTION**: Wrap calculator, results, and EIQ panel in independent error boundaries
- **FILE**: `components/ui/error-boundary.tsx` (CREATE)
- **IMPLEMENT**: Class component wrapping `componentDidCatch`:
  ```tsx
  export class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback: React.ReactNode },
    { hasError: boolean }
  > { ... }
  ```
- **FILE**: `app/page.tsx` (UPDATE) — wrap three sections:
  - Calculator form section (lines 131-174)
  - Results section (lines 177-311)
  - ConversationPanel (line 347-352)
- **FALLBACK for EIQ**: "AI advisor is temporarily unavailable" with static conversation starters rendered as plain links
- **FALLBACK for calculator/results**: "Something went wrong. Please refresh the page."
- **VALIDATE**: Deliberately throw in EIQ panel — calculator and results still work

---

### Task 9: Create privacy policy page

- **ACTION**: Create /privacy route with draft privacy policy content
- **FILE**: `app/privacy/page.tsx` (CREATE)
- **CONTENT**: What data is collected (analytics cookies only after consent, AI conversation content sent to Anthropic for processing but not stored by Genesis, no PII persisted), NZ Privacy Act 2020 compliance, data retention (none — stateless), third-party disclosure (Anthropic for AI, Google for analytics if consented)
- **MIRROR**: Use same layout pattern as main page — `<Header>` + content + footer
- **NOTE**: Draft content — Genesis legal reviews and approves before go-live
- **VALIDATE**: Page loads at `/privacy`, links work from footer

---

### Task 10: Create terms of use page

- **ACTION**: Create /terms route with draft terms content
- **FILE**: `app/terms/page.tsx` (CREATE)
- **CONTENT**: Savings estimates are indicative only, based on publicly available data (Powerswitch, MBIE, Rewiring Aotearoa, EECA), not a guarantee. Not financial advice. Methodology section. Genesis is not liable for decisions made based on calculator outputs.
- **VALIDATE**: Page loads at `/terms`

---

### Task 11: Add cookie consent banner

- **ACTION**: Create cookie consent component, inject before analytics loads
- **FILE**: `components/ui/cookie-consent.tsx` (CREATE)
- **IMPLEMENT**:
  - Fixed bottom banner: "This site uses cookies for analytics" + Accept / Reject / Manage
  - Consent stored in `localStorage` key `genesis-cookie-consent`
  - If accepted: dynamically inject GA4 script tag
  - If rejected: no analytics cookies set
  - Banner hidden after choice, re-accessible via footer link
- **FILE**: `app/layout.tsx` (UPDATE) — render `<CookieConsent>` in the body
- **VALIDATE**: First visit shows banner. After "Reject", no GA4 cookies appear. After "Accept", GA4 loads.

---

### Task 12: Add AI advisor disclaimer

- **ACTION**: Add persistent AI disclosure label to conversation panel
- **FILE**: `components/ai/conversation-panel.tsx` (UPDATE)
- **IMPLEMENT**: Add above the message list (after line ~136):
  ```tsx
  <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/20 border-b border-border">
    AI Energy Advisor — powered by AI. Responses are generated and may not be perfectly accurate.
  </div>
  ```
- **UPDATE system prompt** in `lib/tce-context.ts`: Add instruction: "If asked about specific Genesis plan pricing or contract terms, direct the user to visit genesisenergy.co.nz or call Genesis directly. Do not invent plan names or prices."
- **VALIDATE**: Disclaimer visible before any AI interaction. AI doesn't fabricate plan details.

---

### Task 13: WCAG 2.1 AA accessibility audit + fixes

- **ACTION**: Full accessibility audit and fix all Level A and AA violations
- **TOOLS**: `npm install -D axe-core @axe-core/react` for automated checks
- **AUDIT AREAS**:
  - Keyboard: All buttons, selects, checkboxes, sheet panel reachable via Tab. Focus trapped in Sheet when open.
  - Focus indicators: Visible `:focus-visible` ring on all interactive elements (check against `bg-background`)
  - Screen reader: `aria-label` on chart bars, `aria-describedby` on form groups, `role="status"` on live results
  - Colour contrast: Verify `text-muted-foreground` against `bg-background` meets 4.5:1. Check `bg-primary/5` text contrast.
  - Forms: Error messages use `aria-invalid` + `aria-describedby`. Required fields marked.
  - Motion: `prefers-reduced-motion` disables streaming text animation and chart transitions
  - Landmarks: `<main>`, `<nav>`, `<aside>` for EIQ panel
  - Skip-to-content link as first focusable element
- **VALIDATE**: `npx axe-core` scan returns 0 violations. Full flow via keyboard. VoiceOver reads all content. Lighthouse Accessibility 95+.

---

### Task 14: SEO meta tags, OG image, structured data

- **ACTION**: Add production SEO to make the calculator discoverable and shareable
- **FILE**: `app/layout.tsx` (UPDATE)
- **CHANGES**:
  - Update `metadata.robots` from `{ index: false, follow: false }` (line 22) to `{ index: true, follow: true }`
  - Add `title`, `description`, `openGraph` (title, description, image, url), `twitter` card tags
  - Add `viewport`, `themeColor` (Genesis Ultra Orange)
- **FILE**: `app/page.tsx` or `app/layout.tsx` — add JSON-LD `WebApplication` structured data
- **FILES**: Create `public/og-image.png` (1200x630 Genesis-branded preview card), `public/robots.txt`, `public/sitemap.xml`, update `public/icon.svg` if needed
- **VALIDATE**: Share URL on social → shows branded preview. Lighthouse SEO 90+.

---

### Task 15: Mobile responsive polish

- **ACTION**: Test and fix responsive issues across devices
- **DEVICES**: iPhone SE (375px), iPhone 15 (390px), Samsung Galaxy (360px), iPad Mini (768px)
- **CHECKS**:
  - Touch targets: All buttons/checkboxes minimum 44x44px
  - Form inputs: font-size >= 16px (prevents iOS auto-zoom)
  - Charts: `stacked-comparison.tsx` bars readable at 320px (they're CSS-based, should scale)
  - EIQ Sheet: Verify full-screen on mobile (Sheet component already handles this via shadcn)
  - No horizontal overflow on any viewport
  - Scroll-to-results after form submit works on mobile
- **VALIDATE**: No layout breaks 320px+. All touch targets meet minimum.

---

### Task 16: Loading states and skeleton UI

- **ACTION**: Add visual feedback for async operations
- **IMPLEMENT**:
  - Typing indicator in EIQ panel: Show pulsing dots after sending message, before first `text-delta` arrives (currently no indicator — `conversation-panel.tsx:62` starts showing text only when first chunk arrives)
  - Smooth scroll to `#results` after form values change (first interaction)
- **GOTCHA**: Calculator results are synchronous via `useMemo` — no loading state needed for them. Only async operations (AI chat, future rego lookup) need indicators.
- **VALIDATE**: Typing indicator visible within 200ms of sending message. No layout shift.

---

### PHASE 2: DATA & OFFERS (9 dev days, 1.5 weeks)

---

### Task 17: Create /api/vehicle-lookup route

- **ACTION**: Server-side API route that queries NZTA + EECA for real vehicle data
- **FILE**: `app/api/vehicle-lookup/route.ts` (CREATE)
- **IMPLEMENT**:
  ```
  POST { plate: string }
  → Query NZTA ArcGIS FeatureServer: where=PLATE='{plate}'
    Returns: make, model, year, fuelType, ccRating, bodyType
  → Query EECA Fuelsaver: ?params={"api":"labels","plate":"{plate}","login":"{token}"}
    Returns: fuelEconomy (L/100km or kWh/100km), co2GKm
  → Merge results into VehicleLookupResult
  → Cache in-memory or KV for 24hrs (vehicle data doesn't change)
  → Return JSON
  ```
- **ENV VARS**: `EECA_FUELSAVER_TOKEN` (from registration at resources.fuelsaver.govt.nz)
- **ERROR HANDLING**: NZTA down → return `{ error: 'lookup_failed', fallback: true }`. EECA down → return NZTA data without fuel economy (calculator can estimate from vehicle type). Invalid plate → return `null`.
- **VALIDATE**: Real NZ plate returns correct make/model/fuel type. Invalid plate returns null gracefully.

---

### Task 18: Convert rego lookup from sync to async

- **ACTION**: Update tce-form.tsx to call /api/vehicle-lookup instead of sync mock
- **FILE**: `components/calculator/tce-form.tsx` (UPDATE)
- **CHANGE `handleLookup` (line 109-115)**:
  ```tsx
  const handleLookup = useCallback(async (vehicleId: number) => {
    setVehicles(prev => prev.map(v =>
      v.id === vehicleId ? { ...v, lookupLoading: true } : v
    ))
    try {
      const res = await fetch('/api/vehicle-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate: vehicles.find(v => v.id === vehicleId)?.plate }),
      })
      const result = await res.json()
      setVehicles(prev => prev.map(v =>
        v.id === vehicleId ? { ...v, lookup: result, lookupDone: true, lookupLoading: false } : v
      ))
    } catch {
      setVehicles(prev => prev.map(v =>
        v.id === vehicleId ? { ...v, lookup: null, lookupDone: true, lookupLoading: false } : v
      ))
    }
  }, [vehicles])
  ```
- **ADD**: `lookupLoading` boolean to `VehicleEntry` type. Show spinner on lookup button while loading.
- **REMOVE**: `DEMO_PLATES` import and usage (line 4, line 226) — no longer needed with real API. Remove "Try one of these demo plates" fallback message.
- **KEEP**: Fallback to manual vehicle type selection if lookup returns null (existing behaviour at line 89-100 in the useEffect)
- **VALIDATE**: Enter real NZ plate → shows correct vehicle. Enter invalid plate → falls back to manual selection.

---

### Task 19: Create energy pricing JSON config

- **ACTION**: Extract mutable pricing data from constants.ts into a JSON config file
- **FILE**: `data/energy-pricing.json` (CREATE)
- **STRUCTURE**:
  ```json
  {
    "lastUpdated": "2026-04-14",
    "source": "Powerswitch 2025 / MBIE March 2026",
    "electricity": {
      "rates": { "auckland": 0.393, "waikato": 0.380, ... },
      "fixedAnnual": 768
    },
    "gas": { "rate": 0.118, "fixedAnnual": 689 },
    "lpg": { "rate": 0.255 },
    "petrol": { "pricePerLitre": 3.20, "energyRate": 0.289 },
    "ev": { "kwhPer100km": 18, "rucPer1000km": 76 },
    "solar": { "annualSavings": 1600 }
  }
  ```
- **FILE**: `lib/energy-model/pricing.ts` (CREATE) — load and validate JSON, export typed constants
- **FILE**: `lib/energy-model/constants.ts` (UPDATE) — replace hardcoded pricing values with imports from `pricing.ts`. Keep immutable constants (consumption patterns, occupancy multipliers, emissions factors, appliance costs) in constants.ts.
- **FILE**: `lib/energy-model/costs.ts` (UPDATE) — import rates from new pricing module instead of constants
- **FILE**: `lib/energy-model/roadmap.ts` (UPDATE) — same import change
- **VALIDATE**: `npx tsc --noEmit`. Calculator produces identical results to current hardcoded values.

---

### Task 20: Add MBIE fuel price parsing

- **ACTION**: Parse latest week from MBIE CSV into the pricing config
- **APPROACH**: Download `weekly-table.csv` from MBIE, parse the latest row for regular petrol and diesel national averages. Update `data/energy-pricing.json` with current values.
- **OPTION A (manual)**: Document the quarterly update process — download CSV, read latest row, update JSON.
- **OPTION B (script)**: Create `scripts/update-fuel-prices.ts` that fetches the CSV, parses it, and updates the JSON file. Run manually or via CI cron.
- **ADD to results UI**: Show "Pricing data as of {lastUpdated}" below the chart — read from the JSON config's `lastUpdated` field.
- **VALIDATE**: Results page shows pricing date. Values match latest MBIE data.

---

### Task 21: Create Genesis offers JSON config

- **ACTION**: Externalize offer configs so Genesis marketing can update without code changes
- **FILE**: `data/genesis-offers.json` (CREATE)
- **STRUCTURE**:
  ```json
  [
    {
      "matchKey": "EV",
      "title": "Genesis EV Plan",
      "subtitle": "Charge your EV for less with dedicated EV rates",
      "ctaLabel": "Explore EV plans",
      "url": "https://www.genesisenergy.co.nz/for-home/products/electric-vehicles/energy-ev",
      "icon": "car"
    },
    ...
  ]
  ```
- **FILE**: `components/offers/power-circle-offers.tsx` (UPDATE) — import from JSON config instead of hardcoded `OFFER_MAP`
- **VALIDATE**: Changing JSON changes displayed offers without code deployment (on next build)

---

### PHASE 3: QA & LAUNCH (11 dev days, 1.5 weeks)

---

### Task 22: Unit tests — energy model

- **ACTION**: Test suite covering calculateTCE and all sub-functions
- **FILE**: `lib/energy-model/__tests__/calculate-tce.test.ts` (CREATE)
- **TEST CASES**:
  - Each demo profile produces expected output (within 5% of manually verified values)
  - Edge: 1 occupant, 5+ occupants
  - Edge: no vehicles (fallback to default)
  - Edge: all-electric household (savings near zero)
  - Edge: all-gas household (maximum savings)
  - Each toggle combination produces valid output
  - Pricing config change propagates correctly
  - Emissions calculation matches manual cross-check
- **FRAMEWORK**: Vitest (or Jest if already configured — check `package.json`)
- **VALIDATE**: `npx vitest run lib/energy-model/__tests__/` — all tests pass, coverage >= 80%

---

### Task 23: E2E tests — Playwright

- **ACTION**: Automated browser tests for the full user journey
- **FILE**: `e2e/calculator.spec.ts` (CREATE), `playwright.config.ts` (CREATE)
- **TEST CASES**:
  - Happy path: fill form → see results → toggle items → save wishlist → open link → same results
  - Demo profile quick-fill: click each → verify results render
  - Form validation: required fields enforced
  - Mobile viewport (375px): full flow works
  - EIQ: send message → see streaming response (mock Claude in test)
  - Rate limiting: 429 shown gracefully after exceeding limit (mock Redis)
  - Wishlist URL: encode → navigate → decode → identical state
  - Offer links: each CTA has working href with UTM params
- **VALIDATE**: `npx playwright test` — all pass in CI, desktop + mobile viewports

---

### Task 24: Security review + launch prep

- **ACTION**: Final security audit and launch preparation
- **CHECKS**:
  - `npm audit` — zero high/critical vulnerabilities
  - CORS: Verify API routes only accept requests from Genesis domains
  - CSP headers: Add `Content-Security-Policy` header in `next.config.mjs`
  - No secrets in client bundle: Verify `ANTHROPIC_API_KEY`, `EECA_FUELSAVER_TOKEN`, `UPSTASH_*` are server-side only
  - HTTP headers: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy
  - AI prompt injection: Test adversarial user messages — verify system prompt cannot be extracted or overridden
  - Rate limiting: Verify cannot bypass via header manipulation
- **LAUNCH**:
  - Deploy to staging URL
  - UAT walkthrough with BHL and stakeholders
  - Fix critical feedback
  - Switch `robots` from `noindex` to `index` (done in Task 14)
  - DNS cutover to production subdomain
  - Monitor Sentry + analytics for first 48hrs
- **VALIDATE**: Genesis IT sign-off. Stakeholder go-live approval.

---

## Testing Strategy

### Unit Tests

| Test File | Test Cases | Validates |
|-----------|-----------|-----------|
| `lib/energy-model/__tests__/calculate-tce.test.ts` | Demo profiles, edge cases, toggle combos | Core calculation engine |
| `lib/energy-model/__tests__/pricing.test.ts` | JSON load, validation, fallback | Pricing config |
| `lib/__tests__/wishlist.test.ts` | Encode/decode roundtrip, edge cases | Wishlist URL params |

### E2E Tests

| Test File | Test Cases | Validates |
|-----------|-----------|-----------|
| `e2e/calculator.spec.ts` | Full journey, mobile, offers, wishlist, rate limiting | End-to-end UX |

### Edge Cases Checklist

- [ ] Empty form submission (should use demo defaults)
- [ ] All toggles off (shows current cost only)
- [ ] All toggles on (shows full electrification)
- [ ] Solar toggle only (shows solar reduction without other changes)
- [ ] 5+ occupants
- [ ] Invalid rego plate → manual fallback
- [ ] NZTA API timeout → graceful fallback
- [ ] Claude API down → calculator works, EIQ shows fallback
- [ ] Redis down → rate limiting degrades gracefully
- [ ] Wishlist URL with missing/invalid params → falls back to defaults
- [ ] Concurrent sessions from same IP → rate limiting works correctly

---

## Validation Commands

### Level 1: STATIC ANALYSIS

```bash
npx tsc --noEmit && npx next lint
```

### Level 2: UNIT TESTS

```bash
npx vitest run
```

### Level 3: FULL SUITE

```bash
npx vitest run && npm run build
```

### Level 4: E2E

```bash
npx playwright test
```

### Level 5: BROWSER VALIDATION

- [ ] Calculator loads with demo profile
- [ ] Form changes recalculate in real-time
- [ ] Toggles update electrified costs
- [ ] EIQ advisor responds with personalised advice
- [ ] Wishlist saves and restores correctly
- [ ] Offer links open correct URLs
- [ ] Mobile layout works on 375px viewport
- [ ] Cookie consent blocks analytics until accepted

---

## Acceptance Criteria

- [ ] All out-of-scope features removed cleanly (no dead code, reduced bundle)
- [ ] Wishlist save produces shareable URL under 500 chars
- [ ] All offer CTAs link to real Genesis/Cogo URLs with UTM tracking
- [ ] Rate limiting prevents > 20 chat requests/hour per IP
- [ ] Error boundaries prevent cascading failures
- [ ] Privacy policy and terms pages exist with draft content
- [ ] Cookie consent blocks analytics until accepted
- [ ] AI disclaimer visible in EIQ panel
- [ ] WCAG 2.1 AA: zero axe-core violations, keyboard navigable, Lighthouse 95+
- [ ] SEO: OG tags, structured data, Lighthouse SEO 90+
- [ ] Real rego lookup works for valid NZ plates
- [ ] Energy pricing loaded from JSON config with visible "as of" date
- [ ] All unit tests pass with >= 80% coverage
- [ ] All E2E tests pass on desktop and mobile
- [ ] Zero high/critical npm audit vulnerabilities
- [ ] Build succeeds with no warnings

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| NZTA ArcGIS API rate limits or downtime | Low | Medium | Cache lookups 24hrs. Graceful fallback to manual entry. |
| EECA Fuelsaver token registration delayed | Low | Medium | Can launch with NZTA-only data (fuel type without economy). Add EECA later. |
| Recharts removal breaks something unexpected | Low | Low | Verify no hidden imports before uninstalling. TSC will catch. |
| Wishlist URL too long for some vehicles/configs | Medium | Low | Use abbreviated param keys. Test worst case (5 vehicles, all fields). |
| Genesis legal delays privacy/terms approval | Medium | Medium | Deploy staging with draft copy. Final copy before go-live only. |
| Upstash Redis connection issues in prod | Low | Medium | Graceful degradation — allow requests through if Redis unreachable. |

---

## Notes

- **Recharts removal**: The stacked comparison chart (`stacked-comparison.tsx`) is pure CSS — not Recharts. All Recharts usage is in the dashboard components being removed. Verify with `grep -r "recharts" --include="*.tsx" --include="*.ts"` after deletion.
- **react-hook-form**: Listed in package.json but not imported in any component. TCEForm uses plain useState. Can be removed to reduce bundle.
- **jsPDF**: Not currently installed. Needed for PDF wishlist export. Alternative: use browser `window.print()` with `@media print` styles — simpler, no dependency.
- **Demo profiles**: Keep the 3 TCE demo profiles (`lib/energy-model/demo-profiles.ts`) — they're used for quick-fill in the form and useful for testing.
- **Cogo deep-link confirmation**: Ask Cogo account manager whether `goelectric.genesisenergy.co.nz` supports URL parameters for pre-filling region/property type. If yes, pass from wishlist state.
