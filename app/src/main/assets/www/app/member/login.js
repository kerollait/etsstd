var return_url = "";
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        initCommon();
        initEtoosUI();
        this.initContents();
    },

    initContents: function() {
        var saved_mem_id = etoosStorage.getItem("login.saved_mem_id");
        var auto_login = etoosStorage.getItem("login.auto_login");
        return_url = etoosUtil.getPageParamValue("return_url");

        $('#mem_id').val(saved_mem_id);

        if (saved_mem_id != "") {
            $('#mem_id_save').prop('checked', true);
        }

        if (auto_login == 'Y') {
            $('#auto_login').prop('checked', true);
        }

        etoos.hideLoading();
    }
};

app.initialize();

function fnSwipePullRefresh() {
	document.location.reload();
}

function setOrientationChange() {

}

function fnLoginSubmit() {
	if (network_state === Connection.NONE) {
		window.plugins.toast.showWithOptions({
            message: EtoosMessage.network_offline,
            duration: "short",
            position: "bottom",
            addPixelsY: -40
        });
        return;
	}

	if ($.trim($('#mem_id').val()) == "") {
		window.plugins.toast.showWithOptions({
            message: "아이디를 입력해 주세요!",
            duration: "short",
            position: "bottom",
            addPixelsY: -40
        });
        $('#mem_id').focus();
		return;
	}

	if ($.trim($('#pwd').val()) == "") {
        window.plugins.toast.showWithOptions({
            message: "비밀번호를 입력해 주세요!",
            duration: "short",
            position: "bottom",
            addPixelsY: -40
        });
        $('#pwd').focus();
        return;
    }

    $.ajax({
        url: EtoosApiUrl.login,
        method: "post",
        data: $("#fmLogin").serialize(),
        timeout: 3000,
        dataType: "text",
        success: function (data) {
            var json = JSON.parse(data);

            var err_cd = json.err_cd;
            var err_msg = json.err_msg;

            if (err_cd == '0000') {
                var member_info = json.member_info;
                var token = EtoosData.getMakeTokenFromMemberInfo(member_info);
                if (token != "") {
                    if ($("#mem_id_save").is(":checked")) {
                        etoosStorage.setItem("login.mem_id_save", "Y");
                        etoosStorage.setItem("login.saved_mem_id", member_info.mem_id);
                    } else {
                        etoosStorage.removeItem("login.mem_id_save");
                        etoosStorage.removeItem("login.saved_mem_id");
                    }

                    if ($("#auto_login").is(":checked")) {
                        etoosStorage.setItem("login.auto_login", "Y");
                    } else {
                        etoosStorage.removeItem("login.auto_login");
                    }

                    EtoosData.setToken(token);
                    etoosStorage.setItem("login.status", "ok");
                    etoosStorage.setItem("login.return_url", return_url);

                    intentPlugin.finishActivityForResult("com.etoos.study", "LoginActivity", null, "RESULT_OK");
                } else {
                    window.plugins.toast.showWithOptions({
                        message: "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
                        duration: "short",
                        position: "bottom",
                        addPixelsY: -40
                    });
                }
            } else {
				window.plugins.toast.showWithOptions({
                    message: err_msg,
                    duration: "short",
                    position: "bottom",
                    addPixelsY: -40
                });
            }
        }
    });
}