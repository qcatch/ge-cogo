import type { HouseholdInput, EnergyBreakdown, ConsumptionBreakdown, VehicleInput } from './types'
import {
  ELECTRICITY_RATES,
  ELECTRICITY_FIXED_ANNUAL,
  GAS_RATE,
  GAS_FIXED_ANNUAL,
  LPG_RATE,
  LPG_FIXED_ANNUAL,
  PETROL_RATE,
  DIESEL_RATE,
  EV_RUC_PER_1000KM,
  DIESEL_RUC_PER_1000KM,
  VEHICLE_WEEKLY_KM,
  HEATING_FUEL,
  WATER_HEATING_FUEL,
  COOKTOP_FUEL,
  SOLAR_ANNUAL_SAVINGS,
} from './constants'
import {
  calculateHeatingConsumption,
  calculateWaterHeatingConsumption,
  calculateCooktopConsumption,
  calculateBaseApplianceConsumption,
  calculateSingleVehicleConsumption,
} from './consumption'

type FuelType = 'electricity' | 'gas' | 'lpg' | 'wood' | 'petrol' | 'diesel'

/** Get the volume rate for a given fuel type, in the given region */
function getFuelRate(fuel: FuelType, region: HouseholdInput['region']): number {
  switch (fuel) {
    case 'electricity': return ELECTRICITY_RATES[region]
    case 'gas': return GAS_RATE
    case 'lpg': return LPG_RATE
    case 'wood': return 0.1125 // Rewiring Aotearoa wood rate
    case 'petrol': return PETROL_RATE
    case 'diesel': return DIESEL_RATE
  }
}

/** Get the vehicle fuel type for cost calculation */
function getVehicleFuel(type: VehicleInput['type']): FuelType {
  switch (type) {
    case 'petrol': return 'petrol'
    case 'diesel': return 'diesel'
    case 'electric': return 'electricity'
    case 'phev': return 'petrol' // simplified — use petrol rate for blended
    case 'hybrid': return 'petrol'
    default: return 'electricity'
  }
}

/** Calculate annual RUCs for a single vehicle */
function calculateRUCs(vehicle: VehicleInput): number {
  const weeklyKm = VEHICLE_WEEKLY_KM[vehicle.usage]
  const annualKm = weeklyKm * 52
  switch (vehicle.type) {
    case 'electric': return (annualKm / 1000) * EV_RUC_PER_1000KM
    case 'diesel': return (annualKm / 1000) * DIESEL_RUC_PER_1000KM
    default: return 0 // petrol, hybrid, phev have no RUCs
  }
}

/** Does this household use any gas appliances? */
function hasGasAppliances(input: HouseholdInput): boolean {
  return HEATING_FUEL[input.heating] === 'gas' ||
    WATER_HEATING_FUEL[input.waterHeating] === 'gas' ||
    COOKTOP_FUEL[input.cooktop] === 'gas'
}

/** Does this household use any LPG appliances? */
function hasLpgAppliances(input: HouseholdInput): boolean {
  return HEATING_FUEL[input.heating] === 'lpg' ||
    WATER_HEATING_FUEL[input.waterHeating] === 'lpg' ||
    COOKTOP_FUEL[input.cooktop] === 'lpg'
}

/** Calculate the current annual energy costs for a household */
export function calculateCurrentCosts(input: HouseholdInput): EnergyBreakdown {
  const elecRate = ELECTRICITY_RATES[input.region]

  // Calculate per-category consumption
  const heatingKwh = calculateHeatingConsumption(input)
  const waterKwh = calculateWaterHeatingConsumption(input)
  const cooktopKwh = calculateCooktopConsumption(input)
  const baseKwh = calculateBaseApplianceConsumption(input.occupants)

  // Calculate per-category costs
  const heatingFuel = HEATING_FUEL[input.heating]
  const waterFuel = WATER_HEATING_FUEL[input.waterHeating]
  const cooktopFuel = COOKTOP_FUEL[input.cooktop]

  const heatingCost = heatingKwh * getFuelRate(heatingFuel, input.region)
  const waterCost = waterKwh * getFuelRate(waterFuel, input.region)
  const cooktopCost = cooktopKwh * getFuelRate(cooktopFuel, input.region)
  const baseCost = baseKwh * elecRate // base appliances always electric

  // Electricity total = all electric appliance costs + fixed charges
  const electricityCost = (heatingFuel === 'electricity' ? heatingCost : 0) +
    (waterFuel === 'electricity' ? waterCost : 0) +
    (cooktopFuel === 'electricity' ? cooktopCost : 0) +
    baseCost +
    ELECTRICITY_FIXED_ANNUAL

  // Gas total = gas appliance costs + fixed charges
  const gasCost = (heatingFuel === 'gas' ? heatingCost : 0) +
    (waterFuel === 'gas' ? waterCost : 0) +
    (cooktopFuel === 'gas' ? cooktopCost : 0) +
    (hasGasAppliances(input) ? GAS_FIXED_ANNUAL : 0) +
    (heatingFuel === 'lpg' ? heatingCost : 0) +
    (waterFuel === 'lpg' ? waterCost : 0) +
    (cooktopFuel === 'lpg' ? cooktopCost : 0) +
    (hasLpgAppliances(input) ? LPG_FIXED_ANNUAL : 0)

  // Transport total = per-vehicle fuel costs + RUCs
  let transportCost = 0
  for (const vehicle of input.vehicles) {
    if (vehicle.type === 'none') continue
    const vehicleKwh = calculateSingleVehicleConsumption(vehicle)
    const vehicleFuel = getVehicleFuel(vehicle.type)
    transportCost += vehicleKwh * getFuelRate(vehicleFuel, input.region)
    transportCost += calculateRUCs(vehicle)
  }

  const total = electricityCost + gasCost + transportCost

  return {
    electricity: Math.round(electricityCost),
    gas: Math.round(gasCost),
    transport: Math.round(transportCost),
    total: Math.round(total),
  }
}

/** Calculate the projected annual costs if the household fully electrifies */
export function calculateElectrifiedCosts(input: HouseholdInput): EnergyBreakdown {
  const elecRate = ELECTRICITY_RATES[input.region]

  // All appliances become electric
  const electrifiedInput: HouseholdInput = {
    ...input,
    heating: 'heat-pump',
    waterHeating: 'heat-pump',
    cooktop: 'induction',
    vehicles: input.vehicles.map((v) =>
      v.type === 'none' ? v : { ...v, type: 'electric' as const }
    ),
  }

  const heatingKwh = calculateHeatingConsumption(electrifiedInput)
  const waterKwh = calculateWaterHeatingConsumption(electrifiedInput)
  const cooktopKwh = calculateCooktopConsumption(electrifiedInput)
  const baseKwh = calculateBaseApplianceConsumption(input.occupants)

  // All consumption is now electricity
  let electricityCost = (heatingKwh + waterKwh + cooktopKwh + baseKwh) * elecRate +
    ELECTRICITY_FIXED_ANNUAL

  // No gas costs — disconnected
  const gasCost = 0

  // All vehicles become EVs
  let transportCost = 0
  for (const vehicle of electrifiedInput.vehicles) {
    if (vehicle.type === 'none') continue
    const vehicleKwh = calculateSingleVehicleConsumption(vehicle)
    transportCost += vehicleKwh * elecRate
    transportCost += calculateRUCs(vehicle) // EVs have RUCs
  }

  // Solar offset (simplified)
  if (input.includeSolar) {
    electricityCost -= SOLAR_ANNUAL_SAVINGS
    if (electricityCost < 0) electricityCost = 0
  }

  const total = electricityCost + gasCost + transportCost

  return {
    electricity: Math.round(electricityCost),
    gas: 0,
    transport: Math.round(transportCost),
    total: Math.round(total),
  }
}
