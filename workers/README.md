# Cloudflare Worker Deployment Guide

This project uses a Cloudflare Worker to securely proxy leaderboard API requests to Turso, keeping your database credentials safe.

## Setup

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Configure secrets**:
   ```bash
   # Get your Turso credentials from your local .env file
   wrangler secret put TURSO_URL
   wrangler secret put TURSO_AUTH_TOKEN
   ```

   When prompted, paste the values from your `.env` file (without the `VITE_` prefix):
   - TURSO_URL: https://your-db-name.turso.io
   - TURSO_AUTH_TOKEN: your-turso-auth-token

4. **Deploy the worker**:
   ```bash
   wrangler deploy
   ```

5. **Update frontend to use the worker**:
   After deployment, note the worker URL (e.g., `https://flappy-js-leaderboard.your-subdomain.workers.dev`).
   Update `.env`:
   ```env
   VITE_LEADERBOARD_API_URL=https://flappy-js-leaderboard.your-subdomain.workers.dev
   ```

## API Endpoints

- `POST /api/submit` - Submit a score
  ```json
  { "name": "Player", "score": 100 }
  ```

- `GET /api/scores?limit=10` - Get top scores

## Local Testing

To test the worker locally:
```bash
wrangler dev
```

Then update your `.env`:
```env
VITE_LEADERBOARD_API_URL=http://localhost:8787
```
