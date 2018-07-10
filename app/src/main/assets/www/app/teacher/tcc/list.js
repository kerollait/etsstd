var main_top_swiper_menu_active_seq = 0;
var main_top_swiper_menu = null;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        initCommon();
        etoos.setHeaderTitle('title', '선생님', url_root +'/app/teacher/index.html');
		etoos.setFooterActiveButton('home');

        initEtoosUI();
        initTcc();
    }
};

app.initialize();

function initTcc() {
    etoos_swiper = new EtoosSwiper();
    etoos_swiper.init({
        menu_key: "area_cd",
        use_top_swiper_menu_hash_history: false,
        use_menu_reload_hash_history: false,
        sub_menu_external_mode: true,
        use_random_default_menu: true,
        /*random_default_menu_range: {
            start: 1,
            end: 5
        },*/
        use_top_swiper_menu_nav: true,
        top_swiper_menu_config: {
            slidesPerView: 4.9,
            spaceBetween: 0
        }
    });

    var win_width = $(window).width();
    if (win_width > 410) {
        $('img[id=img_best_tcc]').css({'width': '410px', 'height': '230.6px', 'visibility': 'visible'});
    } else {
        $('img[id=img_best_tcc]').css({'visibility': 'visible'});
    }
}

function setTopMenuButtonCss() { // 홈버튼 작게 만들기
     $('.maintabtop .swiper-slide').each(function(index){
        var txwidth = $(this).find('.txwidth').attr('width');
        $(this).width(txwidth);
    });
}

function onWebviewSubscribeCallback(params) {
	if (params == null || !typeof params =='Object' || params.length == 0) {
		return;
	}

	var obj = params[0];
 	if (obj.type == 'url_move') {
 	    var url = obj.url;

 	    if (url != null && typeof url == 'String') {
 	        document.location.href = url;
 	    }
 	}
}

function onWebviewSubscribeCallbackError() {
	console.log('webview callback error!');
}

function fnBestTccDetailView(board_id, board_arti_id, teacher_id) {
	webview.SubscribeCallback(onWebviewSubscribeCallback, onWebviewSubscribeCallbackError);
	webview.Show("app/teacher/tcc/view.html?best_yn=Y&board_id="+ board_id +"&board_arti_id="+ board_arti_id);
}