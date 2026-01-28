from fastapi import APIRouter

router = APIRouter()

@router.get("/login")
async def login():
    return {"message": "Redirect to GitHub OAuth (implement later)"}

@router.get("/callback")
async def callback():
    return {"message": "GitHub OAuth callback (implement later)"}

@router.post("/token")
async def get_token():
    return {"access_token": "temp-token", "token_type": "bearer"}