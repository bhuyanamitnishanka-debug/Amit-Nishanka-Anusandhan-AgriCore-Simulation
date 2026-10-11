import React, { useState, useEffect } from 'react';
import { MicroclimateOutput, CompiledSimulationParameters } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Cpu, 
  Layers, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ArrowDown, 
  ArrowUp,
  Award, 
  FileBadge, 
  Lock, 
  CheckCircle2, 
  Flame, 
  CloudRain, 
  Bug, 
  Radio, 
  BookOpen, 
  RefreshCw,
  Globe,
  Share2,
  ExternalLink
} from 'lucide-react';

interface Props {
  telemetry: MicroclimateOutput;
  appliedParams: CompiledSimulationParameters | null;
  studentName: string;
  studentRollNo: string;
}

type StressScenarioType = 'triple_shock' | 'heatwave_blackout' | 'monsoon_inundation' | 'seismic_shear';
type CascadeStep = 0 | 1 | 2 | 3 | 4; // 0 = idle/impact, 1 = vault, 2 = pod, 3 = dome, 4 = browser stabilized

interface SubsystemSpec {
  id: 'vault' | 'pod' | 'dome' | 'browser';
  name: string;
  sanskritTitle: string;
  role: string;
  tierDepth: string;
  energyBackbone: string;
  resilienceMechanism: string;
  dataFlow: string;
  stabilizeTime: string;
  colorBorder: string;
  colorBg: string;
  colorText: string;
  colorAccent: string;
  icon: typeof ShieldCheck;
}

const SUBSYSTEMS: SubsystemSpec[] = [
  {
    id: 'vault',
    name: 'Cryogenic Step-Well Vault',
    sanskritTitle: 'शीत-कुण्ड गर्भ-गृह (Śīta-Kuṇḍa Garbha-Gṛha)',
    role: 'Base Layer: Preservation Anchor & First Stabilizer',
    tierDepth: 'Subterranean Tier 3 (-8m to -10m)',
    energyBackbone: 'SMR-MHD direct thermo-electric loop + passive LN₂ dewar expansion cascade (-196°C).',
    resilienceMechanism: 'Locks genetic seed integrity at -18.0°C within 120ms of anomaly detection. Massive Baoli stone bedrock absorbs external shocks.',
    dataFlow: 'Cryo-dewar thermal logs and seed viability metrics feed upward into Pod computational models.',
    stabilizeTime: 'T + 0.12s (Immediate)',
    colorBorder: 'border-cyan-500/80',
    colorBg: 'bg-cyan-950/40',
    colorText: 'text-cyan-300',
    colorAccent: 'bg-cyan-500',
    icon: ShieldCheck
  },
  {
    id: 'pod',
    name: 'AR/VR Dual Researcher Pod',
    sanskritTitle: 'द्वन्द्व-अनुसन्धान मण्डप (Dvandva-Anusandhāna Maṇḍapa)',
    role: 'Middle Layer: Cognitive Anchor & Knowledge Continuity',
    tierDepth: 'Subterranean Tier 2 (-6m examination deck)',
    energyBackbone: 'Electrochemical solid-state buffer cells + redundant SMR bus line.',
    resilienceMechanism: 'Local offline Ashtadhyayi NLP parser and holographic engine maintain simulation processing even if satellite links drop.',
    dataFlow: 'Student experiment parameters + vault germplasm maps -> synthesized agronomic defense prescriptions.',
    stabilizeTime: 'T + 1.20s (Sequential)',
    colorBorder: 'border-indigo-500/80',
    colorBg: 'bg-indigo-950/40',
    colorText: 'text-indigo-300',
    colorAccent: 'bg-indigo-500',
    icon: Cpu
  },
  {
    id: 'dome',
    name: 'Overhead ETFE Greenhouse Dome',
    sanskritTitle: 'सौर-मण्डप जैव-वलय (Saura-Maṇḍapa Jaiva-Valaya)',
    role: 'Upper Layer: Ecological Anchor & Environmental Buffer',
    tierDepth: 'Ground Zero (0m surface envelope)',
    energyBackbone: 'Triple-layer pneumatic ETFE solar capture + surplus reactor heat exchange.',
    resilienceMechanism: 'Dynamically shifts cushion optical opacity to deflect 85% IR heat; engages ancient Dhupana bio-smoke fumigation against pest swarms.',
    dataFlow: 'Real-time biodiversity canopy metrics stream down to Pod and outward to student web clients.',
    stabilizeTime: 'T + 3.80s (Sequential)',
    colorBorder: 'border-emerald-500/80',
    colorBg: 'bg-emerald-950/40',
    colorText: 'text-emerald-300',
    colorAccent: 'bg-emerald-500',
    icon: Layers
  },
  {
    id: 'browser',
    name: 'Curriculum Portal & Student Portfolio',
    sanskritTitle: 'विद्या-प्रसार चक्र (Vidyā-Prasāra Cakra)',
    role: 'Outreach Layer: Educational Anchor & Epistemic Feedback',
    tierDepth: 'Distributed Cloud & Edge Terminals',
    energyBackbone: 'Low-overhead client-side execution + decentralized consensus node synchronization.',
    resilienceMechanism: 'Distance scholars at IGNOU and OUAT continue simulations offline; student experiments are hashed into permanent tamper-proof credentials.',
    dataFlow: 'Certified student strategies feed directly back into researcher machine learning and NLP retraining.',
    stabilizeTime: 'T + 6.50s (Loop Closure)',
    colorBorder: 'border-amber-500/80',
    colorBg: 'bg-amber-950/40',
    colorText: 'text-amber-300',
    colorAccent: 'bg-amber-500',
    icon: Award
  }
];

export const ResilienceHierarchyMap: React.FC<Props> = ({
  telemetry,
  appliedParams,
  studentName,
  studentRollNo
}) => {
  const [activeScenario, setActiveScenario] = useState<StressScenarioType>('triple_shock');
  const [cascadeStep, setCascadeStep] = useState<CascadeStep>(4); // Default to fully stabilized
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'hierarchy_map' | 'graphic_panels' | 'blockchain_portfolio'>('hierarchy_map');
  const [blockchainVerified, setBlockchainVerified] = useState<boolean>(true);

  // Auto-play stepper when simulation is triggered
  useEffect(() => {
    if (!isSimulating) return;

    setCascadeStep(0); // Shock hits

    const t1 = setTimeout(() => setCascadeStep(1), 1200);  // Vault locks
    const t2 = setTimeout(() => setCascadeStep(2), 2600);  // Pod holds
    const t3 = setTimeout(() => setCascadeStep(3), 4200);  // Dome adapts
    const t4 = setTimeout(() => {
      setCascadeStep(4);  // Browser & Portfolio stabilizes
      setIsSimulating(false);
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isSimulating]);

  const handleTriggerCascade = () => {
    setIsSimulating(true);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setCascadeStep(4);
  };

  const getSubsystemStatus = (layerIndex: number) => {
    if (cascadeStep === 0) return { label: 'CRITICAL SHOCK IMPACT', color: 'text-red-400 bg-red-950/60 border-red-800' };
    if (cascadeStep > layerIndex) return { label: 'STABILIZED & LOCKED', color: 'text-emerald-300 bg-emerald-950/60 border-emerald-800' };
    if (cascadeStep === layerIndex) return { label: 'CASCADE ACTIVE & RECOVERING', color: 'text-amber-300 bg-amber-950/60 border-amber-800 animate-pulse' };
    return { label: 'AWAITING SEQUENCE PROPAGATION', color: 'text-slate-400 bg-slate-900 border-slate-800' };
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 lg:p-6 backdrop-blur-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono-code flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              SYSTEMIC RESILIENCE HIERARCHY
            </span>
            <span className="text-xs text-slate-400 font-mono-code">
              MULTI-SUBSYSTEM CASCADING STABILIZATION ENGINE
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-white mt-1 flex items-center gap-2">
            संस्थान-दृढता सोपान (Subsystem Stabilization Cascade Map)
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Models the ordered stabilization sequence when environmental crisis strikes. The facility functions as a tiered survival organism: the <strong className="text-cyan-300">Vault</strong> anchors physical preservation first, the <strong className="text-indigo-300">Pod</strong> sustains cognitive computing second, the <strong className="text-emerald-300">Dome</strong> buffers ecological balance third, and the <strong className="text-amber-300">Curriculum Portal</strong> secures educational credentials last.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono-code text-xs">
          <button
            onClick={() => setActiveViewMode('hierarchy_map')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === 'hierarchy_map'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cascade Map
          </button>
          <button
            onClick={() => setActiveViewMode('graphic_panels')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === 'graphic_panels'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Graphic-Novel Panels
          </button>
          <button
            onClick={() => setActiveViewMode('blockchain_portfolio')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === 'blockchain_portfolio'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Student Blockchain Seal
          </button>
        </div>
      </div>

      {/* Scenario Trigger & Stepper Controls */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono-code text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium">Select Stress Event:</span>
          {[
            { id: 'triple_shock', label: 'Triple Crisis (Blackout + Drought + Pest Swarm)', icon: AlertTriangle },
            { id: 'heatwave_blackout', label: '50.5°C Heatwave + Grid Trip', icon: Flame },
            { id: 'monsoon_inundation', label: '150mm/hr Monsoon Deluge', icon: CloudRain },
            { id: 'seismic_shear', label: 'Bedrock Seismic Infiltration', icon: Zap }
          ].map((sc) => {
            const Icon = sc.icon;
            const isSelected = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenario(sc.id as StressScenarioType);
                  setCascadeStep(4);
                  setIsSimulating(false);
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-amber-400" />
                <span>{sc.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerCascade}
            disabled={isSimulating}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              isSimulating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isSimulating ? 'Cascading Sequence...' : 'Simulate Crisis Cascade'}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: HIERARCHY CASCADE MAP */}
      {activeViewMode === 'hierarchy_map' && (
        <div className="space-y-6">
          {/* Cascade Sequencer Progress Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-code">
              <span className="text-slate-400 uppercase">
                Active Cascade Step:
                <strong className="text-amber-300 ml-1.5">
                  {cascadeStep === 0 && 'Initial Shock (All Subsystems Alerted)'}
                  {cascadeStep === 1 && 'Step 1: Vault LN₂ Cascade Locked (-18.0°C Target)'}
                  {cascadeStep === 2 && 'Step 2: AR/VR Pod Cognitive Safeguard Initialized'}
                  {cascadeStep === 3 && 'Step 3: Greenhouse Dome ETFE Optics & Hydration Shunted'}
                  {cascadeStep === 4 && 'Step 4: All Subsystems Stabilized & Student Records Sealed'}
                </strong>
              </span>
              <span className="text-cyan-400 font-bold">
                {cascadeStep}/4 Stabilized ({cascadeStep * 25}%)
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full transition-all duration-700 ease-out"
                style={{ width: `${cascadeStep * 25}%` }}
              />
            </div>
          </div>

          {/* Color-Coded Layer Cascade Diagram */}
          <div className="grid grid-cols-1 gap-4">
            {SUBSYSTEMS.map((sub, idx) => {
              const layerIdx = idx + 1;
              const status = getSubsystemStatus(layerIdx);
              const Icon = sub.icon;
              const isLayerStabilized = cascadeStep >= layerIdx;
              const isCurrentlyActivating = cascadeStep === layerIdx;

              return (
                <div
                  key={sub.id}
                  className={`border rounded-xl p-4 lg:p-5 transition-all duration-500 relative overflow-hidden ${
                    isCurrentlyActivating
                      ? `${sub.colorBorder} ${sub.colorBg} ring-2 ring-amber-400/50 shadow-xl`
                      : isLayerStabilized
                      ? `${sub.colorBorder} ${sub.colorBg}`
                      : 'border-slate-800 bg-slate-950/60 opacity-60'
                  }`}
                >
                  {/* Decorative glowing edge indicator */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${isLayerStabilized ? sub.colorAccent : 'bg-slate-700'}`} />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Left: Subsystem Identity & Hierarchical Priority */}
                    <div className="lg:col-span-4 space-y-1 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-slate-900 border border-slate-700 text-white">
                          LAYER {4 - idx}: STEP {idx + 1}
                        </span>
                        <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <h4 className="text-base font-bold font-display text-white mt-1 flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${sub.colorText}`} />
                        {sub.name}
                      </h4>
                      <p className="text-xs text-amber-300 font-sanskrit">
                        {sub.sanskritTitle}
                      </p>
                      <div className="text-[11px] font-mono-code text-slate-400">
                        {sub.tierDepth}
                      </div>
                    </div>

                    {/* Middle: Energy Backbone & Resilience Mechanism */}
                    <div className="lg:col-span-5 space-y-1.5 text-xs text-slate-300">
                      <div>
                        <span className="text-[10px] uppercase font-mono-code text-slate-400 block font-semibold">
                          Energy & Cooling Backbone:
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {sub.energyBackbone}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono-code text-cyan-300 block font-semibold">
                          Crisis Defense Mechanism:
                        </span>
                        <p className="text-[11px] text-slate-200 leading-relaxed">
                          {sub.resilienceMechanism}
                        </p>
                      </div>
                    </div>

                    {/* Right: Telemetry & Upward Data Flow */}
                    <div className="lg:col-span-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono-code text-[11px]">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="uppercase text-[10px]">Lock Sequence:</span>
                        <span className="text-amber-400 font-bold">{sub.stabilizeTime}</span>
                      </div>

                      <div className="border-t border-slate-800/80 pt-1.5">
                        <span className="text-slate-400 text-[10px] block">Live Telemetry Hook:</span>
                        {sub.id === 'vault' && (
                          <span className="text-cyan-300 font-bold">
                            Vault Temp: {telemetry.vaultTemperatureCelsius}°C | RH: {telemetry.relativeHumidityPercent}%
                          </span>
                        )}
                        {sub.id === 'pod' && (
                          <span className="text-indigo-300 font-bold">
                            Offline Parser: ACTIVE | Karaka Graph Sync: 100%
                          </span>
                        )}
                        {sub.id === 'dome' && (
                          <span className="text-emerald-300 font-bold">
                            IR Deflection: 85.5% | Vapor Buffer: {telemetry.thermalDampingEfficiencyPct}%
                          </span>
                        )}
                        {sub.id === 'browser' && (
                          <span className="text-amber-300 font-bold">
                            Learner ID: {studentRollNo} | Portfolios: Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dual Integration Loops (Energy & Data) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-code text-xs">
            {/* Energy Loop */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-[11px]">
                <Zap className="w-4 h-4 text-red-400" />
                Integrated Energy Loop (Down-to-Up)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <span className="text-red-400 font-bold">SMR-MHD Reactor (-10m)</span>
                {' '}➔ Vault Cryo Chillers (-18°C)
                {' '}➔ Pod Auxiliary Power
                {' '}➔ Dome Thermal Heat Recovery
                {' '}➔ Cloud Serverless Cluster.
              </p>
              <div className="text-[10px] text-slate-500">
                Surplus heat calories from the reactor are redirected to prevent root freezing during monsoon deluges and winter cold snaps.
              </div>
            </div>

            {/* Data Loop */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                Epistemic Data Feedback Loop (Up-to-Down)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <span className="text-cyan-400 font-bold">Vault Logs</span>
                {' '}➔ Pod Holograms
                {' '}➔ Dome Sensors
                {' '}➔ Student Portfolios
                {' '}➔ NLP Retraining
                {' '}➔ Real-Time Vault Updates.
              </p>
              <div className="text-[10px] text-slate-500">
                Student simulation results directly refine Paninian agronomic formulations, making distance learners active co-authors of facility resilience.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: GRAPHIC-NOVEL PANELS */}
      {activeViewMode === 'graphic_panels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 pb-2 border-b border-slate-800">
            <span>Graphic-Novel Panel Sequence: The Triad Under Three Simultaneous Shocks</span>
            <span className="text-amber-400">Chronological Stabilization Arc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                panel: '1',
                title: 'The Blackout',
                subsystem: 'Vault Awakens',
                color: 'border-cyan-500/80 bg-cyan-950/30 text-cyan-300',
                quote: '“Power fails—but the vault breathes first, cascading liquid nitrogen to hold seeds in unbroken silence.”',
                detail: 'Emergency LN2 valves depressurize. Stepped stone bedrock absorbs the thermal surge without mechanical reliance.'
              },
              {
                panel: '2',
                title: 'The Drought',
                subsystem: 'Dome Fights Back',
                color: 'border-emerald-500/80 bg-emerald-950/30 text-emerald-300',
                quote: '“The soil cracks—yet hydration coils pulse, rerouting surplus reactor heat into hidden veins of water.”',
                detail: 'ETFE pneumatic cushions shift opacity, deflecting infrared radiation while recycling plant transpiration.'
              },
              {
                panel: '3',
                title: 'The Swarm',
                subsystem: 'Bio-Control Shield',
                color: 'border-purple-500/80 bg-purple-950/30 text-purple-300',
                quote: '“Pest silhouettes swarm—ancient Dhupana fumigation smoke and modern biocontrol weave an impenetrable shield.”',
                detail: 'Herbal extracts vaporized through phytotron air ducts neutralize insect pathogens without synthetic chemicals.'
              },
              {
                panel: '4',
                title: 'The Pod Responds',
                subsystem: 'Cognitive Hold',
                color: 'border-indigo-500/80 bg-indigo-950/30 text-indigo-300',
                quote: '“Knowledge does not dim—offline caches and electrochemical backups keep the Paninian parsing alive.”',
                detail: 'Holographic projections recalibrate in real time, projecting countermeasures to student terminals.'
              },
              {
                panel: '5',
                title: 'The Cascade Holds',
                subsystem: 'Learners Rejoin',
                color: 'border-amber-500/80 bg-amber-950/30 text-amber-300',
                quote: '“Three shocks, one organism—preservation, ecology, cognition, and education harmonize into resilience.”',
                detail: 'Student simulation logs are sealed with cryptographic blockchain signatures and archived to the research registry.'
              }
            ].map((p) => (
              <div
                key={p.panel}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${p.color}`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono-code uppercase opacity-80 mb-1">
                    <span>PANEL {p.panel}</span>
                    <span className="font-bold">{p.subsystem}</span>
                  </div>
                  <h5 className="text-sm font-bold font-display text-white">
                    {p.title}
                  </h5>
                  <p className="text-xs italic text-slate-200 mt-2 font-serif leading-relaxed">
                    {p.quote}
                  </p>
                </div>
                <div className="text-[10px] font-mono-code text-slate-400 pt-2 border-t border-slate-800">
                  {p.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: STUDENT BLOCKCHAIN PORTFOLIO SEAL */}
      {activeViewMode === 'blockchain_portfolio' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 font-mono-code text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-white font-bold text-sm">
                    Tamper-Proof Student Credential & Research Portfolio
                  </span>
                  <div className="text-[10px] text-slate-400">
                    Validated under Proof-of-Authority by IGNOU School of Agriculture & OUAT Directorate of Research
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  BLOCKCHAIN CONSENSUS VERIFIED
                </span>
              </div>
            </div>

            {/* Credential Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Scholar Identity</span>
                <span className="text-white font-bold text-sm block">{studentName}</span>
                <span className="text-amber-300 text-xs">{studentRollNo}</span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Cryptographic Hash Seal</span>
                <span className="text-cyan-400 font-mono-code text-[11px] truncate block">
                  0x7f9a4b2c89e13d0a51c4e672f88921b0
                </span>
                <span className="text-[10px] text-slate-500">SHA-256 Distributed Ledger Digest</span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Verified Resilience Rank</span>
                <span className="text-emerald-300 font-bold text-sm block">
                  Lead Agronomic Forecaster
                </span>
                <span className="text-[10px] text-slate-500">Continuous 2n Apomixis Specialist</span>
              </div>
            </div>

            {/* Embedded Telemetry Snapshot */}
            <div className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
              <span className="text-amber-400 font-bold uppercase text-[10px] block">
                Immutable Telemetry Snapshot Locked with Credential:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-400">
                <div>Vault Core: <strong className="text-cyan-300">{telemetry.vaultTemperatureCelsius}°C</strong></div>
                <div>Earth Mitigation: <strong className="text-emerald-300">-{telemetry.naturalSoilIsolation}°C</strong></div>
                <div>Relative Humidity: <strong className="text-purple-300">{telemetry.relativeHumidityPercent}%</strong></div>
                <div>Heterosis Retention: <strong className="text-amber-300">{appliedParams?.f1HeterosisRetentionPct || 99.8}%</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Portability: Syncable with Academic National Depository (NAD / Digilocker) & LinkedIn Skill Badges</span>
              <span className="text-emerald-400 font-bold">Zero-Knowledge Proof: VALID</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
