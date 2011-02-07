var APP_ID = "1c6f5e338c7989f098ad50f8c1224878";

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

