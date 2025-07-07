document.getElementById("summarizeBtn").addEventListener("click", getSummaryType);
document.getElementById("copy-text-button").addEventListener("click", copyText);

function getText(contentData) {
    var selectElement = document.getElementById('summary-length-select');
    var optionSelected = selectElement.selectedIndex;
    var Language = document.getElementById("summary-type-select").value;

    if (Language == "auto"){
        Language = "the langauge the text is written in";
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //gets the current tabs id
        const currentTabId = tabs[0].id;

        //inject the script into the tab
        chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: (optionSelected, contentData, Language) => {
                async function scrapeContent() {    
                    var allText = "";
                    if (contentData != "article") {
                        allText = contentData;
                    } else {
                        allText = document.body.innerText;
                    }

                    var prompt = "";

                    if (optionSelected === 0) {
                        if (allText.startsWith("Video")) {
                            prompt = "summarize this youtube video transcript BRIEFLY in " + Language + ": " + allText;
                        } else {
                            prompt = "summarize this webpage BRIEFLY in " + Language + ". Ignore headers, footers, ads, and other misc. junk :" + allText;
                        }
                        if (prompt.length > 12500) {
                            prompt = prompt.substring(0, 12500);
                        }
                        console.log("PROMPT: " + prompt)
                    } else {
                        if (allText.startsWith("Video")) {
                            prompt = "Summarize this youtube video transcript with GREAT DETAIL (250-500 words) in " + Language + ": " + allText;
                        } else {
                            prompt = "Summarize this webpage with GREAT DETAIL (250-500 words) in " + Language + ". NO LESS THAN 250 WORDS. Ignore headers, footers, ads, and other misc. junk: " + allText;
                        }
                        if (prompt.length > 12500) {
                            prompt = prompt.substring(0, 12500);
                        }
                        console.log("PROMPT: " + prompt)
                    }
                    const id = "text";
                    var summaryType = "";

                    if (allText.startsWith("Video")) {
                        summaryType="video";
                    } else {
                        summaryType="web-page";

                    }
                    
                    var requestData = {
                        prompt,
                        id,
                        summaryType,
                        Language
                    }
                    // chrome.runtime.sendMessage({ action: 'getLanguage' });
                    chrome.runtime.sendMessage({ action: 'updatePopup', textContent: JSON.stringify(requestData) });
                }
                scrapeContent();
            },
            args: [optionSelected, contentData, Language]
        });
    });
}

//figures out if page is a summary or web article
function getSummaryType() {    
    //initiate loading animation (GIF)
    document.getElementById("loading-gif").style.display = 'block';

    var summarizeBtnTxt = document.getElementById("button-text");
    summarizeBtnTxt.style.display = "none";
    var page_link = document.getElementById('page-link');

    if ((page_link.textContent).startsWith("https://www.youtube.com/watch?v=") || (page_link.textContent).startsWith("http://www.youtube.com/watch?v=")) {
        retrieveSubtitles();
    } else {
        getText("article");
    }
}

function retrieveSubtitles() {
    // Fetching Subtitles
    var completeTranscript = "";

    const fetchSubtitles = async (videoID, lang) => {
        try {
            
            let resp = await fetch("https://dedicated-flask-server-for-summify.vercel.app/" + videoID);
            let retries = 2
            while (resp.status == 500 && retries > 0){
                resp = await fetch("https://dedicated-flask-server-for-summify.vercel.app/" + videoID);
                retries -= 1;
            }
            if (resp.status == 500){
                const rawHTML = await fetch("https://www.youtube.com/watch?v=" + videoID);
                completeTranscript = await rawHTML.text();
            } else {
                completeTranscript = await resp.text();
            }

        } catch (error) {
            console.error('Error fetching subtitles:', error);
        }

        getText("Video: " + completeTranscript);
    };

    var videoID = ""
    var rawYTLink = document.getElementById("page-link").textContent;

    //extracts video ID
    if (rawYTLink.indexOf("v=") !== -1){

        if (rawYTLink.indexOf("&") == -1){
            //getting what's after v=
            videoID = rawYTLink.substring((rawYTLink.indexOf("v=") + 2), rawYTLink.length);
        } else {
            //getting what's after v=
            videoID = rawYTLink.substring((rawYTLink.indexOf("v=") + 2), rawYTLink.indexOf("&"));
        }
        
        fetchSubtitles(videoID, '');
    }
}

//getting the WEB_URL
chrome.tabs.query({ active: true, currentWindow: true
}, function (tabs) {

    //gets the current tabs id
    var currentTabId = tabs[0].id;

    //inject the script into the tab
    chrome.scripting.executeScript({
        target: {
            tabId: currentTabId
        },
        files: ['src/content/grabWebURL.js']
    });
});

function copyText() {
    var text = document.getElementById("text");
    text.setSelectionRange(0, 15000);
    navigator.clipboard.writeText(text.textContent);
}