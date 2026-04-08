/**
 * Cost of Living Savings Ideas — Editorial Content
 *
 * All ideas sourced from the Genesis Cost of Living Assistant Brief v2.
 * Each idea has: title, savings estimate, description, and an action type.
 */

import type { IdeaCategory, SavingsIdea, IdeaCategoryInfo } from './types'
import { EMAIL_TEMPLATES } from './email-templates'

export const IDEA_CATEGORIES: IdeaCategoryInfo[] = [
  { category: 'dining', label: 'Dining & Social', icon: 'Utensils', description: 'Save on eating out and social spending' },
  { category: 'shopping', label: 'Shopping', icon: 'ShoppingCart', description: 'Smarter retail and online purchases' },
  { category: 'subscriptions', label: 'Subscriptions', icon: 'Wifi', description: 'Optimise streaming and digital services' },
  { category: 'home', label: 'Home & Mortgage', icon: 'Home', description: 'Reduce housing, grocery, and insurance costs' },
  { category: 'travel', label: 'Travel', icon: 'Plane', description: 'Fly and stay for less' },
  { category: 'family', label: 'Family', icon: 'Heart', description: 'Save on kids, activities, and family life' },
  { category: 'transport', label: 'Transport', icon: 'Car', description: 'Cut fuel and vehicle costs' },
  { category: 'insurance', label: 'Insurance', icon: 'Shield', description: 'Review and reduce premiums' },
  { category: 'finance', label: 'Finance', icon: 'Landmark', description: 'Optimise savings, investments, and banking' },
  { category: 'fitness', label: 'Fitness', icon: 'Dumbbell', description: 'Stay fit without the premium price tag' },
  { category: 'pets', label: 'Pets', icon: 'PawPrint', description: 'Care for pets without overspending' },
]

export const SAVINGS_IDEAS: SavingsIdea[] = [
  // ─── Dining & Social ────────────────────────────────────────────
  { id: 'first-table', category: 'dining', title: 'Book First Table for 50% off', savingsEstimate: '$500–$1,500/yr', description: 'First Table lets you book the first sitting at restaurants for 50% off the food bill. One of the best dining hacks in NZ.', actionType: 'link', actionLabel: 'Try First Table', actionUrl: 'https://www.firsttable.co.nz' },
  { id: 'insert-card', category: 'dining', title: 'Insert your card instead of tapping', savingsEstimate: '$50–$150/yr', description: 'Inserting your card skips the 0.5-1.5% contactless surcharge many merchants pass on. Small per transaction, meaningful over a year.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'byob', category: 'dining', title: 'Choose BYO restaurants', savingsEstimate: '$300–$800/yr', description: 'Wine markup at restaurants is typically 3-4x retail. BYO-friendly spots let you enjoy great food without the markup.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'happy-hour', category: 'dining', title: 'Check happy hour apps before going out', savingsEstimate: '$200–$500/yr', description: 'Five minutes of checking before you head out can save real money on drinks and dining.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'lunch-menus', category: 'dining', title: 'Lunch menus instead of dinner', savingsEstimate: '$300–$600/yr', description: 'Same kitchen, significantly lower prices. Shift dinner reservations to a long lunch where the occasion allows.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'coffee-loyalty', category: 'dining', title: 'Use coffee loyalty cards properly', savingsEstimate: '$100–$300/yr', description: 'Consolidate to one or two cafes and work the loyalty card. Most cards give a free coffee every 8-10 purchases.', actionType: 'habit', actionLabel: 'Habit change' },

  // ─── Shopping ───────────────────────────────────────────────────
  { id: 'abandoned-cart', category: 'shopping', title: 'The abandoned cart trick', savingsEstimate: '10–15% per purchase', description: 'Add items to your cart, leave without buying, wait 24-48 hours. Most retailers send a discount code of 10-15% to recover the sale.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'price-trackers', category: 'shopping', title: 'Install price tracker extensions', savingsEstimate: '$200–$500/yr', description: 'Browser extensions like Honey auto-apply discount codes and track price history passively on every purchase.', actionType: 'link', actionLabel: 'Get Honey', actionUrl: 'https://www.joinhoney.com' },
  { id: 'signup-discount', category: 'shopping', title: 'Collect sign-up discounts', savingsEstimate: '10–20% first order', description: 'Use a dedicated email for retail signups — collect the first-order discount (usually 10-20%), then unsubscribe.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'end-of-season', category: 'shopping', title: 'Buy end-of-season', savingsEstimate: '30–60% off', description: 'Clothing and outdoor gear are heavily discounted at season end. Buy next winter\'s coat in spring.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'trade-me', category: 'shopping', title: 'Trade Me for furniture and appliances', savingsEstimate: '50–80% off retail', description: 'High-quality second-hand items at a fraction of retail. Especially good for furniture, electronics, and kids\' gear.', actionType: 'link', actionLabel: 'Browse Trade Me', actionUrl: 'https://www.trademe.co.nz' },
  { id: 'bulk-buying', category: 'shopping', title: 'Buy non-perishables in bulk', savingsEstimate: '$300–$600/yr', description: 'Toilet paper, cleaning products, tinned food — significantly cheaper per unit when bought in bulk.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'cashback-cards', category: 'shopping', title: 'Use a cashback credit card', savingsEstimate: '$200–$600/yr', description: 'If paying off the balance in full each month, a cashback card earns meaningfully on every purchase.', actionType: 'link', actionLabel: 'Compare cards on Canstar', actionUrl: 'https://www.canstar.co.nz/credit-cards/' },

  // ─── Subscriptions ──────────────────────────────────────────────
  { id: 'pulse-streaming', category: 'subscriptions', title: 'Pulse streaming services on/off', savingsEstimate: '$300–$500/yr', description: 'Watch one service, pause it, activate the next. Most make pausing frictionless — there\'s no need to pay for all of them simultaneously.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'cancel-to-retain', category: 'subscriptions', title: 'Ask to cancel — then don\'t', savingsEstimate: '$50–$200/yr per service', description: 'Disney+, Spotify, and many others offer a retention discount when you initiate cancellation. Works 60-70% of the time.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'subscription-audit', category: 'subscriptions', title: 'Audit your bank statement', savingsEstimate: '$200–$500/yr', description: 'Check for recurring charges under $25. Most people are paying for 2-4 services they\'ve stopped using.', actionType: 'habit', actionLabel: 'Review your statements' },
  { id: 'family-plans', category: 'subscriptions', title: 'Switch to family/shared plans', savingsEstimate: '$200–$400/yr', description: 'Spotify Family, Apple One, YouTube Premium — split across 4 people, these cost under $5/person/month.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'annual-billing', category: 'subscriptions', title: 'Switch to annual billing', savingsEstimate: '15–20% saving', description: 'Annual billing typically saves 15-20% versus monthly. Check each active subscription for an annual option.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'audit-premium', category: 'subscriptions', title: 'Audit premium features', savingsEstimate: '$100–$300/yr', description: 'Are you actually using the premium features you\'re paying for? Many free tiers are more than enough.', actionType: 'habit', actionLabel: 'Review your subscriptions' },

  // ─── Home & Mortgage ────────────────────────────────────────────
  { id: 'call-bank', category: 'home', title: 'Call your bank before your rate rolls', savingsEstimate: '$1,000–$5,000/yr', description: 'Call 60-90 days before your fixed term expires. Banks prefer to retain customers and have room to move on rate.', actionType: 'email', actionLabel: 'Draft email to bank', emailSubject: EMAIL_TEMPLATES['call-bank'].subject, emailBody: EMAIL_TEMPLATES['call-bank'].body },
  { id: 'refinance-cashback', category: 'home', title: 'Ask for cashback when refinancing', savingsEstimate: '$1,000–$3,000 one-off', description: 'Banks regularly offer $1,000-$3,000 cashback for refinancing. Rarely advertised — you have to ask.', actionType: 'email', actionLabel: 'Draft refinancing inquiry', emailSubject: EMAIL_TEMPLATES['refinance-cashback'].subject, emailBody: EMAIL_TEMPLATES['refinance-cashback'].body },
  { id: 'online-grocery', category: 'home', title: 'Switch to online grocery orders', savingsEstimate: '$1,000–$2,000/yr', description: 'In-store shopping leads to 20-40% more spend due to impulse purchases. Online ordering keeps you disciplined.', actionType: 'link', actionLabel: 'Try Countdown online', actionUrl: 'https://www.countdown.co.nz' },
  { id: 'weekly-shop', category: 'home', title: 'Consolidate to one shop per week', savingsEstimate: '$500–$1,000/yr', description: 'Every extra trip means more unplanned purchases. Plan one big weekly shop and stick to the list.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'meal-planning', category: 'home', title: 'Meal plan before shopping', savingsEstimate: '$500–$1,500/yr', description: 'Eliminates the single biggest source of grocery waste. Plan meals for the week, buy only what you need.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'own-brand', category: 'home', title: 'Switch to own-brand staples', savingsEstimate: '$500–$1,000/yr', description: '20-40% cheaper with no meaningful quality difference for commodities like flour, rice, pasta, and cleaning products.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'home-insurance-review', category: 'home', title: 'Review home insurance annually', savingsEstimate: '$200–$600/yr', description: 'Shopping the market once a year typically saves hundreds. Use comparison sites to find better deals.', actionType: 'link', actionLabel: 'Compare on Canstar', actionUrl: 'https://www.canstar.co.nz/home-insurance/' },
  { id: 'hellofresh', category: 'home', title: 'Try HelloFresh for meal kit savings', savingsEstimate: '$50–$80 off first boxes', description: 'Meal kits can reduce food waste and simplify planning. HelloFresh offers significant first-order discounts.', actionType: 'partner', actionLabel: 'Get HelloFresh offer', partnerName: 'HelloFresh' },
  { id: 'myfoodbag', category: 'home', title: 'My Food Bag / Bargain Box deals', savingsEstimate: '$40–$60 off first order', description: 'NZ-owned meal kit service with a budget-friendly Bargain Box option starting from ~$8/plate.', actionType: 'partner', actionLabel: 'Get My Food Bag offer', partnerName: 'My Food Bag' },

  // ─── Travel ─────────────────────────────────────────────────────
  { id: 'flights-date-grid', category: 'travel', title: 'Use Google Flights date grid', savingsEstimate: '$100–$400 per trip', description: 'Shows prices across an entire month at once. Shifting by one or two days routinely saves $100-400.', actionType: 'link', actionLabel: 'Open Google Flights', actionUrl: 'https://www.google.com/flights' },
  { id: 'cc-travel-insurance', category: 'travel', title: 'Check credit card travel insurance', savingsEstimate: '$100–$300 per trip', description: 'Many premium credit cards include travel insurance as a cardholder benefit. Check before buying separately.', actionType: 'habit', actionLabel: 'Check your card benefits' },
  { id: 'book-direct', category: 'travel', title: 'Book accommodation direct', savingsEstimate: '5–15% saving', description: 'Find it on Booking.com, then contact the host directly. They save the platform commission and often pass some to you.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'airport-parking', category: 'travel', title: 'Use airport parking alternatives', savingsEstimate: '$50–$200 per trip', description: 'Third-party sites like Looking4Parking aggregate options at a fraction of on-site pricing.', actionType: 'link', actionLabel: 'Compare parking', actionUrl: 'https://www.looking4parking.co.nz' },
  { id: 'shoulder-season', category: 'travel', title: 'Travel in shoulder season', savingsEstimate: '20–40% saving', description: 'Almost identical experience at significantly lower prices. March-May and September-November are ideal.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'travel-rewards', category: 'travel', title: 'Use travel rewards credit cards', savingsEstimate: '$500–$2,000/yr in points', description: 'Used for everyday spend, generates points that pay for flights and accommodation over time.', actionType: 'link', actionLabel: 'Compare rewards cards', actionUrl: 'https://www.canstar.co.nz/credit-cards/' },

  // ─── Family ─────────────────────────────────────────────────────
  { id: 'toy-libraries', category: 'family', title: 'Join a toy library', savingsEstimate: '$200–$500/yr', description: 'Borrow toys instead of buying — kids lose interest quickly. Most NZ communities have one, membership is $20-50/year.', actionType: 'habit', actionLabel: 'Find your local toy library' },
  { id: 'kids-clothing', category: 'family', title: 'Buy end-of-season kids\' clothing', savingsEstimate: '$200–$400/yr', description: 'Kids grow fast. Buy the next size up at end-of-season sales for 50-70% off.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'school-uniforms', category: 'family', title: 'Second-hand school uniforms', savingsEstimate: '$100–$300/yr', description: 'Most schools have a second-hand uniform shop or Facebook group. Uniforms are often barely worn.', actionType: 'habit', actionLabel: 'Check your school\'s shop' },
  { id: 'council-programmes', category: 'family', title: 'Council holiday programmes', savingsEstimate: '$500–$1,500/yr', description: 'Council-run holiday programmes are significantly cheaper than private options. Book early — they fill fast.', actionType: 'habit', actionLabel: 'Check your council website' },
  { id: 'library-membership', category: 'family', title: 'Use your library membership', savingsEstimate: '$200–$600/yr', description: 'Free books, DVDs, magazines, and often free wifi, events, and 3D printing. NZ libraries are massively underused.', actionType: 'habit', actionLabel: 'Visit your local library' },

  // ─── Transport ──────────────────────────────────────────────────
  { id: 'car-loan-refi', category: 'transport', title: 'Refinance your car loan', savingsEstimate: '$500–$2,000/yr', description: 'If you\'re paying more than 8% on a car loan, you can likely refinance at a lower rate. Compare options.', actionType: 'email', actionLabel: 'Draft refinancing inquiry', emailSubject: EMAIL_TEMPLATES['car-loan-refi'].subject, emailBody: EMAIL_TEMPLATES['car-loan-refi'].body },
  { id: 'tyre-pressure', category: 'transport', title: 'Check tyre pressure monthly', savingsEstimate: '$100–$300/yr', description: 'Under-inflated tyres increase fuel consumption by 3-5%. A 2-minute check at the petrol station saves real money.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'gaspy', category: 'transport', title: 'Use Gaspy for fuel prices', savingsEstimate: '$150–$400/yr', description: 'Gaspy shows real-time prices at nearby stations. The gap between cheapest and most expensive can be 20-30c/litre.', actionType: 'link', actionLabel: 'Get Gaspy app', actionUrl: 'https://www.gaspy.nz' },
  { id: 'park-and-ride', category: 'transport', title: 'Use park and ride', savingsEstimate: '$1,000–$3,000/yr', description: 'Park at a suburban station and take the train/bus into the city. Saves fuel, parking, and reduces stress.', actionType: 'habit', actionLabel: 'Find park and ride options' },
  { id: 'carpooling', category: 'transport', title: 'Carpool to work', savingsEstimate: '$500–$1,500/yr', description: 'Sharing the commute with one colleague halves your fuel cost. Two colleagues and it\'s a third.', actionType: 'habit', actionLabel: 'Habit change' },

  // ─── Insurance ──────────────────────────────────────────────────
  { id: 'annual-review', category: 'insurance', title: 'Review all policies annually', savingsEstimate: '$500–$2,000/yr', description: 'The average NZ quote gap between insurers is $610/yr for car, $894 for home, $462 for contents.', actionType: 'link', actionLabel: 'Compare on Canstar', actionUrl: 'https://www.canstar.co.nz/home-insurance/' },
  { id: 'increase-excess', category: 'insurance', title: 'Increase your excess', savingsEstimate: '$200–$500/yr', description: 'Raising your excess from $250 to $500 or $1,000 reduces premiums. Only do this if you have savings to cover it.', actionType: 'habit', actionLabel: 'Call your insurer' },
  { id: 'bundle-policies', category: 'insurance', title: 'Bundle your policies', savingsEstimate: '$100–$400/yr', description: 'Many insurers offer multi-policy discounts. Having car, home, and contents with one provider saves 10-15%.', actionType: 'habit', actionLabel: 'Ask about bundling' },
  { id: 'kiwisaver-life', category: 'insurance', title: 'Check KiwiSaver life cover', savingsEstimate: '$200–$600/yr', description: 'Some KiwiSaver providers include basic life cover. Check before paying for a separate life insurance policy.', actionType: 'habit', actionLabel: 'Check your KiwiSaver provider' },

  // ─── Finance ────────────────────────────────────────────────────
  { id: 'hi-savings', category: 'finance', title: 'High-interest savings account', savingsEstimate: '$200–$800/yr', description: 'Many Kiwis leave savings in low-interest accounts. Moving to a high-interest online saver earns 4-5% vs 0.5%.', actionType: 'link', actionLabel: 'Compare on MoneyHub', actionUrl: 'https://www.moneyhub.co.nz/best-savings-accounts.html' },
  { id: 'offset-mortgage', category: 'finance', title: 'Use an offset mortgage', savingsEstimate: '$500–$3,000/yr', description: 'An offset account links your savings to your mortgage — your savings balance reduces the interest you pay.', actionType: 'email', actionLabel: 'Ask your bank about offset', emailSubject: EMAIL_TEMPLATES['offset-mortgage'].subject, emailBody: EMAIL_TEMPLATES['offset-mortgage'].body },
  { id: 'automate-savings', category: 'finance', title: 'Automate savings on payday', savingsEstimate: 'Builds wealth over time', description: 'Set up an automatic transfer to savings on payday. You can\'t spend what you don\'t see in your daily account.', actionType: 'habit', actionLabel: 'Set up auto-transfer' },
  { id: 'kiwisaver-review', category: 'finance', title: 'Review your KiwiSaver contribution', savingsEstimate: 'Varies significantly', description: 'Make sure you\'re contributing enough to get the full employer match. Review your fund type based on your age and goals.', actionType: 'habit', actionLabel: 'Check your KiwiSaver' },
  { id: 'sharesies', category: 'finance', title: 'Start micro-investing', savingsEstimate: 'Builds wealth over time', description: 'Platforms like Sharesies and Kernel let you invest small amounts regularly. Great for building savings habits.', actionType: 'partner', actionLabel: 'Try Sharesies', partnerName: 'Sharesies' },

  // ─── Fitness ────────────────────────────────────────────────────
  { id: 'community-gyms', category: 'fitness', title: 'Use community centre gyms', savingsEstimate: '$500–$1,000/yr', description: 'Council-run gyms are typically $5-10 per visit or $30-50/month — a fraction of commercial gym memberships.', actionType: 'habit', actionLabel: 'Find your local community gym' },
  { id: 'gym-negotiation', category: 'fitness', title: 'Negotiate your gym membership', savingsEstimate: '$200–$500/yr', description: 'Gyms almost always have room to negotiate, especially in January and at contract renewal. Ask for a lower rate.', actionType: 'habit', actionLabel: 'Call your gym' },
  { id: 'outdoor-training', category: 'fitness', title: 'Outdoor and bodyweight training', savingsEstimate: '$600–$1,200/yr', description: 'Running, park workouts, and home bodyweight exercises cost nothing. YouTube has world-class fitness content for free.', actionType: 'habit', actionLabel: 'Habit change' },
  { id: 'health-app-audit', category: 'fitness', title: 'Audit health app subscriptions', savingsEstimate: '$100–$300/yr', description: 'Peloton, Strava Premium, MyFitnessPal Pro — are you using the paid features? Most free tiers are sufficient.', actionType: 'habit', actionLabel: 'Review your apps' },

  // ─── Pets ───────────────────────────────────────────────────────
  { id: 'pet-insurance-compare', category: 'pets', title: 'Compare pet insurance annually', savingsEstimate: '$200–$500/yr', description: 'Pet insurance premiums vary significantly between providers. Compare annually — don\'t just accept the renewal price.', actionType: 'link', actionLabel: 'Compare on Canstar', actionUrl: 'https://www.canstar.co.nz/pet-insurance/' },
  { id: 'preventative-vet', category: 'pets', title: 'Invest in preventative vet care', savingsEstimate: '$300–$1,000/yr', description: 'Regular check-ups and vaccinations prevent expensive emergency visits. Prevention is always cheaper than cure.', actionType: 'habit', actionLabel: 'Book annual check-up' },
  { id: 'bulk-pet-food', category: 'pets', title: 'Buy pet food in bulk', savingsEstimate: '$200–$400/yr', description: 'Bulk bags of quality pet food are 30-40% cheaper per kg than small bags. Store in airtight containers.', actionType: 'partner', actionLabel: 'Shop Animates', partnerName: 'Animates' },
  { id: 'diy-grooming', category: 'pets', title: 'Learn basic DIY grooming', savingsEstimate: '$200–$600/yr', description: 'Professional grooming for a medium dog costs $60-100 per visit. Basic brushing, bathing, and nail trimming can be done at home.', actionType: 'habit', actionLabel: 'Watch grooming tutorials' },
]

export function getIdeasByCategory(category: IdeaCategory): SavingsIdea[] {
  return SAVINGS_IDEAS.filter(idea => idea.category === category)
}
