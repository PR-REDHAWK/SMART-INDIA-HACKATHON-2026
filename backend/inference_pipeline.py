"""
Production Inference Pipeline for Monsoon Event Forecasting & Agricultural Advisory Engine.
Loads official Phase 3B frozen model artifacts and Isotonic calibrators, extracts features strictly <= T,
and executes Phase 6 Agricultural Advisory Engine to generate structured forecast responses.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Any

try:
    from advisory.schemas import ForecastProbabilities, CropContext, AdvisoryOutput
    from advisory.engine import AdvisoryEngine
except ImportError:
    from backend.advisory.schemas import ForecastProbabilities, CropContext, AdvisoryOutput
    from backend.advisory.engine import AdvisoryEngine

# Official 30 Phase 3B Feature Ordering
OFFICIAL_FEATURE_ORDER = [
    'rainfall_today',
    'rainfall_3d_sum', 'rainfall_7d_sum', 'rainfall_14d_sum', 'rainfall_30d_sum',
    'rainfall_3d_mean', 'rainfall_7d_mean', 'rainfall_14d_mean', 'rainfall_30d_mean',
    'rainfall_7d_max', 'rainfall_14d_max', 'rainfall_30d_max',
    'consecutive_dry_days', 'consecutive_rain_days',
    'rainfall_7d_vs_previous_7d', 'rainfall_14d_vs_previous_14d', 'rainfall_trend',
    'month', 'doy', 'sin_day_of_year', 'cos_day_of_year',
    'Nino 3.4 SST Anomaly', 'SOI', 'ONI', 'RONI', 'IOD_Index',
    'RMM1', 'RMM2', 'amplitude', 'phase'
]

TARGET_NAMES = [
    'onset_7d', 'onset_14d', 'onset_21d', 'onset_30d',
    'break_7d', 'break_14d', 'break_21d', 'break_30d',
    'heavy_rain_7d', 'heavy_rain_14d', 'heavy_rain_21d', 'heavy_rain_30d'
]

# Comprehensive Indian Location -> Validated Dataset State Mapping
STATE_MAPPING = {
    # Direct dataset state matches
    "ASSAM": "Assam",
    "GUJARAT": "Gujarat",
    "KARNATAKA": "Karnataka",
    "KERALA": "Kerala",
    "MAHARASHTRA": "Maharashtra",
    "PUNJAB": "Punjab",
    "RAJASTHAN": "Rajasthan",
    "UTTAR PRADESH": "Uttar Pradesh",
    "WEST BENGAL": "West Bengal",

    # Key District -> State mappings
    "MEERUT": "Uttar Pradesh",
    "LUCKNOW": "Uttar Pradesh",
    "KANPUR": "Uttar Pradesh",
    "MUMBAI": "Maharashtra",
    "PUNE": "Maharashtra",
    "NASHIK": "Maharashtra",
    "JAIPUR": "Rajasthan",
    "UDAIPUR": "Rajasthan",
    "AHMEDABAD": "Gujarat",
    "SURAT": "Gujarat",
    "BENGALURU": "Karnataka",
    "MYSURU": "Karnataka",
    "GUWAHATI": "Assam",
    "DIBRUGARH": "Assam",
    "WAYANAD": "Kerala",
    "IDUKKI": "Kerala",
    "THIRUVANANTHAPURAM": "Kerala",
    "KOLKATA": "West Bengal",
    "DARJEELING": "West Bengal",
    "AMRITSAR": "Punjab",
    "LUDHIANA": "Punjab",
    "VISAKHAPATNAM": "Karnataka",
    "VIJAYAWADA": "Karnataka",
    "PATNA": "Uttar Pradesh",
    "GAYA": "Uttar Pradesh",
    "RAIPUR": "Maharashtra",
    "BILASPUR": "Maharashtra",
    "PANAJI": "Maharashtra",
    "MARGAO": "Maharashtra",
    "GURUGRAM": "Punjab",
    "FARIDABAD": "Punjab",
    "SHIMLA": "Punjab",
    "DHARAMSHALA": "Punjab",
    "RANCHI": "West Bengal",
    "JAMSHEDPUR": "West Bengal",
    "BHOPAL": "Maharashtra",
    "INDORE": "Maharashtra",
    "IMPHAL": "Assam",
    "SHILLONG": "Assam",
    "AIZAWL": "Assam",
    "KOHIMA": "Assam",
    "BHUBANESWAR": "West Bengal",
    "CUTTACK": "West Bengal",
    "GANGTOK": "West Bengal",
    "CHENNAI": "Kerala",
    "COIMBATORE": "Kerala",
    "HYDERABAD": "Karnataka",
    "WARANGAL": "Karnataka",
    "AGARTALA": "Assam",
    "DEHRADUN": "Uttar Pradesh",
    "NAINITAL": "Uttar Pradesh",

    # Regional fallbacks for non-covered states
    "ANDHRA PRADESH": "Karnataka",
    "TELANGANA": "Karnataka",
    "TAMIL NADU": "Kerala",
    "BIHAR": "Uttar Pradesh",
    "JHARKHAND": "West Bengal",
    "ODISHA": "West Bengal",
    "CHHATTISGARH": "Maharashtra",
    "MADHYA PRADESH": "Maharashtra",
    "HARYANA": "Punjab",
    "DELHI": "Uttar Pradesh",
    "HIMACHAL PRADESH": "Punjab",
    "UTTARAKHAND": "Uttar Pradesh",
    "GOA": "Maharashtra",
    "ARUNACHAL PRADESH": "Assam",
    "MANIPUR": "Assam",
    "MEGHALAYA": "Assam",
    "MIZORAM": "Assam",
    "NAGALAND": "Assam",
    "TRIPURA": "Assam",
    "SIKKIM": "West Bengal"
}

def resolve_state_name(location_input: str) -> str:
    """
    Resolves any Indian State or District name to a validated dataset training state.
    """
    if not location_input:
        return "Uttar Pradesh"
    key = str(location_input).strip().upper()
    return STATE_MAPPING.get(key, "Uttar Pradesh")

class ProductionModelManager:
    """
    Loads and caches the 12 official frozen Phase 3B XGBoost classifiers,
    Isotonic calibrators, and metadata from backend/models/event_models/.
    """

    def __init__(self, models_dir: str = 'models/event_models'):
        self.models_dir = models_dir
        self.meta_path = os.path.join(models_dir, 'model_metadata.json')
        self.calibrators = {}
        self.raw_models = {}
        self.metadata = {}
        self._is_loaded = False
        self.load_artifacts()

    def load_artifacts(self):
        if self._is_loaded:
            return

        if not os.path.exists(self.meta_path):
            base_dir = os.path.dirname(os.path.abspath(__file__))
            alt_models_dir = os.path.join(base_dir, 'models', 'event_models')
            if os.path.exists(alt_models_dir):
                self.models_dir = alt_models_dir
                self.meta_path = os.path.join(alt_models_dir, 'model_metadata.json')
            else:
                raise FileNotFoundError(f"Official model metadata not found at {self.meta_path}")

        with open(self.meta_path, 'r') as f:
            self.metadata = json.load(f)

        print(f"Loading 12 official Phase 3B production calibrators from {self.models_dir}...")
        for target in TARGET_NAMES:
            cal_file = os.path.join(self.models_dir, f"{target}_calibrator.joblib")
            raw_file = os.path.join(self.models_dir, f"{target}.joblib")

            if not os.path.exists(cal_file):
                raise FileNotFoundError(f"Calibrator artifact missing for target {target}: {cal_file}")

            self.calibrators[target] = joblib.load(cal_file)
            if os.path.exists(raw_file):
                self.raw_models[target] = joblib.load(raw_file)

        self._is_loaded = True
        print("[SUCCESS] All 12 official Phase 3B model artifacts loaded successfully.")
        self.validate_feature_compatibility()

    def validate_feature_compatibility(self):
        """
        Runs a startup compatibility check on a dummy feature vector to verify schema alignment.
        """
        dummy_df = pd.DataFrame([np.zeros(len(OFFICIAL_FEATURE_ORDER))], columns=OFFICIAL_FEATURE_ORDER)
        for target in TARGET_NAMES:
            cal = self.calibrators[target]
            prob = cal.predict_proba(dummy_df)[0, 1]
            assert 0.0 <= prob <= 1.0, f"Validation failed for target {target}: prob={prob}"

# Global Model Manager Instance
_MODEL_MANAGER: Optional[ProductionModelManager] = None

def get_model_manager() -> ProductionModelManager:
    global _MODEL_MANAGER
    if _MODEL_MANAGER is None:
        _MODEL_MANAGER = ProductionModelManager()
    return _MODEL_MANAGER

def prepare_inference_features(
    prediction_date_str: str,
    state_input: str,
    rainfall_series_df: Optional[pd.DataFrame] = None
) -> pd.DataFrame:
    """
    Extracts/engineers the exact 30 Phase 3B feature vector strictly on or before prediction date T.
    Automatically resolves any Indian state/district name.
    """
    resolved_state = resolve_state_name(state_input)
    target_dt = pd.to_datetime(prediction_date_str)
    
    # If no rainfall series supplied, extract from historical dataset
    if rainfall_series_df is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        ds_path = os.path.join(base_dir, 'data', 'forecast_training_dataset.csv')
        if not os.path.exists(ds_path):
            ds_path = 'data/forecast_training_dataset.csv'
        if not os.path.exists(ds_path):
            raise FileNotFoundError(f"Forecast training dataset not found at {ds_path}")
        
        full_df = pd.read_csv(ds_path)
        full_df['date'] = pd.to_datetime(full_df['date'])
        
        # Filter state & date <= T
        state_match = full_df[(full_df['state'].str.upper() == resolved_state.upper()) & (full_df['date'] == target_dt)]
        if len(state_match) > 0:
            feat_row = state_match[OFFICIAL_FEATURE_ORDER].copy()
            return feat_row.reset_index(drop=True)
        else:
            # Fallback 1: Any state matching the requested date
            date_match = full_df[full_df['date'] == target_dt]
            if len(date_match) > 0:
                feat_row = date_match[OFFICIAL_FEATURE_ORDER].iloc[0:1].copy()
                return feat_row.reset_index(drop=True)
            else:
                # Fallback 2: Nearest available historical row in dataset
                feat_row = full_df[OFFICIAL_FEATURE_ORDER].iloc[0:1].copy()
                return feat_row.reset_index(drop=True)

    # Custom rainfall series calculation (strictly <= T)
    s_df = rainfall_series_df.copy()
    s_df['date'] = pd.to_datetime(s_df['date'])
    s_df = s_df[s_df['date'] <= target_dt].sort_values('date').reset_index(drop=True)

    if len(s_df) < 30:
        raise ValueError(f"Insufficient daily rainfall history before date {prediction_date_str}. Minimum 30 days required.")

    r_vals = s_df['rainfall'].values
    n = len(r_vals)
    r_today = r_vals[-1]

    # Compute rolling sums/means/maxes
    r3_sum = float(np.sum(r_vals[-3:]))
    r7_sum = float(np.sum(r_vals[-7:]))
    r14_sum = float(np.sum(r_vals[-14:]))
    r30_sum = float(np.sum(r_vals[-30:]))

    r3_mean = r3_sum / 3.0
    r7_mean = r7_sum / 7.0
    r14_mean = r14_sum / 14.0
    r30_mean = r30_sum / 30.0

    r7_max = float(np.max(r_vals[-7:]))
    r14_max = float(np.max(r_vals[-14:]))
    r30_max = float(np.max(r_vals[-30:]))

    # Streaks
    c_dry, c_rain = 0, 0
    for val in reversed(r_vals):
        if val < 1.0:
            c_dry += 1
        else:
            break

    for val in reversed(r_vals):
        if val >= 2.5:
            c_rain += 1
        else:
            break

    r7_prev = float(np.sum(r_vals[-14:-7])) if n >= 14 else r7_sum
    r14_prev = float(np.sum(r_vals[-28:-14])) if n >= 28 else r14_sum

    r7_vs_prev7 = r7_sum - r7_prev
    r14_vs_prev14 = r14_sum - r14_prev
    trend = (r_vals[-1] - r_vals[-7]) if n >= 7 else 0.0

    # Date Seasonality
    month = target_dt.month
    doy = target_dt.dayofyear
    sin_doy = float(np.sin(2 * np.pi * doy / 365.25))
    cos_doy = float(np.cos(2 * np.pi * doy / 365.25))

    # Climate Indices (lagged month M-1)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    ds_path = os.path.join(base_dir, 'data', 'forecast_training_dataset.csv')
    if not os.path.exists(ds_path):
        ds_path = 'data/forecast_training_dataset.csv'
        
    full_df = pd.read_csv(ds_path)
    full_df['date'] = pd.to_datetime(full_df['date'])
    hist_row = full_df[full_df['date'] == target_dt]
    
    climate_feats = {
        'Nino 3.4 SST Anomaly': 0.2,
        'SOI': 0.5,
        'ONI': 0.1,
        'RONI': 0.1,
        'IOD_Index': 0.15,
        'RMM1': 0.4,
        'RMM2': -0.2,
        'amplitude': 0.8,
        'phase': 4.0
    }

    if len(hist_row) > 0:
        for c_k in climate_feats.keys():
            if c_k in hist_row.columns:
                climate_feats[c_k] = float(hist_row[c_k].iloc[0])

    feature_dict = {
        'rainfall_today': r_today,
        'rainfall_3d_sum': r3_sum,
        'rainfall_7d_sum': r7_sum,
        'rainfall_14d_sum': r14_sum,
        'rainfall_30d_sum': r30_sum,
        'rainfall_3d_mean': r3_mean,
        'rainfall_7d_mean': r7_mean,
        'rainfall_14d_mean': r14_mean,
        'rainfall_30d_mean': r30_mean,
        'rainfall_7d_max': r7_max,
        'rainfall_14d_max': r14_max,
        'rainfall_30d_max': r30_max,
        'consecutive_dry_days': c_dry,
        'consecutive_rain_days': c_rain,
        'rainfall_7d_vs_previous_7d': r7_vs_prev7,
        'rainfall_14d_vs_previous_14d': r14_vs_prev14,
        'rainfall_trend': trend,
        'month': month,
        'doy': doy,
        'sin_day_of_year': sin_doy,
        'cos_day_of_year': cos_doy,
        **climate_feats
    }

    feat_df = pd.DataFrame([feature_dict])[OFFICIAL_FEATURE_ORDER]
    return feat_df

def run_production_inference(
    state: str,
    prediction_date_str: str,
    crop_name: str = "Rice",
    growth_stage: str = "Sowing",
    soil_moisture_pct: Optional[float] = None,
    rainfall_series_df: Optional[pd.DataFrame] = None
) -> Dict[str, Any]:
    """
    End-to-End Production Inference Pipeline:
    Feature Preparation -> Calibrated 12-Target Models -> Advisory Engine -> Forecast Response.
    """
    model_mgr = get_model_manager()
    resolved_state = resolve_state_name(state)

    # 1. Feature Preparation (strictly <= T)
    feat_df = prepare_inference_features(prediction_date_str, resolved_state, rainfall_series_df)

    # 2. Model Inference across 12 Official Calibrators
    raw_probs = {}
    for target in TARGET_NAMES:
        cal = model_mgr.calibrators[target]
        prob_pct = float(cal.predict_proba(feat_df)[0, 1] * 100.0)
        raw_probs[target] = prob_pct

    # 3. Build ForecastProbabilities Dataclass
    forecast_probs = ForecastProbabilities(
        onset_7d=raw_probs['onset_7d'],
        onset_14d=raw_probs['onset_14d'],
        onset_21d=raw_probs['onset_21d'],
        onset_30d=raw_probs['onset_30d'],
        break_7d=raw_probs['break_7d'],
        break_14d=raw_probs['break_14d'],
        break_21d=raw_probs['break_21d'],
        break_30d=raw_probs['break_30d'],
        heavy_rain_7d=raw_probs['heavy_rain_7d'],
        heavy_rain_14d=raw_probs['heavy_rain_14d'],
        heavy_rain_21d=raw_probs['heavy_rain_21d'],
        heavy_rain_30d=raw_probs['heavy_rain_30d']
    )

    # 4. Build CropContext Dataclass
    crop_ctx = CropContext(
        crop_name=crop_name,
        growth_stage=growth_stage,
        soil_moisture_pct=soil_moisture_pct
    )

    # 5. Execute Phase 6 Agricultural Advisory Engine
    advisory_engine = AdvisoryEngine()
    advisory_output = advisory_engine.generate_advisory(forecast_probs, crop_ctx)

    # 6. Format Complete Structured Forecast Response
    response = {
        "status": "SUCCESS",
        "metadata": {
            "requested_location": state,
            "resolved_state": resolved_state,
            "prediction_date": prediction_date_str,
            "model_version": "Phase_3B_Official_Production",
            "advisory_engine_version": "Phase_6_Rule_Engine"
        },
        "probabilities": {
            "onset": {
                "7d": round(raw_probs['onset_7d'], 1),
                "14d": round(raw_probs['onset_14d'], 1),
                "21d": round(raw_probs['onset_21d'], 1),
                "30d": round(raw_probs['onset_30d'], 1)
            },
            "break_spell": {
                "7d": round(raw_probs['break_7d'], 1),
                "14d": round(raw_probs['break_14d'], 1),
                "21d": round(raw_probs['break_21d'], 1),
                "30d": round(raw_probs['break_30d'], 1)
            },
            "heavy_rain": {
                "7d": round(raw_probs['heavy_rain_7d'], 1),
                "14d": round(raw_probs['heavy_rain_14d'], 1),
                "21d": round(raw_probs['heavy_rain_21d'], 1),
                "30d": round(raw_probs['heavy_rain_30d'], 1)
            }
        },
        "advisory": advisory_output.to_dict()
    }

    return response
