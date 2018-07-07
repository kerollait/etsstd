/**
 * Ajax Request Pool
 *
 * @author Oliver Nassar <onassar@gmail.com>
 * @see    http://stackoverflow.com/questions/1802936/stop-all-active-ajax-requests-in-jquery
 */
jQuery.xhrPool = [];

/**
 * jQuery.xhrPool.abortAll
 *
 * Retrieves all the outbound requests from the array (since the array is going
 * to be modified as requests are aborted), and then loops over each of them to
 * perform the abortion. Doing so will trigger the ajaxComplete event against
 * the document, which will remove the request from the pool-array.
 *
 * @access public
 * @return void
 */
jQuery.xhrPool.abortAll = function() {
    var requests = [];
    for (var index in this) {
        if (isFinite(index) === true) {
            requests.push(this[index]);
        }
    }
    for (index in requests) {
        requests[index].abort();
    }
};

/**
 * jQuery.xhrPool.remove
 *
 * Loops over the requests, removes it once (and if) found, and then breaks out
 * of the loop (since nothing else to do).
 *
 * @access public
 * @param  Object jqXHR
 * @return void
 */
jQuery.xhrPool.remove = function(jqXHR) {
    for (var index in this) {
        if (this[index] === jqXHR) {
            jQuery.xhrPool.splice(index, 1);
            break;
        }
    }
};

/**
 * Below events are attached to the document rather than defined the ajaxSetup
 * to prevent possibly being overridden elsewhere (presumably by accident).
 */
$(document).ajaxSend(function(event, jqXHR, options) {
    jQuery.xhrPool.push(jqXHR);
});
$(document).ajaxComplete(function(event, jqXHR, options) {
    jQuery.xhrPool.remove(jqXHR);
});