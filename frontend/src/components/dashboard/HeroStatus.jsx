import React from "react";

export default function HeroStatus() {
  return (
    <div className="glass-panel p-[26px] flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div>
          <span className="panel-label">Onset Probability</span>
          <div className="font-display text-[19px] font-semibold mt-1 text-text-hi">
            Meerut
            <span className="text-text-mid font-normal text-[13px] block mt-0.5 font-sans">
              Uttar Pradesh, India
            </span>
          </div>
        </div>
        <div className="font-mono text-[10.5px] py-1 px-2.5 rounded-full bg-[rgba(52,214,196,0.14)] text-teal-500 border border-[rgba(52,214,196,0.3)] tracking-[.06em]">
          WATCH
        </div>
      </div>
      
      <div>
        <div className="font-display text-[64px] font-bold leading-none my-4 tracking-[-0.02em] text-transparent bg-clip-text bg-gradient-to-br from-white to-[#b9b2f7]">
          78<sup className="text-[28px] opacity-70">%</sup>
        </div>
        <div className="text-text-mid text-[13.5px]">
          7-day onset likelihood · Hybrid model consensus
        </div>
      </div>
      
      <div className="flex gap-[22px] mt-5 pt-4 border-t border-glass-borderSoft">
        <Metric label="Break Spell" value="34%" trend="up" />
        <Metric label="Heavy Rain" value="42%" trend="up" />
        <Metric label="Soil Moist." value="31%" trend="down" />
        <Metric label="Confidence" value="88%" trend="neutral" />
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
