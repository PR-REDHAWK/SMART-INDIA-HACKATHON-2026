import React, { useState, useEffect } from "react";
import clsx from "clsx";

export default function MapPage() {
  const [timeframe, setTimeframe] = useState("7D");
  const [overlay, setOverlay] = useState("ONSET");
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/regions')
      .then(res => res.json())
      .then(data => {
        const formattedRegions = data.map((r, i) => {
          const latestForecast = r.forecasts && r.forecasts.length > 0 ? r.forecasts[0] : {};
          
          const onset = Math.round((latestForecast.onset_prob || 0) * 100);
          const breakRisk = Math.round((latestForecast.break_spell_risk || 0) * 100);
          const heavyRain = Math.round((latestForecast.heavy_rain_prob || 0) * 100);

          let risk = "LOW";
          let color = "var(--color-teal-500)";
          if (heavyRain > 75) { risk = "EXTREME"; color = "var(--color-rose-500)"; }
          else if (heavyRain > 50) { risk = "HIGH"; color = "var(--color-orange-400)"; }
          else if (heavyRain > 25) { risk = "MODERATE"; color = "var(--color-amber-500)"; }

          // Distribute SVG pin positions
          const positions = [
            { top: "32%", left: "28%" },
            { top: "55%", left: "62%" },
            { top: "68%", left: "38%" },
            { top: "25%", left: "50%" },
            { top: "45%", left: "45%" },
            { top: "60%", left: "20%" },
            { top: "75%", left: "60%" },
            { top: "15%", left: "70%" },
          ];
          const pos = positions[i % positions.length];

          return {
            id: r.id,
            name: r.name,
            parent: r.level === "District" ? "State" : "India",
            onset,
            breakRisk,
            heavyRain,
            risk,
            color,
            top: pos.top,
            left: pos.left
          };
        });
        
        setRegions(formattedRegions);
        setSelectedRegion(formattedRegions[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch regions", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="font-mono text-violet-500 animate-pulse">Loading live intelligence...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="font-mono text-[11.5px] tracking-[.16em] text-teal-500 uppercase mb-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_10px_#0891b2] animate-pulse"></span>
          Interactive Map
        </div>
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="font-display font-semibold text-[27px] tracking-[-0.01em] text-text-hi">
              MONSOON RISK MAP
            </h1>
            <p className="text-text-mid text-[14px]">Hyper-local precipitation and monsoon risk (Live Data)</p>
          </div>
          <div className="bg-glass-fill border border-glass-borderSoft backdrop-blur-[20px] rounded-full py-2 px-4.5 text-[13.5px] text-text-hi font-medium">
            Live AI Forecast
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-stretch">
        
        {/* Map Container */}
        <div className="glass-panel p-5 flex flex-col gap-4 min-h-[450px]">
          {/* Controls */}
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-1.5">
              {["7D", "14D", "21D", "30D"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={clsx(
                    "font-mono text-[10.5px] px-3.5 py-1.5 rounded-full border tracking-[.04em] cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
                    timeframe === t 
                      ? "bg-gradient-to-br from-violet-500 to-violet-soft text-white border-transparent shadow-[0_2px_8px_rgba(139,124,246,0.2)]" 
                      : "bg-glass-fill2 border-glass-borderSoft text-text-mid hover:text-text-hi"
                  )}
                >
                  {t === "7D" ? "7 DAYS" : t === "14D" ? "14 DAYS" : t === "21D" ? "21 DAYS" : "30 DAYS"}
                </button>
              ))}
            </div>
            
            <div className="flex gap-1.5">
              {["ONSET", "BREAK SPELL", "HEAVY RAIN"].map((o) => (
                <button
                  key={o}
                  onClick={() => setOverlay(o)}
                  className={clsx(
                    "font-mono text-[10.5px] px-3.5 py-1.5 rounded-full border tracking-[.04em] cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50",
                    overlay === o 
                      ? "bg-gradient-to-br from-teal-500 to-teal-500/80 text-white border-transparent shadow-[0_2px_8px_rgba(8,145,178,0.2)]" 
                      : "bg-glass-fill2 border-glass-borderSoft text-text-mid hover:text-text-hi"
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="flex-1 rounded-[16px] relative overflow-hidden border border-glass-borderSoft bg-gradient-to-br from-[#eef7ff] via-[#dcecfb] to-[#f8fbff] min-h-[350px]">
            {/* Grid */}
            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            
            {/* SVG Background */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 430" preserveAspectRatio="none">
              <path d="M300 58 L450 68 L520 50 L600 90 L680 80 L720 120 L760 180 L730 240 L780 290 L710 330 L680 370 L600 400 L550 360 L500 320 L480 280 L420 250 L380 220 L350 190 L320 140 L280 110 Z" fill="#dfeaf5" stroke="#7c9bb9" strokeWidth="3"/>
              <path d="M300 58 L450 68 L520 50 L600 90 L560 140 L500 150 L420 130 L360 110 L300 110 Z" fill="var(--color-teal-500)" fillOpacity=".3" stroke="#fff" strokeWidth="1.5"/>
              <path d="M360 110 L420 130 L500 150 L560 140 L600 180 L580 230 L520 220 L450 200 L400 160 Z" fill="var(--color-amber-500)" fillOpacity=".35" stroke="#fff" strokeWidth="1.5"/>
              <path d="M600 180 L650 170 L720 120 L760 180 L730 240 L780 290 L710 330 L680 280 L640 240 L580 230 Z" fill="var(--color-rose-500)" fillOpacity=".3" stroke="#fff" strokeWidth="1.5"/>
            </svg>

            {/* Region Pins */}
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                className="absolute z-10 flex flex-col items-center gap-1 group cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-lg p-0.5"
                style={{ top: region.top, left: region.left }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-3.5 h-3.5 rounded-full animate-ping opacity-60" style={{ backgroundColor: region.color }}></div>
                  <div className="w-3 h-3 rounded-full relative z-10 shadow-[0_0_0_4px_rgba(255,255,255,0.4)]" style={{ backgroundColor: region.color }}></div>
                </div>
                <div className={clsx(
                  "font-mono text-[9px] backdrop-blur-[12px] py-0.5 px-2 rounded-[6px] border whitespace-nowrap mt-1 transition-all",
                  selectedRegion?.id === region.id 
                    ? "bg-text-hi text-white border-transparent scale-105" 
                    : "bg-white/80 text-text-hi border-glass-borderSoft group-hover:scale-105"
                )}>
                  {region.name} • {overlay === "ONSET" ? `${region.onset}%` : overlay === "BREAK SPELL" ? `${region.breakRisk}%` : `${region.heavyRain}%`}
                </div>
              </button>
            ))}
          </div>

          {/* Map Legend */}
          <div className="flex gap-4 font-mono text-[10px] text-text-lo justify-between items-center">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-teal-500"></i> Low Risk</span>
              <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-amber-500"></i> Moderate</span>
              <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-orange-400"></i> High</span>
              <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-rose-500"></i> Extreme</span>
            </div>
            <div className="text-[9.5px]">Click markers to inspect details</div>
          </div>
        </div>

        {/* Selected Info Panel */}
        {selectedRegion && (
          <div className="glass-panel p-5 flex flex-col justify-between">
            <div>
              <span className="panel-label">Selected Region</span>
              <h3 className="font-display font-semibold text-[20px] text-text-hi mt-1">
                {selectedRegion.name}
              </h3>
              <span className="text-text-mid text-[12.5px] font-sans block mb-5">
                {selectedRegion.parent}
              </span>

              <div className="flex flex-col gap-4.5 border-t border-glass-borderSoft pt-5">
                <RegionMetric label="Onset Likelihood" val={`${selectedRegion.onset}%`} />
                <RegionMetric label="Break spell Risk" val={`${selectedRegion.breakRisk}%`} />
                <RegionMetric label="Heavy Rain Prob." val={`${selectedRegion.heavyRain}%`} />
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-glass-borderSoft">
              <div className="font-mono text-[9px] text-text-lo tracking-[.08em] uppercase mb-1.5">Risk Level</div>
              <div className={clsx(
                "font-display text-[15px] font-bold py-2 px-3 rounded-xl inline-block text-center w-full",
                selectedRegion.risk === "LOW" && "bg-teal-500/10 text-teal-600 border border-teal-500/20",
                selectedRegion.risk === "MODERATE" && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                selectedRegion.risk === "HIGH" && "bg-orange-500/10 text-orange-600 border border-orange-500/20",
                selectedRegion.risk === "EXTREME" && "bg-rose-500/10 text-rose-600 border border-rose-500/20"
              )}>
                {selectedRegion.risk} RISK
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function RegionMetric({ label, val }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-text-mid text-[13px]">{label}</span>
      <span className="font-mono text-[14px] font-semibold text-text-hi">{val}</span>
    </div>
  );
}
