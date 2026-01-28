from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# SQLite database file will be created in the project root
# (you can change the path if you prefer another location)
DATABASE_URL = f"sqlite:///./{settings.DB_NAME}"

# SQLite-specific connect args (important for thread safety in FastAPI)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},   # required for sqlite + concurrent access
    # echo=True,   # uncomment during development to see SQL queries
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency to be used in routes/endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()