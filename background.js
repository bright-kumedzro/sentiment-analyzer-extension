// Constants
const BACKEND_URL = 'https://sentiment-analyzer-extension.onrender.com';

// Event listeners
chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);
chrome.runtime.onMessage.addListener(handleMessage);
chrome.commands.onCommand.addListener(handleCommand);

// Main functions
function createContextMenu() {
    chrome.contextMenus.create({
        id: "analyzeSentiment",
        title: "Analyze Sentiment",
        contexts: ["selection"]
    });
}

function handleContextMenuClick(info, tab) {
    if (info.menuItemId === "analyzeSentiment") {
        chrome.tabs.sendMessage(tab.id, {action: "analyzeSelectedText"});
    }
}

function handleMessage(request, sender, sendResponse) {
    switch (request.action) {
        case "analyzeSentiment":
            analyzeSentiment(request.text, sendResponse);
            return true; // Keeps the message channel open for the async response
        case "submitFeedback":
            handleFeedbackSubmission(request.feedback, sendResponse);
            return true;
        default:
            sendResponse({error: "Unknown action"});
            return true;
    }
}

function handleCommand(command) {
    if (command === "analyze_sentiment") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "analyzePage"});
        });
    }
}

// Helper functions
function analyzeSentiment(text, sendResponse) {
    fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: text}),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => sendResponse(data))
    .catch(error => sendResponse({error: error.message}));
}

function handleFeedbackSubmission(feedback, sendResponse) {
    // In a real-world scenario, you'd send this to your backend
    console.log("Feedback received:", feedback);
    // For now, we'll just simulate a successful submission
    sendResponse({success: true});
}
