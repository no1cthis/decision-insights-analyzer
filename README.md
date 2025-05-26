# Decision Insight Analyzer

A web application for capturing, analyzing, and tracking decision-making processes. Built with Next.js, Supabase, and OpenRouter AI.

[LIVE DEMO](https://decision-insights-analyzer-production.up.railway.app/)

---

## Table of Contents
- [Decision Insight Analyzer](#decision-insight-analyzer)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [User Workflows](#user-workflows)
  - [Developer Setup](#developer-setup)
  - [Environment Variables](#environment-variables)
  - [API Endpoints](#api-endpoints)
  - [Database Schema](#database-schema)
  - [Troubleshooting](#troubleshooting)
  - [Documentation](#documentation)

---

## Overview
Decision Insight Analyzer helps users document decisions, analyze reasoning, and track outcomes. It supports user authentication, secure data storage, and AI-powered analysis.

## Key Features
- User authentication (registration, login)
- Decision capture and journaling
- AI-powered decision analysis
- User profile management (planned)
- Route protection with Supabase SSR middleware

## User Workflows
1. **Register/Login**: Users sign up or log in to access their decision journal.
2. **Record Decision**: Users enter a situation, their decision, and reasoning.
3. **Analyze**: The app uses AI to analyze the decision and provide insights.
4. **Review**: Users can review past decisions and analyses.

## Developer Setup
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd decision-insight-analyzer
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Set up environment variables (see below).
4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables
Set the following in your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

## API Endpoints
- `POST /api/decisions` — Create a new decision
- `GET /api/decisions/[id]` — Get a decision by ID
- `PATCH /api/decisions/[id]` — Update a decision
- `GET /api/user-decisions` — List user decisions
- `GET /api/user-decisions/summary` — Get summary of user decisions

See [`/docs/api.md`](docs/api.md) for detailed request/response formats.

## Database Schema
- **decision**: Stores user decisions, reasoning, and analysis results

See [`/docs/database.md`](docs/database.md) for schema diagrams and details.

## Troubleshooting
- Ensure all environment variables are set correctly
- Supabase policies require users to only access their own data
- For database issues, check migration files in `supabase/migrations/`

## Documentation
- [User Guide](docs/user_guide.md)
- [API Reference](docs/api.md)
- [Developer Setup](docs/developer_setup.md)
- [Database Schema](docs/database.md)

---

For more details, see the `/docs` directory.
