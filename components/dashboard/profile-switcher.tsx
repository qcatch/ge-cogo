'use client'

import type { HouseholdSpending } from '@/lib/household-model/types'
import { formatCurrency } from '@/lib/format'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, Users, Home, Heart } from 'lucide-react'

const PROFILE_ICONS: Record<string, React.ElementType> = {
  'single-renter': User,
  'couple-mortgage': Users,
  'family-mortgage': Home,
  'retired-homeowner': Heart,
}

interface ProfileSwitcherProps {
  profiles: Record<string, HouseholdSpending>
  activeKey: string
  onSelect: (key: string) => void
}

export function ProfileSwitcher({ profiles, activeKey, onSelect }: ProfileSwitcherProps) {
  return (
    <Select value={activeKey} onValueChange={onSelect}>
      <SelectTrigger className="w-full sm:w-[320px]">
        <SelectValue placeholder="Select a household" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(profiles).map(([key, spending]) => {
          const Icon = PROFILE_ICONS[spending.profile.householdType] ?? User
          return (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm">{spending.profile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(spending.totalMonthly)}/mo
                  </span>
                </div>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
