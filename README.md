# Barangay Resident Portal

A resident-facing portal for barangay services, built with Next.js 15 (App
Router) and React 19. The interface uses glassmorphic surfaces over an ambient
gradient canvas, with Framer Motion driving page transitions, shared-element
animations, and micro-interactions.

> **Status:** Front-end only. All data is currently mocked in-module. See
> [Data & API](#data--api) for what needs wiring up.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| UI runtime | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss` |
| Animation | Framer Motion |
| Icons | lucide-react |
| Class merging | `clsx` + `tailwind-merge` |

## Getting started

Requires **Node.js 20+** (developed against v24).

```bash
npm install     # install dependencies
npm run dev     # start dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

### Type checking

```bash
npx tsc --noEmit
```

### Don't run `build` while `dev` is active

Both processes write to `.next/`, and interleaving them corrupts the output -
symptoms include `Cannot find module './922.js'` and similar missing-chunk
runtime errors. If you hit one, stop the dev server and delete `.next` before
rebuilding.

## Routes

| Route | Description |
| --- | --- |
| `/` | Redirects to `/login` |
| `/login` | Mock sign-in; pushes to `/dashboard` |
| `/dashboard` | Bento dashboard: spotlight hero, quick actions, LGU stats, announcement marquee, active-request pass, hotline tile |
| `/services` | Four-step document request flow (select → details → review → success) |
| `/track` | Request list with search/filter, vertical stage timeline, QR pick-up pass |
| `/reports` | Incident & blotter reporting form with confidentiality certification |
| `/profile` | Digital resident ID card, contact details, preferences, sign out |

The floating `BottomNav` dock is rendered in the root layout and hides itself on
`/` and `/login`.

## Project structure

```
src/
  app/
    layout.tsx          Root layout, ambient background orbs, theme script
    globals.css         Tailwind v4 entry + shimmer keyframes
    login|dashboard|services|track|reports|profile/page.tsx
  components/
    BottomNav.tsx       Floating glass dock with layoutId active pill
    Skeleton.tsx        Theme-aware skeleton primitives
  hooks/
    useAsyncData.ts     Loading-state wrapper for future API calls
  lib/
    utils.ts            cn() class-name helper
```

## Theming

Dark mode is **the default** for first-time visitors, and is persisted to
`localStorage` under the `theme` key once the user picks a theme. The portal
does not follow the OS `prefers-color-scheme` setting.

A blocking script in `layout.tsx` runs **before hydration** to apply the
stored theme (or the dark default), which prevents a flash of the wrong
background. The toggle lives on `/profile`.

> Use the class variant, not a `prefers-color-scheme` media query - the two are
> configured independently in this project.

## Data & API

Every page currently renders module-level mock data. Nothing performs a network
request yet.

`src/hooks/useAsyncData.ts` exists to make the loading UI real in the meantime.
It returns `{ data, isLoading }` with unmount cancellation. To connect a real
backend, replace the loader body with your `fetch` call and delete the
artificial delay - the `isLoading` contract stays the same.

`/dashboard`, `/track`, and `/profile` render theme-aware skeletons while
loading. `/services`, `/reports`, and `/login` have no loading state because
they render instantly.

Submit handlers on `/services` and `/reports` simulate network latency with
`setTimeout`; replace those with real calls.

## Local-only files

`.clinerules` and everything under `assets/` except `logo.png` are ignored via
`.gitignore` - they are local tooling config and private files, not project
source.
