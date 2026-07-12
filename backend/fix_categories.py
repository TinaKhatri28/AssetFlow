from app.db.session import SessionLocal
from app.modules.categories.models import Category
from app.modules.assets.models import Asset
from app.modules.users.models import Department, User
from app.modules.bookings.models import Booking
from app.modules.allocations.models import Allocation
from app.modules.transfers.models import TransferRequest
from app.modules.returns.models import ReturnRecord
from app.modules.maintenance.models import MaintenanceRecord
from app.modules.activity_logs.models import ActivityLog
import random

db = SessionLocal()

# Ensure categories exist
new_cats = ["Audio Visual", "Hardware", "Furniture", "Network Equipment"]
for nc in new_cats:
    if not db.query(Category).filter(Category.name == nc).first():
        db.add(Category(name=nc, description=nc))
db.commit()

cats = db.query(Category).all()
cat_map = {c.name: c.id for c in cats}

assets = db.query(Asset).all()
for a in assets:
    name_lower = a.name.lower()
    if "laptop" in name_lower or "macbook" in name_lower or "thinkpad" in name_lower:
        a.category_id = cat_map.get("Laptops", 1)
    elif "monitor" in name_lower or "display" in name_lower:
        a.category_id = cat_map.get("Monitors", 1)
    elif "van" in name_lower or "car" in name_lower or "innova" in name_lower:
        a.category_id = cat_map.get("Vehicles", 1)
    elif "projector" in name_lower or "camera" in name_lower or "speaker" in name_lower:
        a.category_id = cat_map["Audio Visual"]
    elif "chair" in name_lower or "desk" in name_lower or "table" in name_lower:
        a.category_id = cat_map["Furniture"]
    elif "router" in name_lower or "switch" in name_lower:
        a.category_id = cat_map["Network Equipment"]
    else:
        # random assign to Hardware or Electronics
        a.category_id = random.choice([cat_map["Hardware"], cat_map["Electronics"]])

db.commit()
print("Assets reassigned to new categories!")
