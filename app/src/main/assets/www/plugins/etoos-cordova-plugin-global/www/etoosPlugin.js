cordova.define("etoos-cordova-plugin-global.etoos", function(require, exports, module) {
	/*global cordova, module */
	'use strict';
	module.exports = (function() {
		var showLoading = function() {
			cordova.exec(null, null, 'EtoosPlugin', 'showLoading', []);
		};

		var hideLoading = function() {
			cordova.exec(null, null, 'EtoosPlugin', 'hideLoading', []);
		};

		var setLoginToken = function(token) {
            cordova.exec(function(){}, function(){}, 'EtoosPlugin', 'setLoginToken', [token]);
        };

        var setGrade = function(grade) {
            cordova.exec(function(){}, function(){}, 'EtoosPlugin', 'setGrade', [grade]);
        };

        var setGradeName = function(gradeName) {
            cordova.exec(function(){}, function(){}, 'EtoosPlugin', 'setGradeName', [gradeName]);
        };

		var setHeaderTitle = function(headerType, title, titleLink) {
			cordova.exec(function() {}, function() {}, 'EtoosPlugin', 'setHeaderTitle', [headerType, title, titleLink]);
		};

		var setFooterActiveButton = function(active_button) {
			cordova.exec(function(){}, function(){}, 'EtoosPlugin', 'setFooterActiveButton', [active_button]);
		};

		var exitApp = function() {
			cordova.exec(function() {}, function(){}, 'EtoosPlugin', 'exitApp', []);
		};

		return {
			showLoading: showLoading,
			hideLoading: hideLoading,
			setLoginToken: setLoginToken,
			setGrade: setGrade,
			setGradeName: setGradeName,
			setHeaderTitle: setHeaderTitle,
			setFooterActiveButton: setFooterActiveButton,
			exitApp: exitApp
		};
	})();
});
