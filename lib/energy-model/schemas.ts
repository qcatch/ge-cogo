/**
 * Zod validation schemas for the TCE calculator form.
 *
 * Values must exactly match the string literal unions in types.ts.
 */

import { z } from 'zod'

export const energyRegions = [
  'northland', 'auckland', 'waikato', 'bay-of-plenty',
  'wellington', 'canterbury', 'otago', 'southland',
] as const

const vehicleInputSchema = z.object({
  type: z.enum(['petrol', 'diesel', 'electric', 'phev', 'hybrid', 'none']),
  usage: z.enum(['low', 'medium', 'high']),
})

export const householdInputSchema = z.object({
  region: z.enum(energyRegions),
  occupants: z.number().min(1).max(6),
  heating: z.enum(['gas', 'lpg', 'wood', 'electric-resistive', 'heat-pump']),
  waterHeating: z.enum(['gas', 'lpg', 'electric-resistive', 'heat-pump', 'solar']),
  cooktop: z.enum(['gas', 'lpg', 'electric-resistive', 'induction']),
  vehicles: z.array(vehicleInputSchema),
  includeSolar: z.boolean().optional(),
})

export type HouseholdInputForm = z.infer<typeof householdInputSchema>
