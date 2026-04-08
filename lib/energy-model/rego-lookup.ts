/**
 * Demo vehicle rego lookup — simulates CarJam API
 * Production: CarJam at $0.21/lookup (https://www.carjam.co.nz/dev)
 */

import type { VehicleType } from './types'

export interface VehicleLookupResult {
  plate: string
  make: string
  model: string
  year: number
  fuelType: VehicleType
  fuelLabel: string
}

const DEMO_VEHICLES: Record<string, VehicleLookupResult> = {
  'ABC123': { plate: 'ABC123', make: 'TOYOTA', model: 'COROLLA', year: 2019, fuelType: 'petrol', fuelLabel: 'Petrol' },
  'DEF456': { plate: 'DEF456', make: 'FORD', model: 'RANGER', year: 2021, fuelType: 'diesel', fuelLabel: 'Diesel' },
  'GHI789': { plate: 'GHI789', make: 'TESLA', model: 'MODEL 3', year: 2023, fuelType: 'electric', fuelLabel: 'Electric' },
  'JKL012': { plate: 'JKL012', make: 'TOYOTA', model: 'RAV4 PRIME', year: 2022, fuelType: 'phev', fuelLabel: 'Plug-in Hybrid' },
  'MNO345': { plate: 'MNO345', make: 'TOYOTA', model: 'PRIUS', year: 2020, fuelType: 'hybrid', fuelLabel: 'Hybrid' },
  'SUV001': { plate: 'SUV001', make: 'MITSUBISHI', model: 'OUTLANDER', year: 2021, fuelType: 'petrol', fuelLabel: 'Petrol' },
  'UTE002': { plate: 'UTE002', make: 'TOYOTA', model: 'HILUX', year: 2020, fuelType: 'diesel', fuelLabel: 'Diesel' },
}

export function lookupRego(plate: string): VehicleLookupResult | null {
  return DEMO_VEHICLES[plate.toUpperCase().replace(/\s/g, '')] ?? null
}

export const DEMO_PLATES = Object.keys(DEMO_VEHICLES)
