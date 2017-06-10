chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({ url: chrome.extension.getURL("html/options.html") });
    };
});

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    if (request.setHeight) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {setHeight: request.setHeight}, function(response) {});
        });
    }

    if (request.toggle) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {toggle: '1'}, function(response) {});
        });
    }

    if (request.license) {
        if (localStorage['license']) {
            var time = new Date();
            var expDate = new Date();
            if (localStorage['time']) {
                expDate.setTime(localStorage['time']);
            } else {
                expDate.setTime(0);
            }

            if (time.getTime() > expDate.getTime()) {
                $.post('https://api.gumroad.com/v2/licenses/verify', {product_permalink: 'PMKi',license_key: localStorage['license']}, function(data) {
                    if (data.success = true) {
                        localStorage['time'] = time.getTime() + (7 * 24 * 60 * 60 * 1000);
                        sendResponse({activeLicense: 1});
                    } else {
                        localStorage['time'] = 0;
                        sendResponse({activeLicense: 0});
                    }
                }).fail(function(){
                    localStorage['time'] = 0;
                    sendResponse({activeLicense: 0});
                });
            } else {
                sendResponse({activeLicense: 1});
            }
        } else {
            localStorage['time'] = 0;
            sendResponse({activeLicense: 0});
        }
    }

    if (request.createOptions) {
        chrome.tabs.create({ url: chrome.extension.getURL("html/options.html") });
    }

    return true;
});

//=============================================

setInterval(function(){
    detectDesiredProduct();
}, 60000 * 30);

function detectDesiredProduct() {

  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i).split("asin=")[1];
    if (key)
      getBuyBoxPrice(key);
  }
}

function getBuyBoxPrice(asin) {

  var _action = "GetCompetitivePricingForASIN";
  var _today = new Date();
  var timeStamp = ISODateString(_today);
  var _host = "mws.amazonservices.com";

  // important: parameter order
  var parameters = {
    //"ASINList.ASIN.1":Asin,
    "AWSAccessKeyId": "AKIAISNK6WZM6U4JU2BA",
    "Action": _action,
    "MWSAuthToken": "8770-0567-0467",
    "MarketplaceId":  "ATVPDKIKX0DER",
    "SellerId": "A38XX4EY2FLVSN",
    "SignatureMethod":  "HmacSHA256",
    "SignatureVersion": "2",
    //"Signature": signature,
    "Timestamp":  timeStamp,
    "Version":  "2011-10-01"
  };

  var method = "POST";
  var protocol = "https://";
  var uri = "/Products/2011-10-01";

  var parameters = $.param( parameters );
  var StringToSign =  method+"\n"+_host+"\n"+uri+"\n"+"ASINList.ASIN.1="+asin+"&"+parameters;
  //StringToSign = "POST\nmws.amazonservices.com\n/Products/2011-10-01\nASINList.ASIN.1=B00000JICB&AWSAccessKeyId=AKIAISNK6WZM6U4JU2BA&Action=GetCompetitivePricingForASIN&MWSAuthToken=8770-0567-0467&MarketplaceId=ATVPDKIKX0DER&SellerId=A38XX4EY2FLVSN&SignatureMethod=HmacSHA256&SignatureVersion=2&Timestamp=2017-03-09T01%3A37%3A10Z&Version=2011-10-01";

  var signature = CryptoJS.HmacSHA256(StringToSign, "/lND6I46/wRgUuyYGSKOGYV/ZOljAcxTcs7NLiSx");
  signature = signature.toString(CryptoJS.enc.Base64);
  //Signature = encodeURIComponent(Signature);

  $.ajax({
    type: "POST",
    url: protocol + _host + uri,
    data: {
      "AWSAccessKeyId": "AKIAISNK6WZM6U4JU2BA",
      "Action": _action,
      "SellerId": "A38XX4EY2FLVSN",
      "MWSAuthToken": "8770-0567-0467",
      "SignatureVersion": "2",
      "Timestamp":  timeStamp,
      "Version":  "2011-10-01",
      "Signature": signature,
      "SignatureMethod":  "HmacSHA256",
      "MarketplaceId":  "ATVPDKIKX0DER",
      "ASINList.ASIN.1":  asin
    },
    dataType: "text",
    success: function( data ) {
      console.log( "success: " + data );

      if (window.DOMParser)
      {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(data,"text/xml");
      }

      var buy_box_price = "-";
      if (xmlDoc.getElementsByTagName("Amount").length != 0) {
        buy_box_price = xmlDoc.getElementsByTagName("Amount")[1].childNodes[0].nodeValue;
      }

      if (localStorage["asin=" + asin]) {
        var savedDesiredPrice = localStorage["asin=" + asin].split(":")[0];
        var savedDesiredQty = localStorage["asin=" + asin].split(":")[1];

        if (getPureNumber(buy_box_price) == getPureNumber(savedDesiredPrice)) {
          alert(asin + " Desired Price reached!")
        }
      }
    },
    error: function( error ) {
      console.log( "error: " + JSON.stringify(error));
    }
  });
}

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

function ISODateString(d){
  function pad(n){return n<10 ? '0'+n : n}
  return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z'
}
