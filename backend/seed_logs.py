from app.db.session import SessionLocal
from app.modules.users.models import User
from app.modules.activity_logs.models import ActivityLog
from datetime import datetime, timedelta

db = SessionLocal()

logs = [
    ActivityLog(user_id=1, action="Laptop AF-0119", details="allocated to Priya Shah, IT dept", created_at=datetime.utcnow() - timedelta(minutes=12)),
    ActivityLog(user_id=1, action="Room B2", details="booking confirmed, 2:00-3:00 PM", created_at=datetime.utcnow() - timedelta(minutes=41)),
    ActivityLog(user_id=1, action="Projector AF-0062", details="maintenance resolved", created_at=datetime.utcnow() - timedelta(hours=1))
]

db.add_all(logs)
db.commit()
print("Seeded activity logs!")
