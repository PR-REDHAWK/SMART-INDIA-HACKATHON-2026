import React from "react";
import { Globe, Database, Cpu, Compass, Activity, Thermometer, CloudRain } from "lucide-react";

export default function DataSourcesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="font-mono text-[11.5px] tracking-[.16em] text-teal-500 uppercase mb-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_10px_#0891b2] animate-pulse"></span>
          Ingestion Architecture
        </div>
        <h1 className="font-display font-semibold text-[27px] tracking-[-0.01em] text-text-hi uppercase">
          DATA SOURCES
        </h1>
        <p className="text-text-mid text-[14px]">
          Climate, weather and environmental inputs feeding the Monsoon Intelligence system
        </p>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ENSO */}
        <SourceCard 
          icon={<Globe size={18} />}
          title="ENSO"
          subtitle="El Niño–Southern Oscillation"
          category="Global Climate Signal"
          status="Active"
          desc="Tracks sea surface temperature anomalies in the central and eastern Pacific. Directly influences seasonal rainfall anomalies across India."
        />

        {/* IOD */}
        <SourceCard 
          icon={<Compass size={18} />}
          title="IOD"
          subtitle="Indian Ocean Dipole"
          category="Global Climate Signal"
          status="Monitoring"
          desc="Measures sea surface temperature gradient between western and eastern Indian Ocean. Positive phase enhances Indian monsoon rainfall."
        />

        {/* MJO */}
        <SourceCard 
          icon={<Activity size={18} />}
          title="MJO"
          subtitle="Madden-Julian Oscillation"
          category="Intraseasonal Signal"
          status="Active"
          desc="An eastward moving disturbance of clouds, rainfall, wind, and pressure that traverses the tropics, triggering active and break phases of the monsoon."
        />

        {/* ERA5 */}
        <SourceCard 
          icon={<Database size={18} />}
          title="ERA5"
          subtitle="ECMWF Climate Reanalysis"
          category="Atmospheric Data"
          status="Operational"
          desc="Global atmospheric data including Temperature, Humidity, Mean Sea Level Pressure, Wind Vector fields, and Soil Moisture variables."
        />

        {/* IMD */}
        <SourceCard 
          icon={<CloudRain size={18} />}
          title="IMD"
          subtitle="India Meteorological Dept"
          category="Regional Weather Data"
          status="Operational"
          desc="Ingests real-time localized rainfall observations, surface temperature maps, and official meteorological warnings across districts."
        />

        {/* Soil / Satellite */}
        <SourceCard 
          icon={<Cpu size={18} />}
          title="Soil & Satellite"
          subtitle="Local Environmental Data"
          category="Satellite Ingest"
          status="Ready"
          desc="Extracts land surface properties including volumetric soil water layer 1 (0-7cm), normalized difference vegetation index (NDVI), and topographical risk."
        />

      </div>

      {/* Pipeline Diagram */}
      <div className="glass-panel p-6 mt-4 flex flex-col gap-6">
        <h2 className="font-display font-semibold text-[16px]">Data Pipeline Integration Flow</h2>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4 px-2">
          <PipelineNode title="Global Signals" desc="ENSO, IOD, MJO" icon={<Globe size={18} />} />
          <PipelineArrow />
          <PipelineNode title="Regional Weather" desc="ERA5 Reanalysis + IMD" icon={<Database size={18} />} />
          <PipelineArrow />
          <PipelineNode title="Local Environment" desc="Soil Moisture & Topography" icon={<Thermometer size={18} />} />
          <PipelineArrow />
          <PipelineNode title="Monsoon Model" desc="Local XGBoost Prediction" icon={<Cpu size={18} />} active />
        </div>
      </div>
    </div>
  );
}

function SourceCard({ icon, title, subtitle, category, status, desc }) {
  return (
    <div className="glass-panel p-5.5 flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="w-[34px] h-[34px] rounded-lg bg-[rgba(139,124,246,0.18)] text-violet-500 flex items-center justify-center">
            {icon}
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[.06em] text-text-lo bg-glass-fill2 border border-glass-borderSoft px-2 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        
        <h2 className="font-display font-bold text-[20px] text-text-hi leading-tight">
          {title}
        </h2>
        <p className="text-[12px] text-text-lo font-mono mb-3">{subtitle}</p>
        
        <p className="text-[12.5px] text-text-mid leading-relaxed mb-4">{desc}</p>
      </div>

      <div className="flex justify-between items-center border-t border-glass-borderSoft pt-3 mt-1 font-mono text-[10px]">
        <span className="text-text-lo">Status: <strong className="text-teal-600 font-semibold">{status}</strong></span>
        <span className="text-text-lo">Data: <strong className="text-text-hi font-semibold">Available</strong></span>
      </div>
    </div>
  );
}

function PipelineNode({ title, desc, icon, active }) {
  return (
    <div className={`flex flex-col items-center p-4 px-6 rounded-xl border text-center w-full lg:w-[200px] shrink-0 ${
      active 
        ? "bg-gradient-to-br from-violet-500 to-violet-soft text-white border-transparent shadow-[0_6px_18px_rgba(139,124,246,0.25)]" 
        : "bg-glass-fill2 border-glass-borderSoft text-text-hi"
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${active ? "bg-white/20 text-white" : "bg-[rgba(139,124,246,0.18)] text-violet-500"}`}>
        {icon}
      </div>
      <div className="font-display text-[13.5px] font-semibold leading-tight mb-1">{title}</div>
      <div className={`text-[11px] font-mono leading-none ${active ? "text-white/80" : "text-text-lo"}`}>{desc}</div>
    </div>
  );
}

function PipelineArrow() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center text-text-lo rotate-90 lg:rotate-0">
      <span className="text-[20px] leading-none">→</span>
    </div>
  );
}
