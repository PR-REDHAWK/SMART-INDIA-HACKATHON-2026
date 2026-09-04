export const translations = {
  en: {
    // Topbar & Header
    app_title: "Monsoon Intelligence",
    live_model: "Live Model",
    national_overview: "National Advisory Overview",
    select_state: "Select State",
    select_district: "Select District",
    language: "Language",
    
    // Sidebar
    nav_dashboard: "Dashboard",
    nav_map: "Map",
    nav_datasources: "Data Sources",
    nav_model: "Model",
    nav_advisory: "Advisory",
    nav_settings: "Settings",

    // HeroStatus & Badges
    hero_onset_label: "7D Monsoon Onset Probability",
    state_monitor: "State Monitor",
    district_monitor: "District Monitor",
    regional_baseline: "Regional Baseline",
    direct_model: "Direct Validated Model",
    consensus_note: "Phase 3B Calibrated Model Consensus (Date: 2024-06-15)",
    
    // Status Badges
    status_normal: "NORMAL",
    status_watch: "ELEVATED WATCH",
    status_alert: "HIGH ALERT",
    status_false_onset: "FALSE-ONSET ALERT",

    // Metrics
    metric_break_7d: "Break Spell (7D)",
    metric_heavy_7d: "Heavy Rain (7D)",
    metric_soil_moist: "Soil Moist.",
    metric_confidence: "Confidence",

    // KPI Strip
    kpi_onset_label: "14D Monsoon Onset Likelihood",
    kpi_break_label: "14D Break Spell Risk",
    kpi_heavy_label: "14D Heavy Rain Likelihood",
    kpi_confidence_label: "Phase 3B Isotonic Consensus",
    trend_high: "HIGH",
    trend_moderate: "MODERATE",
    trend_elevated_risk: "ELEVATED RISK",
    trend_low_risk: "LOW RISK",
    trend_warning: "WARNING",
    trend_verified: "VERIFIED",

    // ForecastOutlook
    outlook_title: "Monsoon Outlook",
    outlook_subtitle: "Phase 3B Calibrated Probabilities",
    area_onset: "Onset %",
    area_break: "Break Spell %",

    // Advisory Card Header & Tags
    advisory_phase6_title: "Phase 6 Agricultural Advisory",
    risk_high: "HIGH RISK",
    risk_very_high: "VERY HIGH RISK",
    risk_moderate: "MODERATE RISK",
    risk_low: "LOW RISK",

    // Advisory Codes & Fallbacks
    advisory_default_title: "Delay sowing by 3–4 days",
    advisory_default_action: "A possible dry spell may follow expected rainfall. Delay rain-dependent sowing until sustained moisture settles.",

    code_FALSE_ONSET_WARNING_title: "⚠️ False-Onset Risk Warning",
    code_FALSE_ONSET_WARNING_action: "Avoid relying solely on initial rainfall for sowing. Delay rain-dependent sowing until sustained moisture settles.",
    code_FALSE_ONSET_WARNING_msg: "Monsoon onset appears likely, but break-spell risk remains high over the next 14 days.",

    code_BREAK_SPELL_WARNING_title: "🟠 High Dry-Spell Risk",
    code_BREAK_SPELL_WARNING_action: "Delay rain-dependent sowing if practical due to imminent dry spell. Prepare supplemental irrigation alternatives.",
    code_BREAK_SPELL_WARNING_msg: "A prolonged dry spell (break spell) is likely over the next 7–14 days.",

    code_HEAVY_RAIN_WARNING_title: "⚡ High Heavy Rainfall Alert",
    code_HEAVY_RAIN_WARNING_action: "Check and clear field drainage systems to prevent waterlogging and crop damage.",
    code_HEAVY_RAIN_WARNING_msg: "Heavy rainfall event probability is high over the next 7-14 days.",

    code_ONSET_FAVORABLE_title: "🟢 Favorable Monsoon Onset Alert",
    code_ONSET_FAVORABLE_action: "Prepare land and seed stocks for sowing as soil moisture conditions settle.",
    code_ONSET_FAVORABLE_msg: "Monsoon onset probability is favorable with low break-spell conflict.",

    code_ROUTINE_MONITORING_title: "ℹ️ Routine Weather Monitoring",
    code_ROUTINE_MONITORING_action: "Continue standard field practices and routine monitoring.",
    code_ROUTINE_MONITORING_msg: "No immediate extreme weather risk detected over the next 7–14 days.",

    // Crops & Stages
    crop_rice: "Rice",
    crop_maize: "Maize",
    crop_cotton: "Cotton",
    crop_soybean: "Soybean",
    stage_sowing: "Sowing",
    stage_establishment: "Establishment",
    stage_vegetative: "Vegetative",
    stage_flowering: "Flowering",

    // Advisory Feed & Delivery Channels
    feed_title: "Recent Alerts & Advisories",
    channel_title: "Distribution Channels",
    channel_sms: "SMS Gateway",
    channel_whatsapp: "WhatsApp Bot",
    channel_voice: "IVR Voice Broadcast",
    channel_status_active: "Active",

    // Pages
    map_page_title: "Geographic Risk & Spatial Map Overview",
    map_page_desc: "Interactive spatial risk map showing district-level monsoon probabilities.",
    data_page_title: "Climate Data Sources & Meteorological Inputs",
    model_page_title: "Phase 3B Machine Learning Model Architecture",
    advisory_page_title: "Phase 6 Agricultural Advisory System Rules",
    settings_page_title: "System Settings & Configuration"
  },
  hi: {
    // Topbar & Header
    app_title: "मानसून इंटेलिजेंस",
    live_model: "लाइव मॉडल",
    national_overview: "राष्ट्रीय कृषि सलाह अवलोकन",
    select_state: "राज्य चुनें",
    select_district: "जिला चुनें",
    language: "भाषा",

    // Sidebar
    nav_dashboard: "डैशबोर्ड",
    nav_map: "मानचित्र",
    nav_datasources: "डेटा स्रोत",
    nav_model: "मॉडल",
    nav_advisory: "कृषि सलाह",
    nav_settings: "सेटिंग्स",

    // HeroStatus & Badges
    hero_onset_label: "7-दिवसीय मानसून आगमन संभावना",
    state_monitor: "राज्य निगरानी",
    district_monitor: "जिला निगरानी",
    regional_baseline: "क्षेत्रीय बेसलाइन मॉडल",
    direct_model: "प्रत्यक्ष सत्यापित मॉडल",
    consensus_note: "फेज 3B मॉडल सर्वसम्मति (दिनांक: 2024-06-15)",

    // Status Badges
    status_normal: "सामान्य",
    status_watch: "निगरानी",
    status_alert: "उच्च चेतावनी",
    status_false_onset: "झूठे-आगमन की चेतावनी",

    // Metrics
    metric_break_7d: "सूखा काल (7 दिन)",
    metric_heavy_7d: "भारी बारिश (7 दिन)",
    metric_soil_moist: "मृदा नमी",
    metric_confidence: "विश्वसनीयता",

    // KPI Strip
    kpi_onset_label: "14-दिवसीय मानसून आगमन संभावना",
    kpi_break_label: "14-दिवसीय सूखा काल जोखिम",
    kpi_heavy_label: "14-दिवसीय भारी बारिश संभावना",
    kpi_confidence_label: "फेज 3B आइसोटोनिक मॉडल सहमति",
    trend_high: "उच्च",
    trend_moderate: "मध्यम",
    trend_elevated_risk: "गंभीर जोखिम",
    trend_low_risk: "कम जोखिम",
    trend_warning: "चेतावनी",
    trend_verified: "सत्यापित",

    // ForecastOutlook
    outlook_title: "मानसून पूर्वावलोकन",
    outlook_subtitle: "फेज 3B मॉडल पूर्वानुमान संभावनाएं",
    area_onset: "मानसून आगमन %",
    area_break: "सूखा काल (Break) %",

    // Advisory Card Header & Tags
    advisory_phase6_title: "फेज 6 कृषि सलाह प्रणाली",
    risk_high: "उच्च जोखिम",
    risk_very_high: "अत्यधिक उच्च जोखिम",
    risk_moderate: "मध्यम जोखिम",
    risk_low: "कम जोखिम",

    // Advisory Codes & Fallbacks
    advisory_default_title: "बुआई 3-4 दिन टालें",
    advisory_default_action: "संभावित बारिश के बाद सूखा काल आ सकता है। निरंतर नमी बनने तक बारिश पर निर्भर बुआई टालें।",

    code_FALSE_ONSET_WARNING_title: "⚠️ झूठे-आगमन (False-Onset) का जोखिम",
    code_FALSE_ONSET_WARNING_action: "केवल शुरुआती बारिश के आधार पर बुआई से बचें। पर्याप्त और निरंतर नमी बनने तक बारिश-आधारित बुआई टालें।",
    code_FALSE_ONSET_WARNING_msg: "मानसून का आगमन संभावित है, लेकिन अगले 14 दिनों में सूखा काल (Break Spell) का जोखिम भी उच्च है।",

    code_BREAK_SPELL_WARNING_title: "🟠 उच्च सूखा काल (Break-Spell) जोखिम",
    code_BREAK_SPELL_WARNING_action: "सूखा काल के कारण बारिश पर निर्भर बुआई को टालें। पूरक सिंचाई का विकल्प तैयार रखें।",
    code_BREAK_SPELL_WARNING_msg: "अगले 7–14 दिनों में लंबा सूखा काल संभावित है।",

    code_HEAVY_RAIN_WARNING_title: "⚡ भारी बारिश की चेतावनी",
    code_HEAVY_RAIN_WARNING_action: "जलजमाव और फसल क्षति से बचने के लिए खेत में जल निकासी चैनलों की सफाई करें।",
    code_HEAVY_RAIN_WARNING_msg: "अगले 7-14 दिनों में भारी बारिश की उच्च संभावना है।",

    code_ONSET_FAVORABLE_title: "🟢 अनुकूल मानसून आगमन चेतावनी",
    code_ONSET_FAVORABLE_action: "मृदा नमी स्थिर होने के साथ ही बुआई के लिए भूमि और बीज तैयार करें।",
    code_ONSET_FAVORABLE_msg: "मानसून का आगमन अनुकूल है और सूखा काल का जोखिम कम है।",

    code_ROUTINE_MONITORING_title: "ℹ️ नियमित मौसम निगरानी",
    code_ROUTINE_MONITORING_action: "सामान्य कृषि कार्य और नियमित खेत निरीक्षण जारी रखें।",
    code_ROUTINE_MONITORING_msg: "अगले 7-14 दिनों में कोई तात्कालिक गंभीर मौसम जोखिम नहीं है।",

    // Crops & Stages
    crop_rice: "धान / चावल",
    crop_maize: "मक्का",
    crop_cotton: "कपास",
    crop_soybean: "सोयाबीन",
    stage_sowing: "बुआई अवस्था",
    stage_establishment: "अंकुरण अवस्था",
    stage_vegetative: "वानस्पतिक वृद्धि",
    stage_flowering: "पुष्पन अवस्था",

    // Advisory Feed & Delivery Channels
    feed_title: "हाल की चेतावनियां और कृषि सलाह",
    channel_title: "सूचना वितरण माध्यम",
    channel_sms: "एसएमएस गेटवे",
    channel_whatsapp: "व्हाट्सएप बॉट",
    channel_voice: "आईवीआर वॉइस कॉल",
    channel_status_active: "सक्रिय",

    // Pages
    map_page_title: "भौगोलिक जोखिम और स्थानिक मानचित्र अवलोकन",
    map_page_desc: "जिला-स्तरीय मानसून संभावनाओं को दर्शाने वाला इंटरैक्टिव मानचित्र।",
    data_page_title: "जलवायु डेटा स्रोत और मौसम विज्ञान इनपुट",
    model_page_title: "फेज 3B मशीन लर्निंग मॉडल आर्किटेक्चर",
    advisory_page_title: "फेज 6 कृषि सलाह नियम प्रणाली",
    settings_page_title: "सिस्टम सेटिंग्स और कॉन्फ़िगरेशन"
  }
};
