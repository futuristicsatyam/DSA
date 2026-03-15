# Deploy this project now

## Backend (Render)

Build command:

```bash
corepack enable && pnpm install --frozen-lockfile=false && pnpm --filter @apps/api exec prisma generate && pnpm --filter @apps/api build && pnpm --filter @apps/api prisma:deploy
```

Start command:

```bash
pnpm --filter @apps/api start
```

Required env vars:

```env
NODE_ENV=production
PORT=10000
APP_URL=https://YOUR-API.onrender.com
FRONTEND_URL=https://YOUR-WEB.vercel.app
DATABASE_URL=YOUR_POSTGRES_URL
REDIS_URL=YOUR_REDIS_URL
JWT_ACCESS_SECRET=YOUR_LONG_RANDOM_SECRET
JWT_REFRESH_SECRET=YOUR_LONG_RANDOM_SECRET_2
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
COOKIE_DOMAIN=
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
FEATURE_ONLINE_JUDGE=false
```

Health check:

```
/api/v1/health
```

## Frontend (Vercel)

Project root:

```
apps/web
```

Required env var:

```env
NEXT_PUBLIC_API_URL=https://YOUR-API.onrender.com
```

If Vercel cannot resolve workspace packages, enable the setting that includes files outside the root directory.
