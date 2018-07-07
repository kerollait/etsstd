var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        initCommon();
        initEtoosUI();
    }
};

app.initialize();

function fnGnbClose() {
	var params = [{
		type: "gnb_close"
	}];

	webview.Close(params);
}