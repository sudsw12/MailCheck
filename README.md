# Email Verifier Web App

Bulk email verification tool — upload a spreadsheet or paste a list, get SMTP-verified results.

## Quick Start (Local)

```bash
cd app
pip install -r requirements.txt
uvicorn main:app --reload
```

Then open http://localhost:8000

## Deploy to Railway (Recommended — easiest)

1. Push this `app/` folder to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Railway auto-detects the Dockerfile and deploys
4. Done — you get a public URL

## Deploy to Render

1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service → connect repo
3. Set root directory to `app/`
4. Render auto-detects Dockerfile
5. Done

## Deploy to Fly.io

```bash
cd app
fly launch
fly deploy
```

## ⚠️ Why not Vercel?

Vercel serverless functions **block outbound TCP port 25**, which is required for SMTP verification. Railway, Render, and Fly.io all allow this.

## Features

- Paste emails or upload CSV/XLSX/TXT files
- SMTP-level verification (MX lookup + RCPT TO)
- Concurrent verification (up to 10 at a time)
- Beautiful dark UI with filtering and CSV export
- Max 500 emails per batch
