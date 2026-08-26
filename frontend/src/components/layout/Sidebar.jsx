import React from "react";
import {
  LayoutDashboard,
  Map as MapIcon,
  Database,
  Brain,
  Wind,
  Settings
} from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  return (
    <aside className="w-[84px] bg-glass-fill border-r border-glass-borderSoft backdrop-blur-[30px] saturate-[140%] flex flex-col items-center py-[22px] gap-[34px] min-h-screen shrink-0">
      <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-violet-500 to-violet-soft flex items-center justify-center font-display font-bold text-[15px] text-white shadow-[0_6px_18px_rgba(139,124,246,0.45)]">
        M
      </div>
      
      <div className="flex flex-col gap-1.5 flex-1 items-center mt-3">
        <NavItem icon={<LayoutDashboard size={19} />} active title="Dashboard" />
        <NavItem icon={<MapIcon size={19} />} title="Map" />
        <NavItem icon={<Database size={19} />} title="Data Sources" />
        <NavItem icon={<Brain size={19} />} title="Model" />
        <NavItem icon={<Wind size={19} />} title="Advisory" />
        <NavItem icon={<Settings size={19} />} title="Settings" />
      </div>
      
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-[#1b9e91] border-2 border-white/20"></div>
    </aside>
  );
}

function NavItem({ icon, active, title }) {
  return (
    <div
      title={title}
      className={clsx(
        "w-[44px] h-[44px] rounded-[13px] flex items-center justify-center cursor-pointer transition-all duration-250 relative",
        active 
          ? "bg-gradient-to-br from-[rgba(139,124,246,0.35)] to-[rgba(108,92,231,0.18)] border border-[rgba(139,124,246,0.4)] text-white"
          : "text-text-lo hover:bg-glass-fill2 hover:text-text-hi"
      )}
    >
      {active && (
        <div className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-[3px] bg-violet-500"></div>
      )}
      {icon}
    </div>
  );
}
