# Deployment Guide

This guide will help you deploy the HRMS Lite application to production.

## Backend Deployment (Render/Railway/Heroku)

### Option 1: Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command**: `cd backend && pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `cd backend && gunicorn hrms.wsgi:application`
   - **Environment**: Python 3

4. **Set Environment Variables:**
   ```
   DEBUG=False
   SECRET_KEY=<generate-a-secure-secret-key>
   DATABASE_URL=<render-provides-this-if-using-postgres>
   FRONTEND_URL=<your-frontend-url>
   ```

5. **Add PostgreSQL Database (Optional but Recommended):**
   - Create a PostgreSQL database on Render
   - The DATABASE_URL will be automatically set

### Option 2: Railway

1. **Create a new project** on Railway
2. **Deploy from GitHub** and select your repository
3. **Set Root Directory** to `backend`
4. **Set Start Command**: `gunicorn hrms.wsgi:application`
5. **Add PostgreSQL** service (optional)
6. **Set Environment Variables** (same as Render)

### Option 3: Heroku

1. **Install Heroku CLI** and login
2. **Create a new app**: `heroku create your-app-name`
3. **Add PostgreSQL**: `heroku addons:create heroku-postgresql:hobby-dev`
4. **Set environment variables**:
   ```bash
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY=<your-secret-key>
   heroku config:set FRONTEND_URL=<your-frontend-url>
   ```
5. **Deploy**: `git push heroku main`

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Login**: `vercel login`
3. **Navigate to frontend**: `cd frontend`
4. **Deploy**: `vercel`
5. **Set Environment Variable**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.com/api`

6. **Redeploy** after setting environment variables

### Option 2: Netlify

1. **Install Netlify CLI**: `npm install -g netlify-cli`
2. **Login**: `netlify login`
3. **Navigate to frontend**: `cd frontend`
4. **Build**: `npm run build`
5. **Deploy**: `netlify deploy --prod --dir=dist`
6. **Set Environment Variable**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.com/api`

### Option 3: Manual Build & Deploy

1. **Build the frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Upload the `dist` folder** to any static hosting service

## Post-Deployment Checklist

- [ ] Backend is accessible and returns JSON responses
- [ ] Frontend environment variable points to backend URL
- [ ] CORS is configured correctly (backend allows frontend origin)
- [ ] Database migrations are run
- [ ] Test creating an employee
- [ ] Test marking attendance
- [ ] Test viewing records

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that frontend URL matches exactly (including https/http)
- In development, `CORS_ALLOW_ALL_ORIGINS` is enabled

### Database Errors
- Ensure migrations are run: `python manage.py migrate`
- Check DATABASE_URL is set correctly
- For SQLite, ensure write permissions

### Build Errors
- Check Node.js version (18+)
- Check Python version (3.11+)
- Ensure all dependencies are in requirements.txt/package.json
