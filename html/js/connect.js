var APP_ID = "123679184369467";

function initFBConnect(img) {
    var token = '';
    var fbSubBtn = document.createElement('Button');
    fbSubBtn.innerHTML = 'Upload to Facebook';
    events(
        fbSubBtn,
        'click',
        function(e) {
            postToFacebook();
        }
    );

    FB.init({
        appId: APP_ID,
		status: true,
		cookie: true,
		xfbml: true
    });
    FB.getLoginStatus(getLoginStatusHandler);

    return {
        getFacebookButton: getFacebookButton
    };

    function getLoginStatusHandler(response) {
        var fbCookie;
        if (response.session) {
            var fButton = (document.getElementsByClassName('content')[0]);
            fButton.parentNode.removeChild(fButton);
            token = session.token;
        } else { }
    }

    function getFacebookButton() {
        if(token) {
            return fbSubBtn;
        }
    }

    function postToFacebook() {
        fbCookie = getCookie("fbs_" + APP_ID);
        token = getParam("access_token", fbCookie);
        ajaxRequest('memeyourfriends.com/upload/', "token=" + token + "&url=" + img.src);
    }
}

