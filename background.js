/**
 * ╔═════════════════════════════════════════╗
 * ║                                         ║
 * ║ ██╗   ██╗ █████╗ ███████╗██╗██████╗     ║
 * ║ ╚██╗ ██╔╝██╔══██╗██╔════╝██║██╔══██╗    ║
 * ║  ╚████╔╝ ███████║███████╗██║██████╔╝    ║
 * ║   ╚██╔╝  ██╔══██║╚════██║██║██╔══██╗    ║
 * ║    ██║   ██║  ██║███████║██║██║  ██║    ║
 * ║    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝    ║
 * ║                                         ║
 * ║             YASIR KAYAALP               ║
 * ║           yasirkayaalp.link             ║
 * ║                                         ║
 * ╚═════════════════════════════════════════╝
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "kaydetVeriler") {
    chrome.storage.local.get({veriler: []}, (result) => {
      const yeniVeriler = [...result.veriler, ...message.veriler];
      const benzersizVeriler = yeniVeriler.filter((veri, index, self) =>
        index === self.findIndex((t) => t.eposta === veri.eposta)
      );
      chrome.storage.local.set({veriler: benzersizVeriler});
    });
  }
});
