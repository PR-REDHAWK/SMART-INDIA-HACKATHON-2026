import React from "react";
import { MapPin } from "lucide-react";

export default function Topbar({
  states = [],
  districts = [],
  selectedStateId,
  selectedDistrictId,
  onStateChange,
  onDistrictChange
}) {
  return (
    <div className="flex items-center justify-between gap-5 flex-wrap">
      <div>
        <div className="font-mono text-[11.5px] tracking-[.16em] text-teal-500 uppercase mb-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_10px_#0891b2] animate-pulse"></span>
          Monsoon Intelligence · Live Model
        </div>
        <h1 className="font-display font-semibold text-[27px] tracking-[-0.01em] text-text-hi">
          National Advisory Overview
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {/* State Selection Dropdown */}
        <div className="bg-glass-fill border border-glass-borderSoft backdrop-blur-[20px] rounded-full py-2.5 px-4.5 flex items-center gap-2 text-text-mid hover:bg-glass-fill2 focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-transparent transition-all duration-200">
          <MapPin size={14} className="opacity-70 text-violet-500" />
          <select 
            value={selectedStateId || ""}
            onChange={(e) => onStateChange(e.target.value)}
            className="bg-transparent border-none outline-none text-text-hi text-[13.5px] font-sans cursor-pointer"
          >
            <option value="" disabled className="text-text-lo">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#f0f4f8] text-text-hi">{s.name}</option>
            ))}
          </select>
        </div>

        {/* District Selection Dropdown */}
        <div className="bg-glass-fill border border-glass-borderSoft backdrop-blur-[20px] rounded-full py-2.5 px-4.5 flex items-center gap-2 text-text-mid hover:bg-glass-fill2 focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-transparent transition-all duration-200">
          <select 
            value={selectedDistrictId || ""}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="bg-transparent border-none outline-none text-text-hi text-[13.5px] font-sans cursor-pointer"
          >
            <option value="" disabled className="text-text-lo">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#f0f4f8] text-text-hi">{d.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-glass-fill border border-glass-borderSoft backdrop-blur-[20px] rounded-full py-2.5 px-4.5 text-[13.5px] text-text-mid font-sans flex items-center h-full">
          Sat, 27 Sep 2024 · IST 09:00
        </div>
      </div>
    </div>
  );
}
