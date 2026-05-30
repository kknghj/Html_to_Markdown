import {
  convertHtmlToMarkdown,
  convertPlainTextToMarkdown,
} from "../lib/markdownConverter";
import {
  CONTENT_SCRIPT_PING,
  COPY_SELECTION_MESSAGE,
} from "../lib/messages";
import { getSelectionHtml } from "./getSelectionHtml";

const CONTENT_SCRIPT_GUARD = "__aiMdContentScriptLoaded";

async function copySelectionAsMarkdown(): Promise<void> {
  const html = getSelectionHtml().trim();
  const plainText = window.getSelection()?.toString().trim() ?? "";

  if (!html && !plainText) {
    console.warn("[AI→MD] No selection to convert");
    return;
  }

  const markdown = html
    ? convertHtmlToMarkdown(html)
    : convertPlainTextToMarkdown(plainText);

  if (!markdown.trim()) {
    console.warn("[AI→MD] Selection produced empty Markdown");
    return;
  }

  try {
    await navigator.clipboard.writeText(markdown);
    console.info("[AI→MD] Selection copied as Markdown");
  } catch (error) {
    console.error("[AI→MD] Failed to write Markdown to clipboard:", error);
    throw error;
  }
}

function registerMessageListener(): void {
  const globalScope = globalThis as typeof globalThis & {
    [CONTENT_SCRIPT_GUARD]?: boolean;
  };

  if (globalScope[CONTENT_SCRIPT_GUARD]) {
    return;
  }
  globalScope[CONTENT_SCRIPT_GUARD] = true;

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === CONTENT_SCRIPT_PING) {
      sendResponse({ ready: true });
      return false;
    }

    if (message?.type !== COPY_SELECTION_MESSAGE) {
      return false;
    }

    void copySelectionAsMarkdown()
      .then(() => sendResponse({ success: true }))
      .catch((error: unknown) => {
        console.error("[AI→MD] Copy selection failed:", error);
        sendResponse({ success: false });
      });

    return true;
  });
}

registerMessageListener();
