var asin = '';
var country = 'com';

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function isNumber(value) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    if (typeof value == 'number') {
        return true;
    }
    return !isNaN(value - 0);
}

var getPureNumber = function(value) {
    if (value && !isNumber(value)) {
        return parseFloat(value.replace(/[^\d.-]/g, ''));
    }
    return value;
}

//============================================================================
jQuery(document).ready(function($){
    chrome.runtime.sendMessage({setHeight: $('body').outerHeight()}, function() {});

    var par = window.location.href;
    par = par.split('?');
    par = par[1];
    par = par.split('||');
    asin = par[0];
    var rank = atob(par[1]);
    var price = atob(par[2]).replace('$','').replace('£','');

    country = atob(par[3]);
    rank = rank.split(' in ');
    var category = rank[1];
    rank = rank[0];

    if (price) {
        $('#current-price').val(price);
    }

    if (localStorage["asin=" + asin]) {
      var savedDesiredPrice = localStorage["asin=" + asin].split(":")[0];
      var savedDesiredQty = localStorage["asin=" + asin].split(":")[1];

      $('#desired-price').val(savedDesiredPrice);
      $('#desired-qty').val(savedDesiredQty);
    }

    $('#save-btn').click(function(){
        var desiredPrice = getPureNumber($.trim($('#desired-price').val()));
        var desiredQty = getPureNumber($.trim($('#desired-qty').val()));

        if (desiredPrice && desiredQty) {
            localStorage["asin=" + asin] = desiredPrice + ":" + desiredQty;
            alert("Saved!");
        } else {
            alert('Please inform your desired price and desired quantity.');
        }
    });

    $('.wizard .close').click(function(){
        chrome.runtime.sendMessage({toggle: '1'}, function() {});
    });

    $('.wizard .settings').click(function(){
        chrome.runtime.sendMessage({createOptions: '1'}, function() {});
    });
});
