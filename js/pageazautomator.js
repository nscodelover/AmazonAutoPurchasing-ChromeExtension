chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.setHeight) {
        document.getElementById('fba-wizard-frame').style.height = (msg.setHeight+10)+"px";
    }
    if (msg.toggle) {
        $('iframe.fba-wizard-frame').fadeToggle();
    }
});


var getAsinFromUrl = function() {
    var asin = window.location.href;
    asin = asin.replace(/%/g, '/');
    asin = asin.match("/([a-zA-Z0-9]{10})(?:[/?]|$)");
    return asin[1];
}

jQuery(document).ready(function($){
    var addIframeToPage = function() {
        if ($('#fba-wizard-frame').length == 0)
        {
            var asin = getAsinFromUrl();

            var rank = $('#SalesRank').clone();
            rank.find('b,a,ul,style').html('');
            rank = btoa($.trim(rank.text().replace('(','').replace(')','')));

            if (!rank) {
                var temp = $('th.prodDetSectionEntry:contains("Best Sellers Rank")').next().find('span>span').first();
                temp.find('b,a,ul,style').html('');
                rank = btoa(temp.text().replace('(','').replace(')',''));
            }

            var price = btoa($('#price_feature_div span.a-color-price').first().text());
            var country = btoa(document.domain.replace('www','').replace('amazon','').replace('..',''));

            if (asin) {
                chrome.runtime.sendMessage({license: "1"}, function(response) {
                    var iframe = '';
                    if (response.activeLicense == 1) {
                        iframe = '<iframe and seamless="seamless" scrolling="no" id="fba-wizard-frame" class="fba-wizard-frame" src="'+chrome.extension.getURL("html/azautomator.html")+'?'+asin+'||'+rank+'||'+price+'||'+country+'"></iframe>';
                    } else {
                        iframe = '<iframe and seamless="seamless" scrolling="no" id="fba-wizard-frame" class="fba-wizard-frame" src="'+chrome.extension.getURL("html/options.html")+'?'+asin+'||'+rank+'||'+price+'||'+country+'"></iframe>';
                    }
                    $('#buybox_feature_div').prepend(iframe);

                    if (!$('body').hasClass('fba-bind')) {
                        $('body').addClass('fba-bind').click(function(){
                            addIframeToPage();
                            setTimeout(function(){
                                addIframeToPage();
                            }, 1000);
                            setTimeout(function(){
                                addIframeToPage();
                            }, 2000);
                            setTimeout(function(){
                                addIframeToPage();
                            }, 4000);
                            setTimeout(function(){
                                addIframeToPage();
                            }, 5000);
                        });
                    }
                });
            }
        }
    };
    addIframeToPage();
});
