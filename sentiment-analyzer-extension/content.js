
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




// Browser compatibility
if (typeof browser === "undefined") {
    var browser = chrome;
}

// Global variables
let selectedText = '';

// Event listeners
document.addEventListener('mouseup', handleTextSelection);

// Message listener
browser.runtime.onMessage.addListener(handleMessage);

// Main functions
function handleTextSelection() {
    selectedText = window.getSelection().toString().trim();
}

function handleMessage(request, sender, sendResponse) {
    switch (request.action) {
        case "analyzeSentiment":
            handleAnalyzeSentiment();
            break;
        case "highlightSentiment":
            highlightSentiment();
            break;
    }
}

function handleAnalyzeSentiment() {
    if (selectedText) {
        analyzeSentiment(selectedText);
    } else {
        alert("Please select some text to analyze.");
    }
}

function analyzeSentiment(text) {
    browser.runtime.sendMessage({action: "analyzeSentiment", text: text}, (response) => {
        if (response.error) {
            alert(`Error: ${response.error}`);
        } else {
            displayAdvancedResult(response);
        }
    });
}

function highlightSentiment() {
    const textNodes = document.evaluate(
        "//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null
    );

    for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i);
        if (node.textContent.trim().length > 10) {
            analyzeSentiment(node.textContent).then(result => {
                const span = document.createElement('span');
                span.textContent = node.textContent;
                span.style.backgroundColor = getColorFromSentiment(result.score);
                node.parentNode.replaceChild(span, node);
            });
        }
    }
}

// Helper functions
function displayAdvancedResult(result) {
    const resultDiv = document.createElement('div');
    resultDiv.style.position = 'fixed';
    resultDiv.style.top = '10px';
    resultDiv.style.right = '10px';
    resultDiv.style.padding = '10px';
    resultDiv.style.backgroundColor = 'white';
    resultDiv.style.border = '1px solid black';
    resultDiv.style.zIndex = '9999';
    resultDiv.style.width = '200px';

    const sentimentScore = result.score;
    const color = getColorFromSentiment(sentimentScore);

    resultDiv.innerHTML = `
        <h3>Sentiment Analysis</h3>
        <div style="background: linear-gradient(to right, red, yellow, green); height: 20px; position: relative;">
            <div style="position: absolute; left: ${sentimentScore * 100}%; transform: translateX(-50%); width: 10px; height: 30px; background-color: black;"></div>
        </div>
        <p>Label: ${result.label}</p>
        <p>Score: ${sentimentScore.toFixed(4)}</p>
        <div style="width: 100px; height: 100px; border-radius: 50%; background-color: ${color}; margin: 10px auto;"></div>
    `;

    document.body.appendChild(resultDiv);
    setTimeout(() => resultDiv.remove(), 5000);
}

function getColorFromSentiment(score) {
    const r = Math.round(255 * (1 - score));
    const g = Math.round(255 * score);
    return `rgb(${r}, ${g}, 0)`;
}