import type { HouseholdInput, TCEResult } from './types'
import { EMISSIONS_FACTORS, HEATING_FUEL, WATER_HEATING_FUEL, COOKTOP_FUEL } from './constants'
import {
  calculateTotalConsumption,
  calculateElectrifiedConsumption,
  calculateHeatingConsumption,
  calculateWaterHeatingConsumption,
  calculateCooktopConsumption,
  calculateBaseApplianceConsumption,
  calculateVehicleConsumption,
} from './consumption'
import { calculateCurrentCosts, calculateElectrifiedCosts } from './costs'
import { generateRoadmap } from './roadmap'

export type {
  HouseholdInput,
  TCEResult,
  EnergyBreakdown,
  ConsumptionBreakdown,
  SwitchRecommendation,
  EmissionsResult,
  Region,
  HeatingType,
  WaterHeatingType,
  CooktopType,
  VehicleType,
  VehicleUsage,
  VehicleInput,
} from './types'

/**
 * Calculate the Total Cost of Energy for a NZ household.
 *
 * Takes a household's current energy profile and returns:
 * - Current annual costs across electricity, gas, and transport
 * - Projected costs if fully electrified
 * - Annual savings
 * - Recommended switch order with payback periods
 * - CO2 emissions comparison
 */
export function calculateTCE(input: HouseholdInput): TCEResult {
  // 1. Calculate consumption
  const currentConsumption = calculateTotalConsumption(input)
  const electrifiedConsumption = calculateElectrifiedConsumption(input)

  // 2. Calculate costs
  const currentCosts = calculateCurrentCosts(input)
  const electrifiedCosts = calculateElectrifiedCosts(input)

  // 3. Calculate savings
  const annualSavings = currentCosts.total - electrifiedCosts.total
  const monthlySavings = Math.round(annualSavings / 12)
  const savingsPercent = currentCosts.total > 0
    ? Math.round((annualSavings / currentCosts.total) * 100)
    : 0

  // 4. Calculate emissions
  const currentEmissions = calculateEmissions(input, currentConsumption)
  const electrifiedEmissions = calculateElectrifiedEmissions(electrifiedConsumption)
  const reductionTonnes = currentEmissions - electrifiedEmissions
  const reductionPercent = currentEmissions > 0
    ? Math.round((reductionTonnes / currentEmissions) * 100)
    : 0

  // 5. Generate roadmap
  const roadmap = generateRoadmap(input, currentCosts, electrifiedCosts)
  const totalUpfrontCost = roadmap.reduce((sum, r) => sum + r.upfrontCost, 0)

  return {
    currentCosts,
    electrifiedCosts,
    annualSavings,
    monthlySavings,
    savingsPercent,
    currentConsumption,
    electrifiedConsumption,
    roadmap,
    totalUpfrontCost,
    emissions: {
      currentTonnes: round2dp(currentEmissions),
      electrifiedTonnes: round2dp(electrifiedEmissions),
      reductionTonnes: round2dp(reductionTonnes),
      reductionPercent,
    },
  }
}

/** Calculate current annual CO2 emissions in tonnes */
function calculateEmissions(
  input: HouseholdInput,
  consumption: { heating: number; waterHeating: number; cooktop: number; baseAppliances: number; vehicles: number }
): number {
  const heatingFuel = HEATING_FUEL[input.heating]
  const waterFuel = WATER_HEATING_FUEL[input.waterHeating]
  const cooktopFuel = COOKTOP_FUEL[input.cooktop]

  let totalKgCO2 = 0
  totalKgCO2 += consumption.heating * (EMISSIONS_FACTORS[heatingFuel] ?? 0)
  totalKgCO2 += consumption.waterHeating * (EMISSIONS_FACTORS[waterFuel] ?? 0)
  totalKgCO2 += consumption.cooktop * (EMISSIONS_FACTORS[cooktopFuel] ?? 0)
  totalKgCO2 += consumption.baseAppliances * EMISSIONS_FACTORS['electricity']

  // Vehicle emissions — simplified: assume petrol unless diesel
  for (const vehicle of input.vehicles) {
    if (vehicle.type === 'none') continue
    const fuel = vehicle.type === 'diesel' ? 'diesel' : vehicle.type === 'electric' ? 'electricity' : 'petrol'
    const vehicleKwh = calculateVehicleConsumptionForVehicle(vehicle)
    totalKgCO2 += vehicleKwh * (EMISSIONS_FACTORS[fuel] ?? 0)
  }

  return totalKgCO2 / 1000 // convert to tonnes
}

/** Calculate electrified annual CO2 emissions in tonnes */
function calculateElectrifiedEmissions(
  consumption: { heating: number; waterHeating: number; cooktop: number; baseAppliances: number; vehicles: number }
): number {
  const totalKwh = consumption.heating + consumption.waterHeating +
    consumption.cooktop + consumption.baseAppliances + consumption.vehicles
  return (totalKwh * EMISSIONS_FACTORS['electricity']) / 1000
}

function round2dp(n: number): number {
  return Math.round(n * 100) / 100
}

// Re-import for emissions calculation
import { calculateSingleVehicleConsumption } from './consumption'
function calculateVehicleConsumptionForVehicle(vehicle: { type: string; usage: string }): number {
  return calculateSingleVehicleConsumption(vehicle as import('./types').VehicleInput)
}

// Re-export demo profiles for convenience
export { DEMO_PROFILES } from './demo-profiles'
