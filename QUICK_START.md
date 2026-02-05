# Quick Start Guide - OneLink Portfolio Backend

## 5-Minute Setup

### Step 1: Clone & Install
```bash
cd /home/rudrabhowmick/backend/fastapi/onelink-portfolio/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name**: OneLink Portfolio
   - **Homepage URL**: http://localhost:8000
   - **Authorization callback URL**: http://localhost:8000/auth/callback
4. Copy **Client ID** and **Client Secret**

### Step 3: Configure Environment

```bash
cd ..
cp .env.example .env

# Edit .env with your GitHub credentials
nano .env
```

Update these values:
```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_OAUTH_REDIRECT_URI=http://localhost:8000/auth/callback
SECRET_KEY=your-super-secret-key-change-this
```

### Step 4: Run Server

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process [12345]
```

### Step 5: Test the API

Open in browser:
- **API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

## Testing OAuth Flow

1. Go to http://localhost:8000/docs
2. Click the green "Authorize" button
3. You'll be redirected to GitHub
4. Log in and click "Authorize"
5. You'll get a JWT token automatically
6. Now all endpoints will work!

---

## Using the API

### 1. Sync GitHub Projects
```bash
curl -X POST http://localhost:8000/projects/sync \
  -H "Authorization: Bearer <your_jwt_token>"
```

### 2. Get Your Profile
```bash
curl http://localhost:8000/users/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

### 3. View Public Portfolio
```bash
curl http://localhost:8000/portfolio/yourusername
```

---

## Database

The database is automatically created at:
```
onelink-portfolio/backend/onelink_portfolio.db
```

To reset database:
```bash
rm backend/onelink_portfolio.db
# Restart server - new database will be created
```

---

## Common Issues

**Issue**: "Invalid GitHub credentials"
- Solution: Double-check Client ID and Secret in .env

**Issue**: "Redirect URI mismatch"
- Solution: Ensure OAuth callback URL in GitHub settings matches .env exactly

**Issue**: "Port 8000 already in use"
- Solution: `uvicorn app.main:app --reload --port 8001`

**Issue**: Module not found errors
- Solution: Make sure you ran `pip install -r requirements.txt`

---

## Project Structure

```
onelink-portfolio/
├── backend/
│   ├── app/
│   │   ├── api/          # All endpoints
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Request/response validation
│   │   ├── services/     # Business logic
│   │   ├── core/         # Config & security
│   │   └── db/           # Database setup
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend docs
├── .env.example          # Environment template
├── API_DOCUMENTATION.md  # Complete API reference
├── IMPLEMENTATION_GUIDE.md
└── COMPLETION_SUMMARY.md
```

---

## Key Features

✅ GitHub OAuth login
✅ Auto-sync GitHub projects  
✅ Resume parsing (PDF/DOCX)
✅ Experience, education, skills management
✅ Public portfolio API
✅ Project visibility control
✅ Demo URL detection
✅ Tech stack extraction

---

## API Endpoints

**Auth**:
- `GET /auth/login` - Get OAuth URL
- `GET /auth/callback` - OAuth callback

**Users**:
- `GET /users/me` - Your profile
- `PUT /users/me` - Update profile
- `GET /users/{username}` - Public profile

**Experience/Education/Skills**:
- `POST /users/me/experience` - Add experience
- `GET /users/me/experience` - List experience
- `POST /users/me/education` - Add education
- `GET /users/me/education` - List education
- `POST /users/me/skills` - Add skill
- `GET /users/me/skills` - List skills

**Projects**:
- `POST /projects/sync` - Sync GitHub
- `GET /projects` - List projects
- `GET /projects/{id}` - Get project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

**Resume**:
- `POST /resume/upload` - Upload resume
- `GET /resume/text` - Get resume

**Portfolio**:
- `GET /portfolio/{username}` - Public portfolio

---

## Frontend Integration

### Get OAuth URL
```javascript
const response = await fetch('http://localhost:8000/auth/login');
const { authorization_url } = await response.json();
window.location.href = authorization_url;
```

### After OAuth Callback
```javascript
const token = localStorage.getItem('access_token');
const headers = {
  'Authorization': `Bearer ${token}`
};

// Fetch user data
const user = await fetch('http://localhost:8000/users/me', { headers });
```

### View Public Portfolio
```javascript
const portfolio = await fetch(
  'http://localhost:8000/portfolio/username'
);
```

---

## Troubleshooting

### Check if server is running
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok","database":"sqlite"}
```

### View database
```bash
sqlite3 backend/onelink_portfolio.db
sqlite> SELECT * FROM users;
```

### Check logs
```bash
# Enable debug logging
uvicorn app.main:app --reload --log-level debug
```

---

## Next Steps

1. ✅ Run the backend
2. ✅ Test OAuth flow
3. ✅ Sync GitHub projects
4. ✅ Build frontend
5. ✅ Deploy to production

---

## Documentation

- **API_DOCUMENTATION.md** - All endpoints with examples
- **IMPLEMENTATION_GUIDE.md** - Architecture & development guide
- **COMPLETION_SUMMARY.md** - Feature overview

---

## Need Help?

1. Check http://localhost:8000/docs - Interactive API explorer
2. Read API_DOCUMENTATION.md
3. Check existing test endpoints in Swagger UI
4. Review code comments

---

**Enjoy building OneLink Portfolio! 🚀**
