from fastapi import APIRouter
from app.modules.departments import routes as departments_routes
from app.modules.categories import routes as categories_routes
from app.modules.auth import routes as auth_routes
from app.modules.users import routes as users_routes
from app.modules.assets import routes as assets_routes

api_router = APIRouter()

api_router.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
api_router.include_router(users_routes.router, prefix="/users", tags=["users"])
api_router.include_router(assets_routes.router, prefix="/assets", tags=["assets"])
api_router.include_router(departments_routes.router, prefix="/departments", tags=["departments"])
api_router.include_router(categories_routes.router, prefix="/categories", tags=["categories"])
