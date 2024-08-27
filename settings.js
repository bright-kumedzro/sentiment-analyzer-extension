// // settings.js
// document.getElementById('saveSettings').addEventListener('click', () => {
//     const backendUrl = document.getElementById('backendUrl').value;
//     chrome.storage.sync.set({backendUrl: backendUrl}, () => {
//         alert('Settings saved');
//     });
// });

// // Load saved settings
// chrome.storage.sync.get('backendUrl', (data) => {
//     if (data.backendUrl) {
//         document.getElementById('backendUrl').value = data.backendUrl;
//     }
// });






document.addEventListener('DOMContentLoaded', () => {
    // Retrieve settings from Chrome storage and update UI elements
    chrome.storage.sync.get(['autoAnalyze', 'minLength'], (items) => {
        document.getElementById('autoAnalyze').checked = items.autoAnalyze || false;
        document.getElementById('minLength').value = items.minLength || 10;
    });
});

document.getElementById('saveButton').addEventListener('click', () => {
    // Retrieve settings from UI elements and save to Chrome storage
    const autoAnalyze = document.getElementById('autoAnalyze').checked;
    const minLength = parseInt(document.getElementById('minLength').value);

    chrome.storage.sync.set({autoAnalyze, minLength}, () => {
        const status = document.getElementById('status');
        status.textContent = 'Settings saved.';
        status.style.color = '#28a745'; // Success color
        setTimeout(() => {
            status.textContent = '';
        }, 2000);
    });
});






