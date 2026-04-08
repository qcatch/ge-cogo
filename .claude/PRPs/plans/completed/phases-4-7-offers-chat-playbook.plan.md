# Feature: Power Circle Offers + AI Chat TCE + Cost of Living Playbook (Phases 4-7)

## Summary

Combined plan completing the core product experience. Phase 4 marks the existing results section as complete (already built in Phases 1-2) with a minor methodology addition. Phase 5 replaces the Power Circle placeholder with contextual offer cards driven by `tceResult.roadmap[]`. Phase 6 adds TCE-aware AI chat — a new system prompt builder, TCE-specific conversation starters, energy demo responses, and wires `ConversationPanel` into `app/page.tsx`. Phase 7 builds the full cost-of-living savings playbook — editorial idea data, idea card components, category navigation, and partner referral placeholders — replacing the `#savings` placeholder section.

## User Story

As a NZ homeowner who has just seen my total cost of energy and the electrified savings potential,
I want to see specific Genesis product offers matching my situation, get personalised AI guidance on my next steps, and discover broader household savings ideas beyond energy,
So that I can take concrete action to reduce my total household running costs.

## Problem Statement

The results section shows numbers and a roadmap but has no commercial conversion point (Power Circle offers), no personalised AI guidance contextualised with the user's TCE results, and the savings playbook section is an empty placeholder. These three capabilities complete the product's value loop: see the problem → understand the solution → take action.

## Solution Statement

1. **Phase 4** — Mark complete. Add a small "How we calculate this" expandable note to the results section.
2. **Phase 5** — Create `components/offers/power-circle-offers.tsx` that maps `tceResult.roadmap[]` items to branded offer cards with CTAs. Replace the placeholder card.
3. **Phase 6** — Create `lib/tce-context.ts` with `buildTCESystemPrompt()` and `generateTCEStarters()`. Add energy-specific demo responses to the API route. Wire `ConversationPanel` + `CommandBar` into `app/page.tsx` alongside the TCE results.
4. **Phase 7** — Create `lib/cost-of-living/` data module with all editorial idea content from the PRD brief. Create `components/savings/` with idea cards and category tabs. Replace the `#savings` placeholder.

## Metadata

| Field            | Value |
| ---------------- | ----- |
| Type             | NEW_CAPABILITY |
| Complexity       | HIGH |
| Systems Affected | app/page.tsx, lib/tce-context.ts (new), lib/cost-of-living/ (new), components/offers/ (new), components/savings/ (new), app/api/chat/route.ts |
| Dependencies     | recharts@2.15.4, @ai-sdk/anthropic@^3.0.67 (existing) |
| Estimated Tasks  | 10 |

---

## Mandatory Reading

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `app/page.tsx` | 152-307 | Results + savings sections to UPDATE |
| P0 | `lib/household-context.ts` | all | System prompt pattern to MIRROR for TCE context |
| P0 | `app/api/chat/route.ts` | 4-83 | Demo response keywords/content to EXTEND |
| P0 | `components/ai/conversation-panel.tsx` | 13-18 | Props interface — how to wire into page |
| P0 | `lib/energy-model/types.ts` | 60-93 | SwitchRecommendation + TCEResult types |
| P1 | `components/dashboard/category-card.tsx` | all | Card pattern for idea cards |
| P1 | `components/dashboard/index.tsx` | 56-111 | How chat state + ConversationPanel are wired |
| P1 | `components/ai/command-bar.tsx` | all | CommandBar component to reuse |

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `lib/tce-context.ts` | CREATE | `buildTCESystemPrompt()` + `generateTCEStarters()` for AI chat |
| `lib/cost-of-living/types.ts` | CREATE | Types for savings ideas, categories, partner offers |
| `lib/cost-of-living/ideas.ts` | CREATE | All editorial content — 10+ categories, 60+ ideas |
| `lib/cost-of-living/index.ts` | CREATE | Barrel exports |
| `components/offers/power-circle-offers.tsx` | CREATE | Contextual Genesis product offer cards |
| `components/savings/idea-card.tsx` | CREATE | Single savings idea card component |
| `components/savings/savings-playbook.tsx` | CREATE | Category tabs + idea grid |
| `app/page.tsx` | UPDATE | Wire offers, chat, playbook; replace placeholders |
| `app/api/chat/route.ts` | UPDATE | Add TCE-specific demo responses + keywords |

---

## NOT Building (Scope Limits)

- **No real partner referral codes** — placeholder CTAs with "Coming soon" labels
- **No pre-drafted email modal** — that's Phase 9 (Action It Now)
- **No animated number reveals** — that's Phase 10 (Polish)
- **No category filtering/search** — simple tabs are sufficient for POC
- **No extending SpendingCategory union** — cost of living ideas use their own type system, separate from the household model

---

## Step-by-Step Tasks

### Task 1: CREATE `components/offers/power-circle-offers.tsx`

- **ACTION**: Build contextual offer cards that replace the Phase 5 placeholder
- **IMPLEMENT**: A component that receives `tceResult.roadmap` and `tceResult.input` and renders branded offer cards. Each roadmap item maps to a Genesis product offer:

  | `appliance` contains | Offer | Icon |
  |---------------------|-------|------|
  | `'Heat Pump (Heating)'` | Genesis Heat Pump | `Thermometer` |
  | `'Heat Pump Hot Water'` | Genesis Hot Water | `Flame` |
  | `'Induction Cooktop'` | Genesis Induction | `Utensils` |
  | `'EV'` | Genesis EV Plan | `Car` |
  | `'Solar'` | Genesis Solar | `Sun` |

  Each card shows:
  - Product name + icon
  - Personalised savings: "Save {annualSaving}/year on {category}"
  - Upfront cost (if applicable) + payback period
  - CTA button: "Explore Genesis {Product}" (links to `#` for POC)
  - `bg-primary/5 border-primary/20` styling to differentiate from roadmap cards

- **PROPS**: `{ roadmap: SwitchRecommendation[], input: HouseholdInput }`
- **PATTERN**: Use `Card` + `CardContent` + `Button` + `Badge` from UI primitives
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: CREATE `lib/tce-context.ts`

- **ACTION**: Build TCE-specific AI system prompt and conversation starters
- **IMPLEMENT**:
  ```typescript
  import type { HouseholdInput, TCEResult } from '@/lib/energy-model'
  import { formatCurrency, formatPercent } from '@/lib/format'

  export function buildTCESystemPrompt(input: HouseholdInput, result: TCEResult): string {
    // Mirror buildHouseholdSystemPrompt pattern from lib/household-context.ts
    // Include:
    // 1. Role: "You are Genesis Energy's Cost of Living Assistant..."
    // 2. Household energy profile (region, occupants, heating type, etc.)
    // 3. Current costs breakdown (electricity, gas, petrol, total)
    // 4. Electrified costs breakdown
    // 5. Annual savings + percentage
    // 6. Switching roadmap with priorities, savings, payback
    // 7. Emissions reduction
    // 8. NZ energy context (petrol $3.20/L, EV ~14c/km, heat pump 1/3 gas cost)
    // 9. Instructions: be specific with THIS household's numbers, NZ-focused,
    //    recommend based on roadmap priority, mention Genesis products
  }

  export function generateTCEStarters(result: TCEResult): string[] {
    // Always lead with "What's my biggest energy saving?"
    // Then add roadmap-specific questions:
    // - If EV in roadmap: "How much would I save switching to an EV?"
    // - If heat pump in roadmap: "Should I replace my gas heating?"
    // - If solar in roadmap: "Is solar worth it for my household?"
    // - "Draft me a plan to electrify step by step"
    // Return max 4
  }
  ```
- **MIRROR**: `lib/household-context.ts` — same template literal pattern, same persona tone
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: UPDATE `app/api/chat/route.ts` — Add TCE demo responses

- **ACTION**: Add energy/TCE-specific demo responses and keywords
- **IMPLEMENT**: Add new demo response entries for TCE-specific questions. Update the keyword matching to handle:
  - `ev`, `electric vehicle`, `charging` → EV-specific response with NZ charging costs
  - `solar`, `panels`, `roof` → Solar response with payback and July 2026 export changes
  - `heat pump`, `heating`, `hot water` → Heat pump response with gas vs HP comparison
  - `roadmap`, `step`, `plan`, `order`, `first` → Step-by-step electrification guidance
  - `cooktop`, `induction`, `cooking` → Cooktop switching advice

  Keep existing household demo responses intact — add the new ones above them in the priority chain so energy questions match first.

- **GOTCHA**: The keyword matching is sequential (`if/else`). TCE-specific keywords must be checked BEFORE the generic `energy` match to avoid catch-all conflicts. For example, `heat pump` should match before `heat` which currently triggers `energy`.
- **VALIDATE**: `npx tsc --noEmit`

### Task 4: UPDATE `app/page.tsx` — Wire ConversationPanel + CommandBar into TCE section

- **ACTION**: Add AI chat capability to the main page (currently only in Dashboard)
- **IMPLEMENT**:
  1. Add state: `chatOpen`, `chatContext` (same pattern as `components/dashboard/index.tsx:56-57`)
  2. Import and compute `systemPrompt` from new `buildTCESystemPrompt(householdInput, tceResult)`
  3. Import and compute `starters` from `generateTCEStarters(tceResult)`
  4. Add `ConversationPanel` at the end of the page (before `</main>`)
  5. Add `CommandBar` at the bottom of `#results` section
  6. Add conversation starter chips below the roadmap
  7. Wire: clicking a starter → `setChatContext(text)` + `setChatOpen(true)`

- **MIRROR**: `components/dashboard/index.tsx:56-111, 259-264` for the exact chat wiring pattern
- **GOTCHA**: `ConversationPanel` uses `Sheet` (right-side slide-in). It's already imported in Dashboard but needs a separate instance in page.tsx. Two Sheet instances in the DOM is fine — only one opens at a time based on which section triggers it.
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 5: UPDATE `app/page.tsx` — Replace Power Circle placeholder with real offers

- **ACTION**: Replace the dashed placeholder card (line ~279) with `<PowerCircleOffers>`
- **IMPLEMENT**:
  ```tsx
  <PowerCircleOffers roadmap={tceResult.roadmap} input={tceResult.input} />
  ```
- **VALIDATE**: `npx tsc --noEmit`

### Task 6: CREATE `lib/cost-of-living/types.ts`

- **ACTION**: Define types for savings ideas and categories
- **IMPLEMENT**:
  ```typescript
  export type IdeaCategory =
    | 'dining'
    | 'shopping'
    | 'subscriptions'
    | 'home'
    | 'travel'
    | 'family'
    | 'transport'
    | 'insurance'
    | 'finance'
    | 'fitness'
    | 'pets'

  export interface SavingsIdea {
    id: string
    category: IdeaCategory
    title: string
    savingsEstimate: string       // e.g., "$500–$1,500/year"
    description: string           // 1-2 sentences
    actionType: 'link' | 'habit' | 'email' | 'partner'
    actionLabel: string           // CTA text
    actionUrl?: string            // for links
    partnerName?: string          // for partner offers
    partnerCode?: string          // referral code placeholder
  }

  export interface IdeaCategoryInfo {
    category: IdeaCategory
    label: string
    icon: string                  // Lucide icon name
    description: string
  }
  ```
- **VALIDATE**: `npx tsc --noEmit`

### Task 7: CREATE `lib/cost-of-living/ideas.ts`

- **ACTION**: Populate ALL editorial content from the PRD brief
- **IMPLEMENT**: Create the complete idea dataset. Minimum 5 ideas per category, covering all categories from the brief. Include:

  **Dining & Social** (6 ideas): First Table, insert card vs tap, BYOB restaurants, happy hour apps, lunch menus, coffee loyalty
  **Shopping & Retail** (7 ideas): Abandoned cart trick, price trackers, sign-up discounts, end-of-season, Trade Me, bulk buying, cashback cards
  **Subscriptions** (6 ideas): Pulse streaming, cancel-to-retain, audit, family plans, annual billing, audit premium features
  **Home & Mortgage** (7 ideas): Call bank before rollover, refinancing cashback, online grocery only, consolidate trips, meal planning, own-brand staples, insurance review
  **Travel** (6 ideas): Google Flights date grid, credit card travel insurance, book direct, airport parking, shoulder season, travel rewards
  **Family** (5 ideas): Toy libraries, end-of-season kids clothing, second-hand uniforms, council programmes, library membership
  **Transport** (5 ideas): Car loan refinancing, tyre pressure, Gaspy, park and ride, carpooling
  **Insurance** (4 ideas): Annual review, excess increase, bundling, KiwiSaver life cover
  **Finance** (4 ideas): High-interest savings, offset mortgage, automate savings, KiwiSaver review
  **Fitness** (4 ideas): Community gyms, negotiation, outdoor training, health app audit
  **Pets** (4 ideas): Insurance comparison, preventative vet, bulk food, DIY grooming

  **Partner offers** embedded in relevant categories:
  - HelloFresh / My Food Bag / Woop → Home category
  - Animates → Pets category
  - Sharesies / Kernel → Finance category
  - Canstar / MoneyHub → Insurance + Finance

  Each idea follows the `SavingsIdea` interface with a unique `id` (kebab-case).

- **ALSO CREATE** `lib/cost-of-living/index.ts` as barrel export
- **VALIDATE**: `npx tsc --noEmit`

### Task 8: CREATE `components/savings/idea-card.tsx`

- **ACTION**: Single savings idea card component
- **IMPLEMENT**: Magazine-style editorial card:
  - Title (bold, medium)
  - Savings estimate badge (`bg-accent/30 text-foreground`)
  - Description (1-2 lines, muted)
  - Action row: button or link based on `actionType`
    - `'link'` → `<Button variant="outline" size="sm">` with external link
    - `'habit'` → `<Badge>` saying "Habit change"
    - `'partner'` → `<Button>` with partner name + "Use code" or "Get offer"
    - `'email'` → `<Button>` saying "Draft email" (disabled — Phase 9)
  - Compact: `py-3 px-4` to fit many cards in a grid

- **PROPS**: `{ idea: SavingsIdea }`
- **MIRROR**: `components/dashboard/category-card.tsx` card structure — `Card` + `CardContent`
- **VALIDATE**: `npx tsc --noEmit`

### Task 9: CREATE `components/savings/savings-playbook.tsx`

- **ACTION**: Category tabs + idea grid that replaces the `#savings` placeholder
- **IMPLEMENT**:
  - Uses `Tabs` component (existing UI primitive) with category tabs
  - Each tab shows a grid of `IdeaCard` components for that category
  - Category tabs show icon + label + idea count badge
  - Default to "dining" or first category
  - "All" tab option showing all ideas grouped by category

- **PROPS**: None — imports data directly from `lib/cost-of-living`
- **UI**: `Tabs` with `variant="line"` (underline style), `TabsList` scrollable horizontally on mobile
- **VALIDATE**: `npx tsc --noEmit`

### Task 10: UPDATE `app/page.tsx` — Replace `#savings` placeholder with SavingsPlaybook

- **ACTION**: Replace the placeholder section content with `<SavingsPlaybook />`
- **IMPLEMENT**:
  ```tsx
  <section id="savings" className="py-16 px-4 md:px-6 bg-muted/20 border-t border-border">
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-foreground">Your Savings Playbook</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Beyond energy, there are hundreds of ways to reduce your total household running costs.
          Each idea comes with an immediate action you can take.
        </p>
      </div>
      <SavingsPlaybook />
    </div>
  </section>
  ```
- **ALSO**: Add a "How we calculate this" expandable section to `#results` (Phase 4 completion) — a simple `<details>` element below the emissions line citing Rewiring Aotearoa methodology and data sources.
- **VALIDATE**: `npx tsc --noEmit && npm run build`

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

### Level 3: DEV_SERVER
```bash
npm run dev
```
Visual checks:
- Power Circle offers render below roadmap, contextual to user's input
- AI chat opens from results section, responds with TCE-aware context
- Savings playbook shows all categories with idea cards
- Category tabs filter correctly
- Partner offers have CTA placeholders

---

## Acceptance Criteria

- [ ] Power Circle offer cards replace the dashed placeholder, showing relevant Genesis products
- [ ] Offers are contextual — only show products the user doesn't already have
- [ ] AI chat panel is accessible from the TCE results section
- [ ] `buildTCESystemPrompt()` includes all TCE data (costs, roadmap, emissions)
- [ ] TCE conversation starters are relevant to the user's specific results
- [ ] Demo mode responds to energy keywords (EV, solar, heat pump) with useful content
- [ ] Savings playbook has 10+ categories with 4-6 ideas each
- [ ] Each idea has a title, savings estimate, description, and action
- [ ] Partner offers are embedded in relevant categories
- [ ] Category tabs work for navigation
- [ ] `npx tsc --noEmit` and `npm run build` pass

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Two ConversationPanel instances (page + dashboard) interfere | Low | Medium | They have independent `open` state. Only one can be open at a time (user scrolls between sections). |
| Demo response keyword conflicts (heat pump vs heat → energy) | Medium | Low | Add specific TCE keywords (ev, solar, heat pump, cooktop, roadmap) BEFORE generic matches in the if/else chain |
| Savings idea content is extensive and may have typos | Medium | Low | Content comes from the PRD brief — copy directly. NZ-specific terms should be verified. |
| Large idea dataset increases bundle size | Low | Low | Static data, no API calls. Tree-shakes fine. ~20KB of text content. |

---

## Notes

- **Phase 4 completion**: The results section already has hero numbers, comparison chart, roadmap cards, and emissions. The only missing piece is a methodology disclosure. Adding a `<details>` element is the lightest approach for POC.
- **AI chat architecture**: `ConversationPanel` is added to `app/page.tsx` as a second instance (Dashboard keeps its own). The `systemPrompt` is different — TCE context vs household spending context. This is intentional: the two chat instances serve different product layers.
- **Cost of living data model**: Separate from `lib/household-model/` — different type system (`IdeaCategory` vs `SpendingCategory`), different purpose (editorial content vs spending benchmarks). No cross-contamination.
- **Partner referral codes**: All marked as placeholders. The `partnerCode` field exists in the type but will show "Coming soon" in the UI until real codes are provided (Phase 9+ or commercial dependency).
