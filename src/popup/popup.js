const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};
const safetySettings = [
    {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
    }
];

const generateContent = async (genAI, prompt, language) => {
    
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const parts = [
        {text: prompt},
    ];
    const request = {
        contents: [{ role: "user", parts}], generationConfig, safetySettings
    };

    document.getElementById('text').textContent = "";
    calculateWordCount(language);

    const streamingResp = await model.generateContentStream(request);
    for await (const item of streamingResp.stream) {
        document.getElementById('text').textContent += item["candidates"][0]["content"]["parts"][0]["text"];
        calculateWordCount(language);
    }

    let responseRaw = await streamingResp.response;
    let response = responseRaw["candidates"][0]["content"]["parts"][0]["text"];

    //uninitiate loading animation (GIF)
    document.getElementById("loading-gif").style.display = 'none';

    var summarizeBtnTxt = document.getElementById("button-text");
    summarizeBtnTxt.style.display = "block";

    //store data
    var currentURL = document.getElementById("page-link").textContent;
    var identifier = currentURL;
    chrome.storage.local.set({ [identifier]: response }, function() {});
};

chrome.runtime.onMessage.addListener(function(request) {
    
    if (request.action === 'updatePopup'){
        //update <p> tag
        var parsedContent = JSON.parse(request.textContent);
        if (parsedContent.id === "page-link"){
            
            document.getElementById('page-link').textContent = parsedContent.web_url;
            //getting hostname for favicon purposes
            var parsedURL = new URL(parsedContent.web_url);
            const hostname = parsedURL.hostname;

            var favicon = document.getElementById("favicon-image");
            favicon.src = "https://www.google.com/s2/u/0/favicons?domain=" + hostname;
            var webpage = document.getElementsByClassName('webpage');
            webpage[0].style.display = 'flex';
        
            if ((parsedContent.web_url).startsWith("https://www.youtube.com/watch?v=") || (parsedContent.web_url).startsWith("htps://www.youtube.com/watch?v=")){
        
                //change the summary-type label
                var summary_type_label = document.getElementById("summary-type-label");
                summary_type_label.style.backgroundColor = "#ea8d8d";
                summary_type_label.innerHTML = "YouTube";
            } 

            chrome.storage.local.get([parsedContent.web_url], function(result) {
                document.getElementById("text").textContent = result[parsedContent.web_url];
                calculateWordCount(parsedContent.Language);
            });

        } else if (parsedContent.id === "text"){
            if (parsedContent.summaryType === "web-page"){
                //generate content
                const genAI = new GoogleGenerativeAI("");
                generateContent(genAI, parsedContent.prompt, parsedContent.Language);

            } else if (parsedContent.summaryType === "video") {
                
                //generate content
                const genAI = new GoogleGenerativeAI("");
                ( async () => {
                    if ((parsedContent.prompt).endsWith("Video: ")) {

                        let response = "This video has no transcripts and cannot be summarized.";
                        document.getElementById('text').textContent = response;
                        calculateWordCount(parsedContent.Language);

                        //uninitiate loading animation (GIF)
                        document.getElementById("loading-gif").style.display = 'none';

                        var summarizeBtnTxt = document.getElementById("button-text");
                        summarizeBtnTxt.style.display = "block";

                        //store data
                        var currentURL = document.getElementById("page-link").textContent;
                        var identifier = currentURL;

                        chrome.storage.local.set({ [identifier]: response }, function() {
                        });

                    } else {
                        generateContent(genAI, parsedContent.prompt, parsedContent.Language);
                    }
                })();
            }
        }
    }
})

function calculateWordCount(Language) {
    //updating word count of text box
    var text = document.getElementById('text').textContent;
    var wordCount = 0;

    for (var i = 0; i < text.length; i++){
        
        if (text[i] == " "){
            wordCount++;
        }
    }

    var words = ""
    switch(Language) {

        case "english":
            words = "words";
            break;
        case "spanish":
            words = "palabras";
            break;
        case "mandarin_chinese":
            words = "字";
            break;
        case "hindi":
            words = "शब्द";
            break;
        case "french":
            words = "mots";
            break;
        default:
            words = "words";
            break;
    }
    
    document.getElementById("word-count-label").innerHTML = wordCount + " " + words;
}