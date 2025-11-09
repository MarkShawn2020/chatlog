# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 frontend for Chatlog - a WeChat chat history viewer with Go backend integration. TypeScript strict mode, Supabase authentication, DrizzleORM. Default locale is Chinese (zh).

## Development Commands

**IMPORTANT**: Local dev server runs with `npm run dev` (starts both Next.js and Spotlight). DO NOT start additional dev servers.

### Core Development
```bash
npm run dev              # Start dev server (Next.js + Spotlight)
npm run dev:chatlog      # Dev mode with chatlog-specific setup
npm run check:types      # TypeScript type checking
npm run lint:fix         # Auto-fix linting issues
npm run commit           # Interactive commit (Commitizen)
```

### Testing
```bash
npm test                 # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Playwright)
npm run storybook        # Component development
```

### Database
```bash
npm run db:studio        # Open Drizzle Studio
npm run db:generate      # Generate migrations after schema changes
npm run db:push          # Push schema directly (use with caution)
```

### Version Management
```bash
npm run version:bump     # Auto-bump version (analyzes commits)
npm run version:patch    # Force patch (0.3.1 → 0.3.2)
npm run version:minor    # Force minor (0.3.x → 0.4.0)
npm run version:major    # Force major (0.x.x → 1.0.0)
```

### Build & Deployment
```bash
npm run build            # Standard production build
npm run build:static     # Static export for Go integration
npm run build:chatlog    # Build + copy to Go backend
npm run start            # Production server
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router, React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui (53 components)
- **State**: Jotai (UI state) + React Query (server state)
- **Database**: Supabase (PostgreSQL) + DrizzleORM
- **Auth**: Supabase Auth (server-side, cookie-based)
- **Forms**: React Hook Form + Zod validation
- **i18n**: next-intl (zh/en locales, default: zh)
- **Monitoring**: Sentry, PostHog, Better Stack, Spotlight (dev)
- **Security**: Arcjet (bot detection, WAF, rate limiting)
- **Version**: standard-version + semantic-release

### Directory Structure
```
src/
├── app/[locale]/              # App Router with i18n
│   ├── (app)/chatlog/         # Chatlog application (main feature)
│   ├── (marketing)/           # Public pages
│   ├── (auth)/                # Protected routes
│   │   └── (center)/          # Centered auth pages
│   └── api/                   # API routes
├── components/
│   ├── ui/                    # shadcn/ui components (53 items)
│   ├── chatlog/               # Chatlog-specific components
│   │   ├── ChatlogDashboard.tsx
│   │   ├── NavigationSidebar.tsx    # WeChat-style navigation
│   │   ├── ConversationListPanel.tsx
│   │   ├── ChatPanel.tsx
│   │   └── ChatLayout.tsx
│   ├── layout/                # Layout components
│   └── auth/                  # Auth components
├── libs/                      # Core services & integrations
│   ├── ChatlogAPI.ts          # Go backend API client
│   ├── Auth.ts                # AuthService class
│   ├── DB.ts                  # Database + auto-migrations
│   ├── Supabase*.ts           # Supabase clients
│   └── Env*.ts                # T3 Env validation
├── stores/                    # Jotai atoms
│   └── chatlogStore.ts        # Chatlog state management
├── models/
│   └── Schema.ts              # DrizzleORM database schema
├── utils/
│   └── version.ts             # Auto-updated version info
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript definitions
├── validations/               # Zod schemas
└── middleware.ts              # Security + auth + i18n

scripts/
└── update-version-headers.js  # Pre-commit version sync
```

### Integration with Go Backend

**Development Mode:**
- Go backend: `http://localhost:5030` (run separately)
- Next.js frontend: `http://localhost:3000`
- API proxy configured in `next.config.ts` rewrites:
  - `/api/v1/*` → `http://localhost:5030/api/v1/*`
  - `/image/*`, `/video/*`, `/voice/*`, `/file/*`, `/data/*` → Go backend

**Production Mode:**
1. `npm run build:static` - Creates static export
2. `npm run build:chatlog` - Copies to `../internal/chatlog/http/static/`
3. Go serves frontend at root path

**API Client (`src/libs/ChatlogAPI.ts`):**
- `getChatlog()` - Fetch messages with filters
- `getContacts()` - List contacts with pagination
- `getChatRooms()` - List group chats
- `getSessions()` - Recent conversations
- `getImageURL()`, `getVideoURL()`, etc. - Media URLs

### State Management Architecture

**Jotai Atoms (`src/stores/chatlogStore.ts`):**
```typescript
// Navigation state (persisted)
activeSectionAtom: 'chats' | 'contacts' | 'groups'

// Current conversation
selectedConversationAtom: {
  type: 'session' | 'contact' | 'chatroom'
  id: string
  displayName: string
  avatar?: string
}

// Messages cache
conversationMessagesAtom: Message[]

// Query parameters (persisted)
chatlogParamsAtom: { time, talker, sender, keyword, limit }

// UI state
exportDialogOpenAtom: boolean
```

**React Query:**
- Configured in `ReactQueryProvider`
- Used for server data fetching
- 1-minute stale time, no refetch on window focus

### Chatlog Component Architecture

**3-Column WeChat-Style Layout:**
1. **NavigationSidebar** - Section tabs (Chats, Contacts, Groups)
2. **ConversationListPanel** - List view with search/filter
3. **ChatPanel** - Message display with infinite scroll

**Responsive Behavior:**
- Mobile: Single column, back navigation
- Tablet: 2 columns (list + chat)
- Desktop: 3 columns (all visible)

### Database Schema (`src/models/Schema.ts`)

**User Tables:**
```typescript
userProfiles {
  id: uuid (references auth.users)
  email, fullName, avatarUrl
  locale: 'zh', timezone: 'Asia/Shanghai'
  onboardingCompleted: boolean
}

userPreferences {
  userId, theme, emailNotifications
  language: 'zh'
}

userSubscriptions {
  userId, planId, status
  stripeCustomerId, stripeSubscriptionId
  currentPeriodStart/End
}
```

**Demo Table:**
```typescript
counterSchema { id, count, timestamps }
```

### Key Patterns

#### 1. Authentication Flow
- **Middleware** (`src/middleware.ts`):
  - Arcjet security checks (bot detection, rate limiting)
  - Supabase auth verification
  - Protected route enforcement (`/dashboard`)
  - Auth page redirection (if logged in)
  - i18n routing
- **Server Components**: Use `AuthService` from `src/libs/Auth.ts`
- **Client Components**: Use `useAuthUser()` hook
- Session management: Cookie-based, server-side

#### 2. Database Migrations
1. Edit `src/models/Schema.ts`
2. Run `npm run db:generate` → creates migration file
3. Migration auto-applies on next DB interaction (no restart needed)
4. Migration functions in `src/libs/DB.ts`

#### 3. Internationalization
- Routes: `/[locale]/...` (locale prefix required)
- Default locale: `zh` (Chinese)
- Translations: `src/locales/{locale}/*.json`
- Client: `useTranslations()` hook
- Server: `getTranslations()` from next-intl

#### 4. Version Management
**Automatic Version Tracking:**
- Pre-commit hook updates `src/utils/version.ts`:
  ```typescript
  export const GIT_COMMIT_HASH = 'abc1234'
  export const GIT_COMMIT_DATE = '2025-11-09'
  export const APP_VERSION = '0.3.1-abc1234'
  ```
- Version displayed in `ChatLayout.tsx` header badge
- File headers auto-updated with `@version` and `@lastModified`

**Release Process:**
1. Develop features with conventional commits
2. Run `npm run version:bump` (auto-detects version bump)
3. Generates/updates `CHANGELOG.md`
4. Creates git tag `vX.Y.Z`
5. Push with `git push --follow-tags`

**Commit Types:**
- `feat:` → minor bump (0.3.x → 0.4.0)
- `fix:` → patch bump (0.3.1 → 0.3.2)
- `BREAKING CHANGE:` → major bump (0.x.x → 1.0.0)
- `perf:`, `refactor:` → patch bump
- `docs:`, `chore:` → no version change

#### 5. Environment Variables
**Required (`.env`):**
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Optional (`.env.local`):**
```bash
ARCJET_KEY=                    # Security features
BETTER_STACK_SOURCE_TOKEN=     # Logging
NEXT_PUBLIC_POSTHOG_KEY=       # Analytics
SENTRY_DSN=                    # Error monitoring
```

**Validation:**
- T3 Env validates at build time
- Client: `src/libs/Env.ts`
- Server: `src/libs/EnvServer.ts`
- Build fails if required vars missing

#### 6. Security Layers
1. **Arcjet Middleware**: Bot detection, rate limiting, WAF
2. **Supabase Auth**: Server-side authentication
3. **RLS**: Row Level Security (database)
4. **Type Safety**: TypeScript strict mode
5. **Env Validation**: T3 Env

#### 7. Testing Strategy
- **Unit Tests**: Vitest with browser mode (Playwright)
  - Co-located with source: `Component.test.tsx`
  - Coverage with v8
- **E2E Tests**: Playwright in `tests/e2e/`
  - Matrix: Chromium + Firefox (CI)
  - Monitoring tests: `*.check.e2e.ts` (Checkly)
- **Storybook**: Component development + testing

## Development Guidelines

### Modifying Database Schema
1. Edit `src/models/Schema.ts`
2. Run `npm run db:generate` to create migration
3. Migration applies automatically on next DB interaction
4. No server restart needed

### Adding New Components
- Use shadcn/ui from `src/components/ui/`
- TypeScript strict mode (no implicit any)
- Co-locate tests: `Component.test.tsx`
- Follow existing patterns for state management

### Working with Chatlog API
```typescript
import { ChatlogAPIClient } from '@/libs/ChatlogAPI';

// Fetch messages
const messages = await ChatlogAPIClient.getChatlog({
  talker: 'wxid_xxx',
  time: 'last-7d',
  limit: 100
});

// Get media URL
const imageUrl = ChatlogAPIClient.getImageURL(message.contents?.md5);
```

### Working with Auth
- **Server Components**:
  ```typescript
  import { AuthService } from '@/libs/Auth';
  const user = await AuthService.getCompleteUser(userId);
  ```
- **Client Components**:
  ```typescript
  import { useAuthUser } from '@/hooks/useAuthUser';
  const { user, isLoading } = useAuthUser();
  ```

### State Management
- **UI State**: Jotai atoms (prefer atomic state)
- **Server State**: React Query (automatic caching)
- **Persistence**: `atomWithStorage` for localStorage
- **Global State**: Avoid unless necessary

### Styling Conventions
- Tailwind CSS utility classes
- shadcn/ui component variants
- Dark mode support via next-themes
- Responsive design: mobile-first
- Platform-specific styles in `src/ui/style/`

### Git Workflow
1. **Commit**: Use conventional commits
   - `feat: add new feature`
   - `fix: resolve bug`
   - `docs: update documentation`
2. **Pre-commit**: Auto-runs
   - Version header updates
   - ESLint auto-fix
   - Type checking
3. **Release**: `npm run version:bump`
   - Auto-generates CHANGELOG
   - Creates git tag
   - Updates version files

### Common Pitfalls
- Don't bypass pre-commit hooks (lefthook)
- Don't use `npm run db:push` in production (use migrations)
- Don't start multiple dev servers (use `npm run dev`)
- Don't forget to run Go backend for chatlog features
- Don't commit `.env.local` (use `.env` for shared vars)
- Don't modify `src/utils/version.ts` manually (auto-updated)

## Configuration Files

### Next.js Configs
- `next.config.ts` - Development (with API proxy)
- `next.config.static.ts` - Static export for Go
- `next.config.dev.ts` - Alternative dev config

### TypeScript
- `tsconfig.json` - Strict mode, path aliases
- `@/*` → `src/*`

### ESLint
- `eslint.config.mjs` - @antfu/eslint-config
- No stylistic rules (IDE handles formatting)

### Lefthook (Git Hooks)
- `lefthook.yml` - Pre-commit + commit-msg hooks
- Replaces Husky

### Version Management
- `.versionrc.json` - standard-version config
- Changelog format, commit types, postbump script

### Middleware
- Excludes: `/api`, `/_next`, media endpoints, static files
- Order: Arcjet → Auth → i18n

## Special Features

### Automatic Version Tracking
Every commit automatically updates:
- File headers: `@version <hash>`, `@lastModified <date>`
- `src/utils/version.ts`: `GIT_COMMIT_HASH`, `GIT_COMMIT_DATE`
- Display version: `0.3.1-abc1234` in UI

### API Proxy (Development)
All API/media requests proxied to Go backend:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5030`
- Seamless development experience

### Static Export (Production)
- Build output: Static HTML/CSS/JS
- Served by Go backend
- No Node.js runtime required

### Monitoring Stack
- **Errors**: Sentry (production) + Spotlight (dev)
- **Logs**: LogTape → Better Stack
- **Analytics**: PostHog
- **Monitoring**: Checkly (E2E as monitors)

### Security Features
- Bot detection (Arcjet)
- Rate limiting (Arcjet)
- WAF protection (Arcjet)
- Attack prevention (Arcjet)
- Server-side auth (Supabase)
- RLS policies (PostgreSQL)
