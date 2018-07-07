var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        document.addEventListener("backbutton", onBackKeyDown, false);

        etoos.setHeaderTitle('home', '', 'file:///android_asset/www/app/index.html');
        etoos.setFooterActiveButton('home');

        initCommon();
		initEtoosUI();
        onInitTcc();
        onInitOnecutLecture();
    }
};

app.initialize();

function onBackKeyDown(e) {
	etoos.exitApp();
    e.preventDefault();
}

function onWebviewSubscribeCallback(params) {
	if (params == null || !typeof params =='Object' || params.length == 0) {
		return;
	}

	var obj = params[0];
 	if (obj.type == 'gnb_close') {

 	} else if (obj.type == 'url_move') {
 	    var url = obj.url;

 	    if (url != null && typeof url == 'string') {
 	        document.location.href = url;
 	    }
 	}
}

function onWebviewSubscribeCallbackError() {
	console.log('webview callback error!');
}

function goPageApp(link_url,link_url_ios){
	if (link_url_ios==""){
		link_url_ios = link_url;
	}
	var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.search("android") > -1)
		document.location.href = link_url;
	else {
		document.location.href = link_url_ios;
	}
}


function onInitTcc() {
	nSQL("main_tcc_list").model([
        { key: 'board_arti_id', type: 'int', props: ['pk'] },
        { key: 'board_id', type: 'int' },
        { key: 'teacher_id', type: 'string'},
        { key: 'teacher_nm', type: 'string'},
        { key: 'title', type: 'string'},
        { key: 'new_teacher_icon', type: 'string'}
    ]).config({
        mode: window.nSQLite.getMode() // required
    }).connect();

	// server 에서 데이터를 가져온다
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		$.ajax({
			url: "http://m0.etoos.com/app/home/tcc_list.json.asp",
			data: {
				etgrd: 'go3'
			},
			cache: true,
			dataType: "text",
			success: function (data) {
                var json = JSON.parse(data);
                var err_cd = json.err_cd;
                var err_msg = json.err_msg;

                if (err_cd == '0000') {
                    tccListRender();
                }
            },
            error: function () {
                tccListRender();
            }
		});

		function tccListRender() {
            var $tcc = $('.swiper-wrapper > .swiper-slide', '#tccswiper').get();
            var random = $.randomize($tcc);

            $('.swiper-wrapper', '#tccswiper').empty();
            $('.swiper-wrapper', '#tccswiper').append(random);

            setTimeout(function() {
                // 표준 이미지는 16:9(영상비율) 비율 이므로.. 계산하여 적용한다.. (비율이 맞지 않는 이미지가 있을 수 있으므로..)
                $('div.swiper-slide', '#tccswiper').find('img').each(function() {
                    var height = parseInt(9 * ($(this).width() / 16));

                    $(this).css('height', height +'px');
                });

                $('#tccswiper').animate({'opacity': '1'}, 200);
            }, 100);
        }
	}

}

var inAppBrowserRef;
function fnTccView(url) {
	webview.SubscribeCallback(onWebviewSubscribeCallback, onWebviewSubscribeCallbackError);
	webview.Show(url, '선생님 TCC');
}

function loadStartCallBack() {
    //etoos_util.showLoader();

}

function loadStopCallBack() {
    if (inAppBrowserRef != undefined) {
        //etoos_util.hideLoader();
        inAppBrowserRef.show();
    }
}

function loadErrorCallBack(params) {
    //etoos_util.hideLoader();

    var scriptErrorMesssage =
       "alert('Sorry we cannot open that page. Message from the server is : "
       + params.message + "');"

    inAppBrowserRef.executeScript({ code: scriptErrorMesssage }, executeScriptCallBack);
    inAppBrowserRef.close();
    inAppBrowserRef = undefined;
}


var onecut_swiper_menu_active_seq = 0;
var onecut_swiper_menu = null;
var onecut_swiper_content = null;
var onecut_init_area_cd = "";

function onInitOnecutLecture() {
	if (onecut_init_area_cd == "") {
		var rnd_start = 1;
		var rnd_end = $('.swiper-slide', '#onecut_swiper_menu').length;
		var rnd = Math.floor(Math.random() * rnd_end) + rnd_start;

		onecut_init_area_cd = $('.swiper-slide', '#onecut_swiper_menu').eq(rnd-1).find('a').data('area-cd');
	}

	$('div[id^="onecut_swiper_content_"]', '#onecut').each(function() {
		var $onecut = $('.swiper-wrapper > .swiper-slide', this).get();
		var random = $.randomize($onecut);

		$('.swiper-wrapper', this).empty();
		$('.swiper-wrapper', this).append(random);
	});

	$('.swiper-slide > a', '#onecut_swiper_menu').each(function(i) {
		if (onecut_init_area_cd) {
			if ($(this).data('area-cd') == onecut_init_area_cd) {
				$(this).addClass('on');

				onecut_swiper_menu_active_seq = i - 3;
				if (onecut_swiper_menu_active_seq < 0) {
					onecut_swiper_menu_active_seq = 0;
				}

				return false;
			}
		}
	});

	$('.swiper-slide > a', '#onecut_swiper_menu').each(function(i) {
		$(this).on('click', function() {
			var area_cd = $(this).data('area-cd');
			var active_seq = i - 3;
			if (active_seq < 0) {
				active_seq = 0;
			}

			$(this).parent().parent().find('a').removeClass('on');
			$(this).addClass('on');

			onecut_swiper_menu.slideTo(active_seq, 300);

			setOncutSwiperContent(area_cd);
		});
	});

	onecut_swiper_menu = new Swiper('#onecut_swiper_menu .swiper-container', {
		initialSlide: onecut_swiper_menu_active_seq,
		preventClicks: false,
		slidesPerView: 5,
		spaceBetween: 4.9,
		onSlideChangeEnd: function(sw) {
			var slides_per_view;

			if (Math.floor(sw.params.slidesPerView) == sw.params.slidesPerView) {
				slides_per_view = Math.floor(sw.params.slidesPerView) - 1;
			} else {
				slides_per_view = Math.floor(sw.params.slidesPerView);
			}

			var last_slide = sw.slides.length - slides_per_view;
			if (last_slide < 0) {
				last_slide = 0;
			}

			if(sw.activeIndex >= parseInt(last_slide - 1) && sw.activeIndex > 0) {
				$('#onecut_swiper_menu').find('a.more').addClass('open');
			} else {
				$('#onecut_swiper_menu').find('a.more').removeClass('open');
			}
		}
	});

	$('#onecut_swiper_menu').find('a.more').on("click", function(e) {
		if($(this).hasClass('open')){
			$(this).removeClass("open");

			onecut_swiper_menu.slideTo(0, 300);
		}else{
			$(this).addClass("open")

			onecut_swiper_menu.slideTo(5, 300);
		}
		return false;
	});

	setOncutSwiperContent(onecut_init_area_cd);
}

function setOncutSwiperContent(area_cd) {
	var init_slide_seq = 0;
	$('#onecut_swiper_content_'+ area_cd).find('.swiper-slide').each(function(i) {
		if ($(this).hasClass('swiper-slide-active')) {
			init_slide_seq = i;
		}
	});


	$('div[id^=onecut_swiper_content_]').hide();
	if (onecut_swiper_content) {
		onecut_swiper_content.destroy();
	}

	$('#onecut_swiper_content_'+ area_cd).css('opacity', 0.3);
	$('#onecut_swiper_content_'+ area_cd).show();

	onecut_swiper_content = new Swiper('#onecut_swiper_content_'+ area_cd, {
		initialSlide: init_slide_seq,
		preventClicks: false,
		slidesPerView: 2.3,
		spaceBetween: 5,
		runCallbacksOnInit: true,
		onInit: function(sw) {
			// 표준 이미지는 16:9(영상비율) 비율 이므로.. 계산하여 적용한다.. (비율이 맞지 않는 이미지가 있을 수 있으므로..)
			$('.img > img', '#onecut_swiper_content_'+ area_cd).each(function() {
				var height = parseInt(9 * ($(this).width() / 16));

				$(this).css('height', height +'px');
			});

			sw.slideTo(0, 300);

			$('#onecut_swiper_content_'+ area_cd).animate({'opacity': '1'}, 400);
		}
	});

	setTimeout(function() {
		etoos.hideLoading();
	}, 300);
}