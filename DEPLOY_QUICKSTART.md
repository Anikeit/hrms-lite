# Quick Deployment Guide

## Prerequisites
- GitHub repository (recommended for easy deployment)
- Accounts on deployment platforms:
  - Backend: Render, Railway, or Heroku
  - Frontend: Vercel or Netlify

## Step 1: Deploy Backend

### Option A: Render (Recommended - Free tier available)

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Create a New Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name**: `hrms-backend` (or your choice)
   - **Environment**: `Python 3`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn hrms.wsgi:application`

5. **Add PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Name it (e.g., `hrms-db`)
   - The `DATABASE_URL` will be automatically set

6. **Set Environment Variables:**
   - `DEBUG` = `False`
   - `SECRET_KEY` = Generate one: `python -c "import secrets; print(secrets.token_urlsafe(50))"`
   - `FRONTEND_URL` = (Set after frontend is deployed, e.g., `https://your-app.vercel.app`)

7. **Deploy** - Render will automatically deploy

### Option B: Railway

1. **Go to [Railway.app](https://railway.app)** and sign up/login
2. **New Project** → **Deploy from GitHub repo**
3. **Add Service** → **GitHub Repo** → Select your repo
4. **Settings:**
   - **Root Directory**: `backend`
   - **Start Command**: `gunicorn hrms.wsgi:application`

5. **Add PostgreSQL:**
   - Click "+ New" → **Database** → **Add PostgreSQL**

6. **Set Environment Variables** (same as Render)

## Step 2: Deploy Frontend

### Option A: Vercel (Recommended - Free tier)

1. **Go to [Vercel.com](https://vercel.com)** and sign up/login
2. **Import Project** from GitHub
3. **Configure:**
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variable:**
   - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com/api` (or your backend URL)

5. **Deploy**

### Option B: Netlify

1. **Go to [Netlify.com](https://netlify.com)** and sign up/login
2. **Add new site** → **Import from Git**
3. **Configure:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Set Environment Variable:**
   - `VITE_API_BASE_URL` = Your backend API URL

5. **Deploy**

## Step 3: Update CORS Settings

After frontend is deployed, update backend environment variable:
- `FRONTEND_URL` = Your frontend URL (e.g., `https://your-app.vercel.app`)

Redeploy backend after updating.

## Step 4: Test Deployment

1. Visit your frontend URL
2. Try creating an employee
3. Try marking attendance
4. Check browser console for any errors

## Quick Commands

### Generate Secret Key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Test Backend Locally:
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### Test Frontend Locally:
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

- **CORS Errors**: Make sure `FRONTEND_URL` matches exactly (including https)
- **Database Errors**: Ensure migrations ran during build
- **Build Fails**: Check Node.js/Python versions match requirements
