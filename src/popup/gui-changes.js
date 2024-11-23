document.getElementById("summary-type-select").addEventListener("change", changeLanguage)
document.getElementById("summary-length-select").addEventListener("change", changeSummaryType);

chrome.runtime.onMessage.addListener(function(request) {
  
  switch(request.action){
    case 'getLanuage': {
      chrome.storage.local.get(['Language'], function(result) {
        if (!result['Language']){
          result = "english"
          document.getElementById("summary-type-select").value = result;
          changeLanguage();
        } else {
          document.getElementById("summary-type-select").value = result['Language'];
          changeLanguage();
        }
      }); 
      break;
    }
    case 'getMode': {
      chrome.storage.local.get(['Mode'], function(result) {
        if (!result['Mode']){
          chrome.storage.local.set({ 'Mode': 'Light' }, function() {});
          if (document.body.classList[0] == 'dark-mode'){
            document.body.classList.toggle('dark-mode');
            document.getElementById('summary-logo').src = "images/summifyLogoDark.png";
            document.getElementById('modeIcon').src = "images/lightModeIcon.png";
          }
        } else if (result['Mode'] == 'Light') {
          if (document.body.classList[0] == 'dark-mode'){
            document.body.classList.toggle('dark-mode');
            document.getElementById('summary-logo').src = "images/summifyLogoDark.png";
            document.getElementById('modeIcon').src = "images/lightModeIcon.png";
          }
        } else if (result['Mode'] == 'Dark') {
          if (document.body.classList[0] != 'dark-mode'){
            document.body.classList.toggle('dark-mode');
          }
          document.getElementById('summary-logo').src = "images/summifyLogoDark.png";
          document.getElementById('modeIcon').src = "images/lightModeIcon.png";
        }
      }); 
      break;
    }
    default: {
      chrome.storage.local.get(['summaryType'], function(result) {
        // console.log(resul);
        if (result['summaryType']){
          document.getElementById("summary-length-select").value = result["summaryType"];
          changeSummaryType();
        } else {
          document.getElementById("summary-length-select").value = "Brief";
          changeSummaryType();
        }
      });
    }
  }
  
});

function changeSummaryType() {
  const summaryType = document.getElementById("summary-length-select");

  if (summaryType.value == "Brief"){
    chrome.storage.local.set({ summaryType: summaryType.value }, function() {});
  } else {
    chrome.storage.local.set({ summaryType: summaryType.value }, function() {});
  }
}

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

//toggle light/dark mode
const button = document.getElementById("toggle-mode");
button.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList[0] == 'dark-mode'){
    chrome.storage.local.set({ 'Mode': 'Dark' }, function() {});
    document.getElementById('summary-logo').src = "images/summifyLogoDark.png";
    document.getElementById('modeIcon').src = "images/lightModeIcon.png";
  } else {
    chrome.storage.local.set({ 'Mode': 'Light' }, function() {});
    document.getElementById('summary-logo').src = "images/summifyLogoLight.png";
    document.getElementById('modeIcon').src = "images/darkModeIcon.png";
  }
});