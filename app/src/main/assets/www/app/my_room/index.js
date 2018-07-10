var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        initCommon();
        etoos.setHeaderTitle('title', '마이룸', url_root +'/app/my_room/index.html');
        etoos.setFooterActiveButton('myroom');

		initEtoosUI();
		etoos.hideLoading();
    }
};

app.initialize();