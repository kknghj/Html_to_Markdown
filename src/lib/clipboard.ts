import { convertSourceToMarkdown } from "./markdownConverter";

export type ClipboardPayload = {
  source: string;
  markdown: string;
};

export async function readClipboardPayload(): Promise<ClipboardPayload | null> {
  if (!navigator.clipboard?.read) {
    const plain = await readPlainTextFallback();
    if (!plain) {
      return null;
    }
    return { source: plain, markdown: convertSourceToMarkdown(plain) };
  }

  try {
    const items = await navigator.clipboard.read();
    let html = "";
    let plain = "";

    for (const item of items) {
      if (!html && item.types.includes("text/html")) {
        const blob = await item.getType("text/html");
        html = await blob.text();
      }
      if (!plain && item.types.includes("text/plain")) {
        const blob = await item.getType("text/plain");
        plain = await blob.text();
      }
    }

    if (html.trim()) {
      return {
        source: html,
        markdown: convertSourceToMarkdown(html),
      };
    }

    if (plain.trim()) {
      return {
        source: plain,
        markdown: convertSourceToMarkdown(plain),
      };
    }

    return null;
  } catch {
    const plain = await readPlainTextFallback();
    if (!plain) {
      return null;
    }
    return { source: plain, markdown: convertSourceToMarkdown(plain) };
  }
}

async function readPlainTextFallback(): Promise<string> {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return "";
  }
}

export async function copyMarkdownToClipboard(markdown: string): Promise<void> {
  await navigator.clipboard.writeText(markdown);
}
