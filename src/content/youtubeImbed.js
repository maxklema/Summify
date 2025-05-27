var videoID = window.location.href;
videoID = videoID.substring(videoID.indexOf("v=")+2, videoID.length)
const iframe = document.createElement('iframe');
iframe.setAttribute('id', 'summify-frame');
iframe.setAttribute(
  'style',
  'width: 100%; height: 580px; z-index: 2147483650; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10), 0 2px 8px rgba(0, 0, 0, 0.08); border-radius: 15px; margin-bottom: 2vh;'
);
iframe.setAttribute('allow', '');
iframe.src = 'http://127.0.0.1:5000/yt_url/' + videoID;


const callback = (mutationsList, observer) => {
  mutationsList.forEach(mutation => {
    switch(mutation.type) {
        case 'childList':
          const secondary = document.querySelector("#secondary");
          if (secondary){
            setTimeout(() => {
              secondary.prepend(iframe);
            }, 4000)
            observer.disconnect();  
          }
          break;
      }
  });

 };
const observer = new MutationObserver(callback);

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

observer.observe(document.getElementById("page-manager"), config);

// Interact with video player on YouTube
var video;

const playerCallback = (mutationsList, observer) => {
  mutationsList.forEach(mutation => {
    switch(mutation.type) {
      case 'childList':
        video = document.querySelector('video')
        if (video){
          observer.disconnect()
        }
        break;
    }
  })
}

const playerObserver = new MutationObserver(playerCallback);
playerObserver.observe(document.getElementById("page-manager"), config);

// Listen for requests to change video timestamp
window.addEventListener('message', (event) => {
  if (event.data.type == "yt_seek_timestamp") {
    video.currentTime = event.data.seconds;
  }
})