# Genesis Household Cost-of-Living Dashboard

## Problem Statement

New Zealand households are under sustained cost-of-living pressure — insurance up 37% since 2022, council rates up 12.2% annually, rent up 9%, groceries refusing to stabilise — yet no tool gives them a single view of where all their money goes, with practical ways to reduce it. Genesis Energy wants to position itself as a genuine cost-of-living ally, not just a power company, by giving Kiwi households something no bank, utility, or fintech currently offers: a complete household spending picture with AI-driven, lifestyle-preserving savings insights.

## Evidence

- Stats NZ: 80% of NZ households expect utilities to keep rising; 75% expect general household costs to increase (Dec 2025)
- Insurance premiums surged ~10% YoY (Dec 2025), average house insurance NZD $2,815 — up 37% since 2022
- Council rates rising at double-digit rates nationally (12.2% annual average)
- No NZ product combines cross-category household spending visibility with actionable AI insights — CashNav is Westpac-silo'd, Sorted is static, PocketSmith is paid fintech with no AI
- No utility company globally has positioned itself as a whole-of-household cost advisor — this is genuine white space
- BHL comms strategy session (April 2026) identified the need to "tell a more powerful Total Cost of Energy story" and expand beyond the Cogo calculator
- Assumption — needs validation: NZ households would trust an energy company to advise on non-energy spending categories

## Proposed Solution

A Genesis-branded web application that lets households see their complete spending picture across all major cost categories (energy, groceries, rates, mortgage/rent, insurance, transport, and more), input costs via manual entry or receipt photo scanning, and receive AI-powered insights on practical ways to reduce spending without significantly trading off lifestyle. For the initial prototype, this uses demo data with genuine AI savings recommendations, built in Genesis Brand 4.0, to demonstrate the concept for stakeholder approval.

## Key Hypothesis

We believe a household cost dashboard with AI savings insights will demonstrate Genesis as a genuine cost-of-living ally for NZ households.
We'll know we're right when Stephen England-Hall and Ed Hyde approve funding for production development.

## What We're NOT Building

- Real open banking / bank feed integration — future phase, not prototype
- Production OCR receipt parsing — prototype simulates extraction via Claude Vision
- User accounts, authentication, or data persistence — prototype is stateless
- Mobile native app — responsive web, not App Store
- Financial planning / investment advice — this is spending management, not wealth management
- Integration with Genesis billing systems — no proprietary customer data

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Stakeholder approval | England-Hall + Hyde green-light production funding | Decision in sell-in meeting |
| Concept clarity | Stakeholders can articulate what it does and why Genesis should own it within 60 seconds of seeing it | Qualitative — observed in meeting |
| Insight quality | AI recommendations are specific, actionable, and NZ-relevant (not generic budgeting platitudes) | Manual review of 10+ generated insights across categories |
| Brand coherence | Prototype is indistinguishable from a production Genesis product in visual quality | Stakeholder + design team feedback |

## Open Questions

- [ ] Would Genesis legal/compliance have concerns about giving non-energy financial advice (even informal)?
- [ ] What is the long-term data strategy — open banking (Akahu), self-report, or both?
- [ ] Should the tool eventually integrate with Genesis billing to auto-populate energy costs?
- [ ] What NZ household benchmarks exist for spending by category? (Stats NZ HES data, Sorted averages)
- [ ] Is there appetite to partner with other brands (e.g., Countdown, AA) for category-specific insights?
- [ ] How does this relate to the existing Energy IQ app — complement, replace, or separate brand?

---

## Users & Context

**Primary User**
- **Who**: Middle-income NZ household (1-2 earners, likely with dependents), homeowner or renter, feeling the cumulative squeeze of rising costs across multiple categories simultaneously
- **Current behavior**: Checks individual bills as they arrive (power bill, rates notice, insurance renewal), mentally tracks grocery spend, occasionally looks at bank statements. No single view of total outgoings. Reacts to cost shocks individually rather than managing proactively.
- **Trigger**: A particularly painful bill (rates up 15%, insurance renewal shock, $300 supermarket shop), the "where does all our money go?" conversation, or end-of-month anxiety
- **Success state**: Can see their full household spending in one place, understands which categories are hurting most, has 3-5 specific things they can do this week/month to reduce costs without feeling like they're sacrificing quality of life

**Job to Be Done**
When I'm stressed about rising household costs and don't know where to start cutting back, I want to see my complete spending picture with practical savings suggestions, so I can take control of my finances without dramatically changing how my family lives.

**Non-Users**
- High-net-worth households who don't need to budget
- People seeking investment/wealth management advice
- Business expense management (Xero territory)
- People wanting detailed line-item accounting (PocketSmith territory)

---

## Solution Detail

### Core Capabilities (MoSCoW)

| Priority | Capability | Rationale |
|----------|------------|-----------|
| Must | **Spending dashboard** — total household cost with category breakdown (energy, groceries, rates, mortgage/rent, insurance, transport) | Core value prop — the "single view" that doesn't exist today |
| Must | **AI savings advisor** — Claude-powered chat that gives specific, actionable, lifestyle-preserving savings tips based on the household's spending profile | The differentiation layer — this is what makes it Genesis, not just another budget tracker |
| Must | **Genesis Brand 4.0 UI** — full visual identity (Ultra Orange, Space, Ultra Violet, Sunwash Yellow, new logo, Geist typography) | Stakeholder sell-in requires production-quality brand expression |
| Must | **Demo household profiles** — pre-built representative NZ household data that demonstrates the product realistically | Prototype needs to tell a compelling story without real user data |
| Should | **Receipt photo upload** — take a photo of a receipt, AI extracts the total and category | Demonstrates the vision for frictionless data input; differentiator vs manual-only tools |
| Should | **Spending trends over time** — month-over-month view showing how costs are changing | Shows the product has ongoing value, not just a one-time snapshot |
| Should | **NZ benchmark comparison** — "Your grocery spend is 23% above the NZ average for a family of 4" | Powerful motivator; mirrors the personalisation-at-scale pattern McKinsey identified |
| Could | **Savings roadmap** — prioritised list of actions with estimated savings per month/year | Natural extension of AI insights into a structured action plan |
| Could | **Category deep-dives** — drill into a category for subcategory breakdown (e.g., groceries → meat, dairy, household) | Future feature; receipt line-item parsing would enable this |
| Won't | **Real bank feed integration** — live transaction data from Akahu/open banking | Future production phase; adds complexity and compliance requirements |
| Won't | **User accounts / data persistence** — login, saved profiles, historical tracking | Prototype is stateless; production version would need this |
| Won't | **Financial planning tools** — KiwiSaver, debt management, investment advice | Out of scope; Sorted and banks own this space |

### MVP Scope

The prototype demonstrates the core loop: **see your costs → understand the picture → get actionable savings advice**. It uses pre-built demo household profiles with realistic NZ data, a polished Brand 4.0 interface, and live Claude AI generating genuine savings recommendations. Receipt scanning is demonstrated as a concept (photo → simulated extraction). The goal is not a functional product but a convincing vision of one.

### User Flow

```
1. Land on dashboard → see demo household's total monthly spend
2. Browse category breakdown → understand where money goes (energy, groceries, rates, etc.)
3. View spending trends → see how costs have changed over 12 months
4. (Optional) Upload a receipt photo → see AI extract and categorise the expense
5. Open AI advisor → ask "How can I reduce my grocery bill?" or "What's my biggest savings opportunity?"
6. Receive specific, actionable insights → e.g., "Switching to a single weekly shop instead of 3-4 trips saves the average NZ family $45-60/month on impulse purchases alone"
```

---

## Technical Approach

**Feasibility**: HIGH

The ge-cogo codebase provides ~60% of the required infrastructure: Next.js 16 / React 19 / Tailwind 4 / shadcn/ui with Genesis Brand 4.0 tokens fully configured, a working Claude AI streaming chat panel, Recharts charting with brand-themed CSS variable colours, and a proven deployment pattern.

**Architecture Notes**
- Fork ge-cogo as the starting point — retain brand tokens, UI primitives, AI chat infrastructure, layout shell
- Replace `lib/energy-model/` entirely with `lib/household-model/` — new types, constants, demo profiles for household spending categories
- Replace `lib/tce-context.ts` with a household-cost system prompt builder that feeds spending profile to Claude
- Add shadcn components: `Input`, `Tabs`, `Badge`, `Progress` (via `npx shadcn add`)
- Add `PieChart` / `RadialBarChart` from Recharts for category breakdown visualisation
- Receipt upload: `<input type="file" accept="image/*">` → base64 → Claude Vision API for extraction simulation
- No database, no auth, no external APIs beyond Anthropic

**Technical Risks**

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| AI generating generic/unhelpful savings advice | Medium | Craft detailed system prompt with NZ-specific context, spending benchmarks, and instruction to be specific and actionable. Test extensively across categories. |
| Receipt scanning demo feels fake | Low | Use Claude Vision (which genuinely can read receipts) with real NZ receipt photos. Even in demo, the extraction is real — just not productionised. |
| Demo data feels unrealistic | Medium | Source NZ household spending benchmarks from Stats NZ HES, Sorted, and public data. Build 3-4 distinct demo profiles (single renter, young family, established family, retiree). |
| Brand execution doesn't meet stakeholder expectations | Low | Genesis Brand 4.0 tokens already proven in ge-cogo. Iterate on visual polish with Figma reference. |

---

## Implementation Phases

| # | Phase | Description | Status | Parallel | Depends | PRP Plan |
|---|-------|-------------|--------|----------|---------|----------|
| 1 | Foundation & Data Model | Fork ge-cogo, strip energy-specific code, build household spending types/model/demo profiles | complete | - | - | [Phase 1 Plan](../plans/completed/household-cost-dashboard-phase-1.plan.md) |
| 2 | Dashboard UI | Spending breakdown dashboard — category cards, pie chart, total spend hero, trend chart | complete | - | 1 | [Phase 2 Plan](../plans/completed/household-cost-dashboard-phase-2.plan.md) |
| 3 | AI Savings Advisor | New system prompt, demo responses, NZ-specific savings knowledge base for Claude | complete | with 2 | 1 | [Phase 3 Plan](../plans/completed/household-cost-dashboard-phase-3.plan.md) |
| 4 | Receipt Scanning | Photo upload flow, Claude Vision integration, simulated expense extraction and categorisation | complete | with 5 | 1 | [Phase 4 Plan](../plans/completed/household-cost-dashboard-phase-4.plan.md) |
| 5 | Demo Profiles & Polish | Multiple NZ household profiles, benchmark comparisons, loading states, responsive polish, Brand 4.0 QA | complete | with 4 | 2, 3 | [Phase 5 Plan](../plans/completed/household-cost-dashboard-phase-5.plan.md) |
| 6 | Stakeholder Demo Prep | Demo script, walkthrough flow, edge case handling, final visual QA | complete | - | 4, 5 | [Phase 6 Plan](../plans/completed/household-cost-dashboard-phase-6.plan.md) |

### Phase Details

**Phase 1: Foundation & Data Model**
- **Goal**: Clean starting point with new domain model
- **Scope**: Fork ge-cogo, remove all energy-model code, create `lib/household-model/` with spending category types (`SpendingCategory`, `HouseholdProfile`, `MonthlySpending`), NZ benchmark constants, 3-4 demo household profiles with realistic data, format utilities
- **Success signal**: `npm run build` passes with new types, demo profiles render placeholder data

**Phase 2: Dashboard UI**
- **Goal**: The core visual — "see where your money goes"
- **Scope**: Total monthly spend hero stat, category breakdown cards with amounts and % of total, PieChart/donut for visual breakdown, 12-month stacked area trend chart, responsive layout (mobile-first). Add `Tabs`, `Badge`, `Progress` shadcn components.
- **Success signal**: Dashboard renders demo household data across all categories with brand-correct styling

**Phase 3: AI Savings Advisor**
- **Goal**: Genuinely useful savings chat
- **Scope**: New system prompt builder that injects household spending profile, NZ cost-of-living context, and category-specific savings strategies. New demo-mode responses covering all spending categories. Instruction tuning for specific, actionable, lifestyle-preserving advice (not "spend less").
- **Success signal**: Ask "How do I reduce grocery costs?" and get 3-5 specific, NZ-relevant suggestions with estimated savings amounts

**Phase 4: Receipt Scanning**
- **Goal**: Demonstrate the vision for frictionless input
- **Scope**: Photo upload UI (camera or gallery), send image to Claude Vision API, extract merchant/amount/category, display extracted data with confirmation UI. Works with real NZ receipts (Countdown, Pak'nSave, Z Energy, etc.)
- **Success signal**: Upload a photo of a Countdown receipt → see "Countdown, $127.43, Groceries" extracted correctly

**Phase 5: Demo Profiles & Polish**
- **Goal**: Make it feel real and polished
- **Scope**: 3-4 selectable demo households (single professional, young family, established family with mortgage, retiree), NZ benchmark comparisons ("Your insurance is 18% above average"), loading/transition states, responsive QA, Brand 4.0 visual audit against Figma
- **Success signal**: Switching between profiles tells different but equally compelling stories. Looks indistinguishable from a production Genesis product.

**Phase 6: Stakeholder Demo Prep**
- **Goal**: Ready for the sell-in meeting
- **Scope**: Demo walkthrough script, preset AI conversation starters, handle edge cases gracefully, final visual QA pass, ensure demo works offline (demo mode) if no API key available
- **Success signal**: Can run a compelling 5-minute demo that clearly communicates what it is, why Genesis should own it, and what the production version would look like

### Parallelism Notes

Phases 2 and 3 can run in parallel after Phase 1 — the dashboard UI and AI advisor are independent workstreams that share the data model but don't touch the same files. Phases 4 and 5 can run in parallel as receipt scanning is a self-contained feature while demo profiles and polish touch the dashboard and advisor surfaces.

---

## Decisions Log

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Data input method | Self-report + receipt photos | Open banking (Akahu), bank CSV import, manual-only | Self-report is simplest for prototype; receipt photos demonstrate the AI vision; open banking adds compliance complexity |
| AI backend | Claude (Anthropic) | Agentforce (Salesforce), GPT-4 | Claude already integrated in ge-cogo; Claude Vision handles receipt scanning; consistent with existing PoC investment |
| Scope of advice | All household costs, not just energy | Energy-only (Cogo extension), financial planning (Sorted competitor) | The brief is clear — Genesis wants to help with everything, not just power. Financial planning is out of scope (different product, different compliance). |
| Starting point | Fork ge-cogo | Build from scratch, fork gen-agentforce-poc | ge-cogo has the more complete Brand 4.0 implementation, proven AI streaming, and better component inventory |
| Platform | Responsive web app | Native mobile (iOS/Android), desktop-only | Web is fastest to prototype, accessible on all devices, no App Store review. Mobile-first responsive design covers the "on the couch checking bills" context. |
| Demo vs functional | Demo data with real AI | Fully functional with real data, static mockup | Demo data is realistic enough for sell-in; real AI ensures insights are genuinely impressive, not scripted |

---

## Research Summary

**Market Context**
- No NZ product combines cross-category household spending with AI insights. CashNav (Westpac-only, no AI), Sorted (static planner), PocketSmith (paid fintech, no AI advisor) leave clear white space.
- No utility company globally has positioned as a whole-of-household cost advisor — closest is Octopus Energy (UK) but energy-only. CommBank Australia built brand equity with household spending dashboards but as a bank, not a utility.
- NZ regulated open banking went live December 2025 — future production version could leverage Akahu for transaction feeds.
- NZ cost-of-living crisis is acute: insurance +37% since 2022, rates +12.2% annually, 80% of households expect costs to keep rising. Timing is ideal.

**Technical Context**
- ge-cogo provides ~60% of infrastructure: Next.js 16 / React 19 / Tailwind 4, Genesis Brand 4.0 tokens, AI chat with Claude streaming, Recharts charting, shadcn/ui components.
- Energy-specific code (model, types, constants, demo profiles, system prompts) must be fully replaced — but the architecture patterns are directly transferable.
- Receipt scanning via Claude Vision is technically straightforward — Claude can genuinely read NZ retail receipts. Production OCR would need more robust extraction and validation.
- Missing shadcn components (`Input`, `Tabs`, `Badge`, `Progress`) are one command away.
- No database, auth, or persistence needed for prototype.

---

*Generated: 2026-04-07*
*Status: DRAFT - needs validation*
