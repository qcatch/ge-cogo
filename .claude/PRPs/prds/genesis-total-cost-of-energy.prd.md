# Genesis Total Cost of Energy — Cogo + AI-EIQ

## Problem Statement

New Zealand households are facing a compounding energy cost crisis — electricity up 21% in three years, gas up 15.4%, petrol approaching $4/litre — but no tool shows them their **total** energy spend across all vectors (power, gas, petrol) or what that number would look like if they fully electrified. Genesis Energy's existing Cogo calculator shows individual product savings but fails to tell a compelling "Total Cost of Energy" story, leaving Genesis without a differentiated market position as it prepares for an August brand relaunch amid a national cost-of-living crisis.

## Evidence

- Comms strategy deck (slide 11): *"Right now the calculator shows potential savings for individual electrification investments, but it doesn't show today's total household energy cost, and how much lower that number could be if households fully embrace electricity. The data is there, let's present it in a more hard-hitting way."*
- NZ electricity prices: 39.3c/kWh average, +12% in 2025 alone (Powerswitch/The Spinoff)
- Gas prices rose 15.4% — outpacing electricity; natural gas supply projected to halve by 2030 (Interest.co.nz)
- Petrol near $4/litre; EV/PHEV registrations hit 68% of new vehicle sales March 2026 (AllFinance)
- Average NZ household total energy spend (power + gas + petrol) estimated at $10,000–$15,000/year
- No NZ retailer or tool currently shows total cost of energy across all vectors — white space is real and unoccupied
- Billy (billy.govt.nz) launched 26 March 2026 — government electricity plan comparison tool already dominating consumer awareness, but covers electricity switching ONLY (no gas, petrol, or electrification advice). Validates consumer appetite for energy cost tools while leaving the multi-vector TCE space wide open
- ASB launched the same Cogo platform one month before Genesis (July 2025) with embedded financing — Genesis needs differentiation beyond the off-the-shelf Cogo tool
- Steve Imm: need to sell AI-EIQ concept to Stephen England-Hall and Ed Hyde beyond the existing prototype

## Proposed Solution

An independent web application branded with Genesis Brand 4.0 that combines a **Total Cost of Energy calculator** (showing current household spend across electricity, gas, and petrol vs. a fully-electrified future), a **CashNav-style bill tracker** (aggregating all energy costs in one view), an **AI-powered Energy Intelligence advisor** (conversational assistant that explains results and answers energy questions), and a **Savings Roadmap** (phased electrification plan showing what to switch, when, and the cumulative impact). Built as a working prototype to demonstrate the vision to Genesis leadership and validate the approach before the August brand launch.

## Key Hypothesis

We believe a Total Cost of Energy tool with an AI energy advisor will position Genesis as the brand that helps NZ households understand and cut their full energy spend.
We'll know we're right when Genesis leadership (Stephen England-Hall, Ed Hyde) approve the concept for August launch and early user testing shows households engaging with the total-cost view over the individual-product view.

## What We're NOT Building

- Production Salesforce/Agentforce integration — prototype supports both Claude and Agentforce backends (like the PoC) but neither is production-grade
- Open banking / multi-bank account aggregation — manual input for now
- Actual energy plan switching or provider comparison — not a Powerswitch replacement
- Installer/dealer marketplace connections — out of scope for prototype
- Real-time smart meter data integration — future capability
- Production-grade auth, payments, or account management

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Leadership buy-in | Approval from England-Hall + Hyde for August launch | Stakeholder review session |
| Total Cost visibility | User can see combined power + gas + petrol spend in < 2 minutes | Task completion in user testing |
| AI engagement | Users ask 2+ follow-up questions after seeing their TCE results | Session analytics in prototype |
| Electrification clarity | User can articulate their top savings opportunity after using the tool | Post-session interview |

## Open Questions

### Resolved

- [x] ~~Will Genesis provide real energy cost data?~~ **Unknown — proceed with public EECA/Powerswitch/Rewiring Aotearoa data**
- [x] ~~Is the Cogo partnership continuing?~~ **Unknown — building independently regardless; this complements rather than replaces**
- [x] ~~LLM backend: Claude or Agentforce?~~ **Both — dual backend like the PoC (Claude primary, Agentforce optional)**
- [x] ~~Mobile-first or desktop-first?~~ **Mobile-first, responsive to desktop**
- [x] ~~NZ vehicle/appliance data sources?~~ **Unknown — use public data (EECA, Rewiring Aotearoa) and PoC sample data**
- [x] ~~Average customer usage profiles?~~ **No Genesis data available — use PoC sample data + publicly available NZ averages**

### Unresolved

- [ ] How does this relate to the Electricity Authority's upcoming AI-powered switching tool (replacing Powerswitch)?
- [ ] What level of regional accuracy is needed for the energy cost model? (national averages vs. per-region rates)
- [ ] Will the prototype need to run on Azure (like the PoC name suggests) or Vercel?

---

## Users & Context

**Primary User**
- **Who**: Any New Zealander — homeowner or renter — feeling the pressure of rising energy costs across power, gas, and petrol
- **Current behaviour**: Checks individual bills separately (power bill from retailer, petrol receipts, gas bill), has no single view of total energy spend. May have used EECA calculator or Cogo but only sees individual product savings, not the full picture.
- **Trigger**: Receives a higher-than-expected power or gas bill, sees petrol prices at the pump, reads news about the energy crisis, or is already considering an EV/heat pump/solar purchase
- **Success state**: Sees their total annual energy spend for the first time, understands how much they could save by going fully electric, and has a clear roadmap of what to switch first

**Job to Be Done**
When I'm worried about rising energy costs across power, gas, and petrol, I want to see my total household energy spend and what it would look like fully electrified, so I can make confident decisions about where to invest and stop feeling overwhelmed by fragmented bills.

**Non-Users**
- Commercial/industrial customers — this is a household tool
- Already-fully-electrified households (though they may use it to validate their position)
- Users expecting to actually switch energy providers or purchase through the tool

---

## Solution Detail

### Core Capabilities (MoSCoW)

| Priority | Capability | Rationale |
|----------|------------|-----------|
| Must | **Total Cost of Energy Calculator** — input current power, gas, petrol spend; see total now vs. fully electrified | Core value proposition from the comms strategy deck |
| Must | **AI Energy Advisor (EIQ)** — conversational assistant that explains TCE results, answers energy questions, provides personalised guidance | Key differentiator; required for stakeholder sell-in |
| Must | **Genesis Brand 4.0** — new visual identity (Ultra Orange, Space, Ultra Violet, new logo) | Required before August brand launch |
| Must | **Savings Roadmap** — phased electrification plan showing what to switch, in what order, with cumulative savings | Makes the TCE story actionable, not just informational |
| Should | **CashNav-style Bill Tracker** — dashboard view aggregating all energy costs over time | Compelling "all your energy in one place" hook; validates the total-cost framing |
| Should | **Realistic NZ cost modelling** — accurate electricity rates, gas rates, petrol prices, appliance costs by region | Credibility for stakeholder review |
| Could | **Voice input** — ask the AI advisor questions by voice | Already implemented in EIQ PoC; low effort to carry forward |
| Could | **Before/after visualisation** — animated or interactive comparison of current vs. electrified home | High impact for presentations; nice-to-have for prototype |
| Could | **Share/export results** — PDF or link to share TCE summary | Useful for stakeholder demos |
| Won't | **Real data integrations** — open banking, smart meters, Salesforce | Prototype uses demo/manual data only |
| Won't | **Plan switching or purchasing** — no transactions | Not in scope |
| Won't | **Multi-user accounts or persistence** — no login/auth | Prototype only |

### MVP Scope

A single-page web application where a user:
1. Enters their household energy profile (current power bill, gas bill, petrol spend, vehicle type, heating type, hot water type, cooking type)
2. Sees their **Total Cost of Energy** — a single annual/monthly number combining all vectors
3. Sees what that number becomes if they **fully electrify** (heat pump, induction, EV, solar)
4. Gets a **Savings Roadmap** showing the recommended order of switches with cumulative impact
5. Can ask the **AI Energy Advisor** questions about their results ("Should I get solar first or an EV?", "How long until the heat pump pays for itself?")
6. Views a **Bill Tracker dashboard** showing their energy spend breakdown over time

### User Flow

```
[Landing] → Enter energy profile (guided form)
    ↓
[TCE Dashboard] → See total cost now vs. electrified (hero number)
    ├── [Breakdown] → Power / Gas / Petrol split with drill-down
    ├── [Savings Roadmap] → Phased plan: what to switch, when, cumulative savings
    ├── [Bill Tracker] → Monthly energy spend visualisation
    └── [AI Advisor] → Chat panel for questions about results
```

---

## Technical Approach

**Feasibility**: HIGH

**Architecture Notes**
- Independent Next.js 16 application in `ge-cogo` repo (greenfield)
- Reuse proven patterns from `gen-agentforce-poc`: React 19, Tailwind CSS 4, shadcn/ui, Recharts, TypeScript 5
- AI advisor supports dual backends: Anthropic Claude (primary) + Salesforce Agentforce (optional) — same pattern as the EIQ PoC, switchable via env vars
- Design tokens updated to match Genesis Brand 4.0 palette from Figma (`#FF5800`, `#472D3E`, `#60005F`, `#FEFAC0`)
- Energy cost modelling based on publicly available NZ data (EECA, Powerswitch, Rewiring Aotearoa methodology) + sample data from EIQ PoC
- Mobile-first responsive design — primary experience is mobile (aligns with CashNav model), scales up to desktop for stakeholder demos
- Demo mode with realistic pre-populated data for stakeholder presentations
- No external service dependencies required for demo (all self-contained)

**Technical Risks**

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Energy cost model accuracy | Medium | Use EECA/Rewiring Aotearoa published methodology; flag assumptions clearly |
| AI advisor hallucinating energy advice | Medium | Constrained system prompt with NZ-specific data; grounded in user's actual inputs |
| Brand 4.0 not fully defined in Figma (only foundations, no components) | High | Build component library from colour/type foundations; iterate with design team |
| Stakeholder expectations exceed prototype scope | Medium | Clear "prototype" labelling; explicit out-of-scope list in demo |
| Performance of AI responses for real-time advice | Low | Streaming responses (proven pattern from PoC); Claude is fast |

---

## Implementation Phases

<!--
  STATUS: pending | in-progress | complete
  PARALLEL: phases that can run concurrently (e.g., "with 3" or "-")
  DEPENDS: phases that must complete first (e.g., "1, 2" or "-")
  PRP: link to generated plan file once created
-->

| # | Phase | Description | Status | Parallel | Depends | PRP Plan |
|---|-------|-------------|--------|----------|---------|----------|
| 1 | Project Scaffold + Brand 4.0 Design System | Next.js 16 app scaffold with Genesis Brand 4.0 tokens, component library (shadcn/ui themed), logo, typography | complete | - | - | [plan](../plans/completed/phase-1-scaffold-brand-design-system.plan.md) |
| 2 | Energy Cost Model | NZ energy cost calculator engine — electricity, gas, petrol, appliance switching models with regional accuracy | complete | with 1 | - | [plan](../plans/completed/phase-2-energy-cost-model.plan.md) |
| 3 | TCE Calculator UI | Input form + Total Cost of Energy dashboard with before/after comparison, breakdown views | complete | - | 1, 2 | [plan](../plans/completed/phase-3-tce-calculator-ui.plan.md) |
| 4 | Savings Roadmap | Phased electrification plan — recommended switch order, cumulative savings timeline, payback periods | complete | - | 2, 3 | [plan](../plans/completed/phase-4-savings-roadmap.plan.md) |
| 5 | Bill Tracker Dashboard | CashNav-style energy spend aggregation view with charts and category breakdowns | complete | with 4 | 3 | [plan](../plans/completed/phase-5-bill-tracker.plan.md) |
| 6 | AI Energy Advisor (EIQ) | Claude-powered conversational assistant with TCE context, energy knowledge, personalised guidance | complete | with 4 | 1, 2, 3 | [plan](../plans/completed/phase-6-ai-energy-advisor.plan.md) |
| 7 | Integration + Polish | Wire all features together, demo mode with realistic data, responsive design, stakeholder presentation readiness | complete | - | 3, 4, 5, 6 | [plan](../plans/completed/phase-7-integration-polish.plan.md) |

### Phase Details

**Phase 1: Project Scaffold + Brand 4.0 Design System**
- **Goal**: Establish the application foundation with Genesis Brand 4.0 visual identity
- **Scope**: Next.js 16 app scaffold, Tailwind CSS 4 config with Brand 4.0 tokens (Ultra Orange #FF5800, Space #472D3E, Ultra Violet #60005F, Sunwash Yellow #FEFAC0), shadcn/ui themed components, Genesis logo SVG, Geist typography, responsive layout shell
- **Success signal**: App runs locally with branded header, empty dashboard layout, and all design tokens rendering correctly

**Phase 2: Energy Cost Model**
- **Goal**: Build the calculation engine that powers the Total Cost of Energy comparison
- **Scope**: TypeScript module that takes household inputs (electricity usage/spend, gas usage/spend, petrol spend, vehicle type, heating type, hot water type, cooktop type) and outputs: current total annual cost, projected electrified cost, savings per category, recommended switch order with payback periods. Based on EECA/Rewiring Aotearoa methodology and current NZ pricing data (39.3c/kWh electricity avg, regional petrol prices, appliance costs)
- **Success signal**: Given a typical NZ household profile, the model outputs a credible TCE comparison that matches within 10% of EECA/Rewiring Aotearoa calculator results

**Phase 3: TCE Calculator UI**
- **Goal**: The core user-facing experience — input your profile, see your Total Cost of Energy
- **Scope**: Guided input form (household energy profile), hero TCE number (annual spend now vs. electrified), breakdown cards (power/gas/petrol split), before/after comparison visualisation using Recharts
- **Success signal**: A user can input their profile and see their TCE in under 2 minutes; the numbers are clearly presented and the savings case is immediately compelling

**Phase 4: Savings Roadmap**
- **Goal**: Make the TCE story actionable with a phased electrification plan
- **Scope**: Ordered list of recommended switches (e.g., "1. Switch to heat pump heating — saves $X/year, pays back in Y years"), cumulative savings timeline chart, total investment vs. total savings view
- **Success signal**: User can see a clear, personalised order of actions with financial justification for each

**Phase 5: Bill Tracker Dashboard**
- **Goal**: CashNav-inspired view showing all energy costs in one place over time
- **Scope**: Monthly energy spend chart (stacked: electricity + gas + petrol), category breakdown donut/bar chart, trend indicators (up/down vs. last month/year), simulated 12-month history for demo mode
- **Success signal**: Dashboard shows a compelling "all your energy in one place" view with clear visual hierarchy

**Phase 6: AI Energy Advisor (EIQ)**
- **Goal**: Conversational AI that makes the TCE data personal and interactive
- **Scope**: Dual-backend AI chat panel (Claude primary, Agentforce optional — switchable via env vars), system prompt grounded in user's TCE inputs and results, handles questions like "Should I get solar or an EV first?", "What's the payback on a heat pump?", "How does my usage compare to average?", streaming responses, contextual prompts from dashboard cards
- **Success signal**: AI gives accurate, personalised, NZ-specific energy advice grounded in the user's actual inputs; no hallucinated data; can demo with either backend

**Phase 7: Integration + Polish**
- **Goal**: Production-quality prototype ready for stakeholder presentation
- **Scope**: Wire all features into cohesive flow, pre-populated demo profiles (Auckland homeowner, Wellington renter, Christchurch family), responsive design (mobile + desktop), loading states, error handling, "Prototype" labelling
- **Success signal**: Can run a 5-minute stakeholder demo from landing → TCE result → savings roadmap → AI conversation without any dead ends or broken states

### Parallelism Notes

- **Phases 1 and 2** can run in parallel in separate worktrees — Phase 1 is pure UI/design, Phase 2 is pure logic/calculation with no UI dependency
- **Phases 4, 5, and 6** can run in parallel after Phase 3 is complete — they are independent features that plug into the TCE dashboard (roadmap, bill tracker, and AI advisor touch different domains)
- **Phase 7** depends on all prior phases and is the integration/polish pass

---

## Decisions Log

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Build independent vs. extend Cogo | Independent app | White-label Cogo, fork Cogo | Genesis needs differentiation; ASB already has the same Cogo tool; independence allows full control of UX and AI integration |
| AI backend | Dual: Claude (primary) + Agentforce (optional) | Single backend only | Matches PoC pattern; Claude for rich reasoning, Agentforce for Salesforce ecosystem alignment; switchable via env vars |
| Tech stack | Next.js 16 / React 19 / Tailwind 4 / shadcn | Astro, Remix, Vue | Matches proven patterns from EIQ PoC; team already familiar; shadcn provides rapid component development |
| Energy data source | EECA / Rewiring Aotearoa / Powerswitch public data | Genesis proprietary data, smart meter feeds | Available immediately; no dependency on Genesis data team; can upgrade to real data later |
| Mobile vs. desktop first | Mobile-first, responsive | Desktop-first | CashNav is mobile-native; energy costs are a daily concern checked on-the-go; responsive ensures desktop works for stakeholder demos |
| Prototype vs. production | Working prototype with demo data | Full production app | Needs to sell the vision, not serve real customers yet; reduces scope and timeline dramatically |

---

## Research Summary

**Market Context**
- NZ households face $10,000–$15,000/year total energy spend across power, gas, and petrol — no tool shows this combined number
- Electricity up 21% in 3 years (avg 39.3c/kWh), gas up 15.4%, petrol near $4/litre
- EV adoption surging (68% of new registrations), but no government consumer subsidies active
- Genesis launched Cogo calculator Aug 2025 — first NZ retailer, but ASB beat them by a month with the same platform plus embedded financing
- No competitor (Mercury, Meridian, Contact, Octopus) has a TCE tool
- Billy (billy.govt.nz) launched 26 March 2026 — government electricity plan comparison tool, already dominating consumer awareness. Covers electricity switching ONLY (no gas, petrol, electrification). Validates massive consumer appetite for energy cost tools while leaving multi-vector TCE space wide open. Built on EA data infrastructure (ICP APIs, consumer data framework, EMI datasets) that Genesis can also access as a licensed retailer
- Octopus Energy NZ (Kraken/Zero Bills) is the most sophisticated competitor but focuses on product delivery, not advisory tools

**Technical Context**
- Existing EIQ PoC (`gen-agentforce-poc`) provides proven patterns: Next.js 16, React 19, Tailwind 4, shadcn/ui, energy data models, AI chat infrastructure, voice input
- Dual AI backend: Claude (primary) + Agentforce (optional) — Claude SDK in PoC ready to use
- Genesis Brand 4.0 Figma file contains colour foundations and logo but no component library — will need to build components from primitives
- Cogo's underlying platform (used by both Genesis and ASB) covers EVs, heating, hot water, cooktops, solar — useful reference for input categories
- EECA and Rewiring Aotearoa have published calculators with open methodology — strong basis for the energy cost model
- Greenfield repo with Catch engineering standards already configured (testing, security, logging, coding guidelines)

---

*Generated: 2026-04-07*
*Status: ALL PHASES COMPLETE — ready for stakeholder review*
