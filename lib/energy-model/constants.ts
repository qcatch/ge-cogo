/**
 * NZ Energy Cost Constants — 2026
 *
 * Sources:
 * - Rewiring Aotearoa household-model (GitHub, 2024 base data)
 * - Powerswitch NZ (2026 regional pricing)
 * - MBIE Energy Statistics
 * - 1News / Gaspy (April 2026 petrol pricing)
 * - Market averages for appliance install costs
 */

import type { Region, HeatingType, WaterHeatingType, CooktopType, VehicleType, VehicleUsage } from './types'

// ─── Electricity Rates (NZD per kWh, inclusive of GST + lines) ──────────────

/** Regional electricity rates — source: Powerswitch 2026 */
export const ELECTRICITY_RATES: Record<Region, number> = {
  'northland': 0.44,
  'auckland': 0.38,
  'waikato': 0.40,
  'bay-of-plenty': 0.39,
  'gisborne': 0.42,
  'hawkes-bay': 0.41,
  'taranaki': 0.40,
  'manawatu': 0.39,
  'wellington': 0.346,
  'nelson': 0.39,
  'tasman': 0.39,
  'marlborough': 0.40,
  'west-coast': 0.42,
  'canterbury': 0.40,
  'otago': 0.42,
  'southland': 0.44,
}

/** National average electricity rate — source: Powerswitch 2026 */
export const ELECTRICITY_RATE_NATIONAL = 0.393 // $/kWh

/** Annual fixed electricity charges — source: Rewiring Aotearoa */
export const ELECTRICITY_FIXED_ANNUAL = 768 // NZD/year

// ─── Gas Rates ──────────────────────────────────────────────────────────────

/** Piped natural gas volume rate — source: Rewiring Aotearoa / MBIE */
export const GAS_RATE = 0.118 // $/kWh

/** Annual fixed gas connection charges — source: Rewiring Aotearoa */
export const GAS_FIXED_ANNUAL = 689 // NZD/year

/** LPG volume rate — source: Rewiring Aotearoa */
export const LPG_RATE = 0.255 // $/kWh

/** Annual LPG fixed costs (bottle rental etc.) — source: Rewiring Aotearoa */
export const LPG_FIXED_ANNUAL = 69 // NZD/year

// ─── Transport Rates ────────────────────────────────────────────────────────

/** Petrol energy-equivalent rate — source: Rewiring Aotearoa */
export const PETROL_RATE = 0.289 // $/kWh (energy equivalent)

/** Diesel energy-equivalent rate — source: Rewiring Aotearoa */
export const DIESEL_RATE = 0.197 // $/kWh (energy equivalent)

/** Current petrol price per litre — source: Gaspy/1News April 2026 */
export const PETROL_PRICE_PER_LITRE = 3.42 // NZD/litre (crisis pricing)

/** EV road user charges — source: Waka Kotahi */
export const EV_RUC_PER_1000KM = 76 // NZD per 1000km

/** Diesel RUC per 1000km */
export const DIESEL_RUC_PER_1000KM = 76

// ─── Energy Consumption (kWh/day) ───────────────────────────────────────────

/**
 * Space heating base consumption (kWh/day) BEFORE regional multiplier.
 * Source: Rewiring Aotearoa METHODOLOGY.md
 */
export const HEATING_CONSUMPTION: Record<HeatingType, number> = {
  'gas': 11.73,
  'lpg': 11.73,
  'wood': 14.44,
  'electric-resistive': 9.39,
  'heat-pump': 2.30,
}

/**
 * Regional heating multipliers — applied to base heating consumption.
 * Source: Rewiring Aotearoa METHODOLOGY.md
 */
export const REGIONAL_HEATING_MULTIPLIERS: Record<Region, number> = {
  'northland': 0.49,
  'auckland': 0.63,
  'waikato': 1.06,
  'bay-of-plenty': 0.78,
  'gisborne': 0.78,    // grouped with Bay of Plenty
  'hawkes-bay': 0.78,  // grouped with Bay of Plenty
  'taranaki': 1.06,    // grouped with Waikato
  'manawatu': 1.06,    // grouped with Waikato
  'wellington': 1.13,
  'nelson': 1.13,      // grouped with Wellington
  'tasman': 1.13,      // grouped with Wellington
  'marlborough': 1.13, // grouped with Wellington
  'west-coast': 1.56,  // grouped with Canterbury
  'canterbury': 1.56,
  'otago': 1.60,
  'southland': 1.76,
}

/** Water heating consumption (kWh/day). Source: Rewiring Aotearoa */
export const WATER_HEATING_CONSUMPTION: Record<WaterHeatingType, number> = {
  'gas': 6.60,
  'lpg': 6.60,
  'electric-resistive': 6.97,
  'heat-pump': 1.71,
  'solar': 1.71,
}

/** Cooktop consumption (kWh/day). Source: Rewiring Aotearoa */
export const COOKTOP_CONSUMPTION: Record<CooktopType, number> = {
  'gas': 1.94,
  'lpg': 1.94,
  'electric-resistive': 0.83,
  'induction': 0.75,
}

/** Base appliance consumption (kWh/day) — electronics, fridge, laundry, etc. Source: Rewiring Aotearoa */
export const BASE_APPLIANCE_CONSUMPTION = 4.05 + 2.85 + 0.34 // 7.24 kWh/day

/**
 * Occupancy scaling multipliers (reference: 2.7 occupants = 1.0).
 * Source: Rewiring Aotearoa METHODOLOGY.md
 */
export const OCCUPANCY_MULTIPLIERS: Record<number, number> = {
  1: 0.56,
  2: 0.90,
  3: 1.03,
  4: 1.07,
  5: 1.37, // 5+ people
}

/**
 * Vehicle energy consumption (kWh/day) at 210 km/week baseline.
 * Source: Rewiring Aotearoa METHODOLOGY.md
 */
export const VEHICLE_CONSUMPTION: Record<Exclude<VehicleType, 'none'>, number> = {
  'petrol': 31.40,
  'diesel': 22.80,
  'electric': 7.324,
  'phev': 31.40 * 0.6 + 7.324 * 0.4, // 60% petrol + 40% electric
  'hybrid': 31.40 * 0.7 + 7.324 * 0.3, // 70% petrol + 30% electric
}

/** Weekly km by usage category. Source: Rewiring Aotearoa */
export const VEHICLE_WEEKLY_KM: Record<VehicleUsage, number> = {
  'low': 50,
  'medium': 210,
  'high': 400,
}

/** Reference weekly km for base consumption values */
export const VEHICLE_REFERENCE_KM = 210

// ─── Appliance Costs (NZD installed) ────────────────────────────────────────

export const APPLIANCE_COSTS = {
  /** Heat pump for space heating — source: Rewiring Aotearoa */
  'heating-heat-pump': { unit: 2728, install: 1050, total: 3778 },
  /** Hot water heat pump — source: Rewiring Aotearoa */
  'water-heat-pump': { unit: 4678, install: 2321, total: 6999 },
  /** Induction cooktop — source: Rewiring Aotearoa */
  'induction-cooktop': { unit: 1430, install: 1265, total: 2695 },
  /** 5kW solar system — source: NZ market average 2026 */
  'solar-5kw': { unit: 9000, install: 0, total: 9000 },
} as const

/** Simplified annual solar savings for a 5kW system. Source: ASB/Cogo case study */
export const SOLAR_ANNUAL_SAVINGS = 1600 // NZD/year

// ─── Emissions Factors (kgCO2e per kWh) ─────────────────────────────────────

/** Source: Rewiring Aotearoa METHODOLOGY.md */
export const EMISSIONS_FACTORS: Record<string, number> = {
  'electricity': 0.074,
  'gas': 0.201,
  'lpg': 0.219,
  'wood': 0.016,
  'petrol': 0.258,
  'diesel': 0.253,
}

// ─── Fuel Type Mapping ──────────────────────────────────────────────────────

/** Maps appliance/vehicle types to their fuel source for cost/emissions */
export const HEATING_FUEL: Record<HeatingType, 'electricity' | 'gas' | 'lpg' | 'wood'> = {
  'gas': 'gas',
  'lpg': 'lpg',
  'wood': 'wood',
  'electric-resistive': 'electricity',
  'heat-pump': 'electricity',
}

export const WATER_HEATING_FUEL: Record<WaterHeatingType, 'electricity' | 'gas' | 'lpg'> = {
  'gas': 'gas',
  'lpg': 'lpg',
  'electric-resistive': 'electricity',
  'heat-pump': 'electricity',
  'solar': 'electricity',
}

export const COOKTOP_FUEL: Record<CooktopType, 'electricity' | 'gas' | 'lpg'> = {
  'gas': 'gas',
  'lpg': 'lpg',
  'electric-resistive': 'electricity',
  'induction': 'electricity',
}
