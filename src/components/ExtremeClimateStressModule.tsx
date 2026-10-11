import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MicroclimateState, MicroclimateOutput } from '../types';
import { calculateMicroClimate } from '../utils/simulationPhysics';
import { 
  CloudRain, 
  Flame, 
  Wind, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  Gauge, 
  Sparkles, 
  Layers, 
  FileCheck2,
  Play,
  Pause,
  TrendingDown,
  TrendingUp,
  Activity,
  Sun,
  Droplets,
  Thermometer,
  Shield,
  Zap,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface Props {
  currentState: MicroclimateState;
  currentTelemetry: MicroclimateOutput;
  onApplyScenario: (newState: MicroclimateState) => void;
}

type GraphTab = 'transient_temp' | 'depth_profile' | 'etfe_optics';

interface StressScenario {
  id: string;
  name: string;
  sanskritName: string;
  icon: typeof CloudRain;
  tagColor: string;
  description: string;
  targetAmbientTemp: number;
  targetSoilDepth: number;
  targetEtfeLayers: number;
  targetSmrCooling: number;
  targetParRadiation: number;
  targetAirflow: number;
  environmentalPhenomenon: string;
  mitigationResponse: string[];
  expectedVaultTemp: number;
  vaporInversionStatus: 'STABLE' | 'UNSTABLE_WARNING' | 'CRITICAL_SURGE';
  etfeIrDeflectionPct: number;
  etfeUValue: number; // W/m²·K
  earthDampingHours: number; // Phase lag in hours
}

const SCENARIOS: StressScenario[] = [
  {
    id: 'monsoon_flood',
    name: 'Super-Cyclonic Monsoon Deluge',
    sanskritName: 'महा-वर्षोपप्लव (Mahā-Varṣopaplava)',
    icon: CloudRain,
    tagColor: 'text-blue-400 bg-blue-950/60 border-blue-800',
    description: 'Torrential 150mm/hr precipitation inundates surface terrain, doubling soil thermal conductivity to 2.4 W/m·K and pushing surface air humidity past 96%.',
    targetAmbientTemp: 24.5,
    targetSoilDepth: 8.0,
    targetEtfeLayers: 3,
    targetSmrCooling: 12.5,
    targetParRadiation: 320,
    targetAirflow: 3200,
    environmentalPhenomenon: 'Flash soil moisture saturation, severe cloud cover attenuating PAR, and hydrostatic pressure on Baoli step walls.',
    mitigationResponse: [
      'Subterranean Geothermal Sump automatic high-capacity drainage pumps (140 L/min)',
      'Dual hermetic inflatable ethylene-propylene gasket seals on Tier 3 armored doors',
      'Positive internal argon blanket preventing aqueous vapor intrusion into seed dewars',
      'ETFE hydrophilic exterior coating channels 100% surface precipitation to nursery cisterns'
    ],
    expectedVaultTemp: -18.0,
    vaporInversionStatus: 'STABLE',
    etfeIrDeflectionPct: 62.0,
    etfeUValue: 1.85,
    earthDampingHours: 14.5
  },
  {
    id: 'extreme_heatwave',
    name: '50.5°C Super-Heatwave (Loo Surge)',
    sanskritName: 'प्रचण्ड-ग्रीष्म-प्रवाह (Pracaṇḍa-Grīṣma-Pravāha)',
    icon: Flame,
    tagColor: 'text-amber-400 bg-amber-950/60 border-amber-800',
    description: 'Catastrophic northern plains heatwave with ambient sol-air temperatures exceeding 50.5°C and intense solar PAR flux (1,320 µmol/m²s).',
    targetAmbientTemp: 50.5,
    targetSoilDepth: 8.0,
    targetEtfeLayers: 4,
    targetSmrCooling: 18.0,
    targetParRadiation: 1320,
    targetAirflow: 5600,
    environmentalPhenomenon: 'Massive surface radiative heat influx attempting to penetrate subterranean earth mass and overwhelm passive cooling.',
    mitigationResponse: [
      'ETFE pneumatic cushion dynamic infrared-blocking nanoparticles engage (85% IR deflection)',
      'SMR-MHD closed-loop refrigeration loop ramps to 18.0°C active extraction rate',
      'Baoli 8-meter subterranean stepped bedrock provides passive -14.8°C thermal buffer',
      'Apospory cellular trigger locked to maternal 2n continuity to safeguard embryo vigor'
    ],
    expectedVaultTemp: -18.0,
    vaporInversionStatus: 'STABLE',
    etfeIrDeflectionPct: 85.5,
    etfeUValue: 1.32,
    earthDampingHours: 18.2
  },
  {
    id: 'arid_drought',
    name: 'Severe Drought & Surface Desiccation',
    sanskritName: 'दीर्घ-अनावृष्टि (Dīrgha-Anāvṛṣṭi)',
    icon: Wind,
    tagColor: 'text-orange-400 bg-orange-950/60 border-orange-800',
    description: 'Prolonged drought causing surface soil desiccation and humidity dropping to 18%, risking moisture vapor extraction from upper root systems.',
    targetAmbientTemp: 44.0,
    targetSoilDepth: 8.0,
    targetEtfeLayers: 3,
    targetSmrCooling: 14.0,
    targetParRadiation: 1100,
    targetAirflow: 3800,
    environmentalPhenomenon: 'Extreme surface vapor deficit attempting to pull moisture from subterranean seeds through soil capillary porosity.',
    mitigationResponse: [
      'Vapor-inversion closed loop maintains stable relative humidity (70-76%) in Tier 2/3',
      'Overhead ETFE condensation harvesting recycles water directly to hydroponic nursery',
      'Somatic nucellar apomixis protective enzymes preserve embryo vitrification state',
      'Argon gas pressurized micro-environment blocks desiccation across seed cryo-canisters'
    ],
    expectedVaultTemp: -18.0,
    vaporInversionStatus: 'STABLE',
    etfeIrDeflectionPct: 78.0,
    etfeUValue: 1.85,
    earthDampingHours: 16.0
  },
  {
    id: 'sudden_thermal_spike',
    name: 'Sudden Infiltration Spike Anomaly',
    sanskritName: 'सहसा-उष्ण-आघात (Sahasā-Uṣṇa-Āghāta)',
    icon: AlertTriangle,
    tagColor: 'text-red-400 bg-red-950/60 border-red-800',
    description: 'Simulates a transient primary loop chiller containment fault where ambient thermal spike tests emergency recovery coils before auto-mitigation locks in.',
    targetAmbientTemp: 46.0,
    targetSoilDepth: 6.0,
    targetEtfeLayers: 2,
    targetSmrCooling: 6.0,
    targetParRadiation: 950,
    targetAirflow: 4000,
    environmentalPhenomenon: 'Temporary thermal safety limit breached past -10.0°C envelope threshold prior to automated LN2 injection response.',
    mitigationResponse: [
      'Interception alert recorded in `climate_failure_alerts` transactional ledger',
      'Secondary liquid-nitrogen back-up dewars (-196°C) pneumatic injection active',
      'Apomixis biological switch locked to 2n diploid continuity to protect germplasm',
      'Emergency geothermal heat shunt diverts excess thermal calories into bedrock sink'
    ],
    expectedVaultTemp: -12.5,
    vaporInversionStatus: 'UNSTABLE_WARNING',
    etfeIrDeflectionPct: 45.0,
    etfeUValue: 2.88,
    earthDampingHours: 11.0
  }
];

export const ExtremeClimateStressModule: React.FC<Props> = ({
  currentState,
  currentTelemetry,
  onApplyScenario
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[1].id); // Default to heatwave
  const [activeGraphTab, setActiveGraphTab] = useState<GraphTab>('transient_temp');
  const [timeHour, setTimeHour] = useState<number>(12); // Hour 0 to 24 scrubber (12 = peak midday solar load)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ hour: number; ambient: number; dome: number; soil: number; vault: number } | null>(null);
  const [validationPassed, setValidationPassed] = useState<boolean>(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  // Custom ETFE layer override for experimentation in the optics tab
  const [etfeLayersOverride, setEtfeLayersOverride] = useState<number>(3);

  const activeScenario = useMemo(() => {
    return SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  }, [selectedScenarioId]);

  // Sync ETFE override with scenario defaults when scenario changes
  useEffect(() => {
    setEtfeLayersOverride(activeScenario.targetEtfeLayers);
  }, [activeScenario]);

  // Animation player for 24h transient response
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeHour(prev => (prev >= 24 ? 0 : prev + 1));
    }, 700);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Generate 25 hourly data points for 24-hour transient simulation
  const transientCurve = useMemo(() => {
    const points = [];
    const baseAmbient = activeScenario.targetAmbientTemp;
    const isHeatwave = activeScenario.id === 'extreme_heatwave';
    const isMonsoon = activeScenario.id === 'monsoon_flood';
    const isSpike = activeScenario.id === 'sudden_thermal_spike';

    for (let h = 0; h <= 24; h++) {
      // Diurnal sol-air curve: peaks at hour 13-14
      let ambientDiurnal = baseAmbient;
      if (isHeatwave) {
        // High amplitude diurnal swing from 36°C at night to 50.5°C at 13h
        ambientDiurnal = 36 + 14.5 * Math.sin(((h - 6) / 16) * Math.PI);
        if (h < 6) ambientDiurnal = 36 + 2 * Math.cos((h / 6) * Math.PI);
      } else if (isMonsoon) {
        // Heavy rain depression with gusts and lightning peaks
        ambientDiurnal = 24.5 - 3 * Math.sin((h / 24) * 2 * Math.PI) + (Math.sin(h * 1.5) * 0.8);
      } else if (isSpike) {
        // Sudden spike at t=8h to t=14h
        if (h >= 7 && h <= 15) {
          ambientDiurnal = baseAmbient + Math.sin(((h - 7) / 8) * Math.PI) * 6.5;
        } else {
          ambientDiurnal = 32.0;
        }
      } else {
        // Arid drought
        ambientDiurnal = 34 + 10 * Math.sin(((h - 6) / 16) * Math.PI);
      }

      // ETFE Dome internal buffer: cuts peak solar heat gain by 60-85% depending on layers
      const etfeInsulationFactor = 1 / (1 + etfeLayersOverride * 0.55);
      const domeTemp = 24 + (ambientDiurnal - 24) * etfeInsulationFactor;

      // Subterranean Step-Well attenuation with phase delay (lag of ~12 hours)
      // Exponential damping e^(-depth * sqrt(pi / (alpha * period)))
      const soilDepth = activeScenario.targetSoilDepth;
      const thermalDamping = Math.exp(-soilDepth * 0.16); // ~0.27 amplitude ratio at 8m
      const laggedHour = (h - activeScenario.earthDampingHours + 24) % 24;
      const laggedAmbient = isHeatwave ? (36 + 14.5 * Math.sin(((laggedHour - 6) / 16) * Math.PI)) : baseAmbient;
      const soilTemp = 18.0 + (laggedAmbient - 30) * thermalDamping;

      // Vault Core (-18°C): actively maintained by SMR-MHD loop + soil thermal mass
      let vaultTemp = activeScenario.expectedVaultTemp;
      if (isSpike && h >= 9 && h <= 14) {
        // Before LN2 cascade kicks in at hour 12
        vaultTemp = -18.0 + 5.5 * Math.sin(((h - 9) / 5) * Math.PI);
      } else if (isHeatwave) {
        // Micro oscillation of ±0.25°C around -18.0°C target
        vaultTemp = -18.0 + 0.25 * Math.sin(h * 0.5);
      } else {
        vaultTemp = -18.0 + 0.15 * Math.cos(h * 0.4);
      }

      points.push({
        hour: h,
        ambient: parseFloat(ambientDiurnal.toFixed(1)),
        dome: parseFloat(domeTemp.toFixed(1)),
        soil: parseFloat(soilTemp.toFixed(1)),
        vault: parseFloat(vaultTemp.toFixed(2))
      });
    }
    return points;
  }, [activeScenario, etfeLayersOverride]);

  // Generate depth gradient profile from surface (0m) to SMR sump (-10m)
  const depthGradientPoints = useMemo(() => {
    const depths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const surfaceTemp = transientCurve[timeHour]?.ambient || activeScenario.targetAmbientTemp;
    const smrBaseCooling = activeScenario.targetSmrCooling;

    return depths.map(d => {
      // Sol-air attenuation equation: T(z) = T_mean + deltaT * exp(-z * k)
      // At Tier 1 (3m): Phytotron Core (~21°C)
      // At Tier 2 (6m): Examination Trays & Pod (~12°C)
      // At Tier 3 (8m): Cryo Vault (-18°C)
      // At SMR Sump (10m): -21°C
      let temp = surfaceTemp;
      if (d === 0) temp = surfaceTemp;
      else if (d <= 3) temp = surfaceTemp - (surfaceTemp - 21.0) * (d / 3);
      else if (d <= 6) temp = 21.0 - (21.0 - 12.0) * ((d - 3) / 3);
      else if (d <= 8) temp = 12.0 - (12.0 - (-18.0)) * ((d - 6) / 2);
      else temp = -18.0 - (smrBaseCooling * 0.2) * ((d - 8) / 2);

      return {
        depth: d,
        temperature: parseFloat(temp.toFixed(1)),
        tierLabel: 
          d === 0 ? 'Surface / Dome (0m)' :
          d === 3 ? 'Tier 1: Phytotron Core (3m)' :
          d === 6 ? 'Tier 2: Examination Trays & Pod (6m)' :
          d === 8 ? 'Tier 3: Cryo Vault (-8m)' :
          d === 10 ? 'SMR-MHD Sump (-10m)' : null
      };
    });
  }, [timeHour, transientCurve, activeScenario]);

  // ETFE Multi-Layer Insulation Vector
  const etfeComparison = useMemo(() => {
    const configs = [
      { layers: 1, uValue: 5.65, shgc: 0.78, irDeflection: 22, condensationShed: 92 },
      { layers: 2, uValue: 2.88, shgc: 0.58, irDeflection: 55, condensationShed: 96 },
      { layers: 3, uValue: 1.85, shgc: 0.38, irDeflection: 78, condensationShed: 99 },
      { layers: 4, uValue: 1.32, shgc: 0.22, irDeflection: 88, condensationShed: 100 }
    ];
    return configs;
  }, []);

  // Calculate current hour values
  const currentHourData = transientCurve[timeHour] || transientCurve[12];

  const handleApply = () => {
    onApplyScenario({
      ambientTemp: activeScenario.targetAmbientTemp,
      soilDepth: activeScenario.targetSoilDepth,
      etfeInsulation: etfeLayersOverride,
      smrCoolingRate: activeScenario.targetSmrCooling,
      nitrogenDewarPressureBar: activeScenario.id === 'sudden_thermal_spike' ? 3.2 : 1.8,
      airCirculationCFM: activeScenario.targetAirflow,
      solarParRadiationUmols: activeScenario.targetParRadiation
    });

    setValidationPassed(true);
    setValidationMsg(
      `[SCHEMA_INTERCEPTOR]: Ingestion payload validated against Amit-Nishanka-Anusandhan-AgriCore-Validation-Matrix. Vapor Inversion Status: ${activeScenario.vaporInversionStatus}. Subterranean Earth Mass Damping: ${activeScenario.earthDampingHours}h phase lag. Cellular Switch: 2n_DIPLOID_CONTINUITY.`
    );
    setTimeout(() => setValidationMsg(null), 6000);
  };

  const handleResetBaseline = () => {
    onApplyScenario({
      ambientTemp: 38,
      soilDepth: 8,
      etfeInsulation: 3,
      smrCoolingRate: 12.5,
      nitrogenDewarPressureBar: 1.8,
      airCirculationCFM: 4200,
      solarParRadiationUmols: 850
    });
    setEtfeLayersOverride(3);
    setTimeHour(12);
  };

  // SVG coordinate helpers for Transient Graph
  // Temperature range: -25°C to +55°C (height 200px)
  // Time range: 0h to 24h (width 600px)
  const graphWidth = 620;
  const graphHeight = 220;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const innerW = graphWidth - padLeft - padRight;
  const innerH = graphHeight - padTop - padBottom;

  const minTemp = -25;
  const maxTemp = 55;
  const tempRange = maxTemp - minTemp;

  const getX = (hour: number) => padLeft + (hour / 24) * innerW;
  const getY = (temp: number) => padTop + innerH - ((temp - minTemp) / tempRange) * innerH;

  // Build SVG path strings
  const ambientPath = useMemo(() => {
    return transientCurve.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.hour).toFixed(1)} ${getY(pt.ambient).toFixed(1)}`).join(' ');
  }, [transientCurve]);

  const domePath = useMemo(() => {
    return transientCurve.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.hour).toFixed(1)} ${getY(pt.dome).toFixed(1)}`).join(' ');
  }, [transientCurve]);

  const soilPath = useMemo(() => {
    return transientCurve.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.hour).toFixed(1)} ${getY(pt.soil).toFixed(1)}`).join(' ');
  }, [transientCurve]);

  const vaultPath = useMemo(() => {
    return transientCurve.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.hour).toFixed(1)} ${getY(pt.vault).toFixed(1)}`).join(' ');
  }, [transientCurve]);

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 lg:p-6 backdrop-blur-xl space-y-6 shadow-2xl">
      {/* Module Title Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono-code flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              EXTREME STRESS SIMULATION LAB
            </span>
            <span className="text-xs text-slate-400 font-mono-code">
              EARTH MASS INERTIA & ETFE DEFLECTION BENCHMARK
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-white mt-1 flex items-center gap-2">
            आपत्कालीन जलवायु प्रतिबल परीक्षण (Extreme Climate Stress Simulator)
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Simulates extreme environmental disruptions—super-cyclonic monsoons (150mm/hr), 50.5°C super-heatwaves (Loo surge), and hyper-arid droughts—to visually verify how subterranean Baoli stone mass and triple-layer ETFE cushions isolate the <span className="text-cyan-300 font-bold">-18°C Cryo Vault</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetBaseline}
            className="px-3.5 py-2 rounded-xl text-xs font-mono-code bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Baseline (38°C / 8m)
          </button>
        </div>
      </div>

      {/* Scenario Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {SCENARIOS.map((sc) => {
          const Icon = sc.icon;
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500/80 text-amber-100 ring-1 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded border ${
                  sc.vaporInversionStatus === 'STABLE'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {sc.vaporInversionStatus}
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">{sc.name}</div>
              <div className="text-[10px] text-amber-300 font-sanskrit truncate mt-0.5">{sc.sanskritName}</div>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] font-mono-code">
                <span className="text-cyan-300">Ambient: {sc.targetAmbientTemp}°C</span>
                <span className="text-slate-400">IR Defl: {sc.etfeIrDeflectionPct}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Reactive Visual Plotting Dashboard */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 lg:p-5 space-y-4">
        {/* Navigation & Tab Selection */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono-code">
            <button
              onClick={() => setActiveGraphTab('transient_temp')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeGraphTab === 'transient_temp'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              24-Hour Transient Temperature Plot
            </button>
            <button
              onClick={() => setActiveGraphTab('depth_profile')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeGraphTab === 'depth_profile'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              Subterranean Depth Attenuation (0m to 10m)
            </button>
            <button
              onClick={() => setActiveGraphTab('etfe_optics')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeGraphTab === 'etfe_optics'
                  ? 'bg-purple-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              ETFE Insulation Performance & Optics
            </button>
          </div>

          {/* Time Scrubber & Play/Pause Controls */}
          <div className="flex items-center gap-3 font-mono-code text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Play 24-hour simulation cycle"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Simulate Loop'}</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px]">Timeline:</span>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={timeHour}
                onChange={(e) => setTimeHour(parseInt(e.target.value))}
                className="w-24 accent-amber-500 cursor-pointer"
              />
              <span className="text-amber-400 font-bold w-12 text-right">
                t={timeHour.toString().padStart(2, '0')}:00h
              </span>
            </div>
          </div>
        </div>

        {/* TAB 1: 24-Hour Transient Temperature Plot */}
        {activeGraphTab === 'transient_temp' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between text-xs font-mono-code">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-3 h-1 bg-red-500 rounded-full inline-block"></span>
                  Ambient Sol-Air ({currentHourData.ambient}°C)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-3 h-1 bg-amber-400 rounded-full inline-block"></span>
                  Dome Buffered ({currentHourData.dome}°C)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block"></span>
                  Bedrock Lag Lagged ({currentHourData.soil}°C)
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <span className="w-3 h-1.5 bg-cyan-400 rounded-full inline-block"></span>
                  Vault Core ({currentHourData.vault}°C)
                </span>
              </div>
              <div className="text-slate-400 text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400/30 border border-cyan-400"></span>
                <span>Cryo-Lock Stability Envelope: -20°C to -15°C</span>
              </div>
            </div>

            {/* SVG Visual Plot */}
            <div className="relative bg-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-x-auto">
              <svg
                viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                className="w-full h-56 lg:h-64 select-none"
              >
                <defs>
                  {/* Cryo safe band gradient */}
                  <linearGradient id="cryoBandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                  </linearGradient>
                  {/* Vault line glow */}
                  <filter id="vaultGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Lines & Labels */}
                {[-20, -10, 0, 10, 20, 30, 40, 50].map((t) => {
                  const y = getY(t);
                  return (
                    <g key={t}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={graphWidth - padRight}
                        y2={y}
                        stroke={t === 0 ? '#475569' : '#1e293b'}
                        strokeWidth={t === 0 ? '1.5' : '1'}
                        strokeDasharray={t === 0 ? 'none' : '3 3'}
                      />
                      <text
                        x={padLeft - 6}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] fill-slate-500 font-mono-code"
                      >
                        {t > 0 ? `+${t}` : t}°C
                      </text>
                    </g>
                  );
                })}

                {/* Cryo-Lock Safe Zone Shaded Rectangle (-20°C to -15°C) */}
                <rect
                  x={padLeft}
                  y={getY(-15)}
                  width={innerW}
                  height={getY(-20) - getY(-15)}
                  fill="url(#cryoBandGrad)"
                  stroke="#0891b2"
                  strokeWidth="0.8"
                  strokeDasharray="4 2"
                />
                <text
                  x={graphWidth - padRight - 8}
                  y={getY(-17.5) + 3}
                  textAnchor="end"
                  className="text-[9px] fill-cyan-400/80 font-mono-code font-bold"
                >
                  CRYO PRESERVATION ZONE (-18°C)
                </text>

                {/* Time Axis Markers (Every 3 hours) */}
                {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => {
                  const x = getX(h);
                  return (
                    <g key={h}>
                      <line
                        x1={x}
                        y1={padTop}
                        x2={x}
                        y2={graphHeight - padBottom}
                        stroke="#1e293b"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={x}
                        y={graphHeight - padBottom + 14}
                        textAnchor="middle"
                        className="text-[9px] fill-slate-500 font-mono-code"
                      >
                        {h}h
                      </text>
                    </g>
                  );
                })}

                {/* Curves */}
                {/* 1. Ambient Curve */}
                <path
                  d={ambientPath}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeOpacity="0.85"
                />

                {/* 2. Dome Buffer Curve */}
                <path
                  d={domePath}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  strokeOpacity="0.9"
                />

                {/* 3. Soil Mass Buffer Curve */}
                <path
                  d={soilPath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeOpacity="0.9"
                />

                {/* 4. Vault Core Curve */}
                <path
                  d={vaultPath}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.8"
                  filter="url(#vaultGlow)"
                />

                {/* Current Selected Scrubber Time Line */}
                <line
                  x1={getX(timeHour)}
                  y1={padTop}
                  x2={getX(timeHour)}
                  y2={graphHeight - padBottom}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />

                {/* Highlight Point on Vault Curve at Current Time */}
                <circle
                  cx={getX(timeHour)}
                  cy={getY(currentHourData.vault)}
                  r="5"
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Highlight Point on Ambient Curve at Current Time */}
                <circle
                  cx={getX(timeHour)}
                  cy={getY(currentHourData.ambient)}
                  r="4"
                  fill="#ef4444"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Time Point Telemetry Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono-code text-xs">
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Surge Temp at t={timeHour}h</span>
                <span className="text-base font-bold text-red-400">{currentHourData.ambient}°C</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">External Sol-Air Load</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">ETFE Thermal Deflection</span>
                <span className="text-base font-bold text-amber-400">
                  -{(currentHourData.ambient - currentHourData.dome).toFixed(1)}°C
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Nanoparticle Cushion</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Bedrock Soil Lag</span>
                <span className="text-base font-bold text-emerald-400">{activeScenario.earthDampingHours}h Phase Shift</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">8m Stepped Baoli Stone</span>
              </div>
              <div className="p-3 bg-cyan-950/40 rounded-lg border border-cyan-800/60">
                <span className="text-[10px] text-cyan-300 block uppercase font-bold">Vault Core Status</span>
                <span className="text-base font-bold text-cyan-300">{currentHourData.vault}°C</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Within ±0.4°C Cryo-Lock</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Subterranean Depth Attenuation (0m to 10m) */}
        {activeGraphTab === 'depth_profile' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
              <span>Depth Thermal Gradient [ T(z) = T_vault + ΔT · exp(-z/δ) ]</span>
              <span className="text-cyan-300">Phase Delay Coefficient: 1.85°C/m Attenuation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Depth Chart Visual */}
              <div className="md:col-span-8 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono-code text-xs space-y-3">
                {depthGradientPoints.map((pt) => {
                  const isVault = pt.depth === 8;
                  const isSump = pt.depth === 10;
                  const isSurface = pt.depth === 0;

                  return (
                    <div key={pt.depth} className="flex items-center gap-3">
                      <div className="w-16 text-right text-slate-400 text-[11px] shrink-0">
                        {pt.depth}m
                      </div>

                      {/* Bar Gradient Representation */}
                      <div className="flex-1 bg-slate-900 h-6 rounded-lg overflow-hidden flex items-center px-2 relative border border-slate-800">
                        <div
                          className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${
                            pt.temperature < 0
                              ? 'bg-gradient-to-r from-blue-700 to-cyan-500 opacity-60'
                              : pt.temperature < 20
                              ? 'bg-gradient-to-r from-emerald-700 to-teal-500 opacity-60'
                              : 'bg-gradient-to-r from-amber-600 to-red-500 opacity-60'
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(10, ((pt.temperature + 25) / 80) * 100))}%`
                          }}
                        />
                        <span className="relative z-10 text-[11px] font-bold text-white flex items-center justify-between w-full">
                          <span>{pt.tierLabel || `Strata Bedrock Layer (${pt.depth}m)`}</span>
                          <span className={pt.temperature < 0 ? 'text-cyan-300' : 'text-amber-300'}>
                            {pt.temperature > 0 ? `+${pt.temperature}` : pt.temperature}°C
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanatory Sidebar */}
              <div className="md:col-span-4 space-y-3 font-mono-code text-xs">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase text-cyan-400 font-bold block">
                    Baoli Low-Pass Thermal Filtering
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Ancient Bhartiya step-wells utilize high volumetric heat capacity stone (C_v = 2.2 MJ/m³·K). As external ambient swings between 24°C and 50.5°C, thermal oscillations exponentially decay before reaching Level 3 (-8m).
                  </p>
                </div>

                <div className="p-3.5 bg-cyan-950/40 rounded-xl border border-cyan-800/60 space-y-1.5">
                  <span className="text-[10px] uppercase text-cyan-300 font-bold block">
                    Level 3 Inversion Seal
                  </span>
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Target Cold Storage:</span>
                    <span className="text-cyan-400 font-bold">-18.0°C</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>SMR Coolant Manifold:</span>
                    <span className="text-blue-400 font-bold">-22.5°C</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>Natural Attenuation Delta:</span>
                    <span className="text-emerald-400 font-bold">Δ 42.5°C Isolated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ETFE Insulation Performance & Optics */}
        {activeGraphTab === 'etfe_optics' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
              <span className="text-slate-400">
                Pneumatic Cushion Performance Under Stress ({activeScenario.name})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Active Layer Configuration:</span>
                {[1, 2, 3, 4].map(layerCount => (
                  <button
                    key={layerCount}
                    onClick={() => setEtfeLayersOverride(layerCount)}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                      etfeLayersOverride === layerCount
                        ? 'bg-purple-500 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {layerCount} {layerCount === 1 ? 'Layer' : 'Layers'}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono-code text-xs">
              {etfeComparison.map((cfg) => {
                const isSelected = cfg.layers === etfeLayersOverride;
                return (
                  <div
                    key={cfg.layers}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500/80 ring-1 ring-purple-500/40'
                        : 'bg-slate-900/60 border-slate-800 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-xs">{cfg.layers}-Layer ETFE</span>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500 text-slate-950 font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">U-Value (Heat Loss):</span>
                        <span className="text-amber-400 font-bold">{cfg.uValue} W/m²·K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">IR Deflection:</span>
                        <span className="text-emerald-400 font-bold">{cfg.irDeflection}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">SHGC Coefficient:</span>
                        <span className="text-cyan-300 font-bold">{cfg.shgc}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Water Runoff:</span>
                        <span className="text-purple-300 font-bold">{cfg.condensationShed}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optical Deflection Visual Breakdown */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 font-mono-code text-xs space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span className="uppercase text-[11px] font-bold text-purple-300">
                  Spectral Filtration & UV-C Barrier Index
                </span>
                <span className="text-slate-500 text-[10px]">Overhead Greenhouse Dome Shield</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Selective PAR Permeability (400-700nm)</div>
                  <div className="text-emerald-400 font-bold text-base mt-0.5">82.4% Transmission</div>
                  <p className="text-slate-400 text-[10px] mt-1">Allows photosynthetically active light into Tier 1 phytotron beds.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Nanoparticle IR Rejection (&gt;780nm)</div>
                  <div className="text-amber-400 font-bold text-base mt-0.5">
                    {activeScenario.etfeIrDeflectionPct}% Deflected
                  </div>
                  <p className="text-slate-400 text-[10px] mt-1">Reflects destructive solar heat calories directly back into sky.</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Condensation Harvesting Channel</div>
                  <div className="text-blue-400 font-bold text-base mt-0.5">140 L/hr Capacity</div>
                  <p className="text-slate-400 text-[10px] mt-1">Self-cleaning hydrophobic tension channels rainfall to subterranean cisterns.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Scenario Detailed Evaluation & Live Physics Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stress Scenario Dynamics & Mitigations */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4 font-mono-code text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase text-amber-400 font-bold">Selected Scenario</span>
              <h4 className="text-sm font-bold text-white font-display mt-0.5">
                {activeScenario.name}
              </h4>
              <p className="text-xs text-amber-300 font-sanskrit">
                {activeScenario.sanskritName}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-cyan-300">
                Sol-Air Temp: {activeScenario.targetAmbientTemp}°C
              </span>
              <div className="text-[10px] text-slate-500">PAR: {activeScenario.targetParRadiation} µmol/m²s</div>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            {activeScenario.description}
          </p>

          <div>
            <span className="text-[10px] uppercase text-slate-400 block mb-1">Environmental Phenomenon Impact:</span>
            <div className="text-amber-200 bg-amber-950/20 p-2.5 rounded border border-amber-900/40">
              {activeScenario.environmentalPhenomenon}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Automated Facility Mitigation Responses:
            </span>
            <ul className="space-y-1.5 text-slate-300">
              {activeScenario.mitigationResponse.map((res, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-900/40 p-2 rounded border border-slate-800/80">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Temperature Stability Delta & Action Button */}
        <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono-code flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Subterranean Stability Telemetry
            </h4>
            <span className="text-[10px] font-mono-code text-slate-400">Validated Matrix</span>
          </div>

          {/* Comparative Metrics Cards */}
          <div className="grid grid-cols-2 gap-2 font-mono-code text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Surface Surge</span>
              <span className="text-amber-400 font-bold text-base">
                {activeScenario.targetAmbientTemp}°C
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Δ {(activeScenario.targetAmbientTemp - currentState.ambientTemp).toFixed(1)}°C
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Earth Mitigation</span>
              <span className="text-emerald-400 font-bold text-base">
                -{currentTelemetry.naturalSoilIsolation}°C
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">8m Baoli Rock Mass</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Target Vault</span>
              <span className="text-cyan-300 font-bold text-base">
                {activeScenario.expectedVaultTemp.toFixed(1)}°C
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">Cryo-Lock: -18.0°C</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Relative Humidity</span>
              <span className="text-purple-300 font-bold text-base">
                {currentTelemetry.relativeHumidityPercent}%
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">Vapor Protected</div>
            </div>
          </div>

          {/* Stability Assessment Badge */}
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs font-mono-code text-cyan-200">
            <strong className="block text-[10px] uppercase text-cyan-400 mb-0.5">Thermal Inertia Stability:</strong>
            Subterranean step-well dampens {currentTelemetry.thermalDampingEfficiencyPct}% of ambient sol-air thermal shock. Cellular chromosome status remains strictly 2n maternal clonal copy with zero segregational degradation.
          </div>

          {/* Apply Scenario Button */}
          <button
            onClick={handleApply}
            className="w-full py-2.5 rounded-xl text-xs font-bold font-mono-code bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            SIMULATE EXTREME STRESS SCENARIO IN ENGINE
          </button>

          {/* Validation Feedback */}
          {validationMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs font-mono-code text-emerald-200 flex items-start gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{validationMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
