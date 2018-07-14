/*
Etoos Swiper Framework (Hashbang 타입)

'작성일자 : 2017-03-08
'작 성 자 : 서청훈

'변경일자   변경자  변동내역
'=======================================================================
'=======================================================================
*/

function EtoosSwiper(cfg) {
	"use strict";
	
	/*
		Private 변수 선언 ====================================================================
	*/
	var context = this;
	var window_scroll_top = 0;
	var orientation = "";	
	var config;

	if (is_pushstate_supported == undefined) {
		var is_pushstate_supported = ('history' in window && 'pushState' in history);
	}

	// 환경설정 기본값	
	var default_config = {
		hashbang: "#!/",
		top_swiper_menu_selector: "#top_swiper_menu", // top swiper menu 객체
		top_swiper_menu_container_selector: "#top_swiper_menu_container", // top swiper menu container 객체
		top_swiper_menu_nav_btn_selector: "#top_swiper_menu_nav", // top swiper menu nav button 객체
		use_top_swiper_menu_nav: false, // top swiper menu next/prev 버튼 사용 여부
		use_top_swiper_menu_hash_history: true, // top swiper menu 의 hash history 기록할지 여부 (false일 경우 url이 replace되어 history.back 시 이전메뉴로 못돌아감)
		use_top_swiper_menu_fixed: true, // top swiper menu fix 여부
		use_menu_reload_hash_history: false, // main menu의 hash값이 변경되어 리로드 될때 hash history를 기록할지 여부..
		top_swiper_menu_config: {			
			slidesPerView: 2.8,
			spaceBetween: 0,
			breakpoints: {
				640: {
					slidesPerView: 2.8
				},
				960: {
					slidesPerView: 3.8
				},
				1280: {
					slidesPerView: 4.8
				}
			}
		}, // top swiper menu config default
		swiper_content_container_selector: "#mainContent", // Swiper content container 객체
		swiper_content_selector: ".mainContent", // Swiper content 객체
		menu_key: "menu", // hash의 default menu key (ex #menu=main...)
		sub_menu_key: "sub_menu", // hash의 default sub menu key (ex #menu=main&sub_menu=detail)
		sub_menu_external_mode: false, // sub페이지를 swipe 방식이 아닌 외부url로 연결할지 여부 (각 메뉴별로 별도지정 가능)
		default_menu: null, // default 메인페이지 메뉴 title (null일경우 첫번째 메뉴로 지정됨)
		use_random_default_menu: false, // default menu를 랜덤으로 지정하고자 할 경우 true
		random_default_menu_range: {
			start: null, // 최소값 : 1
			end: null // 최대값 : 메뉴갯수
		}, // default menu 랜덤 범위
		use_hash: true, // hash 사용 여부 (url history를 기록하고자 한다면 사용해야 함)
		auto_scrolling: true, // 자동 스크롤 제어 : menu가 바뀔때 최상단으로 이동하는 기능 사용여부 (각 메뉴별로 별도지정 가능)
		use_auto_scrolling_animate: false, // 자동 스크롤 시 애니메이션 효과를 사용할지 여부
		init_auto_hash_make: true, // init 시 주소줄에 hash값이 없을경우 자동으로 반영할지 여부
		init_auto_top_menu_swiping: true, // init 시 top_swiper_menu 해당 메뉴 위치로 slide처리 할지 여부
		on_menu_change_close_submenu: true, // menu가 변경될 때 서브메뉴가 열려있는 페이지인 경우 자동으로 메인메뉴로 로드할지 여부 (각 메뉴별로 별도지정 가능)
		on_submenu_load_auto_scroll: true, // 서브메뉴 로드 시 상단으로 자동 스크롤 할지 여부 (각 메뉴별로 별도지정 가능)
		default_loader: 'spinner',
		content_load_fail_msg: "컨텐츠를 불러오지 못했습니다.<br>새로고침 후 이용해 주세요.<br><br>문제가 해결되지 않으면 고객센터로 문의해주세요.",
		use_content_load_fadein_animate: true, // 컨텐츠 로드 후 fadeIn 애니메이션 사용 여부
		iosslider_animate_duration: 0 // iosSlider slide change Duration
	};

	// 기본 로더
	var loader = {
		spinner: '<div id="swiper_menu_loader" style="display:none;"><svg version="1.1" style="position:fixed;left:50%;margin:-30px 0 0 -30px;z-index:15" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="60px" height="60px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="0.5" fill="#aaaaaa" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#054e54" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.8s" repeatCount="indefinite"/></path></svg></div>',

		three_dot: '<div id="swiper_menu_loader" style="display:none;"><svg style="position:fixed;left:50%;margin:-30px 0 0 -30px;z-index:15" width="60" height="15" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#aaa"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" /></circle></svg></div>',		

		facebook: '<div id="swiper_menu_loader" style="display:none;"><svg style="position:fixed;left:50%;margin:-30px 0 0 -20px;z-index:15" width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-facebook"><g transform="translate(20 50)"><rect x="-10" y="-30" width="20" height="60" fill="#cec9c9" opacity="0.6"><animateTransform attributeName="transform" type="scale" from="2" to="1" begin="0s" repeatCount="indefinite" dur="1s" calcMode="spline" keySplines="0.1 0.9 0.4 1" keyTimes="0;1" values="2;1"></animateTransform></rect></g><g transform="translate(50 50)"><rect x="-10" y="-30" width="20" height="60" fill="#cec9c9" opacity="0.8"><animateTransform attributeName="transform" type="scale" from="2" to="1" begin="0.1s" repeatCount="indefinite" dur="1s" calcMode="spline" keySplines="0.1 0.9 0.4 1" keyTimes="0;1" values="2;1"></animateTransform></rect></g><g transform="translate(80 50)"><rect x="-10" y="-30" width="20" height="60" fill="#cec9c9" opacity="0.9"><animateTransform attributeName="transform" type="scale" from="2" to="1" begin="0.2s" repeatCount="indefinite" dur="1s" calcMode="spline" keySplines="0.1 0.9 0.4 1" keyTimes="0;1" values="2;1"></animateTransform></rect></g></svg></div>',

		facebook2: '<div id="swiper_menu_loader" style="display:none;"><svg version="1.1" style="position:fixed;left:50%;margin:-30px 0 0 -18px;z-index:15" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="36px" height="45px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="10" width="4" height="10" fill="#aaa" opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.7s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.7s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.7s" repeatCount="indefinite" /></rect><rect x="8" y="10" width="4" height="10" fill="#aaa"  opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.7s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.7s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.7s" repeatCount="indefinite" /></rect><rect x="16" y="10" width="4" height="10" fill="#aaa"  opacity="0.2"><animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.7s" repeatCount="indefinite" /><animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.7s" repeatCount="indefinite" /><animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.7s" repeatCount="indefinite" /></rect></svg></div>'
	};


	/*
		Public 변수 선언 ====================================================================
	*/
	context.debug = false; // console log 출력 여부

	context.menu_list = {}; // 메뉴 객체
	context.menu_cnt = 0; // 메뉴 갯수
	context.now_menu = ""; // 현재 메뉴
	context.prev_menu = ""; // 이전 메뉴
	context.top_swiper_menu = null; // top swipe menu 객체
	context.main_slider = null; // ios slider 객체

	// Swiper 상태관련 변수 객체
	context.status = {
		is_init: false, // init 여부
		iosslide_status: null, // page_slide 상태값 (loaded: 로드완료, change: onChange, complete: onComplete)
		is_slide_from_touch: false, // page slide가 touch 이벤트로 인해 변경되었는지 여부 (메뉴 클릭으로 변경되는경우 false)
		is_page_change: false, // page(메뉴) 변경 여부 (변경중일때 true, 변경완료 후 false)
		is_main_menu_reload: false, // 메인메뉴 reload 여부
		is_onscroll_fnc_executing: false, // 메뉴에 정의된 onscroll 함수 실행 여부 (중복실행 방지위해)
		is_auto_scroll_executing: false, // auto scroll 실행 여부 (실행되면 즉시 true로 변경, 350ms 뒤에 스크롤 후 false로 변경) true 시 onscroll 이벤트 중단.
		is_page_loading: false, // page loading 중 여부
		is_hashchange_block: false, // hashchange 이벤트 막을지 여부
		is_submenu_load_after_top_menu_clicked: false, // 서브메뉴가 로드된 상태에서 top 메뉴 클릭시 true로 변경됨
		is_main_menu_load: false // goMainMenu 함수 호출 시 true로 변경됨
	}


	/*
		Private function ==================================================
	*/

	// Page Orientation 변경시 실행될 함수
	function setOrientationChange() {
		document.location.reload();
	}




	/*
		Public function ==================================================
	*/

	/*
		EtoosSwiper 초기화
	*/
	context.init = function(cfg) {
		if (!context.status.is_init) {
			config = default_config;

			// custom config 적용
			for (var property in cfg) {
				config[property] = cfg[property];
			}

			$(config.swiper_content_container_selector).prepend(loader[config.default_loader]);

			/*
				Swipe 메뉴 객체 생성
				top_swiper_menu_container_selector > .swiper-wrapper > .swiper-slide > a
					href : 해당메뉴의 직접 접근 가능한 URL 기입 (필수값은 아니나 직관적인 UI를 위해 정확히 기록해줍시다..)
					data-main-menu : 메인 메뉴명 (필수값, 유니크해야함)
					data-main-url : 메인 컨텐츠 URL (필수값)
					data-sub-menu[n] : 서브 페이지가 있을경우 이름 지정 (ex: 상세페이지 (data-sub-menu1="detail"))
					data-sub-url[n] : 서브 페이지 컨텐츠 URL
					data-sub-menu-external-mode[n] : 서브 페이지를 swipe 방식이 아닌 외부url로 연결할지 여부
					data-cache : 캐시여부 (default: true) => false인 경우 항상 새로 불러온다
					data-preload : preload 여부 (default: false) => 페이지 첫 접근 시 true로 정의된 메뉴들을 미리 로드한다
					data-onload-fnc : onload callback 함수명 (ex: fnMenu1Onload) => 컨텐츠 로드완료 후 실행될 callback 함수
										컨텐츠 URL 페이지에 $(document).ready() 대신 onload 함수를 정의하여 실행해야 함
					data-unload-fnc : unload callback 함수명 (ex: fnMenu1Unload) => 슬라이드 변경 등으로 메뉴가 unload 될때 실행될 callback 함수
					data-slide-complete-fnc : slide onComplete callback 함수명 (ex: fnMenu1OnSlideComplete) => Slide onComplete 함수 실행 시 실행될 callback 함수
					data-auto-scrolling : 자동 스크롤 제어여부 -> 페이지 로드 후 스크롤제어를 자동으로 할것인지..
					data-menu-unload-valid-fnc : 메뉴를 벗어날 때 실행할 검증 function. false를 return 할 경우 메뉴이동이 중단된다.
													단, menu를 직접 click 할 때만 실행 된다. 화면을 touch 하여 swiping 시엔 작동 불가.
					data-onscroll-fnc : swiper framework 내부의 $(window).scroll() 이벤트 시 실행해줄 함수 선언. 컨텐츠 페이지에서 별도로 scroll event 구현해도 상관없음.
					data-on-menu-change-close-submenu : menu가 변경될 때 submenu가 열려있는 페이지인 경우 자동으로 main menu로 로드할지 여부
					data-on-submenu-load-auto-scroll : submenu 로드 시 상단으로 자동 스크롤 할지 여부

			*/
			var menu_seq = 0;
			$('.swiper-wrapper > .swiper-slide > a', config.top_swiper_menu_container_selector).each(function(i) {
				var $link = $(this);
				
				// Swiper 메뉴가 아닌 외부연결 링크인 경우..
				if ($link.data('external-menu') && $link.data('external-menu') == true) {

				// Swiper 메뉴라면..
				} else {
					menu_seq = menu_seq + 1;

					var main_menu = $link.data('main-menu');
					var main_url = $link.data('main-url');
					var cache = $link.data('cache');
					var preload = $link.data('preload');				
					var auto_scrolling = $link.data('auto-scrolling');
					var on_menu_change_close_submenu = $link.data('on-menu-change-close-submenu');
					var on_submenu_load_auto_scroll = $link.data('on-submenu-load-auto-scroll');
					var onload_fnc = $link.data('onload-fnc');
					var unload_fnc = $link.data('unload-fnc');
					var slide_complete_fnc = $link.data('slide-complete-fnc');
					var menu_unload_valid_fnc = $link.data('menu-unload-valid-fnc');
					var onscroll_fnc = $link.data('onscroll-fnc');

					if (main_menu == undefined || main_menu == "") {
						if (window.console != undefined && context.debug) {
							console.log("Swipe Menu Create : Menu Seq = "+ i +" : main_menu 값이 없습니다. 필수값입니다!");
						}
					} else if (main_url == undefined || main_url == "") {
						if (window.console != undefined && context.debug) {
							console.log("Swipe Menu Create : Menu Seq = "+ i +" : main_url 값이 없습니다. 필수값입니다!");
						}
					} else {
						var sub_menu = {};
						var sub_menu_nm, sub_menu_url, sub_menu_external_mode, sub_menu_before_unload_msg;
						var sub_menu_onload_fnc = [], sub_menu_unload_fnc = [], set_sub_menu_onload_fnc = [], set_sub_menu_unload_fnc = [];

						for (var x = 1; x <= 10; x++ ) {
							sub_menu_nm = $link.data('sub-menu'+ x);
							sub_menu_url = $link.data('sub-url'+ x);
							sub_menu_external_mode = $link.data('sub-menu-external-mode'+ x);
							sub_menu_before_unload_msg = $link.data('sub-menu-before-unload-msg'+ x);
							sub_menu_onload_fnc[sub_menu_nm] = $link.data('sub-menu-onload-fnc'+ x);
							sub_menu_unload_fnc[sub_menu_nm] = $link.data('sub-menu-unload-fnc'+ x);

							if (sub_menu_nm != undefined && sub_menu_nm != null && sub_menu_url != undefined && sub_menu_url != null) {
								sub_menu[sub_menu_nm] = {};

								if (sub_menu_external_mode == undefined) {
									sub_menu_external_mode = false;
								}

								if (sub_menu_before_unload_msg == undefined) {
									sub_menu_before_unload_msg = null;
								}

								set_sub_menu_onload_fnc[x] = null;
								if (sub_menu_onload_fnc[sub_menu_nm] != undefined) {
									set_sub_menu_onload_fnc[x] = function(sub_menu) { 
										try	{
											eval(sub_menu_onload_fnc[sub_menu])();
											return true;
										} catch (e) {
											if (window.console != undefined && context.debug) {									
												console.log("sub_menu_onload_fnc execute error : "+ e);
												return false;
											}
										}						
									}
								}

								set_sub_menu_unload_fnc[x] = null;
								if (sub_menu_unload_fnc[sub_menu_nm] != undefined) {
									set_sub_menu_unload_fnc[x] = function(sub_menu) { 
										try	{
											eval(sub_menu_unload_fnc[sub_menu])();
											return true;
										} catch (e) {
											if (window.console != undefined && context.debug) {									
												console.log("sub_menu_unload_fnc execute error : "+ e);
												return false;
											}
										}						
									}
								}

								sub_menu[sub_menu_nm].menu = sub_menu_nm;
								sub_menu[sub_menu_nm].url = sub_menu_url;
								sub_menu[sub_menu_nm].external_mode = sub_menu_external_mode;
								sub_menu[sub_menu_nm].before_unload_msg = sub_menu_before_unload_msg;
								sub_menu[sub_menu_nm].loaded = false;
								sub_menu[sub_menu_nm].onload_fnc = set_sub_menu_onload_fnc[x];
								sub_menu[sub_menu_nm].unload_fnc = set_sub_menu_unload_fnc[x];
							}						
						}

						if (cache == undefined) {
							cache = true;
						}

						if (preload == undefined) {
							preload = false;
						}

						if (on_menu_change_close_submenu == undefined) {
							on_menu_change_close_submenu = false;
						}

						if (on_submenu_load_auto_scroll == undefined) {
							on_submenu_load_auto_scroll = true;
						}

						var set_onload_fnc = null;
						if (onload_fnc != undefined) {
							set_onload_fnc = function() { 
								try	{
									eval(onload_fnc)();
									return true;
								} catch (e) {
									if (window.console != undefined && context.debug) {									
										console.log("onload_fnc execute error : "+ e);
										return false;
									}
								}						
							}
						}

						var set_unload_fnc = null;
						if (unload_fnc != undefined) {
							set_unload_fnc = function() { 
								try	{
									eval(unload_fnc)();
									return true;
								} catch (e) {
									if (window.console != undefined && context.debug) {
										console.log("unload_fnc execute error : "+ e);
										return false;
									}
								}				
							}
						}

						var set_slide_complete_fnc = null;
						if (slide_complete_fnc != undefined) {
							set_slide_complete_fnc = function() { 
								try	{
									eval(slide_complete_fnc)();
								} catch (e) {
									if (window.console != undefined && context.debug) {
										console.log("slide_complete_fnc execute error : "+ e);
									}
								}
							}
						}
						
						if (auto_scrolling == undefined) {
							auto_scrolling = true;
						}

						var set_menu_unload_valid_fnc = null;
						if (menu_unload_valid_fnc != undefined) {
							set_menu_unload_valid_fnc = function() { 
								try	{
									return eval(menu_unload_valid_fnc)(); 
								} catch (e) {
									if (window.console != undefined && context.debug) {
										console.log("menu_unload_valid_fnc execute error : "+ e);
									}

									return true;
								}						
							}
						}

						var set_onscroll_fnc = null;
						if (onscroll_fnc != undefined) {
							set_onscroll_fnc = function() { 
								try	{
									eval(onscroll_fnc)();
								} catch (e) {
									if (window.console != undefined && context.debug) {
										console.log("onscroll_fnc execute error : "+ e);
									}
								}				
							}
						}

						if (main_menu && main_url) {
							context.menu_list[main_menu] = {
								num: i+1,
								seq: menu_seq,
								main_menu: main_menu,
								url: main_url,
								loaded: false,
								sub_menu: sub_menu,
								cache: cache,
								preload: preload,
								hash: null,
								now_hash: null, // 현재 hash값 저장
								main_menu_hash: null, // main menu hash값 저장
								onload_fnc: set_onload_fnc,
								is_exec_onload_fnc: false,
								unload_fnc: set_unload_fnc,
								is_exec_unload_fnc: true,
								slide_complete_fnc: set_slide_complete_fnc,
								auto_scrolling: auto_scrolling,
								menu_unload_valid_fnc : set_menu_unload_valid_fnc,
								onscroll_fnc: set_onscroll_fnc,
								on_menu_change_close_submenu: on_menu_change_close_submenu,
								on_submenu_load_auto_scroll: on_submenu_load_auto_scroll,
								scrolltop: null // 현재 scroll 위치 기록 (서브메뉴링크를 통해 서브메뉴로 이동할 경우만 기록. back 버튼으로 뒤로가기 시 저장된 스크롤 위치로 이동.)
							};

							context.menu_cnt++;
						}
					}
				}
			});

			// default_menu가 없거나 random default menu를 사용할 경우..
			if (config.default_menu == null || config.default_menu == "") {
				var default_menu_seq = 1;

				if (config.use_random_default_menu == true) {
					var rnd_start = config.random_default_menu_range.start;
					var rnd_end = config.random_default_menu_range.end;

					if (rnd_start == null || rnd_start == undefined) {
						rnd_start = 1;
					}

					if (rnd_end == null || rnd_end == undefined) {
						rnd_end = context.menu_cnt;
					}

					default_menu_seq = Math.floor(Math.random() * rnd_end) + rnd_start;
				}

				var default_menu = context.getMenuTitle(default_menu_seq);
				if (default_menu == null || default_menu == "") {
					default_menu = context.getMenuTitle(1);
				}
				
				config.default_menu = default_menu;
			}

			// top swiper 메뉴에 클릭 이벤트 바인딩
			$('.swiper-wrapper > .swiper-slide > a', config.top_swiper_menu_container_selector).on('click', function(e) {
				if ($(this).data('external-menu') && $(this).data('external-menu') == true) {

				} else {
					e.preventDefault();

					if (context.status.is_page_loading == true) {
						if ($.xhrPool) {

						} else {
							return false;
						}
					}

					var menu = $(this).data('main-menu');
					var menu_seq = context.getMenuSeq(menu);
					if (!menu_seq) {
						return false;
					}

					if (menu) {
						var is_menu_load = true;						

						// 현재 메뉴에서 다른메뉴로 벗어날 경우 메뉴 unload 검증 function을 실행한다
						if (context.now_menu != "" && context.now_menu != menu) {
							if (context.menu_list[context.now_menu].menu_unload_valid_fnc != undefined) {
								if (context.menu_list[context.now_menu].menu_unload_valid_fnc instanceof Function) {
									is_menu_load = context.menu_list[context.now_menu].menu_unload_valid_fnc();

									if (window.console != undefined && context.debug) {
										console.log("top menu click : "+ context.now_menu +" menu_unload_valid_fnc execute!! : is_menu_load = " + is_menu_load);
									}
								}
							}
						}

						if (!context.getSubMenuBeforeUnloadCheck()) {
							return false;
						}

						if (is_menu_load) {
							
							context.menu_list[menu].scrolltop = null; // 저장 된 스크롤 위치를 제거한다

							if (context.isSubMenuLoaded() == true && context.now_menu == menu) {
								context.status.is_submenu_load_after_top_menu_clicked = true;
							}

							if (config.use_hash == true) { // hash를 사용한다면..
								var hash = "";
															
								// 해당 메뉴가 cache를 사용하고, hash값이 저장되 있다면 해당 hash로 변경한다
								if (context.menu_list[menu].cache == true && context.menu_list[menu].hash != null) {
									hash = config.hashbang + context.menu_list[menu].hash;

								} else {
									hash = config.hashbang + config.menu_key +"="+ menu;
								}

								if (window.location.hash.toLowerCase() != hash.toLowerCase()) {
									if (config.use_top_swiper_menu_hash_history == true) {
										if (is_pushstate_supported) {
											window.history.pushState(null, "", hash);
										} else {
											document.location.href = hash;
										}									
									} else {
										if (is_pushstate_supported) {
											window.history.replaceState(null, "", hash);
										} else {
											document.location.replace(hash);
										}
									}

									if (is_pushstate_supported) {
										$(window).trigger("popstate:swiper");
									}
								}							
							} else {
								context.loadMenu(menu, menu_seq);
							}

							context.setTopSwiperMenuActive(menu);
						}
					}
				}
			});

			// 메인컨텐츠 객체 생성
			$.each(context.menu_list, function(i) {
				if (this.main_menu) {
					$('.slider', config.swiper_content_container_selector).append('<div class="item" id="swiper_main_content_'+ this.main_menu +'"></div>');
				}		
			});


			// 서브메뉴링크 이벤트 바인딩
			$('body').on('click', '#swiper_sub_menu_link', function(e) {
				e.preventDefault();
				
				var $o = $(this);
				var sub_menu = $o.data('sub-menu');
				var login_check = $o.data('login-check');
				var login_check_type = $o.data('login-check-type');
				var login_return_url = $o.data('login-return-url');
				var params = $o.data('params');
				var anchor = $o.data('anchor');
				var auth_check_fnc = $o.data('auth-check-fnc'); // 검증 function이 선언되었다면, 메뉴이동 전 실행한다
				var set_auth_check_fnc = null;
				
				if (auth_check_fnc != undefined && auth_check_fnc != null && auth_check_fnc != "") {
					set_auth_check_fnc = function(o, e) { 
						try	{
							var is_check;
							is_check = eval(auth_check_fnc)(o, e);

							if (is_check == null || is_check == undefined) {
								return false;
							} else {
								return is_check;
							}
						} catch (e) {
							if (window.console != undefined && context.debug) {									
								console.log("auth_check_fnc execute error : "+ e);
								return false;
							}
						}						
					}
				}

				var is_menu_load_check = false;

				if (login_check && login_check == 'Y') { // 로그인 체크
					var check_type = login_check_type;
					if (check_type == undefined || check_type == null) {
						check_type = 'confirm';
					}

					var return_url = login_return_url;
					if (return_url == undefined) {
						return_url = null;
					}

					if (check_type == 'confirm') {
						if (loginCheckConfirm(return_url)) {
							return false;
						} else {
							is_menu_load_check = true;
						}
					} else {
						if (loginCheck(return_url)) {
							return false;
						} else {
							is_menu_load_check = true;
						}
					}

				} else {
					is_menu_load_check = true;
				}

				if (is_menu_load_check) {

					// 검증펑션 실행
					var is_menu_load_check_fnc = true;
					if (set_auth_check_fnc instanceof Function) {
						var is_success = set_auth_check_fnc($o, e);

						if (is_success) {
							is_menu_load_check_fnc = true;
						} else {
							is_menu_load_check_fnc = false;
						}

						if (window.console != undefined && context.debug) {
							console.log("서브메뉴링크 : 검증 Function 실행 성공 : 결과값 = "+ is_success);
						}
					}

					// 서브메뉴 불러오기
					if (is_menu_load_check_fnc) {
					
						// 현재 메뉴의 스크롤 위치를 기록한다. (back 버튼으로 돌아올 시 해당 위치로 이동하기 위해)
						if (config.sub_menu_external_mode == false && context.menu_list[context.now_menu].sub_menu[sub_menu].external_mode == false) {
							context.menu_list[context.now_menu].scrolltop = $(window).scrollTop();

							if (anchor != undefined && anchor != null) { // anchor가 지정된 경우 해당 위치로 스크롤 이동한다
								if ($(anchor).length > 0) {
									var scrolltop = $(anchor).offset().top;

									$(window).scrollTop(scrolltop);
								}
							}
						}					
					
						context.goSubMenu(sub_menu, params);
					}
				}
			});

			
			// 처음 로드될 페이지 세팅
			var init_menu, init_sub_menu, init_param, init_slide_seq;

			if (config.use_hash == true) { // hash를 사용한다면..
				init_menu = context.getHashValue(config.menu_key); // 초기 로드될 메뉴
				init_sub_menu = context.getHashValue(config.sub_menu_key); // 초기 로드될 서브메뉴
				init_param = context.getPageHashParam(); // 파라메터
				init_slide_seq = context.getMenuSeq(init_menu); // 초기 메뉴 slide 번호

				if (!init_menu || !init_slide_seq) { // init 시 hash값이 없다면 default menu로 hash값 임의 반영
					init_menu = config.default_menu;
					init_sub_menu = null;
					init_slide_seq = context.getMenuSeq(init_menu);

					if (!init_menu || !init_slide_seq) {
						
					} else {
						if (config.init_auto_hash_make == true) { // 초기 로드 시 hash값이 없는경우 hash 자동반영 사용할 경우
							//

							var hash = config.hashbang + config.menu_key +"="+ init_menu;
							if (init_param) {
								hash += "&"+ init_param;
							}
							
							// 주소창에 hash값이 없을경우 자동으로 반영
							if (is_pushstate_supported) {
								window.history.replaceState(null, null, hash);
							} else {
								context.status.is_hashchange_block = true; // hashchange 이벤트 막음
								document.location.replace(hash);
							}
						}
					}
				}		
			} else {
				init_menu = config.default_menu;
				init_slide_seq = context.getMenuSeq(init_menu);
			}
			
			var init_top_swiper_menu_config = config.top_swiper_menu_config;

			if (init_top_swiper_menu_config["slidesPerView"] == undefined) {
				init_top_swiper_menu_config["slidesPerView"] = 2.8;
			}

			// Top Swiper Menu 초기 slide 값 세팅
			if (config.init_auto_top_menu_swiping == true) {
				if (init_top_swiper_menu_config["initialSlide"] == undefined) {
					init_top_swiper_menu_config["initialSlide"] = context.getTopSwipeMenuFocusSeq(context.getTopMenuNum(init_menu));
				}
			}			

			if (init_top_swiper_menu_config["onInit"] == undefined) {
				init_top_swiper_menu_config["onInit"] = function(sw) {			
					// Top Swiper Menu 로드 전 깜빡임 현상때문에 alpha 0 으로 초기 로드되고, init 완료 후 1로 변경한다!
					$(config.top_swiper_menu_container_selector).css({'filter': 'alpha(opacity=100)', 'opacity': '1'}); 
				}
			}

			// Top Swiper Menu Next/Prev 버튼 사용 처리
			if (config.use_top_swiper_menu_nav == true) {
				if (init_top_swiper_menu_config["onSlideChangeStart"] == undefined) {
					init_top_swiper_menu_config["onSlideChangeStart"] = function(sw) {
						var last_slide = context.getTopSwipeMenuFocusSeq(sw.slides.length);

						if(sw.activeIndex >= parseInt(last_slide - 1) && sw.activeIndex > 0) { // 현재 슬라이드가 slide_idx 보다 크다면 Nav 버튼을 Prev 버튼으로 변경한다
							$(config.top_swiper_menu_nav_btn_selector, config.top_swiper_menu_selector).addClass('open');
						} else { // Next 버튼으로 변경
							$(config.top_swiper_menu_nav_btn_selector, config.top_swiper_menu_selector).removeClass('open');
						}
					}
				}
				
				// Next/Prev 버튼 onclick 이벤트 바인딩
				$(config.top_swiper_menu_nav_btn_selector, config.top_swiper_menu_selector).on('click', function() {
					if ($(this).hasClass('open')) {
						context.top_swiper_menu.slideTo(0, 300, false);
						$(this).removeClass('open');
					} else {
						context.top_swiper_menu.slideTo(context.top_swiper_menu.slides.length - 1, 300, false);
						$(this).addClass('open');
					}
				});
			}

			// Top Swiper Menu 객체 생성
			context.top_swiper_menu = new Swiper(config.top_swiper_menu_container_selector, init_top_swiper_menu_config);


			// Main Content Slider 객체 초기화
			context.main_slider = $('.iosSlider', config.swiper_content_container_selector);

			context.main_slider.iosSlider({
				startAtSlide: init_slide_seq,
				snapVelocityThreshold: 100,
				frictionCoefficient: 0,
				slideStartVelocityThreshold: 10,
				desktopClickDrag: true,
				snapToChildren: true,	
				infiniteSlider: true,
				onSlideChange: function(args) {
					var current_seq = args.currentSlideNumber;
					var target_seq = args.targetSlideNumber;

					if (window.console != undefined && context.debug) {
						console.log("iosSlider: onSlideChange: target_seq = "+ target_seq +", current_seq = "+ current_seq +", now_seq = "+ context.getMenuSeq(context.now_menu));
					}

					if (current_seq == target_seq) {

						var menu = context.getMenuTitle(current_seq);						
						var $content = $('#swiper_main_content_'+ menu, '.slider');
				
						if (!context.menu_list[menu].cache || !context.menu_list[menu].loaded) {
							context.showLoader();
						}

						if (menu) {
							context.status.is_page_change = true;

							if (config.use_hash == true) {
								if (context.getHashValue(config.menu_key) != menu) { // touch event로 슬라이드가 변경된 경우 hash 값도 반영한다. 
									context.status.is_slide_from_touch = true; // touch event로 슬라이드가 변경되었음을 알림

									context.setTopSwiperMenuActive(menu);

									var hash = "";									

									// 해당 메뉴가 cache를 사용하고, hash값이 저장되 있다면 해당 hash로 변경한다
									if (context.menu_list[menu].cache == true && context.menu_list[menu].hash != null) {
										hash = config.hashbang + context.menu_list[menu].hash;

									} else {
										hash = config.hashbang + config.menu_key +"="+ menu;
									}

									if (config.use_top_swiper_menu_hash_history == true) {
										if (is_pushstate_supported) {
											window.history.pushState(null, null, hash);
										} else {
											document.location.href = hash;
										}
									} else {
										if (is_pushstate_supported) {
											window.history.replaceState(null, null, hash);
										} else {
											document.location.replace(hash);
										}
									}
									
									if (is_pushstate_supported) {
										$(window).trigger("popstate:swiper");
									}									
								}

								var sub_menu = context.getHashValue(config.sub_menu_key);
								var param = context.getPageHashParam();
							} else {

							}							

							context.loadMenuContent(menu, sub_menu, param);
						}
					}

					context.status.iosslide_status = "change";
				},
				onSlideComplete: function(args) {					
					var current_seq = args.currentSlideNumber;

					var menu = context.getMenuTitle(current_seq);

					if (menu) {
						var time = 400 - config.iosslider_animate_duration;
						if (time < 1) {
							time = 1;
						}
						
						setTimeout(function() {
							context.loadSlideCompleteFunction(context.menu_list[menu]);
						}, time);
					}

					context.status.is_slide_from_touch = false;

					context.status.iosslide_status = "complete";
				},
				onSliderLoaded: function() {
					if (init_slide_seq) {
						context.showLoader();

						if (init_sub_menu != "") { // sub menu 존재여부 검증
							if (context.menu_list[init_menu].sub_menu[init_sub_menu] != undefined && context.menu_list[init_menu].sub_menu[init_sub_menu].url != "") {
							} else {
								init_sub_menu = null;
							}
						}
						
						context.loadMenuContent(init_menu, init_sub_menu, init_param);
						context.now_menu = init_menu;

						context.setTopSwiperMenuActive();

						context.status.iosslide_status = "loaded";

						if (!is_pushstate_supported) {
							context.status.is_hashchange_block = false;
						}
					}
				}
			});

			// Main content Preload
			$.each(context.menu_list, function() {
				if (this.preload == true && this.main_menu != init_menu) {
					context.loadMenuContent(this.main_menu, null, null, true);
				}
			});

			// onpopstate:swiper 이벤트 바인딩
			if (config.use_hash == true) {
				$(window).on('popstate:swiper', function(e) {
					var menu = context.getHashValue(config.menu_key);
					var sub_menu = context.getHashValue(config.sub_menu_key);
					var menu_seq = context.getMenuSeq(menu);					

					if (window.console != undefined && context.debug) {
						console.log("window.on.popstate:swiper : "+ config.menu_key +" = "+ menu +", "+ config.sub_menu_key +" = "+ sub_menu +", menu_seq = "+ menu_seq);
					}

					if (menu && menu_seq) {
						context.loadMenu(menu, menu_seq, sub_menu);
					}
				});

				if (is_pushstate_supported) {
					$(window).on('popstate', function(e) {
						if (!context.getSubMenuBeforeUnloadCheck()) {
							return false;
						}

						var full_popup = etoosUtil.getPageParamValue('full-popup').toLowerCase(); // 전체화면 팝업 실행여부, 실행 시 "open"값 반환
						var alert_popup = etoosUtil.getPageParamValue('alert-popup').toLowerCase(); // 알럿형 팝업 실행여부, 실행 시 "open"값 반환
						var header_menu = etoosUtil.getPageParamValue('header-menu').toLowerCase(); // 헤더메뉴 실행여부, 실행 시 "open"값 반환

						// 팝업 혹은 헤더메뉴의 on/off 시 발생하는 popstate 이벤트인 경우.. 무시하도록 처리
						try	{
							if ((typeof is_full_popup_open != "undefined" && is_full_popup_open) || (typeof is_header_menu_open != "undefined" && is_header_menu_open) || (typeof is_alert_popup_open != "undefined" && is_alert_popup_open) || (typeof full_popup != "undefined" && full_popup == 'open') || (typeof alert_popup != "undefined" && alert_popup == 'open') || (header_menu != undefined && header_menu == 'open')) {
								return false;
							}
						} catch (e) {}
						

						$(window).trigger("popstate:swiper");

						if (window.console != undefined && context.debug) {
							console.log(e);
						}
					});
				} else {
					$(window).on('hashchange', function(e) {
						if (!context.getSubMenuBeforeUnloadCheck()) {
							return false;
						}

						var is_sub_menu_before_unload_check = context.getSubMenuBeforeUnloadCheck();
						if (!is_sub_menu_before_unload_check) {
							return false;
						}
						
						$(window).trigger('popstate:swiper');
					});
				}
			}
			
			$(window).on('scroll', function(e) {
				 
				// top swiper menu 상단 고정 
				var top_menu_offset = $(config.top_swiper_menu_selector).offset().top;
				var top = top_menu_offset + $(config.top_swiper_menu_selector).height() + 130;

				if (config.use_top_swiper_menu_fixed == true) {
					if (typeof is_header_menu_open != "undefined" && !is_header_menu_open) {
						if ($(window).scrollTop() > top_menu_offset) {
							if ($(config.top_swiper_menu_selector).hasClass('toptab')) {
								$(config.top_swiper_menu_selector).addClass('on');
							} else {
								$(config.top_swiper_menu_selector).children('div').css({'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%'});
							}					

							top = $(config.top_swiper_menu_selector).height() + 130;
						} else {
							if ($(config.top_swiper_menu_selector).hasClass('toptab')) {
								$(config.top_swiper_menu_selector).removeClass('on');
							} else {
								$(config.top_swiper_menu_selector).children('div').css({'position': 'relative', 'top': '', 'left': ''});
							}					

							top = (top_menu_offset + $(config.top_swiper_menu_selector).height() + 130) - $(window).scrollTop();
						}
					}				
				}

				$('svg', '#swiper_menu_loader').css('top', top);

				$(window).trigger('scroll:swiper');

			}).trigger('scroll');

			if ("onorientationchange" in window) {
				$(window).on('orientationchange', function() {
					setTimeout(function() {
						setOrientationChange();
					}, 100);

					if (window.console != undefined && context.debug) {
						console.log("onorientationchange : complete!!");
					}
				});
			} else {
				orientation = etoosUtil.getOrientation();

				$(window).on('resize', function(e) {
					if (etoosSwiper.getOSName() != "unknown") {
						$(window).trigger('resize:swiper');
					}					
				});
										
				$(window).on('resize:swiper', function(e) {
					var ori = etoosUtil.getOrientation();
					if (ori != orientation) {
						setTimeout(function() {
							setOrientationChange();
						}, 100);
					}

					if (window.console != undefined && context.debug) {
						console.log("resize:swiper : complete!!");
					}
				});
			}

			$(window).on('scroll:swiper', function(e) {
				window_scroll_top = $(window).scrollTop(); // 현재 스크롤 위치 기록

				context.onScroll(e);
			});

			$('body').on('touchmove', function() {
				if (context.status.is_auto_scroll_executing == true) {
					$('html, body').stop();
				}
			});


			/* DOM 변경 시 메인컨텐츠 높이갚 조정 */
			/*$(document).on('DOMSubtreeModified', function() {
				setTimeout(function() {
					context.resizeContentHeight();
				}, 50);	
			});*/
		}
	}

	/*
		EtoosSwiper 객체 제거
	*/
	context.destroy = function() {
		if (context.status.is_init) {
			if (config.use_hash == true) {
				if (is_pushstate_supported) {
					$(window).off('popstate');
				} else {
					$(window).off('hashchange');
				}

				$(window).off('popstate:swiper');
			}

			context.menu_list = {};
			
			context.top_swiper_menu.destroy(true, true);
			context.top_swiper_menu = null;

			$('.swiper-container > .swiper-wrapper > .swiper-slide > a').off('click');

			context.main_slider.html("");
			context.main_slider.iosSlider('destroy');
			context.main_slider = null;

			config = default_config;

			$(document).off('DOMSubtreeModified');

			$('body').off('click', '#swiper_sub_menu_link');
			$('body').off('touchmove');

			$(window).off('scroll:swiper');
			$(window).off('resize:swiper');
			$(window).off('orientationchange');

			context.status.is_init = false;

			if (window.console != undefined && context.debug) {
				console.log("destroy : complete!!");
			}

			return null;
		}
	}

	/*
		onScroll 이벤트 발생시 실행할 function 모음
	*/
	context.onScroll = function(e) {
		/* 
			menu에 정의된 onscroll function 실행
		*/
		if ((context.status.iosslide_status == "complete" || context.status.iosslide_status == "loaded") && !context.status.is_page_loading) {
			if (context.now_menu != "") {
				if (context.menu_list[context.now_menu].loaded == true) { // menu가 load 되었다면..
					setTimeout(function() {
						// onscroll function 실행
						if (!context.status.is_onscroll_fnc_executing && !context.status.is_auto_scroll_executing) {
							if (context.menu_list[context.now_menu].onscroll_fnc != undefined) {
								if (context.menu_list[context.now_menu].onscroll_fnc instanceof Function) {
									context.status.is_onscroll_fnc_executing = true;

									context.menu_list[context.now_menu].onscroll_fnc();

									setTimeout(function() {									
										context.status.is_onscroll_fnc_executing = false;
									}, 500); // 500ms마다 실행되도록..

									if (window.console != undefined && context.debug) {
										console.log("onscroll function : '"+ context.now_menu +"' execute success!!");
									}
								}	
							}
						}
					}, 50);
				}
			}
		}
	}

	/*
		Top Swipe Menu의 focus 위치 계산
	*/
	context.getTopSwipeMenuFocusSeq = function(seq) {
		var slides_per_view;

		if (config.top_swiper_menu_config.slidesPerView - Math.floor(config.top_swiper_menu_config.slidesPerView) < 0.7) {
			slides_per_view = Math.floor(config.top_swiper_menu_config.slidesPerView) - 1;
		} else {
			slides_per_view = Math.floor(config.top_swiper_menu_config.slidesPerView);
		}

		if (!slides_per_view) {
			slides_per_view = 2;
		}

		var focus_seq = seq - slides_per_view;
		if (focus_seq < 0) {
			focus_seq = 0;
		} else if ((focus_seq + slides_per_view) == context.menu_cnt) {
			//focus_seq = focus_seq - 1;
		}

		return focus_seq;
	}

	/*
		loading 애니메이션 노출
	*/
	context.showLoader = function() {
		if ($(config.top_swiper_menu_container_selector).length == 0) {
			return;
		}

		context.status.is_page_loading = true;
		etoos.showLoading();
		return;
		/*
		
		var top_menu_offset = $(config.top_swiper_menu_container_selector).offset().top;
		var top = top_menu_offset + $(config.top_swiper_menu_container_selector).height() + 130;

		if ($(window).scrollTop() > top_menu_offset) {
			top = $(config.top_swiper_menu_container_selector).height() + 130;
		} else {
			top = (top_menu_offset + $(config.top_swiper_menu_container_selector).height() + 130) - $(window).scrollTop();			
		}

		$('svg', '#swiper_menu_loader').css('top', top);

		$('#swiper_menu_loader').show();

		context.status.is_page_loading = true;
		*/
	};

	/*
		loading 애니메이션 숨기기
	*/
	context.hideLoader = function() {
		context.status.is_page_loading = false;
		etoos.hideLoading();
		/*
		$('#swiper_menu_loader').hide();

		context.status.is_page_loading = false;
		*/
	}

	/*
		Content Height 업데이트
	*/
	context.resizeContentHeight = function() {
		var hw = $("div.slider > .on", config.swiper_content_container_selector).find(config.swiper_content_selector).height();
		var $o = $('div.iosSlider', config.swiper_content_container_selector);
		
		//$o.parent().css({'background': '#fff'});
		$o.css({'height': hw +'px'});
	}
	

	/*
		메뉴명으로 슬라이드번호 가져오기
	*/
	context.getMenuSeq = function(menu) {
		var seq;
		$.each(context.menu_list, function() {
			if (this.main_menu == menu) {
				seq = this.seq;
				return false;
			}
		});

		return seq;
	}

	/*
		메뉴명으로 탑메뉴 순번 가져오기
	*/
	context.getTopMenuNum = function(menu) {
		var num;
		$.each(context.menu_list, function() {
			if (this.main_menu == menu) {
				num = this.num;
				return false;
			}
		});

		return num;
	}

	/*
		슬라이드번호로 메뉴명 가져오기
	*/
	context.getMenuTitle = function(seq) {
		var menu;
		$.each(context.menu_list, function() {
			if (this.seq == seq) {
				menu = this.main_menu;
				return false;
			}
		});

		return menu;
	}

	/*
		hash값에서 페이지로 추가 전송할 parameter 가져오기
			=> except : 제외할 파라메터 key 값 ex) ['menu', 'anchor', 'reload']
			=> hash에서 지정한 key 값은 제거 후 리턴된다
				ex) #!/menu=main&anchor=aaa&reload=Y&aaa=111&bbb=222   => aaa=111&bbb=222 리턴 됨
	*/
	context.getPageHashParam = function(except, hash) {
		var param = "";
		if (!hash) {
			hash = window.location.hash;
		}

		// 제외할 key 값이 지정되지 않았다면 default 값으로 적용
		if (except == "" || except == undefined) {
			except = [config.menu_key, config.sub_menu_key, "anchor", "anchor_rev_px", "anchor_scroll_top", "reload", "nocache"];
		}

		if (hash != "") {
			var re = new RegExp(config.hashbang, "gi");
			hash = hash.replace(re, "");

			var tmp = hash.split('&');
			$.each(tmp, function() {
				var val = this;
				if (val.indexOf("=") > -1) {
					var is_except_same = false;
					$.each(except, function() {
						if (val.split("=")[0].toLowerCase() == this.toLowerCase()) {
							is_except_same = true;
							return false;
						}
					});

					if (!is_except_same) {
						param += "&"+ val;
					}
				}
			});

			param = param.replace("&", "");
		}

		return param;
	}

	/*
		hash값에서 특정 key 값 가져오기
	*/
	context.getHashValue = function(key, hash) {
		var rst = "";
		if (!hash) {
			hash = window.location.hash;
		}

		if (hash != "") {
			var re = new RegExp(config.hashbang, "gi");
			hash = hash.replace(re, "");

			var tmp = hash.split('&');
			$.each(tmp, function() {
				var val = this;
				if (val.indexOf("=") > -1) {
					if (val.split("=")[0].toLowerCase() == key.toLowerCase()) {
						rst = val.split("=")[1];
						return false;
					}
				}
			});
		}

		return rst;
	}


	/*
		Top Swiper 메뉴 활성화
	*/
	context.setTopSwiperMenuActive = function(menu) {
		if (!menu) {
			menu = context.now_menu;
		}
		var top_menu_num = context.getTopMenuNum(menu);
		var top_swiper_target_seq = context.getTopSwipeMenuFocusSeq(top_menu_num);

		$('.swiper-wrapper > .swiper-slide', config.top_swiper_menu_container_selector).eq(top_menu_num - 1).find('a').addClass("on").parent().siblings().find('a').removeClass('on');

		context.top_swiper_menu.slideTo(top_swiper_target_seq, 400, true);
	}


	/*
		Sub Menu load 여부 리턴
	*/
	context.isSubMenuLoaded = function() {
		var loaded = false;
		
		$.each(context.menu_list[context.now_menu].sub_menu, function() {
			if (this.loaded == true) {
				loaded = true;
				return false;
			}
		});

		return loaded;
	}


	/*
		현재 로드된 서브메뉴명 리턴
	*/
	context.getLoadedSubMenu = function() {
		var menu_nm = null;

		$.each(context.menu_list[context.now_menu].sub_menu, function() {
			if (this.loaded == true) {
				menu_nm = this.menu;
				return false;
			}
		});

		return menu_nm;
	}


	/*
		서브메뉴 before unload 체크
	*/
	context.getSubMenuBeforeUnloadCheck = function() {
		var result = true;

		if (context.isSubMenuLoaded() == true) {
			var before_unload_msg = context.menu_list[context.now_menu].sub_menu[context.getLoadedSubMenu()].before_unload_msg;

			if (before_unload_msg) {
				var start = new Date();
				var confirm_result = confirm(before_unload_msg.replace(/<br>/gi, '\n'));
				var end = new Date();

				result = (((end - start) < 350) || confirm_result == true);

				if (!result) {
					if (is_pushstate_supported) {
						window.history.pushState(null, "", config.hashbang + context.menu_list[context.now_menu].now_hash);
					} else {
						context.status.is_hashchange_block = true;							
						document.location.href = config.hashbang + context.menu_list[context.now_menu].now_hash;
					}
				}
			}
		}		

		return result;
	}


	/*
		Url Replace : URL 변경
	*/
	context.urlReplaceState = function(params) {
		var menu = context.menu_list[context.now_menu];

		var url = config.hashbang + config.menu_key +"="+ menu.main_menu;

		if (params != "" && params != null) {
			url += "&"+ params;
		}		

		if (is_pushstate_supported) {			
			window.history.replaceState(null, "", url);
		}

		if (config.use_hash == true) {
			if (context.isSubMenuLoaded() == false) {
				menu.main_menu_hash = context.getPageHashParam(["anchor", "anchor_rev_px", "anchor_scroll_top", "nocache"]);
			}
		}
	}


	/*
		Main Menu Reload
	*/
	context.mainMenuReload = function(params, is_replace) {
		if (context.status.is_page_loading == true) {
			return false;
		}

		if (is_replace == undefined) {
			is_replace = false;
		}

		var menu = context.menu_list[context.now_menu];

		var url = config.hashbang + config.menu_key +"="+ menu.main_menu;

		if (params != "" && params != null) {
			url += "&"+ params;
		}

		context.status.is_main_menu_reload = true; // 메인메뉴 reload 여부 변경

		if (config.use_menu_reload_hash_history == true && is_replace == false) {
			if (is_pushstate_supported) {
				window.history.pushState(null, "", url);
			} else {
				document.location.href = url;
			}
		} else {
			if (is_pushstate_supported) {
				window.history.replaceState(null, "", url);
			} else {
				document.location.replace(url);
			}
		}
		
		if (is_pushstate_supported) {
			$(window).trigger("popstate:swiper");
		}
	}

	/*
		Go to Sub Menu Page
	*/
	context.goSubMenu = function(sub_menu, params, is_external, is_replace) {
		if (context.status.is_page_loading == true) {
			return false;
		}
		
		if (is_external == undefined) {
			is_external = false;
		}

		if (is_replace == undefined) {
			is_replace = false;
		}

		var menu = context.menu_list[context.now_menu];
		var sub_menu = menu.sub_menu[sub_menu];

		if (sub_menu == undefined || sub_menu == null) {
			if (window.console != undefined && context.debug) {
				console.log("goSubMenu : 존재하지 않은 서브메뉴입니다.");
			}

			return false;
		}

		if (sub_menu.url != undefined && sub_menu.url != null && sub_menu.url != "") {
			var sub_url = "";
			var list_hash_params = encodeURIComponent(menu.main_menu_hash);

			if (config.sub_menu_external_mode == false && sub_menu.external_mode == false && is_external == false) {
				sub_url = config.hashbang + config.menu_key +"="+ menu.main_menu +"&"+ config.sub_menu_key +"="+ sub_menu.menu +"&list_hash_params="+ list_hash_params;
			} else {
				sub_url = sub_menu.url;
				
				if (sub_url.indexOf('?') > -1) {
					sub_url += "&list_hash_params="+ list_hash_params;
				} else {
					sub_url += "?list_hash_params="+ list_hash_params;
				}
			}
				
			if (!context.isSubMenuLoaded()) { // 서브메뉴가 로드된 상태가 아니라면 현재 스크롤 위치를 넘겨준다
				sub_url += "&_swipe_scroll_top="+ (menu.scrolltop ? menu.scrolltop : $(window).scrollTop());
			}

			if (params != "" && params != null) {
				if (sub_url.indexOf('?') > -1 || sub_url.indexOf(config.hashbang) > -1) {
					sub_url += "&"+ params;
				} else {
					sub_url += "?"+ params;
				}
			}

			if (config.sub_menu_external_mode == false && sub_menu.external_mode == false && is_external == false) {
				if (is_pushstate_supported) {
					if (is_replace == true) {
						window.history.replaceState(null, "", sub_url);
					} else {
						window.history.pushState(null, "", sub_url);
					}
					
					$(window).trigger("popstate:swiper");
				} else {
					if (is_replace == true) {
						document.location.replace(sub_url);
					} else {
						document.location.href = sub_url;
					}
				}
			} else {
				if (!context.isSubMenuLoaded()) {
					if (is_pushstate_supported) {
						window.history.replaceState({scrolltop: (menu.scrolltop ? menu.scrolltop : $(window).scrollTop())}, '');
					}
				}

				if (is_replace == true) {
					document.location.replace(sub_url);
				} else {
					document.location.href = sub_url;
				}
			}
		}
	}

	/*
		Go to Main Menu Page
	*/
	context.goMainMenu = function(params, main_menu_hash, is_replace) {
		var menu = context.menu_list[context.now_menu];
		var main_url = "";

		if (is_replace == undefined) {
			is_replace = false;
		}

		if (menu.main_menu_hash != "" && menu.main_menu_hash != null) {
			main_url = config.hashbang + menu.main_menu_hash;
		} else if (main_menu_hash != "" && main_menu_hash != null) {
			main_url = config.hashbang + main_menu_hash;
		} else {
			main_url = config.hashbang + config.menu_key +"="+ menu.main_menu;
		}
		
		if (params != "" && params != null) {
			main_url += "&"+ params;
		}

		// 서브메뉴가 로드된 상태라면.. html을 날려준다.
		if (context.isSubMenuLoaded()) {
			context.status.is_main_menu_load = true;
			//$('#swiper_main_content_'+ context.now_menu, config.swiper_content_container_selector).html("");
		}

		if (is_pushstate_supported) {
			if (is_replace == true) {
				window.history.replaceState(null, "", main_url);
			} else {
				window.history.pushState(null, "", main_url);
			}
	
			$(window).trigger("popstate:swiper");
		} else {
			if (is_replace == true) {
				document.location.replace(main_url);
			} else {
				document.location.href = main_url;
			}
		}
	}



	/*
		Swipe Menu 로드
	*/
	context.loadMenu = function(menu, menu_seq, sub_menu) {
		if (context.status.is_slide_from_touch) {

		} else {
			if (context.now_menu == menu) { // 불러올 메뉴페이지가 현재 페이지와 동일하다면..
				context.status.is_page_change = false;				

				var param, reload, anchor, nocache;

				if (config.use_hash == true) {
					param = context.getPageHashParam();
					reload = context.getHashValue('reload').toUpperCase();
					anchor = context.getHashValue('anchor');
					nocache = context.getHashValue('nocache').toUpperCase();
				}				
				
				if (reload == 'Y') { // 강제 새로고침인 경우..
					var reload_url = "";
					var url = document.location.href.substring(0, document.location.href.indexOf(config.hashbang)); // hash값을 제외한 url값 가져오기
					var time = new Date().getTime();

					if (url.indexOf('?') > -1) { // url에 현재 time값을 붙여준다.. 강제 새로고침을 위해..
						url += "&reload="+ time;
					} else {
						url += "?reload="+ time;
					}

					var reload_url = url + config.hashbang + config.menu_key +"="+ menu;
					
					if (anchor != "") {
						reload_url += "&anchor="+ anchor;
					}

					if (param != "") {
						reload_url += "&"+ param;
					}
				
					if (window.console != undefined && context.debug) {
						console.log("loadMenu: reload !! reload_url = "+ reload_url);
					}

					document.location.replace(reload_url);
					
				} else { // 페이지 내용만 다시 불러온다
					var page_hash = context.getPageHashParam(["anchor", "anchor_rev_px", "anchor_scroll_top", "nocache"]);
					var main_menu_hash = context.menu_list[menu].main_menu_hash;

					if (page_hash) {
						page_hash = page_hash.toLowerCase();
					}

					if (main_menu_hash) {
						main_menu_hash = main_menu_hash.toLowerCase();
					}

					// nocache가 선언되었거나, hash가 변경되었다면 무조건 새로불러옴
					if (nocache == 'Y' || (page_hash != main_menu_hash && (sub_menu == null || sub_menu == ""))) {
						context.menu_list[menu].loaded = false;										
					}

					context.loadMenuContent(menu, sub_menu, param);
				}
			} else { // 해당메뉴의 슬라이드 번호로 슬라이드변경 한다
				context.main_slider.iosSlider('goToSlide', menu_seq, config.iosslider_animate_duration);

				if (window.console != undefined && context.debug) {
					console.log("loadMenu: isoSlider Change!!! goToSlide : menu_seq ="+ menu_seq);
				}
			}
		}
		
		if (context.status.is_slide_from_touch || context.now_menu != menu) {
			if (window.console != undefined && context.debug) {
				console.log("loadMenu: now_menu changed!! now menu ="+ context.now_menu +", change menu = "+ menu);
			}

			context.prev_menu = context.now_menu;
			context.now_menu = menu;
		}
	}

	/*
		Swipe Menu Ajax 페이지 로드
			menu : main menu title
			sub_menu : sub menu title
			param : 추가 전송할 파라메터
			is_preload : preload 여부
	*/
	context.loadMenuContent = function(menu, sub_menu, params, is_preload) {
		var is_sub_menu_load = false;

		// 메뉴객체 가져오기
		var menu = context.menu_list[menu];
		if (!menu) {
			return;
		}

		// quick navi 비활성화
		if (typeof isQuickMenuDisable != "undefined") {
			isQuickMenuDisable = true;
			$('.quicknavi').addClass("off");
		}		

		if (sub_menu != null && sub_menu != "") {
			var sub_menu = menu.sub_menu[sub_menu];

			if (sub_menu == undefined) {
				return;
			}
		}

		// 메뉴 컨텐츠객체
		var $content = $('#swiper_main_content_'+ menu.main_menu, config.swiper_content_container_selector);
			
		if (!is_preload && context.status.is_init) {
			$('.slider > div', config.swiper_content_container_selector).removeClass("on");

			if (context.status.is_page_loading == true) {
				if ($.xhrPool) { // 로딩 중 다른 요청이 들어왔다면.. 기존 요청은 중단시킨다
					$.xhrPool.abortAll();
					context.hideLoader();
				}
			}
		}		

		if (!menu.loaded || !menu.cache || (sub_menu.menu && sub_menu.url)) { // 로드되지 않았거나 cache를 사용하지 않을경우 페이지 불러옴
			var time = new Date().getTime();
			var url = menu.url;

			if (sub_menu && sub_menu.menu && sub_menu.url) { // sub_menu값이 있다면 sub menu를 로드한다 (sub menu는 cache 여부 관계없이 무조건 로드함)
				is_sub_menu_load = true;
				
				url = sub_menu.url;

				if (window.console != undefined && context.debug) {
					console.log("loadMenuContent : sub menu detect!!! sub_menu = "+ sub_menu.menu +", url = "+ url);
				}
			}

			if (url.indexOf('_swipe') == -1) {
				if (url.indexOf('?') > -1) {
					url += "&_swipe=Y";
				} else {
					url += "?_swipe=Y";
				}
			}

			if (url.indexOf('?') > -1) {
				url += "&t="+ time;
			} else {
				url += "?t="+ time;
			}

			$.ajax({
				url: url,
				data: params,
				type: "post",
				cache: false,
				contentType: 'application/x-www-form-urlencoded;charset=euc-kr',
				beforeSend: function(xhr) {
					xhr.overrideMimeType('application/x-www-form-urlencoded;charset=euc-kr');

					context.showLoader();
				},				
				success: function(data) {
					// json 형태의 에러메세지가 리턴되었다면.. alert 처리 후 history.back 한다
					var json = null;
					try	{
						json = JSON.parse(data);
					} catch (e) {
					}

					if (json != null) {
						var err_cd = json.err_cd;
						var err_msg = json.err_msg;

						if (err_cd != '0000') {
							if (err_msg != "") {
								alert(err_msg.replace(/<br>/gi, '\n'));
							}
							
							window.history.back(-1);
							return false;
						}
					}

					// 정상 데이터 수신
					var $data = $(data).wrapAll('<p>');

					var content = $(config.swiper_content_container_selector, $data).html();

					$content.html("");
					$content.html(content);

					if (is_sub_menu_load == false) { // 메인 메뉴가 로드되었다면..
						menu.loaded = true;

						// 서브메뉴 전체 loaded 상태를 false로 전환
						$.each(menu.sub_menu, function() {
							this.loaded = false;
						});
					} else { // 서브메뉴가 로드되었다면..
						menu.loaded = false; // main menu의 loaded 여부를 false로 전환 (sub메뉴에서 메인메뉴로 복귀 시 무조건 로드되도록..)

						sub_menu.loaded = true; // 로드된 서브메뉴의 loaded 상태를 true로 전환

						// 로드 된 서브메뉴 이외의 메뉴는 loaded 상태를 false로 전환
						$.each(menu.sub_menu, function() {
							if (this.menu != sub_menu.menu) {
								this.loaded = false;
							}							
						});
					}

					if (!context.status.is_init && !is_preload) { // 처음 로드면서 preload가 아닌경우
						// slide oncomplete callback 함수 실행
						context.loadSlideCompleteFunction(menu);

						context.status.is_init = true;
					}					

					if (!is_preload) { // preload가 아닌 경우						
						$content.addClass('on');
						
						context.loadMenuContentComplete(menu);
						
						// content on/un load callback 함수 실행
						setTimeout(function() {
							context.loadOnloadUnloadFunction(menu);
						}, 90);
					}

					if (window.console != undefined && context.debug) {
						console.log("loadMenuContent : ajax loaded! menu = "+ menu.main_menu + ", url = "+ url +", params = "+ params);
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					if (window.console != undefined && context.debug) {
						console.log((errorThrown) ? errorThrown : xhr.status);
					}

					context.hideLoader();
					
					if (xhr.status) {
						if (config.content_load_fail_msg) {
							alert(config.content_load_fail_msg.replace(/<br>/gi, '\n'));
						}
					}					
				},
				complete: function(xhr) {
					if (xhr.statusText == 'abort') { // 중단되었다면..
						
					} else {
						setTimeout(function() {
							context.hideLoader();
						}, 111);
					}
				}
			});
		} else {
			if (config.use_content_load_fadein_animate && !is_preload && !context.status.is_main_menu_reload && !context.status.is_slide_from_touch) {
				$content.css('opacity', 0);
				$content.animate({'opacity': '1'}, 470);
			}

			if (!is_preload) { // preload가 아닌 경우
				$content.addClass('on');

				context.loadMenuContentComplete(menu);				

				// content on/un load callback 함수 실행
				setTimeout(function() {
					context.loadOnloadUnloadFunction(menu);
				}, 90);	
			}			

			if (window.console != undefined && context.debug) {
				console.log("loadMenuContent : cache loaded! menu = "+ menu.main_menu);
			}
		}
		
		if (!is_preload) { // preload가 아닌 경우
			if (config.use_hash == true) {
				if ((config.on_menu_change_close_submenu == false && context.menu_list[menu.main_menu].on_menu_change_close_submenu == false) || context.getHashValue(config.sub_menu_key) == "") {
					menu.hash = context.getPageHashParam(["anchor", "anchor_rev_px", "anchor_scroll_top", "nocache"]);
				}

				if (context.getHashValue(config.sub_menu_key) == "") {
					menu.main_menu_hash = context.getPageHashParam(["anchor", "anchor_rev_px", "anchor_scroll_top", "nocache"]);
				}

				menu.now_hash = context.getPageHashParam(["anchor", "anchor_rev_px", "anchor_scroll_top", "nocache"]);
			}
		}
	}

	/*
		iosSlide onComplete callback 함수 실행
			=> 슬라이드 애니메이션이 완료될 때 실행 됨
			=> 사용예) 특정 조건 시 알럿메세지 출력 후 특정 페이지로 이동하고자 할 경우 등
	*/
	context.loadSlideCompleteFunction = function(menu) {
		var ti = null;

		// slide oncomplete function 실행
		if (menu.slide_complete_fnc != undefined) {
			if (menu.slide_complete_fnc instanceof Function) {

				ti = setInterval(function() {					
					if (!context.status.is_page_loading) { // 페이지 로딩이 완료된 후 실행되도록..
						menu.slide_complete_fnc();

						if (window.console != undefined && context.debug) {
							console.log("loadSlideCompleteFunction : "+ menu.main_menu +" slide_complete_fnc success!!");
						}

						clearInterval(ti);
					}					
				}, 200);
			}
		}
		
		setTimeout(function() {
			$('div.iosSlider', config.swiper_content_container_selector).hide().show(0); // force reDraw!!
		}, 500);

		if (window.console != undefined && context.debug) {
			console.log("loadSlideCompleteFunction : success!!");
		}
	}

	/*
		content 로드 후 실행될 callback 함수
			=> 일반적으로 document.ready 시 실행할 로직들을 onload function에 담는다
			=> onload function에 event listner 로직이 포함되어 있다면 반드시 unload function도 정의하여 event binding 해제로직을 실행해야 한다 (해제하지 않을 경우 중첩문제 발생)
				ex)
					function fnMenu1Onload() {
						$('body').on('click', '.aaaa', function() {

						});
					}

					function fnMenu1Unload() {
						$('body').off('click', '.aaaa');
					}
	*/
	context.loadOnloadUnloadFunction = function(menu) {
		var is_success = false;		

		// contnet가 변경 된 경우 unload function 실행
		if ((context.now_menu != context.prev_menu && context.prev_menu != "") || context.status.is_main_menu_reload == true || context.isSubMenuLoaded() == true) {
			var omenu = context.menu_list[context.prev_menu];

			if (context.isSubMenuLoaded() == true || context.status.is_main_menu_reload == true) { // 메인메뉴 reload 혹은 서브메뉴가 로드 된 경우..
				omenu = context.menu_list[context.now_menu];
			}

			if (omenu.unload_fnc != undefined) {
				if (omenu.unload_fnc instanceof Function && !omenu.is_exec_unload_fnc) {
					is_success = omenu.unload_fnc();

					if (is_success) {
						omenu.is_exec_onload_fnc = false;
						omenu.is_exec_unload_fnc = true;
				
						if (window.console != undefined && context.debug) {
							console.log("loadOnloadUnloadFunction : "+ omenu.main_menu +" unload_fnc success!!");
						}
					}
				} else {
					omenu.is_exec_onload_fnc = false;
					omenu.is_exec_unload_fnc = true;
				}
			} else {
				omenu.is_exec_onload_fnc = false;
				omenu.is_exec_unload_fnc = true;
			}

			context.status.is_main_menu_reload = false;
		}

		/*
			현재 로드된 페이지를 제외하고 onload/unload function 실행여부 처리
			-> 추가적으로 페이지가 변경됐는데 unload가 실행되지 않은 페이지 실행시켜줌
		*/
		$.each(context.menu_list, function() {
			var is_success = false;

			if (this.main_menu != menu.main_menu) {
				if (!this.is_exec_unload_fnc && this.unload_fnc != undefined) {
					if (this.unload_fnc instanceof Function) {
						is_success = this.unload_fnc();

						if (is_success) {
							this.is_exec_onload_fnc = false;
							this.is_exec_unload_fnc = true;

							if (window.console != undefined && context.debug) {
								console.log("loadOnloadUnloadFunction : "+ this.main_menu +" unload_fnc success!!22222");
							}
						}
					} else {
						this.is_exec_onload_fnc = false;
						this.is_exec_unload_fnc = true;
					}
				} else {
					this.is_exec_onload_fnc = false;
					this.is_exec_unload_fnc = true;
				}
			}
		});


		// 서브메뉴 unload function 실행
		$.each(menu.sub_menu, function() {
			if (this.loaded == false && this.is_exec_onload_fnc == true) {
				if (!this.is_exec_unload_fnc && this.unload_fnc != undefined) {
					if (this.unload_fnc instanceof Function) {
						is_success = this.unload_fnc(this.menu);

						if (is_success) {
							this.is_exec_onload_fnc = false;
							this.is_exec_unload_fnc = true;

							if (window.console != undefined && context.debug) {
								console.log("loadOnloadUnloadFunction : SubMenu : "+ this.menu +" unload_fnc success!!");
							}
						}
					} else {
						this.is_exec_onload_fnc = false;
						this.is_exec_unload_fnc = true;
					}
				} else {
					this.is_exec_onload_fnc = false;
					this.is_exec_unload_fnc = true;
				}
			}
		});

		// onload function이 정의되 있다면 실행
		if ((menu.onload_fnc != undefined && context.isSubMenuLoaded() == false) || context.isSubMenuLoaded() == true) {
			if (context.isSubMenuLoaded() == true) { // 서브메뉴가 로드 되었다면.. 서브메뉴에 할당된 function 실행
				var sub_menu = context.getLoadedSubMenu();

				if (sub_menu) {
					if (menu.sub_menu[sub_menu].onload_fnc instanceof Function && !menu.sub_menu[sub_menu].is_exec_onload_fnc) {
						is_success = menu.sub_menu[sub_menu].onload_fnc(sub_menu);
						if (is_success) {
							menu.sub_menu[sub_menu].is_exec_onload_fnc = true;
							menu.sub_menu[sub_menu].is_exec_unload_fnc = false;

							if (window.console != undefined && context.debug) {
								console.log("loadOnloadUnloadFunction : SubMenu : "+ menu.sub_menu[sub_menu].menu +" onload_fnc success!!");
							}
						}
					}
				}
			} else { // 메인메뉴
				if (menu.onload_fnc instanceof Function && !menu.is_exec_onload_fnc) {
					is_success = menu.onload_fnc();
					if (is_success) {
						menu.is_exec_onload_fnc = true;
						menu.is_exec_unload_fnc = false;

						if (window.console != undefined && context.debug) {
							console.log("loadOnloadUnloadFunction : "+ menu.main_menu +" onload_fnc success!!");
						}
					}
				}
			}
		}
	}

	/*
		content load complete callback
	*/
	context.loadMenuContentComplete = function(menu) {
		var anchor, anchor_scroll_top, state_scroll_top, page_scroll_top = "";

		if (config.use_hash == true) {
			anchor = context.getHashValue('anchor'); // anchor가 정의되 있다면.. 해당 위치로 이동
			anchor_scroll_top = context.getHashValue('anchor_scroll_top'); // 스크롤 위치값이 있다면.. 해당 위치로 이동

			if (window.history.state) { // state 에 scrolltop 값이 저장되 있다면..
				if (window.history.state.scrolltop) {
					state_scroll_top = window.history.state.scrolltop;
				}
			}

			page_scroll_top = anchor_scroll_top ? anchor_scroll_top : state_scroll_top;

			if (!etoosUtil.isNumeric(page_scroll_top)) {
				page_scroll_top = "";
			}
		}

		// 스크롤 이동 처리 (메뉴가 변경되었거나, anchor가 지정되었거나, 서브메뉴가 로드된 경우)
		if (context.status.is_page_change == true || context.status.is_submenu_load_after_top_menu_clicked == true || context.status.is_main_menu_load == true || menu.scrolltop != null || anchor != "" || page_scroll_top != "" || (context.isSubMenuLoaded() == true && (config.on_submenu_load_auto_scroll == true || menu.on_submenu_load_auto_scroll == true))) {

			context.status.is_auto_scroll_executing = true;

			setTimeout(function() {				
				var scrolltop = 0;
				var top_menu_offset = $(config.top_swiper_menu_selector).offset().top;
				
				if (anchor != "") {
					if ($('#'+ anchor).length > 0) {
						scrolltop = $('#'+ anchor).offset().top; // 정의된 anchor 객체의 스크롤 위치값 가져오기

						var anchor_rev_px = context.getHashValue('anchor_rev_px');
						if (etoosUtil.isNumeric(anchor_rev_px)) {
							scrolltop = scrolltop + parseFloat(anchor_rev_px);
						}						
					}
				
				} else if (page_scroll_top != null && page_scroll_top != "") {
					scrolltop = page_scroll_top;
					menu.scrolltop = null;

				} else if (window_scroll_top > top_menu_offset && config.auto_scrolling && menu.auto_scrolling && menu.scrolltop == null) {
					scrolltop = top_menu_offset;

				} else if (context.isSubMenuLoaded() == true && (config.on_submenu_load_auto_scroll == true || menu.on_submenu_load_auto_scroll == true)) {
					scrolltop = top_menu_offset;

				} else if (menu.scrolltop != null) {
					scrolltop = menu.scrolltop;
					menu.scrolltop = null;
				}
			
				if (scrolltop > 0) { // 스크롤위치가 지정되었다면 이동시킨다
					if (config.use_auto_scrolling_animate) {
						$('html, body').stop().animate({scrollTop: scrolltop}, 400);
					} else {
						$('html, body').stop().scrollTop(scrolltop);
					}

					if (window.console != undefined && context.debug) {
						console.log('loadMenuContentComplete : auto scroll executing!!\n	anchor = '+ anchor +'\n	page_scroll_top = '+ page_scroll_top +'\n	anchor_rev_px = '+ anchor_rev_px +'\n	window_scroll_top = ' + window_scroll_top + '\n	top_menu_offset = '+ top_menu_offset + '\n	:: auto scroll target = ' + scrolltop);
					}
				}

				window_scroll_top = 0;				
				
				// anchor 관련 해시태그를 제거한다
				if (config.use_hash == true) {
					if (context.getHashValue('anchor') != "" || context.getHashValue('anchor_scroll_top') != "") {
						var update_hash = context.getPageHashParam(["anchor", "anchor_rev_px", "anchor_scroll_top"]);

						if (is_pushstate_supported) {
							window.history.replaceState(null, "", config.hashbang + update_hash);
						} else {
							context.status.is_hashchange_block = true // hashchange 이벤트 처리 방지

							document.location.replace(config.hashbang + update_hash);
						}						
					}
				}
				
				setTimeout(function() {
					context.status.is_auto_scroll_executing = false;					
				}, 100);
			}, 250);			
			
			context.status.is_submenu_load_after_top_menu_clicked = false;
			context.status.is_main_menu_load = false;
		}

		// hide된 페이지의 selectbox disable 처리 (일부 모바일 브라우저의 경우 selectbox 이동 기능이 있는데, 숨겨진 selectbox로 이동되버릴 수 있음)
		$('.slider > div', config.swiper_content_container_selector).each(function() {
			if (!$(this).hasClass('on')) {
				$('select', this).prop('disabled', true);
			} else {
				$('select', this).each(function() {
					var $select = $(this);
					if (!$select.data('init-disabled')) {
						$select.prop('disabled', false);
					}
				});
			}
		});

		// 메뉴가 변경되었다면..
		if (context.status.is_page_change == true) {
			var page_change_exec_cnt = 0;
			var ti_page_change_exec = setInterval(function() {
				if (context.status.iosslide_status == 'complete' || page_change_exec_cnt > 10) {
					clearInterval(ti_page_change_exec);
				
					// 이전 메뉴의 서브메뉴가 로드되었다면.. content를 비워준다.
					if (config.on_menu_change_close_submenu == true || context.menu_list[context.prev_menu].on_menu_change_close_submenu == true) {
						$.each(context.menu_list[context.prev_menu].sub_menu, function() {
							if (this.loaded == true) {
								$('#swiper_main_content_'+ context.prev_menu, config.swiper_content_container_selector).html("");
								this.loaded = false;
								return false;
							}
						});
					}			
				}

				page_change_exec_cnt++;

			}, 500);
		}


		// UI 관련 스크립트 시작
		$('.iconsize').each(function() {
			var iwidth = $(this).attr('iconsizew');
			var iheght = $(this).attr('iconsizeh');

			$(this).css({'width':iwidth+'px','height':iheght+'px'});
		});
		// UI 관련 스크립트 종료

		context.status.is_page_change = false;

		context.status.is_slide_from_touch = false;

		setTimeout(function() {
			context.resizeContentHeight();
		}, 90);

		if (typeof isQuickMenuDisable != "undefined") {
			setTimeout(function() {
				isQuickMenuDisable = false;
				quick_menu_wscrt = $(window).scrollTop();
			}, 500);
		}
		
		if (window.console != undefined && context.debug) {
			console.log('loadMenuContentComplete : load complete!!! menu = '+ menu.main_menu);
		}
	}
}