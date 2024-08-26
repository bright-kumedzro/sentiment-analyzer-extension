
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






// background.js
const BACKEND_URL = 'https://sentiment-analyzer-extension.onrender.com';

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
        chrome.tabs.sendMessage(tab.id, {action: "analyzeSentiment"});
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeSentiment") {
        fetch(`${BACKEND_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: request.text}),
        })
        .then(response => response.json())
        .then(data => sendResponse(data))
        .catch(error => sendResponse({error: error.message}));
        return true; // Keeps the message channel open for the async response
    }
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "analyze_sentiment") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "analyzeSentiment"});
        });
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "submitFeedback") {
        // In a real-world scenario, you'd send this to your backend
        console.log("Feedback received:", request.feedback);
        // For now, we'll just simulate a successful submission
        sendResponse({success: true});
    }
});