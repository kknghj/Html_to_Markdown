import TurndownService from "turndown";

export interface ConvertOptions {
  headingStyle?: "setext" | "atx";
  bulletListMarker?: "-" | "+" | "*";
  codeBlockStyle?: "indented" | "fenced";
  emDelimiter?: "_" | "*";
  strongDelimiter?: "__" | "**";
  linkStyle?: "inlined" | "referenced";
}

const defaultOptions: ConvertOptions = {
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined",
};

export function createConverter(options: ConvertOptions = {}): TurndownService {
  const mergedOptions = { ...defaultOptions, ...options };
  return new TurndownService(mergedOptions);
}

export function htmlToMarkdown(
  html: string,
  options: ConvertOptions = {}
): string {
  const converter = createConverter(options);
  return converter.turndown(html);
}
