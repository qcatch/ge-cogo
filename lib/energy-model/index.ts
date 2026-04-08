/**
 * Genesis Cost of Living Assistant — TCE Calculation Engine
 *
 * Public API for calculating a household's Total Cost of Energy
 * and comparing against a fully electrified scenario.
 *
 * Usage:
 *   import { calculateTCE, TCE_DEMO_PROFILES } from '@/lib/energy-model'
 *   const result = calculateTCE(TCE_DEMO_PROFILES['auckland-family'].input)
 */

import type { HouseholdInput, TCEResult } from './types'
import { calculateTotalConsumption } from './consumption'
import { calculateCurrentCosts, calculateElectrifiedCosts, calculateSavings } from './costs'
import { generateRoadmap } from './roadmap'
import {
  EMISSIONS_FACTORS,
  HEATING_CONSUMPTION,
  WATER_HEATING_CONSUMPTION,
  COOKTOP_CONSUMPTION,
  VEHICLE_CONSUMPTION_DAILY,
  VEHICLE_WEEKLY_KM,
} from './constants'

function calculateEmissions(input: HouseholdInput, totalElectrifiedKwh: number): {
  currentKgCO2e: number
  electrifiedKgCO2e: number
} {
  let currentEmissions = 0

  // Heating emissions
  const heatingFuel = input.heating === 'gas' ? 'gas'
    : input.heating === 'lpg' ? 'lpg'
    : input.heating === 'wood' ? 'wood'
    : 'electricity'
  // We approximate by using the consumption breakdown
  // For simplicity, use the energy-model consumption to derive emissions
  currentEmissions += 0 // Will be computed below from breakdown

  // Electrified: all consumption is electricity
  const electrifiedEmissions = totalElectrifiedKwh * EMISSIONS_FACTORS['electricity']

  return { currentKgCO2e: currentEmissions, electrifiedKgCO2e: electrifiedEmissions }
}

/** Calculate Total Cost of Energy for a household */
export function calculateTCE(input: HouseholdInput): TCEResult {
  const consumption = calculateTotalConsumption(input)
  const currentCosts = calculateCurrentCosts(input, consumption)
  const electrifiedCosts = calculateElectrifiedCosts(input, consumption)
  const savings = calculateSavings(currentCosts, electrifiedCosts)
  const roadmap = generateRoadmap(input)

  // Emissions: derive from consumption and fuel types
  let currentKgCO2e = 0

  // Heating emissions
  const heatingEmissionsFactor = (['gas', 'lpg'].includes(input.heating))
    ? EMISSIONS_FACTORS[input.heating] ?? EMISSIONS_FACTORS['gas']
    : input.heating === 'wood' ? EMISSIONS_FACTORS['wood']
    : EMISSIONS_FACTORS['electricity']
  currentKgCO2e += consumption.heatingKwhPerYear * heatingEmissionsFactor

  // Water heating emissions
  const waterEmissionsFactor = (['gas', 'lpg'].includes(input.waterHeating))
    ? EMISSIONS_FACTORS[input.waterHeating] ?? EMISSIONS_FACTORS['gas']
    : EMISSIONS_FACTORS['electricity']
  currentKgCO2e += consumption.waterHeatingKwhPerYear * waterEmissionsFactor

  // Cooktop emissions
  const cooktopEmissionsFactor = (['gas', 'lpg'].includes(input.cooktop))
    ? EMISSIONS_FACTORS[input.cooktop] ?? EMISSIONS_FACTORS['gas']
    : EMISSIONS_FACTORS['electricity']
  currentKgCO2e += consumption.cooktopKwhPerYear * cooktopEmissionsFactor

  // Base appliances (always electricity)
  currentKgCO2e += consumption.baseAppliancesKwhPerYear * EMISSIONS_FACTORS['electricity']

  // Vehicle emissions
  for (const v of input.vehicles) {
    if (v.type === 'none') continue
    const weeklyKm = VEHICLE_WEEKLY_KM[v.usage]
    const scaleFactor = weeklyKm / 210
    let vehicleKwh: number

    if (v.type === 'electric') {
      vehicleKwh = VEHICLE_CONSUMPTION_DAILY['electric'] * 365 * scaleFactor
      currentKgCO2e += vehicleKwh * EMISSIONS_FACTORS['electricity']
    } else if (v.type === 'phev') {
      const petrolKwh = VEHICLE_CONSUMPTION_DAILY['petrol'] * 0.6 * 365 * scaleFactor
      const electricKwh = VEHICLE_CONSUMPTION_DAILY['electric'] * 0.4 * 365 * scaleFactor
      currentKgCO2e += petrolKwh * EMISSIONS_FACTORS['petrol'] + electricKwh * EMISSIONS_FACTORS['electricity']
    } else if (v.type === 'hybrid') {
      const petrolKwh = VEHICLE_CONSUMPTION_DAILY['petrol'] * 0.7 * 365 * scaleFactor
      const electricKwh = VEHICLE_CONSUMPTION_DAILY['electric'] * 0.3 * 365 * scaleFactor
      currentKgCO2e += petrolKwh * EMISSIONS_FACTORS['petrol'] + electricKwh * EMISSIONS_FACTORS['electricity']
    } else {
      vehicleKwh = VEHICLE_CONSUMPTION_DAILY[v.type] * 365 * scaleFactor
      const factor = v.type === 'diesel' ? EMISSIONS_FACTORS['diesel'] : EMISSIONS_FACTORS['petrol']
      currentKgCO2e += vehicleKwh * factor
    }
  }

  // Electrified emissions: everything runs on electricity
  const electrifiedKgCO2e = consumption.totalKwhPerYear * EMISSIONS_FACTORS['electricity']

  const reductionKgCO2e = currentKgCO2e - electrifiedKgCO2e

  return {
    input,
    currentCosts,
    electrifiedCosts,
    annualSavings: savings.annual,
    monthlySavings: savings.monthly,
    savingsPercent: savings.percentage,
    roadmap,
    emissions: {
      currentKgCO2e: Math.round(currentKgCO2e),
      electrifiedKgCO2e: Math.round(electrifiedKgCO2e),
      reductionKgCO2e: Math.round(reductionKgCO2e),
      reductionPercent: currentKgCO2e > 0 ? Math.round((reductionKgCO2e / currentKgCO2e) * 100) : 0,
    },
    consumption,
  }
}

// Re-export all types
export type {
  EnergyRegion,
  HeatingType,
  WaterHeatingType,
  CooktopType,
  VehicleType,
  VehicleUsage,
  VehicleInput,
  HouseholdInput,
  ConsumptionBreakdown,
  EnergyBreakdown,
  SwitchRecommendation,
  EmissionsResult,
  TCEResult,
} from './types'

// Re-export constants needed by UI
export {
  ELECTRICITY_RATES,
  REGIONAL_HEATING_MULTIPLIERS,
  APPLIANCE_COSTS,
  SOLAR_ANNUAL_SAVINGS,
  PETROL_PRICE_PER_LITRE,
  EV_RUC_PER_1000KM,
  EV_KWH_PER_100KM,
  NATIONAL_AVG_ELECTRICITY_RATE,
} from './constants'

// Re-export demo profiles
export { TCE_DEMO_PROFILES } from './demo-profiles'
export type { TCEDemoProfile } from './demo-profiles'

// Re-export schemas
export { householdInputSchema, energyRegions } from './schemas'
export type { HouseholdInputForm } from './schemas'
