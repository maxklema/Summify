const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");


chrome.runtime.onMessage.addListener(function(request, sender, sendResponce) {
    
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

            if (parsedContent.summaryType === "web-page"){

                //generate content
                const genAI = new GoogleGenerativeAI("");



                async function run() {

                    // For text-only input, use the gemini-pro model
                    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
                    
                        
                

                    const parts = [
                        {text: parsedContent.prompt}
                    ];

                    const result = await model.generateContent({
                    contents: [{ role: "user", parts}],
                    generationConfig,
                    safetySettings,
                
                    });



                    const the_response = await result.response;
                    var responce = the_response.text();

                    document.getElementById('text').textContent = responce;

                    

                    //uninitiate loading animation (GIF)
                    document.getElementById("loading-gif").style.display = 'none';

                    var summarizeBtnTxt = document.getElementById("button-text");
                    summarizeBtnTxt.style.display = "block";

                    calculateWordCount(parsedContent.Language);

                    //store data
                    var currentURL = document.getElementById("page-link").textContent;
                    var identifier = currentURL;

                    chrome.storage.local.set({ [identifier]: responce }, function() {
                    });
                
                }

                run();



            } else if (parsedContent.summaryType === "video") {
                
                //generate content
                const genAI = new GoogleGenerativeAI("");

                async function run() {

                    // For text-only input, use the gemini-pro model
                    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

                    if ((parsedContent.prompt).endsWith("Video: ")) {
                        responce = "This video has no transcripts and cannot be summarized. Just say that.";
                    }

                    const parts = [
                        {text: parsedContent.prompt},
                    ];

                    const result = await model.generateContent({
                        contents: [{ role: "user", parts}],
                        generationConfig,
                        safetySettings,
                    });

                    const the_response = result.response;
                    var responce = the_response.text();


                    document.getElementById('text').textContent = responce;

                    //uninitiate loading animation (GIF)
                    document.getElementById("loading-gif").style.display = 'none';

                    var summarizeBtnTxt = document.getElementById("button-text");
                    summarizeBtnTxt.style.display = "block";

                    calculateWordCount(parsedContent.Language);


                    //store data
                    var currentURL = document.getElementById("page-link").textContent;
                    var identifier = currentURL;

                    chrome.storage.local.set({ [identifier]: responce }, function() {
                        //nothing
                    });

                }

                run();



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