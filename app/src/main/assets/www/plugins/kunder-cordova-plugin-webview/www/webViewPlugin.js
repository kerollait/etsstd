cordova.define("kunder-cordova-plugin-webview.webview", function(require, exports, module) {
/*global cordova, module */
'use strict';
module.exports = (function() {


	var _show = function(url, title, loading, successCallback, errorCallback) {
		if (loading == null || typeof loading == 'undefined') {
			loading = true;
		}

        cordova.exec(successCallback, errorCallback, 'WebViewPlugin', 'show', [url, loading, title]);
    };

    var _showFromLeft = function(url, title, loading, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, 'WebViewPlugin', 'showFromLeft', [url, loading, title]);
    };

    var _hide = function(params, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, 'WebViewPlugin', 'hide', params ? params : []);
    };

    var _hideToLeft = function(params, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, 'WebViewPlugin', 'hideToLeft', params ? params : []);
    };

    var _hideLoading = function(successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, 'WebViewPlugin', 'hideLoading', []);
    };

    var _subscribeCallback = function(successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, 'WebViewPlugin', 'subscribeCallback', []);
    };

    var _subscribeExitCallback = function(successCallback, errorCallback) {
		cordova.exec(successCallback, errorCallback, 'WebViewPlugin', 'subscribeExitCallback', []);
    };

    var _exitApp = function() {
        cordova.exec(function(){},function(){}, 'WebViewPlugin', 'exitApp', []);
    };

    var _setWebViewBehavior = function() {
        cordova.exec(function(){},function(){}, 'WebViewPlugin', 'webViewAdjustmenBehavior', []);
    };

    return {
        Show: _show,
        ShowFromLeft: _showFromLeft,
        Hide: _hide,
        HideToLeft: _hideToLeft,
        Close: _hide,
        CloseToLeft: _hideToLeft,
        SubscribeCallback: _subscribeCallback,
        SubscribeExitCallback: _subscribeExitCallback,
        ExitApp: _exitApp,
        HideLoading: _hideLoading,
        SetWebViewBehavior: _setWebViewBehavior
    };
})();

});
