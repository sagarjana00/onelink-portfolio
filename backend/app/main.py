from fastapi import FastAPI
from sqlalchemy import text

from app.db.database import engine, get_db
from app.api import auth, users, projects, portfolio, resume

# Import models AFTER database setup to create tables
import app.models.user
import app.models.project

app = FastAPI(
    title="OneLink Portfolio API",
    description="Portfolio builder using GitHub data",
    version="0.1.0"
)

# Create tables on startup
@app.on_event("startup")
async def startup():
    # Create tables if they don't exist
    with engine.connect() as connection:
        connection.execute(text("PRAGMA foreign_keys=ON"))
        connection.commit()

# Include API routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
app.include_router(resume.router, prefix="/resume", tags=["resume"])

@app.get("/")
async def read_root():
    return {"message": "OneLink Portfolio API ✅"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}