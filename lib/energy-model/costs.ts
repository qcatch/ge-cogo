/**
 * Energy Cost Calculations
 *
 * Calculates current and fully-electrified annual energy costs.
 *
 * Core formula: cost = (consumption_kWh * rate_per_kWh) + fixed_annual_charges
 *
 * Source: Rewiring Aotearoa methodology with Powerswitch / MBIE pricing
 */

import type { HouseholdInput, ConsumptionBreakdown, EnergyBreakdown } from './types'
import {
  ELECTRICITY_RATES,
  ELECTRICITY_FIXED_ANNUAL,
  GAS_RATE,
  GAS_FIXED_ANNUAL,
  LPG_RATE,
  PETROL_ENERGY_RATE,
  EV_RUC_PER_1000KM,
  EV_KWH_PER_100KM,
  VEHICLE_WEEKLY_KM,
  SOLAR_ANNUAL_SAVINGS,
  HEATING_CONSUMPTION,
  WATER_HEATING_CONSUMPTION,
  COOKTOP_CONSUMPTION,
  REGIONAL_HEATING_MULTIPLIERS,
} from './constants'
import { getOccupancyMultiplier } from './consumption'

function getElectricityRate(region: HouseholdInput['region']): number {
  return ELECTRICITY_RATES[region]
}

function isGasType(type: string): boolean {
  return type === 'gas' || type === 'lpg'
}

function isElectricType(type: string): boolean {
  return type === 'electric-resistive' || type === 'heat-pump' || type === 'induction'
}

function getGasRate(input: HouseholdInput): number {
  // If any appliance uses LPG, use LPG rate for all gas consumption
  if (input.heating === 'lpg' || input.waterHeating === 'lpg' || input.cooktop === 'lpg') {
    return LPG_RATE
  }
  return GAS_RATE
}

function hasAnyGas(input: HouseholdInput): boolean {
  return isGasType(input.heating) || isGasType(input.waterHeating) || isGasType(input.cooktop)
}

export function calculateCurrentCosts(input: HouseholdInput, consumption: ConsumptionBreakdown): EnergyBreakdown {
  const elecRate = getElectricityRate(input.region)
  const gasRate = getGasRate(input)

  // Electricity: consumption from electric-type appliances + base appliances
  let electricKwh = consumption.baseAppliancesKwhPerYear
  if (isElectricType(input.heating)) electricKwh += consumption.heatingKwhPerYear
  if (isElectricType(input.waterHeating)) electricKwh += consumption.waterHeatingKwhPerYear
  if (isElectricType(input.cooktop)) electricKwh += consumption.cooktopKwhPerYear
  // EV electricity consumption
  for (const v of input.vehicles) {
    if (v.type === 'electric') {
      const weeklyKm = VEHICLE_WEEKLY_KM[v.usage]
      electricKwh += (weeklyKm * 52 / 100) * EV_KWH_PER_100KM
    }
  }
  const electricity = electricKwh * elecRate + ELECTRICITY_FIXED_ANNUAL

  // Gas: consumption from gas/LPG-type appliances
  let gasKwh = 0
  if (isGasType(input.heating)) gasKwh += consumption.heatingKwhPerYear
  if (isGasType(input.waterHeating)) gasKwh += consumption.waterHeatingKwhPerYear
  if (isGasType(input.cooktop)) gasKwh += consumption.cooktopKwhPerYear
  const gasFixed = hasAnyGas(input) ? GAS_FIXED_ANNUAL : 0
  const gas = gasKwh * gasRate + gasFixed

  // Petrol: fossil vehicle fuel costs
  let petrolKwh = 0
  for (const v of input.vehicles) {
    if (v.type === 'petrol' || v.type === 'diesel') {
      const weeklyKm = VEHICLE_WEEKLY_KM[v.usage]
      const scaleFactor = weeklyKm / 210
      petrolKwh += HEATING_CONSUMPTION['gas'] === 0 ? 0 : // safety check — use vehicle data
        (v.type === 'petrol' ? 31.40 : 22.80) * 365 * scaleFactor
    } else if (v.type === 'phev') {
      const weeklyKm = VEHICLE_WEEKLY_KM[v.usage]
      const scaleFactor = weeklyKm / 210
      petrolKwh += 31.40 * 0.6 * 365 * scaleFactor
    } else if (v.type === 'hybrid') {
      const weeklyKm = VEHICLE_WEEKLY_KM[v.usage]
      const scaleFactor = weeklyKm / 210
      petrolKwh += 31.40 * 0.7 * 365 * scaleFactor
    }
  }
  const petrol = petrolKwh * PETROL_ENERGY_RATE

  // EV RUC for currently owned EVs
  let vehicleRuc = 0
  for (const v of input.vehicles) {
    if (v.type === 'electric') {
      const annualKm = VEHICLE_WEEKLY_KM[v.usage] * 52
      vehicleRuc += (annualKm / 1000) * EV_RUC_PER_1000KM
    }
  }

  return {
    electricity,
    gas,
    petrol,
    vehicleRuc,
    total: electricity + gas + petrol + vehicleRuc,
  }
}

export function calculateElectrifiedCosts(input: HouseholdInput, consumption: ConsumptionBreakdown): EnergyBreakdown {
  const elecRate = getElectricityRate(input.region)
  const occMultiplier = getOccupancyMultiplier(input.occupants)
  const regionalMultiplier = REGIONAL_HEATING_MULTIPLIERS[input.region]

  // All heating → heat pump
  const hpHeatingKwh = HEATING_CONSUMPTION['heat-pump'] * 365 * occMultiplier * regionalMultiplier
  // All water → heat pump hot water
  const hpWaterKwh = WATER_HEATING_CONSUMPTION['heat-pump'] * 365 * occMultiplier
  // All cooking → induction
  const inductionKwh = COOKTOP_CONSUMPTION['induction'] * 365 * occMultiplier
  // Base appliances unchanged
  const baseKwh = consumption.baseAppliancesKwhPerYear

  // All vehicles → EV
  let evKwh = 0
  let totalEvKm = 0
  for (const v of input.vehicles) {
    if (v.type === 'none') continue
    const annualKm = VEHICLE_WEEKLY_KM[v.usage] * 52
    evKwh += (annualKm / 100) * EV_KWH_PER_100KM
    totalEvKm += annualKm
  }

  const totalElecKwh = hpHeatingKwh + hpWaterKwh + inductionKwh + baseKwh + evKwh
  let electricity = totalElecKwh * elecRate + ELECTRICITY_FIXED_ANNUAL

  // Solar offset
  if (input.includeSolar) {
    electricity -= SOLAR_ANNUAL_SAVINGS
    electricity = Math.max(electricity, ELECTRICITY_FIXED_ANNUAL) // can't go below fixed charges
  }

  // EV RUC for all vehicles (all now EVs)
  const vehicleRuc = (totalEvKm / 1000) * EV_RUC_PER_1000KM

  return {
    electricity,
    gas: 0,       // no gas in fully electrified scenario
    petrol: 0,    // no petrol in fully electrified scenario
    vehicleRuc,
    total: electricity + vehicleRuc,
  }
}

export function calculateSavings(current: EnergyBreakdown, electrified: EnergyBreakdown) {
  const annual = current.total - electrified.total
  return {
    annual: Math.round(annual),
    monthly: Math.round(annual / 12),
    percentage: current.total > 0 ? Math.round((annual / current.total) * 100) : 0,
  }
}
