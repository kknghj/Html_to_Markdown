/**
 * MV3 background service worker.
 * Reserved for future features (context menus, shortcuts, page extraction).
 */

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.info("[AI→MD] Extension installed");
    return;
  }
  if (details.reason === "update") {
    console.info("[AI→MD] Extension updated to", chrome.runtime.getManifest().version);
  }
});
