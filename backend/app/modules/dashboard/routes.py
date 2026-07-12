from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

# Import the Asset and AssetStatus models so we can count them!
from app.modules.assets.models import Asset, AssetStatus

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Fetch live statistics for the frontend dashboard."""
    
    # 1. Count Total Assets in the database
    total_assets = db.query(Asset).count()
    
    # 2. Count only the assets that are currently ALLOCATED
    allocated_assets = db.query(Asset).filter(Asset.status == AssetStatus.ALLOCATED).count()
    
    # 3. Return the JSON structure the React frontend is expecting
    return {
        "total_assets": total_assets,
        "allocated_assets": allocated_assets,
        
        # Since we skipped Phase 5 for now, we safely return 0 to prevent UI errors
        "maintenance_assets": 0, 
        "active_bookings": 0
    }