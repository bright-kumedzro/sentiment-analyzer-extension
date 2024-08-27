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






// settings.js
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['autoAnalyze', 'minLength'], (items) => {
        document.getElementById('autoAnalyze').checked = items.autoAnalyze || false;
        document.getElementById('minLength').value = items.minLength || 10;
    });
});

document.getElementById('saveButton').addEventListener('click', () => {
    const autoAnalyze = document.getElementById('autoAnalyze').checked;
    const minLength = parseInt(document.getElementById('minLength').value);

    chrome.storage.sync.set({autoAnalyze, minLength}, () => {
        const status = document.getElementById('status');
        status.textContent = 'Settings saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 2000);
    });
});