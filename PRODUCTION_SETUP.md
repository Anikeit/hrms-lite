# Production Setup Guide

## Environment Variables

### Backend (Render/Railway/Heroku)

Set these environment variables in your backend deployment platform:

```
DEBUG=False
SECRET_KEY=<your-secret-key>
FRONTEND_URL=https://hrms-lite-flax.vercel.app
DATABASE_URL=<automatically-set-if-using-postgres>
```

**Important Notes:**
- `FRONTEND_URL` should **NOT** have a trailing slash
- `FRONTEND_URL` should **NOT** have any path (just the domain)
- Example: `https://hrms-lite-flax.vercel.app` ✅
- Wrong: `https://hrms-lite-flax.vercel.app/` ❌

### Frontend (Vercel/Netlify)

Set this environment variable in your frontend deployment platform:

```
VITE_API_BASE_URL=https://hrms-backend-pc0z.onrender.com/api
```

**Important Notes:**
- `VITE_API_BASE_URL` should include `/api` at the end
- Example: `https://hrms-backend-pc0z.onrender.com/api` ✅
- Wrong: `https://hrms-backend-pc0z.onrender.com` ❌

## Current Production URLs

- **Frontend**: https://hrms-lite-flax.vercel.app
- **Backend**: https://hrms-backend-pc0z.onrender.com

## Steps to Fix Current Deployment

### 1. Update Backend Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to: `https://hrms-lite-flax.vercel.app` (no trailing slash)
5. Make sure `DEBUG=False`
6. Click **Save Changes**
7. The service will automatically redeploy

### 2. Update Frontend Environment Variables

1. Go to your Vercel dashboard: https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add/Update `VITE_API_BASE_URL` to: `https://hrms-backend-pc0z.onrender.com/api`
5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** on the latest deployment

### 3. Verify Backend is Running

Test your backend API:
```bash
curl https://hrms-backend-pc0z.onrender.com/api/employees/
```

You should get a JSON response (empty array if no employees).

### 4. Verify CORS is Working

After updating the environment variables, the backend should accept requests from your frontend. The CORS error should be resolved.

## Generate Secret Key

If you need to generate a new SECRET_KEY:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` has no trailing slash
- Make sure `FRONTEND_URL` has no path (just domain)
- Wait for backend to redeploy after changing environment variables

### API Connection Errors
- Verify `VITE_API_BASE_URL` includes `/api` at the end
- Check browser console for exact error messages
- Verify backend is running and accessible

### Build Errors
- Make sure all environment variables are set correctly
- Check deployment logs for specific error messages
