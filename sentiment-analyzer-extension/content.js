
// const BACKEND_URL = 'https://localhost:5000'; 

// // Function to handle keyboard shortcuts
// function handleKeyboardShortcut(event) {
//     // Check for Ctrl+Shift+A (Windows/Linux) or Command+Shift+A (Mac)
//     if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
//         captureAndAnalyze();
//     }
// }

// // Function to create and handle context menu
// function createContextMenu() {
//     chrome.runtime.onInstalled.addListener(() => {
//         chrome.contextMenus.create({
//             id: "analyzeSentiment",
//             title: "Analyze Sentiment",
//             contexts: ["selection"]
//         });
//     });

//     chrome.contextMenus.onClicked.addListener((info, tab) => {
//         if (info.menuItemId === "analyzeSentiment") {
//             chrome.tabs.sendMessage(tab.id, {action: "analyzeSelected"});
//         }
//     });
// }

// // Listen for messages from the popup
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "analyzeSelected") {
//         captureAndAnalyze();
//     } else if (request.action === "analyzePage") {
//         const pageText = extractPageText();
//         analyzeSentiment(pageText);
//     }
// });

// // Add event listeners
// document.addEventListener('keydown', handleKeyboardShortcut);

// // Initialize context menu (this should be in a background script)
// createContextMenu();







// content.js
let selectedText = '';

document.addEventListener('mouseup', () => {
    selectedText = window.getSelection().toString().trim();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeSentiment") {
        if (selectedText) {
            analyzeSentiment(selectedText);
        } else {
            alert("Please select some text to analyze.");
        }
    }
});

function analyzeSentiment(text) {
    chrome.runtime.sendMessage({action: "analyzeSentiment", text: text}, (response) => {
        if (response.error) {
            alert(`Error: ${response.error}`);
        } else {
            displayResult(response);
        }
    });
}

function displayResult(result) {
    const resultDiv = document.createElement('div');
    resultDiv.style.position = 'fixed';
    resultDiv.style.top = '10px';
    resultDiv.style.right = '10px';
    resultDiv.style.padding = '10px';
    resultDiv.style.backgroundColor = 'white';
    resultDiv.style.border = '1px solid black';
    resultDiv.style.zIndex = '9999';
    resultDiv.innerHTML = `
        <h3>Sentiment Analysis Result</h3>
        <p>Label: ${result.label}</p>
        <p>Score: ${result.score.toFixed(4)}</p>
    `;
    document.body.appendChild(resultDiv);
    setTimeout(() => resultDiv.remove(), 5000);
}