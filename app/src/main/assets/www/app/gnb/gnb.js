var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        // 로그인 세션 검증
        EtoosData.tokenVerify();

        initCommon();
        initEtoosUI();

        this.initContents();
    },

    initContents: function() {
    	$(".gnbti").children("strong").html(EtoosData.getGradeName());

    	$("input:radio[id='etgrd_"+ EtoosData.getGrade() +"']").prop("checked", true);

    	if (EtoosData.getToken() != "") {
    		var member_info = EtoosData.getMemberInfoFromToken();

    		if (network_state !== Connection.NONE) {
                $.ajax({
                    url: EtoosApiUrl.gnb_member_info,
                    method: "post",
                    data: {
                        mem_no: member_info.mem_no
                    },
                    timeout: 3000,
                    dataType: "text",
                    success: function (data) {
                        var json = JSON.parse(data);

                        var err_cd = json.err_cd;
                        var err_msg = json.err_msg;

                        if (err_cd == '0000' && EtoosData.getToken() != "") {
							var mem_grade_nm = json.mem_grade_nm;

                            var study_cnt = parseInt(json.study_cnt);
                            var qna_cnt = parseInt(json.qna_cnt);
                            var slippaper_cnt = parseInt(json.slippaper_cnt);
                            var cart_cnt = parseInt(json.cart_cnt);
                            var order_cnt = parseInt(json.order_cnt);
                            var coupon_cnt = parseInt(json.coupon_cnt);
                            var teacher_qna_all_cnt = parseInt(json.teacher_qna_all_cnt);
                            var scrap_cnt = parseInt(json.scrap_cnt);

                            $('#gnb_mem_grade_nm').html(mem_grade_nm);

                            if (study_cnt > 0) {
                                if (study_cnt > 999) {
                                    study_cnt = "999+";
                                }

                                $('#gnb_mem_stat_study').html(study_cnt).show();
                            }

                            if (qna_cnt > 0) {
                                $('#gnb_mem_stat_qna').show();
                            } else {
                                $('#gnb_mem_stat_qna').hide();
                            }

                            if (slippaper_cnt > 0) {
                                if (slippaper_cnt > 999) {
                                    slippaper_cnt = "999+";
                                }

                                $('#gnb_mem_stat_slippaper').html(slippaper_cnt).show();
                            }

                            if (cart_cnt > 0) {
                                if (cart_cnt > 999) {
                                    cart_cnt = "999+";
                                }

                                $('#gnb_mem_stat_cart').html(cart_cnt).show();
                            }

                            if (coupon_cnt > 0) {
                                if (coupon_cnt > 999) {
                                    coupon_cnt = "999+";
                                }

                                $('#gnb_mem_stat_point').html(coupon_cnt).show();
                            }
                        }
                    }
                });
            }

    		$(".loginname").children("strong").html(member_info.mem_nm +"님");

    		$(".loginbox").hide();
    		$(".loginname").show();
    		$("#logout_section").show();
    	} else {
    	    $('#gnb_mem_grade_nm').html("");
    	    $('#gnb_mem_stat_study').html("").hide();
    	    $('#gnb_mem_stat_qna').hide();
            $('#gnb_mem_stat_slippaper').html("").hide();
            $('#gnb_mem_stat_cart').html("").hide();
            $('#gnb_mem_stat_point').html("").hide();

    		$(".loginbox").show();
            $(".loginname").hide();
            $("#logout_section").hide();
    	}

    	$('.gnbhead').animate({'opacity': '1'}, 250);
    }
};

app.initialize();

function onAutoLoginFailCallback() {
	app.initContents();
}

function onLoginCompleteCallback() {
	app.initContents();
}

function fnSwipePullRefresh() {
	// 로그인 세션 검증
    EtoosData.tokenVerify();

	app.initContents();
}

function fnPlayerAppMarket() {
    fnGoAppMarket(PLAYER_APP_ANDROID_MARKET_URL, PLAYER_APP_IPHONE_URL, PLAYER_APP_IPAD_URL);
}

// 학년 설정
function fnGrdChange() {
    var grd = $('input:radio[name="set_etgrd"]:checked').val();

    if (EtoosData.getGrade() != grd) {
        EtoosData.setGrade(grd);

        var params = [{
            type: "url_move",
            url: EtoosServiceUrl.home
        }];

        webview.Close(params);
    } else {
        window.history.back(-1);
    }

    fnAlertPopupClose('#intro_go');
}

function fnGnbClose() {
	var params = [{
		type: "gnb_close"
	}];

	webview.Close(params);
}

function fnGnbMyStudyLink(gb) {
    var url = "";

    switch (gb) {
    case 'study': // 수강중인 강좌
        url = "http://m.etoos.com/my_room/lecture/lecture_watch.asp?recent_yn=Y";
        break;

    case 'qna': // QNA
        url = "http://m.etoos.com/my_room/qna/tea_qna_default.asp";
        break;

    case 'slippaper': // 쪽지
        url = "http://m.etoos.com/my_room/slip_paper/slip_paper_list.asp";
        break;

    case 'cart': // 장바구니
        url = "http://m.etoos.com/my_room/order/cart_list.asp";
        break;

    case 'order': // 주문/배송
        url = "http://m.etoos.com/my_room/order/order_list.asp";
        break;

    case 'point': // E-통장
        url = "http://m.etoos.com/my_room/order/ebank/coupon_list.asp";
        break;

    case 'scrap': // 학습보관함
        url = "http://m.etoos.com/my_room/scrap/scrap_list.asp";
        break;
    }

    if (loginCheck(url)) {
        return;
    } else {
        if (url) {
            if (is_header_menu_open) {
                document.location.replace(url);
            } else {
                document.location.href(url);
            }
        }
    }
}

function fnLogout() {
	if (network_state !== Connection.NONE) {
        $.ajax({
            url: EtoosApiUrl.logout,
            method: "post",
            data: {
                token: EtoosData.getToken()
            },
            beforeSend: function() {
                etoos.showLoading();
            },
            timeout: 3000,
            dataType: "text",
            success: function (data) {
                var json = JSON.parse(data);

                var err_cd = json.err_cd;
                var err_msg = json.err_msg;

                if (err_cd == '0000') {
                    logoutProcess();
                }
            },
            error: function () {
                window.plugins.toast.showWithOptions({
                    message: "처리 중 오류가 발생했습니다. 잠시 후 다시 이용해 주세요.",
                    duration: "short",
                    position: "bottom",
                    addPixelsY: -40
                });
            },
            complete: function() {
                etoos.hideLoading();
            }
        });
    } else {
        logoutProcess();
    }

    function logoutProcess() {
        EtoosData.removeToken();
        etoosStorage.removeItem("login.auto_login");

        var params = [{
            type: "url_move",
            url: EtoosServiceUrl.home
        }];

        webview.Close(params);
    }
}