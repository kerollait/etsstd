var etoos_swiper = null;
var etoos_util = new EtoosUtil();
var etoos_storage = new EtoosStorage();
var orientation = "";

var TOKEN = "";
var GRADE = "";
var GRADE_NAME = "";

var url_root = "file:///android_asset/www";
var url_home = url_root + "/app/index.html";
var api_domain = "http://m.etoos.com";
var img_domain = "http://img.etoos.com";
var api_path = api_domain + "/app_api";
var cache_storage_www = "";

var network_state;

function initCommon() {
	cache_storage_www = cordova.file.externalCacheDirectory +"www";
	network_state = navigator.connection.type;

	if (window.open !== cordova.InAppBrowser.open) {
		window.open = cordova.InAppBrowser.open;
	}

    TOKEN = etoos_storage.getItem("TOKEN", "");
    GRADE = etoos_storage.getItem("GRADE", "go3");
    GRADE_NAME = getGradeName(GRADE);

    etoos.setLoginToken(TOKEN);
    etoos.setGrade(GRADE);
    etoos.setGradeName(GRADE_NAME);

    if ("onorientationchange" in window) {
        $(window).off('orientationchange');
        $(window).on('orientationchange', function() {
            setTimeout(function() {
                setOrientationChange();
            }, 100);
        });
    } else {
        orientation = etoos_util.getOrientation();

		$(window).off('resize');
        $(window).on('resize', function(e) {
            var ori = etoos_util.getOrientation();
            if (ori != orientation) {
                setTimeout(function() {
                    orientation = ori;
                    setOrientationChange();
                }, 100);
            }
        });
    }
}

function getGradeName(grade) {
	if (grade == "go2") {
		return "고2";
	} else if (grade == "go1") {
		return "고1";
	} else {
		return "고3·N수";
	}
}

function onWebviewSubscribeCallback() {

}

function onWebviewSubscribeCallbackError() {

}

function setOrientationChange() {

}

function fnSwipePullRefresh() {

}

function onLoginCallback() {

}

function getMemberInfoFromToken() {
	var member_info = {
		MEM_NO: "",
		MEM_NM: "",
		MEM_ID: ""
	}

	if (TOKEN != "") {
		var json = JSON.parse(decodeURI(window.atob(TOKEN)));
		member_info = {
            MEM_NO: json.MEM_NO,
            MEM_NM: json.MEM_ID,
            MEM_ID: json.MEM_NM
        }
	}

	return member_info;
}

