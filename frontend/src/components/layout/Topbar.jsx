import React from "react";
import { Search } from "lucide-react";

export default function Topbar() {
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
        <div className="bg-glass-fill border border-glass-borderSoft backdrop-blur-[20px] rounded-full py-2.5 px-4.5 flex items-center gap-2.5 text-text-mid hover:bg-glass-fill2 focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-transparent transition-all duration-200">
          <Search size={15} className="opacity-60" />
          <input 
            type="text" 
            placeholder="Search district, state…" 
            defaultValue="Marathwada, MH"
            className="bg-transparent border-none outline-none text-text-hi text-[13.5px] w-[120px] font-sans placeholder-text-lo"
          />
        </div>
        <div className="bg-glass-fill border border-glass-borderSoft backdrop-blur-[20px] rounded-full py-2.5 px-4.5 text-[13.5px] text-text-mid font-sans flex items-center h-full">
          Sat, 27 Sep 2024 · IST 09:00
        </div>
      </div>
    </div>
  );
}
