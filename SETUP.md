# Setup Guide

## Quick Start (UI Only)

The UI works perfectly without Supabase! Just run:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the beautiful UI.

## Full Setup (With Backend)

### Step 1: Install Docker Desktop

Supabase requires Docker Desktop for local development:

1. Download Docker Desktop: https://docs.docker.com/desktop
2. Install and start Docker Desktop
3. Make sure Docker is running (you'll see the Docker icon in your system tray)

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Supabase

```bash
# Initialize Supabase
npx supabase init

# Start Supabase (requires Docker to be running)
npx supabase start
```

### Step 4: Configure Environment Variables

Create a `.env.local` file:

```env
# Supabase (get these from `npx supabase start` output)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API Keys (get from respective providers)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Run Database Migrations

Run the SQL from `StoryForge_Implementation_Guide.md` in the Supabase SQL Editor.

### Step 6: Start Development Server

```bash
npm run dev
```

## Troubleshooting

### Docker Error

If you see:
```
failed to inspect service: error during connect... docker_engine: The system cannot find the file specified
```

**Solution**: 
1. Install Docker Desktop from https://docs.docker.com/desktop
2. Make sure Docker Desktop is running
3. Try `npx supabase start` again

### Port Already in Use

If port 3000 is in use:
```bash
# Use a different port
npm run dev -- -p 3001
```

### Supabase Not Starting

1. Check Docker is running: `docker ps`
2. Check Supabase status: `npx supabase status`
3. Stop and restart: `npx supabase stop && npx supabase start`

## Current Status

✅ **UI is complete and working** - You can view all pages without Supabase
⏳ **Backend setup** - Requires Docker Desktop for Supabase



