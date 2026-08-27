import React, { useState } from "react";
import clsx from "clsx";

export default function RiskMap() {
  const [timeframe, setTimeframe] = useState("7D");

  return (
    <div className="glass-panel p-[22px] flex flex-col gap-3.5 h-full min-h-[300px]">
      <div className="flex justify-between items-center">
        <span className="panel-label">Map View · Rainfall Probability Overlay</span>
        <div className="flex gap-1.5">
          {["7D", "14D", "21D", "30D"].map((t) => (
            <MapToggle 
              key={t} 
              active={timeframe === t} 
              onClick={() => setTimeframe(t)}
            >
              {t}
            </MapToggle>
          ))}
        </div>
      </div>
      
      <div className="flex-1 rounded-[16px] relative overflow-hidden border border-glass-borderSoft bg-gradient-to-br from-[#eef7ff] via-[#dcecfb] to-[#f8fbff]">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        ></div>
        
        {/* Dummy SVG Map */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 430" preserveAspectRatio="none" aria-label="Dummy climate zone map">
          <path d="M350 38 L430 58 L505 45 L574 82 L635 72 L698 115 L742 166 L720 222 L756 270 L706 308 L671 357 L624 392 L579 351 L540 318 L500 278 L451 247 L411 215 L372 184 L345 139 L315 103 Z" fill="#dfeaf5" stroke="#7c9bb9" strokeWidth="3"/>
          <path d="M350 38 L430 58 L505 45 L574 82 L550 128 L490 143 L426 123 L365 104 L315 103 Z" fill="#4b8fe8" fillOpacity=".78" stroke="#fff" strokeWidth="2"/>
          <path d="M365 104 L426 123 L490 143 L550 128 L594 160 L568 214 L510 205 L451 185 L411 150 Z" fill="#34b96b" fillOpacity=".78" stroke="#fff" strokeWidth="2"/>
          <path d="M594 160 L635 152 L698 115 L742 166 L720 222 L756 270 L706 308 L671 270 L635 235 L568 214 Z" fill="#ef6262" fillOpacity=".80" stroke="#fff" strokeWidth="2"/>
          <path d="M451 185 L510 205 L568 214 L635 235 L671 270 L624 320 L579 286 L540 250 L500 232 Z" fill="#4b8fe8" fillOpacity=".72" stroke="#fff" strokeWidth="2"/>
          <path d="M540 250 L579 286 L624 320 L671 357 L624 392 L579 351 L540 318 L500 278 Z" fill="#34b96b" fillOpacity=".76" stroke="#fff" strokeWidth="2"/>
          <g fill="none" stroke="#fff" strokeOpacity=".72" strokeWidth="1.5">
            <path d="M426 123 L411 150 L451 185"/>
            <path d="M490 143 L510 205 L500 232"/>
            <path d="M550 128 L568 214 L540 250"/>
            <path d="M594 160 L568 214 L635 235"/>
            <path d="M579 286 L624 320"/>
            <path d="M635 235 L671 270"/>
          </g>
          <g className="font-sans text-[13px] font-bold fill-[#17324f]">
            <text x="390" y="93">NORTH</text>
            <text x="447" y="168">STABLE</text>
            <text x="645" y="195">HIGH RAIN</text>
            <text x="548" y="300">FAVOURABLE</text>
          </g>
        </svg>

        {/* Pins */}
        <MapPin top="32%" left="28%" color="var(--color-violet-500)" label="Meerut · 78%" />
        <MapPin top="55%" left="62%" color="var(--color-teal-500)" label="Block A · 62%" />
        <MapPin top="68%" left="38%" color="var(--color-amber-500)" label="Block B · 41%" />
      </div>

      <div className="flex gap-4 font-mono text-[10px] text-text-lo">
        <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-violet-500"></i> Onset likely</span>
        <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-teal-500"></i> Stable</span>
        <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-amber-500"></i> Heavy rain risk</span>
      </div>
    </div>
  );
}

function MapToggle({ children, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "font-mono text-[10.5px] px-3 py-1.5 rounded-full border tracking-[.04em] cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
        active 
          ? "bg-gradient-to-br from-violet-500 to-violet-soft text-white border-transparent shadow-[0_2px_8px_rgba(139,124,246,0.2)]" 
          : "bg-glass-fill2 border-glass-borderSoft text-text-mid hover:text-text-hi"
      )}
    >
      {children}
    </button>
  );
}

function MapPin({ top, left, color, label }) {
  return (
    <div className="absolute z-10 flex flex-col items-center gap-1 group" style={{ top, left }}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-[11px] h-[11px] rounded-full animate-[ping_2.4s_infinite_ease-out] opacity-70" style={{ backgroundColor: color }}></div>
        <div className="w-[11px] h-[11px] rounded-full shadow-[0_0_0_5px_rgba(255,255,255,0.06)] relative z-10" style={{ backgroundColor: color }}></div>
      </div>
      <div className="font-mono text-[9.5px] bg-[rgba(255,255,255,0.72)] text-text-hi backdrop-blur-[12px] py-0.5 px-2 rounded-[6px] border border-glass-borderSoft whitespace-nowrap mt-1 group-hover:scale-105 transition-transform">
        {label}
      </div>
    </div>
  );
}
