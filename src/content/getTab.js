document.getElementById("summarizeBtn").addEventListener("click", getSummaryType);
document.getElementById("copy-text-button").addEventListener("click", copyText);

const { getSubtitles } = require('youtube-caption-extractor');

function getText(contentData) {

    var selectElement = document.getElementById('summary-length-select');

    var optionSelected = selectElement.options[selectElement.selectedIndex].text;


    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //gets the current tabs id
        const currentTabId = tabs[0].id;


        //inject the script into the tab
        chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: (optionSelected, contentData) => {

                async function scrapeContent() {

                    var allText = "";
                    if (contentData != "article") {
                        allText = contentData;
                    } else {
                        allText = document.body.innerText;
                    }


                    var prompt = "";

                    //api request to summarize
                    //onsole.log(optionSelected);


                    if (optionSelected === "Snapshot (~ 100-250 wd)") {

                        if (allText.startsWith("Video")) {

                            prompt = "summarize this youtube video BRIEFLY in 100 - 200 words: " + allText;
                        } else {

                            prompt = "summarize this webpage BRIEFLY in 100 - 200 words. Ignore headers, footers, ads, and other misc. junk. Summarize in language the page was written in. Just the main content of the page that makes sense when summarized:" + allText;
                        }

                        if (prompt.length > 25000) {
                            prompt = prompt.substring(0, 24999);
                        }


                    } else {

                        if (allText.startsWith("Video")) {

                            prompt = "Summarize this youtube video with GREAT DETAIL in EXACTLY 250 to 500 words. NO LESS THAN 250 WORDS: " + allText;

                        } else {

                            prompt = "Summarize this webpage with GREAT DETAIL in EXACTLY 250 to 500 words. NO LESS THAN 250 WORDS. Ignore headers, footers, ads, and other misc. junk. Summarize in language the page was written in.Just the main content of the page that makes sense when summarized: " + allText;
                            console.log(prompt);

                        }

                        if (prompt.length > 25000) {
                            prompt = prompt.substring(0, 24999);
                        }


                    }
                
                    const id = "text";
                    var summaryType = "";

                    if (allText.startsWith("Video")) {
                        
                        summaryType="video";

                    } else {

                        summaryType="web-page";

                    }
                    
                    // include in
                    // if (allText === "Video: ") {
                    //     responce = "Sorry, this video has no transcripts and cannot be summarized.";
                    // }
                

                    var requestData = {
                        prompt,
                        id,
                        summaryType

                    }

                    chrome.runtime.sendMessage({ action: 'updatePopup', textContent: JSON.stringify(requestData) });
                }

                scrapeContent();
                    
                    
            },
            args: [optionSelected, contentData]
        });



    });

}

//figures out if page is a summary or web article
function getSummaryType() {
    
    var select = document.getElementById("summary-type-select");
    var optionSelected = select.options[select.selectedIndex].value;
    
    if (document.getElementById("youtube-link-input").style.border === "1px solid rgb(255, 138, 138)" && optionSelected === "youtube-video"){
        //exit
        return;

    } else if (document.getElementById("youtube-link-input").value === ""){
        document.getElementById("youtube-link-input").style.border = "1px solid rgb(255, 138, 138)";
        
    }

    //initiate loading animation (GIF)
    document.getElementById("loading-gif").style.display = 'block';

    var summarizeBtnTxt = document.getElementById("button-text");
    summarizeBtnTxt.style.display = "none";



    if (optionSelected === "youtube-video") {

        retrieveSubtitles();

    } else if (optionSelected === "text") {


        getText("article");

    }



}

function retrieveSubtitles() {

    // Fetching Subtitles
    var completeTranscript = "";

    const fetchSubtitles = async (videoID, lang) => {
        try {
            const subtitles = await getSubtitles({ videoID, lang });
            length = subtitles.length;
            //iterate through the array and print extract just the text portions

            for (var i = 0; i < length; i++) {
                completeTranscript += subtitles[i].text + " ";
            }


        } catch (error) {
            console.error('Error fetching subtitles:', error);
        }

        

        getText("Video: " + completeTranscript);



    };

    var videoID = ""

    var rawYTLink = document.getElementById("youtube-link-input").value;

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
        
        
        
    } else {

        document.getElementById("youtube-link-input").value = "Not a valid link";

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