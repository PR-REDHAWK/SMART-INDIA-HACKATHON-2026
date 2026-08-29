import random

class MonsoonMLPredictor:
    """
    Service layer for Machine Learning inferences. 
    In the final product, this class will load the actual XGBoost model 
    and preprocess the incoming IMD/ERA5 data for prediction.
    """
    def __init__(self):
        # e.g., self.model = joblib.load("path/to/xgboost_model.pkl")
        self.is_loaded = True

    def predict_for_region(self, region_name: str) -> dict:
        """
        Generates simulated XGBoost probabilistic outputs for the hackathon MVP.
        """
        # Base logic to make the mock data look somewhat realistic
        base_risk = random.uniform(0.1, 0.4)
        if "Kerala" in region_name or "Assam" in region_name or "Meghalaya" in region_name:
            base_risk += 0.4  # Higher baseline for historically monsoon-heavy states
        elif "Rajasthan" in region_name or "Gujarat" in region_name:
            base_risk -= 0.1  # Lower baseline for drier states
            
        base_risk = max(0.0, min(1.0, base_risk)) # Clamp between 0 and 1

        return {
            "onset_prob": min(1.0, base_risk + random.uniform(0.1, 0.3)),
            "break_spell_risk": random.uniform(0.1, 0.5),
            "heavy_rain_prob": min(1.0, base_risk + random.uniform(0.1, 0.4)),
            "confidence": random.uniform(0.75, 0.95)
        }

# Singleton instance to be imported across the app
ml_predictor = MonsoonMLPredictor()
