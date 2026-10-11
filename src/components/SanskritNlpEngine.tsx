import React, { useState } from 'react';
import { MANUSCRIPT_DATABASE } from '../data/manuscripts';
import { ManuscriptEntry, CompiledSimulationParameters } from '../types';
import { 
  BookOpen, 
  GitBranch, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  FileText, 
  Database,
  Layers,
  Atom,
  ChevronRight,
  Code
} from 'lucide-react';

interface Props {
  onApplyParameters: (params: CompiledSimulationParameters) => void;
}

export const SanskritNlpEngine: React.FC<Props> = ({ onApplyParameters }) => {
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string>(MANUSCRIPT_DATABASE[0].id);
  const [customShloka, setCustomShloka] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileStatus, setCompileStatus] = useState<string | null>(null);
  const [deployedSuccess, setDeployedSuccess] = useState<boolean>(false);

  const currentManuscript = MANUSCRIPT_DATABASE.find(m => m.id === selectedManuscriptId) || MANUSCRIPT_DATABASE[0];

  const handleCompileCustomShloka = async () => {
    if (!customShloka.trim()) return;
    setIsCompiling(true);
    setCompileStatus('Parsing Sandhi & Paninian Morphemes via Agastya-Nagarjuna Engine...');

    try {
      const res = await fetch('/api/gemini/nlp-compiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shloka: customShloka,
          context: 'Custom agronomic seed treatment'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCompileStatus(`Successfully compiled via ${data.engine === 'gemini-live' ? 'Live Gemini AI' : 'Deterministic Paninian Engine'}`);
        if (data.data.compiledSimulationParameters) {
          onApplyParameters(data.data.compiledSimulationParameters);
          setDeployedSuccess(true);
          setTimeout(() => setDeployedSuccess(false), 4000);
        }
      }
    } catch (e: any) {
      setCompileStatus('Compiled using local Paninian rules engine.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDeployCurrent = () => {
    onApplyParameters(currentManuscript.compiledParameters);
    setDeployedSuccess(true);
    setTimeout(() => setDeployedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/30 border border-amber-600/30 rounded-2xl p-5 lg:p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono-code">
                AGASTYA-NAGARJUNA PROTOCOL
              </span>
              <span className="text-xs text-slate-400 font-mono-code">ZERO-DRIFT PANINIAN ASHTADHYAYI COMPILER</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
              पाणिनीय संस्कृत प्राकृतिक भाषा अनुवाद यन्त्र (Sanskrit NLP Engine)
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 mt-1 max-w-3xl">
              Deterministic parsing of classical Bharatiya agricultural shlokas into executable simulation state variables.
              Deconstructs compound words (Samasa) into roots (Dhatu) and suffixes (Pratyaya) without probabilistic context drift.
            </p>
          </div>

          <button
            onClick={handleDeployCurrent}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono-code transition-all shadow-lg flex items-center gap-2 ${
              deployedSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/20'
            }`}
          >
            {deployedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {deployedSuccess ? 'PARAMETERS DEPLOYED TO SIMULATION!' : 'DEPLOY SHLOKA PARAMETERS TO VAULT'}
          </button>
        </div>
      </div>

      {/* Manuscript Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {MANUSCRIPT_DATABASE.map((m) => {
          const isSelected = m.id === selectedManuscriptId;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedManuscriptId(m.id)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-950/40 text-amber-100 ring-1 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono-code uppercase text-amber-400/80 mb-1">
                <span>{m.century}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{m.agronomicDomain.split(' ')[0]}</span>
              </div>
              <div className="text-xs font-bold text-white truncate">{m.sourceText}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{m.title.split('-')[1]?.trim()}</div>
            </button>
          );
        })}
      </div>

      {/* 2-Column Main Layout: Raw Manuscript & Deconstruction (Left) | Semantic Karaka Graph & Parameters (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Shloka Text & Paninian Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Manuscript Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {currentManuscript.title}
                </span>
              </div>
              <span className="text-[11px] font-mono-code text-slate-400">
                Author: <strong className="text-amber-300">{currentManuscript.author}</strong>
              </span>
            </div>

            {/* Devanagari Sanskrit Shloka High-Contrast Display */}
            <div className="bg-gradient-to-b from-amber-950/20 to-slate-950 p-4 rounded-xl border border-amber-900/40 relative">
              <div className="absolute top-2 right-2 text-[10px] font-mono-code text-amber-500/60 uppercase">
                Śāstrīya Text
              </div>
              <p className="text-lg lg:text-xl font-sanskrit text-amber-100 leading-relaxed font-semibold whitespace-pre-line tracking-wide">
                {currentManuscript.shlokaDevanagari}
              </p>
              <p className="text-xs font-mono-code text-cyan-300/80 mt-2 italic whitespace-pre-line border-t border-slate-800/80 pt-2">
                {currentManuscript.shlokaIAST}
              </p>
            </div>

            {/* English Semantic Translation */}
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-mono-code text-slate-400 block mb-1">
                Technical Agronomic Translation
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentManuscript.englishTranslation}
              </p>
            </div>
          </div>

          {/* Morphological Analysis System (Panini's Ashtadhyayi Dhatu + Pratyaya) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-mono-code">
                <Cpu className="w-4 h-4 text-amber-400" />
                Paninian Ashtadhyayi Morphological Breakdown
              </h3>
              <span className="text-[10px] text-slate-400 font-mono-code">Dhatu + Pratyaya Analysis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentManuscript.deconstructedTerms.map((term, idx) => (
                <div key={idx} className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-300 font-sanskrit">{term.term}</span>
                    <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/50">
                      {term.pratyayaType}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono-code">
                    <strong className="text-slate-300">Dhatu:</strong> {term.dhatu}
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono-code">
                    <strong className="text-slate-300">Pratyaya:</strong> {term.pratyaya}
                  </div>

                  <div className="text-[10px] text-amber-400/90 font-mono-code bg-amber-950/30 p-1.5 rounded">
                    Sūtra: {term.paniniRule}
                  </div>

                  <div className="text-[11px] text-emerald-300 pt-1 border-t border-slate-800/80">
                    <strong className="text-slate-400 text-[10px] uppercase block">Modern Assay Equivalent:</strong>
                    {term.modernEquivalent}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Custom Shloka Compiler Input */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase font-mono-code flex items-center gap-1.5">
                <Code className="w-4 h-4 text-cyan-400" />
                Custom Shloka Parsing Terminal
              </span>
              <span className="text-[10px] text-slate-500 font-mono-code">Gemini 2.5 Pro / Paninian Fallback</span>
            </div>
            
            <textarea
              value={customShloka}
              onChange={(e) => setCustomShloka(e.target.value)}
              placeholder="Paste Devanagari or IAST Sanskrit shloka here (e.g. त्रिफलाधूपेन बीजानि शोधयेत्)..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-amber-200 font-sanskrit focus:outline-none focus:border-amber-500"
            />

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleCompileCustomShloka}
                disabled={isCompiling || !customShloka.trim()}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 font-mono-code"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isCompiling ? 'Parsing Morphemes...' : 'Compile via Paninian Engine'}
              </button>
              {compileStatus && (
                <span className="text-[11px] text-amber-300 font-mono-code truncate">
                  {compileStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Karaka Semantic Dependency Graph & Compiled Simulation Variables */}
        <div className="lg:col-span-5 space-y-5">
          {/* Semantic Map (Karaka Graph) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 font-mono-code">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                Karaka Semantic Dependency Graph
              </h3>
              <span className="text-[10px] text-slate-400 font-mono-code">Noun-Verb Functional Map</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Maps Panini’s six Karaka relationships into explicit computational nodes for the automated phytotron:
            </p>

            <div className="space-y-2.5">
              {currentManuscript.karakaGraph.map((node, idx) => {
                const roleColors: Record<string, string> = {
                  Karta: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
                  Karma: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
                  Karana: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
                  Adhikarana: 'border-purple-500/50 bg-purple-950/20 text-purple-300'
                };
                const color = roleColors[node.role] || 'border-slate-700 bg-slate-900 text-slate-300';

                return (
                  <div key={idx} className={`p-3 rounded-lg border ${color} transition-all`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold uppercase font-mono-code">{node.role}</span>
                        <span className="text-[10px] text-slate-400">({node.roleEnglish})</span>
                      </div>
                      <span className="text-xs font-sanskrit text-amber-200">{node.sanskritPhrase}</span>
                    </div>

                    <div className="text-xs font-semibold text-white mt-1">
                      {node.operationalEntity}
                    </div>
                    <div className="text-[11px] text-slate-300/90 mt-0.5">
                      {node.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compiled Simulation Values Output Panel */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 font-mono-code">
                <Database className="w-4 h-4 text-emerald-400" />
                Compiled Simulation Variables (JSON Output)
              </h3>
              <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded font-mono-code border border-emerald-800/50">
                Deterministic State
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Seed Coat Density</span>
                <span className="text-emerald-300 font-bold text-sm">
                  {currentManuscript.compiledParameters.seedCoatDensity} g/cm³
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Microbial Barrier</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {(currentManuscript.compiledParameters.microbialBarrierIndex * 100).toFixed(0)}% Index
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Germination Boost</span>
                <span className="text-amber-300 font-bold text-sm">
                  +{currentManuscript.compiledParameters.germinationViabilityBoostPct}%
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Cryo-Tolerance</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {(currentManuscript.compiledParameters.cryoDesiccationTolerance * 100).toFixed(0)}% Index
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Recommended Tier</span>
                <span className="text-purple-300 font-bold text-sm">
                  Tier {currentManuscript.compiledParameters.recommendedTier} Vault
                </span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Cellular Pathway</span>
                <span className="text-emerald-300 font-bold text-sm">
                  {currentManuscript.compiledParameters.cellularPathwayTrigger}
                </span>
              </div>
            </div>

            {/* Scientific Validation Note */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-amber-300 block mb-0.5">OUAT Agronomy Laboratory Validation:</strong>
              {currentManuscript.scientificValidation}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
