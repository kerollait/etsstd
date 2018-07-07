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

		var getLoginTokenAndGrade = function() {
			cordova.exec(setLoginTokenAndGrade, function(){}, 'EtoosPlugin', 'getLoginTokenAndGrade', []);
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
			getLoginTokenAndGrade: getLoginTokenAndGrade,
			setHeaderTitle: setHeaderTitle,
			setFooterActiveButton: setFooterActiveButton,
			exitApp: exitApp
		};
	})();
});
