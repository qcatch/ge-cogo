# Feature: Total Household View + Action It Now + Shareable Output (Phases 8-10)

## Summary

Final combined plan completing the entire POC. Phase 8 adds a "Total Household Running Cost" section that combines TCE energy costs with benchmark NZ household costs (groceries, insurance, transport, etc.) into a single headline number with a donut chart. Phase 9 makes the email action type functional on idea cards — pre-drafted negotiation emails in a Sheet modal with copy-to-clipboard. Phase 10 adds a shareable savings summary card with html-to-image capture, visual polish (section transitions, demo profile quick-switch), and stakeholder demo flow.

## User Story

As a NZ homeowner who has explored my energy costs and savings ideas,
I want to see my total household running costs in one place, take immediate action on savings ideas via pre-drafted emails, and share my results with others,
So that I have a complete picture of my costs, can act on the biggest opportunities right now, and can show friends and family what they could save too.

## Metadata

| Field            | Value |
| ---------------- | ----- |
| Type             | NEW_CAPABILITY + ENHANCEMENT |
| Complexity       | HIGH |
| Systems Affected | app/page.tsx, lib/cost-of-living/, components/savings/, new components/share/ |
| Dependencies     | html-to-image (new install needed), recharts@2.15.4 (existing) |
| Estimated Tasks  | 10 |

---

## Mandatory Reading

| Priority | File | Lines | Why Read This |
|----------|------|-------|---------------|
| P0 | `app/page.tsx` | all | Full page to UPDATE — all sections |
| P0 | `components/dashboard/spending-donut.tsx` | all | Donut chart pattern to REUSE for household costs |
| P0 | `lib/household-model/constants.ts` | all | NZ benchmark data for household categories |
| P0 | `lib/cost-of-living/types.ts` | all | SavingsIdea type to EXTEND with emailTemplate |
| P0 | `components/savings/idea-card.tsx` | all | Email action to make functional |
| P1 | `components/ui/sheet.tsx` | all | Sheet modal for email drafts |
| P1 | `lib/chart-colors.ts` | all | Chart color system for donut |
| P2 | `lib/format.ts` | all | Currency/percent formatters |

---

## Files to Change

| File | Action | Justification |
|------|--------|---------------|
| `lib/cost-of-living/types.ts` | UPDATE | Add `emailTemplate` field to `SavingsIdea` |
| `lib/cost-of-living/ideas.ts` | UPDATE | Add email template content to the 4 email-type ideas |
| `lib/cost-of-living/email-templates.ts` | CREATE | Pre-drafted email templates for bank/insurance negotiation |
| `components/savings/idea-card.tsx` | UPDATE | Make email action functional — open Sheet with draft |
| `components/savings/email-draft-sheet.tsx` | CREATE | Sheet modal showing pre-drafted email with copy button |
| `components/household/total-cost-view.tsx` | CREATE | Total household running cost section with donut chart |
| `components/share/savings-summary-card.tsx` | CREATE | Branded shareable savings summary |
| `app/page.tsx` | UPDATE | Add household cost section, polish, demo flow |
| `package.json` | UPDATE | Install html-to-image |

---

## NOT Building (Scope Limits)

- **No real email sending** — copy-to-clipboard only. Users paste into their own email client.
- **No social media API integration** — share is download-as-image only.
- **No animated number counter** — static numbers for POC (animation adds complexity with no POC value).
- **No user-entered household cost data** — use NZ benchmark data from Stats NZ HES. The energy section has the personalised calculator; the household section uses representative averages.

---

## Step-by-Step Tasks

### Task 1: Install html-to-image

- **ACTION**: Add `html-to-image` dependency for share-as-image
- **IMPLEMENT**: `npm install html-to-image`
- **VALIDATE**: `npx tsc --noEmit`

### Task 2: CREATE `lib/cost-of-living/email-templates.ts`

- **ACTION**: Pre-drafted email templates for the 4 email-type ideas
- **IMPLEMENT**: Export a `Record<string, EmailTemplate>` keyed by idea `id`:
  ```typescript
  export interface EmailTemplate {
    subject: string
    body: string
  }

  export const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
    'call-bank': {
      subject: 'Mortgage rate review — fixed term approaching renewal',
      body: `Dear [Bank Name] Lending Team,

  My fixed-rate mortgage term is approaching its renewal date and I'd like to discuss the best rate options available.

  I've been comparing rates across several lenders and have found competitive offers that I'd like to discuss with you before making any decisions. I value my banking relationship and would appreciate the opportunity to negotiate a rate that reflects my loyalty as a customer.

  Could you please let me know:
  1. What rates you can offer for [1-year / 2-year / 3-year] fixed terms?
  2. Are there any cash-back incentives available for renewal?
  3. What flexible repayment options are available?

  I'd appreciate a response within the next week so I can make an informed decision before my current term expires.

  Kind regards,
  [Your Name]
  [Account Number]`,
    },
    'refinance-cashback': {
      subject: 'Refinancing inquiry — cashback and rate comparison',
      body: `Dear [Bank Name] Home Loans Team,

  I'm currently reviewing my mortgage arrangements and exploring refinancing options. I understand that banks often offer cashback incentives for new lending customers, and I'd like to know what's available.

  My current mortgage details:
  - Outstanding balance: [amount]
  - Current rate: [rate]%
  - Current lender: [lender name]

  Could you please provide:
  1. Your best available fixed rates for [1/2/3-year] terms?
  2. Any cashback offers for refinancing?
  3. An estimate of the total costs involved in switching?

  Kind regards,
  [Your Name]`,
    },
    'car-loan-refi': {
      subject: 'Car loan refinancing inquiry',
      body: `Dear [Lender Name],

  I'm currently reviewing my car finance arrangements. My existing car loan is at [current rate]% and I believe there may be more competitive options available.

  Loan details:
  - Outstanding balance: approximately [amount]
  - Current interest rate: [rate]%
  - Remaining term: [months] months

  Could you please provide a quote for refinancing this loan? I'm looking for the lowest rate available for my situation.

  Kind regards,
  [Your Name]`,
    },
    'offset-mortgage': {
      subject: 'Inquiry about offset mortgage facility',
      body: `Dear [Bank Name] Home Loans Team,

  I'm interested in learning more about offset mortgage facilities. I currently have both a mortgage and savings with [your bank / another bank], and I understand an offset account could reduce the interest I pay on my mortgage.

  Could you please explain:
  1. How your offset facility works?
  2. What are the fees or conditions?
  3. How much could I save based on a mortgage of [amount] with savings of [amount]?

  Kind regards,
  [Your Name]`,
    },
  }
  ```
- **VALIDATE**: `npx tsc --noEmit`

### Task 3: UPDATE `lib/cost-of-living/types.ts` — Add emailTemplate field

- **ACTION**: Add optional `emailTemplate` to `SavingsIdea`
- **IMPLEMENT**: Add to the interface:
  ```typescript
  emailSubject?: string
  emailBody?: string
  ```
- **VALIDATE**: `npx tsc --noEmit`

### Task 4: UPDATE `lib/cost-of-living/ideas.ts` — Link email templates

- **ACTION**: Add `emailSubject` and `emailBody` fields to the 4 email-type ideas
- **IMPLEMENT**: Import `EMAIL_TEMPLATES` and spread the template data onto each email-type idea
- **VALIDATE**: `npx tsc --noEmit`

### Task 5: CREATE `components/savings/email-draft-sheet.tsx`

- **ACTION**: Sheet modal showing the pre-drafted email with copy-to-clipboard
- **IMPLEMENT**:
  - Uses `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` from `@/components/ui/sheet`
  - Props: `{ open, onOpenChange, subject, body }`
  - Shows subject in a read-only input-like display
  - Shows body in a `<pre>` block with `whitespace-pre-wrap`
  - "Copy to clipboard" button that copies `Subject: {subject}\n\n{body}` using `navigator.clipboard.writeText()`
  - Success feedback via a brief state toggle ("Copied!")
  - Note at bottom: "Personalise the [bracketed] fields before sending"
- **VALIDATE**: `npx tsc --noEmit`

### Task 6: UPDATE `components/savings/idea-card.tsx` — Make email action functional

- **ACTION**: Replace the disabled email button with one that opens the EmailDraftSheet
- **IMPLEMENT**:
  - Add state: `emailSheetOpen`
  - When `idea.actionType === 'email'` and `idea.emailBody`:
    - Render a functional `Button` that sets `emailSheetOpen = true`
    - Render `<EmailDraftSheet>` with the idea's subject/body
  - If no `emailBody`, keep the disabled button (graceful fallback)
- **VALIDATE**: `npx tsc --noEmit`

### Task 7: CREATE `components/household/total-cost-view.tsx`

- **ACTION**: Total household running cost section with donut chart
- **IMPLEMENT**:
  - Imports `CATEGORY_BENCHMARKS` from `@/lib/household-model`
  - Imports `PieChart, Pie, Cell, ResponsiveContainer` from `recharts`
  - Imports `CHART_COLORS` from `@/lib/chart-colors`
  - Accepts `energyAnnualCost: number` from the TCE result to override the energy benchmark
  - Computes total: sum of all category `annualAverage` values, replacing `energy` with the user's actual TCE `currentCosts.total`
  - Renders: headline number (total annual), "X% of income" subtitle (using NZ median income ~$70k), donut chart with category breakdown, list of categories with amounts
  - The energy slice should be highlighted (using `--primary` / Ultra Orange) to visually connect back to the TCE section above
- **PATTERN**: Mirror `components/dashboard/spending-donut.tsx` for the Recharts donut structure
- **VALIDATE**: `npx tsc --noEmit`

### Task 8: CREATE `components/share/savings-summary-card.tsx`

- **ACTION**: Branded shareable savings summary card with download-as-image
- **IMPLEMENT**:
  - A visually self-contained card (ref-able div for `html-to-image`)
  - Content: Genesis branding, headline "This household could save {annualSavings}/year", top 3 roadmap items, total current vs electrified, date stamp
  - "Download as image" button using `html-to-image`:
    ```typescript
    import { toPng } from 'html-to-image'

    async function handleShare() {
      if (!cardRef.current) return
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'genesis-energy-savings.png'
      link.href = dataUrl
      link.click()
    }
    ```
  - "Copy link" button (copies current URL to clipboard — for future deep-linking)
  - Props: `{ tceResult: TCEResult }`
- **GOTCHA**: `html-to-image` needs the target div to be visible in the DOM (not display:none). Use `position: absolute; left: -9999px` if the card needs to be off-screen.
- **VALIDATE**: `npx tsc --noEmit`

### Task 9: UPDATE `app/page.tsx` — Add household cost view, share card, polish

- **ACTION**: Wire everything together in the page
- **IMPLEMENT**:
  1. Add `<TotalCostView energyAnnualCost={tceResult.currentCosts.total} />` as a new section between `#results` and `#savings`, or as an expandable part of `#results`
  2. Add `<SavingsSummaryCard tceResult={tceResult} />` at the bottom of `#results` section
  3. Add smooth scroll offset: `scroll-mt-20` on each section `id` to account for sticky header
  4. Add a section transition: subtle `border-t` + `py-16` already present — just verify consistency
  5. Import all new components

- **SECTION ORDER after update**:
  ```
  #home → #calculator → #results → #household-costs → #savings → Dashboard
  ```

- **GOTCHA**: The `TotalCostView` component needs the energy annual cost from TCE to override the benchmark. Pass `tceResult.currentCosts.total` directly.
- **VALIDATE**: `npx tsc --noEmit && npm run build`

### Task 10: FINAL validation and build

- **ACTION**: Full build + visual check
- **IMPLEMENT**:
  1. `npx tsc --noEmit` — 0 errors
  2. `npm run build` — succeeds
  3. Dev server visual check:
     - Total Household Cost section renders with donut
     - Email idea cards open Sheet with draft content
     - Copy-to-clipboard works on email drafts
     - Savings summary card renders and downloads as PNG
     - All sections scroll smoothly
- **VALIDATE**: All pass

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
Visual checks: household cost donut, email drafts, share card download

---

## Acceptance Criteria

- [ ] Total Household Cost section shows combined annual cost with donut chart
- [ ] Energy slice in donut uses the user's actual TCE cost (not a generic benchmark)
- [ ] 4 email-type idea cards open a Sheet with pre-drafted email content
- [ ] Emails have copy-to-clipboard with success feedback
- [ ] Savings summary card renders with Genesis branding and key numbers
- [ ] Download as image produces a PNG file
- [ ] All sections have consistent spacing and scroll behaviour
- [ ] `npx tsc --noEmit` and `npm run build` pass

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| html-to-image fails in Next.js SSR | Low | Medium | Component is `'use client'` and only runs in browser. `toPng` is called in a click handler, not during render. |
| Donut chart conflicts with existing household dashboard donut | Low | Low | Separate component in `components/household/`, not reusing the dashboard's `SpendingDonut` directly — imports Recharts directly. |
| Email templates feel generic | Medium | Low | Templates have [bracketed] placeholder fields. A note instructs users to personalise before sending. Good enough for POC. |

---

## Notes

- **Household cost data source**: Using `CATEGORY_BENCHMARKS` from `lib/household-model/constants.ts` for all non-energy categories. The energy figure is the user's actual calculated TCE amount. This creates a "personalised energy + benchmark everything else" hybrid — honest about what's calculated vs estimated.
- **NZ median income**: Using ~$70,000 (Stats NZ median individual income 2024) for the "% of income" calculation. This is an approximation — the existing household dashboard uses `profile.annualIncome` but the TCE page doesn't have that field. A fixed median is acceptable for POC.
- **html-to-image vs html2canvas**: `html-to-image` is lighter (no Canvas polyfill), more modern, and handles SVG (Recharts charts) better. Preferred for Next.js.
