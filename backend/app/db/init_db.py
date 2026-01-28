from sqlalchemy import text

from app.db.database import engine, Base


def init_db():
    """
    Create all tables defined in models (when Base.metadata.create_all is called).
    Safe to call multiple times — only creates missing tables.
    """
    # Optional: enable foreign key support (good practice with SQLite)
    with engine.connect() as connection:
        connection.execute(text("PRAGMA foreign_keys = ON;"))
        connection.commit()

    # Create tables (will be no-op if they already exist)
    Base.metadata.create_all(bind=engine)


# Optional: function to drop everything (useful in development/testing)
def drop_db():
    Base.metadata.drop_all(bind=engine)