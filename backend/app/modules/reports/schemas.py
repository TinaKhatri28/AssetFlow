from pydantic import BaseModel
from typing import List, Optional

class DeptUtilization(BaseModel):
    department: str
    count: int

class MonthlyMaintenance(BaseModel):
    month: str
    count: int

class AssetUsage(BaseModel):
    name: str
    count: str

class IdleAsset(BaseModel):
    name: str
    info: str

class DueMaintenance(BaseModel):
    name: str
    status: str
