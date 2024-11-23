var web_url = window.location.href;
var id = "page-link"

var content = {
    web_url,
    id,
}

chrome.runtime.sendMessage({ action: 'updatePopup', textContent: JSON.stringify(content) }, function() {
    // This callback function will be called after the 'getLanguage' message is sent
    chrome.runtime.sendMessage({ action: 'getLanguage' });
    chrome.runtime.sendMessage({ action: 'getMode' });
});
