/*
Etoos Util (공통 유틸리티 함수 모음)

'작성일자 : 2017-03-16
'작 성 자 : 서청훈

'변경일자   변경자  변동내역
'=======================================================================
'=======================================================================
*/

function EtoosUtil() {
	"use strict"

	var context = this;

	var is_loading = false; // 로딩여부

	var loader_svg = {
		spinner: '<svg style="width:60px; height:60px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="0.5" fill="#aaaaaa" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#054e54" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.8s" repeatCount="indefinite"/></path></svg>',

		spinner2: '<svg class="lds-spinner" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;width:50px;height:50px;"><g transform="rotate(0 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(30 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(60 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(90 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(120 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(150 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(180 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(210 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(240 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(270 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(300 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>  </rect></g><g transform="rotate(330 50 50)">  <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#a9abb5">    <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>  </rect></g></svg>',

		three_dot: '<svg style="width:40px; height:10px;" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#aaa"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" /></circle></svg>',

		facebook: '<svg style="width:40px; height:40px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="translate(20 50)"><rect x="-10" y="-30" width="20" height="60" fill="#cec9c9" opacity="0.6"><animateTransform attributeName="transform" type="scale" from="2" to="1" begin="0s" repeatCount="indefinite" dur="1s" calcMode="spline" keySplines="0.1 0.9 0.4 1" keyTimes="0;1" values="2;1"></animateTransform></rect></g><g transform="translate(50 50)"><rect x="-10" y="-30" width="20" height="60" fill="#cec9c9" opacity="0.8"><animateTransform attributeName="transform" type="scale" from="2" to="1" begin="0.1s" repeatCount="indefinite" dur="1s" calcMode="spline" keySplines="0.1 0.9 0.4 1" keyTimes="0;1" values="2;1"></animateTransform></rect></g><g transform="translate(80 50)"><rect x="-10" y="-30" width="20" height="60" fill="#cec9c9" opacity="0.9"><animateTransform attributeName="transform" type="scale" from="2" to="1" begin="0.2s" repeatCount="indefinite" dur="1s" calcMode="spline" keySplines="0.1 0.9 0.4 1" keyTimes="0;1" values="2;1"></animateTransform></rect></g></svg>',

		comment: '<svg style="width:44px; height:44px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><path d="M78,19H22c-6.6,0-12,5.4-12,12v31c0,6.6,5.4,12,12,12h37.2c0.4,3,1.8,5.6,3.7,7.6c2.4,2.5,5.1,4.1,9.1,4 c-1.4-2.1-2-7.2-2-10.3c0-0.4,0-0.8,0-1.3h8c6.6,0,12-5.4,12-12V31C90,24.4,84.6,19,78,19z" fill="rgba(84%,84%,84%,0.76)"></path><circle cx="30" cy="47" r="5" fill="#84b39f"><animate attributeName="opacity" from="0" to="1" values="0;1;1" keyTimes="0;0.2;1" dur="1s" repeatCount="indefinite"></animate></circle><circle cx="50" cy="47" r="5" fill="#84b39f"><animate attributeName="opacity" from="0" to="1" values="0;0;1;1" keyTimes="0;0.2;0.4;1" dur="1s" repeatCount="indefinite"></animate></circle><circle cx="70" cy="47" r="5" fill="#84b39f"><animate attributeName="opacity" from="0" to="1" values="0;0;1;1" keyTimes="0;0.4;0.6;1" dur="1s" repeatCount="indefinite"></animate></circle></svg>'
	}

	/*
	loading 애니메이션 노출
	loader_type: 로더 종류 (loader_svg 에 선언된 값 선택)
	loader_target: 로더 타겟 (값이 지정되면 해당 객체에 로더 표시, 없다면 body에 표시)
	loader_msg: 로딩메세지 표시 (값이 있을 경우 로더이미지 아래 노출됨)
	is_state_change: 로딩상태 변경여부
	loader_height: 로더영역 height값 별도 지정 (기본값: 80px)
	*/
	context.showLoader = function (loader_type, loader_target, loader_msg, is_state_change, loader_height) {
		var view_type = "all";

		if (loader_type == undefined || loader_type == null) {
			loader_type = "spinner";
		}

		if (loader_target && $(loader_target, 'body').length > 0) {
			view_type = "target";
		}

		if (view_type == 'all') {
			loader_target = "#etoosContent";
		}

		if (is_state_change == undefined || is_state_change == null) {
			is_state_change = true;
		}

		if (loader_target) {
			var loader, margin_left, margin_top;
			var svg = loader_svg[loader_type];

			if (svg) {
				margin_top = 40 - ($(svg).height() / 2);
				margin_left = -($(svg).width() / 2);

				var t = new Date().getTime() + (Math.floor(Math.random() * 999) + 1);

				if (view_type == 'all') {
					loader = '<div id="etoos_loader_' + t + '" style="position:absolute;width:100%;display:none;z-index:999;"><span style="position:fixed;left:50%;margin-top:140px;margin-left:' + margin_left + 'px;">' + svg + '</span></div>';
				} else {
					var css_height = "", lheight;
					if (loader_height && etoosSwiper.isNumeric(loader_height)) {
						lheight = loader_height;
					} else {
						lheight = $(loader_target, 'body').height();
					}

					if (lheight > 0) {
						css_height = "height:" + lheight + "px;";
						margin_top = (lheight / 2) - ($(svg).height());
					}

					loader = '<div id="etoos_loader_' + t + '" style="width:100%;' + css_height + 'padding-top:' + margin_top + 'px;display:none;text-align:center;z-index:15;">'
					loader += '<span>' + svg + '</span>';

					// 로딩메세지 노출
					if (loader_msg) {
						loader += '<div style="text-align:center;color:#aaaaaa;">' + loader_msg + '</div>'
					}

					loader += '</div>';
				}

				$(loader_target, 'body').prepend(loader);
				$('div[id^="etoos_loader_"]').show();

				/*if (loader_height && etoosSwiper.isNumeric(loader_height)) {
				margin_top = (loader_height / 2) - $(svg).height();

				$('#etoos_loader').css('height', loader_height +'px');
				$('span', '#etoos_loader').css('margin-top', margin_top + 'px');
				}*/
			}
		}

		if (is_state_change) {
			is_loading = true;
		}
	};

	/*
	loading 애니메이션 숨기기
	*/
	context.hideLoader = function () {
		$('div[id^="etoos_loader_"]').remove();

		is_loading = false;
	}

	/*
	loading 여부 리턴
	*/
	context.getIsLoading = function () {
		return is_loading;
	}

	/*
	숫자여부 체크
	*/
	context.isNumeric = function (val) {
		if (val != undefined && val != "" && val != null) {
			return $.isNumeric(val);
		} else {
			return false;
		}
	}

	/*
	* input value 정규식 처리
	*/
	context.inputRegExpCheck = function (obj, check, option) {
		var $obj = $(obj);
		if (!option) {
			option = "gi";
		}

		var regexp = new RegExp(check, option);

		var value = $obj.val().replace(regexp, "");
		$obj.val(value);
	}


	/*
	* 숫자에 지정한 자리수 만큼 '0' 채우기
	*/
	context.zeroFormat = function (str, len) {
		if (typeof str === 'number' || $.isNumeric(str)) {
			str = str.toString();

			return (len - str.length > 0) ? new Array(len + 1 - str.length).join('0') + str : str;
		} else {
			return str;
		}
	}


	/*
	* Textarea Limit
	*/
	context.textAreaStrLenLimit = function (obj, msg, obj_txtlen_view, len_type) {
		var temp, temp_str;
		var maxlen = $(obj).attr('maxlength');
		var msglen = maxlen;
		var val = $(obj).val();
		var l = val.length;

		if (msg == undefined || msg == null) {
			msg = "총 영문 " + (maxlen) + "자 한글 " + (maxlen / 2) + "자 까지 작성할 수 있습니다.";
		}

		if (len_type == undefined || len_type == null) {
			len_type = "byte";
		}

		temp_str = "";
		if (l == 0) {
			val = maxlen;
		} else {
			for (var k = 0; k < l; k++) {
				temp = val.charAt(k);

				if (len_type == 'byte') {
					if (escape(temp).length > 4) {
						msglen -= 2;
					} else {
						msglen--;
					}
				} else {
					msglen--;
				}

				if (msglen < 0) {
					if (msg) {
						alert("총 영문 " + (maxlen) + "자 한글 " + (maxlen / 2) + "자 까지 작성할 수 있습니다.");
					}

					$(obj).val(temp_str);
					return false;
				} else {
					temp_str += temp;
				}
			}
		}

		if (obj_txtlen_view != undefined && obj_txtlen_view != null) {
			$(obj_txtlen_view).html(maxlen - msglen);
		}
	}

	/*
	* QueryString 파라메터 값 검색
	*/
	context.getPageParamValue = function (key, url) {
		var rst = "";
		if (!url) {
			url = window.location.href;
		}

		if (url != "") {
			if (url.indexOf('#') > -1) {
				url = url.split('#')[0];
			}

			var params = url;
			if (params.indexOf('?') > -1) {
				params = params.split('?')[1];
			}
			var tmp = params.split('&');

			$.each(tmp, function () {
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
	* QueryString 파라메터에 값을 추가하거나 삭제한다
	*/
	context.pageParamMake = function (url, remove_param, add_param, add_value, remove_params, add_params, add_values) {
		var result = "", tmp_url = "", tmp_path = "", tmp_param = "", hash = "";

		if (!url || url == "") {
			url = document.location.href;
		}

		if (url.indexOf('#') > -1) {
			hash = url.split('#')[1];
			url = url.split('#')[0];
		}

		tmp_url = url;
		if (tmp_url.indexOf('?') > -1) {
			tmp_path = tmp_url.split('?')[0];
			tmp_param = tmp_url.split('?')[1];
		} else {
			tmp_path = tmp_url;
			tmp_param = "";
		}

		if (remove_param || remove_params) {
			var ary_param = (tmp_param + '&').split('&');
			var new_param = "";

			$.each(ary_param, function (index, param) {
				if (param != "") {
					var is_exist = false;
					var key = (param + '=').split('=')[0];
					var val = (param + '=').split('=')[1];

					if (remove_param) {
						if (key.toLowerCase() == remove_param.toLowerCase()) {
							is_exist = true;
						}
					}

					if (remove_params) {
						$.each(remove_params, function () {
							if (key.toLowerCase() == this.toLowerCase()) {
								is_exist = true;
								return false;
							}
						});
					}

					if (!is_exist) {
						new_param += "&" + param;
					}
				}
			});

			new_param = new_param.replace('&', '');
			tmp_param = new_param;
		}

		if (add_param && add_value) {
			if (tmp_param) {
				tmp_param += "&" + add_param + "=" + add_value;
			} else {
				tmp_param = add_param + "=" + add_value;
			}
		}

		if (add_params && add_values) {
			$.each(add_params, function (i) {
				if (tmp_param) {
					tmp_param += "&" + this + "=" + add_values[i];
				} else {
					tmp_param = this + "=" + add_values[i];
				}
			});
		}

		if (tmp_path) {
			result = tmp_path;
			if (tmp_param) {
				result += '?' + tmp_param
			}
		} else {
			result = tmp_param;
		}

		if (hash) {
			result += '#' + hash;
		}

		return result;
	}

	/*
	* 폼 유효성 검사
	*/
	context.getFormValidCheck = function (type, val) {
		var regExp;

		switch (type) {
			case "HP_NO":
				regExp = /^((01[1|6|7|8|9])[0-9]+[0-9]{6,7})|(010[0-9][0-9]{7})$/;
				break;

			case "HOME_TEL_NO":
				regExp = /^\d{2,3}\d{3,4}\d{4}$/;
				break;

			case "EMAIL":
				regExp = /^[\w\-]+@(?:(?:[\w\-]{2,}\.)+[a-zA-Z]{2,})$/g;
				break;
		}

		if (regExp != null) {
			return regExp.test(val);
		} else {
			return false;
		}
	}

	/*
	* 입력 문자 제한
	*/
	context.setOnlyInputType = function (type, obj) {
		var $obj = $(obj);

		switch (type) {
			case "NUMBER": // 숫자만 입력하도록
				var min = $obj.attr('min'); // 최소값
				var max = $obj.attr('max'); // 최대값
				var maxlength = $obj.attr('maxlength'); // 최대 길이

				context.inputRegExpCheck($obj, "[^0-9]", "gi");

				if ($obj.val().length > maxlength) {
					$obj.val($obj.val().slice(0, maxlength));
				}

				if (max) {
					if (parseInt($obj.val()) > parseInt(max)) {
						$obj.val(max);
					}
				}

				if (min) {
					if (parseInt($obj.val()) < parseInt(min)) {
						$obj.val(min);
					}
				}
				break;

			case "ALPHA": // 알파벳만 입력하도록
				context.inputRegExpCheck($obj, "[^a-zA-Z]", "gi");
				break;
		}
	}


	/*
	* Input Text 등에 "값이 들어가지 않도록.. 치환처리
	*/
	context.replaceInputValue = function (val) {
		if (val) {
			val.replace(/"/g, "&#34;");
		}

		return val;
	}


	/*
	* Select Box Option 생성 : 지정한 url로부터 받은 데이터로 option 생성
	*	사용예제) /teacher/evaluate/evaluate_write.asp
	*/
	context.setModuleSelectMake = function (o) {
		var opt = {
			dataUrl: '', // json 데이터 url
			paramData: '', // parameters
			targetObj: null, // selectbox 객체
			selectedValue: '', // 선택될 value값
			value: '', // value key (json 데이터의 key 값)
			text: '', // text key (json 데이터의 key 값)
			callback: function () { } // 완료 후 실행될 callback 함수
		};

		for (var property in o) {
			opt[property] = o[property];
		}

		var dataUrl = opt.dataUrl;
		var paramData = opt.paramData;
		var $select = $(opt.targetObj);
		var selectedValue = opt.selectedValue;
		var value = opt.value;
		var text = opt.text;

		if (dataUrl != "" && $select) {
			$.ajax({
				url: dataUrl,
				type: 'post',
				data: paramData,
				dataType: 'text',
				timeout: 10000,
				beforeSend: function () {
					$select.prop('disabled', true);
				},
				success: function (data) {
					var json = null;
					try {
						json = $.parseJSON(data);
					} catch (e) {
					}

					if (json) {
						if (json.err_cd != '0000') {
							alert(json.err_msg.replace(/<br>/gi, '\n'));
						} else {
							var data_list = json.data_list;
							$.each(data_list, function () {
								try {
									$select.append("<option value='" + eval("this." + value) + "'>" + eval("this." + text) + "</option>");
								} catch (e) { }
							});

							if (selectedValue != "") {
								if ($select.find('option[value="' + selectedValue + '"]').length > 0) {
									$select.val(selectedValue).trigger('change');
								}
							}
						}
					}
				},
				error: function (error, textStatus, errorThrown) {
				},
				complete: function () {
					$select.prop('disabled', false);

					if ($.isFunction(o.callback)) {
						o.callback();
					}
				}
			});
		}
	}

	/*
	* Select Box Option 생성 : array값으로 option 생성
	*/
	context.setArraySelectMake = function (o) {
		var opt = {
			array: null,
			targetObj: null,
			selectedValue: '',
			value: '',
			text: ''
		};

		for (var property in o) {
			opt[property] = o[property];
		}

		var array = opt.array;
		var $select = $(opt.targetObj);
		var selectedValue = opt.selectedValue;
		var value = opt.value;
		var text = opt.text;

		if (array && $select) {
			context.resetSelectOptions($select);

			$.each(array, function () {
				$select.append("<option value=\"" + eval("this." + value) + "\">" + eval("this." + text) + "</option>");
			});

			if ($select.find('option[value="' + selectedValue + '"]').length > 0) {
				$select.val(selectedValue);
			}
		}
	}

	/*
	* Select Option 초기화
	*/
	context.resetSelectOptions = function (obj) {
		var $select = $(obj);

		$select.val("").children("option[value!='']").remove();
	}


	/*
	* jquery ajax 한글 깨짐 방지 (euc-kr 환경에선 한글이 깨지므로.. escape(encodeURIComponent()) 처리)
	*	사용예) var param = $(form).serialize() 대신 var param = etoosSwiper.getFormObjectSerialize(form) 사용
	*/
	context.getFormObjectSerialize = function (obj, target) {
		var result = "";

		if (!target) {
			target = "html";
		}

		var $obj = $(obj, target);
		var fields = $obj.serializeArray();
		$.each(fields, function (i, field) {
			result += field.name + "=" + escape(encodeURIComponent(field.value));
			if ((fields.length - 1) > i) {
				result += "&";
			}
		});

		return result;
	}


	/*
	* jquery ajax form data 생성 (한글깨짐 방지처리 포함)
	*	=> jqury ajax 방식으로 파일 업로드 시 사용
	*	사용예제) /teacher/qna/qna_write.asp
	*/
	context.getFormData = function (obj, target, utf8_enc) {
		var formData = new FormData();

		if (!target) {
			target = "html";
		}

		if (utf8_enc == undefined) {
			utf8_enc = true;
		}

		var $form = $(obj, target);
		$('input,select,textarea', $form).each(function () {
			var $o = $(this);
			var tagName = $o[0].tagName.toUpperCase();
			var type = $o[0].type.toLowerCase();

			var key, val;

			if ((tagName == "INPUT" && (type == "hidden" || type == "text" || type == "number" || type == "file")) || tagName == "SELECT" || tagName == "TEXTAREA") {
				key = $o.attr('name');

				if (tagName == "INPUT" && type == "file") {
					if ($o.val() != "") {
						val = $o[0].files[0];
					}
				} else {
					val = $o.val();

					if (utf8_enc) {
						val = escape(encodeURIComponent(val));
					}
				}

				if (key != undefined && val != undefined && key != "" && val != "") {
					formData.append(key, val);
				}
			}
		});

		$('input:radio,input:checkbox', $form).each(function () {
			var $o = $(this);
			var type = $o[0].type.toLowerCase();
			var key, val;

			if ($o.is(':checked')) {
				key = $o.attr('name');
				val = $o.val();

				if (utf8_enc) {
					val = escape(encodeURIComponent(val));
				}

				if (key != undefined && val != undefined && key != "" && val != "") {
					formData.append(key, val);
				}
			}
		});

		return formData;
	}



	/*
	* 쿠키 세팅
	*/
	context.setCookie = function (name, val, exp, domain, path) {
		Cookies.raw = true;

		if (!domain) {
			domain = "etoos.com";
		}

		if (!path) {
			path = "/";
		}

		if (exp == 0) {
			exp = null;
		}

		if (val == null || val == "") {
			Cookies.set(name, "", {
				path: path,
				domain: domain
			});
		} else {
			Cookies.set(name, val, {
				path: path,
				domain: domain,
				expires: exp
			});
		}
	}

	/*
	* 쿠키 가져오기
	*/
	context.getCookie = function (name) {
		Cookies.raw = true;

		return Cookies.get(name);
	}


	/*
	* ios 버전 가져오기
	*/
	context.getIOSVersion = function () {
		var uagent = navigator.userAgent.toLocaleLowerCase();
		var os = context.getOSName();
		var ios_ver = 0;

		if (os == 'iphone' || os == 'ipad') {
			ios_ver = uagent.substr(uagent.indexOf('os ') + 3, 1);
			if (isNaN(ios_ver)) {
				ios_ver = 0;
			}
		}

		return ios_ver;

	}


	/*
	* 모바일 OS 가져오기
	*/
	context.getOSName = function () {
		var uagent = navigator.userAgent.toLocaleLowerCase();
		if ((uagent.match('iphone') != null || uagent.match('ipod') != null)) {
			return 'iphone';
		} else if (uagent.match('ipad') != null || uagent.match('macintosh') != null) {
			return 'ipad';
		} else if (uagent.match('android') != null) {
			return 'android';
		} else {
			return 'unknown';
		}
	}



	/*
	* 화면 Orientation 가져오기
	*/
	context.getOrientation = function () {
		var ori = $(window).width() > $(window).height() ? "Landscape" : "Portrait";

		return ori;
	}



	/*
	* 수강앱 여부
	*/
	context.getIsApp = function () {
		var uagent = navigator.userAgent;
		if (uagent.match('StarPlayer2/') != null) {
			return true;
		} else {
			return false;
		}
	}


}