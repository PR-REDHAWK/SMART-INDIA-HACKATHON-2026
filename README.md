# 🌦️ Monsoon Event Forecasting & Agricultural Advisory System

[![SIH 2026](https://img.shields.io/badge/Hackathon-Smart_India_Hackathon_2026-blue.svg)](https://sih.gov.in)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?logo=vercel)](https://smart-india-hackathon-2026.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?logo=render)](https://monsoon-forcasting.onrender.com)
[![API Docs](https://img.shields.io/badge/API_Docs-Swagger-85EA2D?logo=swagger)](https://monsoon-forcasting.onrender.com/docs)
[![Python](https://img.shields.io/badge/Backend-FastAPI_%2F_Python_3.12-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_%2F_Tailwind_v4-cyan.svg)](https://react.dev)
[![XGBoost](https://img.shields.io/badge/ML-XGBoost_%2F_Isotonic_Calibration-orange.svg)](https://xgboost.readthedocs.io)

An end-to-end, sub-seasonal probabilistic monsoon forecasting platform and deterministic agricultural decision-support engine. Built for the **Smart India Hackathon (SIH 2026)**, this platform empowers Indian farmers, agronomists, and agricultural extension officers (KVKs) to mitigate extreme monsoon climate risks (*Monsoon Onset, Dry Spells/Break Spells, Heavy Rain Events*) through machine learning predictions and growth-stage advisories.

---

## 🌐 Live Deployed Application & API

- **🚀 Web Dashboard (Frontend)**: [smart-india-hackathon-2026.vercel.app](https://smart-india-hackathon-2026.vercel.app)
- **⚡ Backend REST API**: [monsoon-forcasting.onrender.com](https://monsoon-forcasting.onrender.com)
- **📖 Interactive API Documentation**: [monsoon-forcasting.onrender.com/docs](https://monsoon-forcasting.onrender.com/docs)

---

## 🌟 Key System Capabilities

### 1. 📊 Sub-Seasonal Probabilistic Event Forecasting
- **Multi-Horizon Predictions**: Calculates calibrated probabilities for **Monsoon Onset**, **Break Spells (Dry Spells)**, and **Heavy Rain Events** across four lead horizons: **7 Days, 14 Days, 21 Days, and 30 Days**.
- **Meteorological Feature Suite**: Built on 30 validated atmospheric and oceanographic features including rainfall lags, wet/dry streaks, seasonality indicators, and global climate drivers (**ENSO / Niño 3.4, Indian Ocean Dipole (IOD), MJO Phase & Amplitude**).
- **Probability Calibration**: All raw XGBoost model outputs are calibrated using **Isotonic Regression** to produce reliable probability estimates.

### 2. 🌾 Phase 6 Agricultural Advisory Engine
- **50+ Crop Catalog**: Comprehensive advisory coverage across **50+ major Indian crops** (Cereal grains, Pulses, Oilseeds, Commercial crops, Vegetables, Spices, Plantation crops).
- **6 Growth Stages**: Tailored recommendations for **Sowing, Germination/Establishment, Vegetative, Flowering, Grain/Fruit Development, and Harvest**.
- **Priority Hierarchy**: Enforces a 5-tier agronomic rule hierarchy to deliver 1 primary actionable advice and supporting secondary actions.

### 3. ⚠️ False-Onset Risk Protection
- Detects dangerous false-onset scenarios where high early rainfall is immediately followed by a severe dry spell ($\text{Onset}_{14d} \ge 60\%$ AND $\text{Break}_{14d} \ge 50\%$).
- Triggers explicit warning codes (`FALSE_ONSET_WARNING`) to prevent costly premature sowing and seed rot.

### 4. 🇮🇳 100% Location Honesty & District-Level Resolution
- Resolution support across all **28 Indian States** and top agricultural districts (*e.g., Meerut, Lucknow, Wayanad, Mumbai, Jaipur, Patna, Visakhapatnam*).
- Transparent metadata indicators (`is_direct_match` boolean and `location_resolution_note`) notify users when regional model baselines are active (`ℹ️ Regional Baseline`).

### 5. 🗣️ Bilingual UI & Voice Advisory Engine (English & Hindi)
- Seamless real-time language toggling between **English** and **Hindi (हिंदी)** across all dashboard components and advisories.
- Integrated **Text-To-Speech (Audio Reader)** allowing farmers and field officers to listen to audio advisories directly in their native language.

### 6. 🧪 Interactive Scenario Stress-Testing Workbench
- Allows agronomists to simulate custom weather scenarios (**Normal Baseline**, **Heavy Rainfall Alert**, **Dry-Spell / Break-Spell Risk**) to preview dynamic advisory outputs and timeline actions in real-time.

### 7. 📄 Automated 12-Page PDF Report Generator
- Programmatic PDF generation script ([build_pdf_report.py](file:///c:/Users/LENOVO/OneDrive/SMART%20INDIA%20HACKATHON/build_pdf_report.py)) using ReportLab that compiles the full technical architecture, model performance charts (ROC-AUC curves, Brier calibration, Feature importances), rule matrices, and system flowcharts into a publication-ready report.

---

## 🏗 System Architecture

```text
                               ┌───────────────────────────────────────────────┐
                               │  Vercel Frontend (React + Vite + Tailwind v4) │
                               │  https://smart-india-hackathon-2026.vercel.app│
                               └──────────────────────┬────────────────────────┘
                                                      │ HTTPS / JSON API
                                                      ▼
                               ┌───────────────────────────────────────────────┐
                               │  Render Backend Server (FastAPI / Python)     │
                               │  https://monsoon-forcasting.onrender.com     │
                               └──────────────────────┬────────────────────────┘
                                                      │
                                                      ▼
                               ┌───────────────────────────────────────────────┐
                               │       Production Inference Pipeline           │
                               │        [backend/inference_pipeline.py]        │
                               └──────────────┬─────────────────┬──────────────┘
                                              │                 │
                                              ▼                 ▼
                        ┌───────────────────────────┐   ┌───────────────────────────┐
                        │ 12 Frozen XGBoost Models  │   │ Phase 6 Advisory Engine   │
                        │ + Isotonic Calibrators    │   │    [backend/advisory/]    │
                        │  (Onset, Break, Heavy)    │   │  (50+ Crops, 6 Stages)    │
                        └───────────────────────────┘   └───────────────────────────┘
```

---

## 📁 Repository Structure

```text
.
├── backend/
│   ├── main.py                          # FastAPI application server & REST routes
│   ├── inference_pipeline.py            # End-to-end ML prediction & calibration engine
│   ├── test_inference_pipeline.py       # Standalone backend test suite
│   ├── Dockerfile                       # Container deployment definition for Render
│   ├── requirements.txt                 # Backend Python dependencies
│   ├── advisory/                        # Phase 6 Agricultural Advisory Engine
│   │   ├── engine.py                    # Deterministic decision rule engine
│   │   ├── rules.py                     # Priority hierarchy & risk thresholds
│   │   ├── crops.py                     # 50+ crop catalog & stage sensitivity matrix
│   │   └── schemas.py                   # Input/output dataclasses & Pydantic models
│   ├── models/                          # Frozen Phase 3B XGBoost models & Isotonic calibrators
│   └── data/                            # Historical meteorological datasets & climate indices
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                      # Main React application layout & state manager
│   │   ├── components/
│   │   │   ├── dashboard/               # HeroStatus, ForecastOutlook, AdvisoryCard, KPIStrip
│   │   │   └── pages/                   # AdvisoryPage, MethodologyPage, AnalyticsPage
│   │   ├── hooks/                       # Custom hooks (useTextToSpeech, etc.)
│   │   └── i18n/                        # English & Hindi translation dictionaries
│   ├── vercel.json                      # Vercel deployment & API reverse-proxy rules
│   ├── package.json                     # Frontend dependencies
│   └── vite.config.js                   # Vite builder & dev server configuration
│
├── build_pdf_report.py                  # ReportLab automated 12-page PDF builder
├── generate_charts.py                   # Matplotlib chart generator (ROC-AUC, Brier, Rules)
├── Monsoon_Event_Forecasting_System_Comprehensive_Report.pdf  # Project PDF report
├── docker-compose.yml                   # Container composition setup
└── README.md                            # Main project documentation
```

---

## 🚀 Quickstart & Local Execution

### Prerequisites
- **Python 3.10+** (3.11 or 3.12 recommended)
- **Node.js 18+** & **npm**

### Step 1: Clone the Repository
```bash
git clone https://github.com/PR-REDHAWK/SMART-INDIA-HACKATHON-2026.git
cd SMART-INDIA-HACKATHON-2026
```

### Step 2: Set Up & Launch FastAPI Backend
```bash
cd backend

# Create & activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt

# Run backend unit test suite
python test_inference_pipeline.py

# Launch FastAPI development server
python -m uvicorn main:app --reload --port 8000
```
> ⚡ **Backend API**: `http://127.0.0.1:8000`  
> 📖 **OpenAPI Docs**: `http://127.0.0.1:8000/docs`

### Step 3: Set Up & Launch React Frontend
Open a separate terminal:
```bash
cd frontend

# Install frontend dependencies
npm install

# Launch Vite development server
npm run dev
```
> 🌐 **Frontend Dashboard**: `http://localhost:5173`

---

## 📡 API Endpoint Reference

### `POST /api/v1/forecast/predict`
Executes the full forecasting and decision-support pipeline for a specified location, crop, and growth stage.

#### **Request Body**
```json
{
  "state": "Uttar Pradesh",
  "prediction_date": "2024-06-15",
  "crop_name": "Rice",
  "growth_stage": "Sowing",
  "soil_moisture_pct": 25.0
}
```

#### **Response Body**
```json
{
  "status": "SUCCESS",
  "metadata": {
    "requested_location": "Uttar Pradesh",
    "resolved_state": "Uttar Pradesh",
    "is_direct_match": true,
    "location_resolution_note": "Direct validated Phase 3B model for Uttar Pradesh.",
    "prediction_date": "2024-06-15",
    "model_version": "Phase_3B_Official_Production",
    "advisory_engine_version": "Phase_6_Rule_Engine"
  },
  "probabilities": {
    "onset": { "7d": 6.6, "14d": 30.0, "21d": 41.2, "30d": 86.2 },
    "break_spell": { "7d": 95.5, "14d": 100.0, "21d": 81.9, "30d": 100.0 },
    "heavy_rain": { "7d": 0.0, "14d": 3.4, "21d": 0.7, "30d": 5.5 }
  },
  "advisory": {
    "risk_level": "VERY_HIGH",
    "event_type": "BREAK_SPELL",
    "horizon_days": 7,
    "probability": 95.5,
    "probability_trend": "STABLE",
    "false_onset_risk": false,
    "crop_name": "Rice",
    "growth_stage": "Sowing",
    "title": "🟠 High Dry-Spell Risk",
    "message": "A prolonged dry spell (break spell) is likely (95%) over the next 7 days.",
    "primary_action": "Delay rain-dependent Rice sowing if practical due to imminent dry spell.",
    "supporting_actions": [
      "Prepare supplemental irrigation facilities",
      "Keep nursery beds covered and hydrated"
    ],
    "reasoning": "Break Spell probability (95%) exceeded threshold (60%) at horizon 7D.",
    "advisory_code": "BREAK_SPELL_WARNING"
  }
}
```

---

## 🧪 Model Evaluation & Validation Protocol

The machine learning pipeline underwent rigorous chronological splitting to prevent data leakage:

| Dataset Split | Date Range | Record Count | Purpose |
| :--- | :--- | :--- | :--- |
| **TRAIN** | `2022-01-01` to `2023-12-31` | 6,570 records | Model parameter learning |
| **VALIDATION** | `2024-01-01` to `2024-12-31` | 3,294 records | Threshold tuning & Isotonic probability calibration |
| **TEST (Held-out)** | `2025-01-01` to `2025-12-01` | 3,015 records | Final out-of-sample performance evaluation |

- **Calibration Quality**: Achieved a **Brier Score of 0.042** on held-out test data post Isotonic calibration.
- **ROC-AUC Performance**: High discriminative performance across lead horizons (ROC-AUC > 0.88 for Onset and Break Spells).

---

## 📄 Automated Technical PDF Report

A complete 12-page PDF document detailing the engineering specifications, mathematical formulations, and model evaluations is available in the root directory:
- **File**: `Monsoon_Event_Forecasting_System_Comprehensive_Report.pdf`
- **Rebuild Command**:
  ```bash
  python generate_charts.py
  python build_pdf_report.py
  ```

---

## ⚠️ Agronomic Disclaimer

> **Notice**: The advisories generated by this system are produced by an automated deterministic decision engine based on statistical and machine learning forecasts. They are intended strictly for decision support and must be cross-verified by local Krishi Vigyan Kendra (KVK) extension officers or agronomists prior to field application.

---

## 📜 License & Acknowledgments

- Developed for the **Smart India Hackathon (SIH 2026)**.
- Licensed under the **MIT License**.
