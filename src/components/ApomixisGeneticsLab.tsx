import React, { useState } from 'react';
import { simulateApomixisPathway, ApomixisSimulationResult } from '../utils/simulationPhysics';
import { CompiledSimulationParameters } from '../types';
import { 
  Dna, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Activity, 
  CheckCircle2, 
  HelpCircle,
  Binary,
  Microscope,
  Info
} from 'lucide-react';

interface Props {
  vaultTemperatureCelsius: number;
  appliedParams: CompiledSimulationParameters | null;
}

export const ApomixisGeneticsLab: React.FC<Props> = ({
  vaultTemperatureCelsius,
  appliedParams
}) => {
  const [selectedPathway, setSelectedPathway] = useState<'Apospory' | 'Diplospory' | 'Sexual_Meiotic'>('Apospory');
  const [generationCount, setGenerationCount] = useState<number>(5);

  const seedCoatDensity = appliedParams?.seedCoatDensity || 1.62;
  const microbialBarrierIndex = appliedParams?.microbialBarrierIndex || 0.94;

  const result: ApomixisSimulationResult = simulateApomixisPathway(
    selectedPathway,
    vaultTemperatureCelsius,
    seedCoatDensity,
    microbialBarrierIndex
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-5 lg:p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono-code">
                CELLULAR GENETICS & APOMIXIS SWITCH
              </span>
              <span className="text-xs text-slate-400 font-mono-code">CONTINUOUS 2N CHROMOSOME PRESERVATION</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
              अपोमिक्सिस जनन एवं गुणसूत्र संरक्षण (Apomixis Clonal Genetics Lab)
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 mt-1 max-w-3xl">
              Simulates the biological switch to asexual apomixis (Apospory/Diplospory) to produce cloned seeds with continuous 2n chromosome counts, eliminating genetic segregation and preserving 100% F1 hybrid heterosis indefinitely.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/70 px-4 py-2 rounded-xl border border-slate-800">
            <Microscope className="w-4 h-4 text-emerald-400" />
            <div className="text-left font-mono-code text-xs">
              <div className="text-slate-400 text-[10px]">Ploidy Status</div>
              <strong className={result.isClonal ? 'text-emerald-400' : 'text-amber-400'}>
                {result.chromosomeCount} ({result.isClonal ? 'Locked Clonal 2n' : 'Segregating'})
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Pathway Switcher Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedPathway('Apospory')}
          className={`text-left p-4 rounded-xl border transition-all ${
            selectedPathway === 'Apospory'
              ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/30'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase font-mono-code text-emerald-400">Recommended Pathway</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono-code">2n Pure</span>
          </div>
          <div className="text-sm font-bold text-white">Apospory (अपोस्पोरी)</div>
          <div className="text-xs text-slate-300 mt-1">
            Unreduced embryo sac originates directly from somatic nucellus cell. Completely abolishes meiotic division.
          </div>
        </button>

        <button
          onClick={() => setSelectedPathway('Diplospory')}
          className={`text-left p-4 rounded-xl border transition-all ${
            selectedPathway === 'Diplospory'
              ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500/30'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase font-mono-code text-cyan-400">Apomeiotic Pathway</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-code">2n Restitution</span>
          </div>
          <div className="text-sm font-bold text-white">Diplospory (डिप्लोस्पोरी)</div>
          <div className="text-xs text-slate-300 mt-1">
            Embryo sac originates from megaspore mother cell where meiotic reduction fails or is circumvented (nuclear restitution).
          </div>
        </button>

        <button
          onClick={() => setSelectedPathway('Sexual_Meiotic')}
          className={`text-left p-4 rounded-xl border transition-all ${
            selectedPathway === 'Sexual_Meiotic'
              ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/30'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase font-mono-code text-amber-400">Standard Sexual Control</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-mono-code">1n + 1n</span>
          </div>
          <div className="text-sm font-bold text-white">Sexual Meiosis (लैङ्गिक जनन)</div>
          <div className="text-xs text-slate-300 mt-1">
            Standard gametophytic reduction. Causes 50% segregational decay of hybrid vigor and loss of elite traits per generation.
          </div>
        </button>
      </div>

      {/* Main 2-Column Display: Cytology & Chromosome Visualizer (Left) | Generational Heterosis Decay Curve (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Cytological Diagram & Chromosome Ploidy State */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 font-mono-code">
              <Dna className="w-4 h-4 text-emerald-400" />
              Cellular Cytology & Embryo Origin
            </h3>
            <span className="text-[10px] text-slate-400 font-mono-code">Ovule Nucellar Micro-Architecture</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono-code text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400">Target Pathway:</span>
              <span className="text-white font-bold">{result.pathway}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400">Exact Chromosome Count Condition:</span>
              <span className="text-emerald-300 font-bold text-sm bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                {result.chromosomeCount} ({result.isClonal ? 'Continuous 2n Cloned' : 'Segregated Meiotic'})
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400">Cell of Origin:</span>
              <span className="text-slate-200 text-right max-w-xs">{result.embryoOriginCell}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400">Meiotic State:</span>
              <span className="text-slate-200 text-right max-w-xs">{result.meiosisStatus}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Cryo-Storage Viability (-18°C):</span>
              <span className="text-cyan-300 font-bold text-sm">{result.embryoViabilityCryoPct}%</span>
            </div>
          </div>

          {/* Biological Mechanism Callout */}
          <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300 block mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              Sanskrit Treatise Cross-Reference:
            </strong>
            In Upavana-Vinoda and Vrikshayurveda, continuous propagation of supreme parental vigor (<em>Sasya-Siddha</em>) is achieved through unreduced embryonic triggers, avoiding cross-pollination drift and guaranteeing that farmers never lose seed quality over decades.
          </div>
        </div>

        {/* Right: Generational Heterosis Decay Comparison Simulator */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 font-mono-code">
              <Activity className="w-4 h-4 text-cyan-400" />
              Multi-Generational F1 Heterosis Retention
            </h3>
            <span className="text-[10px] text-slate-400 font-mono-code">Hybrid Vigor Stability</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Generational Projection (F1 through F10):</span>
              <span className="font-mono-code font-bold text-cyan-400">F{generationCount} Generation</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={generationCount}
              onChange={(e) => setGenerationCount(parseInt(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Comparative Generation Chart */}
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5].slice(0, generationCount).map((gen) => {
              // Sexual decay drops by 50% of the hybrid heterozygosity advantage each generation
              const sexualVigor = Math.max(25, 100 - (gen - 1) * 16.5);
              const apomicticVigor = selectedPathway === 'Sexual_Meiotic' ? sexualVigor : 99.8;

              return (
                <div key={gen} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono-code space-y-1">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span className="font-bold text-amber-300">Generation F{gen}:</span>
                    <span className={selectedPathway !== 'Sexual_Meiotic' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {selectedPathway !== 'Sexual_Meiotic' ? `${apomicticVigor}% Clonal Vigor` : `${sexualVigor.toFixed(1)}% Vigor (Segregated)`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        selectedPathway !== 'Sexual_Meiotic' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${selectedPathway !== 'Sexual_Meiotic' ? apomicticVigor : sexualVigor}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seed Coat Cryo Protection Bonus */}
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono-code text-slate-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase block">Active Bijamrita Seed Coat Bonus:</span>
              <span>Density: {seedCoatDensity} g/cm³ | Bio-Barrier: {(microbialBarrierIndex * 100).toFixed(0)}%</span>
            </div>
            <span className="text-emerald-300 font-bold text-sm">
              +{((seedCoatDensity / 1.5) * 15 * microbialBarrierIndex).toFixed(1)}% Cryo Survival
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
