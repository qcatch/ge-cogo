/** NZ regions for regional pricing and heating multipliers */
export type Region =
  | 'northland'
  | 'auckland'
  | 'waikato'
  | 'bay-of-plenty'
  | 'gisborne'
  | 'hawkes-bay'
  | 'taranaki'
  | 'manawatu'
  | 'wellington'
  | 'nelson'
  | 'tasman'
  | 'marlborough'
  | 'west-coast'
  | 'canterbury'
  | 'otago'
  | 'southland'

export type HeatingType = 'gas' | 'lpg' | 'wood' | 'electric-resistive' | 'heat-pump'
export type WaterHeatingType = 'gas' | 'lpg' | 'electric-resistive' | 'heat-pump' | 'solar'
export type CooktopType = 'gas' | 'lpg' | 'electric-resistive' | 'induction'
export type VehicleType = 'petrol' | 'diesel' | 'electric' | 'phev' | 'hybrid' | 'none'
export type VehicleUsage = 'low' | 'medium' | 'high'

export interface VehicleInput {
  type: VehicleType
  usage: VehicleUsage
}

export interface HouseholdInput {
  region: Region
  occupants: number
  heating: HeatingType
  waterHeating: WaterHeatingType
  cooktop: CooktopType
  vehicles: VehicleInput[]
  /** Whether the household wants to include solar in electrified scenario */
  includeSolar: boolean
}

/** Per-vector energy cost breakdown */
export interface EnergyBreakdown {
  /** Annual electricity cost in NZD */
  electricity: number
  /** Annual gas cost in NZD (0 if no gas appliances) */
  gas: number
  /** Annual petrol/diesel/transport cost in NZD */
  transport: number
  /** Sum of all vectors */
  total: number
}

/** Individual consumption breakdown by category in kWh/year */
export interface ConsumptionBreakdown {
  heating: number
  waterHeating: number
  cooktop: number
  baseAppliances: number
  vehicles: number
  total: number
}

export interface SwitchRecommendation {
  /** What appliance/vehicle is being switched */
  category: 'heating' | 'water-heating' | 'cooktop' | 'vehicle' | 'solar'
  /** Human-readable title */
  title: string
  /** What the switch involves */
  description: string
  /** Upfront cost in NZD */
  upfrontCost: number
  /** Annual saving in NZD */
  annualSaving: number
  /** Years to pay back the investment */
  paybackYears: number
  /** Priority rank (1 = best ROI) */
  priority: number
}

export interface EmissionsResult {
  /** Current annual CO2 emissions in tonnes */
  currentTonnes: number
  /** Electrified annual CO2 emissions in tonnes */
  electrifiedTonnes: number
  /** Reduction in tonnes */
  reductionTonnes: number
  /** Percentage reduction */
  reductionPercent: number
}

/** Complete output from calculateTCE() */
export interface TCEResult {
  /** Current annual energy costs across all vectors */
  currentCosts: EnergyBreakdown
  /** Projected annual costs if fully electrified */
  electrifiedCosts: EnergyBreakdown
  /** Annual savings */
  annualSavings: number
  /** Monthly savings */
  monthlySavings: number
  /** Savings as percentage of current costs */
  savingsPercent: number
  /** Current vs electrified consumption */
  currentConsumption: ConsumptionBreakdown
  electrifiedConsumption: ConsumptionBreakdown
  /** Ordered list of recommended switches (best ROI first) */
  roadmap: SwitchRecommendation[]
  /** Total upfront investment for full electrification */
  totalUpfrontCost: number
  /** CO2 emissions comparison */
  emissions: EmissionsResult
}
