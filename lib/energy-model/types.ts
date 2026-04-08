/**
 * TCE (Total Cost of Energy) Type Definitions
 *
 * Types for the energy cost calculation engine that aggregates
 * electricity, gas, and petrol costs into a single household
 * energy cost figure and compares against a fully electrified scenario.
 */

/** NZ regions with Rewiring Aotearoa heating multiplier data */
export type EnergyRegion =
  | 'northland'
  | 'auckland'
  | 'waikato'
  | 'bay-of-plenty'
  | 'wellington'
  | 'canterbury'
  | 'otago'
  | 'southland'

export type HeatingType = 'gas' | 'lpg' | 'wood' | 'electric-resistive' | 'heat-pump'
export type WaterHeatingType = 'gas' | 'lpg' | 'electric-resistive' | 'heat-pump' | 'solar'
export type CooktopType = 'gas' | 'lpg' | 'electric-resistive' | 'induction'
export type VehicleType = 'petrol' | 'diesel' | 'electric' | 'phev' | 'hybrid' | 'none'
export type VehicleUsage = 'low' | 'medium' | 'high'

export interface VehicleInput {
  type: VehicleType
  usage: VehicleUsage
}

/** Complete household energy profile — input to the TCE calculator */
export interface HouseholdInput {
  region: EnergyRegion
  occupants: number
  heating: HeatingType
  waterHeating: WaterHeatingType
  cooktop: CooktopType
  vehicles: VehicleInput[]
  /** Whether to include solar in the electrified scenario */
  includeSolar?: boolean
}

/** Annual energy consumption broken down by category (kWh/year) */
export interface ConsumptionBreakdown {
  heatingKwhPerYear: number
  waterHeatingKwhPerYear: number
  cooktopKwhPerYear: number
  baseAppliancesKwhPerYear: number
  vehiclesKwhPerYear: number
  totalKwhPerYear: number
}

/** Annual energy costs broken down by fuel type (NZD/year) */
export interface EnergyBreakdown {
  electricity: number
  gas: number
  petrol: number
  vehicleRuc: number
  total: number
}

/** A single electrification switch recommendation */
export interface SwitchRecommendation {
  appliance: string
  description: string
  currentAnnualCost: number
  electrifiedAnnualCost: number
  annualSaving: number
  upfrontCost: number
  paybackYears: number
  priority: number
}

/** CO2 emissions comparison */
export interface EmissionsResult {
  currentKgCO2e: number
  electrifiedKgCO2e: number
  reductionKgCO2e: number
  reductionPercent: number
}

/** Complete TCE calculation output */
export interface TCEResult {
  input: HouseholdInput
  currentCosts: EnergyBreakdown
  electrifiedCosts: EnergyBreakdown
  annualSavings: number
  monthlySavings: number
  savingsPercent: number
  roadmap: SwitchRecommendation[]
  emissions: EmissionsResult
  consumption: ConsumptionBreakdown
}

/** Which electrification investments the user has toggled on */
export interface ElectrificationToggles {
  heating: boolean
  waterHeating: boolean
  cooktop: boolean
  vehicles: boolean
  solar: boolean
}
