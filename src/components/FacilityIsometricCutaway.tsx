import React, { useState } from 'react';
import { FACILITY_TIERS } from '../data/facilityTiers';
import { FacilityTierId, MicroclimateState, MicroclimateOutput } from '../types';
import { Sun, Shield, Thermometer, Droplets, Zap, Eye, ChevronRight, Sparkles, Layers, Activity, Download } from 'lucide-react';
import { SmrPowerGridDashboard } from './SmrPowerGridDashboard';

interface Props {
  selectedTierId: FacilityTierId;
  onSelectTier: (id: FacilityTierId) => void;
  microclimate: MicroclimateState;
  telemetry: MicroclimateOutput;
  onDownloadTelemetry?: () => void;
}

export const FacilityIsometricCutaway: React.FC<Props> = ({
  selectedTierId,
  onSelectTier,
  microclimate,
  telemetry,
  onDownloadTelemetry
}) => {
  const [activeHighlight, setActiveHighlight] = useState<FacilityTierId | null>(null);
  const [showParticleFlow, setShowParticleFlow] = useState(true);

  const selectedTier = FACILITY_TIERS.find(t => t.id === selectedTierId) || FACILITY_TIERS[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Top Header / Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
              Live Isometric Pod Telemetry
            </span>
            <span className="text-xs text-slate-400 font-mono-code">BHARTIYA STEP-WELL BIO-ARCHITECTURE</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold font-display text-amber-200 mt-1 flex items-center gap-2">
            अमित निशङ्क अनुसन्धान • AgriCore Complex
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {onDownloadTelemetry && (
            <button
              onClick={onDownloadTelemetry}
              className="px-3 py-1.5 rounded-lg text-xs font-mono-code font-semibold border transition-all flex items-center gap-1.5 bg-cyan-500/15 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/25 shadow-sm"
              title="Download active micro-climate state, applied parameters, and tier metrics as JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Download Telemetry
            </button>
          )}
          <button
            onClick={() => setShowParticleFlow(!showParticleFlow)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
              showParticleFlow
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {showParticleFlow ? 'Fluid & Flux Vectors: ON' : 'Vector Dynamics: OFF'}
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Cutaway SVG Diagram (Left) & Live Tier Inspector (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Architectural Cutaway Diagram Canvas */}
        <div className="xl:col-span-8 relative bg-slate-950/80 rounded-xl border border-slate-800 p-2 sm:p-4 overflow-hidden holo-scanlines">
          {/* Depth / Temperature Axis Indicator */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/90 border border-slate-700/70 px-3 py-1.5 rounded-lg text-xs font-mono-code text-slate-300">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>Surface Ambient: <strong className="text-amber-300">{microclimate.ambientTemp}°C</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300">Vault Core: <strong>{telemetry.vaultTemperatureCelsius}°C</strong></span>
          </div>

          {/* SVG Cross-Section Cutaway of the Entire Facility */}
          <div className="w-full aspect-[16/11] relative select-none">
            <svg
              viewBox="0 0 900 640"
              className="w-full h-full drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradients */}
                <radialGradient id="domeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
                </radialGradient>
                
                <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3d2c1d" />
                  <stop offset="40%" stopColor="#291e13" />
                  <stop offset="80%" stopColor="#1a140c" />
                  <stop offset="100%" stopColor="#0c0906" />
                </linearGradient>

                <linearGradient id="stepStone" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#78593a" />
                  <stop offset="50%" stopColor="#573f27" />
                  <stop offset="100%" stopColor="#3a2919" />
                </linearGradient>

                <linearGradient id="smrCoreGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
                </linearGradient>

                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Subterranean Earth Matrix */}
              <rect x="50" y="170" width="800" height="450" fill="url(#soilGradient)" rx="12" />

              {/* Soil Stratum Thermal Lines */}
              <g opacity="0.25" stroke="#a16207" strokeDasharray="4 6" strokeWidth="1">
                <line x1="50" y1="230" x2="850" y2="230" />
                <line x1="50" y1="330" x2="850" y2="330" />
                <line x1="50" y1="440" x2="850" y2="440" />
                <line x1="50" y1="540" x2="850" y2="540" />
              </g>

              {/* Depth Markers on Left */}
              <g fontSize="11" fontFamily="JetBrains Mono" fill="#94a3b8" opacity="0.8">
                <text x="58" y="195">0.0m (Ground Level)</text>
                <text x="58" y="275">-3.5m (Tier 1)</text>
                <text x="58" y="380">-6.0m (Tier 2)</text>
                <text x="58" y="490">-9.5m (Tier 3)</text>
                <text x="58" y="585">-14.0m (SMR Sump)</text>
              </g>

              {/* Ancient Bharatiya Step-Well (Baoli) Stone Steps Geometry */}
              <g fill="url(#stepStone)" stroke="#261b11" strokeWidth="1.5">
                {/* Left Step Ramps */}
                <polygon points="170,170 230,170 230,260 170,260" />
                <polygon points="200,260 250,260 250,370 200,370" />
                <polygon points="220,370 270,370 270,480 220,480" />
                
                {/* Right Step Ramps */}
                <polygon points="670,170 730,170 730,260 670,260" />
                <polygon points="650,260 700,260 700,370 650,370" />
                <polygon points="630,370 680,370 680,480 630,480" />
                
                {/* Step Rungs Detailing */}
                {[...Array(12)].map((_, i) => (
                  <line
                    key={`step-${i}`}
                    x1="180"
                    y1={175 + i * 25}
                    x2="225"
                    y2={195 + i * 25}
                    stroke="#a67c52"
                    strokeWidth="1.2"
                    opacity="0.4"
                  />
                ))}
              </g>

              {/* Central Spiral Stairwell Shaft */}
              <rect x="420" y="170" width="60" height="340" fill="#1e1812" stroke="#3d2b1a" strokeWidth="2" />
              {[...Array(9)].map((_, i) => (
                <ellipse
                  key={`spiral-${i}`}
                  cx="450"
                  cy={190 + i * 36}
                  rx="24"
                  ry="8"
                  fill="none"
                  stroke="#854d0e"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              ))}

              {/* ================= LEVEL 0: GREENHOUSE DOME (ETFE PANELS) ================= */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectTier('dome')}
                onMouseEnter={() => setActiveHighlight('dome')}
                onMouseLeave={() => setActiveHighlight(null)}
              >
                {/* Dome Sky Radiation Aura */}
                <ellipse cx="450" cy="160" rx="200" ry="140" fill="url(#domeGlow)" />

                {/* Triple Layer ETFE Geodesic Dome Arch */}
                <path
                  d="M 250,170 A 200,150 0 0,1 650,170 Z"
                  fill={selectedTierId === 'dome' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(56, 189, 248, 0.18)'}
                  stroke="#38bdf8"
                  strokeWidth={selectedTierId === 'dome' ? "3" : "2"}
                  filter={selectedTierId === 'dome' ? 'url(#glowEffect)' : undefined}
                />

                {/* ETFE Geodesic Facet Grid Lines */}
                <g stroke="#7dd3fc" strokeWidth="1.2" opacity="0.6">
                  <path d="M 450,20 Q 350,100 290,170" fill="none" />
                  <path d="M 450,20 Q 450,100 450,170" fill="none" />
                  <path d="M 450,20 Q 550,100 610,170" fill="none" />
                  <line x1="330" y1="75" x2="570" y2="75" />
                  <line x1="280" y1="125" x2="620" y2="125" />
                </g>

                {/* Lush Tropical Flora Inside Greenhouse Dome */}
                <g fill="#22c55e" opacity="0.85">
                  <ellipse cx="450" cy="155" rx="35" ry="20" fill="#15803d" />
                  <ellipse cx="390" cy="160" rx="30" ry="16" fill="#16a34a" />
                  <ellipse cx="510" cy="160" rx="30" ry="16" fill="#16a34a" />
                  <path d="M 445,150 Q 430,110 420,105 Q 435,115 448,145" fill="#4ade80" />
                  <path d="M 455,150 Q 470,108 480,105 Q 465,115 452,145" fill="#4ade80" />
                  <path d="M 450,140 Q 450,95 450,90 Q 452,105 450,140" stroke="#86efac" strokeWidth="3" fill="none" />
                </g>

                {/* Dome Label */}
                <rect x="360" y="35" width="180" height="26" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                <text x="450" y="52" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="bold" fontFamily="Cinzel">
                  GREENHOUSE DOME (ETFE)
                </text>
              </g>

              {/* ================= LEVEL 1: HYDROPONIC PHYTOTRON NURSERY ================= */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectTier('tier1')}
                onMouseEnter={() => setActiveHighlight('tier1')}
                onMouseLeave={() => setActiveHighlight(null)}
              >
                {/* Chamber Background */}
                <rect
                  x="230"
                  y="180"
                  width="440"
                  height="85"
                  rx="6"
                  fill={selectedTierId === 'tier1' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(15, 23, 42, 0.9)'}
                  stroke={selectedTierId === 'tier1' ? '#22c55e' : '#334155'}
                  strokeWidth={selectedTierId === 'tier1' ? "2.5" : "1"}
                />

                {/* Left Phytotron Racks with LED Grow Lights */}
                <rect x="250" y="195" width="145" height="58" fill="#0f172a" stroke="#475569" strokeWidth="1" rx="4" />
                {[0, 1, 2].map((r) => (
                  <g key={`rack-l-${r}`}>
                    <line x1="255" y1={208 + r * 16} x2="390" y2={208 + r * 16} stroke="#e11d48" strokeWidth="2" opacity="0.8" />
                    <line x1="255" y1={212 + r * 16} x2="390" y2={212 + r * 16} stroke="#3b82f6" strokeWidth="1" opacity="0.8" />
                    {[...Array(6)].map((_, c) => (
                      <circle key={`seed-l-${r}-${c}`} cx={265 + c * 22} cy={218 + r * 16} r="3" fill="#22c55e" />
                    ))}
                  </g>
                ))}

                {/* Right Phytotron Vertical Racks */}
                <rect x="505" y="195" width="145" height="58" fill="#0f172a" stroke="#475569" strokeWidth="1" rx="4" />
                {[0, 1, 2].map((r) => (
                  <g key={`rack-r-${r}`}>
                    <line x1="510" y1={208 + r * 16} x2="645" y2={208 + r * 16} stroke="#e11d48" strokeWidth="2" opacity="0.8" />
                    <line x1="510" y1={212 + r * 16} x2="645" y2={212 + r * 16} stroke="#3b82f6" strokeWidth="1" opacity="0.8" />
                    {[...Array(6)].map((_, c) => (
                      <circle key={`seed-r-${r}-${c}`} cx={520 + c * 22} cy={218 + r * 16} r="3" fill="#22c55e" />
                    ))}
                  </g>
                ))}

                <text x="350" y="193" fill="#86efac" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                  TIER 1: HYDROPONIC PHYTOTRON CORE
                </text>
              </g>

              {/* ================= LEVEL 2: SEED EXAMINATION & SIMULATION POD ================= */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectTier('tier2')}
                onMouseEnter={() => setActiveHighlight('tier2')}
                onMouseLeave={() => setActiveHighlight(null)}
              >
                {/* Chamber Background */}
                <rect
                  x="250"
                  y="285"
                  width="400"
                  height="100"
                  rx="6"
                  fill={selectedTierId === 'tier2' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(15, 23, 42, 0.92)'}
                  stroke={selectedTierId === 'tier2' ? '#f59e0b' : '#334155'}
                  strokeWidth={selectedTierId === 'tier2' ? "2.5" : "1"}
                />

                {/* Automated Seed Examination Trays on Left */}
                <rect x="270" y="315" width="130" height="55" fill="#1e293b" stroke="#64748b" strokeWidth="1" rx="4" />
                <line x1="270" y1="335" x2="400" y2="335" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                {/* Robotic Sorting Gantry Head */}
                <rect x="320" y="302" width="30" height="15" fill="#f59e0b" rx="2" />
                <line x1="335" y1="317" x2="335" y2="335" stroke="#fbbf24" strokeWidth="2" />

                {/* 2-Person Holo-Simulation Pod on Right */}
                <path d="M 505,370 A 55,55 0 0,1 615,370 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                {/* Dual Researcher Seats */}
                <circle cx="540" cy="350" r="8" fill="#38bdf8" opacity="0.9" />
                <circle cx="580" cy="350" r="8" fill="#38bdf8" opacity="0.9" />

                {/* Holographic Manuscript Emitter Projection */}
                <ellipse cx="560" cy="320" rx="30" ry="12" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M 535,340 L 560,310 L 585,340" stroke="#38bdf8" strokeWidth="1" opacity="0.5" fill="none" />
                {/* Devanagari Floating Glyphs (Miniature) */}
                <text x="560" y="324" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="Tiro Devanagari Sanskrit" fontWeight="bold">
                  ॐ बीजामृतम्
                </text>

                <text x="330" y="300" fill="#fde68a" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                  TIER 2: ROBOTICS & 2-PERSON SIMULATION POD
                </text>
              </g>

              {/* ================= LEVEL 3: CRYOGENIC COLD STORAGE VAULT (-18°C) ================= */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectTier('tier3')}
                onMouseEnter={() => setActiveHighlight('tier3')}
                onMouseLeave={() => setActiveHighlight(null)}
              >
                {/* Chamber Background with Frost Blue Tint */}
                <rect
                  x="270"
                  y="405"
                  width="360"
                  height="95"
                  rx="6"
                  fill={selectedTierId === 'tier3' ? 'rgba(6, 182, 212, 0.35)' : 'rgba(8, 47, 73, 0.75)'}
                  stroke={selectedTierId === 'tier3' ? '#22d3ee' : '#0284c7'}
                  strokeWidth={selectedTierId === 'tier3' ? "2.5" : "1.2"}
                />

                {/* Left Armored Cryo Racks & Containment Dewars */}
                <rect x="290" y="420" width="115" height="65" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" rx="4" />
                {/* LN2 Dewar Cylinders */}
                <rect x="300" y="440" width="16" height="38" rx="4" fill="#e0f2fe" stroke="#38bdf8" />
                <rect x="325" y="440" width="16" height="38" rx="4" fill="#e0f2fe" stroke="#38bdf8" />
                <rect x="350" y="440" width="16" height="38" rx="4" fill="#e0f2fe" stroke="#38bdf8" />

                {/* Right Armored Stainless Steel Blast Doors */}
                <rect x="495" y="420" width="120" height="65" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" rx="4" />
                <circle cx="555" cy="452" r="14" fill="#334155" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="555" y1="442" x2="555" y2="462" stroke="#f1f5f9" strokeWidth="2" />
                <line x1="545" y1="452" x2="565" y2="452" stroke="#f1f5f9" strokeWidth="2" />

                <text x="340" y="419" fill="#a5f3fc" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                  TIER 3: CRYO-HYDRO COLD STORAGE (-18°C)
                </text>
              </g>

              {/* ================= SMR-MHD GEOTHERMAL SUMP CORE ================= */}
              <g
                className="cursor-pointer transition-all duration-300"
                onClick={() => onSelectTier('smr')}
                onMouseEnter={() => setActiveHighlight('smr')}
                onMouseLeave={() => setActiveHighlight(null)}
              >
                {/* Sump Cavern */}
                <rect
                  x="380"
                  y="520"
                  width="140"
                  height="90"
                  rx="10"
                  fill={selectedTierId === 'smr' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(15, 23, 42, 0.95)'}
                  stroke={selectedTierId === 'smr' ? '#60a5fa' : '#2563eb'}
                  strokeWidth={selectedTierId === 'smr' ? "3" : "1.5"}
                />

                {/* SMR Fluid Capsule */}
                <rect x="420" y="535" width="60" height="60" rx="30" fill="url(#smrCoreGlow)" filter="url(#glowEffect)" />
                {/* MHD Magnetic Rings */}
                <ellipse cx="450" cy="550" rx="26" ry="7" fill="none" stroke="#93c5fd" strokeWidth="2" />
                <ellipse cx="450" cy="565" rx="26" ry="7" fill="none" stroke="#93c5fd" strokeWidth="2" />
                <ellipse cx="450" cy="580" rx="26" ry="7" fill="none" stroke="#93c5fd" strokeWidth="2" />

                {/* Geothermal Heat Dissipation Coils Outward */}
                <path d="M 420,565 Q 350,565 330,590" stroke="#0284c7" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                <path d="M 480,565 Q 550,565 570,590" stroke="#0284c7" strokeWidth="2" fill="none" strokeDasharray="3 3" />

                <text x="450" y="622" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                  SMR-MHD GEOTHERMAL CORE
                </text>
              </g>

              {/* Dynamic Vectors / Particles (Flowing coolant & heat sinks) */}
              {showParticleFlow && (
                <g opacity="0.75">
                  {/* Heat Rising Vector */}
                  <path d="M 230,340 C 210,280 220,200 240,150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" fill="none">
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="2s" repeatCount="indefinite" />
                  </path>
                  {/* Cryo Cold Falling Vector */}
                  <path d="M 670,220 C 685,300 670,420 640,480" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 4" fill="none">
                    <animate attributeName="stroke-dashoffset" values="0;20" dur="2.5s" repeatCount="indefinite" />
                  </path>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Interactive Tier Quick-Jump Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-slate-800/80">
            {FACILITY_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => onSelectTier(tier.id)}
                className={`text-left p-2 rounded-lg border transition-all ${
                  selectedTierId === tier.id
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] uppercase font-mono-code text-slate-500">{tier.depthMeters}m depth</div>
                <div className="text-xs font-bold truncate">{tier.name.split(':')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Tier Inspector & Telemetry HUD */}
        <div className="xl:col-span-4 bg-slate-950/90 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono-code text-amber-400 font-semibold uppercase tracking-wider">
                Active Tier Profile
              </span>
              <h3 className="text-lg font-bold text-white font-display">
                {selectedTier.name}
              </h3>
              <p className="text-xs text-amber-300 font-sanskrit">
                {selectedTier.sanskritName}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono-code text-cyan-300">
                {selectedTier.id === 'tier3'
                  ? `${telemetry.vaultTemperatureCelsius}°C`
                  : `${selectedTier.temperatureCelsius}°C`}
              </span>
              <div className="text-[10px] text-slate-400 font-mono-code">SUBTERRANEAN TEMP</div>
            </div>
          </div>

          {/* Primary Function */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Functional Blueprint
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              {selectedTier.primaryFunction}
            </p>
          </div>

          {/* Active Engineering Systems */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Automated Systems & Instrumentation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedTier.systems.map((sys, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-slate-800/60">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{sys}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Real-time Tier Telemetry Pills */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono-code">Relative Humidity</div>
              <div className="text-sm font-bold text-emerald-400 font-mono-code">
                {selectedTier.id === 'tier3' ? `${telemetry.relativeHumidityPercent}%` : `${selectedTier.relativeHumidityPercent}%`}
              </div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono-code">Earth Damping</div>
              <div className="text-sm font-bold text-amber-400 font-mono-code">
                -{(selectedTier.depthMeters * 1.85).toFixed(1)}°C Delta
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SMR Power Grid Status & Energy-to-Coolant Reactive Graph Dashboard */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <SmrPowerGridDashboard
          microclimate={microclimate}
          telemetry={telemetry}
        />
      </div>
    </div>
  );
};
