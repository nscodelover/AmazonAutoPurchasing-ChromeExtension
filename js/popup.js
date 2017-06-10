jQuery(document).ready(function($){
    chrome.tabs.executeScript(null, {file: "js/showHideFrame.js"}, function() {});

    window.close();
});