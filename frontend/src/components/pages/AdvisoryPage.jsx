import React, { useState, useEffect } from "react";
import { AlertTriangle, Calendar, Sprout, Droplets, ShieldAlert, Sparkles, ChevronDown, ChevronUp, Filter, Volume2, VolumeX, MapPin } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../../context/LanguageContext";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import SearchableSelect from "../common/SearchableSelect";

export default function AdvisoryPage({
  states = [],
  districts = [],
  selectedStateId,
  selectedDistrictId,
  onStateChange,
  onDistrictChange,
  selectedRegion,
  liveForecast
}) {
  const { language, setLanguage, t } = useLanguage();
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const [liveAdvisories, setLiveAdvisories] = useState([]);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // Interactive Scenario & Crop/Stage Filter States
  const [activeScenario, setActiveScenario] = useState("LIVE");
  const [crop, setCrop] = useState("Rice");
  const [stage, setStage] = useState("Sowing");
  const [availableCrops, setAvailableCrops] = useState([
    "Rice", "Wheat", "Maize", "Cotton", "Soybean", "Sugarcane", "Gram", "Tur (Pigeon Pea)", "Groundnut", "Mustard", "Bajra", "Jowar", "Potato", "Onion"
  ]);

  useEffect(() => {
    fetch('/api/v1/advisories')
      .then(res => res.json())
      .then(data => setLiveAdvisories(data))
      .catch(err => console.error(err));
  }, []);

  // Derive Location Name
  const selectedState = states.find((s) => String(s.id) === String(selectedStateId));
  const selectedDistrict = districts.find((d) => String(d.id) === String(selectedDistrictId));

  const locationName = selectedDistrict 
    ? `${selectedDistrict.name}, ${selectedState ? selectedState.name : ""}` 
    : (selectedState ? selectedState.name : (liveForecast?.metadata?.resolved_state || "Uttar Pradesh"));

  // Dynamic Crop fetch for selected State from Kaggle state-crop dataset
  useEffect(() => {
    const stateName = selectedState ? selectedState.name : "Uttar Pradesh";
    fetch(`/api/v1/crops?state=${encodeURIComponent(stateName)}`)
      .then(res => res.json())
      .then(data => {
        if (data.crops && data.crops.length > 0) {
          setAvailableCrops(data.crops);
        }
      })
      .catch(err => console.error("Failed to load state crops:", err));
  }, [selectedStateId]);

  // Format crop options for SearchableSelect
  const cropSelectOptions = availableCrops.map((c) => ({
    id: c,
    name: t(`crop_${c.toLowerCase().replace(/[^a-z0-9]/g, "_")}`, c)
  }));

  // Filter alerts by region if applicable
  const filteredAdvisories = selectedRegion && selectedRegion.id
    ? liveAdvisories.filter(adv => !adv.region_id || adv.region_id === selectedRegion.id)
    : liveAdvisories;
  const displayedAdvisoriesList = filteredAdvisories.length > 0 ? filteredAdvisories : liveAdvisories;

  const maxAlertCap = 3;
  const displayedAdvisories = showAllAlerts ? displayedAdvisoriesList : displayedAdvisoriesList.slice(0, maxAlertCap);

  // Scenario specifics logic
  const getScenarioContent = () => {
    if (activeScenario === "FALSE_ONSET") {
      return {
        badge: "FALSE-ONSET ALERT",
        badgeColor: "border-rose-500 bg-gradient-to-r from-rose-500/10 to-transparent",
        title: t("code_FALSE_ONSET_WARNING_title", "⚠️ False-Onset Risk Warning"),
        reason: t("code_FALSE_ONSET_WARNING_msg", "Monsoon onset appears likely, but break-spell risk remains high over the next 14 days."),
        action: t("code_FALSE_ONSET_WARNING_action", "Avoid relying solely on initial rainfall for sowing. Delay rain-dependent sowing until sustained moisture settles."),
        breakProb: "85%",
        soilMoist: "22%",
        confidence: "VERY HIGH",
        timelineToday: "Hold Sowing Operations",
        timeline3Days: "Prepare Irrigation Facilities",
        timeline7Days: "Monitor Moisture Persistence",
        timeline14Days: "Dry Spell Window"
      };
    } else if (activeScenario === "HEAVY_RAIN") {
      return {
        badge: "HEAVY RAIN ALERT",
        badgeColor: "border-amber-500 bg-gradient-to-r from-amber-500/10 to-transparent",
        title: t("code_HEAVY_RAIN_WARNING_title", "⚡ High Heavy Rainfall Alert"),
        reason: t("code_HEAVY_RAIN_WARNING_msg", "Heavy rainfall event probability is high over the next 7-14 days."),
        action: t("code_HEAVY_RAIN_WARNING_action", "Check and clear field drainage systems to prevent waterlogging and crop damage."),
        breakProb: "12%",
        soilMoist: "68%",
        confidence: "HIGH",
        timelineToday: "Inspect Drainage Furrows",
        timeline3Days: "Clear Debris & Drainage",
        timeline7Days: "Heavy Rainfall Event Window",
        timeline14Days: "Post-Rain Field Inspection"
      };
    } else if (activeScenario === "BREAK_SPELL") {
      return {
        badge: "HIGH DRY-SPELL RISK",
        badgeColor: "border-orange-500 bg-gradient-to-r from-orange-500/10 to-transparent",
        title: t("code_BREAK_SPELL_WARNING_title", "🟠 High Dry-Spell Risk"),
        reason: t("code_BREAK_SPELL_WARNING_msg", "A prolonged dry spell (break spell) is likely over the next 7–14 days."),
        action: t("code_BREAK_SPELL_WARNING_action", "Delay rain-dependent sowing if practical due to imminent dry spell. Prepare supplemental irrigation alternatives."),
        breakProb: "95%",
        soilMoist: "18%",
        confidence: "VERY HIGH",
        timelineToday: "Delay Rain Sowing",
        timeline3Days: "Prepare Protective Irrigation",
        timeline7Days: "Dry Spell Window Begins",
        timeline14Days: "Sustained Dry Spell"
      };
    } else { // LIVE PIPELINE DEFAULT (DYNAMIC LOCATION & CROP BASED)
      const cropKey = `adv_${crop.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${stage.toLowerCase()}`;
      const cropAction = t(cropKey, null);

      const liveBreakProb = liveForecast?.predictions?.calibrated_p_break_14d !== undefined
        ? `${Math.round(liveForecast.predictions.calibrated_p_break_14d * 100)}%`
        : (liveForecast?.predictions?.P_break_14d !== undefined 
            ? `${Math.round(liveForecast.predictions.P_break_14d * 100)}%`
            : "71%");

      const liveSoilMoist = liveForecast?.metadata?.soil_moisture_pct !== undefined
        ? `${liveForecast.metadata.soil_moisture_pct}%`
        : (liveForecast?.inputs?.soil_moisture_pct !== undefined
            ? `${liveForecast.inputs.soil_moisture_pct}%`
            : "25%");

      const liveConfidence = liveForecast?.metadata?.is_direct_match
        ? "VERY HIGH (DIRECT)"
        : "HIGH (REGIONAL)";

      const advCode = liveForecast?.advisory?.advisory_code || "BREAK_SPELL_WARNING";
      const rawTitle = liveForecast?.advisory?.title || "DELAY SOWING BY 3–4 DAYS";
      const rawAction = liveForecast?.advisory?.primary_action || "A possible dry spell may follow expected rainfall. Delay rain-dependent sowing until sustained moisture settles.";

      return {
        badge: `${liveForecast?.advisory?.risk_level || "ACTION"} REQUIRED`,
        badgeColor: liveForecast?.advisory?.risk_level === "HIGH" || liveForecast?.advisory?.risk_level === "VERY_HIGH"
          ? "border-rose-500 bg-gradient-to-r from-rose-500/10 to-transparent"
          : "border-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent",
        title: t(`code_${advCode}_title`, rawTitle),
        reason: liveForecast?.advisory?.false_onset_risk 
          ? t("code_FALSE_ONSET_WARNING_msg", "Monsoon onset appears likely, but break-spell risk remains high over the next 14 days.")
          : t(`code_${advCode}_msg`, "A possible rainfall event may be followed by a prolonged dry spell. Sowing prematurely could risk germination failure."),
        action: cropAction || t(`code_${advCode}_action`, rawAction),
        breakProb: liveBreakProb,
        soilMoist: liveSoilMoist,
        confidence: liveConfidence,
        timelineToday: t("timelineToday", "Monitor local conditions"),
        timeline3Days: t("timeline3Days", "Avoid premature sowing"),
        timeline7Days: t("timeline7Days", "Expected rainfall window"),
        timeline14Days: t("timeline14Days", "Possible dry spell")
      };
    }
  };

  const activeContent = getScenarioContent();

  const handlePlayVoice = () => {
    if (isSpeaking) {
      stop();
      return;
    }
    const cropDisplay = t(`crop_${crop.toLowerCase().replace(/[^a-z0-9]/g, "_")}`, crop);
    const textToSpeak = `${locationName}. ${cropDisplay} advisory. ${activeContent.title}. ${activeContent.action}`;
    speak(textToSpeak, language);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Language Switcher */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="font-mono text-[11.5px] tracking-[.16em] text-teal-500 uppercase mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_10px_#0891b2] animate-pulse"></span>
            Farmer Decision Support
          </div>
          <h1 className="font-display font-semibold text-[27px] tracking-[-0.01em] text-text-hi uppercase">
            {t("advisory_page_title", "AGRICULTURAL ADVISORY SYSTEM")}
          </h1>
          <p className="text-text-mid text-[14px]">
            {t("subtitle", "Translate climate predictions into actionable farming decisions.")}
          </p>
        </div>

        {/* Language & Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayVoice}
            className={clsx(
              "font-mono text-[11px] font-semibold px-3 py-1.5 rounded-full border flex items-center gap-1.5 cursor-pointer transition-all duration-200",
              isSpeaking 
                ? "bg-rose-500/20 text-rose-600 border-rose-500/30 animate-pulse" 
                : "bg-glass-fill border-glass-borderSoft text-text-hi hover:scale-105 active:scale-95"
            )}
            title={isSpeaking ? t("stop_voice", "Stop Audio") : t("listen_advisory", "Listen to Advisory")}
          >
            {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} className="text-violet-500 animate-bounce" />}
            <span>{isSpeaking ? t("stop_voice", "Stop") : t("listen_advisory", "Listen")}</span>
          </button>

          <div className="bg-glass-fill border border-glass-borderSoft p-1 rounded-full flex gap-1.5">
            <button 
              onClick={() => setLanguage("en")}
              className={clsx(
                "font-mono text-[10.5px] px-3.5 py-1 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95",
                language === "en" ? "bg-text-hi text-white font-semibold" : "text-text-mid hover:text-text-hi"
              )}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage("hi")}
              className={clsx(
                "font-mono text-[10.5px] px-3.5 py-1 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95",
                language === "hi" ? "bg-text-hi text-white font-semibold" : "text-text-mid hover:text-text-hi"
              )}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Location, Crop, Stage & Climate Scenario Bar */}
      <div className="glass-panel p-4 flex flex-col gap-4">
        {/* Row 1: Interactive Location Selector */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-glass-borderSoft">
          <div className="flex items-center gap-2 text-violet-500 font-mono text-[11px] uppercase tracking-[.08em] font-semibold">
            <MapPin size={15} className="shrink-0" />
            <span>{t("select_location_label", "Select Location:")}</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap flex-1 max-w-xl">
            {/* State Select */}
            <div className="w-48">
              <SearchableSelect
                options={states}
                value={selectedStateId}
                onChange={onStateChange}
                placeholder={t("select_state", "Select State")}
              />
            </div>
            {/* District Select */}
            <div className="w-48">
              <SearchableSelect
                options={districts}
                value={selectedDistrictId}
                onChange={onDistrictChange}
                placeholder={t("select_district", "Select District")}
              />
            </div>
          </div>

          <div className="bg-teal-500/10 border border-teal-500/20 text-teal-600 px-3 py-1 rounded-full font-mono text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            <span>{t("active_region", "Active Region:")} {locationName}</span>
          </div>
        </div>

        {/* Row 2: Dynamic Crop & Stage Selectors */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-glass-borderSoft">
          {/* Dynamic Crop Selection Section */}
          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-[320px]">
            <div className="flex items-center gap-1.5 text-teal-500 font-mono text-[10.5px] uppercase tracking-[.06em] font-semibold">
              <Sprout size={15} className="shrink-0" />
              <span>{t("select_crop_label", "Crop:")}</span>
            </div>

            {/* Quick Pills for top popular crops in selected state */}
            <div className="flex gap-1.5 flex-wrap">
              {availableCrops.slice(0, 5).map((c) => (
                <button
                  key={c}
                  onClick={() => setCrop(c)}
                  className={clsx(
                    "font-mono text-[10.5px] px-3 py-1 rounded-full border cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95",
                    crop === c
                      ? "bg-teal-500 text-white font-semibold border-transparent shadow-sm"
                      : "bg-glass-fill2 border-glass-borderSoft text-text-mid hover:text-text-hi"
                  )}
                >
                  {t(`crop_${c.toLowerCase().replace(/[^a-z0-9]/g, "_")}`, c)}
                </button>
              ))}
            </div>

            {/* Searchable Select for ALL crops in state */}
            <div className="w-52">
              <SearchableSelect
                options={cropSelectOptions}
                value={crop}
                onChange={(val) => setCrop(val)}
                placeholder={`Search ${availableCrops.length}+ crops...`}
              />
            </div>
          </div>

          {/* Growth Stage Selector */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10.5px] text-text-lo uppercase tracking-[.06em]">
              {t("select_stage_label", "Stage:")}
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {["Sowing", "Vegetative", "Flowering", "Harvest"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  className={clsx(
                    "font-mono text-[10.5px] px-3 py-1 rounded-full border cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95",
                    stage === s
                      ? "bg-violet-500 text-white font-semibold border-transparent shadow-sm"
                      : "bg-glass-fill2 border-glass-borderSoft text-text-mid hover:text-text-hi"
                  )}
                >
                  {t(`stage_${s.toLowerCase()}`, s)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Scenario Simulator */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-amber-500 shrink-0" />
          <span className="font-mono text-[10.5px] text-text-lo uppercase tracking-[.06em]">
            {t("scenario_sim_label", "Simulate Climate Risk Scenario:")}
          </span>
          <div className="flex gap-2 flex-wrap font-mono text-[10.5px]">
            {[
              { id: "LIVE", label: `LIVE PIPELINE (${locationName.toUpperCase()})` },
              { id: "FALSE_ONSET", label: "FALSE-ONSET RISK" },
              { id: "BREAK_SPELL", label: "HIGH DRY-SPELL RISK" },
              { id: "HEAVY_RAIN", label: "HEAVY RAINFALL ALERT" }
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(sc.id)}
                className={clsx(
                  "px-3 py-1 rounded-full border cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95",
                  activeScenario === sc.id 
                    ? "bg-violet-500 text-white font-semibold border-transparent shadow-sm" 
                    : "bg-glass-fill2 border-glass-borderSoft text-text-mid hover:text-text-hi"
                )}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Highlighted Card & Dynamic Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-stretch">
        
        {/* Left Side: Highlighted Decision Card & Grid details */}
        <div className="flex flex-col gap-6">
          {/* Main Action Required Highlight */}
          <div className={clsx("glass-panel p-6 border-l-4 relative overflow-hidden flex flex-col justify-between transition-all duration-300", activeContent.badgeColor)}>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div>
              <div className="font-mono text-[10px] tracking-[.14em] text-amber-600 font-semibold mb-3 flex items-center gap-1.5 uppercase">
                <AlertTriangle size={14} />
                {activeContent.badge}
              </div>
              <h2 className="font-display font-bold text-[22px] text-text-hi tracking-wide mb-3 leading-tight uppercase animate-fadeIn" key={`title-${activeScenario}-${crop}-${stage}-${selectedStateId}-${selectedDistrictId}`}>
                {activeContent.title}
              </h2>
              <p className="text-[14px] text-text-mid leading-relaxed mb-6 animate-fadeIn" key={`action-${activeScenario}-${crop}-${stage}-${selectedStateId}-${selectedDistrictId}`}>
                {activeContent.action}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-5 border-t border-glass-borderSoft">
              <AdvisorySpec label="Location" val={locationName} highlight />
              <AdvisorySpec label="Crop" val={t(`crop_${crop.toLowerCase().replace(/[^a-z0-9]/g, "_")}`, crop)} highlight />
              <AdvisorySpec label="Break Prob." val={activeContent.breakProb} />
              <AdvisorySpec label="Soil Moisture" val={activeContent.soilMoist} />
              <AdvisorySpec label="Confidence" val={activeContent.confidence} />
            </div>
          </div>

          {/* Live API Advisories — Capped at top 3 items */}
          {displayedAdvisoriesList.length > 0 && (
            <div className="flex flex-col gap-3 mt-1 mb-1">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] tracking-[.1em] text-violet-500 uppercase">
                  {t("liveAlerts", "LIVE DATABASE ALERTS FOR")} {locationName.toUpperCase()} ({displayedAdvisories.length} OF {displayedAdvisoriesList.length})
                </span>
                {displayedAdvisoriesList.length > maxAlertCap && (
                  <button
                    onClick={() => setShowAllAlerts(!showAllAlerts)}
                    className="font-mono text-[10.5px] text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{showAllAlerts ? t("showLess", "Show Less") : `${t("showMore", "Show More Alerts")} (${displayedAdvisoriesList.length - maxAlertCap}+)`}</span>
                    {showAllAlerts ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                )}
              </div>

              {displayedAdvisories.map(adv => (
                <div key={adv.id} className="glass-panel p-4 border-l-4 border-rose-500 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full uppercase">{adv.advisory_type} - {adv.crop}</span>
                      <span className="font-mono text-[9px] bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded-full uppercase">📍 {locationName}</span>
                    </div>
                    <span className="font-mono text-[9px] text-text-lo">{new Date(adv.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-display font-semibold text-text-hi text-[15px]">{adv.title}</h4>
                  <p className="text-[13px] text-text-mid leading-relaxed">{adv.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sub advisory crop grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SubAdvisoryCard icon={<Sprout size={16} />} title={t("sowingTitle", "Delay sowing")} desc={t("sowingDesc", "Wait for rainfall persistence before planting.")} type="SOWING" />
            <SubAdvisoryCard icon={<Droplets size={16} />} title={t("irrigationTitle", "Monitor irrigation")} desc={t("irrigationDesc", "Current soil moisture is adequate, but conditions may change.")} type="IRRIGATION" />
            <SubAdvisoryCard icon={<ShieldAlert size={16} />} title={t("drainageTitle", "Prepare drainage")} desc={t("drainageDesc", "Heavy rainfall probability is increasing.")} type="DRAINAGE" />
            <SubAdvisoryCard icon={<Sparkles size={16} />} title={t("healthTitle", "Monitor crop stress")} desc={t("healthDesc", "Dry spell probability is elevated.")} type="CROP HEALTH" />
          </div>
        </div>

        {/* Right Side: Interactive Decision Timeline */}
        <div className="glass-panel p-5.5 flex flex-col justify-between min-h-[400px]">
          <div>
            <span className="panel-label">Advisory Decision Timeline ({crop} - {locationName})</span>
            
            <div className="relative mt-8 ml-2 flex flex-col gap-8">
              {/* Vertical line connector */}
              <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-violet-500 via-teal-500 to-rose-400"></div>

              <TimelineStep step="TODAY" desc={activeContent.timelineToday} color="bg-violet-500" />
              <TimelineStep step="NEXT 3 DAYS" desc={activeContent.timeline3Days} color="bg-teal-500" />
              <TimelineStep step="NEXT 7 DAYS" desc={activeContent.timeline7Days} color="bg-amber-500" />
              <TimelineStep step="NEXT 14 DAYS" desc={activeContent.timeline14Days} color="bg-rose-500" />
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-glass-borderSoft text-center text-text-lo text-[11px] font-mono leading-relaxed">
            * advisories compiled by combining global ENSO models, regional weather, and crop stages for {crop} in {locationName}.
          </div>
        </div>

      </div>
    </div>
  );
}

function AdvisorySpec({ label, val, highlight }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9px] text-text-lo tracking-[.06em] uppercase">{label}</span>
      <span className={clsx(
        "font-display text-[14px] font-semibold text-text-hi",
        highlight && "text-teal-600 font-bold"
      )}>
        {val}
      </span>
    </div>
  );
}

function SubAdvisoryCard({ icon, title, desc, type }) {
  return (
    <div className="glass-panel p-5 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="w-[32px] h-[32px] rounded-lg bg-[rgba(139,124,246,0.18)] text-violet-500 flex items-center justify-center">
          {icon}
        </div>
        <span className="font-mono text-[9px] tracking-[.08em] uppercase text-text-lo">{type}</span>
      </div>
      <div>
        <h4 className="font-display text-[14.5px] font-semibold text-text-hi mb-1">{title}</h4>
        <p className="text-[12.5px] text-text-mid leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TimelineStep({ step, desc, color }) {
  return (
    <div className="flex gap-4 relative z-10">
      <div className={`w-5 h-5 rounded-full ${color} border-4 border-white flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.1)]`}></div>
      <div className="flex flex-col">
        <span className="font-mono text-[9.5px] text-text-lo uppercase tracking-[.08em] leading-none mb-1">{step}</span>
        <span className="font-display text-[13.5px] font-semibold text-text-hi">{desc}</span>
      </div>
    </div>
  );
}
