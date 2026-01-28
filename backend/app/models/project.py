from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    url = Column(String, nullable=False)
    homepage = Column(String, nullable=True)  # live demo URL
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship(
        "User",
        back_populates="projects"
    )