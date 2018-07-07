function fnScrollTop() {
    $('html, body').stop().animate({scrollTop: 0}, 400);
}

function fnHistoryBack() {
    window.history.back(-1);
}

function fnRefresh() {
    document.location.reload();
}