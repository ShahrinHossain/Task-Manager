from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.routes import auth_routes, routes, admin_routes

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(routes.router)
app.include_router(auth_routes.router)
app.include_router(admin_routes.router)