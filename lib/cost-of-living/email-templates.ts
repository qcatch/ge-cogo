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
