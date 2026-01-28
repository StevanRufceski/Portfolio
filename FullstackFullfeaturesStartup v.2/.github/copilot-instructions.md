# Copilot / AI Agent Instructions for FullstackFullfeaturesStartup

Purpose: Help AI coding agents become productive quickly with repository-specific patterns, run/debug commands, and important integration points.

- Big picture: This repo is a two-part TypeScript fullstack app.
  - Frontend: Vite + React + TypeScript in `client/` (dev: `vite`, build: `tsc -b && vite build`). See [client/package.json](client/package.json).
  - Backend: Node + Express + TypeScript in `server/` (dev: `ts-node-dev`, build: `tsc`). See [server/package.json](server/package.json) and [server/src/app.ts](server/src/app.ts).

- Run / build / debug commands (project-specific):
  - Frontend (from `client/`): `npm run dev` (Vite), `npm run build`, `npm run preview`.
  - Backend (from `server/`): `npm run dev` (uses `ts-node-dev --respawn --transpile-only src/server.ts`), `npm run build` (tsc), `npm start` (node dist/server.js).
  - Typical local flow: Run server dev, then client dev (ensure `VITE_API_URL` points to backend).

- Env & secrets:
  - Frontend expects `VITE_API_URL` (used in `client/src/api/axios.ts`).
  - Backend reads `.env` variables defined in `server/src/config/env.ts`: `PORT`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`.

- API & auth contract (critical):
  - Login endpoint: `POST /auth/login` returns `{ accessToken, refreshToken, user }`. Frontend stores `accessToken` and `refreshToken` in `localStorage` and sets Authorization header.
  - Token handling and refresh logic live in `client/src/api/axios.ts` (axios instance):
    - Uses `import.meta.env.VITE_API_URL` as baseURL.
    - Attaches `Authorization: Bearer <accessToken>` from `localStorage` on requests.
    - Intercepts 401s and runs a single refresh flow with a queue to re-run failed requests. If refresh fails, it clears storage and navigates to `/login`.
  - Authentication context lives in `client/src/context/AuthContext.tsx` — important patterns:
    - `login()` stores tokens and sets `user` state when `res.data.accessToken` and `res.data.user` exist.
    - On mount it decodes the JWT payload with `atob(parts[1])` and sets `user` with `{ id, role }` if present.
    - `logout()` sends refresh to `/auth/logout` if present and then clears localStorage.

- Code locations to inspect for changes:
  - Frontend entry and major code: `client/src/` (routes, components, contexts). Start with `client/src/context/AuthContext.tsx` and `client/src/api/axios.ts` for auth/API tasks.
  - Backend main: `server/src/app.ts`, `server/src/server.ts`, `server/src/routes/*` (auth routes in `auth.routes`).
  - Env/config: `server/src/config/env.ts`.

- Conventions and patterns to follow (discoverable):
  - TypeScript-first: prefer adding/adjusting `.ts/.tsx` types rather than casting to `any`.
  - Tokens stored in `localStorage` — any change to token names must be reflected in both axios instance and `AuthContext`.
  - Single-refresh logic: respect the `refreshing` + `queue` pattern in `client/src/api/axios.ts` when modifying request retry logic.
  - Keep backend routes mounted under `/auth` and `/protected` as in `server/src/app.ts`.

- Linting / formatting:
  - Frontend has ESLint configured; run `npm run lint` in `client/` to check style.

- Tests:
  - No tests detected in this project. Avoid adding heavy test infra without owner approval; small unit tests are acceptable if they follow the repo's TypeScript config.

- Debugging tips:
  - Backend: use `npm run dev` (server) — `ts-node-dev` restarts on changes and prints useful stack traces.
  - Frontend: `vite` dev server with HMR; use browser devtools to inspect network requests for token headers.
  - To reproduce auth refresh issues: expire `accessToken` manually or remove it and perform a protected request to observe the axios refresh queue.

- PR & change guidance for AI agents:
  - Small, focused changes per PR. Include which scripts or env vars must be updated.
  - When changing auth/token names or refresh behavior, update both `client/src/api/axios.ts` and `client/src/context/AuthContext.tsx` and search for `accessToken`/`refreshToken` across the repo.

- Files for human reviewers to verify quickly:
  - [client/src/context/AuthContext.tsx](client/src/context/AuthContext.tsx)
  - [client/src/api/axios.ts](client/src/api/axios.ts)
  - [client/package.json](client/package.json)
  - [server/package.json](server/package.json)
  - [server/src/app.ts](server/src/app.ts)
  - [server/src/config/env.ts](server/src/config/env.ts)

If anything above is unclear or you want me to expand a section (e.g., call/response examples or add checklist items for PRs), tell me which area to iterate on.