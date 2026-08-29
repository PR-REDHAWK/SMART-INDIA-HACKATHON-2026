from sqlalchemy.orm import Session
from datetime import datetime
from app.models.domain import Region, Forecast, Advisory
from app.services.ml_service import ml_predictor

def seed_initial_data(db: Session):
    """
    Seeds the SQLite database with initial dummy data if it is empty.
    This ensures the frontend has something to render immediately.
    """
    # Check if regions already exist
    if db.query(Region).first() is not None:
        return  # Database is already seeded

    # --- 1. Create Regions Hierarchy ---
    states_data = [
        {"name": "Kerala", "lat": 10.8505, "lng": 76.2711, "districts": [
            {"name": "Wayanad", "lat": 11.6854, "lng": 76.1320},
            {"name": "Idukki", "lat": 9.8500, "lng": 76.9492},
        ]},
        {"name": "Maharashtra", "lat": 19.7515, "lng": 75.7139, "districts": [
            {"name": "Pune", "lat": 18.5204, "lng": 73.8567},
            {"name": "Nashik", "lat": 20.0059, "lng": 73.7900},
        ]},
        {"name": "Assam", "lat": 26.2006, "lng": 92.9376, "districts": [
            {"name": "Guwahati", "lat": 26.1445, "lng": 91.7362},
        ]},
    ]

    for state_info in states_data:
        state = Region(name=state_info["name"], level="State", lat=state_info["lat"], lng=state_info["lng"])
        db.add(state)
        db.commit() # Commit to generate state.id
        db.refresh(state)

        for dist_info in state_info["districts"]:
            district = Region(
                name=dist_info["name"], 
                level="District", 
                parent_id=state.id, 
                lat=dist_info["lat"], 
                lng=dist_info["lng"]
            )
            db.add(district)
    
    db.commit()

    # --- 2. Create Forecasts & Advisories ---
    all_regions = db.query(Region).all()
    for r in all_regions:
        preds = ml_predictor.predict_for_region(r.name)
        
        # Add Forecast
        forecast = Forecast(
            region_id=r.id,
            date=datetime.utcnow(),
            onset_prob=preds["onset_prob"],
            break_spell_risk=preds["break_spell_risk"],
            heavy_rain_prob=preds["heavy_rain_prob"],
            confidence=preds["confidence"]
        )
        db.add(forecast)

        # Add logic-based Advisory if heavy rain is highly probable
        if preds["heavy_rain_prob"] > 0.6:
            adv = Advisory(
                region_id=r.id,
                crop="All Crops",
                advisory_type="ALERT",
                title=f"Heavy Rainfall Warning in {r.name}",
                message=f"High probability ({int(preds['heavy_rain_prob']*100)}%) of extreme rain. Delay sowing and ensure proper drainage."
            )
            db.add(adv)
        elif preds["break_spell_risk"] > 0.5:
            adv = Advisory(
                region_id=r.id,
                crop="Paddy",
                advisory_type="IRRIGATION",
                title=f"Dry Spell Risk in {r.name}",
                message=f"Monsoon break spell likely. Maintain backup irrigation systems for standing crops."
            )
            db.add(adv)

    db.commit()
