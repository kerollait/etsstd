var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        initCommon();
        initEtoosUI();

        this.initContents();
    },

    initContents: function() {
    	$(".gnbti").children("strong").html(GRADE_NAME);

    	$("input:radio[id='etgrd_"+ GRADE +"']").prop("checked", true);

    	if (TOKEN != "") {
    		var member_info = getMemberInfoFromToken();

    		$(".loginname").children("strong").htlm(member_info.MEM_NM +"님");

    		$(".loginbox").hide();
    		$(".loginname").show();
    	} else {
    		$(".loginbox").show();
            $(".loginname").hide();
    	}

    	$('.gnbhead').animate({'opacity': '1'}, 250);
    }
};

app.initialize();

function onLoginCallback(params) {
	if (params == null || !typeof params =='Object') {
        return;
    }

    if (params.login_state == 'ok') {
        document.location.reload();
    }
}

function fnSwipePullRefresh() {
	initCommon();
	app.initContents();
}

function fnPlayerAppMarket() {
    fnGoAppMarket(PLAYER_APP_ANDROID_MARKET_URL, PLAYER_APP_IPHONE_URL, PLAYER_APP_IPAD_URL);
}

// 학년 설정
function fnGrdChange() {
    var grd = $('input:radio[name="set_etgrd"]:checked').val();

    if (GRADE != grd) {
        etoos_storage.setItem("GRADE", grd);
        etoos.setGrade(grd);

        var params = [{
            type: "url_move",
            url: url_home
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

    if (loginCheckConfirm(url)) {
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