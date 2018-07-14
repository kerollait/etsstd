/*
Etoos UI Function (UI관련 함수 모음 : 퍼블리싱팀에서 작업한 스크립트. 수정한 부분은 별도 코멘트 남겨야 함)

'작성일자 : 2017-04-20
'작 성 자 : 서청훈

'변경일자   변경자  변동내역
'=======================================================================
'=======================================================================
*/
var is_pushstate_supported = ('history' in window && 'pushState' in history);

var isQuickMenuVisibled = false; // keypad 호출 시 quick메뉴가 노출된 상태였는지 체크
var isQuickMenuDisable = false; // quick메뉴 disabled 여부
var quick_menu_wscrt = 0; //초기값
var ti_quick_menu_visible = null;

function initEtoosUI() {

	/*전체메뉴 접고 펼침*/
	$('.leftgnb .gnbtab a').on("click", function (e) {
		var href = $(this).attr('href').replace("#", "");

		if ($('#' + href).css('display') == 'none') {
			var gnbtab = $(this).parents('.gnbtab');
			if (gnbtab.hasClass('tb')) {
				gnbtab.removeClass("tb");
			} else {
				gnbtab.addClass("tb");
			}

			if (is_header_menu_open) {
				if (is_pushstate_supported) {
					if (window.history.state) {
						var state = window.history.state;
						var set_state = {};
						if (state.ui) {
							set_state.ui = state.ui;
						}

						set_state.ui.header_menu_tab = href;
					}

					window.history.replaceState(set_state, '');
				}
			}
		}

		return false;
	});

	$('.depthbtn').on("click", function (e) {
		var depoj = $(this).parent().parent();
		if (depoj.hasClass('on')) {
			depoj.removeClass("on").find('div').slideUp();
		} else {
			depoj.addClass("on").find('div').slideDown();
		}
		return false;
	});
	/*전체메뉴 접고 펼침끝*/

	if ($('div').hasClass('bottomban')) {
		$('html').addClass('bottbtn');
	}


	/*공통 탭 클릭시*/
	$('.onofftab a').on("click", function (e) {
		if ($(this).attr('href').indexOf('#') > -1) {
			var href = $(this).attr('href').replace("#", "");

			if ($('#' + href).length > 0) {
				$(this).addClass("on").parent().siblings().find('a').removeClass("on");
				$('#' + href).show().siblings().hide();
			}

			return false;
		}
	});
	/*공통 탭 클릭시 끝*/

	/* 본문 접기 */
	$('body').on('click', '.viewbtn', function () { /** 수정 : 이벤트 객체대상 body 로 확장 ***/
		if ($(this).hasClass("on")) {
			$(this).removeClass("on").html('본문 접기');
			$('.board_view').slideDown(400, function () {
				if (etoosSwiper) {
					etoosSwiper.resizeContentHeight();
				}
			});
		} else {
			$(this).addClass("on").html('본문 열기');
			$('.board_view').slideUp(400, function () {
				if (etoosSwiper) {
					etoosSwiper.resizeContentHeight();
				}
			});
		}

		var t = setInterval(function () {
			if (etoosSwiper) {
				etoosSwiper.resizeContentHeight();
			}
		}, 10);

		setTimeout(function () {
			clearInterval(t);
		}, 420);

		return false;
	});
	/* 본문 접기 */


	/* 강좌내용 접기 */
	$('body').on('click', '.lecturev .lecturevbtn', function () { /** 수정 : 이벤트 객체대상 body 로 확장 ***/
		if ($(this).hasClass("on")) {
			$(this).removeClass("on");
			$('.lecturevcont').slideDown(400, function () {
				if (etoosSwiper) {
					etoosSwiper.resizeContentHeight();
				}
			});
		} else {
			$(this).addClass("on");
			$('.lecturevcont').slideUp(400, function () {
				if (etoosSwiper) {
					etoosSwiper.resizeContentHeight();
				}
			});
		}

		var t = setInterval(function () {
			if (etoosSwiper) {
				etoosSwiper.resizeContentHeight();
			}
		}, 10);

		setTimeout(function () {
			clearInterval(t);
		}, 420);

		return false;
	});
	/* 강좌내용 접기 */

	/* 타이틀 서브 메뉴 */
	$('.subtitle_box .btn,.tit_sub').on('click', function () {
		//$('body').on('click','.subtitle_box .btn', function() {
		if ($('.submenu').length > 0) {
			if ($(this).parent().parent().hasClass("on")) {
				subtitlecle()
			} else {
				$('.wrap_header').css({ 'z-index': '60' });
				$(this).parent().parent().addClass("on");
				$('#etoosHtmlBody').prepend("<div class='subtitle_boxbg'></div>");
				$('.submenu').slideDown();
			}
			return false;
		}
	});

	$('body').on('click', '.subtitle_boxbg', function () { /** 수정 : 이벤트 객체대상 body 로 확장 ***/
		subtitlecle();
		return false;
	});

	function subtitlecle() {
		$('.submenu').slideUp("fast", function () {
			$('.subtitle_boxbg').remove();
			$('.subtitle_box > div').removeClass("on");
			$('.wrap_header').attr('style', '');
		});
	}
	/* 타이틀 서브 메뉴 끝 */

	/* 서브메뉴 빈공간 span으로 채우기*/
	$(".subtitle_box .submenu .tchsmenu.three > li").each(function (index, element) {
		var explanation = $(element).parent().find('li').length % 3;
		if (explanation == 2) {
			$(element).parent().find('li:last-child').after('<li><span>&nbsp;</span></li>');
		} else if (explanation == 1) {
			$(element).parent().find('li:last-child').after('<li><span>&nbsp;</span></li><li><span>&nbsp;</span></li>');
		}
	});
	$(".subtitle_box .submenu .tchsmenu > li").each(function (index, element) {
		var explanation = $(element).parent().find('li').length % 2;
		if (explanation == 1) {
			$(element).parent().find('li:last-child').after('<li><span>&nbsp;</span></li>');
		}
	});
	/* 서브메뉴 빈공간 span으로 채우기*/


	$('.iconsize').each(function () {
		var iwidth = $(this).attr('iconsizew');
		var iheght = $(this).attr('iconsizeh');

		$(this).css({ 'width': iwidth + 'px', 'height': iheght + 'px' });
	});


	$('body').on('focus', '.textarea textarea', function () { /** 수정 : 이벤트 객체대상 body 로 확장 ***/
		$(this).parent().addClass("on");
	});

	$('body').on('focusout', '.textarea textarea', function () { /** 수정 : 이벤트 객체대상 body 로 확장 ***/
		$(this).parent().removeClass("on");
	});

	// 선생님 전체리스트 열고 닫기
	$('.teacher_list > ul > li > a').on('click', function () {
		if ($(this).parent().hasClass('on')) {
			$(this).parent().removeClass("on");
			$('html, body').animate({ scrollTop: 0 }, 0);
		} else {
			$(this).parent().addClass("on").siblings().removeClass("on")
			var $elementPos = $(this).offset().top;
			$('html, body').animate({ scrollTop: $elementPos }, 0);
		}
		return false;
	});



	////////// UI 스크립트 커스트마이징 : 시작 //////////////////////////////////////////////////////////////

	if (is_pushstate_supported) {
		// UI 관련 popstate 이벤트 처리
		$(window).on('popstate:ui', function (e) {

			// 전체화면 팝업관련 : 시작
			var full_popup = etoosUtil.getPageParamValue('full-popup');

			if (full_popup == 'open') { // 전체화면 팝업 열기
				if (!is_full_popup_open) {
					var open_type, target, anim_type;

					if (window.history.state) {
						var state = window.history.state;
						if (state.ui) {
							if (state.ui.full_popup && state.ui.full_popup == "open") {
								open_type = state.ui.open_type;
								target = state.ui.target;
								anim_type = state.ui.anim_type;

								if (open_type && target && anim_type) {
									fnFullPopupOpen(open_type, target, anim_type);
								}
							}
						}
					} else {
						var pop_obj = etoosUtil.getPageParamValue('pop-obj');
						var pop_url = decodeURIComponent(etoosUtil.getPageParamValue('pop-url'));
						var anim_type = etoosUtil.getPageParamValue('anim-type');

						if (pop_obj || pop_url) {
							fnPopupOpen('full', pop_obj, pop_url, anim_type, true);
						}
					}
				}
			} else { // 전체화면 팝업 닫기
				if (is_full_popup_open) {
					fnFullPopupClose();
				}
			}
			// 전체화면 팝업관련 : 끝


			// 알럿 팝업관련 : 시작
			var alert_popup = etoosUtil.getPageParamValue('alert-popup');

			if (alert_popup == 'open') { // 알럿 팝업 열기
				if (!is_alert_popup_open) {
					var alert_pop_obj;

					if (window.history.state) { // state값이 있다면..
						var state = window.history.state;
						if (state.ui) {
							if (state.ui.alert_popup && state.ui.alert_popup == "open") { // state 값 체크 후
								alert_pop_obj = state.ui.alert_pop_obj;

								if (alert_pop_obj) {
									setTimeout(function () {
										fnAlertPopupOpen(alert_pop_obj); // 팝업 오픈한다
									}, 500);
								}
							}
						}

					} else { // state 값이 없다면.. (주소줄로 직접 연결 등..)
						var alert_pop_obj = etoosUtil.getPageParamValue('alert-pop-obj'); // 팝업 object 값이 있다면..

						if (alert_pop_obj) {
							if (alert_pop_obj.indexOf('#') == -1) {
								alert_pop_obj = '#' + alert_pop_obj;
							}

							setTimeout(function () {
								fnPopupOpen('alert', alert_pop_obj, null, null, true); // state값 기록 후 팝업 오픈한다
							}, 50)
						}
					}
				}
			} else { // 알럿 팝업 닫기
				if (is_alert_popup_open) {
					fnAlertPopupClose();
				}
			}
			// 알럿 팝업관련 : 끝

		});

		$(window).on('popstate', function (e) {

			// popstate 이벤트 발생 시 popstate:ui 이벤트를 강제 발생시킨다.
			$(window).trigger('popstate:ui');
		});

		// 처음 로드 시 URL 파라메터 체크를 위해 popstate:ui 이벤트를 발생시킨다
		setTimeout(function () {
			$(window).trigger('popstate:ui');
		}, 123);
	}
	fnSwipeAreaTab()
	////////// UI 스크립트 커스트마이징 : 종료 //////////////////////////////////////////////////////////////

	$("[name='_init_alpha_elements']").each(function() {
		var $obj = $(this);
		var duration = $obj.data('alpha-duration');
		if (duration == null || typeof duration == 'undefined') {
			duration = 250;
		}

		var timeout = $obj.data('alpha-timeout');
		if (timeout == null || typeof timeout == 'undefined') {
            timeout = 0;
        }

        setTimeout(function() {
            $obj.animate({'opacity': '1'}, duration);
        }, timeout);
	});
}


(function ($) {
	$.randomize = function (arr) {
		for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	};
})(jQuery);


/* 토글 슬라이딩 다운 업 */
function togglea(e, j) {
	if ($(j).hasClass('on')) {
		$(j).removeClass("on");
		$(e).slideUp();
	} else {
		$(j).addClass("on");
		$(e).slideDown();
	}
}

function tabshide(e, j) {
	$(j).addClass("on").parent().siblings().find('a').removeClass("on");
	$(e).show().siblings('div').hide();
	return false;
}

/* 롤링 배너, 탭메뉴 */
function fnSwipeAreaTab(obj) {
	if (obj == null || typeof obj === 'undefined') {
		obj = ".comswiper";
	}

	$(obj).each(function (index) {
		if ($(this).hasClass('not-this')) {  /*** 수정 : not-this 가 포함된 객체는 해당 페이지에서 swiper 처리하므로.. 제외되도록 처리 ***/

		} else {
			var ojthis = $(this);
			var name = ojthis.attr('id');
			var pev = ojthis.attr('pevNo');
			var initialSlide = ojthis.attr('initialSlide');
			var centsild = ojthis.attr('centsild');
			var swloop = ojthis.attr('swloop');
			var pyype = ojthis.attr('pyype');
			var nextno = ojthis.attr('next');
			var atplay = parseInt(ojthis.attr('atplay'));
			var sbtw = parseInt(ojthis.attr('sbtw'));
			var slide_cnt = ojthis.find('div.swiper-slide').length;

			isreturn = (centsild === 'true');
			swloopturn = (swloop === 'true');
			atplayturn = (atplay === 'true');

			pagination = '#' + name + ' .swiper-pagination';

			if (slide_cnt < 2) {
				atplay = null;
				pagination = null;
			}

			index = new Swiper('#' + name + ' .swiper-container', {
				initialSlide: initialSlide,
				slidesPerView: pev,
				centeredSlides: isreturn,
				pagination: pagination,
				loop: swloopturn,
				spaceBetween: sbtw,
				autoplay: atplay,
				autoplayDisableOnInteraction: false,
				paginationType: pyype,
				nextButton: '#' + name + ' .swiper-button-next',
				prevButton: '#' + name + ' .swiper-button-prev',
				onSlideChangeEnd: function (swiper) {
					if (ojthis.hasClass('comtabsw')) {
						onswoper(swiper);
					}
				}
			});

			if (nextno) {
				setTimeout(function () { index.slideTo(nextno, 0) }, 2);
			}

			function onswoper(e) {
				var no = e.activeIndex;
				if (no >= 1) {
					ojthis.find('.more').addClass("open");
				} else {
					ojthis.find('.more').removeClass("open");
				}
			}
			$(this).on("click", '.more', function (e) {
				if ($(this).hasClass('open')) {
					$(this).removeClass("open");
					index.slideTo(0, 300);
				} else {
					$(this).addClass("open")
					index.slideTo(pev, 300);
				}
				return false;
			});
		}
	});
}

// 공통 팝업 오픈
function fnPopupOpen(pop_type, pop_obj, pop_url, anim_type, is_replace) {
	if (pop_type == 'full') { // 전체화면 팝업
		var open_type = "";
		var target = "";

		if (pop_obj != undefined && pop_obj != null && pop_obj != "") {
			open_type = "obj";
			target = pop_obj;
		} else if (pop_url != undefined && pop_url != null && pop_url != "") {
			open_type = "ajax";
			target = pop_url;
		}

		if (anim_type == undefined || anim_type == null) {
			anim_type = "alltop";
		}

		if (target) {
			if (is_pushstate_supported) {
				var state = {
					ui: {
						full_popup: "open",
						open_type: open_type,
						target: target,
						anim_type: anim_type
					}
				}

				var set_url = etoosUtil.pageParamMake(null, null, 'full-popup', 'open', ['full-popup', 'pop-obj', 'pop-url', 'anim-type']);

				if (is_replace) {
					window.history.replaceState(state, '', set_url);
				} else {
					window.history.pushState(state, '', set_url);
				}
			}

			fnFullPopupOpen(open_type, target, anim_type);
		}

	} else if (pop_type == 'alert') { // 작은 팝업

		var target = ""

		if (pop_obj != undefined && pop_obj != null && pop_obj != "") {
			if (is_pushstate_supported) {
				var state = {
					ui: {
						alert_popup: "open",
						alert_pop_obj: pop_obj
					}
				}

				var set_url = etoosUtil.pageParamMake(null, null, 'alert-popup', 'open', ['alert-popup', 'alert-pop-obj']);

				if (is_replace) {
					window.history.replaceState(state, '', set_url);
				} else {
					window.history.pushState(state, '', set_url);
				}
			}

			fnAlertPopupOpen(pop_obj);
		}

	}
}



// 공통 팝업 닫기
function fnPopupClose(pop_type, pop_obj, is_replace) {
	if (pop_type == 'full') { // 전체화면 팝업
		if (is_pushstate_supported) {
			var set_url = etoosUtil.pageParamMake(null, null, null, null, ['full-popup', 'pop-obj', 'pop-url', 'anim-type']);

			if (is_replace) {
				window.history.replaceState(null, '', set_url);
			} else {
				window.history.pushState(null, '', set_url);
			}

			fnFullPopupClose();
		} else {
			fnFullPopupClose();
		}

	} else if (pop_type == 'alert') { // 작은 팝업

		if (is_pushstate_supported) {
			if (window.history.state) {
				var state = window.history.state;
				if (state.ui) {
					if (state.ui.alert_popup_obj) {
						if (!pop_obj) {
							pop_obj = state.ui.alert_popup_obj;
						}
					}
				}
			}

			var set_url = etoosUtil.pageParamMake(null, null, null, null, ['alert-popup', 'alert-pop-obj']);

			if (is_replace) {
				window.history.replaceState(state, '', set_url);
			} else {
				window.history.pushState(state, '', set_url);
			}
		}

		fnAlertPopupClose(pop_obj);
	}
}


/*전체 팝업 열고 닫기*/
var common_loader = '<div class="loader"></div>' //로딩 이미지
var is_full_popup_open = false;

function fnFullPopupOpen(open_type, target, anim_type) {
	var stop = $(document).scrollTop();

	if (open_type == 'ajax') {
		$.ajax({
			type: "POST",
			url: target,
			cache: false,
			contentType: 'application/x-www-form-urlencoded;charset=euc-kr',  /** 수정 : euc-kr 처리 ***/
			beforeSend: function (xhr) {//시작할때
				xhr.overrideMimeType('application/x-www-form-urlencoded;charset=euc-kr');  /** 수정 : euc-kr 처리 ***/

				fnLoaderShow();
			},
			complete: function () { },
			success: function (data) {

				var content = $('#all_popup', data).html();

				$('#etoosHtmlBody').append(content); //팝업 내용 넣기

				is_full_popup_open = true;

				var wsheight = $(window).height() - 42;

				fnSetFullPopupAnim(anim_type, stop, wsheight);
				fnSwipeAreaTab(); //스와이프 탭 호출 - 2차 추가
				fnSetIconSize(); //아이콘 - 2차 추가
			},
			error: function (xhr, textStatus, errorThrown) {
				if (window.console != undefined) {
					console.log((errorThrown) ? errorThrown : xhr.status);
				}

				alert('페이지 로드 중 오류가 발생했습니다.');
				fnFullPopupClose();
				$('#etoosHtmlBody').removeClass('black_bg').find('div.loader').remove();
				window.history.back(-1);
				return false;
			}
		});
	} else {
		is_full_popup_open = true;

		fnLoaderShow();

		var content = $('#' + target + ' .all_popup').clone();
		var wsheight = $(window).height() - 80;

		$('#etoosHtmlBody').append(content); //팝업 내용 넣기

		fnSetFullPopupAnim(anim_type, stop, wsheight);
	}
}

// 로딩이미지 보이기
function fnLoaderShow() {
	$('#etoosHtmlBody').addClass("black_bg").append(common_loader);
}


// 전체 팝업 닫기
function fnFullPopupClose() {
	var cetop = $('.all_popup h1').attr('name');

	if ($('#etoosHtmlBody').hasClass('top_openpopup')) {
		$('#etoosHtmlBody').removeClass("bkbody_pos").addClass('top_clepopup');
	} else {
		$('#etoosHtmlBody').removeClass("bkbody_pos").addClass('right_clepopup');
	}

	setTimeout(function () {
		$('html,body').animate({ scrollTop: cetop }, 0);
	}, 10);

	$('#etoosHtmlBody').addClass("blackc_bg");

	setTimeout(function () {
		is_full_popup_open = false;
	}, 10);

}

function fnFullPopupEndCallback() {
	if (is_full_popup_open) {
		$('#etoosHtmlBody').addClass('bkbody_pos').removeClass("onen_allpopup");
		$('html,body').animate({ scrollTop: 0 }, 0);
		$('.loader').remove();
	} else {
		$('#etoosHtmlBody').attr('class', '');
		$('#etoosHtmlBody > .all_popup').remove();
		$('.loader').remove();
	}
}

function fnSetFullPopupAnim(e, stop, wsheight) {
	var wheight = $(window).height();
	if (e == 'alltop') {
		setTimeout(function () {
			$('.all_popup').addClass(name).css({ 'min-height': wheight + 'px' }).find('> h1').attr('name', stop).parent().find('.allpo_box').css({ 'height': wsheight + 'px' });
			$('#etoosHtmlBody').addClass('top_openpopup'); //팝업 올리기
			$('.all_popup').on('animationend webkitAnimationEnd oAnimationEnd', fnFullPopupEndCallback);
		}, 5);
	} else if (e == 'allright') {
		setTimeout(function () {
			$('.all_popup').addClass(name).css({ 'min-height': wheight + 'px' }).find('> h1').attr('name', stop).parent().find('.allpo_box').css({ 'height': wsheight + 'px' });
			$('#etoosHtmlBody').addClass('right_openpopup'); //팝업 올리기
			$('.all_popup').on('animationend webkitAnimationEnd oAnimationEnd', fnFullPopupEndCallback);
		}, 5);
	}
}

function fnSetIconSize() {
	$('.iconsize').each(function (index) {
		if (!$(this).parent('pre').length) {
			var iwidth = $(this).attr('iconsizew');
			var iheight = $(this).attr('iconsizeh');
			$(this).css({ 'width': iwidth + 'px', 'height': iheight + 'px' });
		}
	});
}
/*전체 팝업 열고 닫기 끝*/


/* 작은팝업 열고 닫기 */
var is_alert_popup_open = false;
var now_alert_popup_open_obj = null; // 현재 열려진 팝업 객체

function fnAlertPopupOpen(obj) {
	var dheight = $(window).height();

	$('.quicknavi').addClass('off');

	$('#etoosHtmlBody').append($(obj));

	$(obj).show();

	now_alert_popup_open_obj = obj;

	is_alert_popup_open = true;

	$('#div_footer_layer').hide();
	$('div.bottomban').hide();

	setTimeout(function () {
		$('#etoosHtmlBody').addClass('on_alertpop');
	}, 50);

	$(obj).find('.alertbg').on('animationend webkitAnimationEnd', fnAlertPopupEndCallback);
}

function fnAlertPopupClose(obj) {
	if (obj == undefined || obj == null) {
		obj = now_alert_popup_open_obj;
	}

	if (!obj || obj == '') {
		return;
	}

	now_alert_popup_open_obj = null;

	setTimeout(function () {
		is_alert_popup_open = false;
	}, 10);

	$('#etoosHtmlBody').addClass('on_alertpopc');

	if (!is_full_popup_open && !is_header_menu_open) {
		$('#div_footer_layer').show();
		$('div.bottomban').show();
	}


	setTimeout(function () {
		$('#etoosHtmlBody').removeClass('on_alertpopc').removeClass('on_alertpop');
		is_alert_popup_open = false;
		if ($('.alertpop').length > 1) {
			$('.alertpop').hide();
		}
		$(obj).hide();
	}, 500);

	$(obj).on('animationend webkitAnimationEnd', fnAlertPopupEndCallback);
}

function fnAlertPopupEndCallback() {
	if (is_alert_popup_open) {
		$('#etoosHtmlBody').addClass('on_alertpopw');
	} else {
		$('#etoosHtmlBody').removeClass('on_alertpopw').removeClass('on_alertpopc').removeClass('on_alertpopw');
		$('.quicknavi').removeClass('off');
	}
}
/*작은팝업 열고 닫기 끝*/


/* 헤더메뉴 열고 닫기 */
var is_header_menu_open = false;

function mainOnNav() {
	if (is_pushstate_supported) {
		var set_url;

		if (is_header_menu_open) {
			/*var state = window.history.state;

			if (state && state.ui && state.ui.header_menu == 'open') {
			window.history.back(-1);
			} else {*/
			set_url = etoosUtil.pageParamMake(null, 'header-menu');

			window.history.replaceState(null, '', set_url);

			mainOnNavToggle();
			//}
		} else {
			set_url = etoosUtil.pageParamMake(null, null, 'header-menu', 'open');

			var header_menu_tab = $('div[id="header_menu_tab_favorit"]').css('display') != 'none' ? 'header_menu_tab_favorit' : 'header_menu_tab_all';

			var state = {
				ui: {
					header_menu: 'open',
					header_menu_tab: header_menu_tab
				}
			}

			window.history.pushState(state, '', set_url);

			mainOnNavToggle();
		}
	} else {
		mainOnNavToggle();
	}
}

function mainOnNavOpen() {
	$("#etoosHtmlBody").addClass("main_nav_on");

	$('#div_footer_layer').hide();

	$('div.bottomban').hide();

	$('.quicknavi').addClass("off")

	is_header_menu_open = true;
}

function mainOnNavClose() {
	var menuParent = $("#etoosHtmlBody");
	menuParent.attr("class", "main_nav_off");

	$('#etoosHtmlBody').removeClass('main_nav_on');

	$('#div_footer_layer').show();

	$('div.bottomban').show();

	setTimeout(function () {
		is_header_menu_open = false;
	}, 200);
}

function mainOnNavToggle() {
	if ($('#etoosHtmlBody').hasClass('main_nav_open')) {
		mainOnNavClose();
	} else {
		mainOnNavOpen();
	}

	$('#cNavNew').on('animationend webkitAnimationEnd oAnimationEnd', mainOnNavEndCallback);
}

function mainOnNavEndCallback() {
	if (!$('#etoosHtmlBody').hasClass('main_nav_open')) {
		$('#etoosHtmlBody').attr("class", "main_nav_open");
	} else {
		$('#etoosHtmlBody').attr("class", "");
	}
}
/* 헤더메뉴 열고 닫기 */


/*선생님 전체보기 열고 닫기*/
function allTeacher() {
	var wrap = $('#etoosHtmlBody');
	$('html, body').animate({ scrollTop: 0 }, 0);
	if (wrap.hasClass('alltchopen')) {
		wrap.removeClass("alltchopen");
	} else {
		wrap.addClass("alltchopen");
	}
	return false;
}