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
	if (TOKEN != null && TOKEN != "") {
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
            url: url
        };
		intentPlugin.startActivityForResult("com.etoos.study", "LoginActivity", JSON.stringify(extras), "1", onLoginCallback);
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
	if ((etoos_swiper && etoos_swiper.status.is_page_loading) || etoos_util.getIsLoading()) {
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
			etoos_util.showLoader();
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
				etoos_util.hideLoader();
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
	if ((etoos_swiper && etoos_swiper.status.is_page_loading) || etoos_util.getIsLoading()) {
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
			etoos_util.showLoader();
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
				etoos_util.hideLoader();
			}, 300);
		}
	});
}


// SNS 공유팝업
function fnSnsSend(sns_gb, title, tag, link_url) {
	var pop = "";
	var is_app = etoos_util.getIsApp(); // 수강앱 여부

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
	var Base64 = {
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encode : function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;

			input = Base64._utf8_encode(input);

			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

			}
			return output;
		},

		_utf8_encode : function (string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}
			return utftext;
		}
	}

	// loading 여부 체크
	if ((etoos_swiper && etoos_swiper.status.is_page_loading) || etoos_util.getIsLoading()) {
		return;
	}

	var is_app = etoos_util.getIsApp(); // 수강앱 여부

	/*var mem_id = etoos_util.getCookie('mem%5Fid');
	var ex_mem_ids = ["modesty11", "modesty111", "yuna91", "kimkim1234", "lhojkp44", "zauberin00", "zauberin5", "napico", "napico2", "apptest1", "apptest2", "apptest3", "apptest4", "kerollait", "carftlee", "dmstmd1209", "byungfeel", "axissoft", "axissoft00", "axissmlee", "lesky4", "aooj91", "lovesoap"];
	var mem_id_except = false;

	$.each(ex_mem_ids, function() {
		if (mem_id == this) {
			mem_id_except = true;
			return false;
		}
	});*/

	var params = "";
	if (gb == 'free_play' || gb == 'free_download') {
		if (folder_nm == undefined || folder_nm == null) {
			folder_nm = "";
		}

		if (content_nm == undefined || content_nm == null) {
			content_nm = "";
		}

		if (start_time == undefined || start_time == null) {
			start_time = "";
		}
		
		/*if (!mem_id_except) {
			if (quality == "E") {
				quality = "H";
			} else if (quality == "E219") {
				quality = "H219";
			}
		}*/

		params = {
			gb: gb,
			prj_mov_id: prj_mov_id,
			mid: mid,
			curri_id: curri_id,
			lecture_id: lecture_id,
			quality: quality,
			folder_nm: escape(encodeURIComponent(folder_nm)),
			content_nm: escape(encodeURIComponent(content_nm)),
			start_time: start_time
		}
	} else if (gb == 'cost_play' || gb == 'cost_download') {

		if (curri_id == undefined || curri_id == null) {
			curri_id = "";
		}

		if (curri_ids == undefined || curri_ids == null) {
			curri_ids = "";
		}
		
		if (start_time == undefined || start_time == null) {
			start_time = "";
		}

		if (sec == undefined || sec == null) {
			sec = "";
		}

		if (prg_rate == undefined || prg_rate == null) {
			prg_rate = "0";
		}

		if (curri_id == "" && curri_ids == "") {
			alert('플레이어를 실행할 수 없습니다. 값이 누락되었습니다.');
			return;
		} else {
			/*if ((quality == 'E' || quality == 'E219') && !mem_id_except) {
				alert('수강앱 서비스 안정화를 위해 잠시 고화질로 재생됩니다.\nEHD화질의 경우 빠른 시일 내 복구토록 하겠습니다.\n\n수강에 불편을 드려 죄송합니다.');
				if (quality == 'E') {
					quality = "H";
				} else {
					quality = "H219";
				}
			}*/

			var params = "gb="+ gb +"&lecture_study_id="+ lecture_study_id +"&quality="+ quality +"&start_time="+ start_time +"&sec="+ sec +"&prg_rate="+ prg_rate;
			if (curri_ids) {
				params += "&"+ curri_ids;				
			} else {
				params += "&curri_id="+ curri_id
			}
		}
	}

	Encoder.EncodeType = "entity";

	var sp = StarPlayerEntApp;
	var app = function(data) {
		sp.debug = "false";
		sp.executeApp(window.btoa(data));
	};

	var token = etoos_util.getCookie('token');
	if (typeof token === 'undefined' || token == null) {
		token = "";
	}

	$.ajax({		
		url: url_root +"/player/player_content.json.asp",
		type: 'post',
		data: params,
		dataType: 'text',
		timeout: 15000,
		beforeSend: function() {
			etoos_util.showLoader();
		},
		success: function(data) {
			var json = JSON.parse(data);
			var err_cd = json.err_cd;
			var err_msg = json.err_msg;

			if (err_cd != '0000') {
				if (err_cd == '0001' && err_msg == '로그인 후 이용 가능합니다.') {
					setLoginState('N');
					loginCheckConfirm();
				} else {
					alert(err_msg.replace(/<br>/gi, '\n'));
				}
			} else {
				if (json.player_gb != "" && is_app == false && (typeof player_gb === "undefined" || player_gb == null || player_gb == "")) {
					player_gb = json.player_gb;
				}

				if (typeof player_gb === "undefined" || player_gb == null || player_gb == "") {
					player_gb = "starplayer";
				}

				if (json.media_url == "") {
					alert('존재하지 않는 영상이거나 미디어정보가 없습니다.');
					return;
				} else {
					if (gb == 'free_play') { // 무료영상 재생

						if (player_gb == "starplayer") {
							var title = encodeURIComponent(json.cont_name);

							var subpage = url_root +"/player/free_player_background.asp";

							var media = {
								url: json.media_url2,
								cc: json.subtitle_file,
								position: json.position,
								tracker: "",
								title: is_app ? window.btoa(title) : title,
								content_id: "free/"+ prj_mov_id +"/"+ mid +"/"+ curri_id +"/"+ lecture_id,
								qna_url: json.qna_url,
								subpage: encodeURI(subpage),
								begin: "",
								end: ""
							};

							if (is_app) {
								if (starplayer_app_init) {
									starplayer_app.streaming(media);
								}
							} else {
								media.func = "streaming";
								media.token = token;

								app(JSON.stringify(media));
							}
						} else if (player_gb == "inka") {
							player_json = '{';
							player_json += '"user_id" : "'+ json.user_id +'",';
							player_json += '"current_url" : "'+ top.document.location.href + '",';
							player_json += '"qna_url" : "'+ json.qna_url +'",';	// [선택] Q&A URL
							player_json += '"cont_name" : "' + json.cont_name + '",';
							player_json += '"cont_url" : "' + json.media_url + '",';

							player_json += '"bgoods_id" : "' + json.bgoods_id + '",';	// [선택] 강좌수강아이디
							player_json += '"bgoods_cnt" : "0003",';				// [선택] LMS 구분 0003 - 모바일스트리밍, 0004 - 모바일다운로드
							player_json += '"class_id" : "' + json.class_id + '",';		// [선택] 강좌아이디
							player_json += '"course_id" : "' + json.course_id + '",';	// [선택] 강의 아이디
							player_json += '"cts_id" : "' + json.cts_id + '",';	// [선택] 주문번호
							player_json += '"psections" : "' + json.psections + '",';	// [필수] LMS 구간기록 정보 0:15,30:50,55:250라고 적혀있을 때 풀이하자면 0초부터 15초, 30초부터 50초, 55초부터 250초를 봤다는 의미입니다
							player_json += '"ppercent" : "' + json.ppercent + '"';					// [선택] LMS 퍼센테이지 정보 정수형만 가능
							player_json += '};';

							player_json_base64 = Base64.encode(player_json);

							callPlayer('smartnetsyncetoosplay', player_json_base64);							
						}
					} else if (gb == 'free_download') { // 무료영상 다운로드

						if (player_gb == "starplayer") {
							var category = encodeURIComponent(Encoder.htmlDecode(json.cate_name3));
							var title = encodeURIComponent(json.cont_name);

							var medias = [];
							var media = {
								category: is_app ? window.btoa(category) : category,
								thumbnail: json.cate_icon2,
								url: json.media_url2,
								cc: "",
								title: is_app ? window.btoa(title) : title,
								desc: is_app ? window.btoa(category) : category,
								teacher: "",
								expiry_date: json.expiry_date,
								content_id: "free/"+ prj_mov_id +"/"+ mid +"/"+ curri_id +"/"+ lecture_id,
								qna_url: ""							
							};
							
							medias.push(media);
						
							if (is_app) {
								if (starplayer_app_init) {
									starplayer_app.multiDownload(medias);
								}
							} else {
								var data = {
									func: "download",
									token: token,
									list: medias
								}
									
								app(JSON.stringify(data));
							}
						} else if (player_gb == "inka") {
							player_json = '{';
							player_json += '"user_id" : "'+ json.user_id +'",';
							player_json += '"current_url" : "'+ top.document.location.href + '",';
							player_json += '"qna_url" : "'+ json.qna_url +'",';	// [선택] Q&A URL
							player_json += '"cate_name_1" : "'+ json.cate_name1 +'",'; // [필수] 카테고리 또는 강좌 제목 (%d는 카테고리 레벨) : 최상위(Level1) 카테고리는 제목만 설정함 EX) 권규호 선생님 | 심화개념(수능)
							player_json += '"cate_name_2" : "'+ json.cate_name2 +'",'; // [필수] 카테고리 또는 강좌 제목 (%d는 카테고리 레벨)	EX) 2012. EBS 어려운 작품분석
							player_json += '"cate_info_2" : "'+ json.cate_info2 +'",'; // [필수] 카테고리 또는 강좌에 대한 설명 텍스트 EX) 0강/7강 | 2011년 7월 31일 까지 수강가능
							player_json += '"cate_icon_2" : "'+ json.cate_icon2 +'",'; // [필수] 리스트에 표시될 카테고리 아이콘 URL : PNG 또는 JPG, 1:1 비율 100x100 pixel 이하 사이즈 권장
							player_json += '"cate_image_2" : "",'; // [필수] 재생 시 플레이어에 표시될 강좌 이미지 URL : PNG 또는 JPG, 1:1 비율 320x320 pixel 사이즈 권장. 오디오 컨텐츠의 경우에만 사용됨

							player_json += '"contents" : [';
							player_json += '{';
							player_json += '	"name" : "' + json.cont_name + '",';
							player_json += '	"content" : "' + json.media_url + '",';
							player_json += '	"bgoods_id" : "' + json.bgoods_id + '",';	// [선택] 강좌수강아이디
							player_json += '	"bgoods_cnt" : "0004",';				// [선택] LMS 구분 0003 - 모바일스트리밍, 0004 - 모바일다운로드
							player_json += '	"class_id" : "' + json.class_id + '",';		// [선택] 강좌아이디
							player_json += '	"course_id" : "' + json.course_id + '",';	// [선택] 강의 아이디
							player_json += '	"cts_id" : "' + json.cts_id + '",';	// [선택] 주문번호
							player_json += '	"psections" : "' + json.psections + '",';	// [필수] LMS 구간기록 정보 0:15,30:50,55:250라고 적혀있을 때 풀이하자면 0초부터 15초, 30초부터 50초, 55초부터 250초를 봤다는 의미입니다
							player_json += '	"ppercent" : "' + json.ppercent + '"';					// [선택] LMS 퍼센테이지 정보 정수형만 가능
							player_json += '}]';
							player_json += '};';

							player_json_base64 = Base64.encode(player_json);

							callPlayer('smartnetsyncetoosdownload', player_json_base64);						
						}
					} else if (gb == 'cost_play') { // 유료영상 재생
						if (player_gb == "starplayer") {					
							var subpage = "http://"+ window.location.host +"/my_room/lecture/study_detail.asp?lecture_study_id="+ lecture_study_id +"&mode=player_subpage";

							if (!is_app) {
								subpage = "http://"+ window.location.host +"/player/interface/starplayer/token_login.asp?token="+ token +"&return_url="+ encodeURIComponent(subpage);
							} else {
								subpage = encodeURI(subpage);
							}

							var qlt = "[고화질]";
							if (quality == "E") {
								qlt = "[EHD]";
							}

							var title = encodeURIComponent(qlt + " " + json.cont_name);

							var media = {
								url: json.media_url2,
								cc: json.subtitle_file,
								position: json.position,
								tracker: json.psections,
								title: is_app ? window.btoa(title) : title,
								content_id: json.bgoods_id +"/"+ json.course_id +"/"+ json.cts_id,
								qna_url: json.qna_url,
								subpage: subpage,
								begin: "",
								end: ""
							};

							if (is_app) {
								if (starplayer_app_init) {
									starplayer_app.streaming(media);
								}
							} else {
								media.func = "streaming";
								media.token = token;

								app(JSON.stringify(media));
							}
						} else if (player_gb == "inka") {
							player_json = '{';
							player_json += '"user_id" : "'+ json.user_id +'",';
							player_json += '"current_url" : "'+ top.document.location.href + '",';
							player_json += '"qna_url" : "'+ json.qna_url +'",';	// [선택] Q&A URL
							player_json += '"cont_name" : "' + json.cont_name + '",';
							player_json += '"cont_url" : "' + json.media_url + '",';

							player_json += '"bgoods_id" : "' + json.bgoods_id + '",';	// [선택] 강좌수강아이디
							player_json += '"bgoods_cnt" : "0003",';				// [선택] LMS 구분 0003 - 모바일스트리밍, 0004 - 모바일다운로드
							player_json += '"class_id" : "' + json.class_id + '",';		// [선택] 강좌아이디
							player_json += '"course_id" : "' + json.course_id + '",';	// [선택] 강의 아이디
							player_json += '"cts_id" : "' + json.cts_id + '",';	// [선택] 주문번호
							player_json += '"psections" : "' + json.psections + '",';	// [필수] LMS 구간기록 정보 0:15,30:50,55:250라고 적혀있을 때 풀이하자면 0초부터 15초, 30초부터 50초, 55초부터 250초를 봤다는 의미입니다
							player_json += '"ppercent" : "' + json.ppercent + '",';					// [선택] LMS 퍼센테이지 정보 정수형만 가능
							player_json += '"subtitle_file" : "' + json.subtitle_file + '"';
							player_json += '};';

							player_json_base64 = Base64.encode(player_json);
							
							callPlayer('smartnetsyncetoosplay', player_json_base64);
						}
					} else if (gb == 'cost_download') {
						if (player_gb == "starplayer") {
							var category = encodeURIComponent(Encoder.htmlDecode(json.cate_name2));
							var teacher = encodeURIComponent(json.cate_name3);

							var qlt = "[고화질]";
							if (quality == "E") {
								qlt = "[EHD]";
							}
							
							var medias = [];
							$.each(json.contents, function() {								
								var title = encodeURIComponent(qlt + " " + this.name);								
								var media = {
									category: is_app ? window.btoa(category) : category,
									thumbnail: json.cate_icon2,
									url: this.media_url2,									
									cc: this.subtitle_file,
									title: is_app ? window.btoa(title) : title,
									desc: is_app ? window.btoa(category) : category,
									teacher: is_app ? window.btoa(teacher) : teacher,
									expiry_date: json.expiry_date,
									content_id: this.bgoods_id +"/"+ this.course_id +"/"+ this.cts_id,
									qna_url: json.qna_url									
								};

								medias.push(media);
							});
						
							if (is_app) {
								if (starplayer_app_init) {
									starplayer_app.multiDownload(medias);
								}
							} else {
								var data = {
									func: "download",
									token: token,
									list: medias
								}
								
								app(JSON.stringify(data));
							}
						} else if (player_gb == "inka") {
							player_json = '{';
							player_json += '"user_id" : "'+ json.user_id +'",';
							player_json += '"current_url" : "'+ top.document.location.href + '",';
							player_json += '"qna_url" : "'+ json.qna_url +'",';	// [선택] Q&A URL
							player_json += '"cate_name_1" : "'+ json.cate_name1 +'",'; // [필수] 카테고리 또는 강좌 제목 (%d는 카테고리 레벨) : 최상위(Level1) 카테고리는 제목만 설정함 EX) 권규호 선생님 | 심화개념(수능)
							player_json += '"cate_name_2" : "'+ json.cate_name2 +'",'; // [필수] 카테고리 또는 강좌 제목 (%d는 카테고리 레벨)	EX) 2012. EBS 어려운 작품분석
							player_json += '"cate_info_2" : "'+ json.cate_info2 +'",'; // [필수] 카테고리 또는 강좌에 대한 설명 텍스트 EX) 0강/7강 | 2011년 7월 31일 까지 수강가능
							player_json += '"cate_icon_2" : "'+ json.cate_icon2 +'",'; // [필수] 리스트에 표시될 카테고리 아이콘 URL : PNG 또는 JPG, 1:1 비율 100x100 pixel 이하 사이즈 권장
							player_json += '"cate_image_2" : "",'; // [필수] 재생 시 플레이어에 표시될 강좌 이미지 URL : PNG 또는 JPG, 1:1 비율 320x320 pixel 사이즈 권장. 오디오 컨텐츠의 경우에만 사용됨

							contents = "";
							$.each(json.contents, function() {
								contents += ',{';
								contents += '	"name" : "' + this.name + '",';
								contents += '	"content" : "' + this.media_url + '",';
								contents += '	"bgoods_id" : "' + this.bgoods_id + '",';	// [선택] 강좌수강아이디
								contents += '	"bgoods_cnt" : "0004",';				// [선택] LMS 구분 0003 - 모바일스트리밍, 0004 - 모바일다운로드
								contents += '	"class_id" : "' + this.class_id + '",';		// [선택] 강좌아이디
								contents += '	"course_id" : "' + this.course_id + '",';	// [선택] 강의 아이디
								contents += '	"cts_id" : "' + this.cts_id + '",';	// [선택] 주문번호
								contents += '	"psections" : "' + this.psections + '",';	// [필수] LMS 구간기록 정보 0:15,30:50,55:250라고 적혀있을 때 풀이하자면 0초부터 15초, 30초부터 50초, 55초부터 250초를 봤다는 의미입니다
								contents += '	"ppercent" : "' + this.ppercent + '"';					// [선택] LMS 퍼센테이지 정보 정수형만 가능
								contents += '}';
							});

							contents = contents.replace(',', '');

							player_json += '"contents" : ['+ contents + ']';
							player_json += '}';

							player_json_base64 = Base64.encode(player_json);

							callPlayer('smartnetsyncetoosdownload', player_json_base64);							
						}
					}
				}
			}
		},
		error: function(r, a, b) {
			//alert(r.responseText);
			alert('플레이어 실행 중 오류가 발생했습니다. 잠시 후 다시 이용해 주세요!');
			return;
		},
		complete: function() {
			setTimeout(function() {
				etoos_util.hideLoader();
			}, 300);
		}
	});	
}

/*
이투스 플레이어 : 종료 ========================================================================================
*/




/*
마켓(앱스토어) 이동 처리
*/
function fnGoAppMarket(android_url, ios_url, ipad_url, android_alert_msg, ios_alert_msg) {
	var os_nm = etoos_util.getOSName();

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




/*
* 새창열기 (수강앱접속 구분)
*	url : 이동할 URL
*	login : 수강앱인 경우 외부 브라우저 로그인 동기화 처리 여부 (true/false)
*				=> 외부 브라우저로 URL 띄울 때 해당 페이지가 로그인이 필요한 페이지인 경우 true 로 셋팅하면 수강앱의 로그인 정보가 외부 브라우저와 동기화 됨
*/
function fnAppWindowOpen(url, login) {
	var is_app = etoos_util.getIsApp(); // 수강앱 여부

	if (is_app) {
		var open_url = "";
		if (login == true) {
			var token = etoos_util.getCookie('token');
			if (typeof token === 'undefined' || token == null) {
				token = "";
			}

			open_url = url_root + "/player/interface/starplayer/token_login.asp?token="+ token +"&return_url="+ encodeURIComponent(url);
		} else {
			open_url = url;
		}

		if (etoos_util.getOSName() == 'iphone' || etoos_util.getOSName() == 'ipad') {
			top.window.IOSWebViewJavascriptBridgeInterface.JSCallOC(open_url);
		} else if (etoos_util.getOSName() == 'android') {
			top.window.WebViewJavascriptBridgeInterface.openBrowser(open_url);
		}
	} else {
		window.open(url);
	}
}