# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js (App Router) web app that converts HTML to Markdown, using Turndown with GFM support. All conversion runs client-side — no server API.

### Commands

All commands use `pnpm` (not npm). See `package.json` scripts and `README.md` for full details.

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` → `http://localhost:3000` |
| Lint | `pnpm lint` |
| Build | `pnpm build` |
| Start (prod) | `pnpm start` |

### Notes

- Tailwind CSS v4 is used via `@tailwindcss/postcss` (configured in `postcss.config.mjs`).
- The converter logic lives in `src/lib/markdownConverter.ts` and uses a singleton `TurndownService` with GFM plugin.
- No automated tests exist yet. Verify changes by running `pnpm dev` and testing in the browser.
