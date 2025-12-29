# XenFi Expense & Accounting Management Platform

This is a production-minded internal tool built for the XenFi Systems Software Engineer (Mid-Level) practical task. It provides a centralized dashboard for tracking company expenses, managing categories, and monitoring monthly spending.

## 🚀 Live Demo
- URL: [Insert your Vercel URL here]
- Demo Credentials: `tempestpius70@gmail.com` / `password123` (Note: Password check is bypassed for this demo.)

## 🛠 Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Database: PostgreSQL (Hosted on Neon.tech)
- ORM: Prisma 7 (configured with `@prisma/adapter-pg`)
- Authentication: Auth.js (NextAuth)
- Styling: Tailwind CSS
- Utilities: `date-fns` for date manipulation

## 🏗 Key Features
- Secure Authentication: Protected routes using Auth.js middleware.
- Full CRUD: Create, Read, Update, and Delete functionality for company expenses.
- Data Insights: Dashboard displaying total monthly spend and categorized transaction lists.
- Relational Data: Expenses are linked to specific Categories and Users.

## ⚙️ Setup Instructions

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd xenify
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-random-secret-string"
```

### 3. Database Sync & Seed
This project uses Prisma 7. To sync the schema and populate the demo data:
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

## 🧠 Engineering Choices & Tradeoffs
- Prisma 7 Architecture: Datasource URL is configured via `prisma.config.ts` and the `pg` driver adapter for better performance in serverless environments (e.g., Vercel). SSL is enabled for Neon connectivity.
- Server Actions: Next.js Server Actions power all mutations, reducing custom API endpoints and providing a type-safe bridge between forms and the database.
- Data Integrity: Server-side validation and session checks ensure only owners can update/delete their data.
- UX Tradeoff: Focused on core CRUD and reliability over advanced UI or receipt uploads. The schema supports attachments for future expansion.

## 📁 Project Structure
- `/app`: Routes and server actions
- `/components`: Reusable UI components (Modals, Buttons, Forms)
- `/lib`: Database client and Auth configuration
- `/prisma`: Schema definition and the seed script
