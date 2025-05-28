var videoID = window.location.href;
videoID = videoID.substring(videoID.indexOf("v=")+2, videoID.length)
const iframe = document.createElement('iframe');
var video; // Interact with video player on YouTube
var iframePrepened = false //set to true when iframe successfully loads

//Mutation Observers
const callback = (mutationsList, observer) => {
  mutationsList.forEach(mutation => {
    const secondary = document.querySelector("#secondary");
    if (secondary && !iframePrepened){
      iframePrepened = true
      setTimeout(() => {
        secondary.prepend(iframe);
      }, 4000)
      observer.disconnect();  
    }
  })
};

const playerCallback = (mutationsList, observer) => {
  mutationsList.forEach(mutation => {
      video = document.querySelector('video')
      if (video){
        observer.disconnect()
      }    
  })
}

const config = { attributes: true, childList: true, subtree: true };
var observer = new MutationObserver(callback);
var playerObserver = new MutationObserver(playerCallback);

observer.observe(document.getElementById("content"), config);
playerObserver.observe(document.getElementById("content"), config);


// Iframe
iframe.setAttribute('id', 'summify-frame');
iframe.setAttribute(
  'style',
  'width: 100%; height: 580px; z-index: 2147483650; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10), 0 2px 8px rgba(0, 0, 0, 0.08); border-radius: 15px; margin-bottom: 2vh;'
);
iframe.setAttribute('allow', '');
iframe.src = 'http://127.0.0.1:5000/yt_url/' + videoID;


//this mutation observer for detecting URL changes comes from this SO: https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
const observeUrlChange = () => {
  let oldHref = document.location.href;
  const body = document.querySelector('body');
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;

      // Changes
      const secondary = document.querySelector("#secondary");
      secondary.removeChild(document.getElementById('summify-frame')) //remove iframe currently on screen
      videoID = window.location.href
      videoID = videoID.substring(videoID.indexOf("v=")+2, videoID.length)
      iframePrepened = false
      iframe.src = 'http://127.0.0.1:5000/yt_url/' + videoID;
      setTimeout(() => {
        secondary.prepend(iframe)
      }, 2500)
      // observer = new MutationObserver(callback);
      // playerObserver = new MutationObserver(playerCallback);
      // observer.observe(document.getElementById("content"), config);
      // playerObserver.observe(document.getElementById("content"), config);
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

window.onload = observeUrlChange;

// Listen for requests to change video timestamp
window.addEventListener('message', (event) => {
  if (event.data.type == "yt_seek_timestamp") {
    video.currentTime = event.data.seconds;
  }
})