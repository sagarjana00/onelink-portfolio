from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    access_token = Column(String, nullable=True)
    resume_text = Column(String, nullable=True)

    # ── Back-reference to projects ───────────────────────────────
    projects = relationship(
        "Project",
        back_populates="user",
        lazy="dynamic",           # or "select" / "joined" depending on your needs
        cascade="all, delete-orphan"
    )