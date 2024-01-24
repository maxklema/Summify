var web_url = window.location.href;
var id = "page-link"


var content = {
    web_url,
    id
}


chrome.runtime.sendMessage({ action: 'updatePopup', textContent: JSON.stringify(content) });