var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        document.addEventListener("backbutton", onBackKeyDown, false);

        etoos.setHeaderTitle('title', '마이룸', 'file:///android_asset/www/app/my_room/index.html');
        etoos.setFooterActiveButton('myroom');

        initCommon();
		initEtoosUI();

		etoos.hideLoading();
    }
};

function onBackKeyDown(e) {
	etoos.exitApp();
    e.preventDefault();
}

app.initialize();