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
        var saved_mem_id = etoos_storage.getItem("login.saved_mem_id");
        var auto_login = etoos_storage.getItem("login.auto_login");

        $('#mem_id').val(saved_mem_id);
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
	if ($.trim($('#mem_id').val()) == "") {
		window.plugins.toast.showWithOptions({
            message: "아이디를 입력해 주세요!",
            duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
            position: "bottom",
            addPixelsY: -40  // added a negative value to move it up a bit (default 0)
        });
		return;
	}

}

function fnLoginCancel() {
	var params = [{
        type: "login_cancel"
    }];

    webview.Close(params);
}