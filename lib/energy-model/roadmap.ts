/**
 * Electrification Switching Roadmap
 *
 * Generates a prioritised list of recommended switches from
 * fossil-fuel to electric appliances, sorted by payback period
 * (shortest first = best ROI).
 */

import type { HouseholdInput, SwitchRecommendation } from './types'
import {
  APPLIANCE_COSTS,
  SOLAR_ANNUAL_SAVINGS,
  ELECTRICITY_RATES,
  GAS_RATE,
  LPG_RATE,
  GAS_FIXED_ANNUAL,
  PETROL_ENERGY_RATE,
  EV_RUC_PER_1000KM,
  EV_KWH_PER_100KM,
  HEATING_CONSUMPTION,
  WATER_HEATING_CONSUMPTION,
  COOKTOP_CONSUMPTION,
  REGIONAL_HEATING_MULTIPLIERS,
  VEHICLE_WEEKLY_KM,
} from './constants'
import { getOccupancyMultiplier } from './consumption'

export function generateRoadmap(input: HouseholdInput): SwitchRecommendation[] {
  const recommendations: SwitchRecommendation[] = []
  const elecRate = ELECTRICITY_RATES[input.region]
  const occMultiplier = getOccupancyMultiplier(input.occupants)
  const regionalMultiplier = REGIONAL_HEATING_MULTIPLIERS[input.region]
  const gasRate = (input.heating === 'lpg' || input.waterHeating === 'lpg' || input.cooktop === 'lpg')
    ? LPG_RATE : GAS_RATE

  // Heating: non-heat-pump → heat pump
  if (input.heating !== 'heat-pump') {
    const currentKwh = HEATING_CONSUMPTION[input.heating] * 365 * occMultiplier * regionalMultiplier
    const hpKwh = HEATING_CONSUMPTION['heat-pump'] * 365 * occMultiplier * regionalMultiplier

    const isGas = input.heating === 'gas' || input.heating === 'lpg'
    const currentCost = isGas
      ? currentKwh * gasRate
      : currentKwh * elecRate // wood or electric-resistive → electricity equivalent
    const hpCost = hpKwh * elecRate

    const annualSaving = currentCost - hpCost
    const upfrontCost = APPLIANCE_COSTS['heat-pump-heating']

    recommendations.push({
      appliance: 'Heat Pump (Heating)',
      description: `Replace ${input.heating} heating with an efficient heat pump`,
      currentAnnualCost: Math.round(currentCost),
      electrifiedAnnualCost: Math.round(hpCost),
      annualSaving: Math.round(annualSaving),
      upfrontCost,
      paybackYears: annualSaving > 0 ? Math.round((upfrontCost / annualSaving) * 10) / 10 : Infinity,
      priority: 0,
    })
  }

  // Water heating: non-heat-pump → heat pump hot water
  if (input.waterHeating !== 'heat-pump') {
    const currentKwh = WATER_HEATING_CONSUMPTION[input.waterHeating] * 365 * occMultiplier
    const hpKwh = WATER_HEATING_CONSUMPTION['heat-pump'] * 365 * occMultiplier

    const isGas = input.waterHeating === 'gas' || input.waterHeating === 'lpg'
    const currentCost = isGas
      ? currentKwh * gasRate
      : currentKwh * elecRate
    const hpCost = hpKwh * elecRate

    const annualSaving = currentCost - hpCost
    const upfrontCost = APPLIANCE_COSTS['heat-pump-hot-water']

    recommendations.push({
      appliance: 'Heat Pump Hot Water',
      description: `Replace ${input.waterHeating} hot water with a heat pump cylinder`,
      currentAnnualCost: Math.round(currentCost),
      electrifiedAnnualCost: Math.round(hpCost),
      annualSaving: Math.round(annualSaving),
      upfrontCost,
      paybackYears: annualSaving > 0 ? Math.round((upfrontCost / annualSaving) * 10) / 10 : Infinity,
      priority: 0,
    })
  }

  // Cooktop: non-induction → induction
  if (input.cooktop !== 'induction') {
    const currentKwh = COOKTOP_CONSUMPTION[input.cooktop] * 365 * occMultiplier
    const inductionKwh = COOKTOP_CONSUMPTION['induction'] * 365 * occMultiplier

    const isGas = input.cooktop === 'gas' || input.cooktop === 'lpg'
    const currentCost = isGas
      ? currentKwh * gasRate
      : currentKwh * elecRate
    const inductionCost = inductionKwh * elecRate

    const annualSaving = currentCost - inductionCost
    const upfrontCost = APPLIANCE_COSTS['induction-cooktop']

    recommendations.push({
      appliance: 'Induction Cooktop',
      description: `Replace ${input.cooktop} cooktop with induction`,
      currentAnnualCost: Math.round(currentCost),
      electrifiedAnnualCost: Math.round(inductionCost),
      annualSaving: Math.round(annualSaving),
      upfrontCost,
      paybackYears: annualSaving > 0 ? Math.round((upfrontCost / annualSaving) * 10) / 10 : Infinity,
      priority: 0,
    })
  }

  // Vehicles: fossil → EV (per vehicle)
  for (let i = 0; i < input.vehicles.length; i++) {
    const v = input.vehicles[i]
    if (v.type === 'electric' || v.type === 'none') continue

    const weeklyKm = VEHICLE_WEEKLY_KM[v.usage]
    const annualKm = weeklyKm * 52
    const scaleFactor = weeklyKm / 210

    // Current fuel cost
    let currentFuelKwh: number
    if (v.type === 'phev') {
      currentFuelKwh = 31.40 * 0.6 * 365 * scaleFactor
    } else if (v.type === 'hybrid') {
      currentFuelKwh = 31.40 * 0.7 * 365 * scaleFactor
    } else {
      currentFuelKwh = (v.type === 'petrol' ? 31.40 : 22.80) * 365 * scaleFactor
    }
    const currentCost = currentFuelKwh * PETROL_ENERGY_RATE

    // EV cost
    const evKwh = (annualKm / 100) * EV_KWH_PER_100KM
    const evElecCost = evKwh * elecRate
    const evRuc = (annualKm / 1000) * EV_RUC_PER_1000KM
    const evCost = evElecCost + evRuc

    const annualSaving = currentCost - evCost
    // EV upfront cost not included — too variable. Show fuel saving only.
    const upfrontCost = 0

    const vehicleLabel = input.vehicles.length > 1 ? `Vehicle ${i + 1}` : 'Vehicle'

    recommendations.push({
      appliance: `EV (${vehicleLabel})`,
      description: `Replace ${v.type} ${vehicleLabel.toLowerCase()} with an electric vehicle`,
      currentAnnualCost: Math.round(currentCost),
      electrifiedAnnualCost: Math.round(evCost),
      annualSaving: Math.round(annualSaving),
      upfrontCost,
      paybackYears: 0, // fuel savings only — no upfront appliance cost to compare
      priority: 0,
    })
  }

  // Solar: always shown as an option if not already included
  if (!input.includeSolar) {
    const upfrontCost = APPLIANCE_COSTS['solar-5kw']
    recommendations.push({
      appliance: 'Solar Panels (5kW)',
      description: 'Generate your own electricity and reduce grid dependence',
      currentAnnualCost: 0,
      electrifiedAnnualCost: 0,
      annualSaving: SOLAR_ANNUAL_SAVINGS,
      upfrontCost,
      paybackYears: Math.round((upfrontCost / SOLAR_ANNUAL_SAVINGS) * 10) / 10,
      priority: 0,
    })
  }

  // Filter out items with zero or negative annual savings
  const viable = recommendations.filter(r => r.annualSaving > 0)

  // Sort: EVs first (payback = 0 means immediate savings), then by payback ascending
  // Items with Infinity payback go last
  viable.sort((a, b) => {
    if (a.paybackYears === Infinity && b.paybackYears !== Infinity) return 1
    if (b.paybackYears === Infinity && a.paybackYears !== Infinity) return -1
    // EVs (payback=0) should sort by annual saving descending
    if (a.paybackYears === 0 && b.paybackYears === 0) return b.annualSaving - a.annualSaving
    if (a.paybackYears === 0) return -1
    if (b.paybackYears === 0) return 1
    return a.paybackYears - b.paybackYears
  })

  // Assign priority numbers
  viable.forEach((r, i) => { r.priority = i + 1 })

  return viable
}
