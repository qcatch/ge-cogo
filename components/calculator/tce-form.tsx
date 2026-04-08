'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { lookupRego, DEMO_PLATES, TCE_DEMO_PROFILES } from '@/lib/energy-model'
import type { HouseholdInput, VehicleType, VehicleUsage, VehicleLookupResult } from '@/lib/energy-model'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Car, Plus, Trash2, Zap, Home, Flame, Thermometer } from 'lucide-react'

// ─── Option data ──────────────────────────────────────────────────────────────

const REGION_OPTIONS = [
  { value: 'northland', label: 'Northland' },
  { value: 'auckland', label: 'Auckland' },
  { value: 'waikato', label: 'Waikato' },
  { value: 'bay-of-plenty', label: 'Bay of Plenty' },
  { value: 'wellington', label: 'Wellington' },
  { value: 'canterbury', label: 'Canterbury' },
  { value: 'otago', label: 'Otago' },
  { value: 'southland', label: 'Southland' },
] as const

const MILEAGE_OPTIONS = [
  { value: 'low' as VehicleUsage, label: 'Low', desc: '~5,000 km/yr' },
  { value: 'medium' as VehicleUsage, label: 'Medium', desc: '~12,000 km/yr' },
  { value: 'high' as VehicleUsage, label: 'High', desc: '~20,000 km/yr' },
  { value: 'high' as VehicleUsage, label: 'Very High', desc: '~30,000 km/yr' },
] as const

const HEATING_OPTIONS = [
  { value: 'heat-pump', label: 'Heat pump', icon: Thermometer },
  { value: 'gas', label: 'Gas', icon: Flame },
  { value: 'electric-resistive', label: 'Electric', icon: Zap },
  { value: 'wood', label: 'Wood', icon: Home },
] as const

const WATER_OPTIONS = [
  { value: 'electric-resistive', label: 'Electric' },
  { value: 'gas', label: 'Gas' },
  { value: 'heat-pump', label: 'Heat pump' },
] as const

const COOKTOP_OPTIONS = [
  { value: 'gas', label: 'Gas' },
  { value: 'electric-resistive', label: 'Electric' },
  { value: 'induction', label: 'Induction' },
] as const

const OCCUPANT_OPTIONS = [1, 2, 3, 4, 5] as const

// ─── Vehicle entry state ──────────────────────────────────────────────────────

interface VehicleEntry {
  id: number
  plate: string
  lookup: VehicleLookupResult | null
  lookupDone: boolean
  mileage: VehicleUsage
}

// ─── Component ────────────────────────────────────────────────────────────────

interface TCEFormProps {
  onInputChange: (input: HouseholdInput) => void
  defaultInput: HouseholdInput
}

export function TCEForm({ onInputChange, defaultInput }: TCEFormProps) {
  // Vehicle state
  const [vehicles, setVehicles] = useState<VehicleEntry[]>([
    { id: 1, plate: '', lookup: null, lookupDone: false, mileage: 'medium' },
  ])

  // Home energy state
  const [region, setRegion] = useState(defaultInput.region)
  const [occupants, setOccupants] = useState(defaultInput.occupants)
  const [heating, setHeating] = useState(defaultInput.heating)
  const [waterHeating, setWaterHeating] = useState(defaultInput.waterHeating)
  const [cooktop, setCooktop] = useState(defaultInput.cooktop)

  // Stable callback ref
  const onInputChangeRef = useRef(onInputChange)
  onInputChangeRef.current = onInputChange

  // Propagate changes to parent
  useEffect(() => {
    const vehicleInputs = vehicles
      .filter(v => v.lookup !== null)
      .map(v => ({ type: v.lookup!.fuelType, usage: v.mileage }))

    const input: HouseholdInput = {
      region: region as HouseholdInput['region'],
      occupants,
      heating: heating as HouseholdInput['heating'],
      waterHeating: waterHeating as HouseholdInput['waterHeating'],
      cooktop: cooktop as HouseholdInput['cooktop'],
      vehicles: vehicleInputs.length > 0
        ? vehicleInputs
        : [{ type: 'petrol' as VehicleType, usage: 'medium' as VehicleUsage }],
      includeSolar: false,
    }
    onInputChangeRef.current(input)
  }, [vehicles, region, occupants, heating, waterHeating, cooktop])

  // Rego lookup
  const handleLookup = useCallback((vehicleId: number) => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      const result = lookupRego(v.plate)
      return { ...v, lookup: result, lookupDone: true }
    }))
  }, [])

  const handlePlateChange = useCallback((vehicleId: number, plate: string) => {
    setVehicles(prev => prev.map(v =>
      v.id === vehicleId ? { ...v, plate: plate.toUpperCase(), lookup: null, lookupDone: false } : v
    ))
  }, [])

  const handleMileageChange = useCallback((vehicleId: number, mileage: VehicleUsage) => {
    setVehicles(prev => prev.map(v =>
      v.id === vehicleId ? { ...v, mileage } : v
    ))
  }, [])

  const addVehicle = useCallback(() => {
    setVehicles(prev => [...prev, {
      id: Date.now(), plate: '', lookup: null, lookupDone: false, mileage: 'medium',
    }])
  }, [])

  const removeVehicle = useCallback((vehicleId: number) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId))
  }, [])

  // Quick-fill preset
  const handlePreset = useCallback((key: string) => {
    const profile = TCE_DEMO_PROFILES[key]
    if (!profile) return
    const input = profile.input
    setRegion(input.region)
    setOccupants(input.occupants)
    setHeating(input.heating)
    setWaterHeating(input.waterHeating)
    setCooktop(input.cooktop)
    // Set vehicles from preset with fake lookup results
    setVehicles(input.vehicles.map((v, i) => ({
      id: Date.now() + i,
      plate: '',
      lookup: { plate: '', make: 'Demo', model: v.type.toUpperCase(), year: 2023, fuelType: v.type, fuelLabel: v.type },
      lookupDone: true,
      mileage: v.usage,
    })))
  }, [])

  return (
    <div className="space-y-6">
      {/* Quick-fill presets */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground mr-1">Quick-fill:</span>
        {Object.entries(TCE_DEMO_PROFILES).map(([key, profile]) => (
          <Button key={key} variant="outline" size="sm" onClick={() => handlePreset(key)}>
            {profile.label}
          </Button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* ─── Step 1: Your Vehicle ──────────────────────────────── */}
        <Card>
          <CardContent className="py-5 px-5 space-y-4">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Your Vehicle</h3>
            </div>

            {vehicles.map((vehicle, idx) => (
              <div key={vehicle.id} className="space-y-3">
                {idx > 0 && <div className="border-t border-border pt-3" />}

                {/* Rego input */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={vehicle.plate}
                        onChange={(e) => handlePlateChange(vehicle.id, e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleLookup(vehicle.id) }}
                        placeholder="Enter rego e.g. ABC123"
                        maxLength={7}
                        className="flex-1 h-10 rounded-lg border border-border bg-input px-3 text-sm font-mono uppercase tracking-wider placeholder:text-muted-foreground placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <Button size="sm" className="h-10" onClick={() => handleLookup(vehicle.id)}>
                        <Search className="h-4 w-4 mr-1" />
                        Look up
                      </Button>
                    </div>
                  </div>
                  {vehicles.length > 1 && (
                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeVehicle(vehicle.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Lookup result */}
                {vehicle.lookupDone && vehicle.lookup && (
                  <div className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
                    <Car className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {vehicle.lookup.year} {vehicle.lookup.make} {vehicle.lookup.model}
                      </p>
                      <Badge variant="outline" className="text-xs mt-0.5">{vehicle.lookup.fuelLabel}</Badge>
                    </div>
                  </div>
                )}
                {vehicle.lookupDone && !vehicle.lookup && (
                  <div className="rounded-lg bg-muted/50 border border-border px-3 py-2">
                    <p className="text-sm text-muted-foreground">
                      Vehicle not found. Try: {DEMO_PLATES.slice(0, 3).map(p => (
                        <button key={p} className="text-primary font-mono mx-1 hover:underline" onClick={() => { handlePlateChange(vehicle.id, p); setTimeout(() => handleLookup(vehicle.id), 50) }}>{p}</button>
                      ))}
                    </p>
                  </div>
                )}

                {/* Mileage radio */}
                {vehicle.lookup && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Annual mileage</Label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {MILEAGE_OPTIONS.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleMileageChange(vehicle.id, opt.value)}
                          className={`rounded-lg border px-2 py-2 text-center transition-colors ${
                            vehicle.mileage === opt.value && opt.label === (vehicle.mileage === 'high' && i === 3 ? 'Very High' : MILEAGE_OPTIONS.find(m => m.value === vehicle.mileage)?.label)
                              ? 'border-primary bg-primary/5 text-foreground'
                              : vehicle.mileage === opt.value && i < 3
                              ? 'border-primary bg-primary/5 text-foreground'
                              : 'border-border hover:border-primary/40'
                          }`}
                        >
                          <p className="text-xs font-medium">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {vehicles.length < 3 && (
              <Button variant="ghost" size="sm" onClick={addVehicle} className="text-xs">
                <Plus className="h-3 w-3 mr-1" /> Add another vehicle
              </Button>
            )}
          </CardContent>
        </Card>

        {/* ─── Step 2: Your Home Energy ──────────────────────────── */}
        <Card>
          <CardContent className="py-5 px-5 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Your Home Energy</h3>
            </div>

            {/* EIQ placeholder */}
            <Button variant="outline" className="w-full justify-start text-muted-foreground" disabled>
              <Zap className="h-4 w-4 mr-2 text-primary" />
              Connect your energy bills via EIQ
              <Badge variant="secondary" className="ml-auto text-[10px]">Coming soon</Badge>
            </Button>

            <p className="text-xs text-muted-foreground">Or tell us about your home:</p>

            {/* Region + Occupants */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Region</Label>
                <Select value={region} onValueChange={(v) => setRegion(v as HouseholdInput['region'])}>
                  <SelectTrigger className="w-full h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REGION_OPTIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">People</Label>
                <div className="flex gap-1">
                  {OCCUPANT_OPTIONS.map(n => (
                    <Button key={n} type="button" variant={occupants === n ? 'default' : 'outline'} size="sm" className="flex-1 h-9" onClick={() => setOccupants(n)}>
                      {n === 5 ? '5+' : n}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Heating / Water / Cooktop — compact row per field */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Heating</Label>
                <Select value={heating} onValueChange={(v) => setHeating(v as HouseholdInput['heating'])}>
                  <SelectTrigger className="w-full h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {HEATING_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Hot water</Label>
                <Select value={waterHeating} onValueChange={(v) => setWaterHeating(v as HouseholdInput['waterHeating'])}>
                  <SelectTrigger className="w-full h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WATER_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Cooktop</Label>
                <Select value={cooktop} onValueChange={(v) => setCooktop(v as HouseholdInput['cooktop'])}>
                  <SelectTrigger className="w-full h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COOKTOP_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
