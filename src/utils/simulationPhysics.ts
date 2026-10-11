import { MicroclimateState, MicroclimateOutput } from '../types';

/**
 * Core Micro-Climate Thermal Balancer Simulation Loop
 * Specified by the Amit Nishanka Anusandhan AgriCore Technical Framework
 */
export function calculateMicroClimate(
  ambientTemp: number,
  etfeInsulation: number,
  soilDepth: number,
  smrCoolingRate: number
): MicroclimateOutput {
  // Sub-Surface Thermal Gradient: Soil provides a natural thermal damping coefficient of 1.85°C per meter down
  const naturalSoilIsolation = Math.max(0, soilDepth * 1.85);
  let internalVaultTemp = ambientTemp - naturalSoilIsolation;

  // Apply ETFE dome insulation properties (infrared barrier & air cushion damping)
  internalVaultTemp += (etfeInsulation * 0.12);

  // Active SMR-MHD refrigeration extraction loop
  internalVaultTemp -= smrCoolingRate;

  const vaultTemperatureCelsius = parseFloat(internalVaultTemp.toFixed(2));
  
  // Dynamic Relative Humidity calculation with vapor-inversion protection
  const relativeHumidityPercent = parseFloat(
    Math.min(95, Math.max(35, 100 - (internalVaultTemp * 2.1))).toFixed(1)
  );

  // Dew point approximation (Magnus-Tetens formula derivative)
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * vaultTemperatureCelsius) / (b + Math.max(0.1, vaultTemperatureCelsius))) + Math.log(relativeHumidityPercent / 100);
  const dewPointCelsius = parseFloat(((b * alpha) / (a - alpha)).toFixed(2));

  // Thermal Damping Efficiency
  const thermalDampingEfficiencyPct = parseFloat(
    Math.min(100, Math.max(0, (naturalSoilIsolation / Math.max(1, ambientTemp)) * 100)).toFixed(1)
  );

  // Seed Moisture Retention % using Ellis-Roberts equilibrium moisture model
  const seedMoistureRetentionPct = parseFloat(
    Math.min(16, Math.max(5, 7.5 + (relativeHumidityPercent * 0.08) - (vaultTemperatureCelsius * 0.05))).toFixed(2)
  );

  return {
    naturalSoilIsolation: parseFloat(naturalSoilIsolation.toFixed(2)),
    vaultTemperatureCelsius,
    relativeHumidityPercent,
    dewPointCelsius,
    thermalDampingEfficiencyPct,
    seedMoistureRetentionPct
  };
}

/**
 * Calculates tier-specific telemetry based on subterranean depth and active systems
 */
export function getTierTelemetry(tierDepth: number, microclimate: MicroclimateState) {
  return calculateMicroClimate(
    microclimate.ambientTemp,
    microclimate.etfeInsulation,
    tierDepth,
    microclimate.smrCoolingRate
  );
}

/**
 * Cellular Apomixis & Chromosome Stability Calculation
 * Verifies continuous 2n chromosome counts and F1 heterosis vigor
 */
export interface ApomixisSimulationResult {
  pathway: 'Apospory' | 'Diplospory' | 'Sexual_Meiotic';
  chromosomeCount: '2n' | '1n/2n Segregated';
  isClonal: boolean;
  heterosisRetentionPct: number;
  embryoViabilityCryoPct: number;
  embryoOriginCell: string;
  meiosisStatus: string;
}

export function simulateApomixisPathway(
  pathway: 'Apospory' | 'Diplospory' | 'Sexual_Meiotic',
  storageTempCelsius: number,
  seedCoatDensity: number,
  microbialBarrierIndex: number
): ApomixisSimulationResult {
  // Protective effect of Bijamrita seed-coating on vitrification
  const coatBonus = (seedCoatDensity / 1.5) * 15 * microbialBarrierIndex;

  if (pathway === 'Apospory') {
    // Unreduced embryo sac develops directly from somatic nucellus cell
    const baseViability = storageTempCelsius <= -15 ? 94.5 : storageTempCelsius <= 0 ? 82.0 : 68.0;
    return {
      pathway: 'Apospory',
      chromosomeCount: '2n',
      isClonal: true,
      heterosisRetentionPct: 99.8,
      embryoViabilityCryoPct: parseFloat(Math.min(99.9, baseViability + coatBonus).toFixed(1)),
      embryoOriginCell: 'Somatic Nucellar Cell (Bypasses Megaspore Mother Cell)',
      meiosisStatus: 'Meiosis Completely Abolished — Diploid Parthenogenesis'
    };
  }

  if (pathway === 'Diplospory') {
    // Embryo sac develops from megaspore mother cell with omitted or failed meiosis
    const baseViability = storageTempCelsius <= -15 ? 91.2 : storageTempCelsius <= 0 ? 79.5 : 64.0;
    return {
      pathway: 'Diplospory',
      chromosomeCount: '2n',
      isClonal: true,
      heterosisRetentionPct: 98.6,
      embryoViabilityCryoPct: parseFloat(Math.min(99.0, baseViability + coatBonus).toFixed(1)),
      embryoOriginCell: 'Megaspore Mother Cell (Unreduced Meiotic Restitution)',
      meiosisStatus: 'Meiosis Modified (Apomeiosis) — 2n Restitution Nucleus'
    };
  }

  // Standard Sexual Meiosis
  const baseViability = storageTempCelsius <= -15 ? 78.0 : storageTempCelsius <= 0 ? 61.0 : 45.0;
  return {
    pathway: 'Sexual_Meiotic',
    chromosomeCount: '1n/2n Segregated',
    isClonal: false,
    heterosisRetentionPct: 50.0, // 50% loss of hybrid vigor per generation due to Mendelian segregation
    embryoViabilityCryoPct: parseFloat(Math.min(92.0, baseViability + (coatBonus * 0.7)).toFixed(1)),
    embryoOriginCell: 'Haploid Egg Cell fertilized by Pollen Sperm (1n + 1n)',
    meiosisStatus: 'Standard Meiosis I & II with Chromosomal Crossover'
  };
}
