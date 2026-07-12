# backend/scripts/seed_sample_data.py
import sys
import os
from datetime import date
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import SessionLocal
from app.modules.users.models import Department
from app.modules.categories.models import Category
from app.modules.assets.models import Asset, AssetStatus

def seed():
    db = SessionLocal()
    try:
        # 1. Seed Department: IT
        it_dept = db.query(Department).filter(Department.name == "IT").first()
        if not it_dept:
            it_dept = Department(name="IT", is_active=True)
            db.add(it_dept)
            db.flush()  # Get ID
            print("Seeded department: IT")
        else:
            print("Department 'IT' already exists")

        # 2. Seed Category: Electronics
        elec_cat = db.query(Category).filter(Category.name == "Electronics").first()
        if not elec_cat:
            elec_cat = Category(name="Electronics", description="Laptops, phones, screens and peripherals", warranty_months=36)
            db.add(elec_cat)
            db.flush()  # Get ID
            print("Seeded category: Electronics")
        else:
            print("Category 'Electronics' already exists")

        # 3. Seed Asset: MacBook Air M2
        macbook = db.query(Asset).filter(Asset.name == "MacBook Air M2").first()
        if not macbook:
            macbook = Asset(
                asset_tag="AF-0119",
                name="MacBook Air M2",
                serial_number="SN-MAC-12345",
                category_id=elec_cat.id,
                department_id=it_dept.id,
                status=AssetStatus.ALLOCATED,
                acquisition_date=date.today(),
                acquisition_cost=120000,
                condition="Excellent",
                location="2nd Floor - IT Desk"
            )
            db.add(macbook)
            print("Seeded asset: MacBook Air M2 (Tag: AF-0119)")
        else:
            print("Asset 'MacBook Air M2' already exists")

        db.commit()
        print("SUCCESS: Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print("Error during seeding:", e)
    finally:
        db.close()

if __name__ == "__main__":
    seed()
