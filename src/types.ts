export type FacilityTierId = 'dome' | 'tier1' | 'tier2' | 'tier3' | 'smr';

export interface TierData {
  id: FacilityTierId;
  name: string;
  sanskritName: string;
  depthMeters: number;
  temperatureCelsius: number;
  relativeHumidityPercent: number;
  primaryFunction: string;
  systems: string[];
  equipment: string[];
}

export interface MicroclimateState {
  ambientTemp: number; // °C (e.g. 38)
  soilDepth: number; // meters (e.g. 8)
  etfeInsulation: number; // layers (e.g. 3)
  smrCoolingRate: number; // °C extraction (e.g. 12.5)
  nitrogenDewarPressureBar: number;
  airCirculationCFM: number;
  solarParRadiationUmols: number;
}

export interface MicroclimateOutput {
  naturalSoilIsolation: number;
  vaultTemperatureCelsius: number;
  relativeHumidityPercent: number;
  dewPointCelsius: number;
  thermalDampingEfficiencyPct: number;
  seedMoistureRetentionPct: number;
}

export interface PaniniDeconstruction {
  term: string;
  transliteration: string;
  meaning: string;
  dhatu: string;
  dhatuMeaning: string;
  pratyaya: string;
  pratyayaType: string;
  paniniRule: string;
  modernEquivalent: string;
}

export interface KarakaGraphNode {
  role: 'Karta' | 'Karma' | 'Karana' | 'Sampradana' | 'Apadana' | 'Adhikarana';
  roleEnglish: string;
  sanskritPhrase: string;
  operationalEntity: string;
  description: string;
}

export interface CompiledSimulationParameters {
  seedCoatDensity: number; // g/cm³ or g/L
  microbialBarrierIndex: number; // 0 to 1.0
  germinationViabilityBoostPct: number; // %
  cryoDesiccationTolerance: number; // 0 to 1.0
  recommendedTier: number; // 1, 2, or 3
  cellularPathwayTrigger: 'Apospory' | 'Diplospory' | 'Standard Meiotic';
  f1HeterosisRetentionPct: number; // 0 to 100%
  nitrogenFixationCurveMultiplier: number;
}

export interface ManuscriptEntry {
  id: string;
  title: string;
  sourceText: string;
  century: string;
  author: string;
  shlokaDevanagari: string;
  shlokaIAST: string;
  englishTranslation: string;
  agronomicDomain: 'Seed Coating (Bijamrita)' | 'Fumigation (Dhupana)' | 'Subterranean Storage (Bhumi-Vasa)' | 'Bio-Fermentation (Kunapajala)';
  deconstructedTerms: PaniniDeconstruction[];
  karakaGraph: KarakaGraphNode[];
  compiledParameters: CompiledSimulationParameters;
  scientificValidation: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  universityCode: string;
  institution: 'IGNOU' | 'OUAT' | 'JOINT_ACADEMY';
  description: string;
  learningObjectives: string[];
  challenge: {
    prompt: string;
    targetTier: FacilityTierId;
    targetMetric: string;
    minGoal: number;
    maxGoal: number;
    hint: string;
  };
}

export interface ResearcherPodState {
  researcher1Role: string;
  researcher2Role: string;
  hologramActive: boolean;
  hologramProjectionType: 'seed_embryo' | 'baoli_thermal' | 'manuscript_scroll' | 'apomixis_dna';
  podStatus: 'ONLINE_SYNCED' | 'CALIBRATING' | 'CRYO_LOCK';
  audioResonanceEnabled: boolean;
}

export interface SensorFeedReading {
  timestamp: string;
  timeSeconds: number;
  relativeHumidityPercent: number;
  soilMoistureVwcPercent: number;
  atmosphericPressureHpa: number;
  vaultPressureBar: number;
  vaultTemperatureCelsius: number;
  soilBedrockTemperatureCelsius: number;
  oxygenConcentrationPercent: number;
  solarParRadiationUmols: number;
  tierId: FacilityTierId;
}
