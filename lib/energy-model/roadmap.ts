import type { HouseholdInput, SwitchRecommendation, EnergyBreakdown } from './types'
import {
  APPLIANCE_COSTS,
  HEATING_FUEL,
  WATER_HEATING_FUEL,
  COOKTOP_FUEL,
  ELECTRICITY_RATES,
  SOLAR_ANNUAL_SAVINGS,
} from './constants'
import {
  calculateHeatingConsumption,
  calculateWaterHeatingConsumption,
  calculateCooktopConsumption,
  calculateSingleVehicleConsumption,
} from './consumption'

/** Generate the recommended electrification switch order, sorted by best ROI */
export function generateRoadmap(
  input: HouseholdInput,
  currentCosts: EnergyBreakdown,
  electrifiedCosts: EnergyBreakdown,
): SwitchRecommendation[] {
  const recommendations: SwitchRecommendation[] = []
  const elecRate = ELECTRICITY_RATES[input.region]

  // ── Heating switch ───────────────────────────────────────────────────────
  if (input.heating !== 'heat-pump') {
    const currentKwh = calculateHeatingConsumption(input)
    const electrifiedKwh = calculateHeatingConsumption({ ...input, heating: 'heat-pump' })
    const currentFuel = HEATING_FUEL[input.heating]
    const currentCost = currentKwh * getFuelRateSimple(currentFuel, input.region)
    const newCost = electrifiedKwh * elecRate
    const annualSaving = currentCost - newCost
    const upfrontCost = APPLIANCE_COSTS['heating-heat-pump'].total

    if (annualSaving > 0) {
      recommendations.push({
        category: 'heating',
        title: 'Switch to heat pump heating',
        description: `Replace your ${formatHeatingType(input.heating)} heating with an efficient heat pump`,
        upfrontCost,
        annualSaving: Math.round(annualSaving),
        paybackYears: round1dp(upfrontCost / annualSaving),
        priority: 0,
      })
    }
  }

  // ── Water heating switch ─────────────────────────────────────────────────
  if (input.waterHeating !== 'heat-pump' && input.waterHeating !== 'solar') {
    const currentKwh = calculateWaterHeatingConsumption(input)
    const electrifiedKwh = calculateWaterHeatingConsumption({ ...input, waterHeating: 'heat-pump' })
    const currentFuel = WATER_HEATING_FUEL[input.waterHeating]
    const currentCost = currentKwh * getFuelRateSimple(currentFuel, input.region)
    const newCost = electrifiedKwh * elecRate
    const annualSaving = currentCost - newCost
    const upfrontCost = APPLIANCE_COSTS['water-heat-pump'].total

    if (annualSaving > 0) {
      recommendations.push({
        category: 'water-heating',
        title: 'Switch to hot water heat pump',
        description: `Replace your ${formatWaterType(input.waterHeating)} hot water with a heat pump cylinder`,
        upfrontCost,
        annualSaving: Math.round(annualSaving),
        paybackYears: round1dp(upfrontCost / annualSaving),
        priority: 0,
      })
    }
  }

  // ── Cooktop switch ───────────────────────────────────────────────────────
  if (input.cooktop !== 'induction') {
    const currentKwh = calculateCooktopConsumption(input)
    const electrifiedKwh = calculateCooktopConsumption({ ...input, cooktop: 'induction' })
    const currentFuel = COOKTOP_FUEL[input.cooktop]
    const currentCost = currentKwh * getFuelRateSimple(currentFuel, input.region)
    const newCost = electrifiedKwh * elecRate
    const annualSaving = currentCost - newCost
    const upfrontCost = APPLIANCE_COSTS['induction-cooktop'].total

    if (annualSaving > 0) {
      recommendations.push({
        category: 'cooktop',
        title: 'Switch to induction cooktop',
        description: `Replace your ${formatCooktopType(input.cooktop)} cooktop with induction`,
        upfrontCost,
        annualSaving: Math.round(annualSaving),
        paybackYears: round1dp(upfrontCost / annualSaving),
        priority: 0,
      })
    }
  }

  // ── Vehicle switches ─────────────────────────────────────────────────────
  for (let i = 0; i < input.vehicles.length; i++) {
    const vehicle = input.vehicles[i]
    if (vehicle.type === 'none' || vehicle.type === 'electric') continue

    const currentKwh = calculateSingleVehicleConsumption(vehicle)
    const evKwh = calculateSingleVehicleConsumption({ ...vehicle, type: 'electric' })

    const currentFuel = vehicle.type === 'diesel' ? 'diesel' : 'petrol'
    const currentCost = currentKwh * getFuelRateSimple(currentFuel, input.region)
    const newCost = evKwh * elecRate

    // Note: we don't include EV purchase cost — too variable and not an "appliance switch"
    // Instead show running cost savings only
    const annualSaving = currentCost - newCost

    if (annualSaving > 0) {
      recommendations.push({
        category: 'vehicle',
        title: input.vehicles.length > 1 ? `Switch vehicle ${i + 1} to EV` : 'Switch to an EV',
        description: `Replace your ${vehicle.type} vehicle with an electric vehicle`,
        upfrontCost: 0, // running cost comparison only
        annualSaving: Math.round(annualSaving),
        paybackYears: 0, // N/A — vehicle purchase is a separate decision
        priority: 0,
      })
    }
  }

  // ── Solar ────────────────────────────────────────────────────────────────
  if (input.includeSolar) {
    recommendations.push({
      category: 'solar',
      title: 'Install 5kW solar system',
      description: 'Rooftop solar panels to offset electricity costs',
      upfrontCost: APPLIANCE_COSTS['solar-5kw'].total,
      annualSaving: SOLAR_ANNUAL_SAVINGS,
      paybackYears: round1dp(APPLIANCE_COSTS['solar-5kw'].total / SOLAR_ANNUAL_SAVINGS),
      priority: 0,
    })
  }

  // Sort by payback period (best ROI first). Vehicles (payback=0) go last.
  recommendations.sort((a, b) => {
    if (a.paybackYears === 0 && b.paybackYears === 0) return 0
    if (a.paybackYears === 0) return 1
    if (b.paybackYears === 0) return -1
    return a.paybackYears - b.paybackYears
  })

  // Assign priority numbers
  recommendations.forEach((r, i) => {
    r.priority = i + 1
  })

  return recommendations
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

import { GAS_RATE, LPG_RATE, PETROL_RATE, DIESEL_RATE } from './constants'

function getFuelRateSimple(fuel: string, region: HouseholdInput['region']): number {
  switch (fuel) {
    case 'electricity': return ELECTRICITY_RATES[region]
    case 'gas': return GAS_RATE
    case 'lpg': return LPG_RATE
    case 'wood': return 0.1125
    case 'petrol': return PETROL_RATE
    case 'diesel': return DIESEL_RATE
    default: return 0
  }
}

function round1dp(n: number): number {
  return Math.round(n * 10) / 10
}

function formatHeatingType(type: string): string {
  const labels: Record<string, string> = {
    'gas': 'gas',
    'lpg': 'LPG',
    'wood': 'wood',
    'electric-resistive': 'electric resistive',
  }
  return labels[type] ?? type
}

function formatWaterType(type: string): string {
  const labels: Record<string, string> = {
    'gas': 'gas',
    'lpg': 'LPG',
    'electric-resistive': 'electric resistive',
  }
  return labels[type] ?? type
}

function formatCooktopType(type: string): string {
  const labels: Record<string, string> = {
    'gas': 'gas',
    'lpg': 'LPG',
    'electric-resistive': 'electric resistive',
  }
  return labels[type] ?? type
}
