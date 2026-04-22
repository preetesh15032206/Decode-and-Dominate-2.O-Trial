# Render Deployment Guide

This project is configured for Render deployment using the included `render.yaml` manifest.

## Prerequisites
- Git repository with your project pushed to GitHub, GitLab, or Bitbucket
- Node.js 20+ installed locally (if testing locally)

## Render Deployment
1. Sign in to Render: https://dashboard.render.com
2. Create a new Web Service
3. Connect your repository and select the project branch (usually `main`)
4. Render detects the app and uses the `render.yaml` configuration
5. Deploy the service

## Build and Start Commands
Render uses:
- Build command: `npm run build`
- Start command: `npm run start`

## Local Testing
```bash
npm install
npm run check
npm run build
npm start
```
Visit `http://localhost:5000` to confirm the production build.

## Notes
- `render.yaml` defines the web service and auto-deploy behavior
- Set any required environment variables in the Render dashboard

## Post-Deployment
- Check the Render dashboard for build logs and service status
- Confirm the app is reachable at your Render URL
- Redeploy after changes by pushing to the monitored branch
