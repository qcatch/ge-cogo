import type { HouseholdInput, ConsumptionBreakdown, VehicleInput } from './types'
import {
  HEATING_CONSUMPTION,
  REGIONAL_HEATING_MULTIPLIERS,
  WATER_HEATING_CONSUMPTION,
  COOKTOP_CONSUMPTION,
  BASE_APPLIANCE_CONSUMPTION,
  VEHICLE_CONSUMPTION,
  VEHICLE_WEEKLY_KM,
  VEHICLE_REFERENCE_KM,
  OCCUPANCY_MULTIPLIERS,
} from './constants'

const DAYS_PER_YEAR = 365

/** Get the occupancy scaling multiplier, capping at 5+ */
function getOccupancyMultiplier(occupants: number): number {
  if (occupants <= 0) return OCCUPANCY_MULTIPLIERS[1]
  if (occupants >= 5) return OCCUPANCY_MULTIPLIERS[5]
  return OCCUPANCY_MULTIPLIERS[occupants] ?? 1.0
}

/** Calculate annual space heating consumption in kWh */
export function calculateHeatingConsumption(
  input: Pick<HouseholdInput, 'heating' | 'region' | 'occupants'>
): number {
  const baseDaily = HEATING_CONSUMPTION[input.heating]
  const regionalMultiplier = REGIONAL_HEATING_MULTIPLIERS[input.region]
  const occupancyMultiplier = getOccupancyMultiplier(input.occupants)
  return baseDaily * regionalMultiplier * occupancyMultiplier * DAYS_PER_YEAR
}

/** Calculate annual water heating consumption in kWh */
export function calculateWaterHeatingConsumption(
  input: Pick<HouseholdInput, 'waterHeating' | 'occupants'>
): number {
  const baseDaily = WATER_HEATING_CONSUMPTION[input.waterHeating]
  const occupancyMultiplier = getOccupancyMultiplier(input.occupants)
  return baseDaily * occupancyMultiplier * DAYS_PER_YEAR
}

/** Calculate annual cooktop consumption in kWh */
export function calculateCooktopConsumption(
  input: Pick<HouseholdInput, 'cooktop' | 'occupants'>
): number {
  const baseDaily = COOKTOP_CONSUMPTION[input.cooktop]
  const occupancyMultiplier = getOccupancyMultiplier(input.occupants)
  return baseDaily * occupancyMultiplier * DAYS_PER_YEAR
}

/** Calculate annual base appliance consumption in kWh (electronics, fridge, etc.) */
export function calculateBaseApplianceConsumption(occupants: number): number {
  const occupancyMultiplier = getOccupancyMultiplier(occupants)
  return BASE_APPLIANCE_CONSUMPTION * occupancyMultiplier * DAYS_PER_YEAR
}

/** Calculate annual vehicle energy consumption in kWh for a single vehicle */
export function calculateSingleVehicleConsumption(vehicle: VehicleInput): number {
  if (vehicle.type === 'none') return 0
  const baseDailyAt210 = VEHICLE_CONSUMPTION[vehicle.type]
  const weeklyKm = VEHICLE_WEEKLY_KM[vehicle.usage]
  const scalingFactor = weeklyKm / VEHICLE_REFERENCE_KM
  return baseDailyAt210 * scalingFactor * DAYS_PER_YEAR
}

/** Calculate total annual vehicle consumption across all household vehicles */
export function calculateVehicleConsumption(vehicles: VehicleInput[]): number {
  return vehicles.reduce((total, v) => total + calculateSingleVehicleConsumption(v), 0)
}

/** Calculate complete consumption breakdown for a household */
export function calculateTotalConsumption(input: HouseholdInput): ConsumptionBreakdown {
  const heating = calculateHeatingConsumption(input)
  const waterHeating = calculateWaterHeatingConsumption(input)
  const cooktop = calculateCooktopConsumption(input)
  const baseAppliances = calculateBaseApplianceConsumption(input.occupants)
  const vehicles = calculateVehicleConsumption(input.vehicles)

  return {
    heating,
    waterHeating,
    cooktop,
    baseAppliances,
    vehicles,
    total: heating + waterHeating + cooktop + baseAppliances + vehicles,
  }
}

/** Calculate consumption for the electrified version of the same household */
export function calculateElectrifiedConsumption(input: HouseholdInput): ConsumptionBreakdown {
  const electrifiedInput: HouseholdInput = {
    ...input,
    heating: 'heat-pump',
    waterHeating: 'heat-pump',
    cooktop: 'induction',
    vehicles: input.vehicles.map((v) =>
      v.type === 'none' ? v : { ...v, type: 'electric' as const }
    ),
  }
  return calculateTotalConsumption(electrifiedInput)
}
