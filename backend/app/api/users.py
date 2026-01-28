from fastapi import APIRouter, Depends

from app.api.deps import get_current_user

router = APIRouter()

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/sync")
async def sync_repos(current_user: dict = Depends(get_current_user)):
    return {"message": "Repos synced (implement later)"}