// src/background/background.js

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: [
          "src/content/getTab.js", 
          "src/content/grabWebURL.js", 
          "../../bundles/popupBundle.js",
        ],
        allFrames: true,
    });
});

// chrome.action.onClicked.addListener((tab) => {
//   console.log(tab.url);
// });

// chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//   console.log(tabs[0].id)
// })

// chrome.action.onClicked.addListener(async function (tab) {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: () => {
//         console.log("APPENDING IFRAME");
//         // const iframe = document.createElement('iframe');
//         // iframe.setAttribute('id', 'cm-frame');
//         // iframe.setAttribute(
//         //   'style',
//         //   'top: 10px;right: 10px;width: 400px;height: calc(100% - 20px);z-index: 2147483650;border: none; position:fixed;'
//         // );
//         // iframe.setAttribute('allow', '');
//         // iframe.src = chrome.runtime.getURL('../popup/summify.html');
  
//         // // console.log("APPENDING IFRAME");
//         // document.body.appendChild(iframe);
//       },
//     });
//   });



function logToCurrentTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length === 0) return;
    const tab = tabs[0];
    // Only inject into http(s) pages
    if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: (msg) => console.log(msg),
        args: ['Hello from background.js!']
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        }
      });
    } else {
      console.warn('Cannot inject script into this page:', tab.url);
    }
  });
}

// Example usage:
logToCurrentTab('Hello from background.js!');



