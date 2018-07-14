var etoosSwiper = null;
var etoosUtil = new EtoosUtil();
var etoosStorage = new EtoosStorage();
var orientation = "";

var url_root = "file:///android_asset/www";
var api_domain = "http://m.etoos.com";
var api_ssl_domain = "https://m.etoos.com:44300";
var img_domain = "http://img.etoos.com";
var api_path = api_domain + "/app_api";
var api_ssl_path = api_ssl_domain + "/app_api";
var cache_storage_www = "";

var network_state;

var EtoosMessage = {
	network_offline: "네트워크 연결이 원할하지 않습니다. 연결상태를 확인해 주세요!"
}

var EtoosServiceUrl = {
	home: url_root +"/app/index.html",
	myroom: url_root +"/app/my_room/index.html"
}

var EtoosApiUrl = {
	login: api_ssl_path +"/auth/login.asp",
	logout: api_ssl_path +"/auth/logout.asp",
	token_verify: api_ssl_path +"/auth/token_verify.asp",
	gnb_member_info: api_domain +"/common/data/common/gnb_member_info.json.asp"
}

var EtoosData = {
	getMakeTokenFromMemberInfo: function(member_info) {
		if (member_info != null && typeof member_info === 'object') {
			var token = {
                "mem_no": member_info.mem_no,
                "mem_id": member_info.mem_id,
                "mem_nm": member_info.mem_nm,
                "session_id": member_info.session_id,
                "encmem_no": member_info.encmem_no,
                "login_dt": member_info.login_dt,
                "enc_pwd": member_info.enc_pwd
            };

            return token;
		} else {
			return "";
		}
	},
	getToken: function() {
		return etoosStorage.getItem("login.token", "");
	},

	setToken: function(token) {
		var encode_token = window.btoa(escape(JSON.stringify(token)));

		etoosStorage.setItem("login.token", encode_token);
		etoos.setLoginToken(encode_token);
	},

	removeToken: function() {
		etoosStorage.removeItem("login.token");
		etoos.setLoginToken("");
	},

	tokenVerify: function() {
		if (EtoosData.getToken() != "") {
			if (network_state !== Connection.NONE) {
				// 세션 유효성 검증
                $.ajax({
                    url: EtoosApiUrl.token_verify,
                    method: "post",
                    data: {
                        token: EtoosData.getToken()
                    },
                    timeout: 3000,
                    dataType: "text",
                    success: function (data) {
                        var json = JSON.parse(data);

                        var err_cd = json.err_cd;
                        var err_msg = json.err_msg;

                        if (err_cd != '0000') { // 세션 만료

                            // 자동로그인 사용중이라면..
                            if (etoosStorage.getItem("login.auto_login") == "Y") {
								$.ajax({
	                                url: EtoosApiUrl.login,
	                                method: "post",
	                                data: {
	                                    token: EtoosData.getToken(),
	                                    mode: "token_login"
	                                },
	                                timeout: 3000,
	                                dataType: "text",
	                                success: function (data) {
	                                    var json = JSON.parse(data);

	                                    var err_cd = json.err_cd;
	                                    var err_msg = json.err_msg;

	                                    if (err_cd == '0000') {
	                                        var member_info = json.member_info;
	                                        var token = EtoosData.getMakeTokenFromMemberInfo(member_info);
	                                        EtoosData.setToken(token);
	                                    } else { // 로그인 실패
	                                        EtoosData.removeToken();
	                                        etoosStorage.removeItem("login.auto_login");
	                                        onAutoLoginFailCallback();
	                                    }
	                                }
	                            });
                            } else {
                                EtoosData.removeToken();
                                onAutoLoginFailCallback();
                            }
                        }
                    }
                });
			}
		} else {
			onAutoLoginFailCallback();
		}
	},

	getMemberInfoFromToken: function() {
    	var token = this.getToken();
    	var member_info = {
    		mem_no: "",
    		mem_nm: "",
    		mem_id: ""
    	}

    	if (token != "") {
    		try {
    			var json = JSON.parse(unescape(window.atob(token)));
                member_info = {
                    mem_no: json.mem_no,
                    mem_nm: json.mem_nm,
                    mem_id: json.mem_id
                }
    		} catch(e) {
    			return null;
    		}
    	}

    	return member_info;
    },

    getGrade: function() {
    	return etoosStorage.getItem("common.grade", "go3");
    },

    setGrade: function(grade) {
        etoosStorage.setItem("common.grade", grade);
        etoos.setGrade(grade);
    },

    getGradeName: function() {
    	var grade = this.getGrade();
    	if (grade == "go2") {
    		return "고2";
    	} else if (grade == "go1") {
    		return "고1";
    	} else {
    		return "고3·N수";
    	}
    }
}


function initCommon() {
	document.addEventListener("online", onNetworkStateChange, false);
	document.addEventListener("offline", onNetworkStateChange, false);

	cache_storage_www = cordova.file.externalCacheDirectory +"www";
	network_state = navigator.connection.type;

	if (window.open !== cordova.InAppBrowser.open) {
		window.open = cordova.InAppBrowser.open;
	}

    if ("onorientationchange" in window) {
        $(window).off('orientationchange');
        $(window).on('orientationchange', function() {
            setTimeout(function() {
                setOrientationChange();
            }, 100);
        });
    } else {
        orientation = etoosUtil.getOrientation();

		$(window).off('resize');
        $(window).on('resize', function(e) {
            var ori = etoosUtil.getOrientation();
            if (ori != orientation) {
                setTimeout(function() {
                    orientation = ori;
                    setOrientationChange();
                }, 100);
            }
        });
    }

    etoosStorage.removeItem("login.return_url");
}

function onNetworkStateChange() {
	network_state = navigator.connection.type;
}

function onAutoLoginFailCallback() {

}

function onWebviewSubscribeCallback(params) {
	console.log(params);
	if (params == null || !typeof params =='Object' || params.length == 0) {
        return;
    }

    var obj = params[0];
    if (obj.type == 'url_move') {
        var url = obj.url;

        if (url != null && typeof url == 'string') {
            document.location.href = url;
        }
    }
}

function onWebviewSubscribeCallbackError() {

}

function setOrientationChange() {

}

function fnSwipePullRefresh() {

}

function onLoginCallback(result) {
	if (result == null || !typeof result =='Object') {
        return;
    }

    console.log(result);

    if (result.login_state == 'ok') {
        var login_status = etoosStorage.getItem("login.status", "");
        if (login_status != null && login_status == "ok") {
            onLoginCompleteCallback();
            etoosStorage.removeItem("login.status");
        }
    }
}

function onLoginCompleteCallback() {
	var return_url = etoosStorage.getItem("login.return_url", "");
	if (return_url != "") {
		etoosStorage.removeItem("login.return_url");
		document.location.href = return_url;
	}
}

function fnGoMyroom() {
	if (loginCheck(EtoosServiceUrl.myroom)) {
		return;
	} else {
		document.location.href = EtoosServiceUrl.myroom;
	}
}