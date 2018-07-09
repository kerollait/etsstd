var etoos_swiper = null;
var etoos_util = new EtoosUtil();
var TOKEN = "";
var GRADE = "go3";

var url_root = "file:///android_asset/www";
var api_domain = "http://m.etoos.com";
var img_domain = "http://img.etoos.com";
var api_path = api_domain + "/app_api";
var gnb_set_url = "file:///android_asset/www/app/index.html";
var cache_storage_www = "";

function initCommon() {
	window.open = cordova.InAppBrowser.open;

	etoos.getLoginTokenAndGrade();
	cache_storage_www = cordova.file.externalCacheDirectory +"www";
}

function setLoginTokenAndGrade(result) {
	if (typeof result === 'string') {
		var json = JSON.parse(result);

		this.TOKEN = json.token;
		this.GRADE = json.grade;
	}
}

function onLogin(result) {
	if (result == "login_ok") {
		etoos.getLoginTokenAndGrade();
		onLoginSuccessCallback();
	}
}

function onLoginSuccessCallback() {

}

function FileUtils() {
    function saveFileFromUrl(url, save_dir, save_file_nm) {
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(url);
        fileTransfer.download(
            uri,
            save_dir,
            function(entry) {
                console.log("download complete: " + entry.toURL());
            },
            function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
            }
        );
    }
}



// 학년 설정
function fnGrdChange() {
	var cookie_grd = etoos_util.getCookie('etgrd');
	var now_grd = "go3";
	var grd = jQuery('input:radio[name="set_etgrd"]:checked').val();

	if (now_grd != grd || !cookie_grd) {
		var set_url = etoos_util.pageParamMake(null, 'etgrd', 'etgrd', grd, ['full-popup', 'pop-obj', 'pop-url', 'anim-type', 'header-menu', 'alert-popup', 'alert-pop-obj']);
		if (gnb_set_url) {
			set_url = etoos_util.pageParamMake(gnb_set_url, 'etgrd', 'etgrd', grd);
		}

		etoos_util.setCookie('etgrd', grd, 365);



		if (is_pushstate_supported) {
			setTimeout(function() {
				if (is_header_menu_open) {
					document.location.href = set_url;
				} else {
					document.location.replace(set_url);
				}
			}, 150);

			if (is_header_menu_open) {
				window.history.go(-2);
			}

		} else {
			setTimeout(function() {
				document.location.replace(set_url);
			}, 150);
		}

	} else {
		set_url = etoos_util.pageParamMake(null, null, null, null, ['alert-popup', 'alert-pop-obj']);

		if (is_pushstate_supported) {
			if (is_header_menu_open) {
				setTimeout(function() {
					window.history.pushState(null, '', set_url);
					window.history.back(-1);
				}, 150);

				window.history.back(-1);
			} else {
				window.history.replaceState(null, '', set_url);
			}
		}
	}

	fnAlertPopupClose('#intro_go');
}