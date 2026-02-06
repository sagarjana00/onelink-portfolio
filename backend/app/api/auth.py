import secrets
from datetime import timedelta

from fastapi import APIRouter, Query, Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token
from app.db.database import get_db
from app.models.user import User
from app.services.github_service import github_service

router = APIRouter()

# Temporary in-memory storage for OAuth state (use Redis in production)
oauth_states = {}


@router.get("/login")
async def github_login():
    """
    Initiate GitHub OAuth login flow with state for CSRF protection.
    """
    state = secrets.token_urlsafe(32)
    oauth_states[state] = True  # Store state for validation

    oauth_url = await github_service.get_oauth_url(state)
    return RedirectResponse(url=oauth_url)


@router.get("/callback")
async def github_callback(
    request: Request,
    code: str = Query(...),
    state: str = Query(...),
    db: Session = Depends(get_db),
):

    """
    Handle GitHub OAuth callback:
    - Validate state (CSRF protection)
    - Exchange code for access token
    - Get user profile from GitHub
    - Create or update user
    - Generate JWT
    - Redirect to frontend with token info
    """
    # Validate state parameter (CSRF protection)
    if state not in oauth_states:
        return RedirectResponse("http://localhost:5173/?error=invalid_state")

    # Clean up state
    del oauth_states[state]

    # Exchange code for GitHub access token
    token_response = await github_service.exchange_code_for_token(code)
    if not token_response or "access_token" not in token_response:
        return RedirectResponse("http://localhost:5173/?error=token_failed")

    github_access_token = token_response["access_token"]

    # Fetch GitHub user profile using the access token
    user_profile = await github_service.get_user_profile(github_access_token)
    if not user_profile:
        return RedirectResponse("http://localhost:5173/?error=profile_failed")

    github_id = user_profile["id"]
    github_username = user_profile["login"]

    # Look for existing user by github_id
    user = db.query(User).filter(User.github_id == github_id).first()

    if user:
        # Update existing user
        user.github_access_token = github_access_token
        user.avatar_url = user_profile.get("avatar_url")
        user.profile_url = user_profile.get("html_url")
        user.bio = user_profile.get("bio")
        user.location = user_profile.get("location")
        user.email = user_profile.get("email")
    else:
        # Create new user
        portfolio_username = github_username
        counter = 1
        while db.query(User).filter(User.portfolio_username == portfolio_username).first():
            portfolio_username = f"{github_username}{counter}"
            counter += 1

        user = User(
            github_id=github_id,
            github_username=github_username,
            portfolio_username=portfolio_username,
            github_access_token=github_access_token,
            avatar_url=user_profile.get("avatar_url"),
            profile_url=user_profile.get("html_url"),
            bio=user_profile.get("bio"),
            location=user_profile.get("location"),
            email=user_profile.get("email"),
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    # Generate JWT for your application
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    jwt_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    # Redirect to frontend auth/callback page with token information
    frontend_base = "http://localhost:5173"
    redirect_url = (
        f"{frontend_base}/auth/callback"
        f"?token={jwt_token}"
        f"&user_id={user.id}"
        f"&username={user.portfolio_username}"
    )

    return RedirectResponse(url=redirect_url)


@router.post("/logout")
async def logout():
    """Client-side logout endpoint (just informational)"""
    return {"message": "Logged out successfully. Please clear localStorage on client."}