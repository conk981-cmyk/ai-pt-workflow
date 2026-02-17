# AI Revenue & Operations Dashboard

A production-ready SaaS dashboard for commercial cleaning companies, featuring AI-assisted insights for lead scoring, pricing suggestions, and churn risk prediction.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: custom-built based on shadcn/ui patterns
- **Database**: Postgres (via Prisma)
- **Auth**: NextAuth.js
- **Icons**: Lucide React

## Setup Instructions

1. **Clone the repository** (if applicable) and navigate to the project root.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root (a template is provided):
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_cleaning_dashboard?schema=public"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   OPENAI_API_KEY="sk-stub-key"
   DEMO_MODE="true"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

6. **Login**:
   - URL: `http://localhost:3000`
   - Test Credentials: `admin@droplet.com` / `password123`

## Features
- **Dashboard**: Real-time KPI tracking (Revenue, Margin, Conversion).
- **AI Lead Scoring**: Automated qualification and pricing suggestions for new leads.
- **Client Churn Check**: Predictive analysis of client retention based on service history.
- **Route Optimization**: Heuristic-based job scheduling grouped by county.
- **Demo Mode**: Full functionality with realistic seed data.
