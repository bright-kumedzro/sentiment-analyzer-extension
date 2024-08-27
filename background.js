
// function createContextMenu() {
//     chrome.contextMenus.create({
//         id: "analyzeSentiment",
//         title: "Analyze Sentiment",
//         contexts: ["selection"]
//     });
// }

// chrome.runtime.onInstalled.addListener(createContextMenu);

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === "analyzeSentiment") {
//         chrome.tabs.sendMessage(tab.id, {action: "test"});
//     }
// });


// Browser compatibility
if (typeof browser === "undefined") {
    var browser = chrome;
}

// Constants
const BACKEND_URL = 'https://sentiment-analyzer-extension.onrender.com';

// Event listeners
browser.runtime.onInstalled.addListener(createContextMenu);
browser.contextMenus.onClicked.addListener(handleContextMenuClick);
browser.runtime.onMessage.addListener(handleMessage);
browser.commands.onCommand.addListener(handleCommand);

// Main functions
function createContextMenu() {
    browser.contextMenus.create({
        id: "analyzeSentiment",
        title: "Analyze Sentiment",
        contexts: ["selection"]
    });
}

function handleContextMenuClick(info, tab) {
    if (info.menuItemId === "analyzeSentiment") {
        browser.tabs.sendMessage(tab.id, {action: "analyzeSentiment"});
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
    }
}

function handleCommand(command) {
    if (command === "analyze_sentiment") {
        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {action: "analyzeSentiment"});
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
    .then(response => response.json())
    .then(data => sendResponse(data))
    .catch(error => sendResponse({error: error.message}));
}

function handleFeedbackSubmission(feedback, sendResponse) {
    // In a real-world scenario, you'd send this to your backend
    console.log("Feedback received:", feedback);
    // For now, we'll just simulate a successful submission
    sendResponse({success: true});
}