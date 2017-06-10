jQuery(document).ready(function($){
    chrome.runtime.sendMessage({setHeight: $('body').outerHeight()}, function() {});

    $('body').on('click', '.tab-normal', function(){
        var toHide = $('.tab-selected').attr('rel');
        var toShow = $('.tab-normal').attr('rel');

        $('.'+toHide).hide();
        $('.'+toShow).show();

        $('.tab-normal').addClass('tab-selected2').removeClass('tab-normal');
        $('.tab-selected').addClass('tab-normal').removeClass('tab-selected');
        $('.tab-selected2').addClass('tab-selected').removeClass('tab-selected2');
    });

    if (localStorage['license']) {
        $('.tab-normal').click();
    }

    $('#license-key').val(localStorage['license']);

    $('#buy-license-key').click(function(){
        chrome.tabs.create({ url: 'https://azautomator.com/azautomator-license' });
    });

    $('#validate-license-key').click(function(){
        $('.loader-calc').show();
        $('.calc').hide();

        localStorage['license'] = $.trim($('#license-key').val());
        localStorage['time'] = 0;

        chrome.runtime.sendMessage({license: "1"}, function(response) {
            if (response.activeLicense == 1) {
                alert('License valid!');

                var part = window.location.href.split('?');
                part = part[1];

                if (part) {
                    window.location.href = chrome.extension.getURL("html/azautomator.html")+'?'+part;
                } else {
                    window.close();
                }
            } else {
                alert('License not valid');
                $('.loader-calc').hide();
                $('.calc').show();
            }
        });
    });

    $('#user_email').val(localStorage['userEmail']);

    $('#save-settings').click(function(){
        localStorage['userEmail'] = $('#user_email').val().replace();

        alert('Saved!')
    });
});
