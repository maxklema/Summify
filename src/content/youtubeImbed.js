let isInjecting = false;

function injectSummfy() {
  if (document.getElementById("summify-iframe") || isInjecting){
    return;
  }
  isInjecting = true;
  var videoID = window.location.href;
  videoID = videoID.substring(videoID.indexOf("v=")+2, videoID.length)
  const iframe = document.createElement('iframe');
  var video; // Interact with video player on YouTube
  var lastTime //last stored timestamp
  var iframePrepened = false //set to true when iframe successfully loads
  var timestampInterval = false //set to true when timestamp interval checking starts
  var dateInjected = null;

  // Iframe
  iframe.setAttribute('id', 'summify-frame');
  iframe.setAttribute(
    'style',
    'width: 100%; height: 580px; z-index: 2147483650; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10), 0 2px 8px rgba(0, 0, 0, 0.08); border-radius: 15px; margin-bottom: 2vh;'
  );
  iframe.setAttribute('allow', 'clipboard-write');

  console.log("SUMMIFY LOCAL STORAGE: " + localStorage.getItem('Summify-Language'))
  if (localStorage.getItem('Summify-Language') === null){
    localStorage.setItem('Summify-Language', 'english')
  }

  //local storage
  window.addEventListener('message', (event) => {
    if (event.data.type == "Summify-Local-Storage") {
      localStorage.setItem(event.data.key, event.data.data);
      console.log("SUMMIFY LOCAL STORAGE: " + localStorage.getItem(event.data.key))
    }
  })

  const summifyLanguage = localStorage.getItem('Summify-Language')

  iframe.src = `https://summify.opensource.mieweb.org/yt_url/${videoID}/${summifyLanguage}`

  //Mutation Observers
  const callback = (mutationsList, observer) => {
    mutationsList.forEach(() => {
      const secondary = document.querySelector('#columns > #secondary');
      if (secondary && !iframePrepened){
        iframePrepened = true
        setTimeout(() => {
          secondary.prepend(iframe); 
        }, 1750)
        
        observer.disconnect(); 
      }
    })
  };

  const playerCallback = (mutationsList, observer) => {
    mutationsList.forEach(mutation => {
      video = document.querySelector('video')
      if (video && !timestampInterval){
        timestampInterval = true
        lastTime = video.currentTime
        timestampChangeListener();    
        observer.disconnect()
      }    
    })
  }

  const config = { attributes: true, childList: true, subtree: true };
  var observer = new MutationObserver(callback);
  var playerObserver = new MutationObserver(playerCallback);

  observer.observe(document, config);
  playerObserver.observe(document, config);


  // Listen for requests to change video timestamp
  window.addEventListener('message', (event) => {
    if (event.data.type == "yt_seek_timestamp") {
      video.currentTime = event.data.seconds;
    }
  })

  //listen for timestamp changes every second to later map to iframe
  function timestampChangeListener() {
    setInterval(() => {
      if (video.currentTime != lastTime){
        var currentTime = Math.floor(video.currentTime)
        iframe.contentWindow.postMessage({type: 'yt_timestamp', currentTime}, '*')
      }
    }, 750)
  }

  setTimeout(() => { isInjecting = false; }, 2000); // Reset after a short delay
}

function removeSummify() {
  if (document.getElementById('summify-frame')){
    const secondary = document.querySelector('#columns > #secondary');
    secondary.removeChild(document.getElementById('summify-frame'))
  }
}

function handlePageChange() {
  if (location.href.startsWith('https://www.youtube.com/watch?v=')) {
    removeSummify();
    injectSummfy();
  } else {
    removeSummify();
  }
}

let lastURL = location.href;
new MutationObserver(() => {
  if (location.href != lastURL){
    lastURL = location.href;
    handlePageChange();
  }
}).observe(document, {subtree: true, childList: true});

handlePageChange();