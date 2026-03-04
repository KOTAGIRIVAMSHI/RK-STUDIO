# Shree RK Photo Studio

A production-ready, secure, and scalable website for Shree RK Photo Studio, located in Serilingampally, Hyderabad. Built with React, TypeScript, TailwindCSS, and Supabase.

## Documentation Artifacts

- [Implementation Plan](file:///C:/Users/atlas/.gemini/antigravity/brain/105c6e51-3d4a-4cbf-bd6c-4f7cd6bae3d7/implementation_plan.md)
- [Task List](file:///C:/Users/atlas/.gemini/antigravity/brain/105c6e51-3d4a-4cbf-bd6c-4f7cd6bae3d7/task.md)

## Tech Stack

- **Frontend**: React (Vite) + TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Setup Instructions

1. **Clone the repository** (if applicable).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Database Setup**:
   Run the SQL schema provided in the [Implementation Plan](file:///C:/Users/atlas/.gemini/antigravity/brain/105c6e51-3d4a-4cbf-bd6c-4f7cd6bae3d7/implementation_plan.md) inside your Supabase SQL Editor.
5. **Storage Setup**:
   - Create a public bucket in Supabase Storage named `studio-images`.
   - Set up policies to allow public read access and admin-only uploads/deletes.
6. **Start Dev Server**:
   ```bash
   npm run dev
   ```

## Deployment

This project is optimized for deployment on **Vercel**. Ensure all environment variables are added to the Vercel project settings.

## Features

- **Public Website**: Home, dynamic Services, filterable Portfolio, and Contact form.
- **Admin Dashboard**: Manage services, portfolio items, and view client inquiries.
- **Security**: Supabase Row Level Security (RLS) and protected routes.
- **Performance**: Mobile-first responsive design and lazy-loaded images.
