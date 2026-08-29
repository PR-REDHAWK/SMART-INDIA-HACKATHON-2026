from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.domain import Region, Forecast, Advisory
from app.schemas.domain import RegionResponse, RegionDetailResponse, ForecastResponse, AdvisoryResponse

router = APIRouter()

@router.get("/regions", response_model=List[RegionResponse])
def get_all_regions(db: Session = Depends(get_db)):
    """Fetch all geographic regions (States, Districts, etc.)"""
    return db.query(Region).all()

@router.get("/regions/{region_id}", response_model=RegionDetailResponse)
def get_region_details(region_id: int, db: Session = Depends(get_db)):
    """Fetch a specific region along with its forecasts and advisories"""
    region = db.query(Region).filter(Region.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return region

@router.get("/forecast/map", response_model=List[ForecastResponse])
def get_map_forecasts(db: Session = Depends(get_db)):
    """Fetch the latest forecasts for all regions to populate the Map pins"""
    # In a real app, you'd filter by the latest date. For MVP, we return all.
    return db.query(Forecast).all()

@router.get("/advisories", response_model=List[AdvisoryResponse])
def get_active_advisories(db: Session = Depends(get_db)):
    """Fetch all active advisories, sorted by newest first"""
    return db.query(Advisory).order_by(Advisory.created_at.desc()).all()
