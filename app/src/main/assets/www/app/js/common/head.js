var etoos_swiper = null;
var etoos_util = new EtoosUtil();
var token = "";

// GNB의 학년설정값 변경 시 페이지가 새로고침 되는데,
// 학년에 따라 파라메터나 내용이 달라야 하는 페이지는 본 변수에 URL값을 지정해 주면,
// 해당 URL로 새로고침 된다.
var gnb_set_url = "./index.html";

function initCommon() {
	window.open = cordova.InAppBrowser.open;

	etoos.getLoginToken();
}

function setLoginToken(result) {
	if (typeof result === 'string') {
		var json = JSON.parse(result);
		this.token = json.token;
	}
}

function onLogin(result) {
	if (result == "login_ok") {
		etoos.getLoginToken();
		onLoginSuccessCallback();
	}
}

function onLoginSuccessCallback() {

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