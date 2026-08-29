import React from "react";

export default function HeroStatus({ selectedRegion }) {
  const latestForecast = selectedRegion?.forecasts && selectedRegion.forecasts.length > 0
    ? selectedRegion.forecasts[0]
    : null;

  const onset = latestForecast ? Math.round(latestForecast.onset_prob * 100) : 0;
  const breakRisk = latestForecast ? Math.round(latestForecast.break_spell_risk * 100) : 0;
  const heavyRain = latestForecast ? Math.round(latestForecast.heavy_rain_prob * 100) : 0;
  const confidence = latestForecast ? Math.round(latestForecast.confidence * 100) : 0;

  // Derive watch status
  let statusText = "NORMAL";
  let statusColor = "text-teal-500 bg-[rgba(52,214,196,0.14)] border-[rgba(52,214,196,0.3)]";
  if (heavyRain > 75 || breakRisk > 75) {
    statusText = "ALERT";
    statusColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
  } else if (heavyRain > 50 || breakRisk > 50) {
    statusText = "WATCH";
    statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
  }

  return (
    <div className="glass-panel p-[26px] flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div>
          <span className="panel-label">Onset Probability</span>
          <div className="font-display text-[19px] font-semibold mt-1 text-text-hi">
            {selectedRegion?.name || "India"}
            <span className="text-text-mid font-normal text-[13px] block mt-0.5 font-sans">
              {selectedRegion?.level === "District" ? "District Monitor" : "State Monitor"}
            </span>
          </div>
        </div>
        <div className={`font-mono text-[10.5px] py-1 px-2.5 rounded-full border tracking-[.06em] ${statusColor}`}>
          {statusText}
        </div>
      </div>
      
      <div>
        <div className="font-display text-[64px] font-bold leading-none my-4 tracking-[-0.02em] text-transparent bg-clip-text bg-gradient-to-br from-white to-[#b9b2f7]">
          {onset}<sup className="text-[28px] opacity-70">%</sup>
        </div>
        <div className="text-text-mid text-[13.5px]">
          7-day onset likelihood · Hybrid model consensus
        </div>
      </div>
      
      <div className="flex gap-[22px] mt-5 pt-4 border-t border-glass-borderSoft">
        <Metric label="Break Spell" value={`${breakRisk}%`} trend={breakRisk > 50 ? "up" : "neutral"} />
        <Metric label="Heavy Rain" value={`${heavyRain}%`} trend={heavyRain > 50 ? "up" : "neutral"} />
        <Metric label="Soil Moist." value="31%" trend="down" />
        <Metric label="Confidence" value={`${confidence}%`} trend="neutral" />
      </div>
    </div>
  );
}

function Metric({ label, value, trend }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] text-text-lo tracking-[.08em] uppercase">{label}</span>
      <span className={`font-display text-[16px] font-semibold ${
        trend === "up" ? "text-rose-500" : trend === "down" ? "text-teal-500" : "text-text-hi"
      }`}>
        {value}
      </span>
    </div>
  );
}
