import React from "react";
import { TriangleAlert, Sprout, Wind, Droplet } from "lucide-react";

export default function AdvisoryCard() {
  return (
    <div className="glass-panel p-[24px] relative overflow-hidden bg-gradient-to-br from-[rgba(245,158,11,0.05)] to-transparent">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none"></div>

      <div className="font-mono text-[10.5px] tracking-[.14em] uppercase text-amber-600 font-semibold mb-4 flex items-center gap-2">
        <TriangleAlert size={14} />
        Agricultural Advisory
      </div>
      
      <h2 className="font-display text-[22px] font-bold text-text-hi mb-3 leading-tight uppercase">
        Delay sowing by 3–4 days
      </h2>
      
      <p className="text-[14px] text-text-mid leading-relaxed mb-6 max-w-md">
        A possible dry spell may follow the expected rainfall event. Sowing now could risk germination failure due to insufficient sustained moisture.
      </p>
      
      <div className="flex gap-6 border-t border-glass-borderSoft pt-5">
        <div className="flex items-center gap-2 text-[13px] text-text-hi font-medium">
          <div className="w-7 h-7 rounded-lg bg-[rgba(52,214,196,0.18)] text-teal-500 flex items-center justify-center">
            <Sprout size={14} />
          </div>
          Rice
        </div>
        <div className="flex items-center gap-2 text-[13px] text-text-hi font-medium">
          <div className="w-7 h-7 rounded-lg bg-[rgba(139,124,246,0.18)] text-violet-500 flex items-center justify-center">
            <Droplet size={14} />
          </div>
          Soil Moist: 31%
        </div>
        <div className="flex items-center gap-2 text-[13px] text-text-hi font-medium">
          <div className="w-7 h-7 rounded-lg bg-[rgba(245,158,11,0.15)] text-amber-600 flex items-center justify-center">
            <Wind size={14} />
          </div>
          High Confidence
        </div>
      </div>
    </div>
  );
}
