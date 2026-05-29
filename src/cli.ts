#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { htmlToMarkdown } from "./converter.js";

function printUsage(): void {
  console.log(`Usage: html2md [options] [file]

Convert HTML to Markdown.

Arguments:
  file              HTML file to convert (reads from stdin if omitted)

Options:
  --heading-style   Heading style: "atx" or "setext" (default: "atx")
  --bullet-marker   Bullet list marker: "-", "+", or "*" (default: "-")
  --code-style      Code block style: "fenced" or "indented" (default: "fenced")
  -h, --help        Show this help message`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes("-h") || args.includes("--help")) {
    printUsage();
    process.exit(0);
  }

  let headingStyle: "setext" | "atx" = "atx";
  let bulletListMarker: "-" | "+" | "*" = "-";
  let codeBlockStyle: "indented" | "fenced" = "fenced";
  let inputFile: string | undefined;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--heading-style":
        headingStyle = args[++i] as "setext" | "atx";
        break;
      case "--bullet-marker":
        bulletListMarker = args[++i] as "-" | "+" | "*";
        break;
      case "--code-style":
        codeBlockStyle = args[++i] as "indented" | "fenced";
        break;
      default:
        inputFile = args[i];
    }
  }

  let html: string;

  if (inputFile) {
    html = readFileSync(inputFile, "utf-8");
  } else if (!process.stdin.isTTY) {
    html = readFileSync(0, "utf-8");
  } else {
    printUsage();
    process.exit(1);
    return;
  }

  const markdown = htmlToMarkdown(html, {
    headingStyle,
    bulletListMarker,
    codeBlockStyle,
  });

  console.log(markdown);
}

main();
