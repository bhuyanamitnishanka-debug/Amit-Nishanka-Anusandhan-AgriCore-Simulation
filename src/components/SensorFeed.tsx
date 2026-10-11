import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FacilityTierId, MicroclimateState, MicroclimateOutput, SensorFeedReading } from '../types';
import { 
  Activity, 
  Droplets, 
  Gauge, 
  Wind, 
  Thermometer, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Radio, 
  Cpu, 
  Sliders, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Terminal,
  ShieldCheck
} from 'lucide-react';

interface Props {
  microclimate: MicroclimateState;
  telemetry: MicroclimateOutput;
  selectedTierId?: FacilityTierId;
}

type ViewMode = 'gauges' | 'trend_lines' | 'unified';
type MetricFilter = 'all' | 'humidity' | 'soil_moisture' | 'pressure' | 'vault_temp';

export const SensorFeed: React.FC<Props> = ({
  microclimate,
  telemetry,
  selectedTierId = 'tier3'
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('unified');
  const [selectedMetric, setSelectedMetric] = useState<MetricFilter>('all');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamCadenceMs, setStreamCadenceMs] = useState<number>(1000); // 1000ms default
  const [activeTier, setActiveTier] = useState<FacilityTierId>(selectedTierId);
  const [anomalyType, setAnomalyType] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<SensorFeedReading | null>(null);

  // Ingestion Event Stream Log
  const [eventLogs, setEventLogs] = useState<Array<{ id: string; time: string; msg: string; type: 'info' | 'warn' | 'success' }>>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString(),
      msg: 'Redis In-Memory Sensor Broker connected: [STREAM_CHANNEL: telemetry/live/active]',
      type: 'info'
    },
    {
      id: 'init-2',
      time: new Date().toLocaleTimeString(),
      msg: 'JSON Schema Validation Matrix active: 8 sensors streaming without packet loss',
      type: 'success'
    }
  ]);

  // Rolling buffer of the last 30 readings
  const [readingsHistory, setReadingsHistory] = useState<SensorFeedReading[]>(() => {
    const list: SensorFeedReading[] = [];
    const now = Date.now();
    const baseRH = telemetry.relativeHumidityPercent;
    const baseVWC = 28.5; // Nominal 28.5% Volumetric Water Content
    const baseAtmPress = 1013.25; // hPa
    const baseVaultPress = microclimate.nitrogenDewarPressureBar; // bar
    const baseVaultTemp = telemetry.vaultTemperatureCelsius;

    for (let i = 29; i >= 0; i--) {
      const timeOffset = (30 - i) * 1000;
      const jitter = (Math.sin(i * 0.4) * 0.3);
      list.push({
        timestamp: new Date(now - timeOffset).toLocaleTimeString(),
        timeSeconds: -i,
        relativeHumidityPercent: parseFloat((baseRH + jitter).toFixed(1)),
        soilMoistureVwcPercent: parseFloat((baseVWC + Math.cos(i * 0.3) * 0.4).toFixed(1)),
        atmosphericPressureHpa: parseFloat((baseAtmPress + Math.sin(i * 0.2) * 1.2).toFixed(1)),
        vaultPressureBar: parseFloat((baseVaultPress + Math.sin(i * 0.5) * 0.02).toFixed(2)),
        vaultTemperatureCelsius: parseFloat((baseVaultTemp + Math.sin(i * 0.3) * 0.08).toFixed(2)),
        soilBedrockTemperatureCelsius: parseFloat((14.2 + Math.cos(i * 0.2) * 0.1).toFixed(1)),
        oxygenConcentrationPercent: parseFloat((14.2 + Math.sin(i * 0.1) * 0.05).toFixed(1)),
        solarParRadiationUmols: microclimate.solarParRadiationUmols,
        tierId: selectedTierId
      });
    }
    return list;
  });

  // Current latest instantaneous reading
  const currentReading = readingsHistory[readingsHistory.length - 1] || {
    timestamp: new Date().toLocaleTimeString(),
    timeSeconds: 0,
    relativeHumidityPercent: telemetry.relativeHumidityPercent,
    soilMoistureVwcPercent: 28.5,
    atmosphericPressureHpa: 1013.25,
    vaultPressureBar: microclimate.nitrogenDewarPressureBar,
    vaultTemperatureCelsius: telemetry.vaultTemperatureCelsius,
    soilBedrockTemperatureCelsius: 14.2,
    oxygenConcentrationPercent: 14.2,
    solarParRadiationUmols: microclimate.solarParRadiationUmols,
    tierId: activeTier
  };

  // Real-time Ingestion Stream interval
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setReadingsHistory(prev => {
        const last = prev[prev.length - 1];
        const nextTimeSec = (last?.timeSeconds || 0) + 1;
        const now = new Date();

        // Baseline targets from current simulation state
        const targetRH = telemetry.relativeHumidityPercent;
        const targetVaultTemp = telemetry.vaultTemperatureCelsius;
        const targetVaultPress = microclimate.nitrogenDewarPressureBar;

        // Apply anomaly perturbations if triggered
        let targetSoilMoisture = 28.5;
        let targetAtmPress = 1013.25;
        let targetRHMod = targetRH;

        if (anomalyType === 'pressure_drop') {
          targetAtmPress = 992.4; // Storm front low pressure
        } else if (anomalyType === 'soil_saturation') {
          targetSoilMoisture = 42.8; // Flood/saturation
        } else if (anomalyType === 'soil_desiccation') {
          targetSoilMoisture = 14.2; // Arid dryout
        } else if (anomalyType === 'rh_surge') {
          targetRHMod = 96.5; // High humidity surge
        }

        // Mean-reversion random walk with micro jitter
        const rhJitter = (Math.random() - 0.48) * 0.4;
        const nextRH = parseFloat(
          (last.relativeHumidityPercent * 0.85 + targetRHMod * 0.15 + rhJitter).toFixed(1)
        );

        const vwcJitter = (Math.random() - 0.5) * 0.2;
        const nextVWC = parseFloat(
          (last.soilMoistureVwcPercent * 0.88 + targetSoilMoisture * 0.12 + vwcJitter).toFixed(1)
        );

        const pressJitter = (Math.random() - 0.5) * 0.4;
        const nextAtmPress = parseFloat(
          (last.atmosphericPressureHpa * 0.9 + targetAtmPress * 0.1 + pressJitter).toFixed(1)
        );

        const vPressJitter = (Math.random() - 0.5) * 0.01;
        const nextVaultPress = parseFloat(
          (last.vaultPressureBar * 0.95 + targetVaultPress * 0.05 + vPressJitter).toFixed(2)
        );

        const tempJitter = (Math.random() - 0.5) * 0.04;
        const nextVaultTemp = parseFloat(
          (last.vaultTemperatureCelsius * 0.92 + targetVaultTemp * 0.08 + tempJitter).toFixed(2)
        );

        const nextReading: SensorFeedReading = {
          timestamp: now.toLocaleTimeString(),
          timeSeconds: nextTimeSec,
          relativeHumidityPercent: nextRH,
          soilMoistureVwcPercent: nextVWC,
          atmosphericPressureHpa: nextAtmPress,
          vaultPressureBar: nextVaultPress,
          vaultTemperatureCelsius: nextVaultTemp,
          soilBedrockTemperatureCelsius: parseFloat((14.2 + Math.sin(nextTimeSec * 0.1) * 0.15).toFixed(1)),
          oxygenConcentrationPercent: parseFloat((14.15 + Math.cos(nextTimeSec * 0.2) * 0.08).toFixed(1)),
          solarParRadiationUmols: microclimate.solarParRadiationUmols,
          tierId: activeTier
        };

        // Keep rolling buffer of max 30 readings
        const nextList = [...prev.slice(1), nextReading];
        return nextList;
      });
    }, streamCadenceMs);

    return () => clearInterval(interval);
  }, [isStreaming, streamCadenceMs, telemetry, microclimate, anomalyType, activeTier]);

  // Inject Anomaly Handler
  const handleInjectAnomaly = (type: string) => {
    setAnomalyType(type);
    setEventLogs(prev => [
      {
        id: `ev-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        msg: `ANOMALY INJECTED: [${type.toUpperCase()}] -> Sensor stream perturbing across channels`,
        type: 'warn'
      },
      ...prev.slice(0, 8)
    ]);
  };

  const handleClearAnomaly = () => {
    setAnomalyType(null);
    setEventLogs(prev => [
      {
        id: `ev-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        msg: 'Nominal telemetry loop restored. Mean reversion locked to SMR-MHD setpoints.',
        type: 'success'
      },
      ...prev.slice(0, 8)
    ]);
  };

  // Export Sensor Telemetry as CSV
  const handleDownloadCsv = () => {
    const headers = [
      'Timestamp',
      'TimeSeconds',
      'RelativeHumidity_Pct',
      'SoilMoisture_VWC_Pct',
      'AtmosphericPressure_hPa',
      'VaultPressure_bar',
      'VaultTemperature_C',
      'SoilBedrockTemp_C',
      'OxygenConcentration_Pct',
      'TierID'
    ];

    const rows = readingsHistory.map(r => [
      r.timestamp,
      r.timeSeconds,
      r.relativeHumidityPercent,
      r.soilMoistureVwcPercent,
      r.atmosphericPressureHpa,
      r.vaultPressureBar,
      r.vaultTemperatureCelsius,
      r.soilBedrockTemperatureCelsius,
      r.oxygenConcentrationPercent,
      r.tierId
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgriCore_Sensor_Feed_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // SVG Radial Gauge Arc Helper
  const renderRadialGauge = (
    value: number,
    min: number,
    max: number,
    unit: string,
    label: string,
    sanskritLabel: string,
    colorClass: string,
    strokeColor: string,
    safeMin: number,
    safeMax: number
  ) => {
    const radius = 64;
    const cx = 85;
    const cy = 85;
    const startAngle = -140;
    const endAngle = 140;
    const totalAngle = endAngle - startAngle;

    const clampedVal = Math.min(max, Math.max(min, value));
    const fraction = (clampedVal - min) / (max - min);
    const currentAngle = startAngle + fraction * totalAngle;

    // Convert polar coordinates to Cartesian
    const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + r * Math.cos(angleInRadians),
        y: centerY + r * Math.sin(angleInRadians)
      };
    };

    const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
      const start = polarToCartesian(x, y, r, endA);
      const end = polarToCartesian(x, y, r, startA);
      const largeArcFlag = endA - startA <= 180 ? '0' : '1';
      return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
    };

    const bgArc = describeArc(cx, cy, radius, startAngle, endAngle);
    const valArc = describeArc(cx, cy, radius, startAngle, Math.max(startAngle + 1, currentAngle));

    // Needle coordinates
    const needleEnd = polarToCartesian(cx, cy, radius - 12, currentAngle);

    const isSafe = value >= safeMin && value <= safeMax;

    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col items-center relative overflow-hidden group hover:border-slate-700 transition-all">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between text-xs font-mono-code mb-1">
          <span className="text-slate-400 font-bold uppercase text-[11px] truncate max-w-[120px]">{label}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
            isSafe
              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
              : 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse'
          }`}>
            {isSafe ? 'OPTIMAL' : 'DEVIATION'}
          </span>
        </div>
        <div className="text-[10px] text-amber-300/80 font-sanskrit self-start mb-2">
          {sanskritLabel}
        </div>

        {/* Gauge SVG */}
        <div className="relative w-44 h-36 flex items-center justify-center">
          <svg viewBox="0 0 170 150" className="w-full h-full select-none">
            {/* Background Arc */}
            <path
              d={bgArc}
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Active Value Arc */}
            <path
              d={valArc}
              fill="none"
              stroke={strokeColor}
              strokeWidth="10"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Needle Pivot Center */}
            <circle cx={cx} cy={cy} r="6" fill="#0f172a" stroke={strokeColor} strokeWidth="2.5" />

            {/* Needle Line */}
            <line
              x1={cx}
              y1={cy}
              x2={needleEnd.x}
              y2={needleEnd.y}
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Digital Readout Center */}
          <div className="absolute bottom-2 text-center">
            <span className={`text-xl font-bold font-mono-code ${colorClass}`}>
              {value}
            </span>
            <span className="text-[10px] font-mono-code text-slate-400 ml-1">
              {unit}
            </span>
          </div>
        </div>

        {/* Scale Min / Max / Safe Range */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono-code text-slate-500 pt-2 border-t border-slate-800/80 mt-1">
          <span>{min}{unit}</span>
          <span className="text-slate-400">Safe: {safeMin}-{safeMax}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    );
  };

  // Sparkline SVG Trend Graph Helper
  const renderTrendChart = (
    data: number[],
    minVal: number,
    maxVal: number,
    unit: string,
    title: string,
    colorStroke: string,
    colorFill: string,
    safeLow: number,
    safeHigh: number
  ) => {
    const chartW = 540;
    const chartH = 160;
    const padL = 40;
    const padR = 20;
    const padT = 15;
    const padB = 25;

    const innerW = chartW - padL - padR;
    const innerH = chartH - padT - padB;

    const getX = (idx: number) => padL + (idx / (data.length - 1)) * innerW;
    const getY = (val: number) => padT + innerH - ((val - minVal) / (maxVal - minVal)) * innerH;

    const points = data.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' ');
    const firstX = getX(0).toFixed(1);
    const lastX = getX(data.length - 1).toFixed(1);
    const bottomY = (padT + innerH).toFixed(1);
    const areaPath = `M ${firstX},${bottomY} L ${points.split(' ').join(' L ')} L ${lastX},${bottomY} Z`;

    const latestVal = data[data.length - 1];
    const prevVal = data[data.length - 2] || latestVal;
    const delta = latestVal - prevVal;

    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between font-mono-code text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{title}</span>
            <span className="text-slate-500 text-[10px]">(Last 30 updates)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Instantaneous:</span>
            <span className="text-base font-bold text-white font-mono-code">{latestVal} {unit}</span>
            <span className={`text-[10px] flex items-center ${delta >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {delta >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-40 select-none">
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorFill} stopOpacity="0.3" />
                <stop offset="100%" stopColor={colorFill} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[minVal, minVal + (maxVal - minVal) * 0.5, maxVal].map((val, idx) => {
              const y = getY(val);
              return (
                <g key={idx}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={chartW - padR}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={padL - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-slate-500 font-mono-code"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Safe Target Range Zone */}
            <rect
              x={padL}
              y={getY(safeHigh)}
              width={innerW}
              height={Math.max(2, getY(safeLow) - getY(safeHigh))}
              fill="#10b981"
              fillOpacity="0.06"
              stroke="#059669"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />

            {/* Filled Area */}
            <path d={areaPath} fill={`url(#grad-${title})`} />

            {/* Trend Line */}
            <polyline
              fill="none"
              stroke={colorStroke}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Latest Point Indicator */}
            <circle
              cx={getX(data.length - 1)}
              cy={getY(latestVal)}
              r="4.5"
              fill={colorStroke}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="animate-pulse"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-500">
          <span>T-30s</span>
          <span>Target Safe Window: [{safeLow} to {safeHigh} {unit}]</span>
          <span>T-0s (Current)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 lg:p-6 backdrop-blur-xl space-y-6 shadow-2xl">
      {/* Top Banner & Telemetry Broker Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono-code flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              LIVE SENSOR INGESTION BROKER
            </span>
            <span className="text-xs text-slate-400 font-mono-code">
              REDIS STREAMING PIPELINE • ZERO-LATENCY CACHE
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold font-display text-white mt-1 flex items-center gap-2">
            प्रत्यक्ष संवेदक प्रवाह (Real-Time Sensor Telemetry Feed)
          </h2>
          <p className="text-xs lg:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Streams continuous high-frequency metrics—relative humidity, soil moisture (VWC), atmospheric pressure, and cryo-containment barrier variables—direct from subterranean Baoli sensor probes.
          </p>
        </div>

        {/* Stream Engine Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Stream Pause / Play */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-code border flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isStreaming
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}</span>
          </button>

          {/* Rate Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono-code">
            <span className="text-slate-500 px-1.5">Rate:</span>
            {[
              { label: '500ms', val: 500 },
              { label: '1.0s', val: 1000 },
              { label: '2.5s', val: 2500 }
            ].map(r => (
              <button
                key={r.val}
                onClick={() => setStreamCadenceMs(r.val)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  streamCadenceMs === r.val
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Download CSV */}
          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 rounded-xl text-xs font-mono-code bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Filter & Mode Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono-code text-xs">
        {/* Tier Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px]">Sensor Location:</span>
          {[
            { id: 'dome', label: 'Dome (0m)' },
            { id: 'tier1', label: 'Tier 1 Phytotron (3m)' },
            { id: 'tier2', label: 'Tier 2 Pod (6m)' },
            { id: 'tier3', label: 'Tier 3 Cryo Vault (-8m)' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTier(t.id as FacilityTierId)}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                activeTier === t.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('unified')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'unified'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unified Grid
          </button>
          <button
            onClick={() => setViewMode('gauges')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'gauges'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Gauges
          </button>
          <button
            onClick={() => setViewMode('trend_lines')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'trend_lines'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rolling Trend Lines
          </button>
        </div>
      </div>

      {/* VIEW: LIVE GAUGES (Or Unified Grid Top Half) */}
      {(viewMode === 'gauges' || viewMode === 'unified') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
            <span className="uppercase text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              Real-Time Reactive Dial Gauges
            </span>
            <span className="text-slate-500 text-[10px]">Sampling: {streamCadenceMs}ms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Relative Humidity Gauge */}
            {renderRadialGauge(
              currentReading.relativeHumidityPercent,
              0,
              100,
              '%',
              'Relative Humidity',
              'आपेक्षिक आर्द्रता (Āpekṣika Ārdratā)',
              'text-emerald-400',
              '#10b981',
              35,
              95
            )}

            {/* 2. Soil Moisture VWC Gauge */}
            {renderRadialGauge(
              currentReading.soilMoistureVwcPercent,
              0,
              50,
              '% VWC',
              'Soil Moisture (VWC)',
              'मृदा-आर्द्रता (Mṛdā-Ārdratā)',
              'text-cyan-400',
              '#06b6d4',
              20,
              35
            )}

            {/* 3. Atmospheric Pressure Gauge */}
            {renderRadialGauge(
              currentReading.atmosphericPressureHpa,
              970,
              1040,
              'hPa',
              'Atmospheric Pressure',
              'वायुमण्डलीय-दाब (Vāyumaṇḍalīya-Dāba)',
              'text-purple-400',
              '#a855f7',
              1005,
              1025
            )}

            {/* 4. Vault Argon Dewar Pressure Gauge */}
            {renderRadialGauge(
              currentReading.vaultPressureBar,
              0.5,
              3.5,
              'bar',
              'Vault Overpressure',
              'कोश-अतिदाब (Kośa-Atidāba)',
              'text-amber-400',
              '#f59e0b',
              1.5,
              2.4
            )}
          </div>
        </div>
      )}

      {/* VIEW: ROLLING TREND LINES (Or Unified Grid Bottom Half) */}
      {(viewMode === 'trend_lines' || viewMode === 'unified') && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code text-slate-400">
            <span className="uppercase text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Live-Updating Rolling Trend Streams
            </span>

            {/* Metric Filter Tabs for trend view */}
            {viewMode === 'trend_lines' && (
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['all', 'humidity', 'soil_moisture', 'pressure', 'vault_temp'] as MetricFilter[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedMetric(f)}
                    className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer ${
                      selectedMetric === f
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. Relative Humidity Trend Line */}
            {(selectedMetric === 'all' || selectedMetric === 'humidity') && (
              renderTrendChart(
                readingsHistory.map(r => r.relativeHumidityPercent),
                30,
                100,
                '%',
                'Relative Humidity Stream (% RH)',
                '#10b981',
                '#10b981',
                35,
                95
              )
            )}

            {/* 2. Soil Moisture VWC Trend Line */}
            {(selectedMetric === 'all' || selectedMetric === 'soil_moisture') && (
              renderTrendChart(
                readingsHistory.map(r => r.soilMoistureVwcPercent),
                10,
                50,
                '% VWC',
                'Soil Moisture Volumetric Content (VWC %)',
                '#06b6d4',
                '#06b6d4',
                20,
                35
              )
            )}

            {/* 3. Atmospheric Pressure Trend Line */}
            {(selectedMetric === 'all' || selectedMetric === 'pressure') && (
              renderTrendChart(
                readingsHistory.map(r => r.atmosphericPressureHpa),
                980,
                1035,
                'hPa',
                'Atmospheric Barometric Pressure (hPa)',
                '#a855f7',
                '#a855f7',
                1005,
                1025
              )
            )}

            {/* 4. Vault Core Temperature Trend Line */}
            {(selectedMetric === 'all' || selectedMetric === 'vault_temp') && (
              renderTrendChart(
                readingsHistory.map(r => r.vaultTemperatureCelsius),
                -25,
                -10,
                '°C',
                'Vault Cryo-Core Temperature (°C)',
                '#38bdf8',
                '#38bdf8',
                -20,
                -15
              )
            )}
          </div>
        </div>
      )}

      {/* Interactive Fault / Perturbation Injector Panel */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono-code text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white font-bold text-xs uppercase tracking-wider">
              Diagnostic Fault Injection Benchmark
            </span>
          </div>
          {anomalyType && (
            <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-800 font-bold animate-pulse">
              ANOMALY ACTIVE: {anomalyType.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleInjectAnomaly('pressure_drop')}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              anomalyType === 'pressure_drop'
                ? 'bg-purple-950 text-purple-200 border-purple-500 shadow'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-purple-400" />
            <span>Drop Barometric Pressure (-21 hPa Storm Front)</span>
          </button>

          <button
            onClick={() => handleInjectAnomaly('soil_saturation')}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              anomalyType === 'soil_saturation'
                ? 'bg-blue-950 text-blue-200 border-blue-500 shadow'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Surge Soil Moisture (42.8% VWC Monsoon Flood)</span>
          </button>

          <button
            onClick={() => handleInjectAnomaly('soil_desiccation')}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              anomalyType === 'soil_desiccation'
                ? 'bg-amber-950 text-amber-200 border-amber-500 shadow'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Soil Desiccation (14.2% VWC Drought)</span>
          </button>

          <button
            onClick={handleClearAnomaly}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Nominal State</span>
          </button>
        </div>
      </div>

      {/* Live Ingestion Log Terminal Drawer */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono-code text-[11px] space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-bold uppercase text-[10px]">
              Ingestion Event Stream Ledger
            </span>
          </div>
          <span className="text-slate-500 text-[10px]">Protocol: TCP / Fast In-Memory Buffer</span>
        </div>

        <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
          {eventLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-slate-300">
              <span className="text-slate-500 text-[10px] shrink-0">[{log.time}]</span>
              <span className={`text-[10px] px-1 rounded shrink-0 ${
                log.type === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                log.type === 'warn' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-slate-800 text-slate-400'
              }`}>
                {log.type.toUpperCase()}
              </span>
              <span className="truncate">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
