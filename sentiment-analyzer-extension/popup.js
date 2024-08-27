// // popup.js

// document.addEventListener('DOMContentLoaded', function() {
//     const analyzeSelectedBtn = document.getElementById('analyzeSelected');
//     const analyzePageBtn = document.getElementById('analyzePage');
//     const resultDiv = document.getElementById('result');

//     analyzeSelectedBtn.addEventListener('click', () => {
//         chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//             chrome.tabs.sendMessage(tabs[0].id, {action: "analyzeSelected"});
//         });
//     });

//     analyzePageBtn.addEventListener('click', () => {
//         chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//             chrome.tabs.sendMessage(tabs[0].id, {action: "analyzePage"});
//         });
//     });

//     chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//         if (request.action === "updateSentiment") {
//             if (request.error) {
//                 resultDiv.textContent = `Error: ${request.error}`;
//             } else {
//                 const sentiment = request.result.label;
//                 const score = request.result.score.toFixed(2);
//                 resultDiv.textContent = `Sentiment: ${sentiment} (Score: ${score})`;
//                 resultDiv.className = sentiment.toLowerCase();
//             }
//         }
//     });
// });


// Browser compatibility
if (typeof browser === "undefined") {
    var browser = chrome;
}

// Global variables
let currentSentiment = null;

// DOM Elements
const textInput = document.getElementById('textInput');
const analyzeButton = document.getElementById('analyzeButton');
const resultDiv = document.getElementById('result');
const feedbackText = document.getElementById('feedbackText');
const accuracySlider = document.getElementById('accuracySlider');
const submitFeedbackButton = document.getElementById('submitFeedback');
const highlightButton = document.getElementById('highlightButton');

// Event listeners
document.addEventListener('DOMContentLoaded', initializePopup);

// Main functions
function initializePopup() {
    analyzeButton.addEventListener('click', handleAnalyzeClick);
    submitFeedbackButton.addEventListener('click', handleSubmitFeedbackClick);
    highlightButton.addEventListener('click', handleHighlightClick);
}

function handleAnalyzeClick() {
    const text = textInput.value;
    if (text) {
        analyzeSentiment(text);
    } else {
        alert("Please enter some text to analyze.");
    }
}

function handleSubmitFeedbackClick() {
    const feedback = feedbackText.value;
    const accuracy = accuracySlider.value / 100;
    if (feedback) {
        submitFeedback(feedback, accuracy);
    } else {
        alert("Please enter some feedback before submitting.");
    }
}

function handleHighlightClick() {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {action: "highlightSentiment"});
    });
}

// Helper functions
function analyzeSentiment(text) {
    browser.runtime.sendMessage({action: "analyzeSentiment", text: text}, (response) => {
        if (response.error) {
            resultDiv.innerHTML = `<p style="color: red;">Error: ${response.error}</p>`;
        } else {
            currentSentiment = response.label;
            resultDiv.innerHTML = `
                <h3>Sentiment Analysis Result</h3>
                <p>Label: ${response.label}</p>
                <p>Score: ${response.score.toFixed(4)}</p>
            `;
        }
    });
}

function submitFeedback(feedback, accuracy) {
    browser.runtime.sendMessage({
        action: "submitFeedback", 
        feedback: feedback,
        sentiment: currentSentiment,
        accuracy: accuracy
    }, (response) => {
        if (response.success) {
            alert("Thank you for your feedback!");
            feedbackText.value = '';
            accuracySlider.value = 50;
        } else {
            alert("Error submitting feedback. Please try again.");
        }
    });
}