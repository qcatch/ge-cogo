'use client'

import { IDEA_CATEGORIES, getIdeasByCategory } from '@/lib/cost-of-living'
import type { IdeaCategory } from '@/lib/cost-of-living'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { IdeaCard } from './idea-card'
import {
  Utensils, ShoppingCart, Wifi, Home, Car, Heart, Shield, Landmark,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  'Utensils': Utensils,
  'ShoppingCart': ShoppingCart,
  'Wifi': Wifi,
  'Home': Home,
  'Plane': Car, // Plane not in lucide imports — use Car as fallback
  'Car': Car,
  'Heart': Heart,
  'Shield': Shield,
  'Landmark': Landmark,
  'Dumbbell': Heart, // fallback
  'PawPrint': Heart, // fallback
}

export function SavingsPlaybook() {
  return (
    <Tabs defaultValue="dining" className="w-full">
      <TabsList className="w-full flex-wrap h-auto gap-1 bg-transparent justify-start p-0">
        {IDEA_CATEGORIES.map(cat => {
          const Icon = ICON_MAP[cat.icon] ?? Home
          const ideas = getIdeasByCategory(cat.category)
          return (
            <TabsTrigger
              key={cat.category}
              value={cat.category}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-3 py-1.5 text-xs"
            >
              <Icon className="h-3.5 w-3.5 mr-1.5" />
              {cat.label}
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0 h-4">{ideas.length}</Badge>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {IDEA_CATEGORIES.map(cat => {
        const ideas = getIdeasByCategory(cat.category)
        return (
          <TabsContent key={cat.category} value={cat.category} className="mt-6">
            <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map(idea => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
