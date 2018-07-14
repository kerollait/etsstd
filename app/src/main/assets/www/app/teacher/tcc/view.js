var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        initCommon();
        initEtoosUI();
        initTcc();
    }
};

app.initialize();

var page_param_tcc_view = {
	mode: "all",
	list_hash_params: "",
	swipe_scroll_top: "",
	swipe: "",
	board_arti_id: "24031928",
	teacher_id: "200245",
	teacher_nm: "강원우",
	area_cd: "",
	best_yn: "",
	reply_use_yn: "N"
};

function initTcc() {
	var $tcc_img = $('div.tccvimg').find('img');
    var win_width = $(window).width();

    if (win_width > 410) {
        $tcc_img.css({'width': '410px', 'height': '230.6px', 'visibility': 'visible'});
        $tcc_img.closest('div.tccvimg').css('text-align', 'center');
    } else {
        $tcc_img.css({'visibility': 'visible'});
    }

    $('.subcontent > .board_view').find('img').each(function() {
        if ($(this).width() > $(window).width()) {
            $(this).css('width', '100%');
        }
    });

    // 표준 이미지는 16:9(영상비율) 비율 이므로.. 계산하여 적용한다.. (비율이 맞지 않는 이미지가 있을 수 있으므로..)
    $('span.img', '.retcc').find('img').each(function() {
        var height = parseInt(9 * ($(this).width() / 16));

        $(this).css('height', height +'px');
    });

    etoos.hideLoading();
}


function onLoginSuccessCallback() {
	alert('로그인 되었다!!!' + token);
}

// 최신 TCC 상세보기
function fnLatelyTccView(board_id, board_arti_id) {
	if (etoosSwiper) {
		etoosSwiper.goSubMenu("view", "board_id="+ board_id +"&board_arti_id="+ board_arti_id +"&_swipe_scroll_top="+ page_param_tcc_view.swipe_scroll_top);
	} else {
		var url = "view.html?mode="+ page_param_tcc_view.mode;

		if (page_param_tcc_view.mode == "teacher") {
			url += "&teacher_id="+ page_param_tcc_view.teacher_id;
		}

		if (page_param_tcc_view.list_hash_params != "") {
			url += "&list_hash_params="+ encodeURIComponent(page_param_tcc_view.list_hash_params);
		}

		url += "&board_id="+ board_id +"&board_arti_id="+ board_arti_id +"&_swipe_scroll_top="+ page_param_tcc_view.swipe_scroll_top;

		document.location.href = url;
	}
}

// TCC 목록
function fnTccList() {
	var list_url = "";

	if (etoosSwiper) { // EtoosSwiper 객체내라면..
		var params = "";

		// 스크롤위치가 기록되있지 않다면.. 해당 TCC 컨텐츠 위치로 이동되도록..
		if (etoosSwiper.menu_list[etoosSwiper.now_menu].scrolltop == null && page_param_tcc_view.swipe_scroll_top == "") {

			params = "anchor=tcc_"+ page_param_tcc_view.board_arti_id +"&anchor_rev_px="+ -($('#top_swiper_menu').height() + 1);

		} else if (page_param_tcc_view.swipe_scroll_top != "" && etoosSwiper.isNumeric(page_param_tcc_view.swipe_scroll_top)) {

			params = "anchor_scroll_top="+ page_param_tcc_view.swipe_scroll_top;

		}

		// 목록으로 이동..
		etoosSwiper.goMainMenu(params, page_param_tcc_view.list_hash_params);

	} else { // 외부 URL로 연결된 경우라면..

		if (page_param_tcc_view.mode == "all") { // 영역별 TCC 라면..

			list_url += "file:///android_asset/www/app/teacher/tcc/list.html";

		} else if (page_param_tcc_view.teacher_id != "") { // 선생님 개별 TCC 라면..

			list_url += "file:///android_asset/www/app/teacher/main.html?teacher_id="+ page_param_tcc_view.teacher_id;

		}

		if (list_url != "") {
			if (page_param_tcc_view.list_hash_params != "") { // hash 값을 가지고 있다면..

				list_url += "#!/"+ page_param_tcc_view.list_hash_params;

				if (page_param_tcc_view.swipe_scroll_top != "" && etoosSwiper.isNumeric(page_param_tcc_view.swipe_scroll_top)) { // swiper 스크롤 위치가 있다면..

					list_url += "&anchor_scroll_top="+ page_param_tcc_view.swipe_scroll_top;

				} else { // 없다면.. 해당 TCC 컨텐츠 위치로 이동되도록..

					list_url += "&anchor=tcc_"+ page_param_tcc_view.board_arti_id +"&anchor_rev_px=-78";

				}

			} else if (page_param_tcc_view.teacher_id != "") { // hash 값이 없다면 선생님 TCC 메뉴로 이동

				list_url += "#!/menu=tcc&anchor=top_swiper_menu";

			}
		}

		if (list_url != "") {
			var params = [{
                type: "url_move",
                url: list_url
            }];

            webview.Close(params);
		} else {
			webview.Close();
		}
	}
}

function fnTccDownload() {
	if (loginCheck()) { // etoos_common.js
		return false;
	} else {
		fnPlayerFreeDownload('260868', '', '', '', 'E', '', '교재 선택도 전략이다!<BR>너에게 딱 맞는 교재 알랴줌 :) ');
	}
}

function fnTccScrap() {
	if (loginCheck()) { // etoos_common.js
		return false;
	} else {
		var scr_url = "http://www.etoos.com/teacher/Tcc/TccDetail.asp?board_id=2312&board_arti_id=24031928&teacher_id=200245";

		fnContentScrap('C', '1', 'TCC', '', "교재 선택도 전략이다!<BR>너에게 딱 맞는 교재 알랴줌 :) ", scr_url, '0004', function() {
			if (confirm('스크랩 되었습니다.\n스크랩 리스트를 마이룸에서 확인하시겠습니까?')) {
				//document.location.href = "http://www.etoos.com/mystudyroom/scrap/scrap_list.asp";
				document.location.href = "/my_room/scrap/scrap_list.asp";
			}
		});
	}
}