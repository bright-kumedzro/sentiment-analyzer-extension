// settings.js
document.getElementById('saveSettings').addEventListener('click', () => {
    const backendUrl = document.getElementById('backendUrl').value;
    chrome.storage.sync.set({backendUrl: backendUrl}, () => {
        alert('Settings saved');
    });
});

// Load saved settings
chrome.storage.sync.get('backendUrl', (data) => {
    if (data.backendUrl) {
        document.getElementById('backendUrl').value = data.backendUrl;
    }
});