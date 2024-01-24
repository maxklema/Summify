chrome.runtime.onMessage.addListener(function(request, sender, sendResponce) {

    if (request.action === 'updatePopup') {

        //update HTML content
        chrome.action.setPopup({ popup: 'src/popup/summify.html'});

    }

});


