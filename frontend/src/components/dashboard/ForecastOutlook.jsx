import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: '7D', onset: 78, break: 34, heavy: 42 },
  { name: '14D', onset: 71, break: 61, heavy: 44 },
  { name: '21D', onset: 64, break: 58, heavy: 52 },
  { name: '30D', onset: 53, break: 47, heavy: 48 },
];

export default function ForecastOutlook() {
  return (
    <div className="glass-panel p-[22px] flex flex-col gap-4 w-full h-[320px]">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-[16px] font-semibold">Monsoon Outlook</h2>
        <span className="panel-label">Probability Trend</span>
      </div>
      
      <div className="flex-1 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOnset" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBreak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono', fill: '#7890ab' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono', fill: '#7890ab' }} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: '1px solid rgba(71,133,201,0.18)', boxShadow: '0 4px 18px rgba(64,133,195,0.08)' }}
              itemStyle={{ fontFamily: 'Inter', fontSize: '13px' }}
              labelStyle={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#10233f' }}
            />
            <Area type="monotone" dataKey="onset" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorOnset)" name="Onset %" />
            <Area type="monotone" dataKey="break" stroke="#e11d48" strokeWidth={2} fillOpacity={1} fill="url(#colorBreak)" name="Break %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
