var APP_ID = "1c6f5e338c7989f098ad50f8c1224878";

var load = function(e) {
    bounds = {
        x: 0,
        y: 0,
        cWidth: 0,
        cHeight: 0,
        tWidth: 0,
        tHeight: 0,
        aWidth: 0,
        aHeight: 0
    };
            
    var cropping = false;

    var url = document.getElementById('imgInput');
    var cropBox = document.getElementById('cropBox');
    var cropP = cropBox.parentNode;
    var img = document.getElementById('initImg');
    var crop = document.getElementById('crop');
    var rCrop = document.getElementById('cropReset');
    var reset = document.getElementById('reset');
    var top = document.getElementById('top');
    var bot = document.getElementById('bot');
    var sub = document.getElementById('submitBtm');
 
    var loading = document.createElement('Div');
    loading.appendChild(document.createTextNode('Loading...'));

    reset.parentNode.removeChild(reset);
    cropP.removeChild(cropBox);

    img.className = 'resized';

    events(img, 'load', pictureLoaded);
    events(url, 'change', changePicture);
    events(crop, 'click', toggleCrop);
    events(rCrop, 'click', resetCrop);
    events(reset, 'click', resetPicture);
    events(sub, 'click', submit);

    function submit(e) {
        var x = parseInt((bounds.x / bounds.tWidth) * bounds.aWidth);
        var width = parseInt((bounds.cWidth / bounds.tWidth) * bounds.aWidth) - x;
        var y = parseInt((bounds.y / bounds.tHeight) * bounds.aHeight);
        var height = parseInt((bounds.cHeight / bounds.tHeight) * bounds.aHeight) - y;
        var params = '?url=' + escape(url.value) +
            '&top=' + escape(top.value) + '&bot=' + escape(bot.value) +
            '&x=' + x + '&width=' + width +
            '&y=' + y + '&height=' + height;
        var src = 'http://www.willhughes.ca:8080/' + params;
        if(img.src === src) {
            return;
        }
        img.src = src;

        if(cropping) {
            toggleCrop();
        }
     
        img.parentNode.appendChild(loading);
        img.style.display = 'none';

        try {
            var p = crop.parentNode;
            p.removeChild(rCrop);
            p.replaceChild(reset, crop);
            cropP.removeChild(cropBox);
        } catch(e) {}
    }

    function pictureLoaded(e) {
        try {
            loading.parentNode.removeChild(loading);
            img.style.display = '';
        } catch(e) { }
    }

    function resetPicture(e) {
        changePicture();
        var p = reset.parentNode;
        p.replaceChild(rCrop, reset);
        p.insertBefore(crop, rCrop);
        toggleCrop();
        toggleCrop();
    }

    function changePicture(e) {
        if(img.src !== url.value) {
            events(img, 'load', resize);
            img.src = url.value;
        } else {
            resize();
        }
        
        function resize(resizeEvent) {
            events(img, 'load', resize, true);

            img.className = '';
            var w = img.width;
            var h = img.height;

            img.className = 'resized';

            if(e || window.event) {
                bounds = {
                    x: 0,
                    y: 0,
                    cWidth: img.width,
                    cHeight: img.height,
                    tWidth: img.width,
                    tHeight: img.height,
                    aWidth: w,
                    aHeight: h
                };
                if(cropBox) {
                    cropBox.innerHTML = '';
                }
            }

            cropBox.style.width = bounds.tWidth;
            cropBox.style.height = bounds.tHeight;
        }
    }

    var dotSize = 12;

    function resetCrop(e) {
        changePicture({});
        if(cropping) {
            toggleCrop();
            toggleCrop();
        }
    }

    function toggleCrop(e) {
        if(cropping) {
            crop.innerHTML = 'Start Cropping';
            
            for(var i = 0; i < cropBox.children.length; i++) {
                var n = cropBox.children[i];
                if(!/Blur/.test(n.id)) {
                    cropBox.removeChild(n);
                    i--;
                }
            }
        } else {
            cropP.appendChild(cropBox);
            cropBox.style.top = img.offsetTop + 'px';
            crop.innerHTML = 'Finish Cropping';
            
            var blurs = [];
            if(cropBox.children.length > 0) {
                for(var i = 0; i < cropBox.children.length; i++) {
                    blurs.push(cropBox.children[i]);
                }
            } else {
                for(var i = 0; i < 4; i++) {
                    var blur = document.createElement('Div');
                    blur.className = 'blur';
                    blur.id = 'Blur' + i;
                    blurs.push(blur);
                    cropBox.appendChild(blur);
                }
            }
            positionBlurs(blurs);

            var dots = [];
            for(var i = 0; i < 4; i++) {
                var dot = document.createElement('Div');
                dot.className = 'dot';
                dot.id = 'Dot' + i;
                events(dot, 'mousedown', startDrag);
                dots.push(dot);
                cropBox.appendChild(dot);
            }
            positionDots(dots);

            var box = document.createElement('Div');
            box.className = 'box';
            box.id = 'Box0';
            events(box, 'mousedown', startDrag);
            positionBox(box);
            cropBox.appendChild(box);
            
        }
        cropping = !cropping;

        function startDrag(e) {
            // prevent annoying selection while dragging
            document.body.className = 'noselect';

            if(!e) {
                e = window.event;
            }

            var sx = e.clientX;
            var sy = e.clientY;
            var t = e.target || e.srcElement;
            var i = parseInt(t.id.charAt(3), 10);
            var hor = dots[(i + 1) % 2 + (parseInt(i/2) * 2)];
            var ver = dots[(i + 2) % 4];
            var boundsH = i % 2;
            var boundsV = i > 1;

            var ix = parseInt(t.style.left, 10);
            var iy = parseInt(t.style.top, 10);
            var w = bounds.cWidth - bounds.x;
            var h = bounds.cHeight - bounds.y;
            var update = /Dot/.test(t.id) ? free : move;

            events(document.body, 'mousemove', drag);
            events(document.body, 'mouseup', endDrag);

            function drag(e) {
                var dx = e.clientX - sx;
                var dy = e.clientY - sy;

                update(dx, dy);
            }

            function endDrag(e) {
                // allow non-annoying selection
                document.body.className = '';

                events(document.body, 'mousemove', drag, true);
                events(document.body, 'mouseup', endDrag, true);
            }

            function free(dx, dy) {
                var pos = checkBounds(
                    { left: dx + ix, top: dy + iy},
                    { x: dotSize, y: dotSize }
                );
                
                if(boundsH) {
                    bounds.cWidth = pos.left + dotSize;
                } else {
                    bounds.x = pos.left;
                }

                if(boundsV) {
                    bounds.cHeight = pos.top + dotSize;
                } else {
                    bounds.y = pos.top;
                }
                positionBox(box);
                
                // OPTIMIZE
                positionBlurs(blurs);

                // Only update the three dots that have moved
                // -- Could also just do positionDots(dots)
                t.style.left = pos.left + 'px';
                t.style.top = pos.top + 'px';
                hor.style.top = pos.top + 'px';
                ver.style.left = pos.left + 'px';
            }

            function vert(dx, dy) {
            }

            function hor(dx, dy) {
            }

            function move(dx, dy) {
                var pos = checkBounds(
                    { left: dx + ix, top: dy + iy },
                    { x: w, y: h }
                );

                bounds.cWidth = pos.left + w;
                bounds.cHeight = pos.top + h;
                bounds.x = pos.left;
                bounds.y = pos.top;

                positionDots(dots);
                positionBlurs(blurs);
                positionBox(box, true);
            }

            function checkBounds(pos, extra) {
                if(pos.left < 0) {
                    pos.left = 0;
                }
                if(pos.top < 0) {
                    pos.top = 0;
                }

                if(pos.left > bounds.tWidth - extra.x) {
                    pos.left = bounds.tWidth - extra.x;
                }
                if(pos.top > bounds.tHeight - extra.y) {
                    pos.top = bounds.tHeight - extra.y;
                }
                return pos;
            }
        }
    }

    function positionDots(dots) {
        for(var i = 0; i < dots.length; i++) {
            var dot = dots[i];
            dot.style.left = ((i % 2 == 1) ? (bounds.cWidth  - dotSize) : (bounds.x)) + 'px';
            dot.style.top  = ((i > 1) ? (bounds.cHeight - dotSize) : (bounds.y)) + 'px';
        }
    }

    function positionBlurs(blurs) {
        for(var i = 0; i < blurs.length; i++) {
            var blur = blurs[i];
            blur.style.left = ((i < 3) ? 0 : (bounds.cWidth)) + 'px';
            blur.style.width = ((i < 2) ? bounds.tWidth + 'px' : (((i === 2) ? bounds.x : (bounds.tWidth - bounds.cWidth)) + 'px'));
            blur.style.top = ((i === 0) ? 0 : (i > 1) ? (bounds.y) : bounds.cHeight) + 'px';
            blur.style.height = ((i === 0) ? bounds.y : (i > 1) ? bounds.cHeight - bounds.y : bounds.tHeight - bounds.cHeight) + 'px';
        }
    }

    function positionBox(box, pos) {
        box.style.left   = bounds.x + 'px';
        box.style.top    = bounds.y + 'px';
        if(!pos) {
            box.style.width  = (bounds.cWidth  - bounds.x - 2) + 'px';
            box.style.height = (bounds.cHeight - bounds.y - 2) + 'px';
        }            
    }

    function getLoginStatusHandler(response) {
	var fbCookie;
	if (response.session) {
	} else {
	}
    }

    function postToFacebook() {
	fbCookie = getCookie("fbs_" + APP_ID);
	token = getParam("access_token", fbCookie);
	ajaxRequest(POST_TO_FB_URL, "token:"+token);
    }

    FB.init({appId: APP_ID,
		status: true,
		cookie: true,
		xfbml: true});
    FB.getLoginStatus(getLoginStatusHandler);
};

events(window, 'load', load);

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
    // code for IE7+, Firefox, Chrome, Opera, Safari
    if (window.XMLHttpRequest) {
	xmlhttp=new XMLHttpRequest();
    // code for IE6, IE5
    } else {
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (callback != null) {
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		callback(xmlhttp.responseText);
	    }
	}
    }

    xmlhttp.open("POST", url, true);
    xmlhttp.send(params);
}