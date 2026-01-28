from fastapi import APIRouter, File, UploadFile, Depends
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    return {"message": f"Resume {file.filename} uploaded (parsing later)"}