'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { householdInputSchema, type HouseholdInputForm } from '@/lib/energy-model/schemas'
import { TCE_DEMO_PROFILES } from '@/lib/energy-model'
import type { HouseholdInput } from '@/lib/energy-model'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Sun } from 'lucide-react'

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

const HEATING_OPTIONS = [
  { value: 'heat-pump', label: 'Heat pump' },
  { value: 'gas', label: 'Gas' },
  { value: 'lpg', label: 'LPG' },
  { value: 'electric-resistive', label: 'Electric (resistive)' },
  { value: 'wood', label: 'Wood burner' },
] as const

const WATER_HEATING_OPTIONS = [
  { value: 'electric-resistive', label: 'Electric cylinder' },
  { value: 'gas', label: 'Gas' },
  { value: 'lpg', label: 'LPG' },
  { value: 'heat-pump', label: 'Heat pump' },
  { value: 'solar', label: 'Solar' },
] as const

const COOKTOP_OPTIONS = [
  { value: 'gas', label: 'Gas' },
  { value: 'electric-resistive', label: 'Electric' },
  { value: 'induction', label: 'Induction' },
  { value: 'lpg', label: 'LPG' },
] as const

const VEHICLE_TYPE_OPTIONS = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'phev', label: 'Plug-in Hybrid' },
  { value: 'electric', label: 'Electric' },
  { value: 'none', label: 'No vehicle' },
] as const

const VEHICLE_USAGE_OPTIONS = [
  { value: 'low', label: 'Low (~50km/wk)' },
  { value: 'medium', label: 'Medium (~210km/wk)' },
  { value: 'high', label: 'High (~400km/wk)' },
] as const

const OCCUPANT_OPTIONS = [1, 2, 3, 4, 5] as const

// ─── Component ────────────────────────────────────────────────────────────────

interface TCEFormProps {
  onInputChange: (input: HouseholdInput) => void
  defaultInput: HouseholdInput
}

export function TCEForm({ onInputChange, defaultInput }: TCEFormProps) {
  const { control, reset, setValue, getValues } = useForm<HouseholdInputForm>({
    resolver: zodResolver(householdInputSchema),
    defaultValues: defaultInput as HouseholdInputForm,
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vehicles',
  })

  // Stable ref for the callback to avoid re-render loops
  const onInputChangeRef = useRef(onInputChange)
  onInputChangeRef.current = onInputChange

  // Watch all form values and propagate to parent
  const watchedValues = useWatch({ control })

  useEffect(() => {
    const vehicles = (watchedValues.vehicles ?? []).map(v => ({
      type: v?.type ?? 'petrol' as const,
      usage: v?.usage ?? 'medium' as const,
    }))
    const values: HouseholdInput = {
      region: watchedValues.region ?? 'auckland',
      occupants: watchedValues.occupants ?? 4,
      heating: watchedValues.heating ?? 'gas',
      waterHeating: watchedValues.waterHeating ?? 'gas',
      cooktop: watchedValues.cooktop ?? 'gas',
      vehicles,
      includeSolar: watchedValues.includeSolar ?? false,
    }
    onInputChangeRef.current(values)
  }, [watchedValues])

  const handlePreset = useCallback((key: string) => {
    const profile = TCE_DEMO_PROFILES[key]
    if (profile) reset(profile.input as HouseholdInputForm)
  }, [reset])

  return (
    <div className="space-y-6">
      {/* Quick-fill presets */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground mr-1">Quick-fill:</span>
        {Object.entries(TCE_DEMO_PROFILES).map(([key, profile]) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            onClick={() => handlePreset(key)}
          >
            {profile.label}
          </Button>
        ))}
      </div>

      {/* Form card */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-6 px-5 space-y-8">

          {/* Region + Occupants row */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Region</Label>
              <Controller
                control={control}
                name="region"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGION_OPTIONS.map(r => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">People in household</Label>
              <Controller
                control={control}
                name="occupants"
                render={({ field }) => (
                  <div className="flex gap-1">
                    {OCCUPANT_OPTIONS.map(n => (
                      <Button
                        key={n}
                        type="button"
                        variant={field.value === n ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => field.onChange(n)}
                      >
                        {n === 5 ? '5+' : n}
                      </Button>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Heating */}
          <fieldset className="space-y-3">
            <Label className="text-sm font-medium">Space heating</Label>
            <Controller
              control={control}
              name="heating"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                >
                  {HEATING_OPTIONS.map(opt => (
                    <Label
                      key={opt.value}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                        field.value === opt.value
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="sr-only" />
                      <span className="text-sm">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
          </fieldset>

          {/* Water heating */}
          <fieldset className="space-y-3">
            <Label className="text-sm font-medium">Hot water</Label>
            <Controller
              control={control}
              name="waterHeating"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                >
                  {WATER_HEATING_OPTIONS.map(opt => (
                    <Label
                      key={opt.value}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                        field.value === opt.value
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="sr-only" />
                      <span className="text-sm">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
          </fieldset>

          {/* Cooktop */}
          <fieldset className="space-y-3">
            <Label className="text-sm font-medium">Cooktop</Label>
            <Controller
              control={control}
              name="cooktop"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  {COOKTOP_OPTIONS.map(opt => (
                    <Label
                      key={opt.value}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                        field.value === opt.value
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="sr-only" />
                      <span className="text-sm">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
          </fieldset>

          {/* Solar checkbox */}
          <div className="flex items-center gap-3">
            <Controller
              control={control}
              name="includeSolar"
              render={({ field }) => (
                <Checkbox
                  id="include-solar"
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="include-solar" className="text-sm cursor-pointer flex items-center gap-2">
              <Sun className="h-4 w-4 text-primary" />
              Include rooftop solar in electrified scenario
            </Label>
          </div>

          {/* Vehicles */}
          <fieldset className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Vehicles</Label>
              {fields.length < 4 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => append({ type: 'petrol', usage: 'medium' })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add vehicle
                </Button>
              )}
            </div>

            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">
                No vehicles — add one to include transport costs.
              </p>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-10 shrink-0">
                    Car {index + 1}
                  </span>

                  <Controller
                    control={control}
                    name={`vehicles.${index}.type`}
                    render={({ field: f }) => (
                      <Select value={f.value} onValueChange={f.onChange}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VEHICLE_TYPE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    control={control}
                    name={`vehicles.${index}.usage`}
                    render={({ field: f }) => (
                      <Select value={f.value} onValueChange={f.onChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VEHICLE_USAGE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </fieldset>

        </CardContent>
      </Card>
    </div>
  )
}
