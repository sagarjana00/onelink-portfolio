from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ExperienceBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    is_current: bool = False


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(ExperienceBase):
    pass


class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EducationBase(BaseModel):
    school: str
    degree: Optional[str] = ""
    field_of_study: Optional[str] = None
    description: Optional[str] = None
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: Optional[datetime] = None
    is_current: bool = False


class EducationCreate(EducationBase):
    pass


class EducationUpdate(EducationBase):
    pass


class EducationResponse(EducationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SkillBase(BaseModel):
    name: str
    proficiency: Optional[str] = None  # beginner, intermediate, expert
    category: Optional[str] = None


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    pass


class SkillResponse(SkillBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ResumeParseResponse(BaseModel):
    """Parsed resume data for user review"""
    experiences: List[ExperienceResponse] = []
    education: List[EducationResponse] = []
    skills: List[SkillResponse] = []
    raw_text: str


class ResumeUploadResponse(BaseModel):
    message: str
    parsed_data: Optional[ResumeParseResponse] = None
