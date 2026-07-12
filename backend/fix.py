from app.db.session import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text('ALTER TABLE allocations ADD COLUMN expected_return_date TIMESTAMP WITH TIME ZONE;'))
    conn.commit()
    print("Added expected_return_date column to allocations table!")
