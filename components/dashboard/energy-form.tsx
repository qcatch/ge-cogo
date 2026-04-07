'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Zap, ArrowRight } from 'lucide-react'
import type { HouseholdInput, Region, HeatingType, WaterHeatingType, CooktopType, VehicleType, VehicleUsage, VehicleInput } from '@/lib/energy-model/types'
import { DEMO_PROFILES } from '@/lib/energy-model'

const REGIONS: { label: string; value: Region }[] = [
  { label: 'Northland', value: 'northland' },
  { label: 'Auckland', value: 'auckland' },
  { label: 'Waikato', value: 'waikato' },
  { label: 'Bay of Plenty', value: 'bay-of-plenty' },
  { label: 'Gisborne', value: 'gisborne' },
  { label: "Hawke's Bay", value: 'hawkes-bay' },
  { label: 'Taranaki', value: 'taranaki' },
  { label: 'Manawatu', value: 'manawatu' },
  { label: 'Wellington', value: 'wellington' },
  { label: 'Nelson', value: 'nelson' },
  { label: 'Tasman', value: 'tasman' },
  { label: 'Marlborough', value: 'marlborough' },
  { label: 'West Coast', value: 'west-coast' },
  { label: 'Canterbury', value: 'canterbury' },
  { label: 'Otago', value: 'otago' },
  { label: 'Southland', value: 'southland' },
]

const HEATING_OPTIONS: { label: string; value: HeatingType }[] = [
  { label: 'Gas heater', value: 'gas' },
  { label: 'LPG heater', value: 'lpg' },
  { label: 'Wood burner', value: 'wood' },
  { label: 'Electric heater', value: 'electric-resistive' },
  { label: 'Heat pump', value: 'heat-pump' },
]

const WATER_OPTIONS: { label: string; value: WaterHeatingType }[] = [
  { label: 'Gas califont/cylinder', value: 'gas' },
  { label: 'LPG', value: 'lpg' },
  { label: 'Electric cylinder', value: 'electric-resistive' },
  { label: 'Heat pump hot water', value: 'heat-pump' },
  { label: 'Solar hot water', value: 'solar' },
]

const COOKTOP_OPTIONS: { label: string; value: CooktopType }[] = [
  { label: 'Gas hob', value: 'gas' },
  { label: 'LPG hob', value: 'lpg' },
  { label: 'Electric element', value: 'electric-resistive' },
  { label: 'Induction', value: 'induction' },
]

const VEHICLE_TYPE_OPTIONS: { label: string; value: VehicleType }[] = [
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Plug-in hybrid', value: 'phev' },
  { label: 'Electric', value: 'electric' },
  { label: 'No vehicle', value: 'none' },
]

const VEHICLE_USAGE_OPTIONS: { label: string; value: VehicleUsage }[] = [
  { label: 'Low (~50 km/week)', value: 'low' },
  { label: 'Medium (~210 km/week)', value: 'medium' },
  { label: 'High (~400 km/week)', value: 'high' },
]

interface EnergyFormProps {
  onSubmit: (input: HouseholdInput) => void
  onDemo: (profileKey: string) => void
  defaultValues?: HouseholdInput | null
}

export function EnergyForm({ onSubmit, onDemo, defaultValues }: EnergyFormProps) {
  const [region, setRegion] = useState<Region>(defaultValues?.region ?? 'auckland')
  const [occupants, setOccupants] = useState(String(defaultValues?.occupants ?? 3))
  const [heating, setHeating] = useState<HeatingType>(defaultValues?.heating ?? 'gas')
  const [waterHeating, setWaterHeating] = useState<WaterHeatingType>(defaultValues?.waterHeating ?? 'gas')
  const [cooktop, setCooktop] = useState<CooktopType>(defaultValues?.cooktop ?? 'gas')
  const [vehicles, setVehicles] = useState<VehicleInput[]>(
    defaultValues?.vehicles ?? [{ type: 'petrol', usage: 'medium' }]
  )
  const [includeSolar, setIncludeSolar] = useState(defaultValues?.includeSolar ?? false)

  function handleSubmit() {
    const input: HouseholdInput = {
      region,
      occupants: parseInt(occupants, 10),
      heating,
      waterHeating,
      cooktop,
      vehicles,
      includeSolar,
    }
    onSubmit(input)
  }

  function addVehicle() {
    if (vehicles.length < 3) {
      setVehicles([...vehicles, { type: 'petrol', usage: 'medium' }])
    }
  }

  function removeVehicle(index: number) {
    setVehicles(vehicles.filter((_, i) => i !== index))
  }

  function updateVehicle(index: number, field: keyof VehicleInput, value: string) {
    const updated = [...vehicles]
    updated[index] = { ...updated[index], [field]: value }
    setVehicles(updated)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tell us about your home</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Region + Occupants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>North Island</SelectLabel>
                    {REGIONS.slice(0, 9).map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>South Island</SelectLabel>
                    {REGIONS.slice(9).map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>People in household</Label>
              <Select value={occupants} onValueChange={setOccupants}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n === 5 ? '5+' : String(n)} {n === 1 ? 'person' : 'people'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Heating */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Main heating</Label>
            <RadioGroup
              value={heating}
              onValueChange={(v) => setHeating(v as HeatingType)}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {HEATING_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 rounded-lg border border-input p-3 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem value={opt.value} />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Water Heating */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Hot water</Label>
            <RadioGroup
              value={waterHeating}
              onValueChange={(v) => setWaterHeating(v as WaterHeatingType)}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {WATER_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 rounded-lg border border-input p-3 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem value={opt.value} />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Cooktop */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Cooktop</Label>
            <RadioGroup
              value={cooktop}
              onValueChange={(v) => setCooktop(v as CooktopType)}
              className="grid grid-cols-2 gap-2"
            >
              {COOKTOP_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 rounded-lg border border-input p-3 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem value={opt.value} />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Vehicles */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Vehicles</Label>
            {vehicles.map((vehicle, i) => (
              <div key={i} className="flex items-end gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Select
                    value={vehicle.type}
                    onValueChange={(v) => updateVehicle(i, 'type', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={vehicle.usage}
                    onValueChange={(v) => updateVehicle(i, 'usage', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_USAGE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {vehicles.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVehicle(i)}
                    aria-label="Remove vehicle"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {vehicles.length < 3 && (
              <Button variant="outline" size="sm" onClick={addVehicle}>
                <Plus className="h-4 w-4 mr-1" /> Add vehicle
              </Button>
            )}
          </div>

          <Separator />

          {/* Solar */}
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={includeSolar}
              onCheckedChange={(checked) => setIncludeSolar(checked === true)}
            />
            <div>
              <span className="text-sm font-medium">Include solar panels</span>
              <p className="text-xs text-muted-foreground">Model a 5kW rooftop solar system in the electrified scenario</p>
            </div>
          </label>

          {/* Submit */}
          <Button onClick={handleSubmit} size="lg" className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Calculate my Total Cost of Energy
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Demo Profiles */}
      <div className="text-center space-y-3">
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">or try a demo profile</span>
          <Separator className="flex-1" />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(DEMO_PROFILES).map(([key, profile]) => (
            <Button key={key} variant="outline" size="sm" onClick={() => onDemo(key)}>
              {profile.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
