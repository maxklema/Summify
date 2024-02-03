// document.getElementById("summary-type-select").addEventListener("change", typeSelect)
// document.getElementById("youtube-link-input").addEventListener("input", checkValidLink);

// function checkValidLink() {

//     var linkInput = document.getElementById("youtube-link-input").value;
//     if (linkInput.startsWith("https://www.youtube.com/watch?v=") || linkInput.startsWith("http://www.youtube.com/watch?v=")){
        
//         document.getElementById("youtube-link-input").style.border = "1px solid rgb(133, 133, 133)";

//     } else {

//         document.getElementById("youtube-link-input").style.border = "1px solid rgb(255, 138, 138)";

//     }

// }

// function typeSelect() {

//     var select = document.getElementById("summary-type-select");
//     var optionSelected = select.options[select.selectedIndex].value;
    

//     if (optionSelected === "youtube-video") {

//         var webpage_link = document.getElementById("webpage-js");
//         webpage_link.style.display = "none";

//         var youTubeInput = document.getElementById("youtube-link-js");
//         youTubeInput.style.display = "block";

//         var summaryParent = document.getElementById("summary-parent-js");
//         summaryParent.style.height = "238px";

//         var textBox_article = document.getElementById("text");
//         var textBox_yt = document.getElementById("text-youtube");

//         textBox_article.style.display = "none";
//         textBox_yt.style.display = "block";

//         calculateWordCount("youtube");

//         document.getElementById("word-count-label-web").style.display = "none";
//         document.getElementById("word-count-label-youtube").style.display = "block";
        

//     } else if (optionSelected === "text") {
        
//         var webpage_link = document.getElementById("webpage-js");
//         webpage_link.style.display = "block";
//         webpage_link.style.display = "flex";

//         var textBox_article = document.getElementById("text");
//         var textBox_yt = document.getElementById("text-youtube");

//         textBox_article.style.display = "block";
//         textBox_yt.style.display = "none";


//         var youTubeInput = document.getElementById("youtube-link-js");
//         youTubeInput.style.display = "none";

//         var summaryParent = document.getElementById("summary-parent-js");
//         summaryParent.style.height = "258px";

//         calculateWordCount("web");

//         document.getElementById("word-count-label-web").style.display = "block";
//         document.getElementById("word-count-label-youtube").style.display = "none";
        


//     }



// }

// function calculateWordCount(type) {
    
//     //updating word count of text box
//     var text;

//     if (type === "youtube"){
//         var text = document.getElementById('text-youtube').textContent;
//     } else {
//         var text = document.getElementById('text').textContent;
//     }

//     var wordCount = 0;

//     for (i = 0; i < text.length; i++){
        
//         if (text[i] == " "){
//             wordCount++;
//         }
//     }
    
//     document.getElementById("word-count-label-" + type).innerHTML = wordCount + " Words";

// }