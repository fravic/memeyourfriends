var APP_ID = "123679184369467";

function initFBConnect() {
    FB.init({
        appId: APP_ID,
		status: true,
		cookie: true,
		xfbml: true
    });
    FB.getLoginStatus(getLoginStatusHandler);

    function getLoginStatusHandler(response) {
        var fbCookie;
        if (response.session) {
            // Do something
        } else {
            // Do something else?
        }
    }

    function postToFacebook() {
        fbCookie = getCookie("fbs_" + APP_ID);
        token = getParam("access_token", fbCookie);
        ajaxRequest(POST_TO_FB_URL, "token:"+token);
    }
}

