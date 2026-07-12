# backend/seed_admin.py
from app.db.session import SessionLocal
from app.modules.users.models import User, RoleEnum
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import engine

# Ensure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()
# Check if admin already exists
if not db.query(User).filter(User.email == "admin@assetflow.com").first():
    admin = User(
        email="admin@assetflow.com",
        full_name="System Admin",
        hashed_password=get_password_hash("admin123"),
        role=RoleEnum.ADMIN
    )
    db.add(admin)
    db.commit()
    print("✅ Admin created! Email: admin@assetflow.com | Password: admin123")
else:
    print("Admin already exists!")