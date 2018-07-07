var etoos_swiper = null;
var etoos_util = new EtoosUtil();
var TOKEN = "";
var GRADE = "go3";

var url_root = "file:///android_asset/www";
var api_domain = "http://m.etoos.com";
var api_path = api_domain + "/app";
var gnb_set_url = "file:///android_asset/www/app/index.html";
var storage_root = "";

function initCommon() {
	window.open = cordova.InAppBrowser.open;

	etoos.getLoginTokenAndGrade();
	storage_root = cordova.file.externalApplicationStorageDirectory;
}

function setLoginTokenAndGrade(result) {
	if (typeof result === 'string') {
		var json = JSON.parse(result);

		this.TOKEN = json.token;
		this.GRADE = json.grade;
	}
}

function onLogin(result) {
	if (result == "login_ok") {
		etoos.getLoginTokenAndGrade();
		onLoginSuccessCallback();
	}
}

function onLoginSuccessCallback() {

}

function FileUtils() {
    function saveFileFromUrl(url, save_dir, save_file_nm, mime_type) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
            if (this.status == 200) {
                var blob = new Blob([this.response], { type: mime_type });
                saveFile(save_dir, blob, save_file_nm);
            }
        };
        xhr.send();
    }

    function saveFile(save_dir, file_data, file_nm) {
        save_dir.getFile(file_nm, { create: true, exclusive: false }, function (file_entry) {
            writeFile(file_entry, file_data);
        }, onErrorCreateFile);
    }

    function writeFile(file_entry, file_data, isAppend) {

        // Create a FileWriter object for our FileEntry (log.txt).
        file_entry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function() {
                if (file_data.type == "image/jpg") {
                    readBinaryFile(fileEntry);
                }
                else {
                    readFile(fileEntry);
                }
            };

            fileWriter.onerror = function(e) {
                console.log("Failed file write: " + e.toString());
            };

            fileWriter.write(dataObj);
        });
    }
}



// 학년 설정
function fnGrdChange() {
	var cookie_grd = etoos_util.getCookie('etgrd');
	var now_grd = "go3";
	var grd = jQuery('input:radio[name="set_etgrd"]:checked').val();

	if (now_grd != grd || !cookie_grd) {
		var set_url = etoos_util.pageParamMake(null, 'etgrd', 'etgrd', grd, ['full-popup', 'pop-obj', 'pop-url', 'anim-type', 'header-menu', 'alert-popup', 'alert-pop-obj']);
		if (gnb_set_url) {
			set_url = etoos_util.pageParamMake(gnb_set_url, 'etgrd', 'etgrd', grd);
		}

		etoos_util.setCookie('etgrd', grd, 365);



		if (is_pushstate_supported) {
			setTimeout(function() {
				if (is_header_menu_open) {
					document.location.href = set_url;
				} else {
					document.location.replace(set_url);
				}
			}, 150);

			if (is_header_menu_open) {
				window.history.go(-2);
			}

		} else {
			setTimeout(function() {
				document.location.replace(set_url);
			}, 150);
		}

	} else {
		set_url = etoos_util.pageParamMake(null, null, null, null, ['alert-popup', 'alert-pop-obj']);

		if (is_pushstate_supported) {
			if (is_header_menu_open) {
				setTimeout(function() {
					window.history.pushState(null, '', set_url);
					window.history.back(-1);
				}, 150);

				window.history.back(-1);
			} else {
				window.history.replaceState(null, '', set_url);
			}
		}
	}

	fnAlertPopupClose('#intro_go');
}