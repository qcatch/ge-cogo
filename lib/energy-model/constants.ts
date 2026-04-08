/**
 * NZ Energy Cost Constants — April 2026
 *
 * Sources:
 * - Rewiring Aotearoa household energy model (2024)
 * - Powerswitch NZ regional electricity rates (2025)
 * - MBIE weekly fuel price monitoring (March 2026)
 * - Waka Kotahi EV road user charges (2025)
 * - EECA GenLess appliance efficiency data (2025)
 */

import type { EnergyRegion, HeatingType, WaterHeatingType, CooktopType, VehicleType, VehicleUsage } from './types'

// ─── Electricity ──────────────────────────────────────────────────────────────

/** Regional electricity rates in NZD per kWh (Powerswitch 2025) */
export const ELECTRICITY_RATES: Record<EnergyRegion, number> = {
  'northland': 0.48,
  'auckland': 0.38,
  'waikato': 0.393,
  'bay-of-plenty': 0.393,
  'wellington': 0.346,
  'canterbury': 0.40,
  'otago': 0.42,
  'southland': 0.45,
}

/** National average electricity rate — NZD per kWh (Powerswitch 2025) */
export const NATIONAL_AVG_ELECTRICITY_RATE = 0.393

/** Annual fixed electricity charges — NZD per year (MBIE) */
export const ELECTRICITY_FIXED_ANNUAL = 768

// ─── Gas ──────────────────────────────────────────────────────────────────────

/** Piped natural gas rate — NZD per kWh (Rewiring Aotearoa) */
export const GAS_RATE = 0.118

/** Annual fixed gas charges — NZD per year (Rewiring Aotearoa) */
export const GAS_FIXED_ANNUAL = 689

/** LPG rate — NZD per kWh (Rewiring Aotearoa) */
export const LPG_RATE = 0.255

// ─── Petrol & Diesel ──────────────────────────────────────────────────────────

/** Petrol price — NZD per litre (MBIE March 2026 average, slider default) */
export const PETROL_PRICE_PER_LITRE = 3.20

/** Petrol energy equivalent rate — NZD per kWh (Rewiring Aotearoa) */
export const PETROL_ENERGY_RATE = 0.289

/** Average NZ car fuel consumption — litres per 100km */
export const PETROL_LITRES_PER_100KM = 8.5

// ─── EV ───────────────────────────────────────────────────────────────────────

/** EV energy consumption — kWh per 100km (Rewiring Aotearoa) */
export const EV_KWH_PER_100KM = 18

/** EV road user charges — NZD per 1,000km (Waka Kotahi 2025) */
export const EV_RUC_PER_1000KM = 76

// ─── Space Heating Consumption (kWh/day, base before regional multiplier) ────

/** Daily space heating consumption by type — kWh/day (Rewiring Aotearoa) */
export const HEATING_CONSUMPTION: Record<HeatingType, number> = {
  'wood': 14.44,
  'gas': 11.73,
  'lpg': 11.73,
  'electric-resistive': 9.39,
  'heat-pump': 2.30,
}

// ─── Regional Heating Multipliers ─────────────────────────────────────────────

/** Regional heating multiplier — adjusts base heating by climate (Rewiring Aotearoa) */
export const REGIONAL_HEATING_MULTIPLIERS: Record<EnergyRegion, number> = {
  'northland': 0.49,
  'auckland': 0.63,
  'waikato': 1.06,
  'bay-of-plenty': 0.78,
  'wellington': 1.13,
  'canterbury': 1.56,
  'otago': 1.60,
  'southland': 1.76,
}

// ─── Water Heating Consumption (kWh/day) ──────────────────────────────────────

/** Daily water heating consumption by type — kWh/day (Rewiring Aotearoa) */
export const WATER_HEATING_CONSUMPTION: Record<WaterHeatingType, number> = {
  'gas': 6.60,
  'lpg': 6.60,
  'electric-resistive': 6.97,
  'heat-pump': 1.71,
  'solar': 0.50,
}

// ─── Cooktop Consumption (kWh/day) ────────────────────────────────────────────

/** Daily cooktop consumption by type — kWh/day (Rewiring Aotearoa) */
export const COOKTOP_CONSUMPTION: Record<CooktopType, number> = {
  'gas': 1.94,
  'lpg': 1.94,
  'electric-resistive': 0.83,
  'induction': 0.75,
}

// ─── Occupancy Multipliers (base = 2.7 people) ───────────────────────────────

/** Occupancy scaling multipliers — adjusts consumption by household size (Rewiring Aotearoa) */
export const OCCUPANCY_MULTIPLIERS: Record<number, number> = {
  1: 0.56,
  2: 0.90,
  3: 1.03,
  4: 1.07,
  5: 1.37,
}

// ─── Vehicle Consumption (kWh/day at 210km/week baseline) ─────────────────────

/** Daily vehicle energy consumption by type — kWh/day at 210km/week (Rewiring Aotearoa) */
export const VEHICLE_CONSUMPTION_DAILY: Record<VehicleType, number> = {
  'petrol': 31.40,
  'diesel': 22.80,
  'electric': 7.324,
  'phev': 0,    // calculated as 60% petrol + 40% electric
  'hybrid': 0,  // calculated as 70% petrol + 30% electric
  'none': 0,
}

/** Weekly driving distance by usage level — km per week */
export const VEHICLE_WEEKLY_KM: Record<VehicleUsage, number> = {
  'low': 50,
  'medium': 210,
  'high': 400,
}

// ─── Appliance Installed Costs (NZD incl installation) ────────────────────────

/** Installed cost of electrification upgrades — NZD (Rewiring Aotearoa / industry avg 2025) */
export const APPLIANCE_COSTS: Record<string, number> = {
  'heat-pump-heating': 3778,
  'heat-pump-hot-water': 6999,
  'induction-cooktop': 2695,
  'solar-5kw': 9000,
}

/** Simplified annual solar savings — NZD per year */
export const SOLAR_ANNUAL_SAVINGS = 1600

// ─── Emissions Factors (kgCO2e per kWh) ──────────────────────────────────────

/** Greenhouse gas emissions factors by fuel type — kgCO2e per kWh */
export const EMISSIONS_FACTORS: Record<string, number> = {
  'electricity': 0.074,
  'gas': 0.201,
  'lpg': 0.219,
  'petrol': 0.258,
  'diesel': 0.253,
  'wood': 0.016,
}

// ─── Base Appliance Consumption ───────────────────────────────────────────────

/** Base daily appliance consumption (fridge, electronics, lighting, etc.) — kWh/day */
export const BASE_APPLIANCE_KWH_PER_DAY = 8.0
