chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("brave://")) {
    return;
  }

  try {
    // 1. Inject the compiled lens.min.js bundle
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["lens.min.js"],
    });

    // 2. Toggle the Floating HUD
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (window.Lens) {
          if (window.Lens.getState().mounted) {
            window.Lens.off();
          } else {
            window.Lens.mount({ position: "bottom-right" });
          }
        }
      },
    });
  } catch (err) {
    console.error("Aperture extension injection failed:", err);
  }
});