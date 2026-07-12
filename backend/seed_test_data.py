import sys
import random
import string
from datetime import datetime, timedelta

from app.db.session import SessionLocal
from app.modules.users.models import User, RoleEnum, Department
from app.modules.categories.models import Category as AssetCategory
from app.modules.assets.models import Asset, AssetStatus
from app.modules.assets import service as asset_service
from app.modules.allocations.models import Allocation
from app.core.security import get_password_hash

def generate_serial():
    return "SN-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))

def seed_data():
    db = SessionLocal()
    try:
        print("Starting massive seed process...")

        # 1. Create Admin User (if doesn't exist)
        admin = db.query(User).filter(User.email == "admin@assetflow.com").first()
        if not admin:
            admin = User(
                email="admin@assetflow.com",
                hashed_password=get_password_hash("admin123"),
                full_name="System Admin",
                role=RoleEnum.ADMIN
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # 2. Create Departments
        print("Seeding Departments...")
        depts = ["IT", "HR", "Engineering", "Marketing"]
        db_depts = []
        for d in depts:
            dept = db.query(Department).filter(Department.name == d).first()
            if not dept:
                dept = Department(name=d)
                db.add(dept)
                db.commit()
                db.refresh(dept)
            db_depts.append(dept)

        # 3. Create Additional Users
        print("Seeding Users...")
        user_names = ["Priya Shah", "Rahul Mehta", "Aisha Khan", "David Rao"]
        users = []
        for i, name in enumerate(user_names):
            email = f"{name.split()[0].lower()}@assetflow.com"
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    email=email,
                    hashed_password=get_password_hash("password123"),
                    full_name=name,
                    role=RoleEnum.EMPLOYEE,
                    department_id=db_depts[i % len(db_depts)].id
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            users.append(user)

        # 4. Create Categories
        print("Seeding Categories...")
        cats = [
            ("Laptops", "Work laptops", 36),
            ("Monitors", "External displays", 24),
            ("Vehicles", "Company cars", 60)
        ]
        db_cats = []
        for name, desc, warranty in cats:
            c = db.query(AssetCategory).filter(AssetCategory.name == name).first()
            if not c:
                c = AssetCategory(name=name, description=desc, warranty_months=warranty)
                db.add(c)
                db.commit()
                db.refresh(c)
            db_cats.append(c)

        # 5. Create Assets
        print("Seeding Assets...")
        asset_templates = [
            ("MacBook Pro M3", db_cats[0].id),
            ("ThinkPad X1 Carbon", db_cats[0].id),
            ("Dell XPS 15", db_cats[0].id),
            ("LG 27 inch 4K Monitor", db_cats[1].id),
            ("Dell UltraSharp", db_cats[1].id),
            ("Toyota Innova", db_cats[2].id),
        ]

        assets = []
        for _ in range(15):  # Create 15 random assets
            template = random.choice(asset_templates)
            dept = random.choice(db_depts)
            asset = Asset(
                asset_tag=f"AF-TEMP-{random.randint(10000, 99999)}",
                name=template[0],
                serial_number=generate_serial(),
                category_id=template[1],
                department_id=dept.id,
                acquisition_date=datetime.utcnow().date() - timedelta(days=random.randint(10, 300)),
                acquisition_cost=random.randint(500, 3000),
                condition="New",
                location=f"Floor {random.randint(1,4)}",
                status=AssetStatus.AVAILABLE
            )
            db.add(asset)
            db.commit()
            db.refresh(asset)
            
            # Generate the true AF-XXXX tag now that we have the ID
            asset.asset_tag = f"AF-{str(asset.id).zfill(4)}"
            db.commit()
            db.refresh(asset)
            assets.append(asset)

        # 6. Allocate Some Assets
        print("Seeding Allocations...")
        for i in range(7): # Check out 7 assets
            asset = assets[i]
            user = random.choice(users)
            
            # Change status
            asset.status = AssetStatus.ALLOCATED
            
            alloc = Allocation(
                asset_id=asset.id,
                user_id=user.id,
                allocated_by_id=admin.id,
                notes="Assigned for project work",
                is_active=True
            )
            db.add(alloc)
        db.commit()

        # 7. Put 2 assets in maintenance
        assets[8].status = AssetStatus.UNDER_MAINTENANCE
        assets[9].status = AssetStatus.UNDER_MAINTENANCE
        db.commit()

        print("SUCCESS: Massive Seed Complete! Over 20+ records generated successfully!")

    except Exception as e:
        db.rollback()
        print(f"Failed to seed data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
