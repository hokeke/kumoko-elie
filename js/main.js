
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

    $.fn.loadActivePage = function() {
        $(this).fadeOut(200, function(){
            var targetUrl = $(".nav li.active a").attr("href");
            $(this).load(targetUrl + " .page-body" , function() {
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

    function setViewPage() {
        var viewPage = localStorage.getItem('viewPage') || 'index.html';
        console.log("a.page-load[href='" + viewPage + "']");
        var $li = $("a.page-load[href='" + viewPage + "']").parent("li");
        $li.addClass("active");
        $li.siblings(".active").removeClass("active");
    }

    $(".navbar-collapse li a.navi").click(function(){
        $(".navbar-collapse").collapse('hide');
    });

    $.fn.loadPage = function(url) {
        console.log(url);
        localStorage.setItem('viewPage', url);
        setViewPage();
        $(this).loadActivePage();
    }

    $("a.navbar-brand").click(function(){
        $("#mainContent").loadPage($(this).attr("href"));
    });

    $("a.page-load").parent("li").click(function(){
        if ($(this).hasClass("active")) {
            return false;
        }
        $("#mainContent").loadPage($(this).find("a").attr("href"));
        return false;
    });

    //window.onbeforeunload = function(){
    //    alert("close");
    //    localStorage.setItem('viewPage', 'index.html');
    //}
    $(window).unload(function(){
        console.log("close");
    });

    setViewPage();
    $("#mainContent").loadActivePage();

});
