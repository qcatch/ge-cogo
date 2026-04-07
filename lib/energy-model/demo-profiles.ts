import type { HouseholdInput } from './types'

/**
 * Pre-built NZ household profiles for stakeholder demonstrations.
 * Each profile represents a realistic household configuration.
 */
export const DEMO_PROFILES: Record<string, { name: string; description: string; input: HouseholdInput }> = {
  'auckland-family': {
    name: 'Auckland Family',
    description: '4-person family in Grey Lynn with gas appliances and two petrol cars',
    input: {
      region: 'auckland',
      occupants: 4,
      heating: 'gas',
      waterHeating: 'gas',
      cooktop: 'gas',
      vehicles: [
        { type: 'petrol', usage: 'medium' },
        { type: 'petrol', usage: 'low' },
      ],
      includeSolar: false,
    },
  },

  'wellington-renter': {
    name: 'Wellington Renter',
    description: 'Young couple renting in Newtown with electric appliances and one car',
    input: {
      region: 'wellington',
      occupants: 2,
      heating: 'electric-resistive',
      waterHeating: 'electric-resistive',
      cooktop: 'electric-resistive',
      vehicles: [
        { type: 'petrol', usage: 'low' },
      ],
      includeSolar: false,
    },
  },

  'christchurch-homeowner': {
    name: 'Christchurch Homeowner',
    description: 'Family of 3 with heat pump, gas hot water, and considering solar',
    input: {
      region: 'canterbury',
      occupants: 3,
      heating: 'heat-pump',
      waterHeating: 'gas',
      cooktop: 'gas',
      vehicles: [
        { type: 'petrol', usage: 'medium' },
        { type: 'hybrid', usage: 'low' },
      ],
      includeSolar: true,
    },
  },
}
