import React, { useState } from "react";
import { TriangleAlert, Sprout, Wind, Droplet, ShieldAlert, CheckCircle2, Volume2, VolumeX, Filter } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../../context/LanguageContext";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";

export default function AdvisoryCard({ liveForecast }) {
  const { language, t } = useLanguage();
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const adv = liveForecast?.advisory;
  const meta = liveForecast?.metadata;

  // Interactive Crop & Stage Filter States
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [selectedStage, setSelectedStage] = useState("Sowing");

  const code = adv?.advisory_code || "BREAK_SPELL_WARNING";
  const rawTitle = adv?.title || "Delay sowing by 3–4 days";
  const rawPrimaryAction = adv?.primary_action || "A possible dry spell may follow expected rainfall. Delay rain-dependent sowing until sustained moisture settles.";
  
  // Crop & Stage specific advice lookup
  const cropStageKey = `adv_${selectedCrop.toLowerCase()}_${selectedStage.toLowerCase()}`;
  const customCropAction = t(cropStageKey, null);

  // Translate advisory title and action
  const title = t(`code_${code}_title`, rawTitle);
  const primaryAction = customCropAction || t(`code_${code}_action`, rawPrimaryAction);

  const supportingActions = [
    t("adv_action_1", "Prepare supplemental irrigation alternatives"),
    t("adv_action_2", "Keep nursery beds covered and hydrated")
  ];

  const cropName = t(`crop_${selectedCrop.toLowerCase()}`, selectedCrop);
  const stage = t(`stage_${selectedStage.toLowerCase()}`, selectedStage);

  const riskLevel = adv?.risk_level || "HIGH";
  const isFalseOnset = adv?.false_onset_risk || false;
  const isDirectMatch = meta?.is_direct_match ?? true;
  const resolvedState = meta?.resolved_state ?? "Uttar Pradesh";

  // Translate Risk Badge
  const translatedRiskLevel = t(`risk_${riskLevel.toLowerCase()}`, `${riskLevel} RISK`);

  const handlePlayAdvisory = () => {
    if (isSpeaking) {
      stop();
      return;
    }
    const textToSpeak = `${title}. ${primaryAction}`;
    speak(textToSpeak, language);
  };

  return (
    <div className="glass-panel p-[24px] relative overflow-hidden bg-gradient-to-br from-[rgba(245,158,11,0.05)] to-transparent flex flex-col justify-between h-full">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none"></div>

      <div>
        {/* Header Row & Controls */}
        <div className="font-mono text-[10.5px] tracking-[.14em] uppercase text-amber-600 font-semibold mb-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {isFalseOnset ? <ShieldAlert size={14} className="text-rose-500" /> : <TriangleAlert size={14} />}
            <span>{t("advisory_phase6_title", "Phase 6 Agricultural Advisory")}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Readout Button */}
            <button
              onClick={handlePlayAdvisory}
              className={clsx(
                "px-2.5 py-1 rounded-full text-[10.5px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all duration-200 border",
                isSpeaking 
                  ? "bg-rose-500/20 text-rose-600 border-rose-500/30 animate-pulse" 
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:scale-105 active:scale-95"
              )}
              title={isSpeaking ? t("stop_voice", "Stop Audio") : t("listen_advisory", "Listen to Advisory")}
            >
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} className="animate-bounce" />}
              <span>{isSpeaking ? t("stop_voice", "Stop") : t("listen_advisory", "Listen")}</span>
            </button>

            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              riskLevel === 'HIGH' || riskLevel === 'VERY_HIGH' ? 'bg-rose-500/20 text-rose-600' : 'bg-amber-500/20 text-amber-600'
            }`}>
              {translatedRiskLevel}
            </span>
          </div>
        </div>

        {/* Interactive Crop & Stage Pill Selectors */}
        <div className="flex flex-col gap-2 mb-4 p-2.5 rounded-xl bg-glass-fill2 border border-glass-borderSoft">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-text-lo uppercase flex items-center gap-1">
              <Filter size={11} className="text-amber-500" /> {t("select_crop_label", "Crop:")}
            </span>
            {["Rice", "Maize", "Cotton", "Soybean"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={clsx(
                  "font-mono text-[10px] px-2.5 py-0.5 rounded-full border cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95",
                  selectedCrop === c 
                    ? "bg-teal-500 text-white border-transparent font-semibold shadow-sm" 
                    : "bg-glass-fill border-glass-borderSoft text-text-mid hover:text-text-hi"
                )}
              >
                {t(`crop_${c.toLowerCase()}`, c)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-text-lo uppercase flex items-center gap-1">
              <Sprout size={11} className="text-teal-500" /> {t("select_stage_label", "Stage:")}
            </span>
            {["Sowing", "Vegetative", "Flowering"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStage(s)}
                className={clsx(
                  "font-mono text-[10px] px-2.5 py-0.5 rounded-full border cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95",
                  selectedStage === s 
                    ? "bg-violet-500 text-white border-transparent font-semibold shadow-sm" 
                    : "bg-glass-fill border-glass-borderSoft text-text-mid hover:text-text-hi"
                )}
              >
                {t(`stage_${s.toLowerCase()}`, s)}
              </button>
            ))}
          </div>
        </div>

        {/* Title & Dynamic Action Recommendation */}
        <h2 className="font-display text-[19px] font-bold text-text-hi mb-2 leading-tight uppercase animate-fadeIn" key={`title-${selectedCrop}-${selectedStage}`}>
          {title}
        </h2>
        
        <p className="text-[13.5px] text-text-mid leading-relaxed mb-4 max-w-xl animate-fadeIn" key={`action-${selectedCrop}-${selectedStage}`}>
          {primaryAction}
        </p>

        {supportingActions.length > 0 && (
          <div className="mb-5 space-y-1.5">
            {supportingActions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[12.5px] text-text-mid font-sans">
                <CheckCircle2 size={13} className="text-teal-500 shrink-0" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Specs */}
      <div className="flex flex-wrap gap-5 border-t border-glass-borderSoft pt-4">
        <div className="flex items-center gap-2 text-[12.5px] text-text-hi font-medium">
          <div className="w-6.5 h-6.5 rounded-lg bg-[rgba(52,214,196,0.18)] text-teal-500 flex items-center justify-center shrink-0">
            <Sprout size={13} />
          </div>
          {cropName} ({stage})
        </div>
        <div className="flex items-center gap-2 text-[12.5px] text-text-hi font-medium">
          <div className="w-6.5 h-6.5 rounded-lg bg-[rgba(139,124,246,0.18)] text-violet-500 flex items-center justify-center shrink-0">
            <Droplet size={13} />
          </div>
          {t("metric_soil_moist", "Soil Moist")}: 25%
        </div>
        <div className="flex items-center gap-2 text-[12.5px] text-text-hi font-medium">
          <div className="w-6.5 h-6.5 rounded-lg bg-[rgba(245,158,11,0.15)] text-amber-600 flex items-center justify-center shrink-0">
            <Wind size={13} />
          </div>
          {isDirectMatch ? t("direct_model", "Direct Phase 3B Model") : `${t("regional_baseline", "Regional Baseline")} (${resolvedState})`}
        </div>
      </div>
    </div>
  );
}
