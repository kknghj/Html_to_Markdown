# AGENTS.md

## Cursor Cloud specific instructions

This is a TypeScript library/CLI for converting HTML to Markdown, built on [turndown](https://github.com/mixmark-io/turndown).

### Commands

All commands use `pnpm` (not npm):

| Task | Command |
|------|---------|
| Install deps | `pnpm install` |
| Lint | `pnpm run lint` |
| Type check | `pnpm run typecheck` |
| Test | `pnpm run test` |
| Build | `pnpm run build` |
| Watch mode (TS) | `pnpm run dev` |

### Notes

- The project uses ESM (`"type": "module"` in `package.json`) — imports must use `.js` extensions even for `.ts` source files.
- The `turndown` library adds extra spaces in list items (e.g., `-   Item` instead of `- Item`). This is expected behavior, not a bug.
- After building, the CLI can be tested with: `echo '<h1>Test</h1>' | node dist/cli.js`
