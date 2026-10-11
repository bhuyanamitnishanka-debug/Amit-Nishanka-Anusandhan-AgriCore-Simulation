import React, { useState } from 'react';
import { CURRICULUM_MODULES } from '../data/manuscripts';
import { CurriculumModule, MicroclimateOutput, CompiledSimulationParameters } from '../types';
import { 
  GraduationCap, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  BookOpen, 
  FileBadge, 
  Sparkles,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { ResilienceHierarchyMap } from './ResilienceHierarchyMap';

interface Props {
  telemetry: MicroclimateOutput;
  appliedParams: CompiledSimulationParameters | null;
}

export const IgnouOuatCurriculum: React.FC<Props> = ({
  telemetry,
  appliedParams
}) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'modules'>('hierarchy');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(CURRICULUM_MODULES[0].id);
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({});
  const [studentName, setStudentName] = useState<string>('Amit Nishanka Bhuyan');
  const [studentRollNo, setStudentRollNo] = useState<string>('OUAT-2026-AGRI-042');

  const currentModule = CURRICULUM_MODULES.find(m => m.id === selectedModuleId) || CURRICULUM_MODULES[0];

  // Evaluate challenge criteria based on live simulation values
  const evaluateChallenge = (mod: CurriculumModule) => {
    if (mod.id === 'mod-thermo') {
      const temp = telemetry.vaultTemperatureCelsius;
      return temp <= mod.challenge.maxGoal && temp >= mod.challenge.minGoal;
    }
    if (mod.id === 'mod-panini') {
      const barrier = appliedParams?.microbialBarrierIndex || 0.94;
      return barrier >= mod.challenge.minGoal;
    }
    if (mod.id === 'mod-apomixis') {
      const heterosis = appliedParams?.f1HeterosisRetentionPct || 99.8;
      return heterosis >= mod.challenge.minGoal;
    }
    if (mod.id === 'mod-smr') {
      const damp = telemetry.thermalDampingEfficiencyPct;
      return damp >= mod.challenge.minGoal;
    }
    return false;
  };

  const isCurrentPassed = evaluateChallenge(currentModule);

  const handleSubmitModuleAssignment = () => {
    if (isCurrentPassed) {
      setCompletedModules(prev => ({ ...prev, [currentModule.id]: true }));
    }
  };

  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const gradePercentage = Math.round((completedCount / CURRICULUM_MODULES.length) * 100);

  const handleDownloadTranscript = () => {
    const report = {
      institution: 'OUAT / IGNOU Joint Advanced Agricultural Simulation Pod',
      studentName,
      studentRollNo,
      completionDate: new Date().toISOString(),
      grade: gradePercentage >= 75 ? 'Distinction (A+)' : 'In Progress',
      completedModules: Object.keys(completedModules),
      verifiedTelemetry: {
        vaultTemperature: telemetry.vaultTemperatureCelsius,
        relativeHumidity: telemetry.relativeHumidityPercent,
        naturalSoilIsolation: telemetry.naturalSoilIsolation,
        thermalDampingEfficiencyPct: telemetry.thermalDampingEfficiencyPct
      },
      paninianParameters: appliedParams,
      blockchainVerification: {
        consensusStandard: 'Proof-of-Authority (PoA)',
        participatingNodes: ['OUAT-Directorate-Research-Node-1', 'IGNOU-School-Agriculture-Node-2'],
        digitalDigest: '0x7f9a4b2c89e13d0a51c4e672f88921b0e3f890c2'
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OUAT_AgriCore_Transcript_${studentRollNo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-600/30 rounded-2xl p-5 lg:p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono-code">
                DISTANCE & RESEARCH PORTAL
              </span>
              <span className="text-xs text-slate-400 font-mono-code">ACCREDITED UNIVERSITY SIMULATION LAB</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
              IGNOU / OUAT AgriCore Simulation Academy
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 mt-1 max-w-3xl">
              Official practical curriculum for students of IGNOU and OUAT (Orissa University of Agriculture and Technology) to validate subterranean step-well thermodynamics, Paninian Sanskrit agronomic parsing, Apomixis continuous 2n genetics, and multi-subsystem resilience hierarchies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-right font-mono-code">
              <div className="text-[10px] text-slate-400">Curriculum Progress</div>
              <div className="text-sm font-bold text-amber-300">
                {completedCount} of {CURRICULUM_MODULES.length} Completed ({gradePercentage}%)
              </div>
            </div>

            <button
              onClick={handleDownloadTranscript}
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono-code bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Official Transcript
            </button>
          </div>
        </div>
      </div>

      {/* Student Credentials Input */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono-code text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Student Scholar:</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-amber-200 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Enrollment / Roll No:</span>
            <input
              type="text"
              value={studentRollNo}
              onChange={(e) => setStudentRollNo(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-cyan-200 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <FileBadge className="w-4 h-4 text-emerald-400" />
          <span>Accreditation: ICAR / IGNOU School of Agriculture</span>
        </div>
      </div>

      {/* Tab Selector: Resilience Hierarchy vs University Course Modules */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-mono-code text-xs">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'hierarchy'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Resilience Hierarchy & Subsystem Cascade Map</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'modules'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Practical Curriculum Modules & Lab Challenges ({completedCount}/{CURRICULUM_MODULES.length})</span>
        </button>
      </div>

      {/* SECTION 1: DYNAMIC RESILIENCE HIERARCHY */}
      {activeTab === 'hierarchy' && (
        <ResilienceHierarchyMap
          telemetry={telemetry}
          appliedParams={appliedParams}
          studentName={studentName}
          studentRollNo={studentRollNo}
        />
      )}

      {/* SECTION 2: UNIVERSITY COURSE MODULES & ASSIGNMENTS */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Module Navigation Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {CURRICULUM_MODULES.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              const isPassed = completedModules[mod.id];

              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500 text-amber-100 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-code uppercase mb-1">
                    <span className="text-amber-400 font-bold">{mod.institution}</span>
                    <span className={isPassed ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {isPassed ? '✓ PASSED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">{mod.title.split(':')[0]}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{mod.universityCode}</div>
                </button>
              );
            })}
          </div>

          {/* Selected Module Detail & Practical Assignment Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Syllabus & Objectives */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono-code text-amber-400 uppercase font-bold">
                    {currentModule.institution} Course Code: {currentModule.universityCode}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {currentModule.title}
                  </h3>
                </div>
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                {currentModule.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-2 font-mono-code flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Syllabus Competency Objectives
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentModule.learningObjectives.map((obj: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded border border-slate-800/80">
                      <span className="text-amber-400 font-bold font-mono-code">{idx + 1}.</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Live Practical Simulation Challenge */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 font-mono-code">
                  <Award className="w-4 h-4 text-cyan-400" />
                  Interactive Laboratory Challenge
                </h3>
                <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded border ${
                  isCurrentPassed 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {isCurrentPassed ? 'CRITERIA SATISFIED' : 'TARGET UNMET'}
                </span>
              </div>

              {/* Prompt */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-mono-code text-slate-400 block">Lab Mission:</span>
                <p className="text-xs text-white leading-relaxed">
                  {currentModule.challenge.prompt}
                </p>
              </div>

              {/* Hint */}
              <div className="bg-cyan-950/30 p-3 rounded-lg border border-cyan-800/40 text-xs text-cyan-200">
                <strong className="block text-[10px] uppercase font-mono-code text-cyan-400 mb-0.5">Formula / Guidance Hint:</strong>
                {currentModule.challenge.hint}
              </div>

              {/* Real-time Status Check */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between font-mono-code text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Current Live Telemetry State:</span>
                  <span className="text-white font-bold">
                    Vault Temp: {telemetry.vaultTemperatureCelsius}°C | Damping: {telemetry.thermalDampingEfficiencyPct}%
                  </span>
                </div>
                {isCurrentPassed ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitModuleAssignment}
                disabled={!isCurrentPassed || completedModules[currentModule.id]}
                className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono-code transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  completedModules[currentModule.id]
                    ? 'bg-emerald-800 text-emerald-100 cursor-default'
                    : isCurrentPassed
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {completedModules[currentModule.id]
                  ? 'ASSIGNMENT OFFICIALLY VALIDATED & RECORDED'
                  : isCurrentPassed
                  ? 'SUBMIT VERIFIED SIMULATION ASSIGNMENT'
                  : 'ADJUST SLIDERS IN SIMULATOR TO MEET CRITERIA'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
