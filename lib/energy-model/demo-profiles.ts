/**
 * Pre-built NZ household energy profiles for stakeholder demonstrations.
 *
 * Each profile represents a realistic NZ household with specific
 * energy infrastructure that produces compelling TCE comparisons.
 *
 * Validation thresholds (from spec):
 * - Auckland Family: currentTotal > $10,000
 * - Wellington Couple: currentTotal > $5,000
 * - Christchurch Homeowner: currentTotal > $7,000
 */

import type { HouseholdInput } from './types'

export interface TCEDemoProfile {
  label: string
  description: string
  input: HouseholdInput
}

export const TCE_DEMO_PROFILES: Record<string, TCEDemoProfile> = {
  'auckland-family': {
    label: 'Auckland Family',
    description: 'Family of 4 in Remuera — gas heating, gas hot water, gas cooktop, 2 petrol cars',
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

  'wellington-couple': {
    label: 'Wellington Couple',
    description: 'Couple in Karori — electric resistive heating, electric hot water, electric cooktop, 1 petrol car',
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
    label: 'Christchurch Homeowner',
    description: 'Family of 3 in Riccarton — heat pump, gas hot water, gas cooktop, 1 petrol + 1 hybrid',
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
      includeSolar: false,
    },
  },
}
