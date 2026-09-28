# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (type-check is part of build; use it to verify changes)
- `npm run lint` — ESLint
- `npm run preview` — preview production build

No test suite exists.

## Stack

React 19 + TypeScript + Vite 8 with React Compiler (babel preset in `vite.config.ts`). Tailwind v4 (no `tailwind.config.js`; config/custom classes in `src/index.css`, e.g. `main_title`, `form`, `text_form_field`). TanStack Query for server state, Redux Toolkit only for auth (`auth` slice in `src/features/login/slices`). react-hook-form for forms, zod v4 for response validation, sonner for toasts. Deployed on Vercel (SPA rewrite in `vercel.json`).

Path alias `@` → `src`. Backend URL from `VITE_BASE_URL` (`.env`).

## Architecture

Feature-based clean architecture under `src/features/<feature>/`, each with three layers:

- `domain/` — `datasources/` and `repositories/` as **abstract classes**, `schemas/` (zod, response schemas extend shared `ApiResponseSchema` {statusCode, message}), `types/` (`z.infer` of schemas), `interfaces/` (payloads, filters).
- `infrastructure/` — `XDatasourceImpl` (takes `AxiosInstance`, does HTTP calls, `safeParse`s responses, maps axios errors to `DomainError` subclasses in `errors/`), `XRepositoryImpl` (thin pass-through to datasource), `utils/` (e.g. mapping entities to select `Option[]`).
- `presentation/` — `providers/XProvider.ts` (wraps repository) plus a wiring file (e.g. `dcsRepositoryProvider.ts`) that instantiates `datasource → repository → provider` singleton with the shared `api` axios instance; `screens/` consume the provider singleton via `useQuery`/`useMutation`; `components/`.

Every folder has a barrel file (`domain/domain.ts`, `presentation/components/components.ts`, etc.) and each feature exposes a top-level barrel (`src/features/dc/dc.ts`). Import from the feature barrel (`@/features/dc/dc`), and when adding a file, export it from its folder barrel. Adding a method to an endpoint means touching all layers: abstract datasource, abstract repository, impl datasource, impl repository, provider.

`features/shared` holds cross-feature UI (form fields, `Table`, `Modal`, `Pagination`), `DomainError`, `useNotification` (sonner via `NotificationProvider`), layouts, and `RoleMiddleware`.

### Auth & routing

- `src/config/http/axios.ts` attaches `Bearer` token from `localStorage.AUTH_TOKEN`.
- `AppInitializer` (in `shared/core`) refreshes token on load and dispatches `login`/`logout` to Redux before rendering the router.
- `src/router.tsx`: `PublicLayout` / `ProtectedLayout`; role-gated routes wrapped in `<RoleMiddleware allowedRoles={[...]} />` (roles: `admin`, `administrator`).

### Conventions

- After mutations, invalidate relevant query keys (e.g. `['getDcs']`, `['getPaginatedDcs']`) — keys are named after provider methods.
- Paginated endpoints take `{ limit, offset, filters }` and serialize filters via `URLSearchParams`.

`docs/frontend-discovery.md` has a (Spanish) deeper analysis of the stack and containers module.
