var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        document.addEventListener('resume', onResume, false);

        // 로그인 세션 검증
        EtoosData.tokenVerify();

        initCommon();
        etoos.setHeaderTitle('title', '내 강의실', url_root +'/app/my_room/index.html');
        etoos.setFooterActiveButton('myroom');

		initEtoosUI();
		this.initContents();
    },

    initContents: function() {
        etoos.hideLoading();
    }
};

app.initialize();

function onResume() {
    EtoosData.tokenVerify();
}

function onAutoLoginFailCallback() {
	document.location.href = EtoosServiceUrl.home;
}

function fnSwipePullRefresh() {
    EtoosData.tokenVerify();
	app.initContents();
}