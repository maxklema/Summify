const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponce) {
    
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

            document.getElementById("youtube-link-input").value = parsedContent.web_url;
    
            //gui styling changes
            var webpage_link = document.getElementById("webpage-js");
            webpage_link.style.display = "none";

            var youTubeInput = document.getElementById("youtube-link-js");
            youTubeInput.style.display = "block";

            var summaryParent = document.getElementById("summary-parent-js");
            summaryParent.style.height = "238px";

            var textfield = document.getElementById("text");
            textfield.style.display = "none";

            var textfield_youtube = document.getElementById("text-youtube");
            textfield_youtube.style.display = "block";

            document.getElementById('summary-type-select').value = "youtube-video";

            document.getElementById("word-count-label-web").style.display = "none";
            document.getElementById("word-count-label-youtube").style.display = "block";


        } 

        chrome.storage.local.get([parsedContent.web_url + "-video"], function(result) {
            document.getElementById("text-youtube").textContent = result[parsedContent.web_url + "-video"];
            calculateWordCount("youtube");
        });

        chrome.storage.local.get([parsedContent.web_url + "-web_page"], function(result) {
            document.getElementById("text").textContent = result[parsedContent.web_url + "-web_page"];
            calculateWordCount("web");
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
            },
          ];

        if (parsedContent.summaryType === "web-page"){

            //generate content
            // Access your API key as an environment variable (see "Set up your API key" above)
            const genAI = new GoogleGenerativeAI("API_KEY");



            async function run() {

                // For text-only input, use the gemini-pro model
                const model = genAI.getGenerativeModel({ model: "gemini-pro"});
                
                    
            

                const parts = [
                    {text: parsedContent.prompt},
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

                calculateWordCount("web");

                //store data
                var currentURL = document.getElementById("page-link").textContent;
                var data_type = "web_page";
                var identifier = currentURL + "-" + data_type;

                chrome.storage.local.set({ [identifier]: responce }, function() {
                });
            
            }

            run();



        } else if (parsedContent.summaryType === "video") {
            
            //generate content
            // Access your API key as an environment variable (see "Set up your API key" above)
            const genAI = new GoogleGenerativeAI("YOUR_API_KEY");

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

                const the_response = await result.response;
                var responce = the_response.text();


                document.getElementById('text-youtube').textContent = responce;

                //uninitiate loading animation (GIF)
                document.getElementById("loading-gif").style.display = 'none';

                var summarizeBtnTxt = document.getElementById("button-text");
                summarizeBtnTxt.style.display = "block";

                calculateWordCount("youtube");


                //store data
                var currentURL = document.getElementById("youtube-link-input").value;
                var data_type = "video";
                var identifier = currentURL + "-" + data_type;

                chrome.storage.local.set({ [identifier]: responce }, function() {
                    //nothing
                });

            }

            run();



        }
       


    }

    
})

function calculateWordCount(type) {
    
    //updating word count of text box

    var text;

    if (type === "youtube"){
        var text = document.getElementById('text-youtube').textContent;
    } else {
        var text = document.getElementById('text').textContent;
    }

    var wordCount = 0;

    for (var i = 0; i < text.length; i++){
        
        if (text[i] == " "){
            wordCount++;
        }
    }
    
    document.getElementById("word-count-label-" + type).innerHTML = wordCount + " Words";

}