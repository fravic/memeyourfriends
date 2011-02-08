function _Application() {

    var _memeImgSrc;

    // Event handlers.  Due to limitations in phoneGap's API, these must be public
    this.onPictureSelected = function(imageSrc) {
	console.log("Photo selected successfully.");
	_memeImgSrc = imageSrc;
	$("#memeImg").attr("src", imageSrc);
    }

    this.onPictureFail = function(message) {
	console.error("Could not select photo.  Error: " + message);
	alert("Failed to load picture.  Please try again.");
    }

    function selectFromLibrary() {
	console.log("User selecting photo...");
	try {
	    navigator.camera.getPicture(Application.onPictureSelected,
					Application.onPictureFail, {
					    quality: 100, 
					    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
					    destinationType: navigator.camera.DestinationType.FILE_URI
						});
	} catch (e) {
	    console.error("Could not start photo selector.  Error: " + e);
	    alert("The device photo library is not available.");
	}
    }

    function selectFromCamera() {
	console.log("User taking camera photo...");
	try {
	    navigator.camera.getPicture(Application.onPictureSelected,
					Application.onPictureFail, {
					    quality: 100, 
					    sourceType: navigator.camera.PictureSourceType.CAMERA,
					    destinationType: navigator.camera.DestinationType.FILE_URI
						});
	} catch (e) {
	    console.error("Could not start camera.  Error: " + e);
	    alert("The device camera is not available.");
	}
    }

    function onDeviceReady() {
	console.log("Device ready.");
	$("#selectImage").click(selectFromLibrary);
	$("#selectCamera").click(selectFromCamera);
    }

    $(document).bind("deviceready", onDeviceReady);      
}

function preventBehavior(e) { 
    e.preventDefault(); 
}

var Application = new _Application();
