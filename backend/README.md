# Metal Web — Backend

This repository hosts a small Express backend that accepts contact form submissions from the frontend and sends a branded email via Resend.

## Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Create environment file

Copy `.env.example` to `.env` and fill in your Resend API key:

```
RESEND_API_KEY=re_xxx
FRONTEND_URL=http://localhost:5173
PORT=5000
```

3. Run the server

```bash
npm start      # production
npm run dev    # development (node --watch)
```

## Endpoint

POST /api/contact
- JSON body: `{ name, email, serviceType, budget, description }`
- Returns `{ success: true, message: 'Your message has been sent!' }` on success

## Notes

- CORS is restricted to the `FRONTEND_URL` configured in `.env`.
- Rate limiting prevents more than 5 submissions per 15 minutes per IP.
- Use the frontend env `VITE_API_URL` to point the frontend at this backend (see `frontend/.env.example`).
