# Feature: TCE Calculator UI

## Summary

Replace the placeholder dashboard with a working TCE calculator: a guided input form that collects household energy profile data, feeds it to `calculateTCE()`, and displays the results as a compelling before/after comparison with a hero savings number, per-vector breakdown, and a Recharts bar chart. The form uses react-hook-form + zod for validation, and shadcn/ui components for inputs. Mobile-first, responsive to desktop.

## User Story

As a New Zealand household member
I want to enter my energy profile and instantly see my Total Cost of Energy
So that I understand what I spend on power, gas, and petrol combined, and how much I could save by going electric

## Problem Statement

The dashboard currently shows placeholder cards with no interactivity. The energy model (`calculateTCE`) exists but has no UI to collect inputs or display results. Users cannot see any TCE numbers.

## Solution Statement

A two-state dashboard: (1) an input form view where users enter their household profile (region, occupants, heating, water, cooktop, vehicles, solar interest), and (2) a results view showing the TCE comparison. The form produces a `HouseholdInput` object, calls `calculateTCE()`, and the results populate hero numbers, breakdown cards, and a bar chart. Demo profile buttons let stakeholders skip the form for instant results.

## Metadata

| Field            | Value                                                |
| ---------------- | ---------------------------------------------------- |
| Type             | NEW_CAPABILITY                                       |
| Complexity       | HIGH                                                 |
| Systems Affected | components/dashboard/, components/ui/, lib/format.ts |
| Dependencies     | recharts@2.15.4, react-hook-form@7.60, zod@3.25.76  |
| Estimated Tasks  | 8                                                    |

---

## UX Design

### Before State

```
╔═══════════════════════════════════════════════════════════╗
║  [Genesis Logo] Total Cost of Energy         [Nav]        ║
║  ─────────────────────────────────────────────────────── ║
║                                                           ║
║    "What does your energy really cost?"                   ║
║                                                           ║
║    ┌─────────────┐  ┌─────────────┐                       ║
║    │ Placeholder  │  │ Placeholder  │                      ║
║    │ "coming soon"│  │ "coming soon"│                      ║
║    └─────────────┘  └─────────────┘                       ║
║                                                           ║
║    USER_FLOW: Dead end — no interactivity                 ║
║    PAIN_POINT: Cannot enter data or see any numbers       ║
╚═══════════════════════════════════════════════════════════╝
```

### After State

```
╔═══════════════════════════════════════════════════════════╗
║  [Genesis Logo] Total Cost of Energy         [Nav]        ║
║  ─────────────────────────────────────────────────────── ║
║                                                           ║
║  ┌─── INPUT FORM VIEW ──────────────────────────────────┐ ║
║  │  "Tell us about your home"                           │ ║
║  │  [Auckland ▼] [4 people ▼]                           │ ║
║  │  Heating: ○ Gas ○ Electric ○ Heat pump               │ ║
║  │  Water:   ○ Gas ○ Electric ○ Heat pump               │ ║
║  │  Cooktop: ○ Gas ○ Electric ○ Induction               │ ║
║  │  Vehicle 1: [Petrol ▼] [Medium usage ▼]              │ ║
║  │  [+ Add vehicle]                                     │ ║
║  │  ☐ Include solar panels                              │ ║
║  │  [Calculate my TCE ▶]                                │ ║
║  │  ── or try a demo ──                                 │ ║
║  │  [Auckland Family] [Wellington Renter] [Chch Owner]  │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                         ↓ submit                          ║
║  ┌─── RESULTS VIEW ────────────────────────────────────┐  ║
║  │  YOUR TOTAL COST OF ENERGY                          │  ║
║  │  ┌──────────┐    ┌──────────┐    ┌──────────┐      │  ║
║  │  │ $7,366   │ →  │ $4,708   │ =  │ $2,658   │      │  ║
║  │  │ Current  │    │Electric  │    │ Savings  │      │  ║
║  │  │ /year    │    │ /year    │    │ /year    │      │  ║
║  │  └──────────┘    └──────────┘    └──────────┘      │  ║
║  │                                                     │  ║
║  │  ┌─────────── Bar Chart ──────────────┐             │  ║
║  │  │ Elec ████████ $1,842  → $4,708     │             │  ║
║  │  │ Gas  ████     $1,423  → $0         │             │  ║
║  │  │ Fuel █████████ $4,101 → $0         │             │  ║
║  │  └────────────────────────────────────┘             │  ║
║  │                                                     │  ║
║  │  Emissions: 5.12t CO₂ → 0.57t (-89%)               │  ║
║  │                                                     │  ║
║  │  [← Edit profile]  [See savings roadmap →]          │  ║
║  └─────────────────────────────────────────────────────┘  ║
╚═══════════════════════════════════════════════════════════╝
```

### Interaction Changes

| Location | Before | After | User Impact |
|----------|--------|-------|-------------|
| Dashboard | Placeholder cards | Input form + results | Can enter profile and see TCE |
| Demo buttons | N/A | 3 pre-built profiles | Instant stakeholder demo |
| Results hero | N/A | Current → Electrified → Savings | Compelling savings case |
| Bar chart | N/A | Side-by-side cost comparison | Visual breakdown by vector |

---

## Mandatory Reading

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `lib/energy-model/types.ts` | all | HouseholdInput shape the form must produce; TCEResult shape the results must consume |
| P0 | `lib/energy-model/index.ts` | 38-86 | calculateTCE() API and re-exports |
| P0 | `lib/energy-model/demo-profiles.ts` | all | Demo profile data for quick-launch buttons |
| P0 | `components/dashboard/index.tsx` | all | Current placeholder to REPLACE |
| P1 | `components/ui/card.tsx` | all | Card primitives available |
| P1 | `components/ui/button.tsx` | all | Button variants available |
| P2 | PoC `components/dashboard/usage-card.tsx` | all | Card composition pattern to mirror |
| P2 | PoC `components/dashboard/billing-card.tsx` | all | Number display pattern |

**External Documentation:**

| Source | Section | Why Needed |
|--------|---------|------------|
| [Recharts BarChart](https://recharts.org/en-US/api/BarChart) | BarChart, Bar, XAxis, YAxis, ResponsiveContainer | Bar chart for cost comparison |
| [react-hook-form with shadcn](https://ui.shadcn.com/docs/components/form) | Form integration | Form + zod validation pattern |
| [shadcn/ui Select](https://ui.shadcn.com/docs/components/select) | Select component | Region and vehicle type dropdowns |
| [shadcn/ui RadioGroup](https://ui.shadcn.com/docs/components/radio-group) | RadioGroup component | Heating/water/cooktop type selection |

---

## Patterns to Mirror

**CARD_COMPOSITION (from PoC):**
```tsx
// SOURCE: gen-agentforce-poc/components/dashboard/usage-card.tsx
<Card className="group relative">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">{title}</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    <div className="text-3xl font-bold">{value}</div>
    <p className="text-muted-foreground text-sm">{label}</p>
  </CardContent>
</Card>
```

**STAT_TILE (from PoC):**
```tsx
// SOURCE: gen-agentforce-poc/components/dashboard/usage-card.tsx:57-66
<div className="grid grid-cols-2 gap-3 pt-2">
  <div className="rounded-lg bg-secondary/50 p-2">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
</div>
```

**RESPONSIVE_GRID (from PoC):**
```tsx
// SOURCE: gen-agentforce-poc/components/dashboard/index.tsx:68-71
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div className="lg:col-span-2 space-y-4">...</div>
  <div className="space-y-4">...</div>
</div>
```

**DASHBOARD_STATE (from PoC):**
```tsx
// SOURCE: gen-agentforce-poc/components/dashboard/index.tsx:19-26
// Dashboard owns all shared state, derives data at render time, passes as props
const [state, setState] = useState(...)
const derivedData = computeFunction(state)
return <ChildCard data={derivedData} onAction={callback} />
```

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `lib/format.ts` | CREATE | Currency, kWh, percentage formatting utilities |
| `components/ui/select.tsx` | CREATE | shadcn Select (via CLI) for dropdowns |
| `components/ui/radio-group.tsx` | CREATE | shadcn RadioGroup for appliance type selection |
| `components/ui/label.tsx` | CREATE | shadcn Label for form fields |
| `components/ui/separator.tsx` | CREATE | shadcn Separator for visual dividers |
| `components/ui/checkbox.tsx` | CREATE | shadcn Checkbox for solar toggle |
| `components/dashboard/energy-form.tsx` | CREATE | Household energy profile input form |
| `components/dashboard/tce-results.tsx` | CREATE | TCE results display with hero numbers + chart |
| `components/dashboard/cost-chart.tsx` | CREATE | Recharts bar chart for cost comparison |
| `components/dashboard/index.tsx` | UPDATE | Replace placeholder with form → results flow |

---

## NOT Building (Scope Limits)

- No savings roadmap display — that's Phase 4
- No bill tracker — that's Phase 5
- No AI advisor chat — that's Phase 6
- No form persistence or URL state — prototype only
- No animated transitions between form and results
- No print/export functionality
- No error boundary — prototype

---

## Step-by-Step Tasks

### Task 1: CREATE `lib/format.ts`

- **ACTION**: Create formatting utilities for currency, energy, and percentages
- **IMPLEMENT**:
  ```typescript
  export function formatCurrency(amount: number): string  // "$7,366"
  export function formatCurrencyShort(amount: number): string  // "$7.4k"
  export function formatKwh(kwh: number): string  // "7,000 kWh"
  export function formatPercent(pct: number): string  // "36%"
  export function formatTonnes(t: number): string  // "5.12t"
  ```
- **PATTERN**: Use `Intl.NumberFormat('en-NZ', ...)` for locale-aware formatting
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: ADD shadcn/ui form components

- **ACTION**: Add Select, RadioGroup, Label, Separator, Checkbox via shadcn CLI
- **IMPLEMENT**: `npx shadcn@latest add select radio-group label separator checkbox --yes`
- **GOTCHA**: If CLI fails, manually copy from shadcn docs / PoC pattern. Ensure `radix-ui` umbrella imports are used (not individual `@radix-ui/*` packages).
- **VALIDATE**: `npx tsc --noEmit` — all new components compile

### Task 3: CREATE `components/dashboard/energy-form.tsx`

- **ACTION**: Build the household energy profile input form
- **IMPLEMENT**:
  - `'use client'` directive
  - Uses react-hook-form with zod schema matching `HouseholdInput`
  - Fields:
    - Region: `<Select>` with all 16 NZ regions, grouped by island
    - Occupants: `<Select>` with 1-5+ options
    - Heating type: `<RadioGroup>` with 5 HeatingType options (Gas, LPG, Wood, Electric, Heat Pump)
    - Water heating: `<RadioGroup>` with 5 WaterHeatingType options
    - Cooktop: `<RadioGroup>` with 4 CooktopType options
    - Vehicles: Dynamic array — each vehicle has type `<Select>` + usage `<Select>`. Add/remove buttons.
    - Include solar: `<Checkbox>`
  - Submit button: "Calculate my Total Cost of Energy" (primary variant)
  - Demo profile buttons below a separator: 3 buttons for Auckland/Wellington/Christchurch profiles
  - Props: `onSubmit: (input: HouseholdInput) => void` and `onDemo: (profileKey: string) => void`
- **MIRROR**: PoC card layout patterns for visual consistency
- **GOTCHA**: Vehicle array needs dynamic add/remove. Start with 1 vehicle, max 3. Use `useFieldArray` from react-hook-form.
- **VALIDATE**: `npx tsc --noEmit`

### Task 4: CREATE `components/dashboard/cost-chart.tsx`

- **ACTION**: Recharts bar chart showing current vs electrified costs by vector
- **IMPLEMENT**:
  - `'use client'` directive
  - Props: `currentCosts: EnergyBreakdown`, `electrifiedCosts: EnergyBreakdown`
  - Horizontal grouped bar chart with 3 categories (Electricity, Gas, Transport)
  - Two bars per category: "Current" (chart-3 / Space colour) and "Electrified" (chart-1 / Orange)
  - Use `ResponsiveContainer` for mobile responsiveness
  - Show value labels on bars
  - Use CSS custom properties for colours via `var(--chart-1)` etc.
- **PATTERN**: Recharts `<BarChart>` + `<Bar>` + `<XAxis>` + `<YAxis>` + `<ResponsiveContainer>`
- **GOTCHA**: Recharts needs `'use client'` — it uses browser APIs. Wrap in `ResponsiveContainer` with explicit `width="100%"` and `height={250}`.
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: CREATE `components/dashboard/tce-results.tsx`

- **ACTION**: TCE results display with hero numbers, breakdown, chart, and emissions
- **IMPLEMENT**:
  - `'use client'` directive
  - Props: `result: TCEResult`, `onEdit: () => void`
  - **Hero section**: Three large numbers in a row — Current ($X,XXX/yr), Electrified ($X,XXX/yr), Savings ($X,XXX/yr, X%)
    - Current: `text-foreground`
    - Electrified: `text-primary` (orange)
    - Savings: `text-green-600` with down-arrow icon
  - **Cost breakdown chart**: `<CostChart>` component
  - **Emissions card**: Current → Electrified tonnes with percentage reduction
  - **Monthly savings callout**: "That's $XXX less per month" in accent background
  - **Action buttons**: "Edit my profile" (outline) and placeholder for "See savings roadmap" (primary, disabled for Phase 4)
  - Use `formatCurrency`, `formatPercent`, `formatTonnes` from `lib/format.ts`
- **MIRROR**: PoC card composition pattern (Card + CardHeader + CardContent)
- **VALIDATE**: `npx tsc --noEmit`

### Task 6: UPDATE `components/dashboard/index.tsx`

- **ACTION**: Replace placeholder dashboard with form → results flow
- **IMPLEMENT**:
  - `'use client'` directive
  - State: `view: 'form' | 'results'`, `result: TCEResult | null`, `currentInput: HouseholdInput | null`
  - On form submit: call `calculateTCE(input)`, set result, switch to results view
  - On demo profile click: call `calculateTCE(DEMO_PROFILES[key].input)`, set result, switch to results
  - On "Edit profile": switch back to form view, preserve last input
  - Keep the hero text and overall layout wrapper
  - Keep the command bar placeholder at the bottom
- **MIRROR**: PoC dashboard state management pattern — Dashboard owns state, passes derived data as props
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 7: Verify full build + dev server

- **ACTION**: Run production build and dev server to verify everything works end-to-end
- **IMPLEMENT**:
  - `npm run build` — must succeed
  - `npm run dev` — page loads, form renders, demo profile buttons work, results display
- **VALIDATE**: Build succeeds, dev server renders correctly

### Task 8: Browser validation

- **ACTION**: Verify in browser that the form → results flow works
- **IMPLEMENT**: Test each demo profile, verify:
  - Auckland Family: shows $7,366 current, $4,708 electrified, $2,658 savings
  - Chart shows three categories with before/after bars
  - Emissions reduction displayed
  - "Edit profile" returns to form
  - Mobile layout (< 768px) — single column, form fields stack
  - Desktop layout (> 1024px) — results use wider layout
- **VALIDATE**: Visual inspection in browser

---

## Testing Strategy

### Visual Verification (Primary)

| Check | Expected |
|-------|----------|
| Form renders all fields | Region, occupants, heating, water, cooktop, vehicles, solar |
| Demo buttons work | Click "Auckland Family" → instant results |
| Hero numbers correct | Match smoke test values from Phase 2 |
| Chart renders | 3 categories, 2 bars each, correct colours |
| Mobile responsive | Single column, no horizontal overflow |
| Edit button works | Returns to form with previous input preserved |

### Edge Cases

- [ ] Submit with all defaults (no changes) — should still produce valid results
- [ ] 0 vehicles — form should allow this, results should show $0 transport
- [ ] 3 vehicles — add/remove works correctly
- [ ] Smallest region (Northland) — numbers are reasonable
- [ ] Largest region (Southland) — heating costs higher due to multiplier

---

## Validation Commands

### Level 1: STATIC_ANALYSIS

```bash
npx tsc --noEmit
```

### Level 2: BUILD

```bash
npm run build
```

### Level 5: BROWSER_VALIDATION

```bash
npm run dev
# Then verify in browser at localhost:3000
```

---

## Acceptance Criteria

- [ ] User can enter household profile via form
- [ ] Demo profile buttons produce instant results
- [ ] Hero numbers show Current / Electrified / Savings with correct formatting
- [ ] Bar chart displays cost comparison by vector (Electricity, Gas, Transport)
- [ ] Emissions reduction shown
- [ ] "Edit profile" returns to form
- [ ] Mobile-first responsive layout
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] Auckland Family demo shows ~$7,366 current, ~$2,658 savings

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Recharts SSR issues with Next.js 16 | Medium | Medium | Wrap in `'use client'` + dynamic import if needed |
| Form complexity for mobile | Medium | Low | Stack all fields vertically on mobile, group with sections |
| shadcn Select/RadioGroup CLI fails | Low | Low | Manual copy from docs, already done for Phase 1 components |
| Vehicle array dynamic add/remove | Medium | Low | Start simple with 1 vehicle + "Add vehicle" button, cap at 3 |

---

## Notes

- Recharts is already installed (v2.15.4) but has never been used in either the PoC or this project. This will be the first chart component.
- react-hook-form, zod, and @hookform/resolvers are all installed but unused. This will be the first form.
- The PoC never formats numbers with a utility — it uses inline `.toFixed(2)` and template literals. We improve on this with `lib/format.ts`.
- The form should default to a reasonable "average NZ household" when first loaded (e.g., Auckland, 3 occupants, electric heating, 1 petrol vehicle medium usage) so the form isn't blank.
- Demo profile buttons are critical for stakeholder demos — they bypass the form entirely for instant results.
