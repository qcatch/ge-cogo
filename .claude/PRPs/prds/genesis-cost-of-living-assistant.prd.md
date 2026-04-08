# Genesis Cost of Living Assistant

## Problem Statement

New Zealand households see their power bill, petrol receipt, and gas bill as three entirely separate costs and never aggregate them into one number. This means they systematically underestimate how much energy is actually costing them — and therefore underestimate the financial value of switching to electricity. No tool in New Zealand or globally shows a household their complete current energy spend across all fuel types alongside a fully electrified equivalent. The result is that households absorb rising costs passively, feeling powerless, when a dramatically cheaper alternative already exists and is available to them right now.

## Evidence

- The Genesis Go Electric calculator (launched August 2025, built by Cogo) shows strong engagement with individual upgrade savings — proving real consumer appetite for electrification cost comparisons. But it frames savings as "here's what you'd save" without first showing the baseline total spend.
- No NZ tool (Powerswitch, Sorted, GenLess, Rewiring Aotearoa) or global tool aggregates electricity + petrol + gas into a single household energy cost number. The aggregation frame is genuinely unclaimed.
- NZ petrol averages $2.73–$3.49/litre (early 2026); EV home charging is ~14–15c/km vs petrol at ~28c/km including RUC — a gap most households have never seen quantified.
- Residential natural gas prices have risen 33% YoY and 54% since 2023, making the electrification case stronger each year.
- Heat pumps cost $200–$300/year to run vs $700–$900/year for gas heaters — roughly a third of the cost.
- NZ food prices rose 4.6% annually to January 2026, outpacing the 3.1% general CPI — food's share of household expenditure has risen from 17.3% (2019) to 18.7% (2023).
- Assumption — needs validation: No direct customer research or call centre data confirming that Genesis customers don't know their total energy cost. The Go Electric engagement data is the best proxy available.

## Proposed Solution

A consumer-facing POC that shows NZ households their total cost of energy as a single confronting headline number, compares it against a fully electrified scenario, surfaces Genesis Power Circle offers (EV, heat pump, electric cooktop) as the commercial conversion point, and extends into a total household running cost view covering groceries and broader cost-of-living savings with third-party referral partners. The product is anchored in financial benefit, not sustainability messaging. Every idea surfaces an immediate action — a pre-drafted email, a referral code, a direct link — closing the gap between "good idea" and "I actually did it."

## Key Hypothesis

We believe showing households their total cost of energy as a single number — and the dramatically lower electrified equivalent — will make the financial case for switching undeniable for Genesis homeowners currently running petrol vehicles and gas/resistive hot water.
We'll know we're right when users complete the TCE calculation and click through to at least one Power Circle offer at a rate that demonstrates commercial viability for stakeholder buy-in.

## What We're NOT Building

- A budgeting or cash flow tracking app — this is a savings discovery tool, not a financial planner
- Smart meter / billing API integration — manual input with sensible defaults for the POC
- User authentication or account creation — results are shown without any registration gate
- Commercial or business customer support — entirely different cost structures and decision processes
- Real-time energy pricing feeds — static benchmarks with user-adjustable inputs
- 15-year lifetime cost projections — annual cost comparisons only
- Battery storage or solar self-consumption modelling — simplified solar offset ($1,600/year)
- Financing or loan calculators — show the cost, link to the offer, let the offer handle financing

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| TCE calculator completion rate | >60% of users who start | Analytics: form start vs results view |
| Power Circle offer click-through | >15% of users who see results | Analytics: CTA clicks on offer cards |
| Cost of living idea engagement | >3 ideas explored per session | Analytics: idea card interactions |
| Stakeholder "wow" reaction | Qualitative buy-in for production build | Stakeholder demo feedback |
| Time to first result | <90 seconds from landing | UX timing measurement |

## Open Questions

- [ ] Power Circle offer terms — pricing, availability, eligibility, CTA mechanics for EV, heat pump, and electric cooktop offers. Hard dependency for the offer layer.
- [ ] Petrol price default — the brief says "$4+/litre" but NZ averages are $2.73–$3.49. Recommend slider defaulting to $3.20 with range up to $4.00. Needs Genesis sign-off.
- [ ] EV cost methodology — include RUC ($76/1,000km) or exclude? Recommend include for credibility. The case is still compelling.
- [ ] Legal review of savings projections — FMA/Fair Trading Act obligations on framing estimates. Not a blocker but must happen before any customer-facing launch.
- [ ] Third-party referral partner terms — HelloFresh, My Food Bag, Animates etc. Stage 3 dependency, lower urgency than Power Circle.
- [ ] Region data gap — TCE spec has heating multipliers for 8 regions; needs fallback values for the other 8 NZ regions or a simpler regional model.
- [ ] Gas household segmentation — no authoritative NZ data on % of households with piped gas vs LPG vs electric-only. Affects default scenario selection.
- [ ] Genesis stakeholder approval on product naming — "Cost of Living Assistant" confirmed as the name, replacing "CoGo" entirely.

---

## Users & Context

**Primary User**
- **Who**: Genesis customer, homeowner, age 35–55, one or two petrol cars, gas or resistive hot water cylinder, paying $250–$350/month electricity + $300–$400/month petrol. Digitally comfortable but not a tech enthusiast. Financially aware but time-poor.
- **Current behavior**: Sees power bill, petrol receipt, and gas bill as separate costs. Has never added them up. Has a vague sense they're spending too much but hasn't done the research. May have heard about EVs or heat pumps but hasn't run the numbers.
- **Trigger**: Cost shock — just filled up the car and winced at the price, got a higher-than-expected power bill, someone they know got an EV, or clicked through a Genesis ad/email out of curiosity.
- **Success state**: Sees their total energy cost for the first time, understands the electrified alternative, and takes at least one step — clicks a Power Circle offer, shares their results, or explores cost-of-living savings ideas.

**Secondary User**
- **Who**: Genesis prospect actively researching an EV, solar, or heat pump purchase. Needs a total cost of ownership view rather than individual product calculators.
- **Trigger**: Mid-purchase research — comparing options, wants hard numbers.

**Job to Be Done**
When I get a shocking petrol bill or power bill and feel like my household running costs are out of control, I want to see exactly what energy is costing me across everything in one place and understand what I could do to genuinely reduce it, so I can stop feeling like I'm just absorbing rising costs with no control over them and start making changes that actually make a difference.

**Non-Users**
- Renters (can't make electrification decisions — relevant only for cost-of-living ideas, not the energy core)
- Already-electrified households (the gap is already closed — product has little to offer them)
- Commercial/business customers (different cost structures entirely)
- People seeking budgeting/cash flow tracking (this is the "CoGo trap" — the product must not drift toward)
- People with no Genesis relationship and no realistic conversion path

---

## Solution Detail

### Architecture: Three Layers

The product has a three-layer architecture. All three layers ship in the POC — no phasing.

**Layer 1 — Total Cost of Energy (Genesis-owned territory)**
The centrepiece. A calculator that aggregates electricity + gas + petrol + vehicle costs into a single headline number ("your total cost of energy today") and compares it against a fully electrified scenario. The gap between those two numbers is the product's core value proposition. Every subsequent element links back to closing that gap.

**Layer 2 — Power Circle Offers (Commercial conversion)**
Targeted Genesis product offers surfaced in direct response to the user's TCE results. If the user has a petrol car, show the EV offer. If they have gas heating, show the heat pump offer. If they have a gas cooktop, show the induction offer. Solar for everyone. These are contextual, personalised, and tied to specific savings amounts from the calculator.

**Layer 3 — Cost of Living Playbook (Stickiness and broader appeal)**
Extends the headline number from "total cost of energy" to "total household running costs" by adding groceries and broader cost-of-living savings. Editorial idea cards — short, punchy, actionable — organised by category. Third-party referral partners (HelloFresh, Animates, etc.) mirror the Power Circle offer structure. This layer makes the product useful beyond energy and creates repeat engagement.

### Core Capabilities (MoSCoW)

| Priority | Capability | Rationale |
|----------|------------|-----------|
| Must | Total Cost of Energy calculator — aggregate electricity + gas + petrol into one headline number | Core value proposition; the confronting number that makes the product work |
| Must | Electrified comparison — show current vs fully-electrified cost side-by-side with animated transition | The gap between the two numbers is the entire product thesis |
| Must | Appliance switching roadmap — heat pump, hot water, cooktop, EV, solar with per-item savings and payback | Translates the headline gap into specific, actionable steps |
| Must | Power Circle offer cards — contextual EV, heat pump, cooktop, solar offers with CTAs | Commercial conversion point; links savings to Genesis products |
| Must | Cost of living idea cards — editorial savings ideas across dining, shopping, subscriptions, travel, home, family, transport, insurance, finance, fitness, pets | Breadth and stickiness; makes the product a daily-use resource |
| Must | AI chat contextualised with TCE results and household profile | Personalised guidance; answers "what should I do first?" |
| Must | Shareable savings summary — a card/profile the user can show others | Social amplification; the brief explicitly calls for this |
| Must | Action It Now principle — every idea has a pre-drafted email, referral code, direct link, or step-by-step instruction | Closes the gap between "good idea" and "I actually did it" |
| Should | Partner referral codes — HelloFresh, My Food Bag, Animates, Sharesies, Canstar links | Commercial model for Layer 3; curated recommendations |
| Should | Pre-drafted negotiation emails — bank, insurance, subscriptions | High-value "action it now" feature; differentiator |
| Should | Demo profiles — pre-built NZ household scenarios for stakeholder demos | Essential for stakeholder sell-in without requiring real data entry |
| Should | Receipt scanner integration — photograph a receipt to add real expenses | Bridges manual input to real data; exists in current codebase |
| Could | Animated scenario comparison — live updating as user explores different switches | "Wow" factor for stakeholder demos; design brief calls for this |
| Could | Category navigation as discovery — exploration app feel vs utility tool | Design direction from brief; closer to a magazine than a dashboard |
| Won't | User accounts or authentication — POC only | Unnecessary complexity for proving the concept |
| Won't | Billing API integration — real Genesis customer data | Production feature, not POC scope |
| Won't | Battery storage or detailed solar self-consumption modelling | Over-engineering for POC; simplified offset is sufficient |

### User Flow

```
1. LAND → Confronting question: "Do you know what energy is actually costing you?"
     ↓
2. INPUT → Quick household setup (3-5 essential inputs with sensible defaults):
   - Region (dropdown)
   - Household size (selector)
   - Monthly power bill (slider, default from region)
   - Monthly petrol spend (slider, default from household size)
   - Heating type (radio: heat pump / gas / electric resistive / wood)
   - Hot water type (radio: electric / gas / heat pump)
   - Cooktop type (radio: electric / gas / induction)
   - Vehicle(s) (radio: petrol / diesel / hybrid / EV / none)
     ↓
3. REVEAL → The Number: "Your household spends $X,XXX per year on energy"
   - Animated, bold, confronting
   - Immediately followed by: "It could be $Y,YYY"
   - The gap shown as a single dramatic figure: "You could save $Z,ZZZ per year"
     ↓
4. BREAKDOWN → How that number splits across:
   - Electricity: $X/year
   - Petrol/diesel: $X/year
   - Gas (piped/LPG): $X/year
   - Vehicle running costs: $X/year
   vs the electrified equivalent for each
     ↓
5. ROADMAP → Switching steps ranked by savings:
   - Each item: what to switch, annual saving, upfront cost, payback period
   - Directly linked to Power Circle offers where applicable
     ↓
6. POWER CIRCLE OFFERS → Contextual cards based on user's current setup:
   - "Switch to an EV — save $X,XXX/year on transport" → CTA
   - "Install a heat pump — save $XXX/year on heating" → CTA
   - "Go induction — save $XXX/year on cooking" → CTA
   - "Add solar — generate $X,XXX/year of your own power" → CTA
     ↓
7. TOTAL HOUSEHOLD COSTS → Expand the view:
   - Energy: $X,XXX (from calculator)
   - Groceries: $X,XXX (benchmark + user input)
   - Insurance: $X,XXX
   - Transport (non-fuel): $X,XXX
   - Communications: $X,XXX
   - Total: "Your household costs $XX,XXX per year to run"
     ↓
8. COST OF LIVING PLAYBOOK → Category-based savings ideas:
   - Dining & social (First Table, BYOB, happy hours, lunch menus)
   - Shopping (abandoned cart trick, price trackers, end-of-season)
   - Subscriptions (pulse on/off, cancel-to-retain, family plans, audit)
   - Home & mortgage (call your bank, online grocery only, meal planning)
   - Travel (Google Flights date grid, direct booking, shoulder season)
   - Family, transport, insurance, finance, fitness, pets
   - Each idea: headline, savings estimate, immediate action step
   - Partner offers embedded contextually (HelloFresh code in groceries, etc.)
     ↓
9. AI ASSISTANT → Available throughout via command bar + slide-in panel:
   - "What's my biggest savings opportunity?"
   - "How much would I save switching to an EV?"
   - "Draft me an email to negotiate my mortgage rate"
   - Contextualised with the user's TCE results and household profile
     ↓
10. SHARE → Savings summary card:
    - "The [Family Name] household could save $X,XXX/year"
    - Shareable as image/link
    - Social proof amplification
```

---

## Technical Approach

**Feasibility**: HIGH

The existing codebase (Next.js 16 / React 19 / Tailwind 4 / shadcn/ui / Recharts / Claude AI) provides the full infrastructure. The TCE calculation engine was previously specced in detail and can be rebuilt from the surviving blueprint. Form libraries (`react-hook-form`, `zod`) are installed but unused — ready for the calculator.

**Architecture Notes**
- Single Next.js app with App Router — new pages/routes for the calculator flow alongside the existing dashboard
- TCE calculation engine rebuilt as `lib/energy-model/` from the complete spec in `phase-2-energy-cost-model.plan.md` — all constants, types, and formulas documented
- Cost of living data model extends the existing `lib/household-model/` with grocery benchmarks from IRD AD164 / Stats NZ HES 2023
- AI chat reuses the existing `ConversationPanel` + `/api/chat` SSE streaming architecture — new `buildTCESystemPrompt()` function for energy context
- Design tokens (Genesis Brand 4.0) already defined in `globals.css` — Ultra Orange, Ultra Violet, Space, Sunwash Yellow
- Demo profiles serve as the primary interaction mode for stakeholder demos, with manual input as the real user path
- No backend services, databases, or authentication required — all calculation is client-side, AI chat is the only API dependency

**Key Technical Decisions**

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Data input model | Manual input with sensible defaults | Billing API integration; demo profiles only | Lowest build cost while still creating personalised confrontation. Demo profiles for stakeholder demos, manual input for real users. |
| Calculation location | Client-side (browser) | Server-side API route | All inputs are user-provided, no sensitive data, no backend needed. Instant results, no loading. |
| Petrol price default | Slider at $3.20/L, range $2.50–$4.50 | Fixed $4+/L as per brief; MBIE live feed | $3.20 is credible against current averages ($2.73–$3.49). Slider lets users adjust to their reality. $4+ as fixed default would undermine trust. |
| EV cost methodology | Include RUC ($76/1,000km) | Exclude RUC (lower headline, less credible) | EV forums and informed users call out tools that exclude RUC. Including it and still showing EV as ~50% cheaper is the stronger argument. |
| Solar model | Simplified $1,600/year offset | Full generation/self-consumption model | Good enough for POC. July 2026 export regulation change will improve this number — note it in output. |
| AI provider | Claude via Vercel AI SDK (existing) | Agentforce (reference PoC) | Already working in the codebase. Demo mode fallback for no-API-key scenarios. |
| Region model | 8 regions with heating multipliers + "Other" fallback | Full 16-region model | TCE spec covers 8 regions with Rewiring Aotearoa data. Remaining 8 map to nearest match. Sufficient for POC. |

**Technical Risks**

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| TCE calculation accuracy challenged by stakeholders or informed users | Medium | Use Rewiring Aotearoa methodology (same source as EECA/GenLess). Expose "how we calculate this" methodology page. Include RUC. Use conservative defaults. |
| Power Circle offer terms not defined in time | High | Build offer card UI with placeholder content. Wire CTAs to generic Genesis product pages. Swap in real offers when terms are confirmed. |
| Petrol price sensitivity — users see a default that doesn't match their reality | Medium | Adjustable slider with clear label showing current NZ average range. Never present a fixed figure. |
| AI chat hallucination on specific savings figures | Low | System prompt includes the user's actual calculated numbers. Demo mode provides verified canned responses. Disclaimer on AI-generated content. |
| Scope creep from stakeholder feedback during demos | High | PRD defines explicit "Won't" list. POC scope is locked. Feedback captured for production roadmap, not POC iteration. |

---

## NZ Data Model: Key Constants

### Energy Costs (Source: Rewiring Aotearoa / MBIE / Powerswitch 2025-2026)

| Parameter | Value | Source |
|-----------|-------|--------|
| National avg electricity rate | 39.3c/kWh | Powerswitch 2025 |
| Auckland electricity rate | 38.0c/kWh | Powerswitch 2025 |
| Wellington electricity rate | 34.6c/kWh | Powerswitch 2025 |
| Electricity fixed charges | $768/year | MBIE |
| Gas rate (piped) | 11.8c/kWh | Rewiring Aotearoa |
| Gas fixed charges | $689/year | Rewiring Aotearoa |
| LPG rate | 25.5c/kWh | Rewiring Aotearoa |
| Petrol price (default) | $3.20/litre | MBIE weekly monitoring, Mar 2026 avg |
| Petrol price (slider range) | $2.50–$4.50/litre | Covers discount to premium/rural |
| EV RUC | $76/1,000km | Waka Kotahi |
| EV consumption | 18 kWh/100km | Rewiring Aotearoa |
| Petrol consumption | 8.5L/100km | Rewiring Aotearoa |

### Appliance Running Costs (Annual)

| Appliance | Current Cost | Electrified Cost | Annual Saving |
|-----------|-------------|------------------|---------------|
| Gas heater | $700–$900 | Heat pump: $200–$300 | $400–$600 |
| Gas hot water | ~$800 | Heat pump HW: ~$300 | ~$500 |
| Gas cooktop | ~$250 | Induction: ~$100 | ~$150 |
| Petrol car (15,000km) | ~$4,080 | EV (incl RUC): ~$2,190 | ~$1,890 |

### Appliance Installed Costs

| Appliance | Installed Cost | Source |
|-----------|---------------|--------|
| Heat pump (heating) | $3,778 | Rewiring Aotearoa |
| Heat pump hot water | $6,999 | Rewiring Aotearoa |
| Induction cooktop | $2,695 | Rewiring Aotearoa |
| 5kW solar system | $9,000 | Industry average 2025 |
| Solar annual offset | $1,600/year | Simplified estimate |

### Grocery Costs (Source: IRD AD164 / Stats NZ HES 2023)

| Household Type | Weekly Food & Groceries | Monthly | Annual |
|---------------|------------------------|---------|--------|
| Single person | $170 | $737 | $8,840 |
| Couple | $330 | $1,430 | $17,160 |
| Family of 4 | $445 | $1,928 | $23,140 |
| Retired couple | $310 | $1,343 | $16,120 |

Note: IRD AD164 "food & groceries" includes restaurant meals, takeaways, toiletries, cleaning products. Pure supermarket spend is ~70-80% of these figures.

### Food Price Context

| Metric | Value | Source |
|--------|-------|--------|
| Annual food price inflation (Jan 2026) | +4.6% | Stats NZ |
| Overall CPI (Jan 2026) | +3.1% | Stats NZ |
| Dairy & eggs inflation | +9.9% | Stats NZ |
| Fruit & vegetables inflation | +9.4% | Stats NZ |
| Food share of household spend (2023) | 18.7% | Stats NZ HES |

---

## Content Model: Cost of Living Playbook

### Layer 2 — Power Circle Offers (Genesis Products)

Each offer is contextual — shown only when the user's input indicates they'd benefit.

| Offer | Trigger Condition | Savings Headline | CTA |
|-------|-------------------|-----------------|-----|
| EV | User has petrol/diesel vehicle | "Save $X,XXX/year on transport" | Explore Genesis EV plans |
| Heat pump | User has gas/resistive heating | "Save $XXX/year on heating" | Get a heat pump quote |
| Heat pump hot water | User has gas/resistive HW | "Save $XXX/year on hot water" | Upgrade your hot water |
| Induction cooktop | User has gas cooktop | "Save $XXX/year on cooking" | Switch to induction |
| Solar | All users (homeowners) | "Generate $X,XXX/year of your own power" | Explore Genesis solar |
| Smart plan / time-of-use | All Genesis customers | "Save $XXX/year by shifting usage" | Switch to a smart plan |

### Layer 3 — Cost of Living Ideas (Minimum Content Set)

Each idea follows the editorial card format: **Headline** / **Savings estimate** / **Immediate action**.

#### Dining & Social
| Idea | Savings Estimate | Action |
|------|-----------------|--------|
| First Table — book first sitting for 50% off food | $500–$1,500/year (weekly diners) | Link to First Table app |
| Insert card instead of tapping — skip contactless surcharge | $50–$150/year | Habit change — no link needed |
| BYOB restaurants — avoid 3-4x wine markup | $300–$800/year (monthly diners) | Search "BYO restaurants [city]" |
| Check happy hour apps before heading out | $200–$500/year | Link to Zomato/app store |
| Lunch menus instead of dinner | $300–$600/year | Habit change |
| Coffee loyalty cards — consolidate and use them | $100–$300/year | Pick your two cafes |

#### Shopping & Retail
| Idea | Savings Estimate | Action |
|------|-----------------|--------|
| Abandoned cart trick — leave items, wait 24-48hrs for discount code | 10–15% per purchase | Habit change |
| Price tracker browser extensions (Honey etc.) | $200–$500/year | Link to install Honey |
| Sign-up discount — dedicated email for retail signups | 10–20% first order | Create a retail-only email |
| Buy end-of-season clothing and gear | 30–60% off | Habit change — buy next winter's coat in spring |
| Trade Me / Facebook Marketplace for furniture | 50–80% off retail | Link to Trade Me |
| Buy non-perishables in bulk | $300–$600/year | Habit change |
| Cashback credit cards for everyday spend | $200–$600/year | Link to Canstar credit card comparison |

#### Subscriptions & Digital
| Idea | Savings Estimate | Action |
|------|-----------------|--------|
| Pulse streaming on/off by month | $300–$500/year | Pause all but one service now |
| Ask to cancel — get retention discount (works 60-70% of the time) | $50–$200/year per service | Pre-drafted cancellation script |
| Subscription audit — check for unused recurring charges | $200–$500/year | Bank statement review checklist |
| Family/shared plans (Spotify, Apple One, YouTube) | $200–$400/year | Link to plan comparison |
| Switch to annual billing | 15–20% saving per service | Check each active subscription |
| Audit premium features — are you using what you pay for? | $100–$300/year | Downgrade checklist |

#### Home & Mortgage
| Idea | Savings Estimate | Action |
|------|-----------------|--------|
| Call your bank 60-90 days before fixed term rolls | $1,000–$5,000/year | Pre-drafted email to bank |
| Ask for cashback when refinancing ($1,000–$3,000 available) | $1,000–$3,000 one-off | Pre-drafted refinancing inquiry |
| Online grocery orders only — avoid impulse buys | $1,000–$2,000/year | Switch to Countdown/New World online |
| Consolidate grocery trips to one per week | $500–$1,000/year | Meal planning template |
| Meal planning before shopping | $500–$1,500/year | Weekly meal planner tool |
| Own-brand staples — 20-40% cheaper | $500–$1,000/year | Swap list for top 20 staples |
| Home insurance annual review | $200–$600/year | Link to Canstar insurance comparison |

#### Travel
| Idea | Savings Estimate | Action |
|------|-----------------|--------|
| Google Flights date grid — shift by 1-2 days | $100–$400 per trip | Link to Google Flights |
| Credit card travel insurance — check before buying separately | $100–$300 per trip | Check your card benefits |
| Book accommodation direct after finding on platform | 5–15% saving | Habit change |
| Airport parking alternatives (Looking4Parking etc.) | $50–$200 per trip | Link to Looking4Parking |
| Travel in shoulder season | 20–40% saving | Habit change |
| Travel rewards credit cards for everyday spend | $500–$2,000/year in points | Link to Canstar rewards comparison |

#### Partner Referral Offers (Embedded in Relevant Categories)
| Partner | Category | Offer Type | Savings |
|---------|----------|-----------|---------|
| HelloFresh | Groceries | Referral code — $50–$80 off first boxes | One-off |
| My Food Bag / Bargain Box | Groceries | Referral code | One-off |
| Woop | Groceries | Referral code | One-off |
| Animates / Black Hawk / Ziwi Peak | Pets | First-order discount | One-off |
| Sharesies / Kernel | Finance | Referral code — micro-investing nudge | Ongoing |
| Canstar / MoneyHub | Insurance, Banking | Comparison link — empowerment, not direction | Ongoing |
| Grocer / Grosave | Groceries | Grocery price comparison tool link | Ongoing |

#### Additional Categories (Minimum Viable Content)
Each requires 4-6 ideas minimum following the same headline/savings/action format:

- **Family**: Toy libraries, end-of-season kids clothing, second-hand school uniforms, council holiday programmes, library membership
- **Transport (non-fuel)**: Car loan refinancing, tyre pressure for fuel efficiency, Gaspy for fuel prices, park and ride, carpooling
- **Insurance**: Annual policy review, excess increase to reduce premiums, policy bundling, life insurance through KiwiSaver
- **Finance & Banking**: High-interest savings accounts, offset mortgage, automate savings on payday, KiwiSaver contribution rate review
- **Fitness**: Community centre gyms, gym membership negotiation, outdoor training, health app audit
- **Pets**: Annual pet insurance comparison, preventative vet care, bulk pet food, DIY grooming

---

## Pre-Drafted Email / Negotiation Tool

A key differentiator. The product generates ready-to-send emails for:

| Scenario | Template Content | Personalisation |
|----------|-----------------|-----------------|
| Mortgage rate negotiation | "I'm approaching my fixed-term renewal and have been comparing rates..." | User's bank name, current rate if known, competing rate |
| Insurance renewal negotiation | "My policy is due for renewal and I've seen competitive offers..." | Policy type, current premium estimate |
| Subscription retention | "I'd like to cancel my subscription..." (triggers retention offer 60-70% of the time) | Service name |
| Employer KiwiSaver review | "I'd like to review my KiwiSaver contribution rate..." | Current rate |

---

## Design Direction

### Visual Principles

1. **Lead with the number** — the total cost of energy figure is the visual centrepiece. Bold, large, confronting. Not buried in inputs and sliders.
2. **Animated scenario comparison** — today's cost vs electrified as a live, animated transition that updates as the user explores switching options.
3. **A sense of discovery** — ideas and savings unlock as the user adds context about their life. Feels personalised, not generic.
4. **Editorial idea cards** — short punchy headlines, clear savings estimates, immediate action step. Feels like a smart magazine, not a financial dashboard.
5. **Category navigation as exploration** — closer to a discovery app than a utility tool.
6. **Shareable output** — a savings summary card the user wants to show others.

### Design Tokens (Existing)

| Token | Value | Usage |
|-------|-------|-------|
| Ultra Orange (`--primary`) | `#FF5800` | CTAs, highlights, the TCE number |
| Ultra Violet (`--secondary`) | `#60005F` | Secondary actions, depth, charts |
| Space (`--foreground`) | `#472D3E` | Body text, labels |
| Sunwash Yellow (`--accent`) | `#FEFAC0` | Accent backgrounds, badges |
| Chart colours 1–8 | Various | Category and comparison charts |

### Key UI Patterns to Implement

| Pattern | Description | Reference |
|---------|-------------|-----------|
| TCE Hero Number | Large animated counter showing total energy cost, with electrified number alongside | New — centrepiece of the product |
| Comparison Bar Chart | Side-by-side current vs electrified by category (electricity, petrol, gas) | Recharts BarChart — new component |
| Switching Roadmap Cards | Per-appliance cards with savings, cost, payback, priority ranking, Power Circle CTA | Extends existing CategoryCard pattern |
| Power Circle Offer Card | Branded offer with savings headline, description, and prominent CTA button | New — styled like editorial feature |
| Editorial Idea Card | Headline / savings badge / 2-line description / action link | New — magazine-style card |
| Pre-drafted Email Modal | Template email with personalisation fields and copy-to-clipboard | New component |
| Savings Summary Share Card | Branded summary of total savings potential — shareable as image | New component |
| AI Command Bar + Panel | Existing pattern from current codebase | Reuse `ConversationPanel` + `CommandBar` |

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
| 1 | Foundation & Navigation | App shell restructure — multi-page routing, navigation between TCE calculator, dashboard, and playbook sections. Landing page with the confronting question hook. | complete | with 2 | - | [phases-1-2-foundation-and-tce-engine.plan.md](../plans/completed/phases-1-2-foundation-and-tce-engine.plan.md) |
| 2 | TCE Calculation Engine | Rebuild `lib/energy-model/` from the complete spec — all types, constants, consumption calculations, cost comparisons, savings, roadmap generation. Region model with 8 primary + fallback. Demo profiles. | complete | with 1 | - | [phases-1-2-foundation-and-tce-engine.plan.md](../plans/completed/phases-1-2-foundation-and-tce-engine.plan.md) |
| 3 | TCE Calculator UI | Multi-step input form (region, household, energy sources, vehicles) with sensible defaults. Progressive disclosure — show first result after 3 inputs, refine with more. Zod validation, react-hook-form. | complete | - | 1, 2 | [phase-3-tce-calculator-ui.plan.md](../plans/completed/phase-3-tce-calculator-ui.plan.md) |
| 4 | TCE Results & Comparison View | The Number reveal — animated headline TCE figure, electrified comparison, savings gap. Breakdown charts (current vs electrified by category). Switching roadmap with prioritised recommendations. | complete | - | 2, 3 | [phases-4-7-offers-chat-playbook.plan.md](../plans/completed/phases-4-7-offers-chat-playbook.plan.md) |
| 5 | Power Circle Offer Layer | Contextual offer cards based on user's current energy setup. CTA buttons linking to Genesis products. Offer data model (placeholder terms until confirmed). | complete | with 6 | 4 | [phases-4-7-offers-chat-playbook.plan.md](../plans/completed/phases-4-7-offers-chat-playbook.plan.md) |
| 6 | AI Chat — TCE Context | New `buildTCESystemPrompt()` function. TCE-specific conversation starters. Demo mode responses for energy scenarios. Wire existing ConversationPanel to TCE results. | complete | with 5 | 4 | [phases-4-7-offers-chat-playbook.plan.md](../plans/completed/phases-4-7-offers-chat-playbook.plan.md) |
| 7 | Cost of Living Data & Ideas | Grocery cost benchmarks (IRD AD164 data). Full editorial content for all idea categories. Partner referral data model. Idea card component. Category navigation. | complete | with 5, 6 | 2 | [phases-4-7-offers-chat-playbook.plan.md](../plans/completed/phases-4-7-offers-chat-playbook.plan.md) |
| 8 | Total Household Cost View | Extend headline number from energy-only to full household running costs. Donut/bar chart of all cost categories. Link between energy detail and broader household view. | complete | with 9 | 4, 7 | [phases-8-10-household-view-actions-polish.plan.md](../plans/completed/phases-8-10-household-view-actions-polish.plan.md) |
| 9 | Action It Now Features | Pre-drafted email generator. Referral code copy-to-clipboard. Direct links and step-by-step instructions on every idea card. | complete | with 8 | 7 | [phases-8-10-household-view-actions-polish.plan.md](../plans/completed/phases-8-10-household-view-actions-polish.plan.md) |
| 10 | Shareable Output & Polish | Savings summary card generation. Share functionality (copy image, link). Visual polish, animations, transitions. Stakeholder demo flow. | complete | - | 8, 9 | [phases-8-10-household-view-actions-polish.plan.md](../plans/completed/phases-8-10-household-view-actions-polish.plan.md) |

### Phase Details

**Phase 1: Foundation & Navigation**
- **Goal**: Transform single-page app into a multi-section experience with clear flow from landing → calculator → results → offers → playbook
- **Scope**: App Router pages or scroll-section architecture, header nav updates, landing page with "Do you know what energy is actually costing you?" hook, Genesis branding throughout
- **Success signal**: User can navigate between all major sections; landing page creates intrigue

**Phase 2: TCE Calculation Engine**
- **Goal**: Rebuild the complete energy cost calculation engine from the surviving spec
- **Scope**: `lib/energy-model/` — types, constants (all Rewiring Aotearoa data), `calculateTCE()` entry point, consumption calculations, current vs electrified cost comparison, savings calculation, switching roadmap generation, emissions comparison, 3 demo profiles
- **Success signal**: `calculateTCE(aucklandFamilyInput)` returns a `TCEResult` with currentTotal > $10,000, electrifiedTotal < $6,000, and a prioritised roadmap of 4-5 switching recommendations

**Phase 3: TCE Calculator UI**
- **Goal**: Create the input experience that captures household energy profile with minimal friction
- **Scope**: Multi-step form using react-hook-form + zod. Essential inputs: region, occupants, heating type, hot water type, cooktop type, vehicle type(s), monthly power bill (slider), monthly petrol spend (slider). Sensible defaults pre-filled from region and household size. Progressive disclosure — show a preliminary result after the first 3 inputs.
- **Success signal**: User completes input in <90 seconds; form validates correctly; defaults feel plausible

**Phase 4: TCE Results & Comparison View**
- **Goal**: The "wow" moment — the confronting number reveal and electrified comparison
- **Scope**: Animated TCE headline number (counting up), electrified number alongside, savings gap prominently displayed. Breakdown bar chart (current vs electrified by: electricity, gas, petrol, vehicle costs). Switching roadmap cards ranked by annual saving with upfront cost and payback period. "How we calculate this" expandable methodology section.
- **Success signal**: A stakeholder seeing the results view for the first time has an immediate emotional reaction to the gap between current and electrified costs

**Phase 5: Power Circle Offer Layer**
- **Goal**: Convert savings awareness into Genesis product interest
- **Scope**: Offer card component with savings headline, description, and CTA. Conditional rendering based on user's current energy setup (petrol car → EV offer, gas heating → heat pump offer, etc.). Offer data model with placeholder content (swap in real Power Circle terms when available). CTA links to Genesis product pages.
- **Success signal**: Each relevant offer card shows a savings figure that matches the user's calculated roadmap; CTAs are functional

**Phase 6: AI Chat — TCE Context**
- **Goal**: Personalised AI guidance based on the user's specific energy profile and results
- **Scope**: `buildTCESystemPrompt(input, result)` function that serialises the user's household profile, current costs, electrified costs, savings breakdown, and roadmap into the system prompt. TCE-specific conversation starters ("What's my biggest energy saving?", "How much would an EV save me?", "Should I get solar?"). Demo mode keyword-matched responses for energy scenarios.
- **Success signal**: AI can answer "What should I do first?" with a specific, personalised recommendation referencing the user's actual numbers

**Phase 7: Cost of Living Data & Ideas**
- **Goal**: Build the full breadth of the cost-of-living playbook
- **Scope**: Editorial idea data model (headline, savings estimate, action type, action content, category, subcategory, partner reference). All idea content from the brief plus additions. Grocery cost benchmarks from IRD AD164 by region and household type. Partner referral data (codes, links, terms — placeholder where not yet confirmed). Idea card component. Category navigation (dining, shopping, subscriptions, home, travel, family, transport, insurance, finance, fitness, pets). Category browsing experience — discovery feel.
- **Success signal**: Every category has 4-6+ ideas; every idea has a concrete action; partner offers are embedded contextually

**Phase 8: Total Household Cost View**
- **Goal**: Extend the headline from "total cost of energy" to "total household running costs"
- **Scope**: Combine TCE results with grocery benchmarks and other household cost estimates (insurance, rates, communications, healthcare). Present as a single expanded headline number with category breakdown (donut + bar chart, extending existing Recharts patterns). Visual link between energy detail view and broader household view. Income percentage calculation ("your household costs X% of your income to run").
- **Success signal**: User sees their total household running cost and understands energy as the biggest controllable lever within it

**Phase 9: Action It Now Features**
- **Goal**: Close the gap between "good idea" and "I actually did it" on every single idea
- **Scope**: Pre-drafted email generator for mortgage negotiation, insurance renewal, subscription cancellation. Referral code display with copy-to-clipboard. Direct link CTAs on every applicable idea. Step-by-step mini-guides for habit-change ideas. Template personalisation where possible (user's region, household type, estimated spend).
- **Success signal**: Every idea card has a functional action; pre-drafted emails are plausible and ready to send

**Phase 10: Shareable Output & Polish**
- **Goal**: Create the "show others" moment and polish the full experience for stakeholder demos
- **Scope**: Savings summary card (branded, containing key numbers — total current cost, potential savings, top 3 actions). Share as image (html-to-canvas) and as link. Full visual polish pass — animations on number reveals, transitions between sections, loading states, empty states. Demo profile quick-switch for stakeholder presentations. Responsive design check (mobile-first per NN/G best practice).
- **Success signal**: The product creates a genuine "wow" reaction in a stakeholder demo and produces a shareable asset users would actually post

### Parallelism Notes

- **Phases 1 and 2** can run in parallel in separate worktrees — Phase 1 touches app structure/routing while Phase 2 is a pure library (`lib/energy-model/`) with no UI dependencies.
- **Phases 5, 6, and 7** can run in parallel after Phase 4 — they touch different domains: Power Circle offers (commercial), AI chat (conversation layer), and cost-of-living content (editorial layer). Each has independent data models and components.
- **Phases 8 and 9** can run in parallel — Phase 8 is data aggregation and visualisation while Phase 9 is action/interaction features on idea cards.
- **Phase 10** must be last as it's a polish pass across everything.

---

## Decisions Log

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Product name | Genesis Cost of Living Assistant | CoGo (rejected), Genesis Energy Calculator, Genesis TCE Tool | Brief is explicit: CoGo name conflicts with product direction. "Cost of Living Assistant" positions as broader than energy while keeping energy as the anchor. |
| Build scope | Full POC — all three layers | Phased MVP (Stage 1 only by August) | POC goal is stakeholder wow and concept validation, not production-ready incremental delivery. Full vision demonstrates the complete value proposition. |
| Data input model | Manual input + sensible defaults + demo profiles | Billing API integration; demo profiles only | Manual input creates personalised confrontation without backend dependencies. Demo profiles for stakeholder demos. Billing integration is a production roadmap item. |
| Petrol price default | $3.20/L slider, range $2.50–$4.50 | Fixed $4+/L per brief | $3.20 is credible against current NZ averages. Fixed $4+ would be challenged immediately. Slider lets users adjust. |
| EV cost includes RUC | Yes — $76/1,000km included | Exclude RUC for bigger headline saving | Credibility over headline. Informed users and EV forums call out tools that exclude RUC. Including it still shows EVs as ~50% cheaper. |
| Solar model | Simplified $1,600/year offset | Full generation + self-consumption model | Sufficient for POC. Note July 2026 export regulation change as upside. |
| Framing | Financial benefit, not sustainability | Green/sustainability messaging | Brief is explicit: "This is not a sustainability message. It is a financial one. The environmental benefit is a bonus, not the headline." |
| Telco content | General advice only (negotiate, check plan) | Recommend specific budget telcos | Brief flags this explicitly: proximity to Genesis's commercial relationships means no named competitor recommendations in telco. |
| Form approach | Progressive disclosure — result after 3 inputs | Full form before any result | NN/G research: tools requiring 10+ inputs before showing results lose 60-70% of users. Show an estimate early, refine with more inputs. |
| Registration | None required — results shown without gate | Account creation before results | NN/G: mandatory registration before results is the single biggest conversion killer. Show value first. |

---

## Research Summary

**Market Context**
- The "total household energy cost across all fuel types" aggregation frame is unclaimed globally. No NZ or international tool shows this.
- Genesis/Cogo Go Electric calculator (August 2025) is the closest NZ competitor but frames savings as "here's what you'd save" not "here's what you spend."
- Rewiring Aotearoa methodology underpins Genesis, ASB, and EECA calculators — using the same source gives credibility.
- NZ electrification economics are decisively favourable: EV ~50% cheaper per km (incl. RUC), heat pump ~66% cheaper than gas, gas prices rising 33% YoY.
- NZ food prices rising 4.6% (Jan 2026) vs 3.1% general CPI — grocery costs are a genuine and growing pain point.
- NN/G calculator UX research: immediate results, progressive disclosure, no registration gate, expose methodology, mobile-first. Anti-patterns: too many required inputs, misleading defaults, showing savings without anchoring to current cost.

**Technical Context**
- Existing codebase provides full infrastructure: Next.js 16, React 19, Tailwind 4, Genesis Brand 4.0 tokens, shadcn/ui, Recharts, Claude AI streaming chat.
- TCE calculation engine fully specced in surviving plan document — rebuild from blueprint, not from scratch.
- `react-hook-form` and `zod` installed but unused — ready for calculator form.
- AI chat architecture is already generalised — new system prompt function slots in without changes.
- Reference PoC provides patterns for savings cards, AI-triggered CTAs, customer context injection.
- No Power Circle, referral, or partner infrastructure exists — net-new work.
- Region mismatch (8 in TCE spec vs 16 in household model) needs reconciliation with fallback mapping.

---

*Generated: 2026-04-08*
*Status: DRAFT — needs validation*
*Source brief: reference/Genesis_Cost_of_Living_Assistant_Brief_v2.docx*
