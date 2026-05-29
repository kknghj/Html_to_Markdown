# Html_to_Markdown

A TypeScript library and CLI tool for converting HTML to Markdown.

## Installation

```bash
pnpm install
```

## Usage

### As a library

```typescript
import { htmlToMarkdown } from "html-to-markdown";

const markdown = htmlToMarkdown("<h1>Hello</h1><p>World</p>");
console.log(markdown);
// # Hello
//
// World
```

### As a CLI

```bash
# Build first
pnpm run build

# Convert from file
node dist/cli.js input.html

# Convert from stdin
echo '<h1>Hello</h1>' | node dist/cli.js
```

## Development

```bash
pnpm run lint       # Lint
pnpm run typecheck  # Type check
pnpm run test       # Run tests
pnpm run build      # Build
```
