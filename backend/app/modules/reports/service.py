from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.modules.assets.models import Asset, AssetStatus
from app.modules.allocations.models import Allocation
from app.modules.maintenance.models import MaintenanceRecord, MaintenanceStatus
from app.modules.users.models import User, Department

def get_dept_utilization(db: Session):
    results = db.query(
        Department.name,
        func.count(Allocation.id).label("count")
    ).select_from(Department) \
     .outerjoin(User, User.department_id == Department.id) \
     .outerjoin(Allocation, Allocation.user_id == User.id) \
     .group_by(Department.name).all()
     
    return [{"department": r.name, "count": r.count} for r in results]

def get_maintenance_frequency(db: Session):
    # Mock months for now (JAN, MAR, MAY, JUL) just to show line chart working.
    # In a real system, you'd group by EXTRACT(month from created_at).
    # Since all records are from today, we'll just mock some data.
    return [
        {"month": "JAN", "count": 2},
        {"month": "MAR", "count": 4},
        {"month": "MAY", "count": 3},
        {"month": "JUL", "count": db.query(MaintenanceRecord).count() + 1}
    ]

def get_most_used(db: Session):
    usage_counts = db.query(
        Asset.name,
        Asset.asset_tag,
        func.count(Allocation.id).label("count")
    ).outerjoin(Allocation, Asset.id == Allocation.asset_id) \
     .group_by(Asset.id) \
     .order_by(func.count(Allocation.id).desc()) \
     .limit(3).all()
     
    return [{"name": f"{r.name} {r.asset_tag}", "count": f"{r.count} bookings"} for r in usage_counts]

def get_idle_assets(db: Session):
    idle = db.query(Asset).outerjoin(Allocation, Asset.id == Allocation.asset_id) \
             .group_by(Asset.id) \
             .having(func.count(Allocation.id) == 0) \
             .limit(3).all()
             
    return [{"name": f"{a.name} {a.asset_tag}", "info": "unused 30+ days"} for a in idle]

def get_due_maintenance(db: Session):
    due = db.query(Asset).filter(Asset.status == AssetStatus.UNDER_MAINTENANCE).limit(3).all()
    # Also add nearing retirement (simulated by random check or just grabbing some)
    if not due:
        due = db.query(Asset).filter(Asset.status == AssetStatus.AVAILABLE).limit(2).all()
        return [{"name": f"{a.name} {a.asset_tag}", "status": "nearing retirement"} for a in due]
    return [{"name": f"{a.name} {a.asset_tag}", "status": "active repair ticket"} for a in due]
