# Auth + Dashboard Implementation

## Completed Tasks

- [x] Create profile auto-creation trigger in Supabase
- [x] Create auth callback route
- [x] Create auth layout and login page
- [x] Create Navbar and UserMenu components
- [x] Create dashboard layout and home page
- [x] Create projects API routes
- [x] Create ProjectCard and CreateProjectDialog components
- [x] Create projects list page

## Review

### Files Created

**Database**
- Applied migration `create_profile_on_signup` - Trigger that auto-creates profile row when user signs up via Google OAuth

**Auth Flow**
- `src/app/auth/callback/route.ts` - Handles OAuth callback, exchanges code for session
- `src/app/(auth)/layout.tsx` - Centered layout with StoryForge branding
- `src/app/(auth)/login/page.tsx` - "Sign in with Google" button with Suspense wrapper

**Dashboard**
- `src/app/(dashboard)/layout.tsx` - Dashboard shell with Navbar
- `src/app/(dashboard)/dashboard/page.tsx` - Welcome message, project count, quick start
- `src/app/(dashboard)/projects/page.tsx` - Projects list with create button and empty state

**Components**
- `src/components/Navbar.tsx` - Top navigation with links and user menu
- `src/components/UserMenu.tsx` - User avatar, name, sign out button
- `src/components/ProjectCard.tsx` - Project card with title, description, status
- `src/components/CreateProjectDialog.tsx` - Modal form for creating projects

**API Routes**
- `src/app/api/projects/route.ts` - GET (list) and POST (create) projects
- `src/app/api/projects/[id]/route.ts` - GET, PATCH, DELETE single project

### Routes Available
- `/` - Landing page (existing)
- `/login` - Google OAuth login
- `/dashboard` - Dashboard home (protected)
- `/projects` - Projects list (protected)
- `/auth/callback` - OAuth callback handler

### Manual Setup Required

Before auth works, configure Google OAuth in Supabase Dashboard:

1. Go to **Authentication > Providers > Google**
2. Enable Google provider
3. Add OAuth credentials from Google Cloud Console:
   - Create OAuth 2.0 Client ID at https://console.cloud.google.com/apis/credentials
   - Authorized redirect URI: `https://yresrhownnpgdpfsttco.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

### Testing

```bash
cd storyforge
npm run dev
```

1. Visit http://localhost:3000/login
2. Click "Sign in with Google"
3. After authentication, you'll be redirected to /dashboard
4. Navigate to /projects to see project list
5. Create a new project using the "New Project" button
