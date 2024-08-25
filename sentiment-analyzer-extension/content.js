
const BACKEND_URL = 'https://localhost:5000'; 

// Function to handle keyboard shortcuts
function handleKeyboardShortcut(event) {
    // Check for Ctrl+Shift+A (Windows/Linux) or Command+Shift+A (Mac)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        captureAndAnalyze();
    }
}

// Function to create and handle context menu
function createContextMenu() {
    chrome.runtime.onInstalled.addListener(() => {
        chrome.contextMenus.create({
            id: "analyzeSentiment",
            title: "Analyze Sentiment",
            contexts: ["selection"]
        });
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === "analyzeSentiment") {
            chrome.tabs.sendMessage(tab.id, {action: "analyzeSelected"});
        }
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeSelected") {
        captureAndAnalyze();
    } else if (request.action === "analyzePage") {
        const pageText = extractPageText();
        analyzeSentiment(pageText);
    }
});

// Add event listeners
document.addEventListener('keydown', handleKeyboardShortcut);

// Initialize context menu (this should be in a background script)
createContextMenu();