# AuthKit

Authentication API with Node.js, Express, MongoDB.

## Setup

```bash
cp .env.example .env   # configure your env vars
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8088) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `MAIL_HOST` | SMTP host |
| `MAIL_PORT` | SMTP port |
| `MAIL_USER` | SMTP user |
| `MAIL_PASS` | SMTP password |

## Routes

All endpoints are prefixed with `/api/user`.

### Auth

| Method | Route | Auth | Body |
|--------|-------|------|------|
| POST | `/register` | No | `{ name, email, password }` |
| POST | `/login` | No | `{ email, password }` |
| POST | `/refresh-token` | No | `{ refreshToken }` |
| POST | `/forgot-password` | No | `{ email }` |
| POST | `/reset-password` | No | `{ email, otp, newPassword }` |
| POST | `/logout` | Yes | — |

### User

| Method | Route | Auth | Body |
|--------|-------|------|------|
| GET | `/me` | Yes | — |

## Rate Limiting

- **General**: 100 req / 15 min (all routes)
- **Auth**: 10 req / 15 min (login, register, forgot, reset)
- **Refresh**: 50 req / 15 min (`/refresh-token`)
