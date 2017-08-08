
$(function() {

    var scriptMap = {
        'comic.html' : [
    'js/jsviews.min.js',
'js/jquery.blockUI.js',
'js/photoswipe.js',
'js/photoswipe-ui-default.js',
'js/comic.js'
    ]
    };

    function loadScript(url) {
        return new Promise(function(resolve) {
            $.getScript(url, function() {
                resolve();
            });
        });
    }

    function loadActivePage(id) {
        $("#" + id).fadeOut(200, function(){
            var targetUrl = $(".nav li.active a").attr("href");
            $("#" + id).load(targetUrl + " .page-body" , function() {
                var loadProcs = [];
                if (scriptMap[targetUrl]) {
                    var proc;
                    scriptMap[targetUrl].forEach(function(url) {
                        proc = proc ? proc.then(loadScript(url)) : loadScript(url);
                    });
                }
                $(this).fadeIn(200);
            });
        });
    }

    $("a.page-load").parent("li").click(function(){
        if ($(this).hasClass("active")) {
            return false;
        }
        $(this).siblings(".active").removeClass("active");
        $(this).addClass("active");
        loadActivePage("mainContent");
        return false;
    });

    loadActivePage("mainContent");

});
