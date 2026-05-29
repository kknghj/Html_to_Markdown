# AGENTS.md

## Cursor Cloud specific instructions

Chrome Extension (Manifest V3) that converts HTML from copied AI answers to Markdown using Turndown with GFM support. Conversion runs in the popup — no server API.

### Commands

All commands use `pnpm` (not npm).

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Dev (watch + HMR) | `pnpm dev` |
| Lint | `pnpm lint` |
| Build extension | `pnpm build` → output in `dist/` |

### Load in Chrome

1. Run `pnpm build`
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. **Load unpacked** → select the `dist/` folder

### Notes

- Vite + `@crxjs/vite-plugin` bundles popup and MV3 service worker.
- Converter logic: `src/lib/markdownConverter.ts` (singleton Turndown + GFM).
- Popup state persists via `chrome.storage.local` in `src/lib/storage.ts`.
- No automated tests yet. Verify with `pnpm build` and manual testing in Chrome.
