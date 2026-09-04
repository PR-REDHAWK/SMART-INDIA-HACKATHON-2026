"""
Crop and Growth Stage Catalog & Agronomic Action Engine.
Defines supported crops, stages, and agronomic risk sensitivity profiles.
Generates tailored advisory actions for 50+ crops across 5 growth stages.
"""

SUPPORTED_CROPS = [
    "Rice", "Wheat", "Maize", "Cotton", "Soybean", "Sugarcane", "Gram",
    "Tur (Pigeon Pea)", "Groundnut", "Mustard", "Bajra", "Jowar", "Potato",
    "Onion", "Barley", "Moong", "Urad", "Ragi", "Sunflower", "Jute"
]

GROWTH_STAGES = [
    "Sowing",
    "Germination / Establishment",
    "Vegetative",
    "Flowering",
    "Grain/Fruit Development",
    "Harvest"
]

def get_crop_category(crop_name: str) -> str:
    c = crop_name.lower()
    if "rice" in c or "paddy" in c:
        return "RICE"
    elif "wheat" in c or "barley" in c:
        return "WHEAT"
    elif "cotton" in c or "jute" in c or "mesta" in c:
        return "FIBER"
    elif "sugarcane" in c:
        return "SUGARCANE"
    elif "soybean" in c or "groundnut" in c or "mustard" in c or "sunflower" in c or "sesamum" in c or "castor" in c or "linseed" in c or "oilseed" in c:
        return "OILSEED"
    elif "gram" in c or "tur" in c or "pulse" in c or "moong" in c or "urad" in c or "arhar" in c or "masoor" in c or "pea" in c:
        return "PULSES"
    elif "maize" in c or "bajra" in c or "jowar" in c or "ragi" in c or "millet" in c or "cereal" in c:
        return "COARSE_GRAINS"
    elif "potato" in c or "onion" in c or "garlic" in c or "chilli" in c or "turmeric" in c or "ginger" in c or "vegetable" in c or "spice" in c:
        return "HORTICULTURE"
    else:
        return "GENERAL"

def generate_crop_stage_action(crop_name: str, stage: str, event_type: str, soil_moisture: float = None) -> tuple[str, list]:
    """
    Generates specific primary action and supporting actions for any crop, stage, and climate event.
    """
    cat = get_crop_category(crop_name)
    s = stage.lower()

    # 1. FALSE ONSET RISK
    if event_type == "FALSE_ONSET":
        if "sow" in s or "establis" in s or "germina" in s:
            primary = f"Avoid relying solely on initial monsoon rain for {crop_name} {stage.lower()}. Delay rain-dependent sowing until sustained moisture settles, or ensure backup irrigation."
            supp = [
                "Keep seeds/nurseries ready but postpone field sowing until rainfall stabilizes",
                "Monitor 7-day soil moisture trend before committing main field sowing"
            ]
        elif "flower" in s or "fruit" in s or "grain" in s:
            primary = f"Initial monsoon rain will be followed by an early dry spell. Prepare life-saving micro-irrigation for {crop_name} at critical {stage.lower()} stage."
            supp = [
                "Construct field bunds to harvest initial rain water in root zone",
                "Apply organic mulch to minimize evaporative soil water loss"
            ]
        else:
            primary = f"Initial rainfall may be followed by a prolonged dry spell. Avoid heavy fertilizer top-dressing on {crop_name} ({stage}) until moisture settles."
            supp = [
                "Prepare protective irrigation facilities",
                "Keep weeding operations minimal to retain soil cover"
            ]
        return primary, supp

    # 2. BREAK SPELL (DRY SPELL) RISK
    elif event_type == "BREAK_SPELL":
        if "sow" in s or "establis" in s:
            if cat == "RICE":
                primary = "Delay rain-dependent Rice transplanting/sowing. Keep paddy nurseries hydrated under light irrigation."
                supp = ["Use wet seedbed method for paddy nursery", "Apply protective shade cover during peak dry hours"]
            elif cat == "WHEAT":
                primary = "Ensure pre-sowing irrigation (Palewa) before sowing Wheat to prevent germination failure in dry soil."
                supp = ["Maintain optimum 3-5 cm sowing depth", "Treat seeds with Trichoderma for root vigor"]
            elif cat == "FIBER":
                primary = "Delay Cotton/Jute sowing until soil moisture reaches 15-20 cm depth, or sow with drip irrigation."
                supp = ["Sow on ridges/furrows to concentrate moisture", "Avoid deep sowing in dry topsoil"]
            elif cat == "SUGARCANE":
                primary = "Apply trash mulching between sugarcane rows to conserve soil moisture during imminent dry spell."
                supp = ["Irrigate alternate furrows to stretch water supply", "Spray 1% Potassium Chloride (KCl) to reduce transpiration"]
            elif cat == "PULSES":
                primary = f"Delay rain-dependent {crop_name} sowing. Seed germination fails rapidly if soil moisture drops below 15%."
                supp = ["Inoculate seeds with Rhizobium culture", "Prepare farm ponds/sprinklers for life-saving irrigation"]
            elif cat == "HORTICULTURE":
                primary = f"Delay planting {crop_name} in open fields. Provide shaded nursery protection and light drip irrigation."
                supp = ["Use anti-transpirant sprays if available", "Apply straw mulch around root zones"]
            else:
                primary = f"Delay rain-dependent {crop_name} sowing if practical due to imminent 14D dry spell."
                supp = ["Prepare supplemental irrigation alternatives", "Keep nursery beds covered and hydrated"]

        elif "flower" in s or "fruit" in s or "grain" in s:
            # CRITICAL FLOWERING STAGE
            if cat == "RICE":
                primary = "CRITICAL STAGE: Maintain 3-5 cm standing water layer in Rice during panicle initiation and flowering to prevent grain sterility."
                supp = ["Execute alternate wetting and drying (AWD) if water supply is constrained", "Refrain from draining fields during flowering"]
            elif cat == "WHEAT":
                primary = "CRITICAL STAGE: Provide booting/flowering stage irrigation for Wheat to protect against drought and terminal heat stress."
                supp = ["Apply light frequent irrigation during grain filling", "Avoid irrigation during strong windy days to prevent lodging"]
            elif cat == "FIBER":
                primary = "CRITICAL STAGE: Provide protective micro-irrigation to Cotton during flowering/boll formation to prevent boll shedding."
                supp = ["Spray 2% DAP or Potassium Nitrate to reduce flower drop", "Maintain weed-free field to eliminate water competition"]
            elif cat == "PULSES":
                primary = f"CRITICAL STAGE: Moisture stress during {crop_name} flowering causes severe flower drop. Provide life-saving irrigation immediately."
                supp = ["Avoid excess nitrogen; apply foliar spray of 2% urea or 1% KNO3", "Monitor for pod borer pest buildup under dry heat"]
            elif cat == "OILSEED":
                primary = f"CRITICAL STAGE: Provide protective irrigation for {crop_name} during pegging/flowering to ensure optimum seed development."
                supp = ["Maintain soil moisture at root depth", "Apply gypsum / sulphur inputs if soil is dry"]
            else:
                primary = f"CRITICAL STAGE: Provide protective irrigation for {crop_name} ({stage}) to prevent flower drop and yield loss."
                supp = ["Monitor soil moisture daily", "Apply organic mulch to conserve root-zone moisture"]

        elif "harvest" in s:
            primary = f"Weather conditions are dry and favorable for harvesting. Complete {crop_name} harvesting and threshing early."
            supp = ["Sun-dry harvested grains to safe moisture level (<12%)", "Store produce in moisture-proof bags"]

        else: # VEGETATIVE STAGE
            if soil_moisture is not None and soil_moisture <= 20.0:
                primary = f"Soil moisture is critically low ({soil_moisture:.0f}%). Execute protective irrigation immediately for {crop_name} ({stage})."
            else:
                primary = f"Execute intercultural weeding and shallow hoeing in {crop_name} to create dust mulch and conserve root-zone soil moisture."
            supp = ["Top-dress fertilizer only after irrigation", "Prepare alternate furrow irrigation to save water"]

        return primary, supp

    # 3. HEAVY RAIN THREAT
    elif event_type == "HEAVY_RAIN":
        if "sow" in s or "establis" in s:
            if cat == "RICE":
                primary = "Clear nursery drainage channels. Excess standing water submerges young Rice seedlings and causes root rot."
                supp = ["Drain excess water from seedbeds", "Avoid fresh sowing until heavy rainfall passes"]
            elif cat == "COARSE_GRAINS" or cat == "PULSES":
                primary = f"Sow {crop_name} on raised beds / ridges. Standing water for >24h causes seed rot and germination failure."
                supp = ["Clear field boundary furrows", "Refrain from sowing in low-lying un-drained fields"]
            elif cat == "HORTICULTURE":
                primary = f"Do not plant {crop_name} in flooded fields. Ensure deep drainage furrows to prevent seed tuber rot."
                supp = ["Construct raised mounds for planting", "Spray fungicidal seed treatment before planting"]
            else:
                primary = f"Postpone {crop_name} sowing until heavy rainfall passes. Check and clear field drainage systems."
                supp = ["Ensure drainage channels are clear of debris", "Protect seed stocks in dry elevated storage"]

        elif "flower" in s or "fruit" in s or "grain" in s or "vegetat" in s:
            if cat == "FIBER":
                primary = "Clear Cotton field furrows immediately. Waterlogging for >48 hours causes root hypoxia and fungal wilt."
                supp = ["Inspect for sucking pest outbreaks after rain", "Avoid spraying pesticides during rain spells"]
            elif cat == "SUGARCANE":
                primary = "Tie up Sugarcane stalks (propping) to prevent crop lodging under heavy rain and strong winds."
                supp = ["Clear main drainage canals", "Drain standing water to prevent root rot"]
            elif cat == "PULSES" or cat == "COARSE_GRAINS":
                primary = f"Ensure rapid surface drainage for {crop_name} ({stage}). Excess soil moisture triggers wilt and phytophthora rot."
                supp = ["Refrain from applying fertilizer during heavy rain", "Spray systemic fungicide after rain clears"]
            elif cat == "HORTICULTURE":
                primary = f"Drain standing water immediately from {crop_name} fields to prevent soft rot and fungal blight outbreaks."
                supp = ["Apply drenching of Copper Oxychloride after drainage", "Keep raised beds free of stagnant water"]
            else:
                primary = f"Check and clear field drainage channels for {crop_name} ({stage}) to prevent waterlogging and crop damage."
                supp = ["Ensure field runoff flows freely into main drains", "Refrain from all field irrigation"]

        elif "harvest" in s:
            primary = f"Postpone {crop_name} harvesting until rain clears. Cover harvested crop bundles in field with heavy tarpaulins."
            supp = ["Move harvested produce to raised covered sheds", "Drain threshing yards to prevent grain molding and sprouting"]

        else:
            primary = f"Inspect field drainage furrows for {crop_name} ({stage}) to prevent waterlogging."
            supp = ["Keep main drainage outlets open", "Avoid fertilizer application during heavy rain"]

        return primary, supp

    # 4. MONSOON ONSET (FAVORABLE RAIN)
    elif event_type == "MONSOON_ONSET":
        if "sow" in s or "establis" in s:
            primary = f"🟢 Favorable Monsoon Onset: Prepare land and seed stocks for {crop_name} {stage.lower()} as soil moisture conditions settle."
            supp = ["Finalize seed treatment with bio-fertilizers", "Ensure seedbed is well-pulverized and moist"]
        else:
            primary = f"🟢 Favorable Monsoon Onset: Apply recommended top-dressing nitrogen fertilizer for {crop_name} ({stage}) as soil moisture is optimum."
            supp = ["Perform intercultural weeding to eliminate nutrient competition", "Maintain optimum field bunding"]

        return primary, supp

    # 5. ROUTINE WEATHER
    else:
        primary = f"Continue standard field practices and routine weather monitoring for {crop_name} ({stage})."
        supp = ["Maintain routine field inspections", "Monitor weekly rainfall updates"]
        return primary, supp
