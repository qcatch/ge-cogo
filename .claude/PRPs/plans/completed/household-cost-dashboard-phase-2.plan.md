# Feature: Household Cost Dashboard — Phase 2: Dashboard UI

## Summary

Build the visual dashboard experience: a hero stats section, donut chart for spending category breakdown, 12-month stacked area trend chart, enhanced category cards with progress bars, and NZ benchmark comparisons. All using Recharts 2.15.4, shadcn/ui (adding Tabs, Badge, Progress), and Genesis Brand 4.0 tokens. The dashboard is already wired with demo data from Phase 1 — this phase replaces the placeholder layout with polished, production-quality visualisations.

## User Story

As a Genesis stakeholder viewing the prototype
I want to see a polished, visually compelling dashboard showing where household money goes and how costs trend over time
So that I can immediately understand the product's value and approve it for production development

## Problem Statement

The Phase 1 dashboard renders raw category cards in a flat list. It lacks the visual impact needed for stakeholder sell-in: no charts, no trend visualisation, no benchmark comparisons, no hero stats. The data model is solid but the presentation doesn't tell a story.

## Solution Statement

Build 3 new chart components (SpendingDonut, SpendingTrend, CategoryCard), add 3 shadcn components (Tabs, Badge, Progress), and restructure the dashboard layout into a hero section, tabbed views (Overview with donut + Trends with area chart), and an enhanced category grid with progress bars and benchmark comparisons. All data flows from the existing `HouseholdSpending` state established in Phase 1.

## Metadata

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| Type             | NEW_CAPABILITY                                    |
| Complexity       | MEDIUM                                            |
| Systems Affected | components/dashboard, components/ui               |
| Dependencies     | recharts 2.15.4 (already installed), shadcn/ui    |
| Estimated Tasks  | 8                                                 |

---

## UX Design

### Before State

```
╔═════════════════════════════════════════════════════════════╗
║  Hero: "Where does your money go?"                         ║
║  Profile Banner: [Name] [$X,XXX/mo]                        ║
║                                                             ║
║  ┌─────────────┐  ┌─────────────┐                          ║
║  │ Mortgage     │  │ Groceries   │                          ║
║  │ $2,820  39%  │  │ $1,650  23% │   ← Flat card grid      ║
║  └─────────────┘  └─────────────┘     No charts            ║
║  ┌─────────────┐  ┌─────────────┐     No trends            ║
║  │ Transport   │  │ Insurance   │     No benchmarks         ║
║  │ $1,050  15% │  │ $540    7%  │                          ║
║  └─────────────┘  └─────────────┘                          ║
║                                                             ║
║  Annual Overview: $86,412/yr                                ║
║  [CommandBar]                                               ║
╚═════════════════════════════════════════════════════════════╝
```

### After State

```
╔═════════════════════════════════════════════════════════════╗
║  Hero Stats: [$7,201/mo] [$86,412/yr] [57% of income]     ║
║                                                             ║
║  [Overview] [Trends]    ← Tabs                              ║
║  ┌─────────────────────────────────────┐                   ║
║  │         🍩 Spending Donut           │                   ║
║  │    Mortgage 39%  Groceries 23%      │                   ║
║  │    Transport 15% Insurance 7%       │ ← Overview tab    ║
║  │    ... all categories               │                   ║
║  └─────────────────────────────────────┘                   ║
║                                                             ║
║  ┌─────────────────────────────────────┐                   ║
║  │  📈 12-Month Spending Trends        │                   ║
║  │  Stacked area chart by category     │ ← Trends tab     ║
║  │  Apr May Jun Jul Aug Sep Oct ...    │                   ║
║  └─────────────────────────────────────┘                   ║
║                                                             ║
║  Category Cards (enhanced):                                 ║
║  ┌─────────────────────────────────────┐                   ║
║  │ 🏠 Mortgage  $2,820/mo             │                   ║
║  │ ████████████████████░░░░ 39%        │ ← Progress bar   ║
║  │ ▲ 5% YoY  |  vs NZ avg: 1% below  │ ← Badge + bench  ║
║  └─────────────────────────────────────┘                   ║
║                                                             ║
║  [CommandBar]                                               ║
╚═════════════════════════════════════════════════════════════╝
```

### Interaction Changes

| Location | Before | After | User Impact |
|----------|--------|-------|-------------|
| Hero section | Simple title + subtitle | 3 stat cards (monthly, annual, % income) | Immediate cost impact |
| Spending section | Flat category grid | Tabbed donut chart + trend chart + enhanced grid | Visual story of where money goes |
| Category cards | Amount + trend arrow | Amount + progress bar + benchmark comparison badge | Context vs NZ average |
| Trend section | None | 12-month stacked area chart | See seasonal patterns |

---

## Mandatory Reading

**CRITICAL: Implementation agent MUST read these files before starting any task:**

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `components/dashboard/index.tsx` | all | Current dashboard — REWRITE target |
| P0 | `lib/household-model/types.ts` | all | All types: CategorySpending, MonthlySpendingRecord, HouseholdSpending |
| P0 | `lib/household-model/constants.ts` | all | CATEGORY_BENCHMARKS, CATEGORY_LABELS, SAVINGS_POTENTIAL |
| P0 | `lib/household-model/spending-history.ts` | all | generateSpendingHistory — trend chart data source |
| P1 | `lib/household-model/demo-profiles.ts` | all | How demo data is structured |
| P1 | `lib/format.ts` | all | formatCurrency, formatCurrencyShort, formatPercent |
| P1 | `app/globals.css` | 45-49 | Chart colour tokens (--chart-1 through --chart-5) |
| P2 | `components/ui/card.tsx` | all | Card pattern for wrapping charts |
| P2 | `components.json` | all | shadcn config for adding new components |

**External Documentation:**

| Source | Section | Why Needed |
|--------|---------|------------|
| Recharts PieChart | `<Pie innerRadius outerRadius>` + `<Cell fill>` pattern | Donut chart implementation |
| Recharts AreaChart | `<Area stackId>` + `<defs><linearGradient>` pattern | Stacked trend chart |
| Recharts ResponsiveContainer | SSR hydration gotcha — needs `"use client"` | Next.js compatibility |

---

## Patterns to Mirror

**CHART_COLOUR_TOKENS:**

```css
/* SOURCE: app/globals.css:45-49 */
--chart-1: oklch(0.679 0.215 39.5);    /* Ultra Orange — primary */
--chart-2: oklch(0.342 0.157 328.9);   /* Ultra Violet — secondary */
--chart-3: oklch(0.335 0.047 340.5);   /* Space — foreground */
--chart-4: oklch(0.974 0.074 104.4);   /* Sunwash Yellow — accent */
--chart-5: oklch(0.6 0.118 184.7);     /* Teal */
```

With 8 categories and 5 tokens, extend with 3 additional oklch colours derived from the brand palette. Add `--chart-6`, `--chart-7`, `--chart-8` to globals.css.

**CARD_WRAPPER:**

```tsx
// SOURCE: components/dashboard/index.tsx:80-93
// Charts should be wrapped in Card > CardHeader > CardContent pattern:
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-base">Chart Title</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {/* chart */}
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>
```

**CATEGORY_ICON_MAP:**

```tsx
// SOURCE: components/dashboard/index.tsx:15-24
// Already defined — reuse in new components:
const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'energy': Zap, 'groceries': ShoppingCart, 'mortgage': Home,
  'rates': Landmark, 'insurance': Shield, 'transport': Car,
  'communications': Wifi, 'healthcare': Heart,
}
```

**FORMAT_UTILITIES:**

```tsx
// SOURCE: lib/format.ts
formatCurrency(7201)       // "$7,201"     — hero stats, card amounts
formatCurrencyShort(86412) // "$86.4k"     — chart Y-axis ticks
formatPercent(39)          // "39%"         — donut labels, badges
```

---

## Files to Change

| File | Action | Justification |
| ---- | ------ | ------------- |
| `app/globals.css` | UPDATE | Add --chart-6, --chart-7, --chart-8 tokens + map to @theme |
| `components/ui/tabs.tsx` | CREATE (via shadcn) | Tab navigation for Overview/Trends |
| `components/ui/badge.tsx` | CREATE (via shadcn) | Trend + benchmark badges on cards |
| `components/ui/progress.tsx` | CREATE (via shadcn) | Percentage bar on category cards |
| `components/dashboard/spending-donut.tsx` | CREATE | PieChart donut with per-category slices |
| `components/dashboard/spending-trend.tsx` | CREATE | 12-month stacked AreaChart |
| `components/dashboard/category-card.tsx` | CREATE | Enhanced card with progress bar + benchmark |
| `components/dashboard/index.tsx` | UPDATE | Restructure layout with hero stats, tabs, new components |

---

## NOT Building (Scope Limits)

- **Profile switching UI** — Phase 5 (we render from `spending` state; the selector is a later phase)
- **Receipt scanning** — Phase 4 (completely separate feature)
- **AI prompt tuning** — Phase 3 (chat still works via Phase 1 wiring)
- **Loading/skeleton states** — Phase 5 (polish phase)
- **Mobile-specific chart optimisations** — if basic responsive works, don't over-engineer

---

## Step-by-Step Tasks

### Task 1: ADD shadcn components (Tabs, Badge, Progress)

- **ACTION**: Install 3 new shadcn/ui components
- **IMPLEMENT**: `npx shadcn@latest add tabs badge progress`
- **GOTCHA**: Ensure `components.json` style is `new-york` (confirmed). The CLI reads this automatically.
- **VALIDATE**: Files exist at `components/ui/tabs.tsx`, `components/ui/badge.tsx`, `components/ui/progress.tsx`

### Task 2: ADD chart colour tokens to globals.css

- **ACTION**: Add 3 additional chart colours to `:root` and `@theme inline`
- **IMPLEMENT**: Add to `:root` block after `--chart-5`:
  ```css
  --chart-6: oklch(0.55 0.15 25);    /* Warm coral — derived from orange family */
  --chart-7: oklch(0.65 0.12 280);   /* Soft purple — bridge violet/teal */
  --chart-8: oklch(0.58 0.10 150);   /* Sage green — nature/health */
  ```
  Add to `@theme inline` block:
  ```css
  --color-chart-6: var(--chart-6);
  --color-chart-7: var(--chart-7);
  --color-chart-8: var(--chart-8);
  ```
- **ALSO**: Define a `CHART_COLORS` array constant mapping categories to chart tokens for consistent use across components. Put this in a new file `lib/chart-colors.ts`:
  ```typescript
  import type { SpendingCategory } from '@/lib/household-model/types'
  export const CHART_COLORS: Record<SpendingCategory, string> = {
    'mortgage': 'var(--chart-1)',      // Orange — largest category
    'groceries': 'var(--chart-2)',     // Violet
    'transport': 'var(--chart-5)',     // Teal
    'insurance': 'var(--chart-6)',     // Coral
    'rates': 'var(--chart-3)',         // Space
    'energy': 'var(--chart-7)',        // Soft purple
    'communications': 'var(--chart-8)', // Sage
    'healthcare': 'var(--chart-4)',    // Sunwash Yellow
  }
  ```
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: CREATE `components/dashboard/spending-donut.tsx`

- **ACTION**: Create donut chart showing spending category breakdown
- **IMPLEMENT**: Recharts PieChart with:
  - `'use client'` directive
  - `ResponsiveContainer` wrapping `PieChart`
  - `Pie` with `innerRadius="55%"` `outerRadius="80%"` for donut effect
  - `Cell` per category with `fill` from `CHART_COLORS`
  - `stroke="var(--background)"` for gap between slices
  - Custom `Tooltip` showing category name + amount + percentage
  - Center label showing total monthly spend (positioned with `text` SVG element at `x="50%" y="50%"`)
  - `Legend` below with category names
- **PROPS**: `{ categories: CategorySpending[], totalMonthly: number }`
- **IMPORTS**: `PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer` from `recharts`; `CHART_COLORS` from `@/lib/chart-colors`; `formatCurrency` from `@/lib/format`
- **GOTCHA**: Parent `div` must have explicit height (`h-72`). CSS variables in `fill` work fine in SVG — no special handling needed. Use `"use client"` or hydration will fail.
- **VALIDATE**: `npx tsc --noEmit`

### Task 4: CREATE `components/dashboard/spending-trend.tsx`

- **ACTION**: Create 12-month stacked area chart
- **IMPLEMENT**: Recharts AreaChart with:
  - `'use client'` directive
  - Call `generateSpendingHistory(spending)` to get `MonthlySpendingRecord[]`
  - Transform data: the `categories` Record needs to be spread into flat keys for Recharts dataKeys
  - SVG `<defs>` block with 8 `<linearGradient>` elements (one per category), each using `CHART_COLORS[cat]` for `stopColor`
  - All `<Area>` components share `stackId="spending"` for stacking
  - `XAxis dataKey="monthShort"`, `YAxis tickFormatter={formatCurrencyShort}`
  - `axisLine={false}`, `tickLine={false}` on both axes (matches brand aesthetic)
  - Custom `Tooltip` showing month name + per-category amounts + total
  - No `CartesianGrid` (clean brand look)
- **PROPS**: `{ spending: HouseholdSpending }`
- **DATA_TRANSFORM**: `MonthlySpendingRecord.categories` is `Record<SpendingCategory, number>` — Recharts needs flat object keys. Map each record to `{ monthShort, energy: record.categories.energy, groceries: record.categories.groceries, ... }`.
- **GOTCHA**: `fillOpacity={1}` required on each `<Area>` when using gradient fills. Gradient `id` must be unique — prefix with `"trend-"` to avoid collision with donut.
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: CREATE `components/dashboard/category-card.tsx`

- **ACTION**: Create enhanced category card with progress bar and NZ benchmark comparison
- **IMPLEMENT**: A single card component rendering:
  - Icon (from `CATEGORY_ICON_MAP`) + label + monthly amount
  - `Progress` bar showing `percentOfTotal` (0-100)
  - Trend badge: `Badge` with arrow icon + YoY percent, coloured red for up, green for down
  - Benchmark comparison: compare `monthlyAmount` to `CATEGORY_BENCHMARKS[category].monthlyAverage`, show "X% above/below NZ avg" as muted text
- **PROPS**: `{ spending: CategorySpending }`
- **IMPORTS**: `Badge` from `@/components/ui/badge`, `Progress` from `@/components/ui/progress`, `CHART_COLORS` from `@/lib/chart-colors`, `CATEGORY_BENCHMARKS` from `@/lib/household-model`, icons from `lucide-react`
- **COLOUR**: Set `Progress` indicator colour to match the category's chart colour via inline style or CSS variable
- **GOTCHA**: `Progress` from shadcn has a `value` prop (0-100). The `CategorySpending.percentOfTotal` is already 0-100 so it maps directly. For the progress bar colour, shadcn's Progress uses `bg-primary` by default — override with `style={{ '--progress-indicator': CHART_COLORS[cat.category] }}` or a className override depending on the component's implementation.
- **VALIDATE**: `npx tsc --noEmit`

### Task 6: UPDATE `components/dashboard/index.tsx`

- **ACTION**: Restructure dashboard with hero stats, tabs, charts, enhanced cards
- **IMPLEMENT**: Full rewrite of the JSX layout:

**Hero Stats Section** (new):
```
3 stat cards in a row:
- Total monthly: formatCurrency(spending.totalMonthly) + "/month"
- Total annual: formatCurrency(spending.totalAnnual) + "/year"  
- % of income: formatPercent(spending.totalAnnual / spending.profile.annualIncome * 100) + " of income"
```

**Tabs Section** (new):
```
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trends">Trends</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <SpendingDonut categories={activeCategories} totalMonthly={spending.totalMonthly} />
  </TabsContent>
  <TabsContent value="trends">
    <SpendingTrend spending={spending} />
  </TabsContent>
</Tabs>
```

**Category Grid** (enhanced):
```
Replace current Card grid with CategoryCard components
```

**Keep unchanged**: Profile banner, CommandBar, ConversationPanel, navigation, chat state

- **IMPORTS TO ADD**: `Tabs, TabsContent, TabsList, TabsTrigger` from `@/components/ui/tabs`, `SpendingDonut`, `SpendingTrend`, `CategoryCard`
- **IMPORTS TO REMOVE**: `TrendingUp, TrendingDown, Minus` (moved into CategoryCard)
- **GOTCHA**: Keep all existing scroll target IDs (`dashboard`, `spending`, `insights`). Maintain the `onRegisterNavigate` / `handleNavigate` pattern exactly.
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 7: VISUAL POLISH

- **ACTION**: Fine-tune spacing, responsiveness, and brand consistency
- **IMPLEMENT**:
  - Hero stats: `grid grid-cols-1 sm:grid-cols-3 gap-3` responsive grid
  - Donut chart: `h-72` container, legend below
  - Trend chart: `h-80` container for more vertical space
  - Category cards: `grid grid-cols-1 sm:grid-cols-2 gap-3`
  - Tabs: full-width `TabsList` with `w-full` on mobile
  - All cards use consistent padding (`py-3 px-4` from Phase 1 pattern)
  - CommandBar section unchanged
- **VALIDATE**: `npm run dev` — check at 375px, 768px, 1024px widths

### Task 8: FINAL BUILD + VALIDATION

- **ACTION**: Full validation pass
- **IMPLEMENT**: Run all validation levels
- **VALIDATE**: `npx tsc --noEmit && npm run build`

---

## Testing Strategy

### Build Validation (no test framework installed)

| Check | Command | Validates |
|-------|---------|-----------|
| Type check | `npx tsc --noEmit` | All types resolve, no import errors |
| Full build | `npm run build` | Pages compile, no runtime import failures |
| Dev server | `npm run dev` | Visual verification at multiple breakpoints |

### Manual Validation

1. `npm run dev` — page loads without errors
2. Hero stats show 3 cards: monthly, annual, % of income
3. Overview tab: donut chart renders with 7-8 coloured slices (one per active category)
4. Donut tooltip shows category name + amount on hover
5. Trends tab: stacked area chart with 12 months, all categories stacked
6. Area chart tooltip shows month + per-category breakdown
7. Category cards show progress bars filled proportionally
8. Category cards show trend badges (red up, green down)
9. Category cards show NZ benchmark comparison text
10. Responsive: layout adapts from 1-column (mobile) to 2-column (tablet) to full (desktop)
11. No console errors
12. CommandBar + chat still work correctly

### Edge Cases

- [ ] Categories with $0 amount (e.g. Auckland single has $0 rates) — excluded from donut, not shown in grid
- [ ] Trend badge for "stable" trend — should show neutral styling
- [ ] Chart hover states on mobile (touch) — tooltips should still appear
- [ ] Donut with only 1-2 categories (extreme case) — should still look correct

---

## Validation Commands

### Level 1: STATIC_ANALYSIS

```bash
npx tsc --noEmit
```

**EXPECT**: Exit 0, no type errors

### Level 2: IMPORT_VERIFICATION

```bash
grep -r "energy-model\|tce-context\|TCEResult\|EnergyBreakdown" --include="*.ts" --include="*.tsx" lib/ components/ app/ || echo "PASS"
```

**EXPECT**: PASS (no energy references)

### Level 3: FULL_BUILD

```bash
npm run build
```

**EXPECT**: Build succeeds, all pages generated

### Level 5: BROWSER_VALIDATION

- Load `http://localhost:3000`
- Donut chart renders with coloured slices
- Trend chart renders with stacked areas
- Category cards have progress bars
- Tabs switch between Overview and Trends
- Chat still works

---

## Acceptance Criteria

- [ ] Hero stats section with 3 metrics (monthly, annual, % income)
- [ ] Donut chart showing spending by category with accurate proportions
- [ ] 12-month stacked area trend chart with seasonal variation visible
- [ ] Category cards with progress bars and NZ benchmark comparisons
- [ ] Tabs switching between Overview and Trends views
- [ ] Genesis Brand 4.0 colours consistently applied to all charts
- [ ] Responsive layout works at mobile, tablet, and desktop widths
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] No console errors
- [ ] CommandBar + AI chat panel still functional

---

## Completion Checklist

- [ ] All 8 tasks completed in order
- [ ] Each task validated after completion
- [ ] Level 1: TypeScript type-check passes
- [ ] Level 3: Full Next.js build succeeds
- [ ] Level 5: Browser renders correctly
- [ ] All acceptance criteria met

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Recharts hydration error in Next.js | Medium | Medium | All chart files must have `'use client'` directive; use explicit height on chart containers |
| 8 chart colours look muddy together | Low | Medium | Extended palette derived from brand; test donut readability with all slices |
| Progress bar colour override doesn't work | Low | Low | Inspect shadcn Progress component source; fallback to inline style on the indicator |
| Stacked area chart is visually cluttered with 8 series | Medium | Medium | Use gradient fills with low opacity; consider grouping smaller categories if needed |

---

## Notes

- **8 categories with 5 chart tokens**: Need 3 additional oklch colours. Derive from the Genesis Brand 4.0 palette — warm coral, soft purple, sage green — to complement the existing 5 while maintaining brand coherence.
- **CSS variables in SVG fills**: Confirmed to work with oklch() values in modern browsers. The ge-cogo project already uses oklch() throughout globals.css.
- **No `CartesianGrid`**: The old energy charts deliberately omitted grid lines for a clean aesthetic. Continue this pattern in the trend chart.
- **`generateSpendingHistory` data shape**: Returns `Record<SpendingCategory, number>` per month — needs transformation to flat object keys for Recharts. This is a simple spread operation, not a complex transform.
- **Profile banner stays**: The existing profile banner (name + description + total) stays in the layout. The new hero stats section is separate and more prominent.
