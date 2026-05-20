# MailCheck — Bulk Email Verifier

Upload a spreadsheet or paste a list of emails → get SMTP-verified results.

## Deploy to Render

1. Push the `app/` folder to a GitHub repo
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** to `app`
5. Render auto-detects the Dockerfile — hit **Deploy**
6. Done. You get a `.onrender.com` URL.

Or use the **Blueprint** — go to [render.com/deploy](https://render.com/deploy) and point it at your repo. The `render.yaml` handles everything automatically.

## Run Locally

```bash
cd app
pip install -r requirements.txt
python3 -m uvicorn main:app --port 8000
```

Open http://localhost:8000

## Features

- Paste emails or upload CSV / XLSX / TXT
- SMTP-level verification (MX lookup + RCPT TO)
- Concurrent checks (10 at a time, up to 500 emails)
- Filter by status, export results to CSV
- Dark UI with glassmorphism
