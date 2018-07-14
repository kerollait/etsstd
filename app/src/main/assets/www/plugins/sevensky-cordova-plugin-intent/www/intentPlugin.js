cordova.define("sevensky-cordova-plugin-intent.intentPlugin", function(require, exports, module) {
var exec = require('cordova/exec');

function IntentPlugin() {

}

IntentPlugin.prototype.startActivity = function (packageName,activitiName,bundle) {
	if (bundle == null || typeof bundle === 'undefined' || bundle == "") {
        bundle = {
            mode: "startActivity"
        }
    }

    exec(function (res) { }, function (err) { }, "IntentPlugin", "startActivity", [packageName, activitiName, JSON.stringify(bundle)]);
}

IntentPlugin.prototype.startActivityForResult = function (packageName,activitiName,bundle,requestCode,callback) {
	if (bundle == null || typeof bundle === 'undefined' || bundle == "") {
        bundle = {
            mode: "startActivityForResult"
        }
    }

    exec(callback, function (err) { }, "IntentPlugin", "startActivityForResult", [packageName, activitiName, JSON.stringify(bundle), requestCode]);
}

IntentPlugin.prototype.finishActivity = function (packageName, activitiName, bundle) {
	if (bundle == null || typeof bundle === 'undefined' || bundle == "") {
        bundle = {
            mode: "startActivityForResult"
        }
    }

    exec(function (res) { }, function (err) { }, "IntentPlugin", "finishActivity", [packageName, activitiName, JSON.stringify(bundle)]);
}

IntentPlugin.prototype.finishActivityForResult = function (packageName, activitiName, bundle, resultCodeType) {
	if (bundle == null || typeof bundle === 'undefined' || bundle == "") {
        bundle = {
            mode: "startActivityForResult"
        }
    }

    exec(function (res) { }, function (err) { }, "IntentPlugin", "finishActivityForResult", [packageName, activitiName, JSON.stringify(bundle), resultCodeType]);
}

module.exports = new IntentPlugin();
});
