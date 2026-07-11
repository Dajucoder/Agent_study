# Online Learning Platform (Frontend)

> 🌐 **English version**: [WEB_FRONTEND.en.md](/en/WEB_FRONTEND/)
>
> 🧭 **Navigation** · [🏠 Home](index.md) · [Project Structure](PROJECT_STRUCTURE.md) · [Architecture](ARCHITECTURE.md)
>
> 🏷️ **Type**: Frontend app docs · **Prerequisite**: Node.js 18+

This repository now ships a **modern online learning platform frontend** (the `web/` folder), tightly integrated with the repository's LangChain learning path, providing course browsing, a content player, progress tracking, and a personal center.

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | React 18 (function components + Hooks) |
| Language | TypeScript 5 (strict mode: `strict`, `noUnusedLocals`) |
| Build | Vite 5 (fast HMR, Rollup-based production build) |
| Routing | React Router 6 (nested routes + route guards) |
| State | React Context + `useReducer`/`useState`, unified as `Auth / Progress / Theme` Providers |
| Styling | Plain CSS + CSS variables (design tokens), modular split, zero runtime deps |
| Persistence | `localStorage` (session, progress, theme — isolated per user) |
| Icons | Self-built lightweight SVG icon set (no third-party icon lib) |

> Design principle: **no extra UI component library**, keeping dependencies minimal and the bundle light. All interactions and visuals are implemented with in-house components and CSS for easy maintenance and extension.

## Directory Structure

```
web/
├── public/favicon.svg        # site icon
├── src/
│   ├── components/
│   │   ├── ui/               # base UI primitives (Button/Input/Modal/ProgressBar/Badge/Avatar/... + icons)
│   │   ├── layout/           # responsive layout (Header/Footer/Layout/RequireAuth/ScrollToTop)
│   │   ├── course/           # course card, multi-dimensional filter panel, toolbar
│   │   └── player/           # video/article player, lesson list, lesson view
│   ├── pages/                # pages: home/courses/detail/learn/login/register/profile/progress/404
│   ├── store/                # state: AuthContext / ProgressContext / ThemeContext
│   ├── data/                 # course & category mock data (mapped to LangChain topics)
│   ├── utils/                # storage wrapper, formatters, multi-dimension filter pure fn
│   ├── styles/               # modular CSS: base / header / home / courses / learn / account / responsive
│   ├── types/                # global TypeScript types
│   ├── App.tsx               # route table
│   ├── main.tsx              # entry (mount Providers + Router)
│   └── index.css             # style entry (@import aggregation)
├── index.html
├── vite.config.ts            # Vite config (alias @ -> src)
├── tsconfig.json
├── package.json
└── README.md
```

## Core Feature Modules

1. **Course browsing & multi-dimensional classification**
   - 6 topic dimensions (Models & Prompts, Chains, Memory, Retrieval & RAG, Agents, Serving & Deployment) + level + format (video/article) filtering.
   - Keyword search, sorting (popular / newest / rating / duration), URL-synced filter state (shareable, back-button friendly).
   - Course cards show progress bar, duration, rating and format badges.

2. **Video & article content player**
   - Video player built on HTML5 `<video>` with auto-resume (remembers last watched second).
   - Article player renders rich blocks (headings, paragraphs, code with one-click copy, lists, callouts, figures).
   - Lesson sidebar shows completion state and progress.

3. **Progress tracking & history**
   - Per-course records of completed lessons, current lesson, and watched seconds, persisted locally.
   - "Continue learning" and "History" pages show completion %, last-learned time, with per-course reset.
   - Progress is **isolated per logged-in user**; switching accounts reloads each user's progress.

4. **Login / register & personal center**
   - Register / login (local demo accounts in the browser), route guards protect learning & profile pages.
   - Personal center with overview, my courses, and account settings (name / bio / avatar color).
   - Auto-redirect back to the source page after login.

## State Management

State follows React's recommended **Context + Hooks** pattern, centralized in `src/store/`:

| Provider | Responsibility | Persisted |
| --- | --- | --- |
| `ThemeContext` | Light / dark theme, follows system preference | `localStorage` |
| `AuthContext` | Current user, login / register / logout / update profile | `localStorage` |
| `ProgressContext` | Per-course progress, history, stats (isolated per user) | `localStorage` (bucketed by `userId`) |

All Providers mount via `AppProviders`; components consume with `useAuth()` / `useProgress()` / `useTheme()`, avoiding prop drilling with a clear, testable, extensible state source.

## Routing & Guards

| Path | Page | Guard |
| --- | --- | --- |
| `/` | Home | public |
| `/courses` | Course center | public |
| `/courses/:slug` | Course detail | public |
| `/learn/:slug` | Learn page (player) | auth required |
| `/login`, `/register` | Login / Register | public |
| `/profile` | Personal center | auth required |
| `/progress` | Progress & history | auth required |
| `*` | 404 | public |

## Responsive & Theme

- Mobile-first with breakpoints: `<=1024px` (tablet), `<=768px` (phone), `<=480px` (small).
- Course filters are a sidebar on desktop and a drawer on mobile; nav collapses to a hamburger menu on mobile.
- Built-in light / dark themes via CSS variables, with persisted user preference.

## Local Development

```bash
cd web
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # type-check (tsc --noEmit) + production build -> dist/
npm run preview    # preview the production build
```

## Build & Deploy

`npm run build` emits plain static files (`dist/`) that can be hosted on any static server or object storage. For GitHub Pages, push `dist/` to the `gh-pages` branch (SPA needs a 404 fallback to `index.html`).

## Security Notes

- This frontend is a **demo**: session and progress live only in the browser `localStorage`; passwords use a **non-secure hash** for local validation only.
- A real production backend is required: store passwords with `bcrypt`/`argon2` + salt, use HttpOnly cookies / short-lived tokens, and persist progress to a server database.
- The sample videos are Google's public sample clips, used only to demo the player; replace with your own CDN in production.
