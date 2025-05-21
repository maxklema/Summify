// src/background/background.js

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["dist/bundle.js", "src/content/grabWebURL.js", "dist/bundle2.js"],
        allFrames: true
    });
});

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponce) {

    if (request.action === 'updatePopup') {
        //update HTML content!
        chrome.action.setPopup({ popup: 'src/popup/summify.html'});
    }

    if (request.action === 'getTranscripts'){
        const response = await fetch(`https://youtube.com/watch?v=${request.textContent}`);
        const data = await response.text();
        const regex = /"captionTracks":(\[.*?\])/;
        const regexResult = regex.exec(data);
        const [_, captionTracksJson] = regexResult;
        const captionTracks = JSON.parse(captionTracksJson);
        const URL = decodeURI(captionTracks[0].baseUrl)
        console.log("URL: " + URL)


        const newResponse = await fetch(URL)
        const newData = await newResponse.text();
        console.log("NEW DATA: " + newData)
    }



});


