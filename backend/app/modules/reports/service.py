from sqlalchemy.orm import Session
from sqlalchemy import func
from app.modules.assets.models import Asset, AssetStatus
from app.modules.allocations.models import Allocation
from app.modules.maintenance.models import MaintenanceRecord
from app.modules.categories.models import Category

def get_utilization_trends(db: Session):
    # Simply count allocations per asset to find most used
    usage_counts = db.query(
        Asset.name,
        Asset.asset_tag,
        func.count(Allocation.id).label("total_allocations")
    ).outerjoin(Allocation, Asset.id == Allocation.asset_id) \
     .group_by(Asset.id) \
     .order_by(func.count(Allocation.id).desc()) \
     .limit(10).all()
     
    return [{"asset_tag": row.asset_tag, "name": row.name, "allocations": row.total_allocations} for row in usage_counts]

def get_maintenance_frequency(db: Session):
    # Count maintenance records per category
    freq = db.query(
        Category.name,
        func.count(MaintenanceRecord.id).label("total_repairs")
    ).select_from(Category) \
     .join(Asset, Category.id == Asset.category_id) \
     .join(MaintenanceRecord, Asset.id == MaintenanceRecord.asset_id) \
     .group_by(Category.id) \
     .all()
     
    return [{"category": row.name, "total_repairs": row.total_repairs} for row in freq]
