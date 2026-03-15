# DSA Suite Platform

A production-oriented monorepo for a learning platform covering DSA, Competitive Programming, and GATE CSE.

## Stack

- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind, TanStack Query, React Hook Form, Zod, React Markdown, Framer Motion
- **Backend:** NestJS, REST, JWT cookie auth, Swagger, Prisma
- **Database:** PostgreSQL
- **Infra:** Redis, Cloudinary, Nodemailer, Twilio/MSG91 abstraction
- **Workspace:** pnpm + Turbo monorepo

## Monorepo layout

```text
/apps
  /api
  /web
/packages
  /config
  /types
  /ui
```

## Phases

### Phase 1
- architecture
- folder structure
- environment design
- Prisma schema
- shared packages

### Phase 2
- NestJS modules
- auth with OTP + JWT cookies
- content, bookmarks, progress, dashboard, admin
- Redis caching + Swagger + guards

### Phase 3
- public pages
- auth pages
- DSA / CP / GATE learning screens
- markdown rendering system

### Phase 4
- dashboard
- bookmarks
- progress
- admin panel
- search modal + grouped search results

### Phase 5
- Docker setup
- seed data
- test scaffolding
- deployment notes

## Local setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# For local development keep COOKIE_DOMAIN empty in apps/api/.env
# and use strong JWT secrets before starting the API.
docker compose up -d postgres redis
pnpm db:generate
pnpm --filter @apps/api exec prisma db push
pnpm db:seed
pnpm dev
```

## Useful commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm db:generate
pnpm db:seed
```

## Deployment

### Frontend
- Deploy `apps/web` to Vercel
- Set `NEXT_PUBLIC_API_URL` to your backend public URL

### Backend
- Deploy `apps/api` to Railway / Render / AWS
- Use managed PostgreSQL and Redis
- Set CORS origin to frontend domain
- Provide Cloudinary, SMTP, and Twilio/MSG91 credentials

### Database
- Supabase / RDS / Neon / Railway PostgreSQL all work
- Run Prisma migrations on deploy

## Notes

- Online judge is scaffolded as an isolated feature-flagged module
- Admin route protection exists both in frontend middleware and backend RBAC
- Search uses PostgreSQL full-text queries with Prisma raw SQL


## Important local dev notes

- The backend uses `moduleResolution: Node` so Nest can compile correctly while the web app keeps bundler-style resolution.
- Keep `COOKIE_DOMAIN` empty for localhost. Setting it to `localhost` often prevents auth cookies from being stored correctly.
- OTP delivery falls back to console logs when SMTP/Twilio credentials are not configured.


## Deployment-ready extras

- Added `COOKIE_SAME_SITE` support for cross-domain auth cookies.
- Added `GET /api/v1/health` for health checks.
- Added `prisma:deploy` script that runs `migrate deploy` and falls back to `db push` when no migrations are committed yet.
- Added `render.yaml` for backend deployment defaults.
