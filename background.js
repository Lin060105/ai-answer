const MESSAGE_TYPES = {
  CAPTURE_VISIBLE_TAB: "AI_HELPER_CAPTURE_VISIBLE_TAB",
  START_CAPTURE: "AI_HELPER_START_CAPTURE"
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== MESSAGE_TYPES.CAPTURE_VISIBLE_TAB) {
    return false;
  }

  chrome.tabs.captureVisibleTab(
    sender.tab && sender.tab.windowId ? sender.tab.windowId : undefined,
    { format: "png" },
    (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({
          ok: false,
          error: chrome.runtime.lastError.message || "Unable to capture the current tab."
        });
        return;
      }

      sendResponse({
        ok: true,
        dataUrl
      });
    }
  );

  return true;
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== "start-capture") {
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs && tabs[0];
    if (!activeTab || !activeTab.id) {
      return;
    }

    chrome.tabs.sendMessage(activeTab.id, {
      type: MESSAGE_TYPES.START_CAPTURE
    });
  });
});
