import React from "react";
import { Cpu, Brain, GitCommit, Settings, CheckCircle2, Calendar, Hourglass, Activity } from "lucide-react";

export default function ModelPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="font-mono text-[11.5px] tracking-[.16em] text-teal-500 uppercase mb-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_10px_#0891b2] animate-pulse"></span>
          Predictive Core
        </div>
        <h1 className="font-display font-semibold text-[27px] tracking-[-0.01em] text-text-hi uppercase">
          MODEL INTELLIGENCE
        </h1>
        <p className="text-text-mid text-[14px]">
          Hybrid climate-to-local prediction framework
        </p>
      </div>

      {/* Pipeline Visual Diagram */}
      <div className="glass-panel p-6">
        <h2 className="font-display font-semibold text-[16px] mb-6">Model Architecture Pipeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch relative">
          <ArchitectureNode step="1" title="ENSO + IOD + MJO" type="Inputs" active />
          <ArchitectureNode step="2" title="Climate Signals" type="Global Layer" />
          <ArchitectureNode step="3" title="ERA5 + IMD Data" type="Weather Layer" />
          <ArchitectureNode step="4" title="Weather Features" type="Feature Store" />
          <ArchitectureNode step="5" title="Local ML Model" type="XGBoost Core" active />
          <ArchitectureNode step="6" title="Probability Engine" type="Decision Layer" active />
        </div>
      </div>

      {/* Main Grid: Metrics, Feature Importance & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch">
        
        {/* Left Section: Prediction Outputs & Feature Contribution */}
        <div className="flex flex-col gap-6">
          {/* Prediction Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProbCard title="Monsoon Onset" val="78%" horizon="7-day outlook" color="var(--color-violet-500)" />
            <ProbCard title="Break Spell" val="34%" horizon="14-day outlook" color="var(--color-rose-500)" />
            <ProbCard title="Heavy Rain" val="42%" horizon="7-day outlook" color="var(--color-amber-500)" />
          </div>

          {/* Feature Importance Bar List */}
          <div className="glass-panel p-5.5 flex flex-col gap-4">
            <h3 className="font-display font-semibold text-[15px]">Local Prediction Feature Contribution</h3>
            <div className="flex flex-col gap-3 font-sans">
              <ImportanceBar label="Rainfall Trend" percentage={95} color="bg-violet-500" />
              <ImportanceBar label="ENSO Index" percentage={75} color="bg-teal-500" />
              <ImportanceBar label="Soil Moisture" percentage={65} color="bg-emerald-500" />
              <ImportanceBar label="IOD Dipole Index" percentage={50} color="bg-amber-500" />
              <ImportanceBar label="MJO Amplitude" percentage={45} color="bg-indigo-400" />
              <ImportanceBar label="Surface Temperature" percentage={30} color="bg-slate-400" />
            </div>
          </div>
        </div>

        {/* Right Section: Confidence & Model Status */}
        <div className="flex flex-col gap-6">
          {/* Confidence Ring card */}
          <div className="glass-panel p-5.5 flex flex-col items-center justify-center text-center py-8">
            <span className="panel-label mb-4">Model Confidence Score</span>
            
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(0,0,0,0.05)" strokeWidth="6" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="var(--color-teal-500)" strokeWidth="6" fill="transparent" 
                        strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 88) / 100} strokeLinecap="round" />
              </svg>
              <div className="font-display text-[34px] font-bold text-text-hi">88%</div>
            </div>

            <div className="text-[13.5px] text-text-mid font-sans font-medium">HIGH MODEL CONSENSUS</div>
            <p className="text-[11.5px] text-text-lo font-sans max-w-[200px] mt-1">
              Low standard deviation between XGBoost, RF and Ensemble sub-models.
            </p>
          </div>

          {/* Model Status Card */}
          <div className="glass-panel p-5.5 flex flex-col gap-4">
            <span className="panel-label">System Performance Status</span>
            
            <div className="flex flex-col gap-3.5">
              <StatusRow icon={<CheckCircle2 className="text-teal-600" size={16} />} title="Model Status" val="Operational" />
              <StatusRow icon={<Calendar className="text-violet-500" size={16} />} title="Last Evaluation" val="Today, 09:00 IST" />
              <StatusRow icon={<Hourglass className="text-amber-500" size={16} />} title="Prediction Horizon" val="7–30 Days" />
              <StatusRow icon={<Activity className="text-text-mid" size={16} />} title="Active Pipeline" val="XGBoost Baseline v1.2" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ArchitectureNode({ step, title, type, active }) {
  return (
    <div className={`flex flex-col justify-between p-4.5 rounded-xl border relative z-10 min-h-[110px] ${
      active 
        ? "bg-gradient-to-br from-violet-500 to-violet-soft text-white border-transparent shadow-[0_4px_12px_rgba(139,124,246,0.2)]" 
        : "bg-glass-fill2 border-glass-borderSoft text-text-hi"
    }`}>
      <div>
        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-md ${active ? "bg-white/20 text-white" : "bg-[rgba(139,124,246,0.18)] text-violet-500"}`}>
          STAGE {step}
        </span>
        <h4 className="font-display text-[12.5px] font-semibold leading-snug mt-2">{title}</h4>
      </div>
      <span className={`text-[10px] font-mono leading-none ${active ? "text-white/80" : "text-text-lo"}`}>{type}</span>
    </div>
  );
}

function ProbCard({ title, val, horizon, color }) {
  return (
    <div className="glass-panel p-4 flex flex-col items-center text-center">
      <span className="font-mono text-[9.5px] text-text-lo uppercase tracking-[.06em]">{title}</span>
      <div className="font-display text-[26px] font-bold my-1 text-text-hi" style={{ color }}>{val}</div>
      <span className="text-[11.5px] text-text-mid font-sans">{horizon}</span>
    </div>
  );
}

function ImportanceBar({ label, percentage, color }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between font-mono text-[11px] text-text-mid">
        <span>{label}</span>
        <span className="font-semibold text-text-hi">{percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-black/5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function StatusRow({ icon, title, val }) {
  return (
    <div className="flex justify-between items-center text-[12.5px] font-sans border-b border-glass-borderSoft/60 pb-2.5 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-2 text-text-mid">
        {icon}
        <span>{title}</span>
      </div>
      <span className="font-semibold text-text-hi">{val}</span>
    </div>
  );
}
