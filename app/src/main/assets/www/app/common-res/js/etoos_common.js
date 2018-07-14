/*
Etoos Common Function (이투스 공통 함수 모음)

'작성일자 : 2017-04-20
'작 성 자 : 서청훈

'변경일자   변경자  변동내역
'=======================================================================
'=======================================================================
*/

/*
로그인 체크 : 시작 ========================================================================================
*/
// 로그인 여부 가져오기
function isLogin() {
	var token = EtoosData.getToken();
	if (token != null && token != "") {
		return true;
	} else {
		return false;
	}
}

// 로그인 체크 후 로그인 페이지 이동
function loginCheck(url) {
	if (isLogin()) {
		return false;
	} else {
		if (url == null || typeof url === 'undefined') {
			url = "";
		}

		var extras = {
			mode: "login",
			return_url: encodeURI(url)
        };

		intentPlugin.startActivityForResult("com.etoos.study", "LoginActivity", extras, "1", onLoginCallback);

		return true;
	}
}

// 로그인 체크 후 로그인 페이지 이동 (confirm type)
function loginCheckConfirm(url, msg) {
	if (isLogin()) {
		return false;
	} else {
		if (msg == "" || msg == undefined) {
			msg = "로그인 후 이용 가능합니다.\n지금 로그인 하시겠습니까?";
		}

		if (confirm(msg)) {
			loginCheck(url);
			return true;
		}
		return true;
	}
}

/*
로그인 체크 : 끝 ========================================================================================
*/



/*
컨텐츠 스크랩
*/
function fnContentScrap(job, scr_fold_no, scr_fold_nm, scr_seq, scr_title, scr_url, scr_gb_cd, success_callback) {
	// loading 여부 체크
	if ((etoosSwiper && etoosSwiper.status.is_page_loading) || etoosUtil.getIsLoading()) {
		return;
	}

	if (!success_callback instanceof Function) {
		success_callback = function () {
			alert('스크랩 되었습니다.');
		}
	}

	var params = {
		job: job,
		scr_fold_no: scr_fold_no,
		scr_fold_nm: escape(encodeURIComponent(scr_fold_nm)),
		scr_seq: scr_seq,
		scr_title: escape(encodeURIComponent(scr_title)),
		scr_url: escape(encodeURIComponent(scr_url)),
		scr_gb_cd: scr_gb_cd
	}

	$.ajax({
		type: "POST",
		url: api_domain + "/common/data/mystudyroom/scrap_p.json.asp",
		data: params,
		dataType: "text",
		beforeSend: function () {
			etoos.showLoading();
		},
		success: function (data) {
			var json = JSON.parse(data);
			var err_cd = json.err_cd;
			var err_msg = json.err_msg;

			if (err_cd != '0000') {
				alert(err_msg.replace(/<br>/gi, '\n'));
			} else {
				if (success_callback instanceof Function) {
					success_callback();
				}
			}
		},
		error: function () {
			alert('처리 도중 오류가 발생했습니다. 잠시 후 다시 이용해 주세요!');
		},
		complete: function () {
			setTimeout(function () {
				etoos.hideLoading();
			}, 300);
		}
	});
}



/*
URL SNS 공유 : 시작 ========================================================================================
*/

// 단축 URL 생성 및 SNS 공유 실행
function fnContentShare(sns_gb, title, tag, link_url, kakao_btn_title, kakao_img, kakao_width, kakao_height) {
	// loading 여부 체크
	if ((etoosSwiper && etoosSwiper.status.is_page_loading) || etoosUtil.getIsLoading()) {
		return;
	}

	if (sns_gb == null || sns_gb == undefined) {
		return;
	}

	sns_gb = sns_gb.toLowerCase();

	var chBit_ID = "etoos";
	var chBit_APIKey = "R_07948703a78c555acedce35044725172";
	var chBit_LongUrl = link_url; //단축URL로 만들 주소

	$.ajax({
		type: "POST",
		url: "http://api.bit.ly/v3/shorten",
		data: {
			login: chBit_ID,
			apiKey: chBit_APIKey,
			longUrl: chBit_LongUrl
		},
		dataType: "json",
		beforeSend: function () {
			etoos.showLoading();
		},
		success: function (data) {
			if (data.status_code == 200) {
				if (sns_gb == "url") {
					setClipboardData(null, data.data.url);
				} else if (sns_gb == "kakao") {
					if (kakao_img == '' || kakao_img == undefined) { kakao_img = "http://img.etoos.com/teacher/event/2015/09/sns_03/240x240_b.jpg"; }
					if (kakao_width == '' || kakao_width == undefined) { kakao_width = "240"; }
					if (kakao_height == '' || kakao_height == undefined) { kakao_height = "240"; }
					fnKakaoSend(title, kakao_img, kakao_width, kakao_height, kakao_btn_title, data.data.url);
				} else {
					fnSnsSend(sns_gb, title, tag, data.data.url);
				}
			} else {
				alert('단축 URL 생성에 실패했습니다. 잠시 후 다시 이용해 주세요!');
			}
		},
		complete: function () {
			setTimeout(function () {
				etoos.hideLoading();
			}, 300);
		}
	});
}


// SNS 공유팝업
function fnSnsSend(sns_gb, title, tag, link_url) {
	var pop = "";
	var is_app = etoosUtil.getIsApp(); // 수강앱 여부

	title = encodeURIComponent(title);
	tag = encodeURIComponent(tag);
	link_url = encodeURIComponent(link_url);

	if (sns_gb == "twitter") {
		fnAppWindowOpen("https://twitter.com/intent/tweet?text=" + title + "&url=" + link_url);
	} else if (sns_gb == "facebook") {
		fnAppWindowOpen("http://m.facebook.com/sharer.php?s=100&u=" + link_url + "&p[images][0]=&t=" + title);
	}

	if (!is_app) {
		if (pop) {
			pop.focus();
		} else {
			alert('팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.');
		}
	}
}


// 카카오 공유
function fnKakaoSend(title, img_src, w, h, btn_text, link_url) {
	if (!Kakao.API) {
		Kakao.init('a116a8b236dccdc8c02f0c6c339b1308');
	}

	Kakao.Link.cleanup();
	Kakao.Link.sendDefault({
		objectType: 'feed',
		content: {
			title: title,
			imageUrl: img_src,
			link: {
				webUrl: link_url,
				mobileWebUrl: link_url
			},
			imageWidth: parseInt(w),
			imageHeight: parseInt(h)
		},
		buttonTitle: btn_text,
		installTalk: true,
		fail: function (err) {
			alert(JSON.stringify(err));
		},
		success: function (messageobj) {

		}
	});

}

// 카카오 텍스트 공유
function fnKakaoTextSend(title, btn_text, link_url) {
	if (!Kakao.API) {
		Kakao.init('a116a8b236dccdc8c02f0c6c339b1308');
	}

	Kakao.Link.cleanup();
	Kakao.Link.sendDefault({
		objectType: 'feed',
		content: {
			title: title,
			link: {
				webUrl: link_url,
				mobileWebUrl: link_url
			}
		},
		buttonTitle: btn_text,
		installTalk: true,
		fail: function (err) {
			alert(JSON.stringify(err));
		},
		success: function (messageobj) {

		}
	});
}


// 클립보드 복사 prompt
function setClipboardData(text, url) {
	if (text == undefined || text == null) {
		text = "내용을 길게 눌러 복사후\n블로그나 카페에 붙여넣기 해주세요."
	}

	prompt(text, url);
}

/*
URL SNS 공유 : 끝 ========================================================================================
*/





/*
이투스 플레이어 : 시작 ========================================================================================
*/


// 무료플레이어 스트리밍
function fnPlayerFreePlay(prj_mov_id, mid, curri_id, lecture_id, quality, start_time, content_nm, player_gb) {
	fnPlayerEncryptExec('free_play', '', curri_id, prj_mov_id, mid, lecture_id, quality, '', start_time, '', '', '', content_nm, player_gb);
}

// 무료플레이어 싱글 다운로드
function fnPlayerFreeDownload(prj_mov_id, mid, curri_id, lecture_id, quality, folder_nm, content_nm, player_gb) {
	fnPlayerEncryptExec('free_download', '', curri_id, prj_mov_id, mid, lecture_id, quality, folder_nm, '', '', '', '', content_nm, player_gb);
}

// 유료플레이어 스트리밍
function fnPlayerCostPlay(lecture_study_id, curri_id, quality, sec, prg_rate, player_gb) {
	fnPlayerEncryptExec('cost_play', lecture_study_id, curri_id, '', '', '', quality, '', '', '', sec, prg_rate, '', player_gb);
}

// 유료플레이어 다운로드
function fnPlayerCostDownload(lecture_study_id, curri_ids, quality, player_gb) {
	fnPlayerEncryptExec('cost_download', lecture_study_id, '', '', '', '', quality, '', '', curri_ids, '', '', '', player_gb);
}

// 데이터 암호화 후 플레이어 실행
function fnPlayerEncryptExec(gb, lecture_study_id, curri_id, prj_mov_id, mid, lecture_id, quality, folder_nm, start_time, curri_ids, sec, prg_rate, content_nm, player_gb) {

}

/*
이투스 플레이어 : 종료 ========================================================================================
*/




/*
마켓(앱스토어) 이동 처리
*/
function fnGoAppMarket(android_url, ios_url, ipad_url, android_alert_msg, ios_alert_msg) {
	var os_nm = etoosUtil.getOSName();

	if (os_nm == 'android') {
		if (!android_url) {
			if (android_alert_msg != undefined && android_alert_msg != null) {
				alert(android_alert_msg);
			}
		} else {
			if (android_url.indexOf('market://') > -1) {
				document.location.replace(android_url);
			} else {
				window.open(android_url);
			}
		}

	} else if (os_nm == 'iphone' || os_nm == 'ipad') {
		if (ios_url || ipad_url) {
			if (os_nm == 'iphone') {
				window.open(ios_url ? ios_url : ipad_url);
			} else if (os_nm == 'ipad') {
				window.open(ipad_url ? ipad_url : ios_url);
			}
		} else {
			if (ios_alert_msg != undefined && ios_alert_msg != null) {
				alert(ios_alert_msg);
			}
		}
	}
}