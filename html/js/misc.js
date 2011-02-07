function events(node, type, callback, remove) {
    if(window.addEventListener) {
        if(remove) {
            node.removeEventListener(type, callback, false);
        } else {
            node.addEventListener(type, callback, false);
        }
    } else if(window.attachEvent) {
        if(remove) {
            node.detachEvent('on' + type, callback);
        } else {
            node.attachEvent('on' + type, callback);
        }
    } else {
        alert('This browser is not supported');
    }
}

function getCookie(c_name) {
    var i, x, y, cookies = document.cookie.split(";");
    for (i = 0; i < cookies.length; i++) {
        x = cookies[i].substr(0,cookies[i].indexOf("="));
        y = cookies[i].substr(cookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g,"");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function getParam(name, params) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(params);
    if( results == null ) {
        return "";
    } else {
        return results[1];
    }
}

function ajaxRequest(url, params, callback) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (callback != null) {
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callback(xmlhttp.responseText);
            }
        }
    }

    xmlhttp.open("POST", url, true);
    xmlhttp.send(params);
}

