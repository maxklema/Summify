// src/background/background.js

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["dist/bundle.js", "src/content/grabWebURL.js", "dist/bundle2.js"],
        allFrames: true
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponce) {

    if (request.action === 'updatePopup') {

        //update HTML content!
        chrome.action.setPopup({ popup: 'src/popup/summify.html'});

    }

});


