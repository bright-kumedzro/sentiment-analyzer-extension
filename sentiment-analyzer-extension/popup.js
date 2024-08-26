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





// popup.js
document.getElementById('analyzeButton').addEventListener('click', () => {
    const text = document.getElementById('textInput').value;
    if (text) {
        chrome.runtime.sendMessage({action: "analyzeSentiment", text: text}, (response) => {
            const resultDiv = document.getElementById('result');
            if (response.error) {
                resultDiv.innerHTML = `<p style="color: red;">Error: ${response.error}</p>`;
            } else {
                resultDiv.innerHTML = `
                    <h3>Sentiment Analysis Result</h3>
                    <p>Label: ${response.label}</p>
                    <p>Score: ${response.score.toFixed(4)}</p>
                `;
            }
        });
    } else {
        alert("Please enter some text to analyze.");
    }
});

document.getElementById('submitFeedback').addEventListener('click', () => {
    const feedback = document.getElementById('feedbackText').value;
    if (feedback) {
        chrome.runtime.sendMessage({action: "submitFeedback", feedback: feedback}, (response) => {
            if (response.success) {
                alert("Thank you for your feedback!");
                document.getElementById('feedbackText').value = '';
            } else {
                alert("Error submitting feedback. Please try again.");
            }
        });
    } else {
        alert("Please enter some feedback before submitting.");
    }
});