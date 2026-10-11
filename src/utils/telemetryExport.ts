import { MicroclimateState, MicroclimateOutput, CompiledSimulationParameters } from '../types';
import { FACILITY_TIERS } from '../data/facilityTiers';
import { calculateMicroClimate } from './simulationPhysics';

export interface TelemetryExportPayload {
  system_telemetry: {
    project_identifier: string;
    timestamp_utc: string;
    network_status: string;
    power_grid: {
      source_type: string;
      thermal_output_mw: number;
      electrical_conversion_kw: number;
      system_load_efficiency_pct: number;
    };
  };
  subterranean_bunker_matrix: {
    tier_depth_meters: number;
    structural_insulation: {
      ceramic_barrier_uniformity_pct: number;
      soil_thermal_mitigation_c: number;
      soil_damping_coefficient_c_per_m: number;
      damping_efficiency_pct: number;
    };
    micro_climate_sensors: {
      ambient_surface_temp_c: number;
      internal_vault_temp_c: number;
      relative_humidity_pct: number;
      dew_point_c: number;
      oxygen_concentration_pct: number;
      vapor_inversion_status: string;
      seed_moisture_retention_pct: number;
      etfe_membrane_layers: number;
      smr_cooling_extraction_rate_c: number;
      nitrogen_dewar_pressure_bar: number;
      air_circulation_cfm: number;
    };
  };
  epistemic_nlp_state: {
    active_manuscript: string;
    parsed_shloka_token: string;
    paninian_dependency_graph: {
      karta: string;
      karma: string;
      karana: string;
      kriya: string;
      adhikarana: string;
    };
    compiled_execution_variable: string;
    seed_coat_density_g_cm3: number;
    microbial_barrier_index: number;
    germination_viability_boost_pct: number;
    cryo_desiccation_tolerance_index: number;
  };
  biotechnology_propagation_node: {
    targeted_pathway: string;
    cellular_mechanisms: {
      meiosis_suppression_flag: boolean;
      chromosome_state: string;
      genetic_variance_coefficient: number;
      hybrid_vigor_preservation: boolean;
      f1_heterosis_retention_pct: number;
    };
    phytotron_hydroponic_feed: {
      nutrient_circulation_rate_lpm: number;
      ph_level: number;
      electrical_conductivity_ms_cm: number;
      dissolved_oxygen_ppm: number;
    };
  };
  facility_tier_metrics: Array<{
    tier_id: string;
    tier_name: string;
    sanskrit_name: string;
    depth_meters: number;
    ambient_temp_c: number;
    relative_humidity_pct: number;
    primary_function: string;
    active_subsystems: string[];
    equipment: string[];
  }>;
}

export function generateTelemetryPayload(
  microclimate: MicroclimateState,
  telemetry: MicroclimateOutput,
  appliedParams: CompiledSimulationParameters | null
): TelemetryExportPayload {
  const now = new Date().toISOString();

  // Generate dynamic metrics for all facility tiers based on current environmental conditions
  const tierMetrics = FACILITY_TIERS.map((tier) => {
    const tierSim = calculateMicroClimate(
      microclimate.ambientTemp,
      microclimate.etfeInsulation,
      tier.depthMeters,
      tier.id === 'tier3' ? microclimate.smrCoolingRate : Math.min(microclimate.smrCoolingRate, tier.depthMeters * 0.8)
    );

    return {
      tier_id: tier.id,
      tier_name: tier.name,
      sanskrit_name: tier.sanskritName,
      depth_meters: tier.depthMeters,
      ambient_temp_c: tier.id === 'tier3' ? telemetry.vaultTemperatureCelsius : tierSim.vaultTemperatureCelsius,
      relative_humidity_pct: tier.id === 'tier3' ? telemetry.relativeHumidityPercent : tierSim.relativeHumidityPercent,
      primary_function: tier.primaryFunction,
      active_subsystems: tier.systems,
      equipment: tier.equipment
    };
  });

  const payload: TelemetryExportPayload = {
    system_telemetry: {
      project_identifier: "Amit-Nishanka-Anusandhan-AgriCore",
      timestamp_utc: now,
      network_status: "SECURE_SATELLITE_LINK_5G",
      power_grid: {
        source_type: "SMR_MHD_CLOSED_LOOP",
        thermal_output_mw: 15.4,
        electrical_conversion_kw: 4200.5,
        system_load_efficiency_pct: 84.6
      }
    },
    subterranean_bunker_matrix: {
      tier_depth_meters: microclimate.soilDepth,
      structural_insulation: {
        ceramic_barrier_uniformity_pct: 99.85,
        soil_thermal_mitigation_c: telemetry.naturalSoilIsolation,
        soil_damping_coefficient_c_per_m: 1.85,
        damping_efficiency_pct: telemetry.thermalDampingEfficiencyPct
      },
      micro_climate_sensors: {
        ambient_surface_temp_c: microclimate.ambientTemp,
        internal_vault_temp_c: telemetry.vaultTemperatureCelsius,
        relative_humidity_pct: telemetry.relativeHumidityPercent,
        dew_point_c: telemetry.dewPointCelsius,
        oxygen_concentration_pct: 14.2,
        vapor_inversion_status: telemetry.vaultTemperatureCelsius <= -15 ? "CRYOGENIC_LOCK" : "STABLE",
        seed_moisture_retention_pct: telemetry.seedMoistureRetentionPct,
        etfe_membrane_layers: microclimate.etfeInsulation,
        smr_cooling_extraction_rate_c: microclimate.smrCoolingRate,
        nitrogen_dewar_pressure_bar: microclimate.nitrogenDewarPressureBar,
        air_circulation_cfm: microclimate.airCirculationCFM
      }
    },
    epistemic_nlp_state: {
      active_manuscript: "Vrikshayurveda_Seed_Preservation",
      parsed_shloka_token: "Bijamrita Shodhana Vapana Kriya",
      paninian_dependency_graph: {
        karta: "automated_phytotron_controller",
        karma: "target_seed_envelope_matrix",
        karana: "organic_bijamrita_coating",
        kriya: "execute_sowing_sequence",
        adhikarana: `Subterranean Tier ${appliedParams?.recommendedTier || 2} Seed Vault`
      },
      compiled_execution_variable: appliedParams
        ? `SYS_EXEC_TIER_${appliedParams.recommendedTier}_${appliedParams.cellularPathwayTrigger.toUpperCase()}`
        : "SYS_EXEC_EXECUTE_SOWING_SEQUENCE",
      seed_coat_density_g_cm3: appliedParams?.seedCoatDensity || 1.62,
      microbial_barrier_index: appliedParams?.microbialBarrierIndex || 0.94,
      germination_viability_boost_pct: appliedParams?.germinationViabilityBoostPct || 32.8,
      cryo_desiccation_tolerance_index: appliedParams?.cryoDesiccationTolerance || 0.92
    },
    biotechnology_propagation_node: {
      targeted_pathway: appliedParams?.cellularPathwayTrigger || "APOSPORY",
      cellular_mechanisms: {
        meiosis_suppression_flag: true,
        chromosome_state: "2n_DIPLOID_CONTINUITY",
        genetic_variance_coefficient: 0.0000,
        hybrid_vigor_preservation: true,
        f1_heterosis_retention_pct: appliedParams?.f1HeterosisRetentionPct || 99.8
      },
      phytotron_hydroponic_feed: {
        nutrient_circulation_rate_lpm: 24.5,
        ph_level: 6.35,
        electrical_conductivity_ms_cm: 1.82,
        dissolved_oxygen_ppm: 12.0
      }
    },
    facility_tier_metrics: tierMetrics
  };

  return payload;
}

/**
 * Triggers a download of the active telemetry JSON file
 */
export function exportTelemetryJson(
  microclimate: MicroclimateState,
  telemetry: MicroclimateOutput,
  appliedParams: CompiledSimulationParameters | null
): void {
  const payload = generateTelemetryPayload(microclimate, telemetry, appliedParams);
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `AgriCore_Telemetry_${timestamp}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
