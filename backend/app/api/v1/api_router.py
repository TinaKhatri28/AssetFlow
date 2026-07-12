from fastapi import APIRouter
from app.modules.departments import routes as departments_routes
from app.modules.categories import routes as categories_routes
from app.modules.auth import routes as auth_routes
from app.modules.users import routes as users_routes
from app.modules.assets import routes as assets_routes
from app.modules.assets import routes as assets_routes
from app.modules.allocations import routes as allocations_routes
from app.modules.bookings import routes as bookings_routes
from app.modules.maintenance import routes as maintenance_routes
from app.modules.audits import routes as audits_routes
from app.modules.transfers import routes as transfers_routes
from app.modules.returns import routes as returns_routes
from app.modules.notifications import routes as notifications_routes
from app.modules.reports import routes as reports_routes
from app.modules.activity_logs import routes as activity_logs_routes


api_router = APIRouter()

api_router.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
api_router.include_router(users_routes.router, prefix="/users", tags=["users"])
api_router.include_router(assets_routes.router, prefix="/assets", tags=["assets"])
api_router.include_router(departments_routes.router, prefix="/departments", tags=["departments"])
api_router.include_router(categories_routes.router, prefix="/categories", tags=["categories"])
api_router.include_router(assets_routes.router, prefix="/assets", tags=["assets"])
api_router.include_router(allocations_routes.router, prefix="/allocations", tags=["allocations"])
from app.modules.dashboard import routes as dashboard_routes
api_router.include_router(bookings_routes.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(maintenance_routes.router, prefix="/maintenance", tags=["maintenance"])
# Add this to the very bottom of the file
api_router.include_router(dashboard_routes.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(audits_routes.router, prefix="/audits", tags=["audits"])
api_router.include_router(transfers_routes.router, prefix="/transfers", tags=["transfers"])
api_router.include_router(returns_routes.router, prefix="/returns", tags=["returns"])
api_router.include_router(notifications_routes.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(reports_routes.router, prefix="/reports", tags=["reports"])
api_router.include_router(activity_logs_routes.router, prefix="/activity_logs", tags=["activity_logs"])