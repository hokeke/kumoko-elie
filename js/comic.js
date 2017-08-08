/**
 * @author shota
 */

var currentPage = 0;
var maxPage = 0;
//var baseUrl = "./images/" + location.search.replace("?name=", "") + "/";
var comicName;
var comicEpisode;
var ext;
var imageWidth;
var imageHeight;
var prePage = 1;
var loaded = 0;
var baseUrl;
var $container;
var wait = false;
var title;
var episode;
var mode = "";
var _ua;

$(function() {
	$.fx.interval = 50;

	mode = location.hash;

	_ua = (function(u){
		return {
			Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1) 
				|| u.indexOf("ipad") != -1
				|| (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
				|| (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
				|| u.indexOf("kindle") != -1
				|| u.indexOf("silk") != -1
				|| u.indexOf("playbook") != -1,
			Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
				|| u.indexOf("iphone") != -1
				|| u.indexOf("ipod") != -1
				|| (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
				|| (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
				|| u.indexOf("blackberry") != -1
		}
	})(window.navigator.userAgent.toLowerCase());

	if (_ua.Tablet || _ua.Mobile) { //モバイル端末からのアクセス
		if (mode != "#mobi" && localStorage.getItem("pc_flag") != "true") {
			mode = "#mobi";
			location.href = location.href + "#mobi"
		}
	} else { //モバイル端末以外からのアクセス
		if (mode == "#mobi") {
			location.href = location.href.split("#")[0];
		}
	}

	//$.fn.viewComic = function(url) {
	$.fn.viewComic = function(title, episode) {
		currentPage = 0;
		maxPage = 0;
		comicName = null;
		comicEpisode = null;
		ext = null;
		prePage = 1;
		loaded = 0;
		baseUrl = null;
		$container = null;
		wait = false;

		//$container = $(this);
		$container = $(window);

		//要素のクリア
		$(this).html("");
		$(this).remove("div.mangaView");
		baseUrl = "./images/comic/" + title + "/" + episode + "/";
		//if (url.lastIndexOf("/") !== url.length - 1) {
		//	baseUrl = url + "/";
		//} else {
		//	baseUrl = url;
		//}

		//comicName = baseUrl.substring(baseUrl.lastIndexOf("/",baseUrl.length-2)+1, baseUrl.lastIndexOf("/"));
		comicName = title;
		comicEpisode = episode;

		// エレメントの配置
		$(this).css({
			position : "relative"
		});

		//[hidden]最終ページフラグ
		$("<input>").attr({
			type: "hidden",
			id: "isLast",
			value: "false"
		}).appendTo($("body"));

		var $mangaView = $("<div>").appendTo($(this)).addClass("mangaView")
		if (mode == "#mobi") {
			$mangaView.css({
					position : "absolute",
					top : "0px",
					height : "100%",
					width : "100%"
				});

		} else {
			$mangaView.css({
					//position : "absolute", //TODO
					position : "relative",
					top : "0px",
					height : "100%",
					width : "1024px"
				});
			fixMangaView();
		}

		if (title === undefined || episode === undefined) {
			if (mode != "#mobi") {
				$mangaView.append("<span>作品が選択されていません。</span>");
			}
			$.unblockUI();
			return;
		}

		getMaxPage();
	
		if (maxPage == 0) {
			$mangaView.append("<span>データがありません</span>");
			$.unblockUI();
			return;
		}

		//$("title").text($("span#title_" + title).text() + "－" + parseInt(episode) + "話");

		// mangaView
		if (mode == "#mobi") {
			$mangaView.css({
					position : "absolute",
					top : "0px",
					height : "100%",
					width : "100%"
				});

			var dummy = {dummy : "dummy"};
			$.observable(dummy).setProperty("dummy", dummy);
			var template = $.templates("#tmplSlide");
			template.link("div.mangaView", dummy);

			var openPhotoSwipe = function() {
				var pswpElement = document.querySelectorAll('.pswp')[0];

				// build items array
				var items = [];
				while (prePage <= maxPage) {
					items.push({
						src : baseUrl + (maxPage - (prePage++) + 1) + ext,
						w : Math.max(imageWidth, 800),
						h : Math.max(imageHeight, 1116)
					});
				}

				// define options (if needed)
				var options = {
					// history & focus options are disabled on CodePen        
					index: maxPage - 1,
					history: false,
					focus: false,
					loop: false,
					arrowKeys: false,
					showAnimationDuration: 0,
					hideAnimationDuration: 0
				};

				var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
				gallery.init();
			};
			$.unblockUI();
			openPhotoSwipe();
			return;
		} else {
			$mangaView.css({
					//position : "absolute", //TODO
					position : "relative",
					top : "0px",
					height : "100%",
					width : "1024px",
                    margin : "0px auto",
				});
		}


		// pageLeft
		var $pageLeft = $("<div>").appendTo($mangaView).addClass("pageLeft")
		.css({
			width : "50%",
			height : "100%",
			//position : "absolute",
			position : "relative", //TODO
			top : "0px",
			left : "0px",
			backgroundSize : "100%",
			backgroundRepeat : "no-repeat"
            ,"float" : "left"
		});

		// left1
		$("<div>").addClass("left1")
		.css({
			borderStyle: "solid",
			borderWidth: "1px 0px 1px 1px",
			width: "100%",
			backgroundSize: "100% 100%",
			backgroundRepeat: "no-repeat",
			margin: "0px",
			height: "100%",
			zIndex: "2",
			position: "absolute"
		}).appendTo($pageLeft);
		// left2
		$("<div>").addClass("left2")
		.css({
			borderStyle: "solid",
			borderWidth: "1px 0px 1px 1px",
			width: "100%",
			backgroundSize: "100% 100%",
			backgroundRepeat: "no-repeat",
			margin: "0px",
			height: "100%",
			zIndex: "0",
			position: "absolute"
		}).appendTo($pageLeft);
		// toNext
		$toNext = $("<div>").attr("id", "toNext")
		.css({
			width: "100px",
			height: "100%",
			position: "absolute",
			top: "0px",
			left: "0px",
			opacity: "0",
			zIndex: "3"
		}).appendTo($pageLeft);
		$("<img>").attr({
			src: "./images/next.png",
			alt: "Next"
		}).appendTo(
				$("<div>").appendTo($toNext)
				.css({
					width: "36px",
					height: "36px",
					position: "absolute",
					top: "50%",
					left: "10px",
					marginTop: "-18"
				})
		);
		// pageRight
		var $pageRight = $("<div>").addClass("pageRight")
		.css({
			width: "50%",
			height: "100%",
			//position: "absolute",
			position: "relative", //TODO
			top: "0px",
			right: "0px",
			backgroundSize: "100%",
			backgroundRepeat: "no-repeat",
            "float" : "right",
		}).appendTo($mangaView);
		// right1
		$("<div>").addClass("right1")
		.css({
			borderStyle: "solid",
			borderWidth: "1px 1px 1px 1px",
			width: "100%",
			backgroundSize: "100% 100%",
			backgroundRepeat: "no-repeat",
			margin: "0px",
			height: "100%",
			zIndex: "2",
			position: "absolute"
		}).appendTo($pageRight);
		// right2
		$("<div>").addClass("right2")
		.css({
			borderStyle: "solid",
			borderWidth: "1px 1px 1px 1px",
			width: "100%",
			backgroundSize: "100% 100%",
			backgroundRepeat: "no-repeat",
			margin: "0px",
			height: "100%",
			zIndex: "0",
			position: "absolute"
		}).appendTo($pageRight);
		// toPrev
		$toPrev = $("<div>").attr("id", "toPrev")
		.css({
			width: "100px",
			height: "100%",
			position: "absolute",
			top: "0px",
			right: "0px",
			opacity: "0",
			zIndex: "3"
		}).appendTo($pageRight);
		$("<img>").attr({
			src: "./images/prev.png",
			alt: "Prev"
		}).appendTo(
				$("<div>").appendTo($toPrev)
				.css({
					width: "36px",
					height: "36px",
					position: "absolute",
					top: "50%",
					right: "10px",
					marginTop: "-18"
				})
		);

		// mangaControl
		$("<div>").addClass("controlGroup").attr("id", "mangaControll").appendTo($mangaView);
		// mangaControlInner
		$table = $("<table>").attr("id", "controll")
		.css({
			marginLeft: "auto",
			marginRight: "auto",
			textAlign: "left",
			width: "250px",
			textAlign: "center",
			backgroundColor: "#A9BCF5"
		})
		.appendTo(
				$("<div>").addClass("controlGroup").attr("id", "mangaControllInner")
				.css({
					width: "100%",
					height: "60px",
					position: "absolute",
					left: "0px",
					bottom: "0px",
					opacity: "0",
					textAlign: "center",
					zIndex: "4"
				})
				.appendTo($mangaView)
		);
		$td1 = $("<td>").appendTo
		(
				$("<tr>").appendTo($table)
		);
		//最終ページへ
		$("<input>").attr({
			type: "button",
			id: "toLast",
			value: "<<"
		}).appendTo($td1);
		//次ページへ
		$("<input>").attr({
			type: "button",
			id: "toNext",
			value: "<"
		}).appendTo($td1);
		//現在ページ
		$("<span>").attr("id", "currentPage")
		.css({

		}).appendTo($td1);
		//slash
		$("<span>").text("/")
		.css({

		}).appendTo($td1);
		//最大ページ
		$("<span>").attr("id", "maxPage")
		.css({

		}).appendTo($td1);
		//前ページへ
		$("<input>").attr({
			type: "button",
			id: "toPrev",
			value: ">"
		}).appendTo($td1);
		//最初のページへ
		$("<input>").attr({
			type: "button",
			id: "toFirst",
			value: ">>"
		}).appendTo($td1);


		$td2 = $("<td>").appendTo
		(
				$("<tr>").appendTo($table)
		);
		//ページ指定
		$("<span>").text("ページ指定")
		.css({

		}).appendTo($td2);
		//ページ入力
		$("<input>").attr({
			type: "text",
			id: "gotoPage",
			value: ""
		}).css({
			width: "25px"
		}).appendTo($td2);
		//ジャンプ
		$("<input>").attr({
			type: "button",
			id: "jump",
			value: "ジャンプ"
		}).appendTo($td2);

		initListeners();


//		alert($(this).html());
	}

	$.fn.viewSideMenu = function() {
		//$(this).show();
		var data = {"comics" : []};

		$.ajax({
			url : "./php/sideMenu.php",
			type : "GET",
			dataType : "json",
			cache : false,
			async : false,
			success : function(result, dataType) { 
				data = result;
			},
			error : function(req, textStatus, errorThrown) {
			}
		});

        try {
            $.observable(data).setProperty("comics", data.comics);
            var template = $.templates("#tmpl");
            template.link("#sideMenu", data);
        } catch (e) {
            console.log(e.message);
        }

		if (mode == "#mobi") {
			$("#toggle").css("display", "none");
			$("#sideMenu").css({
				height: "100%",
				width: "100%",
				background: "linear-gradient(-90deg,  #CACCC9, #F2F5F0, #F2F5F0, #CACCC9)",
				opacity: 1 
			});
			$("#sideMenu .font1").css({
				fontSize: 50
			});
			$("#sideMenu .font2").css({
				fontSize: 40
			});
			$("#sideMenu .font3").css({
				fontSize: 30
			});
			$("#sideMenu li").css({
				width: "100px"
			});

			$("#spLinkBlockInPc").hide();
			//$.switchPc2Sp({
			//	mode : "sp" ,
			//	anchorToPcInSp : "#anchorToPcInSp"
			//});
		} else {
			$("#sideMenu .font2").css({
				fontSize: 14 
			});
			$("#sideMenu .font3").css({
				fontSize: 12
			});

			$("#pcLinkBlockInSp").hide();
			if (!_ua.Tablet && !_ua.Mobile) {
				$("#spLinkBlockInPc").hide();
			}
			//$.switchPc2Sp({
			//	mode : "pc" ,
			//	spLinkBlockInPc : "#spLinkBlockInPc" ,
			//	anchorToPcInSp : "#anchorToPcInSp"
			//});
		}

		$("img#toggle").attr({
			src : "./images/btn_hide.png",
			alt : "メニューを隠す"
		})
		.click(function(){
			toggleSideMenu();
		});

		$("#anchorToSpInPc").click(function(){
			localStorage.setItem("pc_flag", "false");
			localStorage.setItem("sp_flag", "true");
			location.href = this.href;
			mode = location.hash;
			$("div#sideMenu").show().viewSideMenu();
			$("div#main").show().viewComic();
		});

		$("#anchorToPcInSp").click(function(){
			localStorage.setItem("pc_flag", "true");
			localStorage.setItem("sp_flag", "false");
		});

		$("#sideMenu a.episode").click(
				function() {
                    //var $container = $("#main");
                    var $container = $(window);
					var params = $(this).attr("href").replace("?","").split("&");
					if (params != "") {
						for (var i = 0; i < params.length; i++) {
							var param = params[i].split("=");
							if (param != "" && param.length == 2) {
								if (param[0] == "title") {
									title = param[1];
								} else if (param[0] == "episode") {
									episode = param[1];
								}
							}
						}
					}

					//TODO
					//$("#sideMenu div#comicOut").animate(
					//		{"opacity" : "0"},
					//		{duration : 100,
					//		 complete : function() {
					//			$("#sideMenu").animate(
					//					{"width" : "15px"},
					//					{duration : 100,
					//					 complete : function() {
					//						 $.blockUI({message:"<h1>読み込み中...</h1>"});
					//						 $("#main").show().viewComic(title, episode);
					//						 loadPage();
					//					 }
					//					}
					//					);
					//		}}
					//		);
					//toggleSideMenu({
					//	cbFnc : function(){
							$.blockUI({message:"<h1>読み込み中...</h1>"});
							$("#main").viewComic(title, episode);
							loadPage();
					//	}
					//});

					//$("#sideMenu").hover(
					//		function(){
					//			toggleSideMenu({
					//				type : 2
					//			});
					//		},
					//		function(){
					//			toggleSideMenu({
					//				type : 1
					//			})
					//		}
					//		);
					
					/*
					$.ajax({
						url : $(this).attr("href"),
						type : "GET",
						dataType : "html",
						cache : false,
						async : true,
						success : function(result, dataType) { 
							$("#main").html(result.html);
						},
						error : function(req, textStatus, errorThrown) {
							$("#main").html("データの取得エラー");
						}
					});
					*/
					//$("#main").show().viewComic(title, episode);

                    //$("#modalButton").click(); //TODO
                    $("#comicModal").modal('toggle');

					return false;
				}
			);
	}

	$(window).keydown(function(e){
			if (e.keyCode == 39) {
				//右
				toNextPage();
			} else if (e.keyCode == 37) {
				//左
				toPrevPage();
			} else if (e.keyCode == 38) {
				//上
				toFirstPage();
			} else if (e.keyCode == 40) {
				//下
				toLastPage();
			}
  });


  //$.blockUI({message:"<h1>読み込み中...</h1>"});
	$("div#sideMenu").show().viewSideMenu();
	$("div#main").show().viewComic();
	//loadPage();

});

function toggleSideMenu(param) {
	var hideWidth = 20;
	var showWidth = 200;
	var moveType = 0;

	if (param === undefined) {
		param = {};
	}

	if (param.cbFnc === undefined) {
		param.cbFnc = function(){};
	}
	if (param.type === undefined) {
		if ($("#sideMenu").width() == showWidth) {
			moveType = 1;
		} else {
			moveType = 2;
		}
	} else {
		moveType = param.type;
	}

	$("#sideMenu").stop();
	if (moveType == 1) {
		//Hide
		$("#sideMenu div#comicOut").animate(
				{"display" : "none"},
				{duration : 100,
					complete : function() {
						$("#sideMenu div#comicOut, #spLinkBlockInPc").hide();
						$("#sideMenu").animate(
								{"width" : hideWidth + "px"},
								{duration : 100,
								 complete : function(){
								 	param.cbFnc();
									fixMangaView();
								 }
								}
								);
					}}
				);
		$("img#toggle").attr({
			src : "./images/btn_show.png",
			alt : "メニューを表示"
		});
	} else {
		//Show
		$("#sideMenu").animate(
				{"width" : showWidth + "px"},
				{duration : 100,
					complete : function() {
						$("#sideMenu div#comicOut").show();
						if (_ua.Tablet || _ua.Mobile) {
							$("#spLinkBlockInPc").show();
						}
						$("#sideMenu div#comicOut").animate(
								{"display" : "block"},
								{duration : 100,
								 complete : function(){
								 	param.cbFnc();
									fixMangaView();
								 }
								}
								);
					}}
				);
		$("img#toggle").attr({
			src : "./images/btn_hide.png",
			alt : "メニューを隠す"
		});
	}
}

function lockAction() {
	wait = !wait;
	if (wait) {
		setTimeout(lockAction, 600);
	}
}

function loadPage() {
	/*
	var name =location.search; 
	var title = null;
	var episode = null;
  */
	/*
	var name =location.search; 
	var params = name.replace("?","").split("&");
	if (params != "") {
			for (var i = 0; i < params.length; i++) {
					var param = params[i].split("=");
					if (param != "" && param.length == 2) {
							if (param[0] == "title") {
									title = param[1];
							} else if (param[0] == "episode") {
									episode = param[1];
							}
					}
			}
	}
	*/

			//if (title != null && episode != null) {
			//	  $("div#sideMenu").viewSideMenu();
			//	  $("title").text($("span#title_" + title).text() + "－" + parseInt(episode) + "話");
			//		$.blockUI({message:"<h1>読み込み中...</h1>"});
			//		var url = "./images/comic/" + title + "/" + episode;
			//		$("div#main").show().viewComic(title, episode);
			//} else {
					//$("#main").show().html("<span>データがありません</span>");
		//			$("div#sideMenu").show().viewSideMenu();
		//			$("div#main").show().viewComic();
					//$("#main").show().html("<span>作品が選択されていません。</span>");
					//$.unblockUI();
			//}
			/*
	} else {
			$.unblockUI();
			$("div#sideMenu").show().viewSideMenu();
			$("#main").show().html("<span>作品が選択されていません。</span>");
	}
	*/


	/*
	var start = name.indexOf("name=");
	var end = (start < 0) ? -1 : ( (end = name.indexOf("&",start)) < 0 ) ? name.length : end;
	if (start > 0) {
		name = name.substring(start,end).replace("name=","");
		alert(name);
		if (name.indexOf("#") > 0 ) {
		    var title = name.substring(0, name.indexOf("#"));
		    var episode = name.substring(name.indexOf("#")+1)
		    		var url = "./images/comic/" + title + "/" + episode;
		    $("div#main").viewComic(url);
		} else {
		    $("body").html("<span>データがありません</span>");
		}
	} else {
		$("body").html("<span>データがありません</span>");
	}
	*/

	preload();
}

function initListeners() {
	fixMangaView();

	//getMaxPage();

	$("div#toNext").css({
		opacity: 0
	})
	.hover(
		function(){
			if (!isLastPage()) {
				$(this).css("cursor", "pointer")
				.animate(
						{opacity: 1},
						{duration: 200}
				);
			}
		},
		function(){
			$(this).css("cursor", "")
			.animate(
					{opacity: 0},
					{duration: 200}
			);
		}
	);
	$("div#toNext, input#toNext").click(function(){
		toNextPage();
	});

	$("div#toPrev").css({
		opacity: 0
	})
	.hover(
		function(){
			if (currentPage > 2) {
				$(this).css("cursor", "pointer")
				.animate(
						{opacity: 1},
						{duration: 200}
				);
			}
		},
		function(){
			$(this).css("cursor", "")
			.animate(
					{opacity: 0},
					{duration: 200}
			);
		}
	);
	$("div#toPrev, input#toPrev").click(function(){
		toPrevPage();
	});

	$("#toLast").click(function(){
		toLastPage();
	});

	$("#toFirst").click(function(){
		toFirstPage();
	});

	$("#jump").click(function(){
		goToPage($("#gotoPage").val());
	});

	$(window).resize(function(){
		fixMangaView();
	});

	$("div.controlGroup").hover(function(){
		$(this).animate({opacity: 1},{duration: 200});
		$("div#mangaControll").animate({opacity: 0.7},{duration: 200});
	},function(){
		$("div.controlGroup").animate({opacity: 0},{duration: 200});
		//$("div#mangaControll").animate({opacity: 0},{duration: 200});
	});

	if (existsNextPage()) {
		$("div.right1").css({
			backgroundImage: "url("+ baseUrl + (currentPage + 1) + ext + ")"
		});
		currentPage++;

		if (existsNextPage()) {
			$("div.left1").css({
				backgroundImage: "url("+ baseUrl + (currentPage + 1) + ext + ")"
			});
			currentPage++;
		}
	}

	$("#maxPage").text(maxPage);
	setDisplayCurrentPage();
}

function toNextPage() {
	if (currentPage < maxPage) {
		goToPage(currentPage + 1);
	}
}

function toPrevPage() {
	if (currentPage > 2) {
		if (currentPage % 2 == 0) {
			goToPage(currentPage - 2);
		} else {
			goToPage(currentPage - 1);
		}
	}
}

function toLastPage() {
	goToPage(maxPage);
}

function toFirstPage() {
	goToPage(1);
}

function goToPage(page) {

	if (wait) {
		return;
	}
	lockAction();

	page = parseInt(page);
	var isLeft = page % 2 == 0;
	var p = 0;

	if (page > currentPage) {
		//現在ページより後の場合
		if (page <= maxPage) {
			if (isLeft) {
				p = page - 1;
			} else {
				p = page;
			}
			$("div.right2").css({
				backgroundImage: "url("+ baseUrl + (p) + ext + ")"
			});
			if (p == maxPage) {
				$("div.left2").css({
					backgroundImage: "none",
					backgroundColor: "#FFFFFF"
				});
			}
//			currentPage++;

			if (isLeft || page < maxPage) {
				if (isLeft) {
					p = page;
				} else {
					p = page + 1;
				}
				$("div.left2").css({
					backgroundImage: "url("+ baseUrl + (p) + ext + ")"
				});
//				currentPage++;
			}
			if (isLeft) {
				currentPage = page;
			} else {
				currentPage = page + 1;
			}

			var $left1 = $("div.left1");
			var $left2 = $("div.left2");
			var $right1 = $("div.right1");
			var $right2 = $("div.right2");

			$left1.css({left: "", right: "0px"})
			.animate({width: "0px"},{duration: 200, complete: function(){
				$left1.removeClass("left1").addClass("left2")
				.css({
					zIndex: "0"
				});


				$left2.removeClass("left2").addClass("left1")
				.css({
					zIndex: "2"
				});

				$left1.css("width", "100%");

				$right2.css({left: "0px", right: "", width: "0px"});

				$right1.removeClass("right1").addClass("right2")
				.css({
					zIndex: "0"
				});

				$right2.removeClass("right2").addClass("right1")
				.css({
					zIndex: "2"
				})
				.animate({width: "100%"},{duration: 200, complete: function(){
//					$left1.css({backgroundSize: "contain"});
//					$right1.css({backgroundSize: "contain"});
//					$left2.css({backgroundSize: "contain"});
//					$right2.css({backgroundSize: "contain"});
				}});
			}});
		}

		if (isLastPage()) {
			$("div#toNext").css({opacity: 0, cursor: ""});
		}

		setDisplayCurrentPage();

	} else if ((currentPage % 2 == 0 && page < currentPage - 1) || (currentPage % 2 != 0 && page < currentPage)) {
		//現在ページより前の場合
		if (page > 0) {
			if (isLeft) {
				p = page;
			} else {
				p = page + 1;
			}
			$("div.left2").css({
				backgroundImage: "url("+ baseUrl + (p) + ext + ")"
			});
//			currentPage--;

			if (isLeft) {
				p = page - 1;
			} else {
				p = page;
			}
			$("div.right2").css({
				backgroundImage: "url("+ baseUrl + (p) + ext + ")"
			});

			if (isLeft) {
				currentPage = page;
			} else {
				currentPage = page + 1;
			}

			var $left1 = $("div.left1");
			var $left2 = $("div.left2");
			var $right1 = $("div.right1");
			var $right2 = $("div.right2");

			$right1.css({left: "0px", right: ""})
			.animate({width: "0px"},{duration: 200, complete: function(){
				$right1.removeClass("right1").addClass("right2")
				.css({
					zIndex: "0"
				});

				$right2.removeClass("right2").addClass("right1")
				.css({
					zIndex: "2"
				});

				$right1.css("width", "100%");

				$left2.css({left: "", right: "0px", width: "0px"});

				$left1.removeClass("left1").addClass("left2")
				.css({
					zIndex: "0"
				});

				$left2.removeClass("left2").addClass("left1")
				.css({
					zIndex: "2"
				})
				.animate({width: "100%"},{duration: 200, complete: function(){
//					$left1.css({backgroundSize: "contain"});
//					$right1.css({backgroundSize: "contain"});
//					$left2.css({backgroundSize: "contain"});
//					$right2.css({backgroundSize: "contain"});
				}});
			}});
		}

		if (currentPage <= 2) {
			$("div#toPrev").css({opacity: 0, cursor: ""});
		}

		setDisplayCurrentPage();
	}

}

function setDisplayCurrentPage() {
	var len = maxPage.toString().length;
	if (currentPage != 0 && currentPage % 2 == 0) {
		if (currentPage > maxPage) {
			$("#currentPage").text(lpad((currentPage-1), "0", len) + " - " + lpad((currentPage-1), "0", len));
		} else {
			$("#currentPage").text(lpad((currentPage-1), "0", len) + " - " + lpad(currentPage, "0", len));
		}
	} else {
		$("#currentPage").text(lpad(currentPage, " ", len));
	}
}

function fixMangaView() {
    try {
    var $container = $(window);
	var $view = $("div.mangaView");
    var $modal = $("#comicModal");
	var menuWidth = $("#sideMenu").width() + 10;
	var ratio = 0.715;
	var height = $container.height();
	var width = Math.floor(height * ratio * 2);
	//if (width > $container.width()) {
	//if (width > ($container.width() - menuWidth)) {
	//	width = $container.width() - menuWidth;
	//	height = width / (ratio * 2);
	//}
	if (width > ($container.width())) {
		width = $container.width();
		height = Math.floor(width / (ratio * 2));
	}
	width -= 2;
	height -= 2;

    width = width * 0.95;
    height = height * 0.95;

    //$modal.css({
    //    "minWidth" : width,
    //    "minHeight" : height,
    //});
    //$(".modal-dialog").css({
    //    "width" : Math.floor(width * 0.90) + 30,
    //    "height" : Math.floor(height * 0.90),
    //});
    $("#comicModal .modal-content").css({
        "width" : width,
        "height" : height,
    });
    $("#comicModal .modal-dialog").css({
        "maxWidth" : width,
        "maxHeight" : height,
    });
	$view.width(Math.floor(width * 0.95));
	$view.height(Math.floor(height * 0.95));
    //$("#comicModal .modal-content").css({
    //    "width" : $view.width() * 1.05,
    //    "height" : $view.height() * 1.05,
    //});

    console.log("width: " + width);
    console.log("height: " + height);
    console.log("modal: " + $(".modal-content").width());
	//$view.css({left: "50%", marginLeft: "-" + (width/2) + "px"});
	//$view.css({left: menuWidth + "px"});
    } catch (e) {
        console.log(e.message);
    }
}

function isLastPage() {
//	return $("#isLast").val() == "true";
	return (currentPage >= maxPage);
}

function setLastPage(last) {
	$("#isLast").val(last);
}

function preload() {
	//alert(baseUrl + (++page) + "." + ext);
	//$("#imagePreload").attr("src", baseUrl + (page++) + "." + ext);
	//while (page <= maxPage) {
	while (prePage <= maxPage) {
		$("<img>").attr("src", baseUrl + (prePage++) + ext)
			.load(function(){
					loaded++;
					if (loaded >= Math.min(8,maxPage)) {
						$.unblockUI();
					}
		});
	}
		//$.ajax({
		//	url: baseUrl + (page++) + "." + ext,
		//	cache: true,
		//	async: true,
		//	success: function() {  },
		//	error: function(req, textStatus, e){  }
		//});
	//}
}

function getMaxPage() {
	$.ajax({
		url : "./php/comic.php",
		type : "GET",
		data : {"title" : comicName,
			    "episode" : comicEpisode},
		dataType : "json",
		cache : false,
		async : false,
		success : function(result, dataType) { 
				maxPage = result.maxPages;
				ext = "." + result.ext;
				imageWidth = result.width;
				imageHeight = result.height;
		},
		error : function(req, textStatus, errorThrown) {
				maxPage = 0;
		}
  });
	if (maxPage > 2) {
		setLastPage(false);
	}
}

function existsNextPage() {

//	setLastPage(false);
//
//	$.ajax({
//		url: baseUrl + (currentPage + 1) + ".jpg",
//		cache: true,
//		async: false,
//		error: function(){ setLastPage(true); },
//	});
//
//	return !isLastPage();

	return (currentPage < maxPage);
}

function existsPrevPage() {

//	setLastPage(false);
//
//	$.ajax({
//		url: baseUrl + (currentPage - 1) + ".jpg",
//		cache: true,
//		async: false,
//		error: function(){ setLastPage(true); }
//	});
//
//	return !isLastPage();

	return (currentPage > 1);
}

function lpad(val, ch, len) {
	val = val.toString();
	while (val.length < len) {
		val = ch + val;
	}
	return val;
};

$(window).load(function(){
	//$.unblockUI();
});
