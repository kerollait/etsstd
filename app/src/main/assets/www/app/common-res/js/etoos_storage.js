function EtoosStorage() {
	"use strict"

	var context = this;

	function storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
    }

    context.getItem = function(key, def_value) {
        if (storageAvailable('localStorage')) {
            var value = window.localStorage.getItem(key);
            if (value == null || typeof value === 'undefined' || value == "") {
                if (def_value != null && typeof def_value !== 'undefined') {
                    return def_value;
                }

                return null;
            } else {
                return value;
            }
        } else {
            return def_value;
        }
    }

    context.setItem = function(key, value) {
        if (storageAvailable('localStorage')) {
            window.localStorage.setItem(key, value);
        }
    }

    context.removeItem = function(key) {
        if (storageAvailable('localStorage')) {
            window.localStorage.removeItem(key);
        }
    }
}