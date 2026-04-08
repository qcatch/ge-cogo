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
  savingsEstimate: string
  description: string
  actionType: 'link' | 'habit' | 'email' | 'partner'
  actionLabel: string
  actionUrl?: string
  partnerName?: string
  emailSubject?: string
  emailBody?: string
}

export interface IdeaCategoryInfo {
  category: IdeaCategory
  label: string
  icon: string
  description: string
}
