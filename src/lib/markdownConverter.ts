import TurndownService from "turndown";
import { gfm } from "@truto/turndown-plugin-gfm";

let turndownService: TurndownService | null = null;

function getTurndownService(): TurndownService {
  if (!turndownService) {
    turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
      emDelimiter: "*",
      strongDelimiter: "**",
    });
    turndownService.use(gfm);
  }
  return turndownService;
}

export function convertHtmlToMarkdown(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) {
    return "";
  }
  return getTurndownService().turndown(trimmed);
}

export function convertPlainTextToMarkdown(text: string): string {
  return text.trim();
}

export function looksLikeHtml(value: string): boolean {
  const trimmed = value.trim();
  return /<[a-z][\s\S]*>/i.test(trimmed);
}

export function convertSourceToMarkdown(source: string): string {
  const trimmed = source.trim();
  if (!trimmed) {
    return "";
  }
  return looksLikeHtml(trimmed)
    ? convertHtmlToMarkdown(trimmed)
    : convertPlainTextToMarkdown(trimmed);
}
