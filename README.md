# TalentDash

Career intelligence platform for India tech professionals. Structured, level-based salary data built on Next.js 15 + Neon PostgreSQL.

## Live URL
https://YOUR-VERCEL-URL.vercel.app

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (no component libraries)
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma 7
- **Deploy**: Vercel

## Run Locally (under 5 minutes)

### 1. Clone and install
git clone https://github.com/YOUR_USERNAME/talentdash
cd talentdash
npm install

### 2. Set up environment variables
cp .env.example .env.local
# Fill in your Neon DATABASE_URL and DIRECT_URL

### 3. Set up database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

### 4. Start dev server
npm run dev

Open http://localhost:3000

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL pooled connection string |
| `DIRECT_URL` | Neon PostgreSQL direct connection (for migrations) |

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/salaries` | List salaries with filters + pagination |
| POST | `/api/ingest-salary` | Submit a new salary record |
| GET | `/api/companies/[slug]` | Company data + salary breakdown |
| GET | `/api/compare?s1=&s2=` | Compare two salary records |

## Architecture Decisions

**Static-first rendering**: Company pages use `generateStaticParams` for full static generation at build time. The salary table uses ISR with `revalidate: 300` so it rebuilds every 5 minutes, keeping data fresh without server cost. The compare page is the only justified `use client` — it requires interactive state that cannot be prebuilt.

**Pagination over cursor**: Page-based pagination chosen because salary pages are SEO targets — `/salaries?page=2` is a shareable, indexable URL. Cursor pagination would break this.

**Prisma 7 + Neon adapter**: Prisma 7 removed `url` from schema.prisma in favour of adapter-based connections. Using `@prisma/adapter-pg` for the Neon PostgreSQL connection.

**What was cut**: Full ISR cache purge via Cloudflare API (used `revalidatePath` inside Next.js instead). Animation on level distribution bar. Compare page pre-filling from company page (URL param `c1` is wired but dropdown auto-select needs one more pass).

## Seed Data
62 salary records across 10 companies: Google, Amazon, Microsoft, Meta, Flipkart, Razorpay, TCS, Infosys, Swiggy, Zepto.