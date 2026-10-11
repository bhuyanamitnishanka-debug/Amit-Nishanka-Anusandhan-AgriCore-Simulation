import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MicroclimateState, MicroclimateOutput } from '../types';
import { 
  Zap, 
  Activity, 
  Flame, 
  Thermometer, 
  Gauge, 
  Radio, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  RotateCw,
  Waves,
  Sparkles,
  Sliders,
  AlertTriangle,
  Play,
  Pause,
  Download,
  CheckCircle2,
  BellRing,
  HelpCircle
} from 'lucide-react';

interface Props {
  microclimate: MicroclimateState;
  telemetry: MicroclimateOutput;
}

type MetricView = 'dual' | 'efficiency' | 'coolant_transfer';
type SmrRegime = 'CRYO_LOCK' | 'BASELOAD_ECO' | 'THERMAL_QUENCH';

interface TelemetryPoint {
  time: number;
  thermalEfficiencyPct: number;
  coolantTransferRateKwM3: number;
  electricalOutputKw: number;
  coolantFlowM3Hr: number;
  isAnomaly?: boolean;
}

interface ClimateAlert {
  alertId: string;
  timestamp: string;
  anomalyType: string;
  observedValue: number;
  thresholdLimit: number;
  severityLevel: 'WARNING' | 'CRITICAL' | 'CATASTROPHIC';
  mitigationAction: string;
  isResolved: boolean;
}

export const SmrPowerGridDashboard: React.FC<Props> = ({
  microclimate,
  telemetry
}) => {
  const [metricView, setMetricView] = useState<MetricView>('dual');
  const [regime, setRegime] = useState<SmrRegime>('CRYO_LOCK');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null);

  // Dynamic user-controllable coolant displacement flow
  const [coolantFlowM3Hr, setCoolantFlowM3Hr] = useState<number>(24.8);

  // Active anomaly simulation state
  const [activeAnomaly, setActiveAnomaly] = useState<ClimateAlert | null>(null);
  const [alertHistory, setAlertHistory] = useState<ClimateAlert[]>([]);
  const [isQuenching, setIsQuenching] = useState<boolean>(false);

  // Time buffer history (20 points for smooth trend line)
  const [history, setHistory] = useState<TelemetryPoint[]>(() => {
    const points: TelemetryPoint[] = [];
    const baseEff = 85.0 + (microclimate.smrCoolingRate * 0.4);
    const baseTransfer = 50.0 + (microclimate.smrCoolingRate * 2.8);

    for (let i = 19; i >= 0; i--) {
      points.push({
        time: -i * 2,
        thermalEfficiencyPct: parseFloat((baseEff + Math.sin(i * 0.6) * 1.5).toFixed(1)),
        coolantTransferRateKwM3: parseFloat((baseTransfer + Math.cos(i * 0.5) * 2.5).toFixed(1)),
        electricalOutputKw: Math.round(4200 + (microclimate.smrCoolingRate * 18) + (Math.sin(i) * 35)),
        coolantFlowM3Hr: 24.8
      });
    }
    return points;
  });

  // Dynamic real-time update loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setHistory(prev => {
        const lastTime = prev[prev.length - 1]?.time || 0;
        
        let targetEff = 85.0 + (microclimate.smrCoolingRate * 0.42);
        let targetTransfer = 50.0 + (coolantFlowM3Hr * 1.85) + (microclimate.smrCoolingRate * 1.5);

        if (regime === 'CRYO_LOCK') {
          targetEff += 3.2;
          targetTransfer += 6.5;
        } else if (regime === 'THERMAL_QUENCH') {
          targetEff += 5.5;
          targetTransfer += 14.0;
        }

        // If anomaly is currently active, simulate sharp thermal spike & efficiency drop
        if (activeAnomaly && !activeAnomaly.isResolved) {
          targetEff -= 18.5; // efficiency drops
          targetTransfer += 35.0; // heat flux to coolant surges violently
        }

        // Fluctuation jitter
        const jitterEff = (Math.random() * 0.8 - 0.4);
        const jitterTrans = (Math.random() * 1.4 - 0.7);

        const currentEff = Math.min(99.0, Math.max(55.0, targetEff + jitterEff));
        const currentTransfer = Math.min(130.0, Math.max(30.0, targetTransfer + jitterTrans));
        const currentKw = Math.round(4200 + (microclimate.smrCoolingRate * 18) + (Math.random() * 30 - 15));

        const newPoint: TelemetryPoint = {
          time: lastTime + 2,
          thermalEfficiencyPct: parseFloat(currentEff.toFixed(1)),
          coolantTransferRateKwM3: parseFloat(currentTransfer.toFixed(1)),
          electricalOutputKw: currentKw,
          coolantFlowM3Hr,
          isAnomaly: !!(activeAnomaly && !activeAnomaly.isResolved)
        };

        return [...prev.slice(1), newPoint];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [microclimate.smrCoolingRate, coolantFlowM3Hr, regime, activeAnomaly, isPaused]);

  // Handle Injecting Thermal Spike Anomaly
  const handleInjectThermalSpike = () => {
    const alertId = `ALT-${Date.now().toString(36).toUpperCase()}`;
    const newAlert: ClimateAlert = {
      alertId,
      timestamp: new Date().toISOString(),
      anomalyType: 'THERMAL_SPIKE',
      observedValue: -2.4, // Surges past -10.0°C safety limit
      thresholdLimit: -10.0,
      severityLevel: 'CRITICAL',
      mitigationAction: 'ACTIVATE_EMERGENCY_RECOVERY_COILS',
      isResolved: false
    };

    setActiveAnomaly(newAlert);
    setAlertHistory(prev => [newAlert, ...prev]);
  };

  // Handle Emergency Recovery Quench Coils
  const handleTriggerRecoveryQuench = () => {
    setIsQuenching(true);
    setRegime('THERMAL_QUENCH');
    setCoolantFlowM3Hr(35.2);

    setTimeout(() => {
      if (activeAnomaly) {
        const resolvedAlert = { ...activeAnomaly, isResolved: true };
        setActiveAnomaly(null);
        setAlertHistory(prev => prev.map(a => a.alertId === resolvedAlert.alertId ? resolvedAlert : a));
      }
      setIsQuenching(false);
      setRegime('CRYO_LOCK');
      setCoolantFlowM3Hr(26.5);
    }, 3000);
  };

  // Derived current metrics
  const latest = history[history.length - 1] || {
    thermalEfficiencyPct: 88.4,
    coolantTransferRateKwM3: 78.5,
    electricalOutputKw: 4200,
    coolantFlowM3Hr: 24.8
  };

  // SVG Chart bounds
  const svgWidth = 640;
  const svgHeight = 200;
  const paddingX = 45;
  const paddingY = 25;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  // Scale ranges
  const effMin = 50;
  const effMax = 100;
  const transMin = 30;
  const transMax = 130;

  const pointsEff = useMemo(() => {
    return history.map((p, i) => {
      const x = paddingX + (i / (history.length - 1)) * plotWidth;
      const y = paddingY + plotHeight - ((p.thermalEfficiencyPct - effMin) / (effMax - effMin)) * plotHeight;
      return { x, y, ...p };
    });
  }, [history, plotWidth, plotHeight]);

  const pointsTrans = useMemo(() => {
    return history.map((p, i) => {
      const x = paddingX + (i / (history.length - 1)) * plotWidth;
      const y = paddingY + plotHeight - ((p.coolantTransferRateKwM3 - transMin) / (transMax - transMin)) * plotHeight;
      return { x, y, ...p };
    });
  }, [history, plotWidth, plotHeight]);

  // Generate SVG path smooth curve (cubic bezier)
  const makeSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
    }, '');
  };

  const pathEff = makeSmoothPath(pointsEff);
  const pathTrans = makeSmoothPath(pointsTrans);

  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-xl p-5 space-y-5 holo-scanlines shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono-code bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              SMR-MHD CLOSED-LOOP POWER GRID
            </span>
            <span className="text-[11px] text-slate-400 font-mono-code">
              15.4 MWt CORE • 4,200 kWe DIRECT INDUCTION
            </span>
          </div>
          <h3 className="text-base lg:text-lg font-bold font-display text-white mt-1 flex items-center gap-2">
            भूगर्भ-ऊर्जा-केन्द्र • SMR Thermal Efficiency & Coolant Transfer Dynamics
          </h3>
        </div>

        {/* Action Controls & Regime Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pause / Play Live Stream */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
              isPaused 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={isPaused ? "Resume Live Stream" : "Pause Live Stream"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-mono-code">{isPaused ? 'PAUSED' : 'LIVE'}</span>
          </button>

          {/* Metric View Mode */}
          <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-lg flex text-xs font-mono-code">
            <button
              onClick={() => setMetricView('dual')}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                metricView === 'dual' ? 'bg-cyan-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dual Matrix
            </button>
            <button
              onClick={() => setMetricView('efficiency')}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                metricView === 'efficiency' ? 'bg-cyan-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Thermal Eff %
            </button>
            <button
              onClick={() => setMetricView('coolant_transfer')}
              className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                metricView === 'coolant_transfer' ? 'bg-amber-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Coolant Flux
            </button>
          </div>

          {/* Operational Regime Selector */}
          <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-lg flex text-[10px] font-mono-code">
            {(['CRYO_LOCK', 'BASELOAD_ECO', 'THERMAL_QUENCH'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRegime(r)}
                className={`px-2.5 py-1 rounded transition-all ${
                  regime === r
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Anomaly Simulation Alert Banner (if spike active) */}
      {activeAnomaly && !activeAnomaly.isResolved && (
        <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-xs font-mono-code flex flex-wrap items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <div className="font-bold text-red-200">
                CRITICAL ANOMALY DETECTED: {activeAnomaly.anomalyType} (Observed: {activeAnomaly.observedValue}°C, Limit: {activeAnomaly.thresholdLimit}°C)
              </div>
              <div className="text-[10px] text-red-300">
                SMR absorption loop containment drop simulated. Rapid heat flux surging to coolant channels.
              </div>
            </div>
          </div>

          <button
            onClick={handleTriggerRecoveryQuench}
            disabled={isQuenching}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {isQuenching ? 'Quenching Coils Active...' : 'ACTIVATE EMERGENCY RECOVERY COILS'}
          </button>
        </div>
      )}

      {/* Main Interactive Reactive SVG Graph Container */}
      <div className="bg-slate-950 rounded-xl border border-slate-800/80 p-4 relative overflow-hidden">
        {/* Graph Legend & Instantaneous Gauges */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code mb-3">
          <div className="flex items-center gap-5">
            {(metricView === 'dual' || metricView === 'efficiency') && (
              <div className="flex items-center gap-2 text-cyan-300">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 inline-block"></span>
                <span>
                  Thermal Efficiency: <strong className="text-sm font-bold">{latest.thermalEfficiencyPct}%</strong>
                </span>
                <span className="text-[10px] text-slate-500">Carnot Index</span>
              </div>
            )}
            {(metricView === 'dual' || metricView === 'coolant_transfer') && (
              <div className="flex items-center gap-2 text-amber-300">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400 inline-block"></span>
                <span>
                  Energy-to-Coolant Transfer: <strong className="text-sm font-bold">{latest.coolantTransferRateKwM3} kW/m³</strong>
                </span>
                <span className="text-[10px] text-slate-500">LBE Core Dissipation</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
              <Waves className="w-3.5 h-3.5 text-blue-400" />
              <span>Coolant Flow: <strong className="text-blue-300">{coolantFlowM3Hr} m³/hr</strong></span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`}></span>
              <span>{isPaused ? 'Stream Suspended' : 'Live Cadence: 1.8s'}</span>
            </div>
          </div>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="w-full aspect-[640/200] relative">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full select-none">
            <defs>
              <linearGradient id="effGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="transGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>

              <filter id="neonCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#06b6d4" floodOpacity="0.8" />
              </filter>
              <filter id="neonAmberGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#f59e0b" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = paddingY + pct * plotHeight;
              const effVal = (effMax - pct * (effMax - effMin)).toFixed(0);
              const transVal = (transMax - pct * (transMax - transMin)).toFixed(0);
              return (
                <g key={`grid-${i}`} opacity="0.3">
                  <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#334155" strokeDasharray="3 3" />
                  <text x={paddingX - 8} y={y + 3} textAnchor="end" fill="#06b6d4" fontSize="9" fontFamily="JetBrains Mono">
                    {effVal}%
                  </text>
                  <text x={svgWidth - paddingX + 8} y={y + 3} textAnchor="start" fill="#f59e0b" fontSize="9" fontFamily="JetBrains Mono">
                    {transVal}
                  </text>
                </g>
              );
            })}

            {/* Vertical Time Division Lines */}
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((pct, i) => {
              const x = paddingX + pct * plotWidth;
              return (
                <line key={`vgrid-${i}`} x1={x} y1={paddingY} x2={x} y2={svgHeight - paddingY} stroke="#1e293b" opacity="0.4" />
              );
            })}

            {/* Thermal Efficiency Path & Underfill Area */}
            {(metricView === 'dual' || metricView === 'efficiency') && (
              <>
                <path
                  d={`${pathEff} L ${svgWidth - paddingX},${svgHeight - paddingY} L ${paddingX},${svgHeight - paddingY} Z`}
                  fill="url(#effGradient)"
                />
                <path
                  d={pathEff}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  filter="url(#neonCyanGlow)"
                  className="transition-all duration-300"
                />
                {pointsEff.map((pt, i) => (
                  <circle
                    key={`eff-dot-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.time === pt.time ? "5.5" : "3"}
                    fill={pt.isAnomaly ? "#ef4444" : "#06b6d4"}
                    stroke="#082f49"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </>
            )}

            {/* Coolant Transfer Rate Path & Underfill Area */}
            {(metricView === 'dual' || metricView === 'coolant_transfer') && (
              <>
                <path
                  d={`${pathTrans} L ${svgWidth - paddingX},${svgHeight - paddingY} L ${paddingX},${svgHeight - paddingY} Z`}
                  fill="url(#transGradient)"
                />
                <path
                  d={pathTrans}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  filter="url(#neonAmberGlow)"
                  className="transition-all duration-300"
                />
                {pointsTrans.map((pt, i) => (
                  <circle
                    key={`trans-dot-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.time === pt.time ? "5.5" : "3"}
                    fill={pt.isAnomaly ? "#ef4444" : "#f59e0b"}
                    stroke="#451a03"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </>
            )}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-20 pointer-events-none bg-slate-900/95 border border-slate-700 rounded-lg p-2.5 text-[10px] font-mono-code text-slate-200 shadow-2xl backdrop-blur-md"
              style={{
                left: `${Math.min(75, Math.max(10, ((hoveredPoint.time - history[0].time) / (history[history.length - 1].time - history[0].time)) * 80 + 10))}%`,
                top: '15%'
              }}
            >
              <div className="text-slate-400 border-b border-slate-800 pb-1 mb-1 flex items-center justify-between gap-2">
                <span>Time: T+{hoveredPoint.time}s</span>
                {hoveredPoint.isAnomaly && <span className="text-red-400 font-bold">ANOMALY POINT</span>}
              </div>
              <div className="text-cyan-300">
                Thermal Efficiency: <strong>{hoveredPoint.thermalEfficiencyPct}%</strong>
              </div>
              <div className="text-amber-300">
                Coolant Transfer: <strong>{hoveredPoint.coolantTransferRateKwM3} kW/m³</strong>
              </div>
              <div className="text-blue-300">
                Electrical Output: <strong>{hoveredPoint.electricalOutputKw} kWe</strong>
              </div>
              <div className="text-slate-400">
                Coolant Flow Flux: <strong>{hoveredPoint.coolantFlowM3Hr} m³/hr</strong>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Time Axis Labels */}
        <div className="flex justify-between text-[9px] font-mono-code text-slate-500 mt-1 px-8">
          <span>-38s History</span>
          <span>-28s</span>
          <span>-18s</span>
          <span>-8s</span>
          <span className="text-cyan-400 font-bold">T-0s Live Telemetry</span>
        </div>
      </div>

      {/* Interactive Controls & Anomaly Injection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs font-mono-code">
        
        {/* Coolant Displacement Slider */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              LBE Coolant Mass Flow Rate:
            </span>
            <span className="text-cyan-300 font-bold">{coolantFlowM3Hr} m³/hr</span>
          </div>
          <input
            type="range"
            min="15.0"
            max="40.0"
            step="0.5"
            value={coolantFlowM3Hr}
            onChange={(e) => setCoolantFlowM3Hr(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>15 m³/hr (Laminar)</span>
            <span>25 m³/hr (Optimal)</span>
            <span>40 m³/hr (High Flux)</span>
          </div>
        </div>

        {/* Anomaly Test Injection & Quench Trigger */}
        <div className="md:col-span-7 flex flex-wrap items-center justify-end gap-2.5">
          <button
            onClick={handleInjectThermalSpike}
            disabled={!!(activeAnomaly && !activeAnomaly.isResolved)}
            className="px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Inject simulated thermal anomaly to test automated SQL alert logging and recovery coils"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Inject Thermal Spike (-2.4°C Surge)
          </button>

          <button
            onClick={handleTriggerRecoveryQuench}
            disabled={isQuenching}
            className="px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {isQuenching ? 'Quenching Recovery Coils...' : 'Engage Quench Recovery (-18°C Lock)'}
          </button>
        </div>
      </div>

      {/* SMR Closed-Loop Power Grid Telemetry Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono-code">
        
        {/* Thermal Output */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            Thermal Output
          </span>
          <div className="text-lg font-bold text-amber-300">15.4 MWt</div>
          <div className="text-[10px] text-slate-500">Lead-Bismuth Eutectic Core</div>
        </div>

        {/* Electrical Conversion */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            Electrical Output
          </span>
          <div className="text-lg font-bold text-cyan-300">
            {latest.electricalOutputKw.toLocaleString()} kWe
          </div>
          <div className="text-[10px] text-slate-500">MHD Liquid-Metal Direct Power</div>
        </div>

        {/* Coolant Loop Flux */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
            <Waves className="w-3 h-3 text-blue-400" />
            Coolant Mass Flux
          </span>
          <div className="text-lg font-bold text-blue-300">
            {coolantFlowM3Hr.toFixed(1)} m³/hr
          </div>
          <div className="text-[10px] text-slate-500">Zero-Vibration EM Induction</div>
        </div>

        {/* Absorption Chiller COP */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Absorption Chiller COP
          </span>
          <div className="text-lg font-bold text-emerald-300">
            {(0.78 + (latest.thermalEfficiencyPct - 75) * 0.004).toFixed(2)} COP
          </div>
          <div className="text-[10px] text-slate-500">NH₃-H₂O Closed Refrigeration</div>
        </div>

      </div>

      {/* Thermodynamics Blueprint Summary Bar */}
      <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs font-mono-code text-slate-300 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Thermodynamic Equilibrium:</strong> Core ΔT = 110°C (Inlet 285°C → Outlet 395°C). Geothermal heat dissipation rate: <span className="text-cyan-300">{microclimate.smrCoolingRate} °C/hr active extraction</span>.
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          50-Year Off-Grid Core Endurance: 100% SECURE
        </span>
      </div>

      {/* SQL Climate Alerts Ledger Log (if any alerts triggered) */}
      {alertHistory.length > 0 && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-code">
            <span className="font-bold text-amber-300 flex items-center gap-1.5 uppercase">
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              Climate Failure Mitigation Ledger (`climate_failure_alerts`)
            </span>
            <span className="text-[10px] text-slate-500">{alertHistory.length} Event(s) Recorded</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {alertHistory.map((alt) => (
              <div
                key={alt.alertId}
                className={`p-2 rounded border text-[11px] font-mono-code flex flex-wrap items-center justify-between gap-2 ${
                  alt.isResolved
                    ? 'bg-slate-950/80 border-slate-800 text-slate-400'
                    : 'bg-red-950/40 border-red-500/40 text-red-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{alt.alertId}</span>
                  <span className="text-slate-400">|</span>
                  <span>{alt.anomalyType}</span>
                  <span className="text-slate-500">({alt.observedValue}°C vs {alt.thresholdLimit}°C limit)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300">{alt.mitigationAction}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    alt.isResolved ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                  }`}>
                    {alt.isResolved ? 'RESOLVED' : 'ACTIVE_INTERRUPT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
