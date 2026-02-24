# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Vue 3 + Element Plus admin dashboard SPA (`vue-element-plus-admin`). Pure frontend — no backend in this repo. Uses pnpm, Vite, TypeScript 5.7, and Vue Router.

### Common commands

See `package.json` scripts. Key ones:

| Task                   | Command            |
| ---------------------- | ------------------ |
| Install deps           | `pnpm install`     |
| Dev server (port 4000) | `pnpm dev`         |
| Build (dev mode)       | `pnpm build:dev`   |
| Build (production)     | `pnpm build:pro`   |
| ESLint                 | `pnpm lint:eslint` |
| Stylelint              | `pnpm lint:style`  |
| Prettier               | `pnpm lint:format` |
| TypeScript check       | `pnpm ts:check`    |

### Non-obvious caveats

- The dev server (`pnpm dev`) runs on **port 4000** (not the Vite default 5173). It binds to `0.0.0.0`.
- API calls proxy to `http://localhost:8000`. The backend (Go/Fiber + PostgreSQL) is **not** included in this repo. Without it, the app renders the login page but login/auth calls return network errors — this is expected.
- The `--mode base` flag in `pnpm dev` loads `.env.base`. Other modes (`.env.dev`, `.env.test`, `.env.pro`) point to different API URLs.
- Husky git hooks run `lint-staged` on pre-commit (ESLint + Prettier + Stylelint) and a test script on pre-push (currently a no-op echo).
- `pnpm build:dev` outputs to `dist-dev/`, `pnpm build:pro` outputs to `dist-pro/`.
- The `pinia-plugin-persistedstate` peer dependency warning (`>=3.0.0` vs installed `2.3.1`) is cosmetic and does not affect functionality.
