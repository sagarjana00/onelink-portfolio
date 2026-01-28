from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/{username}")
async def get_portfolio(username: str):
    # Temporary public endpoint
    return {
        "username": username,
        "repos": [],
        "message": "Portfolio endpoint ready"
    }