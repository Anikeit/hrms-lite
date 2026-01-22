#!/bin/bash

# HRMS Lite Deployment Helper Script
# This script helps prepare the project for deployment

echo "🚀 HRMS Lite Deployment Helper"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Pre-deployment Checklist:"
echo ""

# Check backend
echo "Checking backend..."
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ backend/requirements.txt not found"
    exit 1
fi
echo "✅ Backend files found"

# Check frontend
echo "Checking frontend..."
if [ ! -f "frontend/package.json" ]; then
    echo "❌ frontend/package.json not found"
    exit 1
fi
echo "✅ Frontend files found"

# Generate secret key
echo ""
echo "🔑 Generating Django Secret Key..."
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "Your SECRET_KEY:"
    echo "$SECRET_KEY"
    echo ""
    echo "Copy this and use it as your SECRET_KEY environment variable in your deployment platform."
else
    echo "⚠️  Could not generate secret key. Please generate manually:"
    echo "   python -c \"import secrets; print(secrets.token_urlsafe(50))\""
fi

echo ""
echo "📝 Next Steps:"
echo "1. Push your code to GitHub (if not already done)"
echo "2. Deploy backend to Render/Railway/Heroku"
echo "3. Deploy frontend to Vercel/Netlify"
echo "4. Set environment variables as documented in DEPLOY_QUICKSTART.md"
echo ""
echo "✅ Pre-deployment checks complete!"
