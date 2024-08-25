// popup.js

document.addEventListener('DOMContentLoaded', function() {
    const analyzeSelectedBtn = document.getElementById('analyzeSelected');
    const analyzePageBtn = document.getElementById('analyzePage');
    const resultDiv = document.getElementById('result');

    analyzeSelectedBtn.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "analyzeSelected"});
        });
    });

    analyzePageBtn.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "analyzePage"});
        });
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "updateSentiment") {
            if (request.error) {
                resultDiv.textContent = `Error: ${request.error}`;
            } else {
                const sentiment = request.result.label;
                const score = request.result.score.toFixed(2);
                resultDiv.textContent = `Sentiment: ${sentiment} (Score: ${score})`;
                resultDiv.className = sentiment.toLowerCase();
            }
        }
    });
});