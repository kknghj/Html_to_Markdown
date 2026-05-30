import {
  CONTENT_SCRIPT_PING,
  COPY_SELECTION_MESSAGE,
} from "../lib/messages";

export const COPY_SELECTION_AS_MARKDOWN_MENU_ID = "copy-selection-as-markdown";

const PING_RETRY_MS = 50;
const PING_MAX_ATTEMPTS = 20;

export function registerContextMenus(): void {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create(
      {
        id: COPY_SELECTION_AS_MARKDOWN_MENU_ID,
        title: "Copy Selection as Markdown",
        contexts: ["selection"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            "[AI→MD] Failed to create context menu:",
            chrome.runtime.lastError.message,
          );
        }
      },
    );
  });
}

function getContentScriptFiles(): string[] {
  const manifest = chrome.runtime.getManifest();
  const files = manifest.content_scripts?.flatMap((entry) => entry.js ?? []);
  if (!files?.length) {
    throw new Error("Content script is not configured in manifest.json");
  }
  return files;
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function pingContentScript(tabId: number): Promise<boolean> {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      type: CONTENT_SCRIPT_PING,
    });
    return response?.ready === true;
  } catch {
    return false;
  }
}

async function ensureContentScriptReady(tabId: number): Promise<void> {
  if (await pingContentScript(tabId)) {
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId },
    files: getContentScriptFiles(),
  });

  for (let attempt = 0; attempt < PING_MAX_ATTEMPTS; attempt += 1) {
    if (await pingContentScript(tabId)) {
      return;
    }
    await delay(PING_RETRY_MS);
  }

  throw new Error("Content script failed to initialize");
}

export async function handleContextMenuClick(
  menuItemId: string | number,
  tab: chrome.tabs.Tab | undefined,
): Promise<void> {
  if (menuItemId !== COPY_SELECTION_AS_MARKDOWN_MENU_ID || !tab?.id) {
    return;
  }

  try {
    await ensureContentScriptReady(tab.id);

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: COPY_SELECTION_MESSAGE,
    });

    if (response?.success) {
      await showCopiedBadge(tab.id);
    }
  } catch (error) {
    console.error("[AI→MD] Could not copy selection on this page:", error);
  }
}

async function showCopiedBadge(tabId: number): Promise<void> {
  try {
    await chrome.action.setBadgeText({ tabId, text: "MD" });
    await chrome.action.setBadgeBackgroundColor({ tabId, color: "#059669" });
    setTimeout(() => {
      void chrome.action.setBadgeText({ tabId, text: "" });
    }, 1500);
  } catch {
    // Badge is optional feedback; ignore failures on restricted pages.
  }
}
