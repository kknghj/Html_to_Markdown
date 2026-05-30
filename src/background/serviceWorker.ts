import {
  handleContextMenuClick,
  registerContextMenus,
} from "./contextMenu";

registerContextMenus();

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.info("[AI→MD] Extension installed");
    return;
  }
  if (details.reason === "update") {
    console.info("[AI→MD] Extension updated to", chrome.runtime.getManifest().version);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  void handleContextMenuClick(info.menuItemId, tab);
});
