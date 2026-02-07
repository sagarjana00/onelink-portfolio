import httpx
import re
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.core.config import settings


class GitHubService:
    """Service for GitHub API interactions"""
    
    BASE_URL = "https://api.github.com"
    HEADERS = {"Accept": "application/vnd.github.v3+json"}
    
    def __init__(self):
        self.client_id = settings.GITHUB_CLIENT_ID
        self.client_secret = settings.GITHUB_CLIENT_SECRET
    
    async def get_oauth_url(self, state: str) -> str:
        """Get GitHub OAuth authorization URL"""
        return (
            f"https://github.com/login/oauth/authorize?"
            f"client_id={self.client_id}"
            f"&redirect_uri={settings.GITHUB_OAUTH_REDIRECT_URI}"
            f"&state={state}"
            f"&scope=user:email,public_repo,repo"
        )
    
    async def exchange_code_for_token(self, code: str) -> Optional[Dict[str, Any]]:
        """Exchange GitHub OAuth code for access token"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://github.com/login/oauth/access_token",
                    data={
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                        "code": code,
                    },
                    headers={"Accept": "application/json"},
                    timeout=10.0,
                )
                
                if response.status_code == 200:
                    return response.json()
                return None
        except Exception as e:
            print(f"Error exchanging code for token: {e}")
            return None
    
    async def get_user_profile(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Fetch user profile from GitHub"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {**self.HEADERS, "Authorization": f"token {access_token}"}
                response = await client.get(
                    f"{self.BASE_URL}/user",
                    headers=headers,
                    timeout=10.0,
                )
                
                if response.status_code == 200:
                    return response.json()
                return None
        except Exception as e:
            print(f"Error fetching user profile: {e}")
            return None
    
    async def get_user_repos(self, access_token: str, username: str) -> List[Dict[str, Any]]:
        """Fetch all public repositories for a user"""
        try:
            repos = []
            page = 1
            per_page = 100
            
            async with httpx.AsyncClient() as client:
                headers = {**self.HEADERS, "Authorization": f"token {access_token}"}
                
                while True:
                    response = await client.get(
                        f"{self.BASE_URL}/users/{username}/repos",
                        headers=headers,
                        params={"page": page, "per_page": per_page, "sort": "updated"},
                        timeout=10.0,
                    )
                    
                    if response.status_code != 200:
                        break
                    
                    data = response.json()
                    if not data:
                        break
                    
                    repos.extend(data)
                    page += 1
                    
                    # Rate limit: stop after fetching enough repos
                    if len(repos) > 500:
                        break
            
            # Filter out forked and archived repos
            filtered_repos = [
                repo for repo in repos
                if not repo.get("fork", False) and not repo.get("archived", False)
            ]
            
            return filtered_repos
        except Exception as e:
            print(f"Error fetching repositories: {e}")
            return []
    
    async def get_repo_languages(self, access_token: str, owner: str, repo: str) -> Dict[str, int]:
        """Fetch programming languages distribution for a repository"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {**self.HEADERS, "Authorization": f"token {access_token}"}
                response = await client.get(
                    f"{self.BASE_URL}/repos/{owner}/{repo}/languages",
                    headers=headers,
                    timeout=10.0,
                )
                
                if response.status_code == 200:
                    return response.json()
                return {}
        except Exception as e:
            print(f"Error fetching repository languages: {e}")
            return {}
    
    async def get_readme_content(self, access_token: str, owner: str, repo: str) -> Optional[str]:
        """Fetch README content from a repository"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {**self.HEADERS, "Authorization": f"token {access_token}"}
                response = await client.get(
                    f"{self.BASE_URL}/repos/{owner}/{repo}/readme",
                    headers=headers,
                    timeout=10.0,
                )
                
                if response.status_code == 200:
                    # GitHub returns base64 encoded content
                    import base64
                    content = response.json().get("content", "")
                    return base64.b64decode(content).decode("utf-8", errors="ignore")
                return None
        except Exception as e:
            print(f"Error fetching README: {e}")
            return None
    
    @staticmethod
    def detect_demo_url(homepage: Optional[str], readme: Optional[str]) -> Optional[str]:
        """Detect live demo URL from homepage or README"""
        # Common deployment platforms
        demo_patterns = [
            r"https?://.+\.vercel\.app",
            r"https?://.+\.netlify\.app",
            r"https?://.+\.herokuapp\.com",
            r"https?://.+\.render\.com",
            r"https?://.+\.github\.io",
            r"https?://.+\.surge\.sh",
        ]
        
        # Check homepage first
        if homepage:
            for pattern in demo_patterns:
                if re.search(pattern, homepage, re.IGNORECASE):
                    return homepage
        
        # Check README for demo links
        if readme:
            for pattern in demo_patterns:
                match = re.search(pattern, readme, re.IGNORECASE)
                if match:
                    return match.group(0)
            
            # Also check for "demo" or "live" links
            demo_links = re.findall(
                r"\[.*?(demo|live|preview).*?\]\((https?://[^\)]+)\)",
                readme,
                re.IGNORECASE
            )
            if demo_links:
                return demo_links[0][1]
        
        return None
    
    @staticmethod
    def classify_project(deployed_url: Optional[str], has_homepage: bool, description: Optional[str]) -> str:
        """Classify project status"""
        # Only mark as deployed when a real demo URL is detected
        if deployed_url:
            return "deployed"
        
        if description and any(
            keyword in description.lower()
            for keyword in ["wip", "work in progress", "in progress", "todo", "experimental"]
        ):
            return "in_progress"
        
        return "code_only"


# Global instance
github_service = GitHubService()
