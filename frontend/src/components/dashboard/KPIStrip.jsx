import React from "react";
import { Droplets, CloudRain, CloudLightning, ShieldCheck } from "lucide-react";

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard 
        icon={<Droplets size={15} />}
        iconBg="rgba(139,124,246,0.18)"
        iconColor="var(--color-violet-500)"
        trendBg="rgba(52,214,196,0.14)"
        trendColor="var(--color-teal-500)"
        trendText="▲ 4.2%"
        value="68%"
        label="Monsoon onset probability"
        barColor="var(--color-violet-500)"
        barWidth="68%"
      />
      <KPICard 
        icon={<CloudRain size={15} />}
        iconBg="rgba(242,99,125,0.18)"
        iconColor="var(--color-rose-500)"
        trendBg="rgba(242,99,125,0.14)"
        trendColor="var(--color-rose-500)"
        trendText="▲ 1.8%"
        value="34%"
        label="Break spell risk"
        barColor="var(--color-rose-500)"
        barWidth="34%"
      />
      <KPICard 
        icon={<CloudLightning size={15} />}
        iconBg="rgba(245,158,11,0.10)"
        iconColor="var(--color-amber-500)"
        trendBg="rgba(242,184,75,0.14)"
        trendColor="var(--color-amber-500)"
        trendText="▲ 6.5%"
        value="42%"
        label="Heavy rain event"
        barColor="var(--color-amber-500)"
        barWidth="42%"
      />
      <KPICard 
        icon={<ShieldCheck size={15} />}
        iconBg="rgba(52,214,196,0.18)"
        iconColor="var(--color-teal-500)"
        trendBg="rgba(52,214,196,0.14)"
        trendColor="var(--color-teal-500)"
        trendText="STABLE"
        value="88"
        label="Model confidence score"
        barColor="var(--color-teal-500)"
        barWidth="88%"
      />
    </div>
  );
}

function KPICard({ icon, iconBg, iconColor, trendBg, trendColor, trendText, value, label, barColor, barWidth }) {
  return (
    <div className="glass-panel p-[18px] px-5 flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <div className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
        <span className="font-mono text-[10.5px] py-0.5 px-2 rounded-full" style={{ backgroundColor: trendBg, color: trendColor }}>
          {trendText}
        </span>
      </div>
      <div className="font-display text-[27px] font-bold tracking-[-0.01em] text-text-hi">{value}</div>
      <div className="text-[12px] text-text-mid font-sans">{label}</div>
      <div className="h-1 rounded-full bg-black/5 overflow-hidden mt-0.5">
        <div className="h-full rounded-full" style={{ width: barWidth, backgroundColor: barColor }}></div>
      </div>
    </div>
  );
}
