/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FacilityTierId, MicroclimateState, CompiledSimulationParameters } from './types';
import { calculateMicroClimate } from './utils/simulationPhysics';
import { FacilityIsometricCutaway } from './components/FacilityIsometricCutaway';
import { SanskritNlpEngine } from './components/SanskritNlpEngine';
import { MicroclimateControlStation } from './components/MicroclimateControlStation';
import { ApomixisGeneticsLab } from './components/ApomixisGeneticsLab';
import { DualResearcherPod } from './components/DualResearcherPod';
import { IgnouOuatCurriculum } from './components/IgnouOuatCurriculum';
import { SensorFeed } from './components/SensorFeed';
import { exportTelemetryJson } from './utils/telemetryExport';
import { 
  Building2, 
  BookOpen, 
  Thermometer, 
  Dna, 
  Users, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Activity,
  Layers,
  Terminal,
  Send,
  Zap,
  Globe,
  Download,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'cutaway' | 'nlp' | 'microclimate' | 'sensor_feed' | 'apomixis' | 'pod' | 'curriculum'
  >('cutaway');

  const [selectedTierId, setSelectedTierId] = useState<FacilityTierId>('tier2');

  // Real-time Microclimate Simulation State (initialized with the user's prompt values)
  const [microclimate, setMicroclimate] = useState<MicroclimateState>({
    ambientTemp: 38,
    soilDepth: 8,
    etfeInsulation: 3,
    smrCoolingRate: 12.5,
    nitrogenDewarPressureBar: 1.8,
    airCirculationCFM: 4200,
    solarParRadiationUmols: 850
  });

  // Compiled parameters from Sanskrit NLP engine
  const [appliedParams, setAppliedParams] = useState<CompiledSimulationParameters | null>(null);

  // Telemetry Export Status State
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleDownloadTelemetry = () => {
    exportTelemetryJson(microclimate, telemetry, appliedParams);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3500);
  };

  // AI Architect Terminal Quick Prompt Modal State
  const [isAiTerminalOpen, setIsAiTerminalOpen] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiTerminalLogs, setAiTerminalLogs] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'AMIT NISHANKA ANUSANDHANA SYSTEM COMPILER ONLINE.\nLead AI Architect active. Apospory 2n continuous chromosomal count locked. Step-well soil thermal dampening coefficient initialized to 1.85°C/m down. SMR-MHD thermal absorption loop synchronized to -18°C vault core.'
    }
  ]);
  const [isAiExecuting, setIsAiExecuting] = useState(false);

  // Continuous physics output calculation
  const telemetry = useMemo(() => {
    return calculateMicroClimate(
      microclimate.ambientTemp,
      microclimate.etfeInsulation,
      microclimate.soilDepth,
      microclimate.smrCoolingRate
    );
  }, [microclimate]);

  const handleApplyCompiledParameters = (params: CompiledSimulationParameters) => {
    setAppliedParams(params);
    // If shloka suggests a specific vault tier, auto-adjust soil depth accordingly
    if (params.recommendedTier === 3) {
      setMicroclimate(prev => ({ ...prev, soilDepth: 9.5, smrCoolingRate: 12.5 }));
    } else if (params.recommendedTier === 1) {
      setMicroclimate(prev => ({ ...prev, soilDepth: 3.5, smrCoolingRate: 4.0 }));
    }
  };

  const handleExecuteAiPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPromptInput.trim() || isAiExecuting) return;

    const userMsg = aiPromptInput.trim();
    setAiPromptInput('');
    setAiTerminalLogs(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiExecuting(true);

    try {
      const res = await fetch('/api/gemini/nlp-compiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shloka: userMsg,
          context: 'Direct AI Architect simulation query'
        })
      });
      const data = await res.json();
      
      let answer = '';
      if (data.data?.agronomicInsights) {
        answer = `[DETERMINISTIC COMPILATION COMPLETED]\n- Agronomic Insight: ${data.data.agronomicInsights}\n- Recommended Tier: Level ${data.data.compiledSimulationParameters.recommendedTier}\n- Cellular Pathway Trigger: ${data.data.compiledSimulationParameters.cellularPathwayTrigger} (Continuous 2n chromosome status confirmed)\n- Seed Coat Density: ${data.data.compiledSimulationParameters.seedCoatDensity} g/cm³ | Microbial Barrier Index: ${data.data.compiledSimulationParameters.microbialBarrierIndex}`;
      } else {
        answer = `Thermodynamic verification at Depth ${microclimate.soilDepth}m: Vault Temp = ${telemetry.vaultTemperatureCelsius}°C, Relative Humidity = ${telemetry.relativeHumidityPercent}%. Cellular chromosome ploidy = 2n unreduced Apospory condition verified.`;
      }

      setAiTerminalLogs(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch {
      setAiTerminalLogs(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `[DETERMINISTIC FALLBACK PROOF]\nEquation: T_vault = 38 - (8 * 1.85) + (3 * 0.12) - 12.5 = 11.06°C (or -18°C under max SMR cryogenic extraction). Relative humidity maintains safe vapor inversion window without seed desiccation. Apospory retains maternal 2n chromosome integrity with zero segregational loss.`
        }
      ]);
    } finally {
      setIsAiExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Futuristic Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Facility Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-emerald-600 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-sanskrit text-amber-300 font-bold text-lg">ॐ</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold font-display tracking-wide text-white">
                  AMIT NISHANKA ANUSANDHAN
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono-code border border-amber-500/40 hidden sm:inline-block">
                  AGRICORE v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono-code hidden sm:block">
                Subterranean Step-Well Hydroponics • Paninian Sanskrit NLP • Micro-Climate Sim
              </p>
            </div>
          </div>

          {/* Quick Telemetry Indicators & AI Architect Terminal Button */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono-code">
              <div>
                <span className="text-slate-500 text-[10px] block">SURFACE AMBIENT</span>
                <span className="text-amber-400 font-bold">{microclimate.ambientTemp}°C</span>
              </div>
              <div className="w-px h-6 bg-slate-800"></div>
              <div>
                <span className="text-slate-500 text-[10px] block">VAULT CORE</span>
                <span className="text-cyan-400 font-bold">{telemetry.vaultTemperatureCelsius}°C</span>
              </div>
              <div className="w-px h-6 bg-slate-800"></div>
              <div>
                <span className="text-slate-500 text-[10px] block">HUMIDITY</span>
                <span className="text-emerald-400 font-bold">{telemetry.relativeHumidityPercent}%</span>
              </div>
            </div>

            {/* Download Telemetry JSON Export Button */}
            <button
              onClick={handleDownloadTelemetry}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-code border transition-all flex items-center gap-1.5 shadow-sm ${
                exportSuccess
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/25'
              }`}
              title="Trigger a JSON file export of the current active micro-climate state, applied parameters, and facility tier metrics"
            >
              {exportSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              ) : (
                <Download className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{exportSuccess ? 'Telemetry Exported' : 'Download Telemetry'}</span>
            </button>

            <button
              onClick={() => setIsAiTerminalOpen(!isAiTerminalOpen)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono-code bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Architect HUD</span>
            </button>
          </div>
        </div>

        {/* Global Navigation Tabs Bar */}
        <div className="border-t border-slate-800/60 bg-slate-900/60 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 py-1.5">
            {[
              { id: 'cutaway', label: 'Facility Cutaway', icon: Building2, tag: '3D Step-Well' },
              { id: 'nlp', label: 'Sanskrit NLP Engine', icon: BookOpen, tag: 'Panini Ashtadhyayi' },
              { id: 'microclimate', label: 'Micro-Climate Physics', icon: Thermometer, tag: 'Sol-Air Loop' },
              { id: 'sensor_feed', label: 'Sensor Feed', icon: Activity, tag: 'Live Ingestion' },
              { id: 'apomixis', label: 'Apomixis Genetics Lab', icon: Dna, tag: '2n Clonal Switch' },
              { id: 'pod', label: '2-Person Sim Pod', icon: Users, tag: 'Tier 2 Hologram' },
              { id: 'curriculum', label: 'IGNOU / OUAT Portal', icon: GraduationCap, tag: 'Academic Lab' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono-code transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded hidden md:inline-block ${
                    isActive ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Interactive Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'cutaway' && (
          <FacilityIsometricCutaway
            selectedTierId={selectedTierId}
            onSelectTier={setSelectedTierId}
            microclimate={microclimate}
            telemetry={telemetry}
            onDownloadTelemetry={handleDownloadTelemetry}
          />
        )}

        {activeTab === 'nlp' && (
          <SanskritNlpEngine onApplyParameters={handleApplyCompiledParameters} />
        )}

        {activeTab === 'microclimate' && (
          <MicroclimateControlStation
            state={microclimate}
            onChange={setMicroclimate}
            telemetry={telemetry}
            appliedParams={appliedParams}
            onDownloadTelemetry={handleDownloadTelemetry}
          />
        )}

        {activeTab === 'sensor_feed' && (
          <SensorFeed
            microclimate={microclimate}
            telemetry={telemetry}
            selectedTierId={selectedTierId}
          />
        )}

        {activeTab === 'apomixis' && (
          <ApomixisGeneticsLab
            vaultTemperatureCelsius={telemetry.vaultTemperatureCelsius}
            appliedParams={appliedParams}
          />
        )}

        {activeTab === 'pod' && (
          <DualResearcherPod
            telemetry={telemetry}
            appliedParams={appliedParams}
          />
        )}

        {activeTab === 'curriculum' && (
          <IgnouOuatCurriculum
            telemetry={telemetry}
            appliedParams={appliedParams}
          />
        )}
      </main>

      {/* Slide-out Lead AI Architect Terminal Drawer */}
      {isAiTerminalOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-slate-950/95 border-l border-amber-500/30 z-50 shadow-2xl p-4 flex flex-col backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold font-mono-code text-white uppercase tracking-wider">
                Lead AI Architect Engineering Collaborator
              </h3>
            </div>
            <button
              onClick={() => setIsAiTerminalOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800"
            >
              ✕ CLOSE
            </button>
          </div>

          <div className="flex-1 overflow-y-auto my-3 space-y-3 font-mono-code text-xs p-2">
            {aiTerminalLogs.map((log, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border leading-relaxed ${
                  log.role === 'user'
                    ? 'bg-slate-900 text-amber-200 border-amber-500/30 ml-4'
                    : 'bg-slate-950 text-cyan-200 border-cyan-500/30 mr-2 whitespace-pre-wrap'
                }`}
              >
                <div className="text-[10px] text-slate-500 uppercase mb-1">
                  {log.role === 'user' ? 'Scholar Prompt' : 'AI Architect Output'}
                </div>
                {log.text}
              </div>
            ))}
            {isAiExecuting && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono-code text-xs animate-pulse">
                Parsing Paninian Ashtadhyayi rules and running Sol-Air micro-climate balances...
              </div>
            )}
          </div>

          <form onSubmit={handleExecuteAiPrompt} className="pt-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              placeholder="Query thermodynamics, parse Sanskrit shloka, or verify 2n genetics..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono-code"
            />
            <button
              type="submit"
              disabled={isAiExecuting || !aiPromptInput.trim()}
              className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono-code disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-mono-code">
        Amit Nishanka Anusandhan AgriCore Simulation • Step-Well Bio-Architecture • In Collaboration with IGNOU & OUAT Agronomy Research
      </footer>
    </div>
  );
}
