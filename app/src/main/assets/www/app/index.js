
var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    databaseModel: function() {
        return nSQL("home").model([
                { key: 'grade', type: 'int', props: ['pk'] },
                { key: 'banner1', type: 'string'},
                { key: 'banner2', type: 'string'},
                { key: 'tcc', type: 'string' }
            ]).config({
                mode: window.nSQLite.getMode()
            });
    },

    onDeviceReady: function() {
        etoos.setHeaderTitle('home', EtoosData.getGradeName(), EtoosServiceUrl.home);
        etoos.setFooterActiveButton('home');

		initCommon();
        initEtoosUI();
        this.initContents();
    },

    initContents: function() {
        var GRADE = EtoosData.getGrade();
    	var tcc = new this.Tcc();
        var mainBanner = new this.MainBanner();
        onInitOnecutLecture();

        var home_expire_dt = etoosStorage.getItem("home."+ GRADE +".expire_dt");
        var is_home_expired = true;
        if (home_expire_dt != null && typeof home_expire_dt !== 'undefined') {
            is_home_expired = ((new Date().getTime() - new Date(etoosStorage.getItem("home."+ GRADE +".expire_dt")).getTime()) / 1000) > 900 ? true : false;
        }

        if (network_state !== Connection.NONE && is_home_expired) {
            $.ajax({
                url: api_path +"/home/home.json.asp",
                data: {
                    etgrd: GRADE
                },
                timeout: 3000,
                dataType: "text",
                success: function (data) {
                    var json = JSON.parse(data);

                    var err_cd = json.err_cd;
                    var err_msg = json.err_msg;

                    if (err_cd == '0000') {
                        var banner_list1 = json.banner_list1;
                        var banner_list2 = json.banner_list2;
                        var tcc_list = json.tcc_list;

                        mainBanner.bannerRender(banner_list1, banner_list2);
                        tcc.tccListRender(tcc_list);

                        //saveDataToLocalDatabase(banner_list1, banner_list2, tcc_list);
                        saveDateToLocalStorage(banner_list1, banner_list2, tcc_list);

                        etoosStorage.setItem("home."+ GRADE +".expire_dt", new Date());
                    }
                },
                error: function () {
                    onOfflineMode();
                }
            });

        } else {
            onOfflineMode();
        }


        function saveDateToLocalStorage(banner_list1, banner_list2, tcc_list) {
            var banner1 = window.btoa(encodeURI(JSON.stringify(banner_list1)));
            var banner2 = window.btoa(encodeURI(JSON.stringify(banner_list2)));
            var tcc = window.btoa(encodeURI(JSON.stringify(tcc_list)));

            etoosStorage.setItem("home."+ GRADE +".banner1", banner1);
            etoosStorage.setItem("home."+ GRADE +".banner2", banner2);
            etoosStorage.setItem("home."+ GRADE +".tcc", tcc);
        }

        function saveDataToLocalDatabase(banner_list1, banner_list2, tcc_list) {
            var banner1 = window.btoa(encodeURI(JSON.stringify(banner_list1)));
            var banner2 = window.btoa(encodeURI(JSON.stringify(banner_list2)));
            var tcc = window.btoa(encodeURI(JSON.stringify(tcc_list)));
            var GRADE_INT = parseInt(GRADE.replace('go', ''));

            app.databaseModel().connect().then(function() {
                nSQL("home")
                    .query("upsert", {
                        grade: GRADE_INT,
                        banner1: banner1,
                        banner2: banner2,
                        tcc: tcc
                    })
                    .exec();
            });
        }

        function onOfflineMode() {
            //mainBanner.bannerRenderFromDatabase();
            //tcc.tccListRenderFromDatabase();
            mainBanner.bannerRenderFromLocalStorage();
            tcc.tccListRenderFromLocalStorage();
        }

        var exec_cnt = 0;
        var ti = setInterval(function() {
            if (tcc.getComplete() && mainBanner.getComplete()) {
                etoos.hideLoading();
                clearInterval(ti);
            }

            exec_cnt++;

            if (exec_cnt > 15) {
                etoos.hideLoading();
                clearInterval(ti);
            }
        }, 300);
    },

    MainBanner: function() {
        var GRADE = EtoosData.getGrade();
    	var is_complete = false;
    	var context = this;

    	context.getComplete = function() {
            return is_complete;
        }

        context.bannerRenderFromLocalStorage = function() {
        	var banner1_data = etoosStorage.getItem("home."+ GRADE +".banner1");
        	var banner2_data = etoosStorage.getItem("home."+ GRADE +".banner2");

        	if (banner1_data != null && typeof banner1_data !== 'undefined' && banner2_data != null && typeof banner2_data !== 'undefined') {
        		var banner1 = decodeURI(window.atob(banner1_data));
    			var banner2 = decodeURI(window.atob(banner2_data));

    			var json1 = JSON.parse(banner1);
    			var json2 = JSON.parse(banner2);

    			context.bannerRender(json1, json2);
        	} else {
        		context.bannerRender(null, null);
        	}
        }

    	context.bannerRenderFromDatabase = function() {
    	    var GRADE_INT = parseInt(GRADE.replace('go', ''));
    	    var db = nSQL("home").query("select", ["banner1", "banner2"]).where(["grade", "=", GRADE_INT]);

    	    if (nSQL().isConnected) {
    	        db.exec().then(renderExec);
    	    } else {
    	        app.databaseModel().connect().then(function() {
                    db.exec().then(renderExec);
                });
    	    }

    	    function renderExec(rows) {
    	        var banner1 = decodeURI(window.atob(rows[0].banner1));
                var banner2 = decodeURI(window.atob(rows[0].banner2));

                var json1 = JSON.parse(banner1);
                var json2 = JSON.parse(banner2);

                context.bannerRender(json1, json2);
    	    }
    	}

    	context.bannerRender = function(banner1, banner2) {
    		var $obj_banner1 = $("#appmainvisual > .swiper-container > .swiper-wrapper");
            var $obj_banner2 = $("#appmainevent2 > .swiper-container > .swiper-wrapper");

            var html1 = "", html2 = "";
            var $template_banner1 = $obj_banner1.find("div[name='banner_template']");
            var $template_banner2 = $obj_banner2.find("div[name='banner_template']");
            var corver_img_height1 = $obj_banner1.find("div[name='cover_image']").height();
            var corver_img_height2 = $obj_banner2.find("div[name='cover_image']").height();

            $obj_banner1.css("height", corver_img_height1 +"px");
            $obj_banner2.css("height", corver_img_height2 +"px");

            if (banner1 == null || banner1.length == 0) {
    			$obj_banner1.find("img").removeClass("lazy-ready");
    		} else {
    			$.each(banner1, function() {
    				var img_local_path = cache_storage_www +"/home/banner"+ this.cont_img_url.replace(img_domain, '');
    				var template_html = $template_banner1.html();

    				template_html = template_html.replace("{cont_img_url}", this.cont_img_url);
    				template_html = template_html.replace("{img_local_path}", img_local_path);
    				template_html = template_html.replace("{title}", this.title);
    				template_html = template_html.replace("{cont_full_url}", this.cont_full_url);
    				template_html = template_html.replace("{cont_full_url_g}", this.cont_full_url_g);
    				template_html = template_html.replace("{event_text}", this.event_text);

    				html1 += "<div class='swiper-slide'>";
    				html1 += template_html;
    				html1 += "</div>";
    			});

    			$obj_banner1.html(html1);

    			$obj_banner1.find('img').each(function() {
    				setImageResourceFromLocalStorage(this);
    			});
    		}

            if (banner2 == null || banner2.length == 0) {
    			$obj_banner2.find("img").removeClass("lazy-ready");
    		} else {
    			$.each(banner2, function() {
    				var img_local_path = cache_storage_www +"/home/banner"+ this.cont_img_url.replace(img_domain, '');
    				var template_html = $template_banner2.html();

    				template_html = template_html.replace("{cont_img_url}", this.cont_img_url);
    				template_html = template_html.replace("{img_local_path}", img_local_path);
    				template_html = template_html.replace("{title}", this.title);
    				template_html = template_html.replace("{cont_full_url}", this.cont_full_url);
    				template_html = template_html.replace("{cont_full_url_g}", this.cont_full_url_g);

    				html2 += "<div class='swiper-slide'>";
    				html2 += template_html;
    				html2 += "</div>";
    			});

    			$obj_banner2.html(html2);

    			$obj_banner2.find('img').each(function() {
    				setImageResourceFromLocalStorage(this);
    			});
    		}

            var exec_cnt = 0;
            var ti = setInterval(function() {
                var img_ready_cnt1 = $obj_banner1.find("img.lazy-ready").length;
                var img_ready_cnt2 = $obj_banner2.find("img.lazy-ready").length;

                if (img_ready_cnt1 == 0 && img_ready_cnt2 == 0) {
                    $obj_banner1.css("height", "");
                    $obj_banner2.css("height", "");

                    clearInterval(ti);
                    if ($obj_banner1.find("div.swiper-slide").length > 1) {
                        $("#appmainvisual").removeClass("not-this");
                        fnSwipeAreaTab("#appmainvisual");
                    }

                    if ($obj_banner2.find("div.swiper-slide").length > 1) {
                        $("#appmainevent2").removeClass("not-this");
                        fnSwipeAreaTab("#appmainevent2");
                    }

                    is_complete = true;
                }

                exec_cnt++;

                if (exec_cnt > 50) {
                    clearInterval(ti);
                    is_complete = true;
                }
            }, 234);
    	}
    },

    Tcc: function() {
        var GRADE = EtoosData.getGrade();
    	var context = this;
    	var device_width = $(window).width();
    	var is_complete = false;

    	context.getComplete = function() {
    		return is_complete;
    	}

    	context.tccListRenderFromLocalStorage = function() {
    		var tcc_data = etoosStorage.getItem("home."+ GRADE +".tcc");
    		if (tcc_data != null && typeof tcc_data !== 'undefined') {
    			var data = decodeURI(window.atob(tcc_data));
    			var json = JSON.parse(data);
    			context.tccListRender(json);
    		} else {
    			context.tccListRender(null);
    		}
    	}

    	context.tccListRenderFromDatabase = function() {
    	    var GRADE_INT = parseInt(GRADE.replace('go', ''));
            var db = nSQL("home").query("select", ["tcc"]).where(["grade", "=", GRADE_INT]);

            if (nSQL().isConnected) {
                db.exec().then(renderExec);
            } else {
                app.databaseModel().connect().then(function() {
                    db.exec().then(renderExec);
                });
            }

            function renderExec(rows) {
                var data = decodeURI(window.atob(rows[0].tcc));
                var json = JSON.parse(data);

                context.tccListRender(json);
            }
    	}

    	context.tccListRender = function(data) {
    		var $obj = $("#tccswiper > .swiper-container > .swiper-wrapper");

    		if (data == null || typeof data === 'undefined') {
    			$obj.find("img").removeClass("lazy-ready");
                is_complete = true;
    			return;
    		}

    		var html = "";
    		var $template = $obj.find("div[name='tcc_template']");

    		$.each(data, function() {
    			var img_url = img_domain + "/board/"+ this.board_id +"/"+ this.board_arti_id +".jpg";
    			var img_local_path = cache_storage_www +"/teacher/tcc/"+ this.board_id +'/'+ this.board_arti_id +'.jpg';
    			var template_html = $template.html();

    			template_html = template_html.replace("{img_local_path}", img_local_path);
    			template_html = template_html.replace("{img_url}", img_url);
    			template_html = template_html.replace("{tcc_gb_nm}", this.tcc_gb_nm);
    			template_html = template_html.replace("{link_url}", "javascript:fnTccView('"+ this.teacher_id +"', '"+ this.board_id +"', '"+ this.board_arti_id +"');");
    			template_html = template_html.replace("{title}", this.title);
    			template_html = template_html.replace("{area_nm}", this.area_nm);
    			template_html = template_html.replace("{teacher_nm}", this.teacher_nm);

    			html += "<div class='swiper-slide'>";
    			html += template_html;
    			html += "</div>";
    		});

    		$obj.html(html);

    		var $tcc = $('.swiper-wrapper > .swiper-slide', '#tccswiper').get();
    		var random = $.randomize($tcc);

    		$('.swiper-wrapper', '#tccswiper').empty();
    		$('.swiper-wrapper', '#tccswiper').append(random);

    		$obj.find('img').each(function() {
    			setImageResourceFromLocalStorage(this);
    		});

			var view_per_cnt = (device_width / 160).toFixed(1);
            $("#tccswiper").attr("pevNo", view_per_cnt);
            $("#tccswiper").removeClass("not-this lazy-ready");
            fnSwipeAreaTab("#tccswiper");

            is_complete= true;
        }

    }
};

app.initialize();

function setImageResourceFromLocalStorage(obj) {
	var $img = $(obj);
	var local_path = $img.data('local-path');
	var img_url = $img.data('img-url');
	var def_img_path = $img.data('default-src');

	window.resolveLocalFileSystemURL(local_path, function(fileEntry) {
		$img.attr('src', local_path);
		$img.addClass("lazy-complete");
		$img.removeClass("lazy-ready");

	}, function(e) {
		if (network_state !== Connection.NONE) {
			$img.attr('src', img_url);

			var fileTransfer = new FileTransfer();
			var uri = encodeURI(img_url);
			fileTransfer.download(
				uri,
				local_path,
				function(entry) {
					// download complete!
				},
				function(error) {
					$img.attr('src', def_img_path);
				}
			);
		} else {
			$img.attr('src', def_img_path);
		}

		$img.addClass("lazy-complete");
		$img.removeClass("lazy-ready");
	});
}

function fnSwipePullRefresh() {
	etoosStorage.removeItem("home."+ EtoosData.getGrade() +".expire_dt");
	document.location.reload();
}

function setOrientationChange() {
	document.location.reload();
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

function fnTccView(teacher_id, board_id, board_arti_id) {
	webview.SubscribeCallback(onWebviewSubscribeCallback, onWebviewSubscribeCallbackError);
	webview.Show('app/teacher/tcc/view.html?mode=teacher&teacher_id='+ teacher_id +'&board_id='+ board_id +'&board_arti_id='+ board_arti_id, '선생님 TCC');
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
}




