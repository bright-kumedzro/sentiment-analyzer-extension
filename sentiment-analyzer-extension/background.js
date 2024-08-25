
function createContextMenu() {
    chrome.contextMenus.create({
        id: "analyzeSentiment",
        title: "Analyze Sentiment",
        contexts: ["selection"]
    });
}

chrome.runtime.onInstalled.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "analyzeSentiment") {
        chrome.tabs.sendMessage(tab.id, {action: "test"});
    }
});