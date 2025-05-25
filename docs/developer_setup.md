# Developer Setup Guide: Decision Insight Analyzer

## Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm
- Supabase account (for backend)

## Installation
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

## Environment Variables
Create a `.env.local` file in the root directory with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

## Running the App
Start the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting
- Ensure all environment variables are set correctly
- Check Supabase project settings and policies
- For database issues, review migration files in `supabase/migrations/`
- For dependency issues, delete `node_modules` and reinstall

---
For more information, see the [README](../README.md). 