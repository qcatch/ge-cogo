/**
 * Energy Consumption Calculations
 *
 * Calculates annual energy consumption (kWh/year) for each household
 * category: heating, water heating, cooktop, base appliances, and vehicles.
 *
 * Core formula: annual_kWh = daily_kWh * 365 * occupancy_multiplier * regional_multiplier
 *
 * Source: Rewiring Aotearoa household energy model (2024)
 */

import type { HouseholdInput, VehicleInput, ConsumptionBreakdown } from './types'
import {
  HEATING_CONSUMPTION,
  REGIONAL_HEATING_MULTIPLIERS,
  WATER_HEATING_CONSUMPTION,
  COOKTOP_CONSUMPTION,
  OCCUPANCY_MULTIPLIERS,
  VEHICLE_CONSUMPTION_DAILY,
  VEHICLE_WEEKLY_KM,
  BASE_APPLIANCE_KWH_PER_DAY,
} from './constants'

/** Get occupancy multiplier, capped at 5+ and defaulting to 2-person if invalid */
export function getOccupancyMultiplier(occupants: number): number {
  if (occupants >= 5) return OCCUPANCY_MULTIPLIERS[5]
  return OCCUPANCY_MULTIPLIERS[occupants] ?? OCCUPANCY_MULTIPLIERS[2]
}

export function calculateHeatingConsumption(
  type: HouseholdInput['heating'],
  region: HouseholdInput['region'],
  occupants: number,
): number {
  const dailyBase = HEATING_CONSUMPTION[type]
  const regionalMultiplier = REGIONAL_HEATING_MULTIPLIERS[region]
  const occupancyMultiplier = getOccupancyMultiplier(occupants)
  return dailyBase * 365 * occupancyMultiplier * regionalMultiplier
}

export function calculateWaterHeatingConsumption(
  type: HouseholdInput['waterHeating'],
  occupants: number,
): number {
  const dailyBase = WATER_HEATING_CONSUMPTION[type]
  const occupancyMultiplier = getOccupancyMultiplier(occupants)
  return dailyBase * 365 * occupancyMultiplier
}

export function calculateCooktopConsumption(
  type: HouseholdInput['cooktop'],
  occupants: number,
): number {
  const dailyBase = COOKTOP_CONSUMPTION[type]
  const occupancyMultiplier = getOccupancyMultiplier(occupants)
  return dailyBase * 365 * occupancyMultiplier
}

export function calculateBaseApplianceConsumption(occupants: number): number {
  const occupancyMultiplier = getOccupancyMultiplier(occupants)
  return BASE_APPLIANCE_KWH_PER_DAY * 365 * occupancyMultiplier
}

function calculateSingleVehicleConsumption(vehicle: VehicleInput): number {
  if (vehicle.type === 'none') return 0

  const weeklyKm = VEHICLE_WEEKLY_KM[vehicle.usage]
  const scaleFactor = weeklyKm / 210 // base data is at 210km/week

  if (vehicle.type === 'phev') {
    const petrolDaily = VEHICLE_CONSUMPTION_DAILY['petrol'] * 0.6
    const electricDaily = VEHICLE_CONSUMPTION_DAILY['electric'] * 0.4
    return (petrolDaily + electricDaily) * 365 * scaleFactor
  }

  if (vehicle.type === 'hybrid') {
    const petrolDaily = VEHICLE_CONSUMPTION_DAILY['petrol'] * 0.7
    const electricDaily = VEHICLE_CONSUMPTION_DAILY['electric'] * 0.3
    return (petrolDaily + electricDaily) * 365 * scaleFactor
  }

  return VEHICLE_CONSUMPTION_DAILY[vehicle.type] * 365 * scaleFactor
}

export function calculateVehicleConsumption(vehicles: VehicleInput[]): number {
  return vehicles.reduce((total, v) => total + calculateSingleVehicleConsumption(v), 0)
}

export function calculateTotalConsumption(input: HouseholdInput): ConsumptionBreakdown {
  const heating = calculateHeatingConsumption(input.heating, input.region, input.occupants)
  const waterHeating = calculateWaterHeatingConsumption(input.waterHeating, input.occupants)
  const cooktop = calculateCooktopConsumption(input.cooktop, input.occupants)
  const baseAppliances = calculateBaseApplianceConsumption(input.occupants)
  const vehicles = calculateVehicleConsumption(input.vehicles)

  return {
    heatingKwhPerYear: heating,
    waterHeatingKwhPerYear: waterHeating,
    cooktopKwhPerYear: cooktop,
    baseAppliancesKwhPerYear: baseAppliances,
    vehiclesKwhPerYear: vehicles,
    totalKwhPerYear: heating + waterHeating + cooktop + baseAppliances + vehicles,
  }
}
