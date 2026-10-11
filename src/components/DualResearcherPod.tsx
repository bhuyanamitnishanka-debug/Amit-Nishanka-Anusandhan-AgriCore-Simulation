import React, { useState, useEffect, useRef } from 'react';
import { ResearcherPodState, MicroclimateOutput, CompiledSimulationParameters } from '../types';
import { 
  Users, 
  Sparkles, 
  Radio, 
  Volume2, 
  VolumeX, 
  Eye, 
  Cpu, 
  Dna, 
  Compass, 
  Layers,
  Activity,
  Zap,
  RotateCw
} from 'lucide-react';

interface Props {
  telemetry: MicroclimateOutput;
  appliedParams: CompiledSimulationParameters | null;
}

export const DualResearcherPod: React.FC<Props> = ({
  telemetry,
  appliedParams
}) => {
  const [podState, setPodState] = useState<ResearcherPodState>({
    researcher1Role: 'Agronomist & Bio-Chemist',
    researcher2Role: 'Computational NLP Architect',
    hologramActive: true,
    hologramProjectionType: 'manuscript_scroll',
    podStatus: 'ONLINE_SYNCED',
    audioResonanceEnabled: false
  });

  const [rotationAngle, setRotationAngle] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Rotation animation for hologram
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setRotationAngle((prev) => (prev + 0.8) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Web Audio ambient drone effect
  const toggleAudioResonance = () => {
    if (!podState.audioResonanceEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 136.1 Hz (Frequency of OM / Vedic resonant frequency)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(136.1, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioContextRef.current = ctx;
        oscillatorRef.current = osc;

        setPodState(prev => ({ ...prev, audioResonanceEnabled: true }));
      } catch (e) {
        console.error('Audio init failed', e);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        oscillatorRef.current = null;
      }
      setPodState(prev => ({ ...prev, audioResonanceEnabled: false }));
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 lg:p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono-code">
                TIER 2 POD HUD
              </span>
              <span className="text-xs text-slate-400 font-mono-code">2-PERSON COLLABORATIVE SIMULATION POD</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
              अनुसन्धान-कक्षा • Dual-Operator Holographic Terminal
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 mt-1 max-w-3xl">
              Synchronized tactile and volumetric console connecting the Agronomist and Computational Sanskrit Architect in real time inside the subterranean tier 2 pod.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAudioResonance}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono-code border transition-all flex items-center gap-2 ${
                podState.audioResonanceEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {podState.audioResonanceEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              {podState.audioResonanceEnabled ? 'Vedic Resonant Drone: 136.1 Hz' : 'Ambient Sound: Muted'}
            </button>

            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono-code bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              POD LINK: ONLINE_SYNCED
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Person Pod HUD Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Seat: Researcher 1 (Agronomist Console) */}
        <div className="xl:col-span-4 bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono-code uppercase text-emerald-400">Seat Alpha (Left)</span>
              <h3 className="text-sm font-bold text-white">Chief Agronomist & Bio-Chemist</h3>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></div>
          </div>

          <div className="space-y-3 font-mono-code text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Seed Envelope Micro-Encapsulation</span>
              <span className="text-emerald-300 font-bold text-sm">
                {appliedParams?.seedCoatDensity || 1.62} g/cm³ Colloid Density
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">Bijamrita Tri-Fold Suspension</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Embryo Cryo-Vitrification Index</span>
              <span className="text-cyan-300 font-bold text-sm">
                {((appliedParams?.cryoDesiccationTolerance || 0.92) * 100).toFixed(0)}% Tolerance
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">-18°C Ice Crystal Prevention</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Microbial Shield Factor</span>
              <span className="text-teal-300 font-bold text-sm">
                {((appliedParams?.microbialBarrierIndex || 0.94) * 100).toFixed(0)}% Protective Index
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">Antifungal / Fusarium Neutralizer</div>
            </div>
          </div>
        </div>

        {/* Center: Volumetric Holographic Projector Console */}
        <div className="xl:col-span-4 bg-slate-950/95 border border-cyan-500/30 rounded-xl p-5 flex flex-col justify-between items-center relative overflow-hidden holo-scanlines">
          {/* Top Projection Switcher */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 z-10">
            <span className="text-xs font-mono-code text-cyan-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Volumetric Holographic Emitter
            </span>
            <div className="flex gap-1">
              {(['manuscript_scroll', 'seed_embryo', 'baoli_thermal', 'apomixis_dna'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPodState(prev => ({ ...prev, hologramProjectionType: type }))}
                  className={`px-2 py-1 rounded text-[10px] font-mono-code transition-all ${
                    podState.hologramProjectionType === type
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400'
                      : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {type.split('_')[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Rotating Holographic Centerpiece */}
          <div className="relative w-64 h-64 my-4 flex items-center justify-center">
            {/* Holographic Glowing Rings */}
            <div
              className="absolute inset-0 rounded-full border border-cyan-500/30 animate-pulse"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            />
            <div
              className="absolute inset-4 rounded-full border border-dashed border-amber-500/30"
              style={{ transform: `rotate(${-rotationAngle * 1.5}deg)` }}
            />

            {/* Projection Graphics by Type */}
            {podState.hologramProjectionType === 'manuscript_scroll' && (
              <div
                className="text-center p-4 rounded-xl bg-cyan-950/40 border border-cyan-400/40 holo-glow-cyan transform transition-transform"
                style={{ transform: `rotateY(${rotationAngle * 0.5}deg)` }}
              >
                <div className="text-xl font-sanskrit font-bold text-amber-200 drop-shadow-md">
                  ॐ गोमयेन प्रलिप्तानि
                </div>
                <div className="text-sm font-sanskrit text-cyan-300 mt-1">
                  क्षीरेण परिभावितानि
                </div>
                <div className="text-[10px] font-mono-code text-slate-400 mt-2">
                  Vrikshayurveda • Folio 42B
                </div>
              </div>
            )}

            {podState.hologramProjectionType === 'seed_embryo' && (
              <div className="text-center space-y-2">
                <div className="w-24 h-32 mx-auto rounded-full bg-gradient-to-b from-amber-400/80 via-emerald-500/60 to-cyan-500/80 p-1 flex items-center justify-center holo-glow-amber">
                  <div className="w-16 h-24 rounded-full bg-slate-950 flex items-center justify-center text-xs font-mono-code text-amber-200 font-bold">
                    2n Embryo
                  </div>
                </div>
                <div className="text-xs font-mono-code text-cyan-300">
                  Bijamrita Coated Caryopsis
                </div>
              </div>
            )}

            {podState.hologramProjectionType === 'baoli_thermal' && (
              <div className="text-center space-y-2">
                <div className="w-32 h-24 mx-auto border-2 border-cyan-400 rounded-lg p-2 flex flex-col justify-around holo-glow-cyan">
                  <div className="h-2 bg-amber-500/80 rounded w-full"></div>
                  <div className="h-2 bg-emerald-500/80 rounded w-4/5 mx-auto"></div>
                  <div className="h-2 bg-cyan-500/80 rounded w-3/5 mx-auto"></div>
                  <div className="h-2 bg-blue-600/80 rounded w-2/5 mx-auto"></div>
                </div>
                <div className="text-xs font-mono-code text-cyan-300">
                  -18°C Deep Subterranean Sump
                </div>
              </div>
            )}

            {podState.hologramProjectionType === 'apomixis_dna' && (
              <div className="text-center space-y-2">
                <Dna className="w-24 h-24 mx-auto text-emerald-400 animate-pulse holo-glow-emerald" />
                <div className="text-xs font-mono-code text-emerald-300 font-bold">
                  2n Cloned Maternal Genome Locked
                </div>
              </div>
            )}
          </div>

          {/* Bottom Emitter Telemetry */}
          <div className="w-full text-center text-[10px] font-mono-code text-slate-400 border-t border-slate-800 pt-2 z-10">
            Holographic Laser Grid: 532nm Green + 450nm Blue Inverted Prism Emitter
          </div>
        </div>

        {/* Right Seat: Researcher 2 (Computational Architect Console) */}
        <div className="xl:col-span-4 bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono-code uppercase text-cyan-400">Seat Beta (Right)</span>
              <h3 className="text-sm font-bold text-white">Computational Sanskrit Architect</h3>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></div>
          </div>

          <div className="space-y-3 font-mono-code text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Paninian Ashtadhyayi Parser State</span>
              <span className="text-amber-300 font-bold text-sm">
                Zero Context Drift (Algorithmic)
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">Dhatu-Pratyaya Graph: Active</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Subterranean SMR Absorption Heat Flux</span>
              <span className="text-blue-300 font-bold text-sm">
                -{telemetry.naturalSoilIsolation}°C Earth Dampening
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">Vault Temp: {telemetry.vaultTemperatureCelsius}°C</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Apomixis Ploidy Lock Status</span>
              <span className="text-emerald-300 font-bold text-sm">
                2n Maternal Integrity Verified
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">100% Heterosis Retention across F-Generations</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
