document.getElementById("summary-type-select").addEventListener("change", changeLanguage)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponce) {
    

  if (request.action === 'getLanguage'){


    chrome.storage.local.get(['Language'], function(result) {

      if (result == ""){
        changeLanguage();
      } else {
      document.getElementById("summary-type-select").value = result['Language'];
      changeLanguage();
      }
    }); 
    




    
  }


});


function changeLanguage() {

  const language = document.getElementById("summary-type-select");
 
  //page content labels
  var languageLabel = document.getElementById("language-label");
  var summary_type = document.getElementById("summary-length-label");
  var brief_summary = document.getElementById("brief-summary");
  var detailed_summary = document.getElementById("detailed-summary");
  var button_text = document.getElementById("button-text");
  var public_page_link = document.getElementById("page-link");
  var text_area = document.getElementById("text");
 
  var summary_type_label = document.getElementById("summary-type-label");
  var computedStyle = window.getComputedStyle(summary_type_label);


  if (language.value == "english"){
    
    languageLabel.innerHTML = "Language";
    summary_type.innerHTML = "Length";
    brief_summary.innerHTML = "Brief Summary";
    detailed_summary.innerHTML = "Detailed Summary";
    button_text.innerHTML = "Summarize";
    text_area.placeholder = "Your summary will appear here!";

    if (!(public_page_link.innerHTML).startsWith("http")){
      public_page_link.innerHTML = "Unable to identify public page link";  
    }

    switch (computedStyle.backgroundColor) {

      
      case "rgb(71, 189, 195)":
        summary_type_label.innerHTML = "Webpage";
        break;

    }

    chrome.storage.local.set({ Language: language.value }, function() {
    });

    calculateWordCount("words");


  } else if (language.value == "spanish") {
   

    languageLabel.innerHTML = "Idioma";
    summary_type.innerHTML = "Longitud";
    brief_summary.innerHTML = "Breve resumen";
    detailed_summary.innerHTML = "Resumen detallado";
    button_text.innerHTML = "Resumir";
    text_area.placeholder = "¡Tu resumen aparecerá aquí!";

    if (!(public_page_link.innerHTML).startsWith("http")){
      public_page_link.innerHTML = "No se puede identificar el enlace de la página pública";  
    }

    switch (computedStyle.backgroundColor) {

      
      case "rgb(71, 189, 195)":
        summary_type_label.innerHTML = "Página web";
        break;

    }

    chrome.storage.local.set({ Language: language.value }, function() {
    });

    calculateWordCount("palabras");

  } else if (language.value == "mandarin_chinese") {
    
    languageLabel.innerHTML = "語言";
    summary_type.innerHTML = "長度";
    brief_summary.innerHTML = "簡要總結";
    detailed_summary.innerHTML = "詳細總結";
    button_text.innerHTML = "總結";
    text_area.placeholder = "您的摘要將會出現在這裡！";

    if (!(public_page_link.innerHTML).startsWith("http")){
      public_page_link.innerHTML = "無法識別公共頁面鏈接";  
    }

    switch (computedStyle.backgroundColor) {

      
      case "rgb(71, 189, 195)":
        summary_type_label.innerHTML = "網頁";
        break;

    }

    chrome.storage.local.set({ Language: language.value }, function() {
    });

    calculateWordCount("字");

  } else if (language.value == "hindi") {
    
    languageLabel.innerHTML = "भाषा";
    summary_type.innerHTML = "लंबाई";
    brief_summary.innerHTML = "संक्षिप्त विवरण";
    detailed_summary.innerHTML = "विस्तृत सारांश";
    button_text.innerHTML = "संक्षेप";
    text_area.placeholder = "आपका सारांश यहां दिखाई देगा!";

    if (!(public_page_link.innerHTML).startsWith("http")){
      public_page_link.innerHTML = "सार्वजनिक पेज लिंक की पहचान करने में असमर्थ";  
    }

    switch (computedStyle.backgroundColor) {

      
      case "rgb(71, 189, 195)":
        summary_type_label.innerHTML = "वेब पृष्ठ";
        break;

    }

    chrome.storage.local.set({ Language: language.value }, function() {
    });

    calculateWordCount("शब्द");

  } else if (language.value == "french") {
    
    languageLabel.innerHTML = "Langue";
    summary_type.innerHTML = "Longueur";
    brief_summary.innerHTML = "Bref résumé";
    detailed_summary.innerHTML = "Résumé détaillé";
    button_text.innerHTML = "Résumer";
    text_area.placeholder = "Votre résumé apparaîtra ici !";

    if (!(public_page_link.innerHTML).startsWith("http")){
      public_page_link.innerHTML = "Impossible d'identifier le lien de la page publique";  
    }

    switch (computedStyle.backgroundColor) {

      
      case "rgb(71, 189, 195)":
        summary_type_label.innerHTML = "page web";
        break;

    }

    chrome.storage.local.set({ Language: language.value }, function() {
    });

    calculateWordCount("mots");

  } else {

    chrome.storage.local.set({ Language: language.value }, function() {
    });

  }



}

function calculateWordCount(language) {
    
  //updating word count of text box
  
  var text = document.getElementById('text').textContent;
  

  var wordCount = 0;

  for (var i = 0; i < text.length; i++){
      
      if (text[i] == " "){
          wordCount++;
      }
  }
  
  document.getElementById("word-count-label").innerHTML = wordCount + " " + language;

}