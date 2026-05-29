export type ExtensionState = {
  input: string;
  markdown: string;
};

const STORAGE_KEY = "extensionState";

const EMPTY_STATE: ExtensionState = {
  input: "",
  markdown: "",
};

export async function loadExtensionState(): Promise<ExtensionState> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY];
  if (!isExtensionState(stored)) {
    return { ...EMPTY_STATE };
  }
  return stored;
}

export async function saveExtensionState(state: ExtensionState): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: state });
}

export async function clearExtensionState(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY);
}

function isExtensionState(value: unknown): value is ExtensionState {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.input === "string" && typeof record.markdown === "string"
  );
}
